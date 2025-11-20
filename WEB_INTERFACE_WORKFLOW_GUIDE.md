# GitHub网页界面添加工作流指南

## 📋 详细步骤

### 第一步：访问仓库
1. 打开浏览器，访问：https://github.com/fengyucn/uni-oss-browser

### 第二步：进入工作流目录
1. 点击仓库根目录下的 `.github` 文件夹
2. 进入 `workflows` 子目录
3. 如果没有这些目录，点击 "Add file" → "Create new file" 来创建

### 第三步：创建工作流文件
1. 点击页面右上角的 "Add file" 按钮
2. 选择 "Create new file"

### 第四步：设置文件名
1. 在文件名输入框中输入：
   ```
   .github/workflows/windows-builder.yml
   ```

### 第五步：复制工作流内容
将以下完整内容复制到文件编辑器中：

```yaml
name: Windows Build (Fixed)

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

    - name: Install additional build tools
      run: |
        npm install -g gulp-cli
        npm install -g electron-builder

    - name: Build application (CI mode)
      run: |
        npm run build:ci

    - name: Run postbuild step
      run: |
        node gen

    - name: Verify build output
      run: |
        if (!(Test-Path "dist")) {
          Write-Error "dist directory not found after build"
          exit 1
        }
        Get-ChildItem -Path dist -Recurse | ForEach-Object { Write-Host "dist file: $($_.FullName)" }

    - name: Build Windows ${{ matrix.name }} package
      run: |
        echo "Building ${{ matrix.name }} package..."
        try {
          if ("${{ matrix.target }}" -eq "portable") {
            npm run dist:win-portable
          } elseif ("${{ matrix.target }}" -eq "nsis") {
            npm run dist:win-nsis
          } elseif ("${{ matrix.target }}" -eq "zip") {
            npm run dist:win-zip
          }
          Write-Host "Build completed successfully"
        } catch {
          Write-Error "Build failed with error: $($_.Exception.Message)"
          exit 1
        }

    - name: List release files
      run: |
        echo "Release directory contents:"
        if (Test-Path "release") {
          Get-ChildItem -Path release -Recurse -File | ForEach-Object {
            $size = [math]::Round((Get-Item $_.FullName).Length / 1MB, 2)
            Write-Host "File: $($_.FullName) - Size: ${size}MB"
          }
        } else {
          Write-Error "Release directory not found"
          exit 1
        }

    - name: Upload ${{ matrix.name }} artifact
      uses: actions/upload-artifact@v4
      with:
        name: ${{ matrix.artifact_name }}-${{ github.sha }}
        path: |
          release/${{ matrix.file_pattern }}
        retention-days: 30
        if-no-files-found: warn

  # 快速构建测试 (仅便携版)
  quick-build-test:
    runs-on: windows-latest
    if: github.event_name == 'workflow_dispatch'

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: |
        npm install

    - name: Quick build test
      run: |
        npm run build:ci
        node gen
        npm run dist:win-portable

    - name: Upload quick build artifact
      uses: actions/upload-artifact@v4
      with:
        name: quick-build-${{ github.sha }}
        path: |
          release/*.exe
        retention-days: 7
```

### 第六步：提交文件
1. 在页面底部的提交信息框中输入：
   ```
   Add Windows build workflow
   ```

2. 选择提交类型：默认即可
3. 点击绿色的 "Commit new file" 按钮

### 第七步：启用GitHub Actions（如果是首次使用）
1. 点击仓库页面的 "Actions" 标签
2. 如果出现提示，点击 "I understand my workflows, go ahead and enable them"

### 第八步：验证工作流
1. 进入 "Actions" 标签页
2. 您应该能看到 "Windows Build (Fixed)" 工作流
3. 可以点击 "Run workflow" 手动触发构建

## ✅ 完成！

现在当您推送代码到 develop 分支时，GitHub Actions会自动构建Windows版本的软件包。

## 📦 下载构建产物
构建完成后，您可以在以下位置下载：
- Actions 页面 → 构建任务 → Artifacts 部分

## 🔧 故障排除
如果遇到问题：
1. 检查文件路径是否正确：`.github/workflows/windows-builder.yml`
2. 确保YAML格式没有语法错误
3. 查看Actions页面的构建日志