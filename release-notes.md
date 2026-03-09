# v0.14.0 Release Notes (Pre-Release)

### 🚀 The Atomic Tools Pivot
Following the tool consolidation introduced in v0.13.0, we've refined our architecture to better serve high-performance AI agents. We've pivoted to an **Atomic Tools** model, replacing all `manage_*` tools with over **145 specialized atomic tools**.
- **Maximum Precision**: AI models can now select the exact tool needed (e.g., `create_task`, `update_task`, `add_task_link`) without the complexity of multi-action schemas.
- **Improved Performance**: Smaller, focused tool definitions result in up to **40% lower token usage** and faster response times.
- **Native Support**: Full API coverage now includes dedicated tools for Sprints, Webhooks, Attachments, User/Guest management, and more. 

### ⚡️ Universal Compatibility
- **CLI-Ready**: The server now automatically stringifies numeric ID parameters, ensuring 100% compatibility with CLI tools like `mcporter` and custom scripts that auto-convert numeric strings.
- **Gemini & Claude Optimized**: Parameter schemas have been hardened and strictly typed to work seamlessly across all major MCP hosts, including the Gemini CLI and Google Cloud Code.

### 🛡️ Optimized AI Personas
Our AI personas (Auditor, Task Worker, PM, Developer, etc.) have been rebuilt for the new 145-tool architecture. 
- **Dynamic Selection**: You can now enforce a specific persona by setting the `CLICKUP_MCP_PERSONA` environment variable.
- **Session-Aware**: When connected to the remote server, personas can be switched per-session using the `x-persona` or `persona` HTTP headers.
- **Role-Based Accuracy**: This ensures your assistant always has exactly the right tools for its role while keeping system prompts lean and token-efficient.

### 🐛 Notable Fixes
- **Comment Integrity**: Fixed markdown handling to prevent text duplication in task comments and improved success responses for comment updates.
- **Reliability**: Hardened workspace-level name resolution for all ClickUp entities.
