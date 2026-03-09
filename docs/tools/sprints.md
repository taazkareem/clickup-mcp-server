# Sprint Tools

3 atomic tools for interacting with ClickUp's sprint functionality. Since ClickUp implements sprints as specialized Folders and Lists with date ranges, these tools provide high-level workflows to identify and interact with active, past, and future sprints.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|---------------------|---------------------|
| `get_active_sprint` | Find the currently active sprint and return its tasks | — | `space_id`/`space_name`, `team_id` |
| `list_sprints` | List all sprints (lists) within a specific folder | `folder_id` or `folder_name` | `space_id`/`space_name`, `team_id` |
| `get_sprint_tasks` | Fetch all tasks for a specific sprint | `list_id` or `list_name` | `team_id` |

## Tool Details

### `get_active_sprint`
Finds the currently active sprint and returns its tasks.
- **space_id** or **space_name** (optional): The space to scan. If omitted, the tool will scan **all spaces** in the workspace.
- **team_id** (optional): Workspace ID override.

**Multi-Sprint Handling:**
- If **exactly one** active sprint is found across the workspace, the tool returns its tasks directly.
- If **multiple** active sprints are found (e.g., in different spaces), the tool returns a list of all active sprints and asks you to specify a `space_name` or `space_id` to narrow down the tasks.

**Returns:**
- Metadata about the active sprint(s) (ID, name, dates, space, URL).
- (If 1 found) A summarized list of tasks within that sprint (IDs, names, statuses, assignees).

### `list_sprints`
Lists all sprints (lists) within a specific folder.
- **folder_id** or **folder_name**: The folder containing the sprints.
- **space_id** or **space_name** (optional): If folder_name is used, provides context. If omitted, performs a cross-workspace search for the folder.

**Returns:**
- A list of sprints with their dates and statuses (active, past, future).

### `get_sprint_tasks`
Fetches all tasks for a specific sprint.
- **list_id** or **list_name**: The ID or name of the sprint list.

**Returns:**
- A list of tasks within the sprint.

## Usage Examples

### Find tasks in the current sprint (tool: `get_active_sprint`)
```json
{
  "space_name": "Development"
}
```

### List all sprints in a folder (tool: `list_sprints`)
```json
{
  "folder_name": "Product Backlog"
}
```

### Get tasks for a specific sprint (tool: `get_sprint_tasks`)
```json
{
  "list_name": "Sprint 3"
}
```

## Note on Implementation
ClickUp Sprints are strictly standard Lists inside Folders. This tool identifies Sprints by:
1. Checking for `sprint_settings` on the parent Folder.
2. Looking for "Sprint" in the Folder or List name.
3. Calculating the active sprint by comparing the current system time against the `start_date` and `due_date` fields of the List.
