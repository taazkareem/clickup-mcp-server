[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# Folder Management

Create, update, move, and delete folders to organize lists within your ClickUp spaces. Each operation is its own atomic tool.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| `list_folders` | List all folders in a space | `space_id` or `space_name` | `archived`, `detail_level`, `team_id` |
| `get_folder` | Get folder details | `folder_id` or `folder_name` | `space_id`/`space_name` (for name lookup), `team_id` |
| `create_folder` | Create a new folder | `name`, `space_id` or `space_name` | `override_statuses`, `team_id` |
| `update_folder` | Update folder properties | `folder_id` or `folder_name`, at least one of `name`/`override_statuses` | `space_id`/`space_name`, `team_id` |
| `delete_folder` | Delete a folder | `folder_id` or `folder_name` | `space_id`/`space_name` (for name lookup), `team_id` |
| `move_folder` | Move folder to a different space (high-integrity) | `folder_id` or `folder_name`, `space_id` or `space_name` (destination) | `allow_destructive_fallback`, `team_id` |
| `set_folder_permissions` | Update folder privacy and sharing (ACLs) | `folder_id` or `folder_name`, `private` | `entries`, `team_id` |

> **Note on move_folder:** Uses a High-Integrity Move workaround — creates a new folder at destination, migrates all lists and tasks, then deletes the source. The Folder ID will change.

> **Note on set_folder_permissions:** Uses the ClickUp v3 API. `private` is a boolean. `entries` is an array of `{ id: number, type: string, permission_level?: string }`. `type` can be `user` or `team` (group).

## Parameters

### list_folders

- **space_id**: Space ID (preferred over space_name).
- **space_name**: Space name (alternative to space_id).
- **archived**: Boolean. If `true`, returns archived folders. Default: `false`.
- **detail_level**: `"names"` returns `{id, name, task_count}` only for efficient navigation. `"detailed"` (default) returns full metadata.

### set_folder_permissions

- **private**: Boolean. Set to `true` to make the object private, `false` for public.
- **entries**: Array of permission objects. Required if making private and sharing with specific entities.
  - **id**: User ID or Team (Group) ID
  - **type**: `user` or `team`
  - **permission_level**: `read`, `comment`, `edit`, or `create` (optional)

## Examples

### Listing Folders in a Space
**User Prompt:**
```
List all folders in the "Engineering" space
```

**Generated Request (tool: `list_folders`):**
```json
{
  "space_name": "Engineering"
}
```

**Tool Response:**
```json
{
  "folders": [
    {
      "id": "folder_dev",
      "name": "Development Projects",
      "task_count": "42",
      "hidden": false,
      "space": { "id": "space123", "name": "Engineering" }
    }
  ]
}
```

### Setting Folder Permissions
**User Prompt:**
```
Make the "Q2 Projects" folder private and share it with user 12345
```

**Generated Request (tool: `set_folder_permissions`):**
```json
{
  "folder_name": "Q2 Projects",
  "private": true,
  "entries": [
    { "id": 12345, "type": "user", "permission_level": "edit" }
  ]
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Permissions updated successfully for folder \"Q2 Projects\""
}
```

### Getting Folder Details
**User Prompt:**
```
Get details for the "Development Projects" folder
```

**Generated Request (tool: `get_folder`):**
```json
{
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

**Generated Request (tool: `create_folder`):**
```json
{
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

**Generated Request (tool: `update_folder`):**
```json
{
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

**Generated Request (tool: `delete_folder`):**
```json
{
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

**Generated Request (tool: `move_folder`):**
```json
{
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
