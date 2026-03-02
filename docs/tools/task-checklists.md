[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# Task Checklists

Checklists allow you to add structured to-do items within a task. Each task can have multiple checklists, and each checklist can have multiple items that can be assigned, nested, and marked as resolved.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| create_checklist | Add a checklist to a task | `task` (Name or ID), `name` | `listName` |
| edit_checklist | Rename or reorder a checklist | `checklistId` | `name`, `position` |
| delete_checklist | Delete a checklist and all its items | `checklistId` | None |
| create_checklist_item | Add an item to a checklist | `checklistId`, `name` | `assignee` (user ID) |
| edit_checklist_item | Update a checklist item | `checklistId`, `itemId` | `name`, `resolved`, `assignee`, `parent` (nest under another item) |
| delete_checklist_item | Remove an item from a checklist | `checklistId`, `itemId` | None |

## Parameters

- **checklistId**: Obtained from `create_checklist` or from `get_task` response (checklists are included in task details)
- **itemId**: Obtained from `create_checklist_item` or from `get_task` response
- **resolved**: `true` = checked/complete, `false` = unchecked
- **parent**: Set to another checklist item's ID to nest the item; set to `null` to un-nest
- **assignee**: User ID to assign the item to (use `find_member_by_name` to resolve names to IDs)

## Examples

### Creating a Checklist with Items
**User Prompt:**
```
Add a "Launch Checklist" to the task "Release v2.0" with items: update docs, run tests, deploy
```

The agent would call:
1. `create_checklist` with `task: "Release v2.0"`, `name: "Launch Checklist"`
2. `create_checklist_item` for each item using the returned `checklistId`

### Marking Items as Complete
**User Prompt:**
```
Mark "update docs" as done on the checklist
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "checklistId": "abc-123",
  "itemId": "item-456",
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
  "team_id": "9876543210",
  "checklistId": "abc-123",
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
        "assignee": null,
        "date_created": "2024-03-16T12:00:00.000Z"
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
  "team_id": "9876543210",
  "checklistId": "abc-123",
  "name": "Pre-Launch Checklist"
}
```

**Tool Response:**
```json
{
  "success": true,
  "checklist": {
    "id": "abc-123",
    "name": "Pre-Launch Checklist",
    "date_updated": "2024-03-16T12:15:00.000Z"
  }
}
```

### Deleting a Checklist
**User Prompt:**
```
Delete the "Old Checklist"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "checklistId": "old-456"
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
  "team_id": "9876543210",
  "checklistId": "abc-123",
  "itemId": "item-789"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Checklist item deleted successfully"
}
```
