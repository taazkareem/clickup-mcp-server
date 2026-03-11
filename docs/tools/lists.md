[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# List Management

Create, update, move, and delete lists within your ClickUp workspace. Lists can exist directly in a space or inside a folder. Each operation is its own atomic tool.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| `list_lists` | Get lists in a space (folderless) or in a folder | `space_id`/`space_name` OR `folder_id`/`folder_name` | `archived`, `detail_level`, `team_id` |
| `get_list` | Get list details | `list_id` or `list_name` | `include_members`, `team_id` |
| `create_list` | Create a list in a space or folder | `name`, and one of: `space_id`/`space_name` (folderless) or `folder_id`/`folder_name` (in folder) | `content`, `markdown_content`, `due_date`, `due_date_time`, `priority`, `assignee`, `status`, `team_id` |
| `create_list_from_template` | Create a list from a template | `name`, `template_id`/`template_name`, and one of: `space_id`/`space_name` or `folder_id`/`folder_name` | `return_immediately`, date remapping, content import filters, `team_id` |
| `update_list` | Update list properties (name, content, description, due date, priority, status/color, assignee). Supports removing color with `unset_status`. | `list_id` or `list_name`, at least one of: `name`/`content`/`markdown_content`/`status`/`unset_status`/`due_date`/`priority`/`assignee` | `due_date_time`, `team_id` |
| `delete_list` | Delete a list | `list_id` or `list_name` | `team_id` |
| `move_list` | Move list to a different space or folder (high-integrity) | `list_id` or `list_name`, plus destination `space_id`/`space_name` or `folder_id`/`folder_name` | `allow_destructive_fallback`, `team_id` |
| `set_list_permissions` | Update list privacy and sharing (ACLs) | `list_id` or `list_name`, `private` | `entries`, `team_id` |

> **Note on move_list:** Uses a High-Integrity Move — creates a new list at destination, moves all tasks via the ClickUp v3 `home_list` endpoint (preserving task IDs), then deletes the source. The List ID will change.

> **Note on set_list_permissions:** Uses the ClickUp v3 API. `private` is a boolean. `entries` is an array of `{ id: number, type: string, permission_level?: string }`. `type` can be `user` or `team` (group).

> **Note on create_list:** If both `folder_id`/`folder_name` and `space_id`/`space_name` are provided, folder takes precedence and the list is created inside the folder.

## Parameters

### list_lists

- **space_id**: Space ID — returns folderless lists in this space (preferred over space_name).
- **space_name**: Space name (alternative to space_id).
- **folder_id**: Folder ID — returns lists inside this folder (preferred over folder_name).
- **folder_name**: Folder name (alternative to folder_id; requires space_id or space_name to resolve).
- **archived**: Boolean. Include archived lists. Default: `false`.
- **detail_level**: `"names"` returns `{id, name}` only for efficient navigation. `"detailed"` (default) returns full metadata including `content`, `status`, `task_count`, `due_date`, `start_date`, and `archived`.

### update_list

- **name**: New list name.
- **content**: List description (plain text). Use instead of `markdown_content` for plain text.
- **markdown_content**: List description in markdown format. Use instead of `content` for formatted descriptions.
- **status**: List color/status (e.g., `red`, `blue`, `green`). Refers to the list's display color, not task statuses.
- **unset_status**: Boolean. Set to `true` to remove the list color. Cannot be used with `status` simultaneously.
- **due_date**: Due date (Unix timestamp in ms or natural language string like `"2025-12-31"`).
- **due_date_time**: Boolean. Whether the due date includes a time component. Default: `false`.
- **priority**: Priority 1 (urgent) – 4 (low).
- **assignee**: User ID (number) or `"none"` (string) to unset the assignee. Use `get_workspace` with `search_member` to resolve names to IDs.

### Shared Parameters

- **private**: Boolean. Set to `true` to make the object private, `false` for public.
- **entries**: Array of permission objects. Required if making private and sharing with specific entities.
  - **id**: User ID or Team (Group) ID
  - **type**: `user` or `team`
  - **permission_level**: `read`, `comment`, `edit`, or `create` (optional)
- **priority**: `1` = Urgent, `2` = High, `3` = Normal, `4` = Low
- **due_date**: Unix timestamp in milliseconds
- **due_date_time**: Boolean. Whether the due date includes a time component. Default: `false`.
- **markdown_content**: List description in markdown format. Use instead of `content` for formatted descriptions.
- **assignee**: User ID (use `get_workspace` with `search_member` to resolve names to IDs)
- **return_immediately**: Boolean. If `true` (default), returns the job status/ID immediately. If `false`, waits for the full list creation.
- **Content Filters**: `subtasks`, `custom_fields`, `priority`, `automation`, `include_views`, `attachments`, `comment`, `relationships`, etc. (Boolean)
- **Date Remapping**: `start_date`, `due_date` (ISO strings), `remap_start_date`, `skip_weekends` (Boolean)

## Examples

### Setting List Permissions
**User Prompt:**
```
Make the "Sprint Backlog" list private and share it with the "Engineering" group (ID: 999)
```

**Generated Request (tool: `set_list_permissions`):**
```json
{
  "list_name": "Sprint Backlog",
  "private": true,
  "entries": [
    { "id": 999, "type": "team", "permission_level": "create" }
  ]
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Permissions updated successfully for list \"Sprint Backlog\""
}
```

### Getting List Details
**User Prompt:**
```
Get details for the "Sprint Backlog" list
```

**Generated Request (tool: `get_list`):**
```json
{
  "list_name": "Sprint Backlog"
}
```

**Tool Response:**
```json
{
  "id": "list_backlog",
  "name": "Sprint Backlog",
  "statuses": [
    { "status": "To Do", "color": "#ddd" },
    { "status": "In Progress", "color": "#f1c975" },
    { "status": "Done", "color": "#5dce0f" }
  ],
  "space": { "id": "space123", "name": "Engineering" }
}
```

### Getting All Lists in a Space
**User Prompt:**
```
List all lists in the "Engineering" space
```

**Generated Request (tool: `list_lists`):**
```json
{
  "space_name": "Engineering"
}
```

**Tool Response:**
```json
{
  "lists": [
    { "id": "list1", "name": "Backlog", "content": "", "status": null, "task_count": 12, "due_date": null, "start_date": null, "archived": false },
    { "id": "list2", "name": "Roadmap", "content": "Q2 roadmap items", "status": null, "task_count": 5, "due_date": null, "start_date": null, "archived": false }
  ],
  "count": 2
}
```

### Getting All Lists in a Folder
**User Prompt:**
```
Show me all lists in the "Q1 Goals" folder
```

**Generated Request (tool: `list_lists`):**
```json
{
  "folder_name": "Q1 Goals",
  "space_name": "Engineering"
}
```

**Tool Response:**
```json
{
  "lists": [
    { "id": "list3", "name": "Goals List", "content": "", "status": null, "task_count": 16, "due_date": null, "start_date": null, "archived": false }
  ],
  "count": 1
}
```

### Creating a List in a Space
**User Prompt:**
```
Create a list called "Sprint 42" in the "Engineering" space
```

**Generated Request (tool: `create_list`):**
```json
{
  "name": "Sprint 42",
  "space_name": "Engineering"
}
```

**Tool Response:**
```json
{
  "id": "list_sprint42",
  "name": "Sprint 42",
  "space": { "id": "space123", "name": "Engineering" },
  "message": "List \"Sprint 42\" created successfully"
}
```

### Creating a List in a Folder
**User Prompt:**
```
Create a "Bug Triage" list in the "QA" folder
```

**Generated Request (tool: `create_list`):**
```json
{
  "name": "Bug Triage",
  "folder_name": "QA"
}
```

**Tool Response:**
```json
{
  "id": "list_triage",
  "name": "Bug Triage",
  "folder": { "id": "folder_qa", "name": "QA" },
  "space": { "id": "space123", "name": "Engineering" },
  "message": "List \"Bug Triage\" created successfully in folder \"QA\""
}
```

### Updating a List
**User Prompt:**
```
Update "Sprint Backlog" — set the description, change priority to High, set red status color, and assign to user 12345
```

**Generated Request (tool: `update_list`):**
```json
{
  "list_name": "Sprint Backlog",
  "content": "Current sprint planning items and priorities",
  "priority": 2,
  "status": "red",
  "assignee": 12345
}
```

**Tool Response:**
```json
{
  "id": "list_backlog",
  "name": "Sprint Backlog",
  "content": "Current sprint planning items and priorities",
  "space": { "id": "space123", "name": "Engineering" },
  "url": "https://app.clickup.com/9014370478/v/l/list_backlog",
  "message": "List \"Sprint Backlog\" updated successfully"
}
```

**Alternative: Removing the List Color**
```json
{
  "list_name": "Sprint Backlog",
  "unset_status": true
}
```

### Deleting a List
**User Prompt:**
```
Delete the "Archived Items" list
```

**Generated Request (tool: `delete_list`):**
```json
{
  "list_name": "Archived Items"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "List \"Archived Items\" deleted successfully"
}
```

### Moving a List
**User Prompt:**
```
Move "Sprint 42" to the "Product" space
```

**Generated Request (tool: `move_list`):**
```json
{
  "list_name": "Sprint 42",
  "space_name": "Product"
}
```

**Tool Response:**
```json
{
  "id": "list_sprint42_new",
  "name": "Sprint 42",
  "space": { "id": "space_product", "name": "Product" },
  "message": "List moved successfully to space space_product. New List ID: list_sprint42_new"
}
```

### Creating a List from a Template
**User Prompt:**
```
Create a new list called "Campaign Launch" using the "Marketing Campaign" template in the "Marketing" space
```

**Generated Request (tool: `create_list_from_template`):**
```json
{
  "name": "Campaign Launch",
  "template_name": "Marketing Campaign",
  "space_name": "Marketing"
}
```

**Tool Response:**
```json
{
  "id": "list_campaign123",
  "name": "Campaign Launch",
  "message": "List \"Campaign Launch\" created from template successfully"
}
```
