# GitHub Actions 自动构建设置指南

本项目已配置了GitHub Actions自动构建工作流，可以让GitHub帮您自动生成Windows、Linux和macOS的打包文件。

## 🚀 功能特性

- **多平台支持**: Windows、Linux、macOS
- **多种打包格式**:
  - Windows: 便携版(.exe)、安装包(.exe)、ZIP压缩包
  - Linux: AppImage、Snap、DEB包
  - macOS: DMG、ZIP压缩包
- **自动触发**: 推送到`develop`分支时自动构建
- **手动触发**: 支持手动触发构建
- **Release发布**: 创建标签时自动发布Release

## 📋 设置步骤

### 1. 添加GitHub Actions工作流文件

由于GitHub CLI权限限制，请通过以下方式添加工作流文件：

#### 方法一：通过GitHub网页界面

1. 访问您的仓库：https://github.com/fengyucn/uni-oss-browser
2. 点击 `.github/workflows/` 目录
3. 点击 "Add file" → "Create new file"
4. 创建以下文件：

##### windows-builder.yml
```yaml
name: Windows Build

on:
  push:
    branches: [ develop ]
  pull_request:
    branches: [ develop ]
  workflow_dispatch:  # 允许手动触发

jobs:
  build-windows:
    runs-on: windows-latest

    strategy:
      matrix:
        include:
          - name: "Portable"
            target: "portable"
            artifact_name: "portable-executable"
            file_pattern: "*.exe"
          - name: "Installer"
            target: "nsis"
            artifact_name: "installer"
            file_pattern: "*.exe"
          - name: "ZIP Package"
            target: "zip"
            artifact_name: "zip-package"
            file_pattern: "*.zip"

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Setup Python (for native modules)
      uses: actions/setup-python@v4
      with:
        python-version: '3.x'

    - name: Install dependencies
      run: |
        npm install
        npm list electron-builder || npm install electron-builder --save-dev

    - name: Build application
      run: |
        npm run build

    - name: Build Windows ${{ matrix.name }} package
      run: |
        echo "Building ${{ matrix.name }} package..."
        if ("${{ matrix.target }}" -eq "portable") {
          npm run dist:win-portable
        } elseif ("${{ matrix.target }}" -eq "nsis") {
          electron-builder --win nsis --publish=never
        } elseif ("${{ matrix.target }}" -eq "zip") {
          electron-builder --win zip --publish=never
        }

    - name: Upload ${{ matrix.name }} artifact
      uses: actions/upload-artifact@v4
      with:
        name: ${{ matrix.artifact_name }}-${{ github.sha }}
        path: |
          release/${{ matrix.file_pattern }}
        retention-days: 30
        if-no-files-found: warn
```

### 2. 启用GitHub Actions

1. 进入仓库的 "Actions" 标签页
2. 如果是第一次使用，点击 "I understand my workflows, go ahead and enable them"
3. 确保Actions已启用

### 3. 触发构建

#### 自动触发
推送到 `develop` 分支：
```bash
git push origin develop
```

#### 手动触发
1. 进入 "Actions" 标签页
2. 选择 "Windows Build" 工作流
3. 点击 "Run workflow" 按钮
4. 选择分支并点击 "Run workflow"

### 4. 下载构建产物

构建完成后，您可以从以下位置下载：

1. **Actions页面下载**:
   - 进入 "Actions" 标签页
   - 点击具体的构建任务
   - 在 "Artifacts" 部分下载构建产物

2. **Release下载** (如果有):
   - 进入 "Releases" 标签页
   - 下载对应版本的构建产物

## 🔧 自定义配置

### 修改构建选项

编辑 `package.json` 中的 `build` 配置：

```json
{
  "build": {
    "win": {
      "target": [
        { "target": "portable", "arch": ["x64"] },
        { "target": "nsis", "arch": ["x64"] }
      ],
      "icon": "app/icons/icon_256x256.png"
    }
  }
}
```

### 修改Node.js版本

在工作流文件中修改：
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'  # 修改为您需要的版本
```

## 🛠️ 故障排除

### 常见问题

1. **构建失败 - Node.js版本不兼容**
   - 尝试使用不同的Node.js版本（16、18、20）

2. **构建失败 - 依赖安装错误**
   - 检查 `package.json` 中的依赖版本
   - 清理缓存：`npm cache clean --force`

3. **构建产物过大**
   - 检查 `.gitignore` 是否正确排除大文件
   - 确保没有包含不必要的文件

### 调试技巧

1. **查看构建日志**:
   - 进入 "Actions" → 选择构建任务 → 查看详细日志

2. **本地测试构建**:
   ```bash
   npm run build
   npm run dist:win-portable
   ```

## 📞 获取帮助

如果遇到问题，请：
1. 检查GitHub Actions的日志输出
2. 参考官方文档：https://docs.github.com/en/actions
3. 查看electron-builder文档：https://www.electron.build/

---

**注意**: 首次设置可能需要一些时间，GitHub会下载依赖并进行构建。后续构建会更快。