[← Back to Documentation Index](../DOCUMENTATION.md)
<br>
[← Back to README](../../README.md)

# Space Management

Manage ClickUp spaces — list, get, create, update, and delete spaces in your workspace. All operations are consolidated into a single `manage_space` tool using the `action` parameter.

## Tool Reference

| Tool | Action | Description | Required Parameters | Optional Parameters |
|------|--------|-------------|-------------------|-------------------|
| manage_space | `list` | List all spaces in workspace | `action` | None |
| manage_space | `get` | Get a single space | `action` and either `spaceId` or `spaceName` | None |
| manage_space | `create` | Create a new space | `action`, `name` | `color`, `private`, `admin_can_manage`, `multiple_assignees`, `features` |
| manage_space | `update` | Update a space | `action` and either `spaceId` or `spaceName` | `name`, `color`, `private`, `admin_can_manage`, `multiple_assignees`, `features` |
| manage_space | `delete` | Delete a space | `action` and either `spaceId` or `spaceName` | None |

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| action | string | `list`, `get`, `create`, `update`, or `delete` |
| spaceId | string | Space ID (preferred for get/update/delete) |
| spaceName | string | Space name (resolved via fuzzy matching if spaceId not provided) |
| name | string | Name for the space (required for create, optional for update) |
| color | string | Space color hex code (e.g. `#7B68EE`) |
| private | boolean | Whether the space is private |
| admin_can_manage | boolean | Whether admins can manage without being a member |
| multiple_assignees | boolean | Enable multiple assignees on tasks |
| features | object | Feature toggles — each key (e.g. `due_dates`, `time_tracking`, `tags`, `checklists`, `custom_fields`, `time_estimates`) maps to an object with `enabled: boolean`. `due_dates` also supports `start_date`, `remap_due_dates`, `remap_closed_due_date`. |

## Examples

### Listing All Spaces
**User Prompt:**
```
Show me all spaces in my workspace
```

**Generated Request:**
```json
{
  "action": "list"
}
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

**Generated Request:**
```json
{
  "action": "get",
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

**Generated Request:**
```json
{
  "action": "create",
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

**Generated Request:**
```json
{
  "action": "update",
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

**Generated Request:**
```json
{
  "action": "delete",
  "spaceName": "Old Projects"
}
```

**Tool Response:**
```json
{
  "message": "Space \"22222\" deleted successfully."
}
```
