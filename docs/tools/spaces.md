[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# Space Management

Manage ClickUp spaces — list, get, create, update, and delete spaces in your workspace. Each operation is its own atomic tool.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| `list_spaces` | List all spaces in workspace | — | `archived`, `team_id` |
| `get_space` | Get a single space | `spaceId` or `spaceName` | `team_id` |
| `create_space` | Create a new space | `name` | `color`, `private`, `admin_can_manage`, `multiple_assignees`, `features`, `team_id` |
| `update_space` | Update a space | `spaceId` or `spaceName` | `name`, `color`, `private`, `admin_can_manage`, `multiple_assignees`, `features`, `team_id` |
| `delete_space` | Delete a space | `spaceId` or `spaceName` | `team_id` |
| `set_space_permissions` | Update space privacy and sharing (ACLs) | `spaceId` or `spaceName`, `private`, `entries` | `team_id` |

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| archived | boolean | Filter for archived spaces only (`list_spaces`). Defaults to false (active spaces). |
| spaceId | string | Space ID (preferred for get/update/delete/set_permissions) |
| spaceName | string | Space name (resolved via fuzzy matching if spaceId not provided) |
| name | string | Name for the space (required for create, optional for update) |
| color | string | Space color hex code (e.g. `#7B68EE`) |
| private | boolean | Whether the space is private (required for `set_permissions`) |
| admin_can_manage | boolean | Whether admins can manage without being a member |
| multiple_assignees | boolean | Enable multiple assignees on tasks |
| features | object | Feature toggles — each key (e.g. `due_dates`, `time_tracking`, `tags`, `checklists`, `custom_fields`, `time_estimates`) maps to an object with `enabled: boolean`. `due_dates` also supports `start_date`, `remap_due_dates`, `remap_closed_due_date`. |
| entries | array | Array of permission objects `{ id: number, type: string, permission_level?: string }`. Required if making private and sharing with specific entities. |

## Examples

### Setting Space Permissions
**User Prompt:**
```
Set the "Engineering" space to private and share it with group 777
```

**Generated Request (tool: `set_space_permissions`):**
```json
{
  "spaceName": "Engineering",
  "private": true,
  "entries": [
    { "id": 777, "type": "team", "permission_level": "read" }
  ]
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Permissions updated successfully for space \"Engineering\"."
}
```

### Listing All Spaces
**User Prompt:**
```
Show me all spaces in my workspace
```

**Generated Request (tool: `list_spaces`):**
```json
{}
```

**Tool Response:**
```json
{
  "spaces": [
    {
      "id": "12345",
      "name": "Engineering",
      "private": false,
      "archived": false,
      "statuses": ["to do", "in progress", "done"]
    },
    {
      "id": "67890",
      "name": "Marketing",
      "private": true,
      "archived": false,
      "statuses": ["open", "in review", "complete"]
    }
  ],
  "count": 2
}
```

### Getting Space Details
**User Prompt:**
```
Get details for the Engineering space
```

**Generated Request (tool: `get_space`):**
```json
{
  "spaceName": "Engineering"
}
```

**Tool Response:**
```json
{
  "id": "12345",
  "name": "Engineering",
  "private": false,
  "archived": false,
  "color": "#7B68EE",
  "statuses": [
    { "status": "to do", "type": "open", "color": "#d3d3d3" },
    { "status": "in progress", "type": "custom", "color": "#4194f6" },
    { "status": "done", "type": "closed", "color": "#6bc950" }
  ],
  "multiple_assignees": true,
  "features": {
    "due_dates": { "enabled": true, "start_date": true },
    "time_tracking": { "enabled": true },
    "tags": { "enabled": true }
  }
}
```

### Creating a Space
**User Prompt:**
```
Create a private space called "Design" with time tracking enabled
```

**Generated Request (tool: `create_space`):**
```json
{
  "name": "Design",
  "private": true,
  "features": {
    "time_tracking": { "enabled": true }
  }
}
```

**Tool Response:**
```json
{
  "id": "11111",
  "name": "Design",
  "private": true,
  "archived": false,
  "color": null,
  "statuses": [
    { "status": "to do", "type": "open", "color": "#d3d3d3" },
    { "status": "complete", "type": "closed", "color": "#6bc950" }
  ],
  "multiple_assignees": false,
  "features": {
    "time_tracking": { "enabled": true }
  },
  "message": "Space \"Design\" created successfully."
}
```

### Updating a Space
**User Prompt:**
```
Rename the "Design" space to "Design & UX" and enable multiple assignees
```

**Generated Request (tool: `update_space`):**
```json
{
  "spaceName": "Design",
  "name": "Design & UX",
  "multiple_assignees": true
}
```

**Tool Response:**
```json
{
  "id": "11111",
  "name": "Design & UX",
  "private": true,
  "archived": false,
  "multiple_assignees": true,
  "message": "Space \"Design & UX\" updated successfully."
}
```

### Deleting a Space
**User Prompt:**
```
Delete the "Old Projects" space
```

**Generated Request (tool: `delete_space`):**
```json
{
  "spaceName": "Old Projects"
}
```

**Tool Response:**
```json
{
  "message": "Space \"22222\" deleted successfully."
}
```
