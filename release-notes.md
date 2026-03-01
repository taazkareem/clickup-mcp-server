# v0.12.15 Release Notes

### 🚀 New Features
- **Task Checklists**: Full checklist management is now available with 6 new tools:
  - `create_checklist` — Add a named checklist to any task (resolved by name or ID).
  - `edit_checklist` — Rename a checklist or reorder it relative to others on a task.
  - `delete_checklist` — Remove a checklist and all its items from a task.
  - `create_checklist_item` — Add a line item to a checklist, with optional user assignment.
  - `edit_checklist_item` — Check/uncheck, rename, reassign, or nest checklist items under each other.
  - `delete_checklist_item` — Remove a single checklist item.
- **Checklist Visibility**: Existing checklists on a task are returned as part of `get_task` — no separate read tool needed.
- **Custom Field Discovery**: Added `get_list_custom_fields` to find field IDs and types instantly.
- **Direct Custom Field Updates**: Added `set_task_custom_field` with built-in name resolution—update fields by name without needing UUIDs.

### ⚡️ Improvements
- **Full-Fidelity Task Duplication**: `duplicate_task` now copies tags, time estimates, start dates, custom fields, checklists (with items), and subtasks. Previously only basic fields (name, description, status, priority, due date, assignees) were copied. Warns when source task has attachments (ClickUp API limitation).
- **Deep Search**: Implemented auto-paging (up to 1000 tasks) for custom field filters to ensure findings are accurate across deep task lists.
- **Smart Normalization**: Automatically handles both 10-digit (seconds) and 13-digit (milliseconds) timestamps for reliable date range filtering.
- **Token Efficiency**: Optimized task summaries to save up to 70% of response tokens by stripping redundant custom field metadata.
- **Multi-Select & Labels Support**: Enhanced filtering to correctly handle array-based values like Multi-select and Labels.

### 🐛 Bug Fixes
- **Search Accuracy (Double-Check)**: Integrated a client-side verification layer to ensure results always match criteria, even when ClickUp API endpoints are less precise.
- **Custom Field Formatting**: Fixed JSON structure for custom field filters to strictly match ClickUp API v2 specification.
