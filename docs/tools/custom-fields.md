# 🏷️ Custom Fields Management

4 atomic tools for managing custom field **definitions** (schema) and their **values** on specific tasks.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|---------------------|---------------------|
| `list_custom_fields` | List field definitions for a list, folder, or space | `listId` or `listName` (preferred) | `folderId`, `spaceId`, `team_id` |
| `create_custom_field` | Add a new field definition to a list | `listId` or `listName`, `name`, `type` | `team_id` |
| `set_custom_field_value` | Set a field value on a task | `taskId` or `taskName`, `fieldId` or `fieldName`, `value` | `listName`, `team_id` |
| `remove_custom_field_value` | Clear a field value from a task | `taskId` or `taskName`, `fieldId` or `fieldName` | `listName`, `team_id` |

### Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `listId` | string | ClickUp list ID. Required for `create_custom_field`; optional for `list_custom_fields`. |
| `listName` | string | List name (resolved automatically). |
| `folderId` | string | Folder ID. Optional for `list_custom_fields`. |
| `spaceId` | string | Space ID. Optional for `list_custom_fields`. |
| `taskId` | string | ClickUp task ID. Required for `set_custom_field_value` and `remove_custom_field_value`. |
| `fieldId` | string | UUID of the custom field. Required if `fieldName` is not provided. |
| `fieldName` | string | Name of the field (resolved automatically). |
| `name` | string | Field name. Required for `create_custom_field`. |
| `type` | enum | Field type for `create_custom_field` (e.g., `short_text`, `number`, `drop_down`, `date`). |
| `value` | any | Value to set for `set_custom_field_value`. Format depends on field type. |

### Field Types (for `create_custom_field`)
Supported types: `short_text`, `number`, `drop_down`, `date`, `checkbox`, `users`, `email`, `url`, `currency`, `text`, `tasks`, `labels`, `phone`, `location`, `rating`, `progress`, `emoji`, `people`.

---

## Usage Examples

### 1. List Field Definitions (tool: `list_custom_fields`)
Retrieve all custom fields available on a specific list.

**User Prompt:**
> "Show me the custom fields for the 'Development' list."

**Generated Request:**
```json
{
  "listName": "Development"
}
```

### 2. Create a New Custom Field (tool: `create_custom_field`)
Add a new "Priority Score" number field to a list.

**User Prompt:**
> "Add a new number field called 'Priority Score' to the 'Feature Requests' list."

**Generated Request:**
```json
{
  "listName": "Feature Requests",
  "name": "Priority Score",
  "type": "number"
}
```

### 3. Set a Field Value on a Task (tool: `set_custom_field_value`)
Update a specific task's custom field by name.

**User Prompt:**
> "Set the 'Priority Score' for task 'Fix login bug' to 85."

**Generated Request:**
```json
{
  "taskName": "Fix login bug",
  "fieldName": "Priority Score",
  "value": 85
}
```

### 4. Clear a Field Value (tool: `remove_custom_field_value`)
Remove the data from a custom field on a task.

**User Prompt:**
> "Clear the 'Priority Score' for task #86afuk2fg."

**Generated Request:**
```json
{
  "taskId": "86afuk2fg",
  "fieldName": "Priority Score"
}
```

---

## 🛡️ Security & Constraints

- **Structural Deletion**: The ClickUp API does **not** support deleting field *definitions* (removing the field from the list entirely). This must be done in the ClickUp UI.
- **Data Protection**: The `remove_custom_field_value` tool is gated by the `delete_task` security flag. If destructive actions are disabled for your persona, this tool will be blocked to prevent accidental data loss.
- **Field Resolution**: The tools automatically search the list → folder → space → workspace hierarchy to find fields by name.
