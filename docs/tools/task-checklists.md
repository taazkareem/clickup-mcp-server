[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# Task Checklists

Checklists allow you to add structured to-do items within a task. Each task can have multiple checklists, and each checklist can have multiple items that can be assigned, nested, and marked as resolved.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| manage_checklists | Manage task checklists and items | `action` | see action table below |

### Actions

| Action | Description | Required | Optional |
|--------|-------------|----------|---------|
| `create_checklist` | Add a checklist to a task | `task_id` or `task_name`, `name` | `list_name`, `custom_task_id`, `team_id` |
| `edit_checklist` | Rename or reorder a checklist | `checklist_id`, `name` or `position` | `team_id` |
| `delete_checklist` | Delete a checklist and all items | `checklist_id` | `team_id` |
| `create_item` | Add an item to a checklist | `checklist_id`, `name` | `assignee`, `team_id` |
| `edit_item` | Update a checklist item | `checklist_id`, `checklist_item_id` | `name`, `resolved`, `assignee`, `parent`, `team_id` |
| `delete_item` | Remove an item from a checklist | `checklist_id`, `checklist_item_id` | `team_id` |

## Parameters

- **task_id**: Task ID. Obtain from `get_task` or task URL.
- **task_name**: Task Name. Use instead of `task_id` for automated resolution.
- **list_name**: List Name. Recommended when using `task_name` to scope the search.
- **custom_task_id**: Custom Task ID (if enabled in workspace).
- **checklist_id**: Obtained from `create_checklist` or from `get_task` response (checklists are included in task details)
- **checklist_item_id**: Obtained from `create_item` or from `get_task` response
- **resolved**: `true` = checked/complete, `false` = unchecked
- **parent**: Set to another checklist item's ID to nest the item; set to `null` to un-nest
- **assignee**: User ID to assign the item to (use `get_workspace` with `search_member` to resolve names to IDs)

## Examples

### Creating a Checklist with Items
**User Prompt:**
```
Add a "Launch Checklist" to task abc123 with items: update docs, run tests, deploy
```

The agent would call:
1. `manage_checklists` with `action: "create_checklist"`, `task_id: "abc123"`, `name: "Launch Checklist"`
2. `manage_checklists` with `action: "create_item"` for each item using the returned `checklist_id`

### Marking an Item as Complete
**User Prompt:**
```
Mark "update docs" as done on the checklist
```

**Generated Request:**
```json
{
  "action": "edit_item",
  "checklist_id": "abc-123",
  "checklist_item_id": "item-456",
  "resolved": true
}
```

### Creating a Checklist Item
**User Prompt:**
```
Add "Write unit tests" to the Launch Checklist
```

**Generated Request:**
```json
{
  "action": "create_item",
  "checklist_id": "abc-123",
  "name": "Write unit tests"
}
```

**Tool Response:**
```json
{
  "success": true,
  "checklist": {
    "id": "abc-123",
    "name": "Launch Checklist",
    "items": [
      {
        "id": "item-new-001",
        "name": "Write unit tests",
        "resolved": false,
        "assignee": null
      }
    ]
  }
}
```

### Renaming a Checklist
**User Prompt:**
```
Rename the checklist to "Pre-Launch Checklist"
```

**Generated Request:**
```json
{
  "action": "edit_checklist",
  "checklist_id": "abc-123",
  "name": "Pre-Launch Checklist"
}
```

**Tool Response:**
```json
{
  "success": true,
  "checklist": {
    "id": "abc-123",
    "name": "Pre-Launch Checklist"
  }
}
```

### Deleting a Checklist
**User Prompt:**
```
Delete the checklist
```

**Generated Request:**
```json
{
  "action": "delete_checklist",
  "checklist_id": "old-456"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Checklist deleted successfully"
}
```

### Deleting a Checklist Item
**User Prompt:**
```
Remove "Deprecated step" from the checklist
```

**Generated Request:**
```json
{
  "action": "delete_item",
  "checklist_id": "abc-123",
  "checklist_item_id": "item-789"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Checklist item deleted successfully"
}
```
