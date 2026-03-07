[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# List Management

Create, update, move, and delete lists within your ClickUp workspace. Lists can exist directly in a space or inside a folder.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| manage_lists | Manage lists in a space or folder | `action` | see action table below |

### Actions

| Action | Description | Required | Optional |
|--------|-------------|----------|---------|
| `create` | Create a list in a space or folder | `name`, and one of: `space_id`/`space_name` (folderless) or `folder_id`/`folder_name` (in folder) | `content`, `due_date`, `priority`, `assignee`, `status`, `team_id` |
| `get` | Get list details | `list_id` or `list_name` | `team_id` |
| `get_lists` | Get all folderless lists in a space | `space_id` or `space_name` | `team_id` |
| `update` | Update list properties | `list_id` or `list_name`, at least one of `name`/`content`/`status` | `team_id` |
| `delete` | Delete a list | `list_id` or `list_name` | `team_id` |
| `move` | Move list to a different space or folder (high-integrity) | `list_id` or `list_name`, plus destination `space_id`/`space_name` or `folder_id`/`folder_name` | `allow_destructive_fallback`, `team_id` |

> **Note on move:** Uses a High-Integrity Move — creates a new list at destination, moves all tasks via the ClickUp v3 `home_list` endpoint (preserving task IDs), then deletes the source. The List ID will change.

> **Note on create:** If both `folder_id`/`folder_name` and `space_id`/`space_name` are provided, folder takes precedence and the list is created inside the folder.

## Parameters

- **priority**: `1` = Urgent, `2` = High, `3` = Normal, `4` = Low
- **due_date**: Unix timestamp in milliseconds
- **assignee**: User ID (use `get_workspace` with `search_member` to resolve names to IDs)

## Examples

### Getting List Details
**User Prompt:**
```
Get details for the "Sprint Backlog" list
```

**Generated Request:**
```json
{
  "action": "get",
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

**Generated Request:**
```json
{
  "action": "get_lists",
  "space_name": "Engineering"
}
```

**Tool Response:**
```json
{
  "lists": [
    { "id": "list1", "name": "Backlog" },
    { "id": "list2", "name": "Roadmap" }
  ],
  "count": 2
}
```

### Creating a List in a Space
**User Prompt:**
```
Create a list called "Sprint 42" in the "Engineering" space
```

**Generated Request:**
```json
{
  "action": "create",
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

**Generated Request:**
```json
{
  "action": "create",
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
Update "Sprint Backlog" description to "Current sprint planning items and priorities"
```

**Generated Request:**
```json
{
  "action": "update",
  "list_name": "Sprint Backlog",
  "content": "Current sprint planning items and priorities"
}
```

**Tool Response:**
```json
{
  "id": "list_backlog",
  "name": "Sprint Backlog",
  "content": "Current sprint planning items and priorities",
  "message": "List \"Sprint Backlog\" updated successfully"
}
```

### Deleting a List
**User Prompt:**
```
Delete the "Archived Items" list
```

**Generated Request:**
```json
{
  "action": "delete",
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

**Generated Request:**
```json
{
  "action": "move",
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
