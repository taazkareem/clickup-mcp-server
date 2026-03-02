[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# Tag Management

Create, update, and manage tags within ClickUp spaces and apply them to tasks. Supports natural language color commands and fuzzy name matching.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| get_space_tags | Get all tags in a space | Either `spaceId` or `spaceName` | None |
| create_space_tag | Create a new tag | `tagName` and either `spaceId` or `spaceName` | `tagBg` (hex color), `tagFg` (hex color), `colorCommand` (natural language) |
| update_space_tag | Update an existing tag | `tagName` and either `spaceId` or `spaceName` | `newTagName`, `tagBg`, `tagFg`, `colorCommand` (natural language) |
| delete_space_tag | Delete a tag | `tagName` and either `spaceId` or `spaceName` | None |
| add_tag_to_task | Add tag to a task | `tagName` and either `taskId` or (`taskName` + `listName`) | None |
| remove_tag_from_task | Remove tag from task | `tagName` and either `taskId` or (`taskName` + `listName`) | None |

## Parameters

- **tagName**: Name of the tag (fuzzy-matched; case-insensitive)
- **tagBg**: Background color in hex format (e.g., "#FF5733")
- **tagFg**: Foreground (text) color in hex format (e.g., "#FFFFFF")
- **newTagName**: New name when updating a tag
- **colorCommand**: Natural language color description (e.g., "blue tag", "dark red background")

## Examples

### Getting Space Tags
**User Prompt:**
```
Show me all tags in the "Development" space
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "spaceName": "Development"
}
```

**Tool Response:**
```json
{
  "tags": [
    {
      "name": "feature",
      "tag_bg": "#FF5733",
      "tag_fg": "#FFFFFF"
    },
    {
      "name": "bug",
      "tag_bg": "#DC3545",
      "tag_fg": "#FFFFFF"
    },
    {
      "name": "enhancement",
      "tag_bg": "#28a745",
      "tag_fg": "#FFFFFF"
    }
  ]
}
```

### Creating a Tag
**User Prompt:**
```
Create a new tag called "priority" in the "Development" space with red background
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "spaceName": "Development",
  "tagName": "priority",
  "tagBg": "#FF0000",
  "tagFg": "#FFFFFF"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Tag created successfully",
  "tag": {
    "name": "priority",
    "tag_bg": "#FF0000",
    "tag_fg": "#FFFFFF"
  }
}
```

### Creating a Tag with Natural Language Color Command
**User Prompt:**
```
Create a new tag called "important" in the "Development" space using dark blue color
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "spaceName": "Development",
  "tagName": "important",
  "colorCommand": "dark blue color"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Tag created successfully with generated color",
  "tag": {
    "name": "important",
    "tag_bg": "#00008B",
    "tag_fg": "#FFFFFF"
  }
}
```

### Updating a Tag
**User Prompt:**
```
Update the "priority" tag to have a blue background
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "spaceName": "Development",
  "tagName": "priority",
  "tagBg": "#0000FF"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Tag updated successfully",
  "tag": {
    "name": "priority",
    "tag_bg": "#0000FF",
    "tag_fg": "#FFFFFF"
  }
}
```

### Updating a Tag with Natural Language Color Command
**User Prompt:**
```
Change the "priority" tag color to light green
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "spaceName": "Development",
  "tagName": "priority",
  "colorCommand": "light green"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Tag updated successfully with generated color",
  "tag": {
    "name": "priority",
    "tag_bg": "#90EE90",
    "tag_fg": "#000000"
  }
}
```

### Adding a Tag to a Task
**User Prompt:**
```
Add the "feature" tag to the task "Implement Authentication"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "taskName": "Implement Authentication",
  "tagName": "feature"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Tag added to task successfully",
  "tag": {
    "name": "feature",
    "tag_bg": "#4A90E2",
    "tag_fg": "#FFFFFF"
  },
  "task": {
    "id": "8b9n2x0q7",
    "name": "Implement Authentication",
    "tags": [
      {
        "name": "feature",
        "tag_bg": "#4A90E2",
        "tag_fg": "#FFFFFF"
      }
    ]
  }
}
```

### Removing a Tag from a Task
**User Prompt:**
```
Remove the "bug" tag from "Implement Auth"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "taskName": "Implement Auth",
  "tagName": "bug"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Tag removed from task successfully"
}
```

### Deleting a Space Tag
**User Prompt:**
```
Delete the "deprecated" tag from "Development"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "tagName": "deprecated",
  "spaceName": "Development"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Tag 'deprecated' deleted successfully from space 'Development'"
}
```

## Notes

1. **Tag Existence**: Before adding a tag to a task, ensure the tag exists in the space. Use `get_space_tags` to verify tag existence and `create_space_tag` to create it if needed.

2. **Color Formats**:
   - **Hex Format**: Colors can be provided in hex format (e.g., "#FF5733", "#fff")
   - **Natural Language**: Colors can be specified using natural language (e.g., "blue", "dark red", "light green")
   - When using natural language colors, the system automatically generates appropriate foreground (text) colors for optimal contrast

3. **Tag Name Matching**: ClickUp normalizes all tags to lowercase. The `add_tag_to_task` tool uses fuzzy matching, so "Feature", "feature", and "FEATURE" all resolve correctly. Use lowercase strings for consistency.

4. **Task Tags**: When creating or updating tasks, you can include tags in the task properties:
   ```json
   {
     "name": "New Task",
     "tags": ["feature", "priority"]
   }
   ```
