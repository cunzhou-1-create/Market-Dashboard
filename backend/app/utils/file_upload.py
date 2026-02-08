import os
import uuid
from datetime import datetime
from fastapi import UploadFile, HTTPException

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

# 保存上传的文件
def save_uploaded_file(file: UploadFile, upload_dir: str = "uploads/images"):
    """保存上传的文件到指定目录
    
    Args:
        file: 上传的文件对象
        upload_dir: 上传目录，默认为 "uploads/images"
        
    Returns:
        文件保存后的相对URL路径
        
    Raises:
        HTTPException: 文件类型不允许或文件过大
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
    os.makedirs(upload_dir, exist_ok=True)
    
    # 保存文件
    file_path = os.path.join(upload_dir, unique_filename)
    with open(file_path, "wb") as buffer:
        buffer.write(contents)
    
    # 生成文件URL
    file_url = f"/uploads/images/{unique_filename}"
    
    return file_url, unique_filename, len(contents)

# 删除文件
def delete_file(file_path: str):
    """删除指定路径的文件
    
    Args:
        file_path: 文件路径
        
    Returns:
        bool: 删除是否成功
        
    Raises:
        Exception: 删除文件时发生错误
    """
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="文件不存在"
        )
    
    try:
        os.remove(file_path)
        return True
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"删除文件失败: {str(e)}"
        )

# 获取目录中的文件列表
def get_files_in_directory(directory: str):
    """获取目录中的文件列表
    
    Args:
        directory: 目录路径
        
    Returns:
        list: 文件信息列表
    """
    if not os.path.exists(directory):
        return []
    
    files = []
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path):
            files.append({
                "filename": filename,
                "url": f"/uploads/images/{filename}",
                "size": os.path.getsize(file_path),
                "created_at": datetime.fromtimestamp(os.path.getctime(file_path))
            })
    
    # 按创建时间倒序排序
    files.sort(key=lambda x: x["created_at"], reverse=True)
    
    return files
