# 🏷️ Custom Fields Management

The `manage_custom_fields` tool provides a unified interface for managing both custom field **definitions** (schema) and their **values** on specific tasks.

## Tool: `manage_custom_fields`

Consolidated tool for CRUD operations on custom field definitions and values.

### Actions & Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `action` | enum | ✅ | `list`, `create`, `set_value`, `remove_value` |
| `listId` | string | | ClickUp list ID. Required for `create`; optional for `list`. |
| `listName` | string | | List name (resolved automatically). |
| `folderId` | string | | Folder ID. Optional for `list`. |
| `spaceId` | string | | Space ID. Optional for `list`. |
| `taskId` | string | | ClickUp task ID. Required for `set_value` and `remove_value`. |
| `fieldId` | string | | UUID of the custom field. Required if `fieldName` is not provided. |
| `fieldName` | string | | Name of the field (resolved automatically). |
| `name` | string | | Field name. Required for `create`. |
| `type` | enum | | Field type for `create` (e.g., `short_text`, `number`, `drop_down`, `date`). |
| `value` | any | | Value to set for `set_value`. Format depends on field type. |

### Field Types (for `create`)
Supported types: `short_text`, `number`, `drop_down`, `date`, `checkbox`, `users`, `email`, `url`, `currency`, `text`, `tasks`, `labels`, `phone`, `location`, `rating`, `progress`, `emoji`, `people`.

---

## Usage Examples

### 1. List Field Definitions
Retrieve all custom fields available on a specific list.

**User Prompt:**
> "Show me the custom fields for the 'Development' list."

**Generated Request:**
```json
{
  "action": "list",
  "listName": "Development"
}
```

### 2. Create a New Custom Field
Add a new "Priority Score" number field to a list.

**User Prompt:**
> "Add a new number field called 'Priority Score' to the 'Feature Requests' list."

**Generated Request:**
```json
{
  "action": "create",
  "listName": "Feature Requests",
  "name": "Priority Score",
  "type": "number"
}
```

### 3. Set a Field Value on a Task
Update a specific task's custom field by name.

**User Prompt:**
> "Set the 'Priority Score' for task 'Fix login bug' to 85."

**Generated Request:**
```json
{
  "action": "set_value",
  "taskName": "Fix login bug",
  "fieldName": "Priority Score",
  "value": 85
}
```

### 4. Clear a Field Value
Remove the data from a custom field on a task.

**User Prompt:**
> "Clear the 'Priority Score' for task #86afuk2fg."

**Generated Request:**
```json
{
  "action": "remove_value",
  "taskId": "86afuk2fg",
  "fieldName": "Priority Score"
}
```

---

## 🛡️ Security & Constraints

- **Structural Deletion**: The ClickUp API does **not** support deleting field *definitions* (removing the field from the list entirely). This must be done in the ClickUp UI.
- **Data Protection**: The `remove_value` action is gated by the `delete_task` security flag. If task deletions are disabled for your persona, this action will be blocked to prevent accidental data loss.
- **Field Resolution**: The tool automatically searches the list → folder → space → workspace hierarchy to find fields by name.
