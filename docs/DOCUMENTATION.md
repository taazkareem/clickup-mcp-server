[← Back to README](../README.md)  

# 📄 ClickUp MCP Server Documentation

Complete reference for all 47 tools available in the ClickUp MCP Server. Each category page includes tool reference tables, parameter documentation, and usage examples (User Prompt → Generated Request → Tool Response).

> Updated: 2026-03-07

## Tool Categories

| Category | Tools | Description | Link |
|----------|-------|-------------|------|
| Task Management | 20 | Create, update, move, delete, query tasks; bulk ops; subtasks; file attachments; task linking; task dependencies; TIML | [tasks.md](tools/tasks.md) |
| Task Checklists | 1 | Add checklists and checklist items to tasks; assign, nest, and resolve items (consolidated action-based tool) | [task-checklists.md](tools/task-checklists.md) |
| Custom Fields | 1 | Create/List field definitions and set/remove task values (consolidated action-based tool) | [custom-fields.md](tools/custom-fields.md) |
| Multi-List (TIML) | — | Add/remove tasks from multiple lists (tools included in Task Management count) | [multi-list.md](tools/multi-list.md) |
| Time Tracking | 1 | Timers, manual entries, time reports, tags, and workspace-wide filtering | [time_entries.md](tools/time_entries.md) |
| List Management | 1 | Create, get, update, move, and delete lists; get folderless lists in a space (consolidated action-based tool) | [lists.md](tools/lists.md) |
| Space Management | 1 | List, get, create, update, and delete spaces (consolidated action-based tool) | [spaces.md](tools/spaces.md) |
| Folder Management | 1 | Create, get, update, move, and delete folders within spaces (consolidated action-based tool) | [folders.md](tools/folders.md) |
| Tag Management | 3 | Consolidated space tag CRUD (manage_space_tags); add/remove tags on tasks; natural language colors | [tags.md](tools/tags.md) |
| Goal Management | 1 | List, get, create, update, and delete goals; create, update, and delete key results | [goals.md](tools/goals.md) |
| Views Management | 1 | Consolidated action-based tool for ClickUp Views across all containers | [views.md](tools/views.md) |
| Document Management | 7 | Create/browse/edit ClickUp Docs and pages; markdown and HTML support | [documents.md](tools/documents.md) |
| Webhook Management | 1 | List, create, update, and delete webhooks for real-time notifications | [webhooks.md](tools/webhooks.md) |
| Chat Management | 2 | Send messages, create channels, browse message history, threaded replies, reactions, member management | [chat.md](tools/chat.md) |
| Task Templates | 2 | Get templates and create tasks from templates | [task-templates.md](tools/task-templates.md) |
| Members & Workspace | 3 | Workspace hierarchy, member lookup, find users by name/email | [members-and-workspace.md](tools/members-and-workspace.md) |
| Feedback | 1 | Submit bug reports, feature requests, and questions via GitHub | [feedback.md](tools/feedback.md) |

## Reference

| Topic | Description | Link |
|-------|-------------|------|
| Personas | Pre-packaged configurations to limit AI access to specific toolsets | [personas.md](reference/personas.md) |
| Configuration | Environment variables, tool filtering (ENABLED_TOOLS / DISABLED_TOOLS) | [configuration.md](reference/configuration.md) |
| Error Handling | Common error responses, rate limiting behavior | [error-handling.md](reference/error-handling.md) |
| Prompts | MCP prompts for guided multi-step workflows (e.g., organize_workspace) | [prompts.md](reference/prompts.md) |
| Security | Isolation, credential handling, and OAuth protections | [security.md](security.md) |

---

<div align="center">
  <sub>💳 <a href="https://buy.polar.sh/polar_cl_tZ2q8jRvtaaduurOkQKKJmRgdD43ZiB5K0GZn0aQcur?utm_source=github&utm_medium=user-guide">Purchase License</a> · 25% OFF Lifetime with code <strong>MAR25</strong></sub><br>
  <sub>Created by <a href="https://github.com/taazkareem">taazkareem</a></sub>
</div>
