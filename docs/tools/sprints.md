# Manage Sprints Tool

The `manage_sprints` tool allows users to interact with ClickUp's sprint functionality. Since ClickUp implements sprints as specialized Folders and Lists with date ranges, this tool provides high-level workflows to identify and interact with active, past, and future sprints.

## Actions

### `get_active`
Finds the currently active sprint in a space and returns its tasks.
- **space_id** or **space_name**: The space to scan for sprint folders.
- **team_id** (optional): Workspace ID override.

**Returns:**
- Metadata about the active sprint (ID, name, dates, URL).
- A summarized list of tasks within that sprint (IDs, names, statuses, assignees).

### `get_sprints`
Lists all sprints (lists) within a specific folder.
- **folder_id** or **folder_name**: The folder containing the sprints.
- **team_id** (optional): Workspace ID override.

**Returns:**
- A list of sprints with their dates and statuses (active, past, future).

### `get_tasks`
Fetches all tasks for a specific sprint.
- **list_id** or **list_name**: The ID or name of the sprint list.
- **team_id** (optional): Workspace ID override.

**Returns:**
- A list of tasks within the sprint.

## Usage Examples

### Find tasks in the current sprint
```json
{
  "action": "get_active",
  "space_name": "Development"
}
```

### List all sprints in a folder
```json
{
  "action": "get_sprints",
  "folder_name": "Product Backlog"
}
```

### Get tasks for a specific sprint
```json
{
  "action": "get_tasks",
  "list_name": "Sprint 3"
}
```

## Note on Implementation
ClickUp Sprints are strictly standard Lists inside Folders. This tool identifies Sprints by:
1. Checking for `sprint_settings` on the parent Folder.
2. Looking for "Sprint" in the Folder or List name.
3. Calculating the active sprint by comparing the current system time against the `start_date` and `due_date` fields of the List.
