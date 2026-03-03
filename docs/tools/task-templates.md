[← Back to Documentation Index](../DOCUMENTATION.md)
<br>
[← Back to README](../../README.md)

# Task Templates

Discover and use task templates to create pre-populated tasks. Templates define default task properties (name, description, checklists, custom fields, etc.) so agents can spawn standardized tasks without building descriptions manually.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| get_task_templates | Get available templates in the workspace | None | `page` (0-indexed pagination) |
| create_task_from_template | Create a task from a template | `templateId` and either `listId` or `listName` | `name` (override default task name) |

## Parameters

- **templateId**: The ID of the template to use (get from `get_task_templates`)
- **listId**: Target list ID to create the task in (preferred over `listName`)
- **listName**: Target list name to create the task in (resolved via workspace lookup)
- **name**: Override the default task name defined in the template
- **page**: Page number for pagination when listing templates (0-indexed, default 0)

## Examples

### Listing Task Templates
**User Prompt:**
```
What task templates are available?
```

**Generated Request:**
```json
{}
```

**Tool Response:**
```json
{
  "templates": [
    {
      "id": "abc123",
      "name": "Bug Report",
      "task_count": 1
    },
    {
      "id": "def456",
      "name": "Feature Request",
      "task_count": 1
    }
  ],
  "count": 2
}
```

### Creating a Task from a Template
**User Prompt:**
```
Create a new bug report task in the "Sprint Backlog" list using the Bug Report template
```

**Generated Request:**
```json
{
  "templateId": "abc123",
  "listName": "Sprint Backlog",
  "name": "New bug report"
}
```

**Tool Response:**
```json
{
  "id": "task789",
  "name": "New bug report",
  "status": {
    "status": "to do",
    "type": "open"
  },
  "list": {
    "id": "list456",
    "name": "Sprint Backlog"
  }
}
```

---

<div align="center">
  <sub>Created by <a href="https://github.com/taazkareem">taazkareem</a></sub>
</div>
