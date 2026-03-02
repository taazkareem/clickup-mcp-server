[← Back to Documentation Index](../DOCUMENTATION.md)
<br>
[← Back to README](../../README.md)

# Custom Fields

Custom fields let you store structured metadata on tasks. Use `get_custom_fields` to discover available fields at any scope (workspace, space, folder, or list), then `set_task_custom_field` to set values. The `set_task_custom_field` tool automatically searches for fields across all scopes (list → folder → space → workspace) so you don't need to know where the field is defined.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| get_custom_fields | Get custom field definitions at any scope level | None (defaults to workspace) | `listId`, `listName`, `folderId`, `folderName`, `spaceId`, `spaceName` |
| set_task_custom_field | Set a custom field value on a task | `task` (Name or ID), `fieldName` (or `fieldId`), `value` | `listName` |

## Scope Resolution

The scope of `get_custom_fields` depends on which parameters are provided (most specific wins):
- **List**: `listId` or `listName` — fields defined on a specific list
- **Folder**: `folderId` or `folderName` — fields defined on a folder
- **Space**: `spaceId` or `spaceName` — fields defined on a space
- **Workspace**: no params — all workspace-wide fields

## Custom Field Value Types

The `value` parameter type depends on the custom field type:
- **Text**: String value
- **Number**: Numeric value
- **Date**: Unix timestamp in milliseconds
- **Checkbox**: Boolean (`true`/`false`)
- **Dropdown**: Option name or UUID (names are resolved automatically)
- **Labels**: Array of label names or UUIDs (names are resolved automatically)

## Examples

### Discovering Custom Fields
**User Prompt:**
```
What custom fields are available on the "Sprint Backlog" list?
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "listName": "Sprint Backlog"
}
```

### Workspace-Wide Custom Fields
**User Prompt:**
```
Show me all custom fields in my workspace
```

**Generated Request:**
```json
{
  "team_id": "9876543210"
}
```

### Setting a Custom Field
**User Prompt:**
```
Set the "Story Points" field to 5 on the task "Implement Login"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "task": "Implement Login",
  "fieldName": "Story Points",
  "value": 5
}
```
