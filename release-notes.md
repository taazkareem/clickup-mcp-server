# v0.12.16 Release Notes

### 🚀 What's New (Beta)
- **Organize Workspace Prompt**: A new `Prompt` that can analyze your entire workspace, find clutter, and creates a step-by-step cleanup plan for you. Save as a ClickUp Doc or execute directly.

### 🐛 Bug Fixes
- **AI Tool Reliability**: Fixed a critical bug to ensure the server works flawlessly with strict AI clients like the Gemini CLI, Google Cloud Code, and other major platforms by adopting a universal, safe schema standard.
- **Document Creation**: Addressed an issue where creating new Document pages could occasionally fail. 

### ⚡️ Improvements
- **Reduced Token Overhead**: We've optimized the `get_workspace_tasks` tool's schema by removing redundant parameters. This results in faster tool selection by your AI and saves tokens on every single message the AI sends.
- **Smarter Tagging**: Adding tags to tasks is now much more forgiving! It automatically handles small typos and formatting differences when finding your existing tags.
- **Clearer Deletion Results**: When you delete multiple tasks at once, you will now see the names of the tasks that were deleted, rather than IDs alone. 
- **Expanded User Resources**: The [User Guide](https://github.com/taazkareem/clickup-mcp-server/blob/main/docs/user-guide.md) has been substantially updated with clearer examples, parameter references, and best practices to help your AI models get the most out of the server.
