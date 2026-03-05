[← Back to Documentation Index](../DOCUMENTATION.md)
<br>
[← Back to README](../../README.md)

# List Management

Create, update, move, and delete lists within your ClickUp workspace. Lists can exist directly in a space or inside a folder.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| create_list | Create a new list | `name` and either `spaceId` or `spaceName` | content, dueDate, priority, assignee |
| create_list_in_folder | Create list in folder | `name` and either `folderId` or `folderName` | content, status |
| get_list | Get list details | Either `listId` or `listName` | None |
| update_list | Update list properties | Either `listId` or `listName` | name, content, status |
| delete_list | Delete a list | Either `listId` or `listName` | None |
| move_list | Move list to a different Space or Folder (high-integrity TIML move) | Either `listId` or `listName` | `destinationFolderId`, `destinationSpaceId`, `allowDestructiveFallback` |

## Examples

### Getting List Details
**User Prompt:**
```
Get details for the "Sprint Backlog" list
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "listName": "Sprint Backlog"
}
```

**Tool Response:**
```json
{
  "id": "list_backlog",
  "name": "Sprint Backlog",
  "description": "Items planned for the current sprint",
  "status": [
    {
      "status": "To Do",
      "color": "#ddd",
      "type": "custom"
    },
    {
      "status": "In Progress",
      "color": "#f1c975",
      "type": "custom"
    },
    {
      "status": "Done",
      "color": "#5dce0f",
      "type": "custom"
    }
  ],
  "task_count": 15,
  "url": "https://app.clickup.com/l/list_backlog",
  "folder": {
    "id": "folder123",
    "name": "Development"
  },
  "space": {
    "id": "space123",
    "name": "Engineering"
  }
}
```

### Updating a List
**User Prompt:**
```
Update the "Sprint Backlog" list to have the description "Current sprint planning items and priorities"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "listName": "Sprint Backlog",
  "content": "Current sprint planning items and priorities"
}
```

**Tool Response:**
```json
{
  "id": "list_backlog",
  "name": "Sprint Backlog",
  "description": "Current sprint planning items and priorities",
  "url": "https://app.clickup.com/l/list_backlog",
  "date_updated": "2024-03-16T11:15:00.000Z",
  "status": [
    {
      "status": "To Do",
      "color": "#ddd"
    },
    {
      "status": "In Progress",
      "color": "#f1c975"
    },
    {
      "status": "Done",
      "color": "#5dce0f"
    }
  ]
}
```

### Creating a List in a Space
**User Prompt:**
```
Create a list called "Sprint 42" in the "Engineering" space
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "name": "Sprint 42",
  "spaceName": "Engineering"
}
```

**Tool Response:**
```json
{
  "id": "list_sprint42",
  "name": "Sprint 42",
  "url": "https://app.clickup.com/l/list_sprint42",
  "date_created": "2024-03-16T12:00:00.000Z",
  "space": {
    "id": "space123",
    "name": "Engineering"
  }
}
```

### Creating a List in a Folder
**User Prompt:**
```
Create a "Bug Triage" list in the "QA" folder
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "name": "Bug Triage",
  "folderName": "QA"
}
```

**Tool Response:**
```json
{
  "id": "list_triage",
  "name": "Bug Triage",
  "url": "https://app.clickup.com/l/list_triage",
  "date_created": "2024-03-16T12:10:00.000Z",
  "folder": {
    "id": "folder_qa",
    "name": "QA"
  },
  "space": {
    "id": "space123",
    "name": "Engineering"
  }
}
```

### Deleting a List
**User Prompt:**
```
Delete the "Archived Items" list
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "listName": "Archived Items"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "List 'Archived Items' deleted successfully"
}
```

### Moving a List
**User Prompt:**
```
Move "Sprint 42" to the "Product" space
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "listName": "Sprint 42",
  "destinationSpaceName": "Product"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "List moved successfully",
  "list": {
    "id": "list_sprint42",
    "name": "Sprint 42",
    "space": {
      "id": "space_product",
      "name": "Product"
    }
  }
}
```
