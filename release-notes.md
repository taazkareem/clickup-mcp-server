# v0.14.5 Release Notes

### 🐛 Bug Fixes

- **Automated Flow Compatibility**: Fixed an issue where automated background agents could get stuck waiting for you to pick a workspace. The server now correctly respects your default workspace settings without interrupting.

### ⚡️ Improvements

- **Cleaner Output**: We've removed the "Premium Active" footer from raw JSON responses, making it much easier for downstream code and bots to parse the tool outputs.
- **Enhanced Security**: Added stricter safeguards to ensure sensitive files like certificates and `.env` files are never accidentally included in the package.
