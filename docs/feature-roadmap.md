# Feature Implementation Roadmap (Gap Analysis)

**Context**: This roadmap is based on customer feedback highlighting gaps in "Structural Operations" for AI agents acting as workspace architects. The current MCP implementation excels at reading and basic task manipulation but fails at preserving task integrity during moves and lacks tools for schema/structure changes.

## [x]🚨 Priority 1: Task Integrity & Multi-List Support (Critical)
**Problem**: The current `move_task` tool creates a copy of the task and deletes the original. This destroys:
- Task ID (links break)
- Attachments
- Custom Field values
- Comments (unless explicitly copied, which is brittle)

**Solution**: Implement "Tasks in Multiple Lists" (TIML) support to allow non-destructive moves.

### 1.1 New Tool: `add_task_to_list`
- **Purpose**: Add an existing task to another list without moving it (TIML).
- **API Endpoint**: `POST /list/{list_id}/task/{task_id}`
- **Inputs**: `taskId`, `listId`

### 1.2 New Tool: `remove_task_from_list`
- **Purpose**: Remove a task from a specific list.
- **API Endpoint**: `DELETE /list/{list_id}/task/{task_id}`
- **Inputs**: `taskId`, `listId`

### 1.3 Refactor `move_task`
- **Change**: Instead of `copy + delete`, implement as:
  1. `add_task_to_list` (Target List)
  2. `remove_task_from_list` (Source List)
- **Benefit**: Preserves the original Task ID, attachments, and history.

---
 
## [x] 🚀 Priority 2: Context Awareness (Quick Win)
**Problem**: Agents cannot "see" the valid statuses for a list. They have to guess or wait for an error when setting a status. `get_list` currently filters this out.

### 2.1 Enhance `get_list` & `get_folder`
- **Change**: Update the return type to include the `statuses` array from the ClickUp API response.
- **Benefit**: Allows agents to know valid workflow states (e.g., "To Do" -> "In Progress" -> "QA" -> "Done").

---

## [x] 🏗️ Priority 3: Structural Architecture
**Problem**: Agents cannot reorganize the workspace (e.g., moving a list into a folder).

### 3.1 New Tool: `move_list`
- **Purpose**: Move a List into a different Folder or Space.
- **Implementation Note**: Verify if ClickUp supports a direct "move" endpoint or if this requires reparenting properties via `PUT /list/{id}` (if supported) or a specialized endpoint.

### 3.2 New Tool: `move_folder`
- **Purpose**: Move a Folder into a different Space.

---

## 🛠️ Priority 4: Schema Management
**Problem**: Agents cannot create the data structure (Custom Fields) required for new workflows.

### 4.1 New Tool: `create_custom_field`
- **Purpose**: Create a new Custom Field on a List.
- **API Endpoint**: `POST /list/{list_id}/field`
- **Inputs**: `name`, `type` (text, dropdown, currency, etc.), `options` (for dropdowns).

### 4.2 New tools: `update_custom_field` / `delete_custom_field`
- **Purpose**: Manage existing schema.
