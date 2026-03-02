[← Back to Documentation Index](../DOCUMENTATION.md)

# Folder Management

Create, update, move, and delete folders to organize lists within your ClickUp spaces.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| create_folder | Create a new folder | `name` and either `spaceId` or `spaceName` | override_statuses |
| get_folder | Get folder details | Either `folderId` or `folderName` | `spaceId` or `spaceName` (if using `folderName`) |
| update_folder | Update folder properties | Either `folderId` or `folderName` | name, override_statuses, `spaceId` or `spaceName` (if using `folderName`) |
| delete_folder | Delete a folder | Either `folderId` or `folderName` | `spaceId` or `spaceName` (if using `folderName`) |
| move_folder | Move folder to a different Space (high-integrity move) | Either `folderId` or `folderName`, and `destinationSpaceId` | `allowDestructiveFallback` |

## Examples

### Getting Folder Details
**User Prompt:**
```
Get details for the "Development Projects" folder
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "folderName": "Development Projects"
}
```

**Tool Response:**
```json
{
  "id": "folder_dev",
  "name": "Development Projects",
  "description": "All development-related projects",
  "lists": [
    {
      "id": "list1",
      "name": "Sprint Backlog"
    },
    {
      "id": "list2",
      "name": "In Progress"
    },
    {
      "id": "list3",
      "name": "Completed"
    }
  ],
  "list_count": 3,
  "url": "https://app.clickup.com/f/folder_dev",
  "space": {
    "id": "space123",
    "name": "Engineering"
  }
}
```

### Updating a Folder
**User Prompt:**
```
Update the "Development Projects" folder to be named "Active Development Projects"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "folderName": "Development Projects",
  "name": "Active Development Projects"
}
```

**Tool Response:**
```json
{
  "id": "folder_dev",
  "name": "Active Development Projects",
  "description": "All development-related projects",
  "url": "https://app.clickup.com/f/folder_dev",
  "date_updated": "2024-03-16T11:30:00.000Z",
  "list_count": 3,
  "space": {
    "id": "space123",
    "name": "Engineering"
  }
}
```

### Creating a Folder
**User Prompt:**
```
Create a folder called "Q2 Projects" in the "Engineering" space
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "name": "Q2 Projects",
  "spaceName": "Engineering"
}
```

**Tool Response:**
```json
{
  "id": "folder_q2",
  "name": "Q2 Projects",
  "url": "https://app.clickup.com/f/folder_q2",
  "date_created": "2024-03-16T12:00:00.000Z",
  "lists": [],
  "list_count": 0,
  "space": {
    "id": "space123",
    "name": "Engineering"
  }
}
```

### Deleting a Folder
**User Prompt:**
```
Delete the "Deprecated Projects" folder in the "Engineering" space
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "folderName": "Deprecated Projects",
  "spaceName": "Engineering"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Folder 'Deprecated Projects' deleted successfully"
}
```

### Moving a Folder
**User Prompt:**
```
Move "Q2 Projects" to the "Archive" space
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "folderName": "Q2 Projects",
  "destinationSpaceName": "Archive"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Folder moved successfully",
  "folder": {
    "id": "folder_q2",
    "name": "Q2 Projects",
    "space": {
      "id": "space_archive",
      "name": "Archive"
    }
  }
}
```
