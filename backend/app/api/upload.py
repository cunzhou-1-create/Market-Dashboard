from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
import os
import uuid
from datetime import datetime
from app.database import get_db
from app.api.auth import get_current_user
from app.models.user import User

router = APIRouter()

# 允许的图片文件类型
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp"}

# 检查文件类型是否允许
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# 生成唯一文件名
def generate_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_id = uuid.uuid4().hex
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{timestamp}_{unique_id}.{ext}"


# 上传图片
@router.post("/image")
def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """上传图片文件
    
    - **file**: 要上传的图片文件
    - 支持的格式: jpg, jpeg, png, gif, webp
    - 返回上传成功的图片URL
    """
    # 检查文件类型
    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail="只允许上传图片文件 (jpg, jpeg, png, gif, webp)"
        )
    
    # 检查文件大小 (限制为5MB)
    contents = file.file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="文件大小不能超过5MB"
        )
    
    # 重置文件指针
    file.file.seek(0)
    
    # 生成唯一文件名
    unique_filename = generate_unique_filename(file.filename)
    
    # 确保上传目录存在
    upload_dir = os.path.join("uploads", "images")
    os.makedirs(upload_dir, exist_ok=True)
    
    # 保存文件
    file_path = os.path.join(upload_dir, unique_filename)
    with open(file_path, "wb") as buffer:
        buffer.write(contents)
    
    # 生成文件URL
    file_url = f"/uploads/images/{unique_filename}"
    
    return {
        "success": True,
        "filename": unique_filename,
        "url": file_url,
        "size": len(contents),
        "message": "图片上传成功"
    }


# 获取上传的图片列表
@router.get("/images")
def get_uploaded_images(
    current_user: User = Depends(get_current_user)
):
    """获取用户上传的图片列表
    
    返回用户上传的所有图片信息
    """
    # 读取上传目录中的文件
    upload_dir = os.path.join("uploads", "images")
    if not os.path.exists(upload_dir):
        return {"images": []}
    
    # 获取文件列表
    files = []
    for filename in os.listdir(upload_dir):
        file_path = os.path.join(upload_dir, filename)
        if os.path.isfile(file_path):
            files.append({
                "filename": filename,
                "url": f"/uploads/images/{filename}",
                "size": os.path.getsize(file_path),
                "created_at": datetime.fromtimestamp(os.path.getctime(file_path))
            })
    
    # 按创建时间倒序排序
    files.sort(key=lambda x: x["created_at"], reverse=True)
    
    return {
        "total": len(files),
        "images": files
    }


# 删除上传的图片
@router.delete("/image/{filename}")
def delete_image(
    filename: str,
    current_user: User = Depends(get_current_user)
):
    """删除上传的图片
    
    - **filename**: 要删除的图片文件名
    """
    # 构建文件路径
    file_path = os.path.join("uploads", "images", filename)
    
    # 检查文件是否存在
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="图片文件不存在"
        )
    
    # 删除文件
    try:
        os.remove(file_path)
        return {
            "success": True,
            "message": "图片删除成功"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"删除图片失败: {str(e)}"
        )
