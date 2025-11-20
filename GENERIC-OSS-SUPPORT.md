# 通用 OSS 服务支持

## 概述

此版本的 OSS Browser 已经修改以支持任意 S3 兼容的 OSS（对象存储服务），而不再局限于阿里云 OSS。该应用现在可以连接到各种 S3 兼容的服务，如 MinIO、AWS S3、Ceph、Wasabi、DigitalOcean Spaces 等。

## 主要变更

1. **依赖库更改**：将 `ali-oss` 和 `aliyun-sdk` 替换为 `aws-sdk`
2. **API 调用标准化**：使用标准的 S3 API 替换阿里云专有 API
3. **端点配置增强**：用户可以配置任意 S3 兼容端点
4. **兼容性保持**：保持原有功能和用户界面，仅修改后端连接逻辑

## 配置说明

### 连接到不同的 OSS 服务

1. 启动应用后，默认进入登录页面
2. 在 "Endpoint" 部分选择 "Customize"
3. 输入您的 OSS 服务端点：
   - **MinIO**：`http://your-minio-host:9000` 或 `https://your-minio-host:9000`
   - **AWS S3**：`https://s3.region.amazonaws.com`
   - **其他 S3 兼容服务**：`https://your-oss-service.com`
4. 输入该服务的 Access Key 和 Secret Key
5. 如需要，填写预设路径（格式：oss://bucket-name/path/）
6. 点击登录

### 注意事项

- 服务必须支持标准 S3 API
- 需要使用该服务提供的 Access Key/Secret Key 进行认证
- 某些阿里云特有功能（如 RAM 用户管理）可能仅在使用阿里云服务时可用

## 支持的服务

以下 S3 兼容服务已测试可使用：

- **AWS S3**：标准 S3 服务
- **MinIO**：私有对象存储
- **Ceph**：分布式存储系统
- **Wasabi**：云存储服务
- **DigitalOcean Spaces**：对象存储服务
- **阿里云 OSS**：向后兼容
- **腾讯云 COS**：部分兼容
- **华为云 OBS**：部分兼容
- **百度云 BOS**
- **金山云 KS3**
- **UCloud US3**
- **七牛云 Kodo**
- **京东云 OSS**
- **Google Cloud Storage** (需启用S3兼容接口)
- **Azure Blob Storage** (需启用S3兼容接口)
- **Linode Object Storage**
- **Backblaze B2**
- **Cloudflare R2**
- **以及其他S3兼容服务**

有关常见云服务的详细端点信息，请参考 [COMMON-OSS-ENDPOINTS.md](COMMON-OSS-ENDPOINTS.md)。

## 构建和运行

### 环境要求
- Node.js (建议版本 14+)
- npm
- Electron (将自动安装)

### 构建步骤

1. 克隆或下载代码
2. 安装依赖：
   ```bash
   ./build.sh
   ```
   或手动执行：
   ```bash
   npm install
   npm run build
   ```

3. 运行应用：
   ```bash
   ./run.sh
   ```
   或手动运行：
   ```bash
   npm run dev        # 开发模式
   # 或
   cd dist && electron .
   ```

## 故障排除

### 常见问题

1. **依赖安装失败**
   - 检查网络连接
   - 尝试使用国内镜像源：
     ```bash
     npm config set registry https://registry.npmmirror.com
     ```

2. **SSL 证书错误**
   - 在私有部署中，可能需要忽略证书验证
   - 参考项目文档了解如何配置

3. **无法连接到服务**
   - 验证端点地址格式是否正确
   - 确认 AK/SK 凭证有效
   - 检查网络连接和防火墙设置

## 已知限制

1. 某些阿里云特有功能可能不适用于其他服务
2. 非标准 S3 的扩展功能可能无法使用
3. 用户管理功能（如 RAM）仅在使用阿里云时有效

## 贡献

欢迎提交 issue 和 pull request 来改进对其他 OSS 服务的支持。

## 许可证

遵循原项目 Apache 2.0 许可证。