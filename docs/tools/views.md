[← Back to Documentation](../DOCUMENTATION.md)

# 🖼️ Views

6 atomic tools for managing ClickUp views across Workspaces, Spaces, Folders, and Lists.

## Tool Reference

| Tool | Description | Required Parameters |
|------|-------------|---------------------|
| `list_views` | List views for a space, folder, list, or workspace | `spaceId`, `folderId`, `listId`, or `teamId` (one required) |
| `get_view` | Get a single view | `viewId` |
| `create_view` | Create a new view | `name`, `type`, and `spaceId`/`folderId`/`listId`/`teamId` (one required) |
| `update_view` | Update a view | `viewId` |
| `delete_view` | Delete a view | `viewId` |
| `get_view_tasks` | Get tasks in a view | `viewId` |

## Parameters

| Parameter | Type | Tools | Description |
|-----------|------|-------|-------------|
| `viewId` | string | `get_view`, `update_view`, `delete_view`, `get_view_tasks` | ClickUp view ID |
| `spaceId` | string | `list_views`, `create_view` | ClickUp space ID |
| `folderId` | string | `list_views`, `create_view` | ClickUp folder ID |
| `listId` | string | `list_views`, `create_view` | ClickUp list ID |
| `teamId` | string | `list_views`, `create_view` | ClickUp team ID (for workspace-level views) |
| `name` | string | `create_view`, `update_view` | View name |
| `type` | enum | `create_view`, `update_view` | `list`, `board`, `calendar`, `gantt`, `timeline`, `table`, `mind_map`, `workload`, `activity`, `map`. Highly recommended for `update_view` to ensure correct resource targeting. |
| `grouping` | object | `create_view`, `update_view` | View grouping settings |
| `sorting` | object | `create_view`, `update_view` | View sorting settings |
| `filters` | object | `create_view`, `update_view` | View filter settings |
| `columns` | object | `create_view`, `update_view` | View column settings |
| `teamSidebar` | object | `create_view`, `update_view` | Team sidebar settings |
| `settings` | object | `create_view`, `update_view` | View settings (e.g., `show_task_locations`, `show_subtasks`) |
| `visibility` | string | `update_view` | `public` or `private` |
| `protected` | boolean | `update_view` | Whether the view is protected |
| `protectedNote`| string | `update_view` | Note for protected view |
| `protectedBy` | number | `update_view` | User ID of person who protected the view |
| `page` | number | `get_view_tasks` | Page number for pagination |

## Examples

### List views for a List (tool: `list_views`)

```json
{
  "listId": "123456789"
}
```

### List views for a Space (tool: `list_views`)

```json
{
  "spaceId": "987654321"
}
```

### Get a single view (tool: `get_view`)

```json
{
  "viewId": "3b2a1c"
}
```

### Create a new Board view on a Space (tool: `create_view`)

```json
{
  "spaceId": "987654321",
  "name": "Team Tasks Board",
  "type": "board"
}
```

### Create a new List view on a Workspace (Everything level) (tool: `create_view`)

```json
{
  "teamId": "12345678",
  "name": "Global Everything View",
  "type": "list"
}
```

### Update a view's name and protection (tool: `update_view`)

```json
{
  "viewId": "3b2a1c",
  "name": "Updated Board Name",
  "protected": true,
  "protectedNote": "Locked for production"
}
```

### Get tasks for a view (tool: `get_view_tasks`)

```json
{
  "viewId": "3b2a1c",
  "page": 0
}
```

### Delete a view (tool: `delete_view`)

```json
{
  "viewId": "3b2a1c"
}
```
