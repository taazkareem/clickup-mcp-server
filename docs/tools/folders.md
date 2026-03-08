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
| `set_permissions` | Update folder privacy and sharing (ACLs) | `folder_id` or `folder_name`, and `private` | `entries`, `team_id` |

> **Note on move:** Uses a High-Integrity Move workaround — creates a new folder at destination, migrates all lists and tasks, then deletes the source. The Folder ID will change.

> **Note on set_permissions:** Uses the ClickUp v3 API. `private` is a boolean. `entries` is an array of `{ id: number, type: string, permission_level?: string }`. `type` can be `user` or `team` (group).

## Parameters

- **private**: Boolean. Set to `true` to make the object private, `false` for public.
- **entries**: Array of permission objects. Required if making private and sharing with specific entities.
  - **id**: User ID or Team (Group) ID
  - **type**: `user` or `team`
  - **permission_level**: `read`, `comment`, `edit`, or `create` (optional)

## Examples

### Setting Folder Permissions
**User Prompt:**
```
Make the "Q2 Projects" folder private and share it with user 12345
```

**Generated Request:**
```json
{
  "action": "set_permissions",
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
