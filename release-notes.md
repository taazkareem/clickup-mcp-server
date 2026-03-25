# v0.14.2 Release Notes

### 🐛 Bug Fixes
- **Stability & Crash Prevention**: Fixed a critical "Maximum call stack size exceeded" crash that occurred when MCP sessions were closed or upgraded. 
- **Smoother OAuth Setup**: Root redirect URIs are now correctly recognized during client registration, making it easier to connect from standard host applications without manual configuration.

### ⚡️ Improvements
- **Beautiful Workspace Trees**: The workspace hierarchy tool now outputs beautifully formatted trees that maintain their structure in all chat and documentation views.
- **Transparent License Status**: License errors now include clear next steps and diagnostic info, so you never have to guess why a premium tool is locked.
- **Advanced Debug Logging**: New diagnostic logs make it trivial to debug OAuth allowlist rejections.
