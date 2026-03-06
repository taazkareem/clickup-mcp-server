# v0.14.0 Release Notes

### 🚀 What's New
- **Unified Comment Management (`manage_comments`)**: One tool now handles everything — get, create, edit, resolve, delete, and reply to comments across tasks, lists, and views. Set `context_type` to `task` (default), `list`, or `view`. Replaces the old `get_task_comments`, `create_task_comment`, and `manage_task_comments` tools.
- **Richer Chat Messaging**: `manage_chat_messages` now supports reactions, threaded replies, and tagged user lookup. `manage_chat_channels` now supports follower management and direct message creation.

### 🐛 Bug Fixes
- **Comment Duplication Fixed**: Markdown comments were being stored with the raw source text appended as a duplicate block. This is now resolved.

### 🚨 Breaking Changes
- **`get_task_comments` and `create_task_comment` removed** — replaced by `manage_comments` (actions: `get` / `create`).
- **`manage_task_comments` renamed to `manage_comments`** — update any saved prompts or workflows referencing the old name.
- **Chat tool actions expanded** — check the updated `manage_chat_channels` and `manage_chat_messages` action lists if you reference them directly.
