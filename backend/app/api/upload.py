from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import os
from app.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.utils.file_upload import save_uploaded_file, get_files_in_directory, delete_file

router = APIRouter()


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
    # 使用文件上传工具保存文件
    file_url, unique_filename, file_size = save_uploaded_file(file)
    
    return {
        "success": True,
        "filename": unique_filename,
        "url": file_url,
        "size": file_size,
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
    # 使用文件上传工具获取文件列表
    files = get_files_in_directory("uploads/images")
    
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
    
    # 使用文件上传工具删除文件
    delete_file(file_path)
    
    return {
        "success": True,
        "message": "图片删除成功"
    }
