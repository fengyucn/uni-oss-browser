# Universal OSS Browser

A cross-platform desktop application for managing S3-compatible Object Storage Services. Built with Electron and Angular, providing a Windows Explorer-like interface for easy file management.

[中文文档](README-CN.md)

## Features

- **Universal S3 Support**: Works with any S3-compatible service (AWS S3, MinIO, Ceph, Wasabi, Alibaba Cloud OSS, etc.)
- **Full File Operations**: Upload, download, copy, move, rename, preview files
- **Resumable Transfers**: Support for interrupted upload/download recovery
- **Bucket Management**: Create, delete, modify bucket permissions
- **Drag & Drop**: Easy file uploads via drag and drop
- **Custom Endpoints**: Configure any S3-compatible service endpoint
- **Cross-Platform**: Windows 7+, macOS, Linux

## Download

Latest version: `1.19.2-community`

| Platform | Download |
|----------|----------|
| Windows x64 | [Download](https://github.com/fengyucn/uni-oss-browser/releases/latest) |
| Windows x32 | [Download](https://github.com/fengyucn/uni-oss-browser/releases/latest) |
| macOS | [Download](https://github.com/fengyucn/uni-oss-browser/releases/latest) |
| Linux x64 | [Download](https://github.com/fengyucn/uni-oss-browser/releases/latest) |
| Linux x32 | [Download](https://github.com/fengyucn/uni-oss-browser/releases/latest) |

Extract and run - no installation required.

## Quick Start

1. Launch the application
2. Select or enter your OSS service endpoint
3. Enter Access Key and Secret Key
4. Login and start managing your files

For detailed OSS service configuration, see [GENERIC-OSS-SUPPORT.md](GENERIC-OSS-SUPPORT.md).

For common endpoint URLs, see [COMMON-ENDPOINTS.md](COMMON-ENDPOINTS.md).

## Development

### Prerequisites

- Node.js 8.2.1+ (recommended: 14+)
- npm or cnpm

### Setup

```bash
# Install dependencies
npm install

# Build frontend code
npm run build

# Run in development mode (recommended)
npm run dev

# Run in production mode
npm run prod
```

### Development Mode (Recommended)

Development mode offers:
- Auto-reload on file changes
- Built-in debugging tools
- Fast startup
- Better stability

### Building Packages

```bash
# Build for Windows
npm run dist:win-portable

# Build for Linux
npm run dist:linux

# Lint code
npm run lint
```

## Debugging

Open developer tools using any of these methods:

1. Press `F12` (Windows/Linux) or `Cmd+Option+I` (macOS)
2. Click "Open Debug" in Settings dialog
3. Rapidly click the top-left icon 10 times

See [DEBUG-MODES.md](DEBUG-MODES.md) for details.

## Project Structure

```
├── app/              # Frontend code (Angular + Bootstrap)
├── node/             # Node modules for backend
│   ├── ossstore/     # Upload/download job classes
│   └── i18n/         # Internationalization
├── dist/             # Built frontend code
├── release/          # Packaged applications
├── main.js           # Application entry point
└── package.json      # Project configuration
```

## Supported Services

Tested with:
- AWS S3
- MinIO
- Alibaba Cloud OSS
- Tencent Cloud COS
- Huawei Cloud OBS
- Wasabi
- DigitalOcean Spaces
- Ceph
- Cloudflare R2
- Backblaze B2
- And other S3-compatible services

## Contributing

Contributions are welcome! Please:
- Open issues for bug reports or feature requests
- Submit pull requests to the `dev` branch
- Follow existing code style

## License

[Apache License 2.0](LICENSE)

## Links

- [GitHub Repository](https://github.com/fengyucn/uni-oss-browser)
- [Issue Tracker](https://github.com/fengyucn/uni-oss-browser/issues)
- [Original Project](https://github.com/aliyun/oss-browser)
