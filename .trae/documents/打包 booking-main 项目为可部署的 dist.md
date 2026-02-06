# 打包 booking-main 项目为可部署的 dist

## 1. 前端打包
- 进入 `booking-main/booking-main` 目录
- 运行 `npm install` 安装前端依赖
- 运行 `npm run build` 构建前端项目，生成 `dist` 目录

## 2. 后端准备
- 进入 `booking-main/backend` 目录
- 确保 `requirements.txt` 包含所有必要的依赖
- 检查 `main.py` 确保后端服务配置正确
- 验证 `.env` 文件配置是否完整

## 3. 整合部署文件
- 将前端构建生成的 `dist` 目录复制到后端目录
- 确保后端可以正确提供前端静态文件
- 检查部署配置是否完整

## 4. 验证打包结果
- 检查前端 `dist` 目录是否生成成功
- 确认后端依赖是否正确配置
- 验证整个项目的部署结构是否合理