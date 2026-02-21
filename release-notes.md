# v0.12.14 Release Notes

### ⚙️ Optimization & Performance
- **Faster Workspace Discovery**: Optimized finding folders and lists by checking the hierarchy cache first. This significantly reduces response times for name-based searches, especially in large workspaces.
- **Shared Service Caching**: Refactored internal architecture to use shared `ListService` instances. This ensures 100% data consistency between task and list operations while reducing memory consumption.

### 📋 Task Integrity & Multi-List Support
- **High-Integrity Moves**: The `move_task` tool now uses ClickUp's "Tasks in Multiple Lists" (TIML) feature by default, preserving **Task IDs**, file attachments, comments, and history. 
- **Explicit Safety Strategy**: Added `allowDestructiveFallback`. If your ClickUp plan doesn't support TIML, the server will now ask for permission instead of performing a destructive move automatically.
- **New Advanced Tools**: Added `add_task_to_list` and `remove_task_from_list` for specialized project management.

### 🧠 Context & Structure
- **Smart Status Awareness**: Updated `get_list` and `get_folder` to return valid workflow statuses, helping AI agents set task states more accurately.
- **Workspace Reorganization**: New `move_list` and `move_folder` tools allow AI agents to manage your hierarchy with the same data-integrity safeguards as task moves.

### ⚡️ Improvements
- **Security Hardening**: Implemented SSRF mitigation with hostname validation for custom API URLs.
- **Refined Error Handling**: Better detection of plan limitations (403 Forbidden) vs authentication issues (401 Unauthorized).
