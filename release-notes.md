# v0.12.13 Release Notes

### 🚀 New Features & Improvements
- **Global Search & Resolution**:
  - **Smarter Name Searching**: Finding tasks, lists, documents, and folders by name is now significantly more powerful. The server searches globally across your entire workspace without needing to know the specific Space or Folder first. Uses a fast and efficient tiered search strategy.

### ⚡️ Improvements & Bug Fixes
- **Refined Search Validation**: Fixed edge cases where keyword-only searches could trigger validation errors.
- **Tasks in Multiple Lists Support**: Added `include_timl` parameter to `get_workspace_tasks`. This allows retrieving tasks that are associated with multiple lists, essential for accurate Sprint and cross-project tracking.

### 🚀 Hierarchical Task Creation
- Added support for recursive subtask creation in both `create_task` and `create_bulk_tasks`.
- Fixed `create_bulk_tasks` schema to properly allow `parent` fields.
- Updated `formatTaskData` to explicitly include the `parent` ID in tool responses.

### 🐛 Bug Fixes
- **Workspace Grounding**: Fixed a bug where the LLM lacked workspace context in single-workspace scenarios from OAuth flows.

### ⚠️ Deprecations
- **resolve_assignees**: This tool has been deprecated and removed. Its functionality is now natively integrated into all task management tools (`create_task`, `update_task`, `create_bulk_tasks`, `create_task_comment`, etc.). You can now pass names directly to the `assignees` parameter in these tools.
