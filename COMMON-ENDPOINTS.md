# 常用 OSS 服务端点

## 功能说明

OSS Browser 现在内置了常用的 OSS 服务端点选择功能，用户可以直接从下拉列表中选择预定义的服务端点，无需手动输入复杂的 URL。

## 使用方法

1. 在登录页面，选择 "Customize" 端点类型
2. 在右侧会出现一个下拉菜单，显示常用的 OSS 服务端点
3. 选择所需的端点，系统会自动填充相应的端点 URL 和区域信息
4. 输入您的 Access Key 和 Secret Key
5. 完成登录

## 支持的服务

### Amazon S3
- **US East (N. Virginia)**: `https://s3.us-east-1.amazonaws.com`
- **US West (N. California)**: `https://s3.us-west-1.amazonaws.com`
- **EU (Ireland)**: `https://s3.eu-west-1.amazonaws.com`

### 阿里云 OSS
- **华东1 (杭州)**: `https://oss-cn-hangzhou.aliyuncs.com`
- **华北2 (北京)**: `https://oss-cn-beijing.aliyuncs.com`

### 腾讯云 COS
- **华北 (北京)**: `https://cos.ap-beijing.myqcloud.com`

### 华为云 OBS
- **华北四 (北京一)**: `https://obs.cn-north-4.myhuaweicloud.com`

### 其他服务
- **MinIO (本地)**: `http://localhost:9000`
- **Wasabi**: `https://s3.wasabisys.com`
- **DigitalOcean Spaces**: `https://nyc3.digitaloceanspaces.com`

## 自定义端点

如果您需要连接到列表中未包含的服务，可以选择手动输入：

1. 选择 "Customize" 端点类型
2. 在文本框中输入完整的端点 URL
3. 确保 URL 格式正确（以 http:// 或 https:// 开头）

## 添加新的预定义端点

如果您希望添加新的预定义端点到列表中，可以通过以下方式：

1. 编辑 `app/const.js` 文件
2. 在 `commonOssEndpoints` 数组中添加新的端点配置：

```javascript
{
  name: '服务名称',
  endpoint: 'https://your-service-endpoint.com',
  region: 'region-code'
}
```

3. 重新构建应用

## 注意事项

1. 选择预定义端点后，系统会自动切换到 "Customize" 模式
2. 区域信息会自动设置，有助于优化连接性能
3. 如果您需要使用特定区域的端点，请确保选择正确的区域
4. 某些服务可能需要特殊的认证方式，请参考相应服务商的文档