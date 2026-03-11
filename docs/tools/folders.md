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
| `create_folder_from_template` | Create a folder from a template | `name`, `template_id`, `space_id` or `space_name` | `return_immediately`, `start_date`, `due_date`, `remap_start_date`, `skip_weekends`, `subtasks`, `custom_fields`, `priority`, `automation`, `include_views`, `old_assignees`, `old_due_date`, `old_start_date`, `old_tags`, `old_statuses`, `old_followers`, `attachments`, `comment`, `comment_attachments`, `recur_settings`, `old_checklists`, `relationships`, `external_dependencies`, `internal_dependencies`, `team_id` |

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

### create_folder_from_template

- **name**: Name for the new folder. Required.
- **template_id**: Folder template ID. Required.
- **space_id**: Space ID (preferred).
- **space_name**: Space name (alternative to space_id).
- **return_immediately**: Boolean. Return folder ID immediately without waiting for full creation. Default: `true`.
- **start_date**: Project start date for remapping task dates (ISO 8601).
- **due_date**: Project due date for remapping task dates (ISO 8601).
- **remap_start_date**: Boolean. Remap task start dates relative to project start date.
- **skip_weekends**: Boolean. Skip weekends when remapping dates.
- **subtasks**: Boolean. Import subtasks from template.
- **custom_fields**: Boolean. Import Custom Fields from template.
- **priority**: Boolean. Import task priorities from template.
- **automation**: Boolean. Import automations from template.
- **include_views**: Boolean. Import views from template.
- **old_assignees**: Boolean. Import task assignees from template.
- **old_due_date**: Boolean. Import task due dates from template.
- **old_start_date**: Boolean. Import task start dates from template.
- **old_tags**: Boolean. Import task tags from template.
- **old_statuses**: Boolean. Import task status settings from template.
- **old_followers**: Boolean. Import task watchers from template.
- **attachments**: Boolean. Import task attachments from template.
- **comment**: Boolean. Import task comments from template.
- **comment_attachments**: Boolean. Import task comment attachments from template.
- **recur_settings**: Boolean. Import task recurring settings from template.
- **old_checklists**: Boolean. Import task checklists from template.
- **relationships**: Boolean. Import task relationships from template.
- **external_dependencies**: Boolean. Import external task dependencies from template.
- **internal_dependencies**: Boolean. Import internal task dependencies from template.

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

### Creating a Folder from a Template
**User Prompt:**
```
Create a folder called "Sprint Planning" in the "Engineering" space using template 123abc
```

**Generated Request (tool: `create_folder_from_template`):**
```json
{
  "name": "Sprint Planning",
  "template_id": "123abc",
  "space_name": "Engineering",
  "subtasks": true,
  "custom_fields": true,
  "include_views": true
}
```

**Tool Response:**
```json
{
  "id": "folder_sprint",
  "name": "Sprint Planning",
  "space": {
    "id": "space123",
    "name": "Engineering"
  },
  "message": "Folder \"Sprint Planning\" created from template successfully"
}
```
