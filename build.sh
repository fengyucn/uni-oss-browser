#!/bin/bash

# OSS Browser 通用构建脚本
# 此脚本将处理依赖安装和构建过程

echo "正在准备构建 OSS Browser..."

# 检查是否已经有 node_modules
if [ -d "node_modules" ]; then
    echo "发现 node_modules，清理旧依赖..."
    rm -rf node_modules
fi

# 设置 npm 配置以提高构建成功率
echo "配置 npm..."
npm config set legacy-peer-deps true
npm config set audit false
npm config set fund false

# 尝试安装依赖
echo "正在安装依赖..."
if npm install --no-optional --verbose; then
    echo "依赖安装成功！"
else
    echo "依赖安装遇到问题，尝试跳过某些可选依赖..."
    # 安装核心依赖
    npm install aws-sdk clipboard electron-log koa koa-convert koa-static-server mime nodemailer nodemailer-smtp-transport platform request --save
    npm install angular angular-ui-router angular-sanitize angular-ui-bootstrap angular-bootstrap-contextmenu angular-ui-codemirror bootstrap codemirror jquery jquery.qrcode moment showdown clipboard font-awesome --save-dev
fi

# 确保 gulp 可用
echo "确保构建工具可用..."
npm install gulp gulp-concat gulp-babel babel-core babel-preset-es2015 gulp-angular-templatecache gulp-load-plugins --save-dev

# 运行构建
echo "开始构建应用..."
if npm run build; then
    echo "构建成功！"
    echo "您可以使用以下命令运行应用："
    echo "  npm run dev          # 开发模式"
    echo "  npm run prod         # 生产模式"
    echo ""
    echo "或者直接运行构建后的应用："
    echo "  cd dist && electron ."
else
    echo "构建失败，请检查错误信息"
    exit 1
fi

echo "构建完成！"