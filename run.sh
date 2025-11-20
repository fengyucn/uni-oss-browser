#!/bin/bash

# OSS Browser 运行脚本
# 此脚本将启动修改后的通用 OSS Browser

echo "启动通用 OSS Browser..."

# 检查是否已经构建
if [ ! -d "dist" ] || [ ! -f "dist/main.js" ]; then
    echo "未找到构建文件，正在尝试构建..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "构建失败，请先运行构建。"
        echo "尝试使用开发模式启动..."
        npm run dev
        exit $?
    fi
fi

# 尝试生产模式
echo "尝试以生产模式启动应用..."
if cd dist && cross-env NODE_ENV=production electron . 2>/dev/null; then
    echo "生产模式启动成功！"
else
    echo "生产模式启动失败，尝试开发模式..."
    npm run dev
fi