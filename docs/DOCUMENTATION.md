[← Back to README](../README.md)

# 📄 ClickUp MCP Server Documentation

Complete reference for all 147 tools available in the ClickUp MCP Server. Each category page includes tool reference tables, parameter documentation, and usage examples (User Prompt → Generated Request → Tool Response).

> Updated: 2026-03-09

## Tool Categories

| Category | Tools | Description | Link |
|----------|-------|-------------|------|
| Task Management | 28 | Create, update, move, delete, query tasks; bulk ops; subtasks; comments; file attachments; task linking; task dependencies; TIML | [tasks.md](tools/tasks.md) |
| Task Checklists | 6 | Add checklists and checklist items to tasks; assign, nest, and resolve items | [task-checklists.md](tools/task-checklists.md) |
| Sprint Management | 3 | Auto-detect active sprints by date range; list sprints in folders; fetch tasks per sprint | [sprints.md](tools/sprints.md) |
| Custom Fields | 4 | Create/list field definitions and set/remove task values | [custom-fields.md](tools/custom-fields.md) |
| Multi-List (TIML) | — | Add/remove tasks from multiple lists (tools included in Task Management count) | [multi-list.md](tools/multi-list.md) |
| Time Tracking | 13 | Timers, manual entries, time reports, tags, and workspace-wide filtering | [time_entries.md](tools/time_entries.md) |
| List Management | 7 | Create, get, update, move, delete lists; get folderless lists in a space; set permissions | [lists.md](tools/lists.md) |
| Space Management | 6 | List, get, create, update, delete spaces; set space permissions | [spaces.md](tools/spaces.md) |
| Folder Management | 6 | Create, get, update, move, delete folders; set folder permissions | [folders.md](tools/folders.md) |
| Tag Management | 6 | Space tag CRUD (4 tools); add/remove tags on tasks (2 tools); natural language colors | [tags.md](tools/tags.md) |
| Goal Management | 8 | List, get, create, update, delete goals; create, update, delete key results | [goals.md](tools/goals.md) |
| Views Management | 6 | List, get, create, update, delete views; get tasks from a view | [views.md](tools/views.md) |
| Document Management | 8 | List, get, create documents; list, get, create, update pages | [documents.md](tools/documents.md) |
| Webhook Management | 4 | List, create, update, and delete webhooks for real-time notifications | [webhooks.md](tools/webhooks.md) |
| User Group Management | 4 | List, create, update, and delete workspace user groups | [user-groups.md](tools/user-groups.md) |
| Guest Management | 10 | Invite, edit, remove workspace guests; grant/revoke access to tasks, lists, folders (Enterprise) | [guests.md](tools/guests.md) |
| Audit Logs | 1 | Retrieve workspace audit logs for security, user, and hierarchy activity (Enterprise) | [audit-logs.md](tools/audit-logs.md) |
| Attachments (v3) | 3 | List, get, and upload attachments for tasks and file custom fields via the v3 API | [attachments.md](tools/attachments.md) |
| Chat Management | 19 | Send messages, create channels, browse message history, threaded replies, reactions, member management | [chat.md](tools/chat.md) |
| Task Templates | 2 | Get templates and create tasks from templates | [task-templates.md](tools/task-templates.md) |
| Members & Workspace | 3 | Workspace hierarchy, members, plan details, plan ID lookup, member lookup (search), and seat utilization | [members-and-workspace.md](tools/members-and-workspace.md) |
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
