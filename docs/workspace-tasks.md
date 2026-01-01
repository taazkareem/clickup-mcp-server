# get_workspace_tasks

The `get_workspace_tasks` tool provides a powerful way to retrieve tasks across the entire workspace with flexible filtering options, including tag-based filtering. This tool is especially useful for cross-list task organization and reporting.

## Key Features

- **Workspace-Wide Access**: Unlike `get_tasks` which only searches in one list, this tool searches across all spaces, folders, and lists.
- **Enhanced List Filtering**: When `list_ids` are provided, uses ClickUp's Views API for comprehensive task coverage, including tasks in multiple lists.
- **Multi-List Task Support**: Retrieves tasks that are *associated with* specified lists, not just created in them.
- **Two-Tier Filtering Strategy**:
  - **Server-side**: Supported filters applied at ClickUp API level for efficiency
  - **Client-side**: Additional filters (tags, folders, spaces) applied after data retrieval
- **Tag-Based Filtering**: Find tasks with specific tags anywhere in the workspace.
- **Multiple Filtering Dimensions**: Filter by lists, folders, spaces, statuses, assignees, and more.
- **Date Filtering**: Search by creation date, update date, or due date ranges.
- **Adaptive Response Format**: Automatic switching between summary and detailed formats based on response size.
- **Subtasks Support**: Include subtasks in results with proper filtering.
- **Pagination Support**: Handle large result sets efficiently with concurrent processing.

## Important Requirements

⚠️ **At least one filter parameter is REQUIRED**. You cannot retrieve all workspace tasks without any filters. Use parameters like `tags`, `list_ids`, `folder_ids`, `space_ids`, `statuses`, `assignees`, or date filters.

## Usage Examples

### Enhanced List Filtering (Multi-List Tasks)

**NEW**: When using `list_ids`, the tool now uses ClickUp's Views API to get comprehensive task coverage:

```json
{
  "list_ids": ["901407112060"],
  "detail_level": "summary"
}
```

This retrieves **all tasks associated with the list**, including:
- ✅ Tasks originally created in the list
- ✅ Tasks created elsewhere and added to the list
- ✅ Tasks appearing through ClickUp's "tasks in multiple lists" feature

### Basic Filtering Examples

### Tag Filtering

Find all tasks with the "bug" tag:

```json
{
  "tags": ["bug"]
}
```

Find tasks that have both "bug" and "high-priority" tags:

```json
{
  "tags": ["bug", "high-priority"]
}
```

### Combining Multiple Filters

Find high-priority bugs assigned to a specific user that are due this month:

```json
{
  "tags": ["bug", "high-priority"],
  "assignees": ["12345"],
  "due_date_gt": 1680300000000,
  "due_date_lt": 1682978400000
}
```

### Filtering by Space and List

Find all tasks in a specific space:

```json
{
  "space_ids": ["space123"]
}
```

Find tasks in multiple lists (uses enhanced Views API):

```json
{
  "list_ids": ["list123", "list456"],
  "detail_level": "detailed"
}
```

### Status and Archive Filtering

Find only open tasks:

```json
{
  "include_closed": false,
  "tags": ["active"]
}
```

Include archived tasks:

```json
{
  "archived": true,
  "space_ids": ["space123"]
}
```

### Response Format Control

Control the level of detail in responses:

```json
{
  "list_ids": ["901407112060"],
  "detail_level": "summary"
}
```

- **`summary`**: Lightweight response with essential task information
- **`detailed`**: Complete task information with all fields (default)

**Note**: Responses exceeding 50,000 tokens automatically switch to summary format.

### Subtasks Support

Include subtasks in results:

```json
{
  "list_ids": ["901407112060"],
  "subtasks": true,
  "tags": ["project-x"]
}
```

**Important**: Subtasks must still match your other filter criteria to appear in results.

### Pagination

Get the first page of tasks, sorted by creation date:

```json
{
  "tags": ["bug"],
  "page": 0,
  "order_by": "created",
  "reverse": true
}
```

Get the second page:

```json
{
  "tags": ["bug"],
  "page": 1,
  "order_by": "created",
  "reverse": true
}
```

## Performance Considerations

For large workspaces, it's recommended to:

1. Use specific filters to narrow down results
2. Use pagination to handle large result sets
3. Consider filtering by space or list when possible
4. Be mindful of rate limiting implications

## Related Tools

- `get_tasks`: Retrieves tasks from a specific list
- `get_task`: Gets a single task's details
- `get_space_tags`: Retrieves available tags in a space that can be used for filtering 