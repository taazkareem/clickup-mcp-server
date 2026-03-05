# v0.13.1 Release Notes

### 🐛 Bug Fixes
- **More Reliable Remote Connections**: Fixed an issue where restarting the server or scaling instances could cause active connections to fail with a "Bad Request" error.
- **Smoother Authentication Fallback**: Authenticated requests now correctly fall back to "stateless" mode if a session ID is missing or unrecognized, ensuring uninterrupted service for remote clients and high-availability deployments.
