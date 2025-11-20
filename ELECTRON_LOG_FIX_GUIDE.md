# GitHub Actions 构建修复指南

## 问题描述
推送到 GitHub 通过工作流生成的版本会报错，缺少 `electron-log` 依赖。

## 问题分析
1. **项目依赖问题**：项目中使用 `electron-log@1.3.0` 作为运行时依赖
2. **打包配置问题**：electron-builder 在打包时可能没有正确包含 electron-log
3. **构建环境问题**：GitHub Actions 环境中依赖安装可能不完整

## 解决方案

### 1. 修复了的工作流配置

已经修复了所有工作流文件中的依赖安装步骤：

#### build-and-release.yml (主要构建工作流)
```yaml
- name: Install dependencies
  run: |
    npm install
    # 确保 electron-log 正确安装
    npm list electron-log || npm install electron-log@1.3.0 --save
```

#### windows-builder.yml (Windows 专用工作流)
```yaml
- name: Install dependencies
  run: |
    npm install
    # 确保安装 electron-builder
    npm list electron-builder || npm install electron-builder --save-dev
    # 确保 electron-log 正确安装
    npm list electron-log || npm install electron-log@1.3.0 --save
```

#### build-portable.yml (便携版工作流)
```yaml
- name: Install dependencies
  run: |
    npm install
    # 确保 electron-log 正确安装
    npm list electron-log || npm install electron-log@1.3.0 --save
```

### 2. package.json 配置优化

项目中已经有正确的 electron-log 配置：

```json
{
  "dependencies": {
    "electron-log": "1.3.0"
  },
  "build": {
    "asarUnpack": ["**/node_modules/electron-log/**"],
    "extraFiles": [
      {
        "from": "node_modules/electron-log/",
        "to": "node_modules/electron-log/"
      }
    ]
  }
}
```

### 3. 关键修复点

1. **显式安装 electron-log**：在 `npm install` 后添加检查和重新安装逻辑
2. **版本锁定**：确保安装与项目依赖匹配的版本 `1.3.0`
3. **多平台覆盖**：修复了所有构建工作流（Windows、Linux、macOS）

### 4. 验证步骤

构建完成后，可以通过以下方式验证 electron-log 是否正确包含：

1. **检查 asar 包内容**：
   ```bash
   npx asar list release/app.asar | grep electron-log
   ```

2. **检查解包目录**：
   ```bash
   ls -la release/resources/app/node_modules/electron-log
   ```

3. **运行时测试**：
   - 启动应用
   - 检查日志功能是否正常工作
   - 查看控制台是否有 electron-log 相关错误

### 5. 最佳实践建议

1. **依赖版本管理**：建议在 package.json 中锁定 electron-log 版本
2. **构建验证**：在本地验证构建流程是否正常
3. **测试覆盖**：确保关键功能（如日志记录）在构建版本中正常工作
4. **监控构建**：定期检查 GitHub Actions 构建日志

## 预期结果

修复后的工作流应该能够：
- 正确安装 electron-log 依赖
- 成功构建所有平台的应用程序
- 生成的可执行文件包含完整的日志功能

## 故障排除

如果问题仍然存在：
1. 检查 GitHub Actions 构建日志中的错误信息
2. 验证 node_modules 中的 electron-log 是否存在
3. 确认 package.json 中的版本配置是否正确
4. 检查 electron-builder 的打包配置是否正确