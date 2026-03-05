[← Back to Documentation](../DOCUMENTATION.md)  

# 🖼️ Views

The `manage_views` tool provides consolidated CRUD for ClickUp views across Workspaces, Spaces, Folders, and Lists — 11 API endpoints in one tool.

## Tool Reference

| Tool | Actions | Description |
|------|---------|-------------|
| `manage_views` | `list`, `get`, `create`, `update`, `delete`, `get_tasks` | Manage views and retrieve tasks from views in your ClickUp workspace |

## Parameters

| Parameter | Type | Required | Actions | Description |
|-----------|------|----------|---------|-------------|
| `action` | enum | ✅ Always | all | `list`, `get`, `create`, `update`, `delete`, `get_tasks` |
| `viewId` | string | ✅ | `get`, `update`, `delete`, `get_tasks` | ClickUp view ID |
| `spaceId` | string | | `list`, `create` | ClickUp space ID |
| `folderId` | string | | `list`, `create` | ClickUp folder ID |
| `listId` | string | | `list`, `create` | ClickUp list ID |
| `teamId` | string | | `list` | ClickUp team ID (for workspace-level views) |
| `name` | string | ✅ for `create` | `create`, `update` | View name |
| `type` | enum | ✅ for `create` | `create`, `update` | `list`, `board`, `calendar`, `gantt`, `timeline`, `table`, `mind_map`, `workload`, `activity`, `map`. Highly recommended for `update` to ensure correct resource targeting. |
| `grouping` | object | | `create`, `update` | View grouping settings |
| `sorting` | object | | `create`, `update` | View sorting settings |
| `filters` | object | | `create`, `update` | View filter settings |
| `columns` | object | | `create`, `update` | View column settings |
| `teamSidebar` | object | | `create`, `update` | Team sidebar settings |
| `settings` | object | | `create`, `update` | View settings (e.g., `show_task_locations`, `show_subtasks`) |
| `visibility` | string | | `update` | `public` or `private` |
| `protected` | boolean | | `update` | Whether the view is protected |
| `protectedNote`| string | | `update` | Note for protected view |
| `protectedBy` | number | | `update` | User ID of person who protected the view |
| `page` | number | | `get_tasks` | Page number for pagination |

## Examples

### List views for a List

```json
{
  "action": "list",
  "listId": "123456789"
}
```

### List views for a Space

```json
{
  "action": "list",
  "spaceId": "987654321"
}
```

### Get a single view

```json
{
  "action": "get",
  "viewId": "3b2a1c"
}
```

### Create a new List view on a Space

```json
{
  "action": "create",
  "spaceId": "987654321",
  "name": "Team Tasks Board",
  "type": "board"
}
```

### Update a view's name and protection

```json
{
  "action": "update",
  "viewId": "3b2a1c",
  "name": "Updated Board Name",
  "protected": true,
  "protectedNote": "Locked for production"
}
```

### Get tasks for a view

```json
{
  "action": "get_tasks",
  "viewId": "3b2a1c",
  "page": 0
}
```

### Delete a view

```json
{
  "action": "delete",
  "viewId": "3b2a1c"
}
```
