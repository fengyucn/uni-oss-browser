# GitHub CLI 权限修复指南

## 🔧 方法一：更新GitHub CLI令牌（需要workflow权限）

### 步骤1：撤销现有认证
```bash
gh auth logout
```

### 步骤2：重新认证，请求workflow权限
```bash
gh auth login
```

按以下选择：
1. What account do you want to log into? → `GitHub.com`
2. What is your preferred protocol? → `HTTPS`
3. Authenticate Git with your GitHub credentials? → `Yes`
4. How would you like to authenticate GitHub CLI? → `Login with a web browser`

在浏览器中登录时，确保：
- 登录到正确的GitHub账户
- 授予所有必要的权限，包括workflow权限

### 步骤3：验证权限
```bash
gh auth status
```

确认Token scopes包含：`workflow`

## 🚀 方法二：使用个人访问令牌（PAT）

### 步骤1：创建个人访问令牌
1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 设置令牌名称：`oss-browser-workflow`
4. 选择权限（Scopes）：
   - ✅ `repo` - 完整仓库访问权限
   - ✅ `workflow` - GitHub Actions权限
5. 点击 "Generate token"
6. 复制生成的令牌（只显示一次）

### 步骤2：使用令牌重新认证
```bash
gh auth login --with-token
```
然后粘贴您的个人访问令牌

## 🌐 方法三：网页界面操作（最简单）

由于GitHub CLI权限问题，最简单的方法是直接在GitHub网页界面操作：

### 详细步骤：
1. 访问：https://github.com/fengyucn/uni-oss-browser
2. 点击 `.github/workflows/` 目录
3. 点击 "Add file" → "Create new file"
4. 文件名：`windows-builder.yml`
5. 复制修复后的工作流内容（见WEB_INTERFACE_WORKFLOW_GUIDE.md）
6. 提交更改

## ✅ 推荐方案

**推荐使用方法三（网页界面）**，因为：
- 不需要处理权限问题
- 操作简单直观
- 立即生效
- 可以实时查看文件结构

## 🔄 验证修复

添加工作流文件后：
1. 推送代码到develop分支触发构建
2. 或在Actions页面手动触发
3. 检查构建是否成功运行