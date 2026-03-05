[← Back to Documentation Index](../DOCUMENTATION.md)
<br>
[← Back to README](../../README.md)

# Tag Management

Create, update, and manage tags within ClickUp spaces and apply them to tasks. Space-level tag CRUD is consolidated into a single `manage_space_tags` tool using the `action` parameter. Task-level tag operations use separate `add_tag_to_task` and `remove_tag_from_task` tools.

## Tool Reference

### Space Tags (consolidated)

| Tool | Action | Description | Required Parameters | Optional Parameters |
|------|--------|-------------|-------------------|-------------------|
| manage_space_tags | `list` | Get all tags in a space | `action` and either `spaceId` or `spaceName` | None |
| manage_space_tags | `create` | Create a new tag | `action`, `tagName`, and either `spaceId` or `spaceName` | `tagBg`, `tagFg`, `colorCommand` |
| manage_space_tags | `update` | Update tag name/colors | `action`, `tagName`, and either `spaceId` or `spaceName` | `newTagName`, `tagBg`, `tagFg`, `colorCommand` |
| manage_space_tags | `delete` | Delete a tag from space | `action`, `tagName`, and either `spaceId` or `spaceName` | None |

### Task Tags

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| add_tag_to_task | Add tag to a task | `tagName` and either `taskId` or (`taskName` + `listName`) | None |
| remove_tag_from_task | Remove tag from task | `tagName` and either `taskId` or (`taskName` + `listName`) | None |

## Parameters

- **action**: `list`, `create`, `update`, or `delete` (for manage_space_tags)
- **tagName**: Name of the tag (fuzzy-matched; case-insensitive)
- **tagBg**: Background color in hex format (e.g., "#FF5733")
- **tagFg**: Foreground (text) color in hex format (e.g., "#FFFFFF")
- **newTagName**: New name when updating a tag
- **colorCommand**: Natural language color description (e.g., "blue tag", "dark red background")

## Examples

### Listing Space Tags
**User Prompt:**
```
Show me all tags in the "Development" space
```

**Generated Request:**
```json
{
  "action": "list",
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
  ],
  "count": 3
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
  "action": "create",
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
  "data": {
    "name": "priority",
    "tag_bg": "#FF0000",
    "tag_fg": "#FFFFFF"
  },
  "message": "Tag \"priority\" created successfully."
}
```

### Creating a Tag with Natural Language Color
**User Prompt:**
```
Create a new tag called "important" in the "Development" space using dark blue color
```

**Generated Request:**
```json
{
  "action": "create",
  "spaceName": "Development",
  "tagName": "important",
  "colorCommand": "dark blue color"
}
```

**Tool Response:**
```json
{
  "success": true,
  "data": {
    "name": "important",
    "tag_bg": "#00008B",
    "tag_fg": "#FFFFFF"
  },
  "message": "Tag \"important\" created successfully."
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
  "action": "update",
  "spaceName": "Development",
  "tagName": "priority",
  "tagBg": "#0000FF"
}
```

**Tool Response:**
```json
{
  "success": true,
  "data": {
    "name": "priority",
    "tag_bg": "#0000FF",
    "tag_fg": "#FFFFFF"
  },
  "message": "Tag \"priority\" updated successfully."
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
  "action": "delete",
  "spaceName": "Development",
  "tagName": "deprecated"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Tag \"deprecated\" deleted successfully."
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
  "taskName": "Implement Authentication",
  "tagName": "feature"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Tag added to task successfully"
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

## Notes

1. **Tag Existence**: Before adding a tag to a task, ensure the tag exists in the space. Use `manage_space_tags` with action `list` to verify, and action `create` to create it if needed.

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
