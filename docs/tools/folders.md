[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# Folder Management

Create, update, move, and delete folders to organize lists within your ClickUp spaces.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| manage_folders | Manage folders in a space | `action` | see action table below |

### Actions

| Action | Description | Required | Optional |
|--------|-------------|----------|---------|
| `create` | Create a new folder | `name`, `space_id` or `space_name` | `override_statuses`, `team_id` |
| `get` | Get folder details | `folder_id` or `folder_name` | `space_id`/`space_name` (for name lookup), `team_id` |
| `update` | Update folder properties | `folder_id` or `folder_name`, at least one of `name`/`override_statuses` | `space_id`/`space_name`, `team_id` |
| `delete` | Delete a folder | `folder_id` or `folder_name` | `space_id`/`space_name` (for name lookup), `team_id` |
| `move` | Move folder to a different space (high-integrity) | `folder_id` or `folder_name`, `space_id` or `space_name` (destination) | `allow_destructive_fallback`, `team_id` |

> **Note on move:** Uses a High-Integrity Move workaround — creates a new folder at destination, migrates all lists and tasks, then deletes the source. The Folder ID will change.

## Examples

### Getting Folder Details
**User Prompt:**
```
Get details for the "Development Projects" folder
```

**Generated Request:**
```json
{
  "action": "get",
  "folder_name": "Development Projects"
}
```

**Tool Response:**
```json
{
  "id": "folder_dev",
  "name": "Development Projects",
  "space": {
    "id": "space123",
    "name": "Engineering"
  },
  "statuses": []
}
```

### Creating a Folder
**User Prompt:**
```
Create a folder called "Q2 Projects" in the "Engineering" space
```

**Generated Request:**
```json
{
  "action": "create",
  "name": "Q2 Projects",
  "space_name": "Engineering"
}
```

**Tool Response:**
```json
{
  "id": "folder_q2",
  "name": "Q2 Projects",
  "space": {
    "id": "space123",
    "name": "Engineering"
  },
  "message": "Folder \"Q2 Projects\" created successfully"
}
```

### Updating a Folder
**User Prompt:**
```
Rename "Development Projects" to "Active Development Projects"
```

**Generated Request:**
```json
{
  "action": "update",
  "folder_name": "Development Projects",
  "name": "Active Development Projects"
}
```

**Tool Response:**
```json
{
  "id": "folder_dev",
  "name": "Active Development Projects",
  "space": {
    "id": "space123",
    "name": "Engineering"
  },
  "message": "Folder \"Active Development Projects\" updated successfully"
}
```

### Deleting a Folder
**User Prompt:**
```
Delete the "Deprecated Projects" folder in the "Engineering" space
```

**Generated Request:**
```json
{
  "action": "delete",
  "folder_name": "Deprecated Projects",
  "space_name": "Engineering"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Folder \"Deprecated Projects\" deleted successfully"
}
```

### Moving a Folder
**User Prompt:**
```
Move "Q2 Projects" to the "Archive" space
```

**Generated Request:**
```json
{
  "action": "move",
  "folder_name": "Q2 Projects",
  "space_name": "Archive"
}
```

**Tool Response:**
```json
{
  "id": "folder_q2_new",
  "name": "Q2 Projects",
  "space": {
    "id": "space_archive",
    "name": "Archive"
  },
  "message": "Folder moved successfully to space space_archive. New Folder ID: folder_q2_new"
}
```
