[← Back to Documentation Index](../DOCUMENTATION.md)

# Multi-List (TIML)

Tasks in Multiple Lists (TIML) allows a single task to appear in multiple lists simultaneously. The task retains its original ID and all data (comments, history, custom fields) across all lists.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| add_task_to_list | Add a task to an additional list | `task` (Name or ID) | `listId`, `listName`, `taskListName` |
| remove_task_from_list | Remove a task from a specific list (does NOT delete the task) | `task` (Name or ID) | `listId`, `listName`, `taskListName` |

## Notes

- A task must remain in at least one list — you cannot remove it from its last list
- TIML is also used internally by `move_task` for high-integrity moves (add to destination, then remove from source)
- TIML availability depends on your ClickUp workspace plan

## Examples

### Adding a Task to Multiple Lists
**User Prompt:**
```
Add the task "Shared Component" to the "Frontend" list as well
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "task": "Shared Component",
  "listName": "Frontend"
}
```

### Removing a Task from a List
**User Prompt:**
```
Remove "Shared Component" from the "Backend" list (keep it in Frontend)
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "task": "Shared Component",
  "listName": "Backend"
}
```
