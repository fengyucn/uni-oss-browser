# Universal OSS Browser Project Overview

## Project Description
Universal OSS Browser is an Electron-based desktop application that provides a graphical management tool for S3-compatible Object Storage Services (OSS). It functions similarly to Windows Explorer, allowing users to view, upload, download, and manage objects across different cloud storage providers including AWS S3, Alibaba Cloud OSS, MinIO, Ceph, Wasabi, DigitalOcean Spaces, and more. The application is built with AngularJS and leverages Electron for cross-platform desktop functionality.

## Technologies & Architecture
- **Frontend**: AngularJS 1.5.8 with Bootstrap UI components
- **Desktop Framework**: Electron 1.8.4
- **Build System**: Gulp for task automation, npm scripts for development/production builds
- **Backend**: Node.js with Koa.js static server for internal file serving
- **UI Framework**: Bootstrap 3.3.6 with Font Awesome icons
- **Code Editor**: CodeMirror for code editing features

## Project Structure
```
oss-browser/
├── app/                    # Main application source code
│   ├── components/         # Reusable components (directives, filters, services)
│   ├── icons/              # Application icons
│   ├── main/               # Main application logic (auth, files, modals)
│   ├── app.css             # Application styles
│   ├── app.js              # Main application JavaScript
│   ├── const.js            # Application constants and configurations
│   └── index.html          # Main HTML entry point
├── dist/                   # Build output directory
├── node/                   # Node modules for specific features
├── static/                 # Static assets served by the internal server
├── vendor/                 # Third-party vendor libraries
├── server.js               # Internal static file server
├── main.js                 # Electron main process
├── gulpfile.js             # Build automation tasks
├── package.json            # Project dependencies and scripts
├── Makefile                # Build and packaging commands
└── gen.js                  # Release notes generator
```

## Building and Running

### Development Mode
```bash
# Install dependencies
npm install

# Run in development mode (with auto-reload)
npm run dev

# Alternative run command if using custom configuration
custom= npm run dev
```

### Production Mode
```bash
# Build the application
npm run build

# Run in production mode
npm run prod
```

### Alternative Development Commands
```bash
# Using Makefile commands (if available)
make clean        # Clean build artifacts
make build        # Build the application
make dev          # Run in development mode
make prod         # Run in production mode
```

## Key Features
- Support for arbitrary S3-compatible Object Storage Services
- File management: upload (resumable), download (resumable), delete, copy, move, rename, search
- Bucket management: create, delete, ACL modification
- Object preview and metadata management
- Cross-platform support (Windows, Linux, Mac)
- Multi-language support
- Fragment management within buckets
- Custom endpoint configuration for different storage providers
- Debug mode accessible through F12 or Settings page

## Development Conventions
- The application uses AngularJS with controller-as syntax
- ES2015 features are transpiled using Babel
- Code style is enforced through ESLint with `@alicloud/eslint-config`
- Gulp is used for build tasks including JS concatenation, template caching, and CSS processing
- The app follows S3-compatible API patterns for cloud storage operations
- Uses AWS SDK for interacting with object storage services

## Build Process
The build process combines:
1. Application JavaScript files into a single `app.js`
2. HTML templates into a `templates.js` file using Angular's template cache
3. CSS files into a single `app.css` file
4. Third-party vendor libraries into `lib.js` and `lib.css`
5. Copies static assets and icons to the distribution directory
6. Creates a final package.json optimized for Electron distribution

## Configuration
- The application supports custom configuration via a `custom` module
- Common OSS endpoints are pre-configured in the Constants file
- Internal static server runs on one of ports 7123-7126
- The application enforces single instance behavior across the system

## Testing
- Unit tests can be run with the command: `npm test`
- Tests use the AVA testing framework

## Security & Certificates
- The application is configured to handle self-signed certificates and ignore certificate errors (NODE_TLS_REJECT_UNAUTHORIZED = 0)
- This is important for internal/private cloud storage access