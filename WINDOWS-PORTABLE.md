# Creating a Single Executable for Windows

The oss-browser application can be packaged as a Windows portable executable that runs as a single file without requiring installation. Here are different approaches to achieve this:

## Method 1: Using GitHub Actions (Recommended)

We've included a GitHub Actions workflow file (`.github/workflows/build-portable.yml`) that will automatically build the portable executable on Windows. To use this:

1. Push your code to a GitHub repository
2. The workflow will automatically run on pushes to the main branch
3. Download the portable executable from the workflow artifacts

## Method 2: Building on Windows

To build directly on Windows:

1. Install Node.js (matching the project's required version: 8.2.1)
2. Clone the repository
3. Run `npm install`
4. Run `npm run build`
5. Run `npm run dist:win-portable` or `npx electron-builder --win portable --x64 --publish=never`

## Method 3: Using a Windows VM or Cross-Platform Tool

If building on Linux, you can:
- Use a Windows virtual machine
- Use Docker with a Windows container (though this has limitations for GUI applications)
- Use a build service like AppVeyor

## Current Configuration

The project's `package.json` has been updated with:
- A new script: `"dist:win-portable": "electron-builder --publish=never --win portable"`
- Windows-specific configuration targeting portable executable with x64 architecture
- Required metadata fields (description and author) for electron-builder

## Generated Files

When successfully built, the portable executable will be found in the `release/` directory with a `.exe` extension (e.g., `Universal OSS Browser.exe`).

The portable executable contains all necessary dependencies and can run directly without installation. The first time it runs, it may extract some temporary files to a local directory.