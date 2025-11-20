#!/bin/bash

# 生产模式启动脚本
# 用于启动构建后的 OSS Browser

echo "启动 OSS Browser 生产模式..."

# 检查构建目录
if [ ! -d "dist" ]; then
    echo "错误: 未找到 dist 目录，请先运行 'npm run build'"
    exit 1
fi

if [ ! -f "dist/main.js" ]; then
    echo "错误: 未找到 dist/main.js，请先运行 'npm run build'"
    exit 1
fi

echo "切换到 dist 目录并启动应用..."
cd dist

# 设置生产环境变量并启动 Electron
export NODE_ENV=production
electron .