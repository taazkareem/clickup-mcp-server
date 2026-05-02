# v0.14.4 Release Notes

### 🐛 Bug Fixes

- **Bulletproof Shutdown**: We've added smarter detection for when your AI client disconnects, ensuring the server shuts down cleanly every time.
- **Critical Memory & Process Fix**: Fixed a significant memory leak and an issue where "orphaned" background processes could keep running after use. Your server will now be lighter on resources and more reliable for long-term use.

### ⚡️ Improvements

- **Smooth Exit**: Improved the stability of the shutdown sequence to handle multiple exit signals gracefully without errors.
