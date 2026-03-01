# ClickUp MCP Server Documentation

This document provides detailed information about all available tools, their parameters, and usage examples for the ClickUp MCP Server.
> Updated: 2026-03-01

## Table of Contents
- [Task Management](#task-management)
- [Task Checklists](#task-checklists)
- [Custom Fields](#custom-fields)
- [Multi-List (TIML)](#multi-list-timl)
- [Time Tracking](#time-tracking)
- [List Management](#list-management)
- [Folder Management](#folder-management)
- [Tag Management](#tag-management)
- [Document Management](#document-management)
- [Chat Management](#chat-management)
- [Member Management Tools](#member-management-tools)
- [Workspace Organization](#workspace-organization)
- [Prompts](#prompts)
- [Feedback](#feedback)
- [Configuration](#configuration)
- [Error Handling](#error-handling)

## Task Management

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| get_task | Get single task details with global lookup | `task` (Name or ID) | `listName` (disambiguation), `subtasks`, `include_markdown_description` |
| get_task_comments | Retrieve comments for a task | `task` (Name or ID) | `listName`, `start`, `startId`, `include_replies` |
| create_task_comment | Add a comment to a task | `commentText` OR `formattedComment`, and `task` (Name or ID) | `listName`, `notifyAll`, `assignee` |
| attach_task_file | Attach a file to a task | `taskId` or `taskName`, and EITHER `file_data` OR `file_url` | `file_name`, `listName`, `chunk_*` parameters for large files |
| create_task | Create a new task | `name` and either `listId` or `listName` | description, status, priority (1-4), dueDate, startDate, parent (ID or Name), assignees, custom_task_type |
| create_bulk_tasks | Create multiple tasks | `tasks[]` | `listId` or `listName` |
| update_task | Modify task properties | `task` (Name or ID) | name, description, status, priority, dueDate, startDate, parent (ID or Name), assignees, custom_task_type |
| update_bulk_tasks | Modify multiple tasks | `tasks[]` with task identifiers | Each task can have: name, description, status, priority, dueDate, startDate, etc. |
| delete_task | Remove a task | `task` (Name or ID) | `listName` |
| delete_bulk_tasks | Remove multiple tasks | `tasks[]` with task identifiers | None |
| move_task | Move task to another list (high-integrity TIML by default) | `task` (Name or ID) | `listId`, `listName`, `sourceListName`, `allowDestructiveFallback` |
| move_bulk_tasks | Move multiple tasks | `tasks[]` with task identifiers, and target list | `allowDestructiveFallback` |
| duplicate_task | Full-fidelity task duplication (copies tags, custom fields, checklists, subtasks; attachments are NOT copied — ClickUp API limitation) | `task` (Name or ID) | `listId`, `listName`, `sourceListName` |
| set_task_custom_field | Set a custom field value on a task | `task` (Name or ID), `fieldName` (or `fieldId`), `value` | `listName` |
| add_task_to_list | Add task to an additional list (TIML) | `task` (Name or ID) | `listId`, `listName`, `taskListName` |
| remove_task_from_list | Remove task from a list without deleting it (TIML) | `task` (Name or ID) | `listId`, `listName`, `taskListName` |
| get_workspace_tasks | Retrieve tasks across the workspace with enhanced filtering | At least one filter parameter (tags, list_ids, folder_ids, space_ids, statuses, assignees, or date filters) | page, order_by, reverse, detail_level, subtasks |
| add_task_link | Link two tasks together | `task` (Name or ID), `targetTask` (Name or ID) | `listName`, `targetListName` |
| get_task_links | Get all links for a task | `task` (Name or ID) | `listName` |
| delete_task_link | Remove a task link | `task` (Name or ID), `linkId` (target task Name or ID) | `listName`, `targetListName` |

### Task Parameters

- **Priority Levels**: 1 (Urgent/Highest) to 4 (Low)
- **Dates**: Unix timestamps in milliseconds
- **Status**: Uses list's default if not specified
- **Description**: Supports both plain text and markdown. Use `include_markdown_description: true` on `get_task` to retrieve high-fidelity markdown formatting.
- **Files**: Attach files using base64 encoding or URLs
- **Subtasks**: 
  - Retrieve subtasks with `subtasks: true` parameter on `get_task` or `get_tasks`
  - Create subtasks by setting `parent` parameter with parent task ID or Name on `create_task`
  - Convert tasks to subtasks by setting `parent` parameter with parent task ID or Name on `update_task` (parent must be in same list)
  - Multi-level subtasks are supported (subtasks can have their own subtasks)
- **Date Parameters**:
  - `dueDate`: When the task is due (deadline)
  - `startDate`: When work on the task should begin
  - Both support natural language expressions (e.g., "now", "today", "tomorrow at 9am")
  - Date ranges can be specified using `start of today` and `end of today`
- **Global Task Lookup**:
  - Find tasks by name across the entire workspace without specifying a list
  - Smart disambiguation when multiple tasks share the same name
  - Shows context (list, folder, space) for each matching task
  - Prioritizes most recently updated task when multiple matches exist
  - Backward compatible with list-specific lookups
- **Status Normalization**: Status names use fuzzy matching — e.g., "in progress", "In Progress", and "IN PROGRESS" all resolve correctly
- **Custom Task Types**: Use `custom_task_type` on `create_task`/`update_task` to set the task type (if your workspace uses custom task types)
- **@Mention Support**: Use `@username` or `@email` in task comments and chat messages to mention users — they are automatically resolved
- **Markdown in Comments/Chat**: Comments and chat messages support standard markdown formatting and are automatically converted to ClickUp's rich-text format
- **High-Integrity Moves (TIML)**: `move_task` uses non-destructive TIML (Tasks in Multiple Lists) by default, preserving the task ID and all history. If TIML is blocked by workspace plan limits, the tool will NOT automatically fall back to a destructive copy-delete move — you must explicitly set `allowDestructiveFallback: true` (with user consent) to allow it. The same pattern applies to `move_list` and `move_folder`

### Custom Task ID Support

The MCP server automatically detects and handles custom task IDs. You can use either regular ClickUp task IDs or custom task IDs interchangeably in the `taskId` parameter.

**Supported Custom ID Formats:**
- Hyphenated format: `DEV-1234`, `PROJ-456`, `BUG-789`
- Underscore format: `DEV_1234`, `PROJ_456`
- Uppercase prefix: `DEV1234`, `PROJ456`
- Dot notation: `PROJECT.123`, `TEAM.456`

**Examples:**
```json
{
  "taskId": "DEV-1234"  
}
```

```json
{
  "taskId": "86b4bnnny"
}
```

**Requirements:**
- Your ClickUp workspace must have custom task IDs enabled
- You must have access to the task
- Custom IDs must follow your workspace's configured format

**Note:** The `customTaskId` parameter is still available for backward compatibility, but it's no longer required since `taskId` automatically handles both formats.

### Examples

#### Creating a Task
**User Prompt:**
```
Create a new task in the "Development Tasks" list called "Implement Authentication". 
It should be high priority and due on July 1st, 2026. 
Add these requirements:
- OAuth2 support
- JWT tokens
- Refresh token flow
```

**System Response:**
```json
{
  "listName": "Development Tasks",
  "name": "Implement Authentication",
  "markdown_description": "## Requirements\n- OAuth2 support\n- JWT tokens\n- Refresh token flow",
  "priority": 1,
  "dueDate": 1703980800000
}
```

#### Creating a Task with Start Date and Due Date
**User Prompt:**
```
Create a task called "Database Migration" that starts tomorrow at 9am and is due by the end of the week.
It should be in the "Backend Tasks" list.
```

**System Response:**
```json
{
  "listName": "Backend Tasks",
  "name": "Database Migration",
  "startDate": "tomorrow at 9am",
  "dueDate": "end of week"
}
```

#### Updating a Task's Start Date
**User Prompt:**
```
Change the start date of the "Database Migration" task to next Monday at 8am
```

**System Response:**
```json
{
  "taskName": "Database Migration",
  "startDate": "next Monday at 8am"
}
```

#### Getting Task Comments
**User Prompt:**
```
Show me the comments on the "Bug Fix" task.
```

**System Response:**
```json
{
  "taskName": "Bug Fix",
  "comments": [
    {
      "id": "abcd1234",
      "comment": "I've identified the root cause. It's related to a race condition in the auth flow.",
      "comment_text": "I've identified the root cause. It's related to a race condition in the auth flow.",
      "user": {
        "id": 1234567,
        "username": "developer1",
        "email": "dev1@example.com",
        "color": "#ff7800"
      },
      "resolved": false,
      "date": "2024-03-15T10:30:45.000Z"
    },
    {
      "id": "efgh5678",
      "comment": "Great work! Could you submit a PR by tomorrow?",
      "comment_text": "Great work! Could you submit a PR by tomorrow?",
      "user": {
        "id": 7654321,
        "username": "manager1",
        "email": "manager@example.com",
        "color": "#0080ff"
      },
      "resolved": false,
      "date": "2024-03-15T11:15:20.000Z"
    }
  ],
  "totalComments": 2,
  "pagination": {
    "hasMore": false
  }
}
```

#### Getting Task Comments with Replies
**User Prompt:**
```
Show me the comments on the "Bug Fix" task including replies.
```

**System Response:**
```json
{
  "taskName": "Bug Fix",
  "include_replies": true
}
```

#### Creating a Task Comment
**User Prompt:**
```
Add a comment to the "Bug Fix" task saying "I've fixed the issue by implementing proper mutex locks."
```

**System Response:**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "comment": {
    "id": "ijkl9012",
    "comment": "I've fixed the issue by implementing proper mutex locks.",
    "comment_text": "I've fixed the issue by implementing proper mutex locks.",
    "user": {
      "id": 1234567,
      "username": "developer1",
      "email": "dev1@example.com",
      "color": "#ff7800"
    },
    "date": "2024-03-16T09:45:30.000Z",
    "resolved": false
  }
}
```

#### Creating a Formatted Task Comment
**User Prompt:**
```
Add a formatted comment to "Bug Fix" with:
- Bold text for "Analysis"
- A bullet list of findings
- A code block with the fix
```

**System Response:**
```json
{
  "taskName": "Bug Fix",
  "formattedComment": {
    "ops": [
      { "insert": "Analysis\n", "attributes": { "bold": true } },
      { "insert": "Here are the findings:\n" },
      { "insert": "Race condition identified\n", "attributes": { "list": "bullet" } },
      { "insert": "Mutex lock missing\n", "attributes": { "list": "bullet" } },
      { "insert": "\nconst lock = new Mutex();\nawait lock.acquire();", "attributes": { "code-block": "javascript" } }
    ]
  }
}
```

**Supported Formatting:**
The `formattedComment` parameter accepts a JSON object following the Quill Delta format. Supported attributes include:
- **Text Styles**: `bold`, `italic`, `underline`, `strike`, `code`
- **Lists**: `list: "bullet"`, `list: "ordered"`, `list: "checked"`, `list: "unchecked"`
- **Structure**: `header` (1-4), `code-block`
- **Elements**: `link`, `image`, `user` (mentions)


#### Moving a Task
**User Prompt:**
```
Move the "Bug Fix" task from the "Sprint Backlog" list to "Current Sprint" list
```

**System Response:**
```json
{
  "taskName": "Bug Fix",
  "sourceListName": "Sprint Backlog",
  "destinationListName": "Current Sprint"
}
```

#### Global Task Lookup
**User Prompt:**
```
Get details for task "Roadmap Planning"
```

**System Response:**
```json
{
  "taskName": "Roadmap Planning"
}
```

#### Getting Task Details with Markdown
**User Prompt:**
```
Get the task details for "Implement Authentication" including its markdown description.
```

**System Response:**
```json
{
  "taskName": "Implement Authentication",
  "include_markdown_description": true
}
```


**Response for Multiple Matches:**
```json
{
  "matches": [
    {
      "id": "abc123",
      "name": "🌐 Website Update",
      "description": "First instance of Website Update task in Programming list",
      "list": {
        "name": "Programming",
        "id": "123"
      },
      "folder": {
        "name": "Development",
        "id": "456"
      },
      "space": {
        "name": "Education",
        "id": "789"
      },
      "date_updated": "2024-03-15T10:30:45.000Z"
    },
    {
      "id": "def456",
      "name": "🌐 Website Update",
      "description": "Second instance of Website Update task in AI Assistant App list",
      "list": {
        "name": "AI Assistant App",
        "id": "234"
      },
      "folder": {
        "name": "Macrodroid",
        "id": "567"
      },
      "space": {
        "name": "Custom Space",
        "id": "890"
      },
      "date_updated": "2024-03-10T11:15:20.000Z"
    }
  ],
  "count": 2
}
```

**For Disambiguation Resolution:**
```
Get details for task "Website Update" in list "AI Assistant App"
```

#### Updating Task Status
**User Prompt:**
```
Update the "Bug Fix" task status to "Done"
```

**System Response:**
```json
{
  "taskName": "Bug Fix",
  "status": "Done"
}
```

#### Bulk Creating Tasks
**User Prompt:**
```
Create these tasks in the "Sprint Backlog" list:
1. Set up CI/CD pipeline (high priority)
2. Write unit tests (normal priority)
3. Update documentation (low priority)
```

**System Response:**
```json
{
  "listName": "Sprint Backlog",
  "tasks": [
    {
      "name": "Set up CI/CD pipeline",
      "priority": 2
    },
    {
      "name": "Write unit tests",
      "priority": 3
    },
    {
      "name": "Update documentation",
      "priority": 4
    }
  ]
}
```

#### Bulk Creating Tasks with Start and Due Dates
**User Prompt:**
```
Create these tasks in the "Project X" list:
1. Research - starts today, due in 3 days
2. Design - starts after Research ends, due in a week from start
3. Implementation - starts after Design, due in 2 weeks from start
```

**System Response:**
```json
{
  "listName": "Project X",
  "tasks": [
    {
      "name": "Research",
      "startDate": "today",
      "dueDate": "3 days from now"
    },
    {
      "name": "Design",
      "startDate": "4 days from now", 
      "dueDate": "11 days from now"
    },
    {
      "name": "Implementation",
      "startDate": "12 days from now",
      "dueDate": "26 days from now"
    }
  ]
}
```

#### Filtering Tasks by Tags
**User Prompt:**
```
Find all tasks with the tags "bug" and "high-priority" across the workspace
```

**System Response:**
```json
{
  "name": "get_workspace_tasks",
  "params": {
    "tags": ["bug", "high-priority"],
    "include_closed": false
  },
  "response": {
    "tasks": [
      {
        "id": "abcd1234",
        "name": "Fix authentication bug",
        "description": "Detailed bug description...",
        "text_content": "Plain text version...",
        "status": {
          "status": "In Progress",
          "color": "#f1c975"
        },
        "creator": {
          "id": 123,
          "username": "dev1",
          "email": "dev1@example.com"
        },
        "assignees": [
          {
            "id": 456,
            "username": "dev2",
            "email": "dev2@example.com"
          }
        ],
        "watchers": [...],
        "checklists": [...],
        "custom_fields": [...],
        "list": {
          "id": "list123",
          "name": "Current Sprint"
        },
        "tags": [
          {
            "name": "bug",
            "tag_bg": "#e50000",
            "tag_fg": "#ffffff"
          },
          {
            "name": "high-priority",
            "tag_bg": "#ff7800",
            "tag_fg": "#ffffff"
          }
        ]
      }
    ],
    "count": 1
  }
}
```

#### Adaptive Response Format in Workspace Tasks

The `get_workspace_tasks` tool offers three response formats to optimize for different use cases:

1. **Summary Format** (`detail_level: 'summary'`):
   - Lightweight response with essential task information
   - Ideal for lists, overviews, and large datasets
   - Includes: id, name, status, list info, due date, URL, priority, and tags
   - Automatically used when response size exceeds 50,000 tokens

2. **Detailed Format** (`detail_level: 'detailed'`):
   - Complete task information including all fields
   - Best for detailed views and task management
   - Includes: all task data, custom fields, descriptions, comments, etc.

3. **Names Format** (`detail_level: 'names'`):
   - Ultra-lightweight response with only task IDs and names
   - Best for quick lookups, autocomplete, or when only task identity is needed

Example using summary format:
```json
{
  "summaries": [
    {
      "id": "123abc",
      "name": "🎯 Important Task",
      "status": "in progress",
      "list": {
        "id": "456def",
        "name": "Project Alpha"
      },
      "due_date": "2024-03-20T10:00:00Z",
      "url": "https://app.clickup.com/t/123abc",
      "priority": 1,
      "tags": [
        {
          "name": "urgent",
          "tag_bg": "#ff0000",
          "tag_fg": "#ffffff"
        }
      ]
    }
  ],
  "total_count": 100,
  "has_more": true,
  "next_page": 1
}
```

Example using detailed format:
```json
{
  "tasks": [
    {
      // Full task object with all fields
      "id": "123abc",
      "name": "🎯 Important Task",
      "description": "Detailed task description...",
      "status": {
        "status": "in progress",
        "color": "#4A90E2"
      },
      "custom_fields": [...],
      "assignees": [...],
      "watchers": [...],
      "checklists": [...],
      // ... all other task fields
    }
  ],
  "total_count": 100,
  "has_more": true,
  "next_page": 1
}
```

#### Workspace Task Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `detail_level` | string | Response format: `"summary"`, `"detailed"`, or `"names"` | `"detailed"` |
| `subtasks` | boolean | Include subtasks in results (must match filter criteria) | `false` |
| `list_ids` | array | Filter by specific list IDs | - |

##### Best Practices for Workspace Tasks

1. **Use Filters**: At least one filter parameter is required to prevent overly broad queries:
   - `tags`: Filter by tag names
   - `list_ids`: Filter by specific lists
   - `folder_ids`: Filter by folders
   - `space_ids`: Filter by spaces
   - `statuses`: Filter by task status
   - `assignees`: Filter by assigned users
   - Date filters: `due_date_gt`, `due_date_lt`, etc.

2. **Pagination**: Use `page`, `order_by`, and `reverse` parameters to navigate through results:
   ```json
   {
     "list_ids": ["123"],
     "page": 0,
     "order_by": "due_date",
     "reverse": true
   }
   ```

3. **Response Size**: For large datasets:
   - Use `detail_level: 'summary'` to get lightweight responses
   - The tool automatically switches to summary format if response exceeds 50,000 tokens
   - Use filters to narrow down results

4. **Adaptive Response Pattern**:
   1. Fetch summaries first for list views
   2. Load details on-demand when viewing specific tasks
   3. Use pagination to load more items as needed

#### Bulk Updating Tasks
**User Prompt:**
```
Update all the following tasks to high priority:
1. "Implement login screen"
2. "Create database schema"
3. "Set up CI pipeline"
```

**System Response:**
```json
{
  "tasks": [
    {
      "taskName": "Implement login screen",
      "listName": "Development Tasks",
      "priority": 2
    },
    {
      "taskName": "Create database schema",
      "listName": "Development Tasks",
      "priority": 2
    },
    {
      "taskName": "Set up CI pipeline",
      "listName": "Development Tasks",
      "priority": 2
    }
  ]
}
```

#### Bulk Updating Tasks with Start Dates
**User Prompt:**
```
Update these tasks to have new start dates:
1. "Research" should start now
2. "Design" should start after "Research" is done (3 days from now)
3. "Implementation" should start next week
```

**System Response:**
```json
{
  "tasks": [
    {
      "taskName": "Research",
      "listName": "Project X",
      "startDate": "now"
    },
    {
      "taskName": "Design",
      "listName": "Project X",
      "startDate": "3 days from now"
    },
    {
      "taskName": "Implementation",
      "listName": "Project X",
      "startDate": "next week"
    }
  ]
}
```

#### Bulk Moving Tasks
**User Prompt:**
```
Move all the completed tasks from "In Progress" list to "Done" list:
1. "Backend API implementation"
2. "Frontend form validation"
```

**System Response:**
```json
{
  "tasks": [
    {
      "taskName": "Backend API implementation",
      "listName": "In Progress"
    },
    {
      "taskName": "Frontend form validation",
      "listName": "In Progress"
    }
  ],
  "targetListName": "Done"
}
```

#### Bulk Deleting Tasks
**User Prompt:**
```
Delete all these tasks from the "Archived" list:
1. "Outdated feature"
2. "Duplicate bug report"
```

**System Response:**
```json
{
  "tasks": [
    {
      "taskName": "Outdated feature",
      "listName": "Archived"
    },
    {
      "taskName": "Duplicate bug report",
      "listName": "Archived"
    }
  ]
}
```

#### Attaching a File to a Task
**User Prompt:**
```
Attach a file to the task "Implement Authentication". The file is at URL "https://example.com/files/specs.pdf"
```

**System Response:**
```json
{
  "taskName": "Implement Authentication",
  "file_url": "https://example.com/files/specs.pdf",
  "file_name": "specs.pdf"
}
```

**User Prompt:**
```
Attach this document to the task with ID 86b4bnnny
```

**System Response:**
```json
{
  "taskId": "86b4bnnny",
  "file_data": "<base64-encoded-content>",
  "file_name": "document.txt"
}
```

#### Retrieving Tasks with Subtasks
**User Prompt:**
```
Get the "Project Planning" task with all its subtasks
```

**System Response:**
```json
{
  "taskName": "Project Planning",
  "subtasks": true
}
```

**Response will include:**
```json
{
  "id": "abc123",
  "name": "Project Planning",
  "description": "Plan the new project phase",
  "subtasks": [
    {
      "id": "def456",
      "name": "Define Requirements",
      "parent": "abc123",
      "top_level_parent": "abc123"
    },
    {
      "id": "ghi789",
      "name": "Create Timeline",
      "parent": "abc123",
      "top_level_parent": "abc123"
    }
  ]
}
```

#### Creating a Subtask
**User Prompt:**
```
Create a subtask under "Project Planning" called "Schedule Team Meeting"
```

**System Response:**
```json
{
  "name": "Schedule Team Meeting",
  "parent": "abc123",
  "listName": "Development Tasks"
}
```

#### Converting a Task to a Subtask
**User Prompt:**
```
Convert the "Schedule Team Meeting" task to be a subtask of "Project Planning"
```

**System Response:**
```json
{
  "taskName": "Schedule Team Meeting",
  "parent": "abc123"
}
```

**Notes:**
- The parent task must be in the same list as the task being converted
- Use the task ID or name as the `parent` value
- This is equivalent to the "Convert to subtask" operation in the ClickUp UI
- Converting a subtask back to a task by setting `parent` to `null` is not supported by the ClickUp API


#### Task Relationships (Linking Tasks)

The server supports linking tasks together to express dependencies or relationships.

**Adding a Link:**
**User Prompt:**
```
Link task "Backend API implementation" to task "Frontend form validation"
```

**System Response:**
```json
{
  "task": "Backend API implementation",
  "targetTask": "Frontend form validation"
}
```

**Getting Task Links:**
**User Prompt:**
```
Show me all tasks linked to "Backend API implementation"
```

**System Response:**
```json
{
  "task": "Backend API implementation",
  "links": [
    {
      "task_id": "86b4bmmmx",
      "link_id": "12345678",
      "date_created": "1703980800000",
      "userid": "123456",
      "workspace_id": "789012"
    }
  ]
}
```

**Deleting a Link:**
**User Prompt:**
```
Remove the link between "Backend API implementation" and "Frontend form validation" (Link ID: 86b4bmmmx)
```

**System Response:**
```json
{
  "success": true,
  "message": "Task link deleted successfully"
}
```
**Note:** Use `task` for the source task and `linkId` for the target task (Name or ID).

#### Natural Language Date Support

The server supports a wide range of natural language date expressions:

1. **Basic expressions**:
   - "now" - current date and time
   - "today" - end of current day
   - "tomorrow" - end of tomorrow
   - "next week" - end of next week
   - "in 3 days" - 3 days from current time

2. **Time-specific expressions**:
   - "tomorrow at 9am"
   - "next Monday at 2pm"
   - "Friday at noon"

3. **Range expressions**:
   - "start of today" - beginning of current day (midnight)
   - "end of today" - end of current day (23:59:59)
   - "beginning of next week"
   - "end of this month"

4. **Relative expressions**:
   - "30 minutes from now"
   - "2 hours from now"
   - "5 days after tomorrow"

These expressions can be used with both `dueDate` and `startDate` parameters.

## Task Checklists

Checklists allow you to add structured to-do items within a task. Each task can have multiple checklists, and each checklist can have multiple items that can be assigned, nested, and marked as resolved.

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| create_checklist | Add a checklist to a task | `task` (Name or ID), `name` | `listName` |
| edit_checklist | Rename or reorder a checklist | `checklistId` | `name`, `position` |
| delete_checklist | Delete a checklist and all its items | `checklistId` | None |
| create_checklist_item | Add an item to a checklist | `checklistId`, `name` | `assignee` (user ID) |
| edit_checklist_item | Update a checklist item | `checklistId`, `itemId` | `name`, `resolved`, `assignee`, `parent` (nest under another item) |
| delete_checklist_item | Remove an item from a checklist | `checklistId`, `itemId` | None |

### Checklist Parameters

- **checklistId**: Obtained from `create_checklist` or from `get_task` response (checklists are included in task details)
- **itemId**: Obtained from `create_checklist_item` or from `get_task` response
- **resolved**: `true` = checked/complete, `false` = unchecked
- **parent**: Set to another checklist item's ID to nest the item; set to `null` to un-nest
- **assignee**: User ID to assign the item to (use `find_member_by_name` to resolve names to IDs)

### Examples

#### Creating a Checklist with Items
```
Add a "Launch Checklist" to the task "Release v2.0" with items: update docs, run tests, deploy
```

The agent would call:
1. `create_checklist` with `task: "Release v2.0"`, `name: "Launch Checklist"`
2. `create_checklist_item` for each item using the returned `checklistId`

#### Marking Items as Complete
```
Mark "update docs" as done on the checklist
```

```json
{
  "checklistId": "abc-123",
  "itemId": "item-456",
  "resolved": true
}
```

## Custom Fields

Custom fields let you store structured metadata on tasks. Use `get_list_custom_fields` to discover available fields, then `set_task_custom_field` to set values.

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| get_list_custom_fields | Get all custom field definitions for a list | Either `listId` or `listName` | None |
| set_task_custom_field | Set a custom field value on a task | `task` (Name or ID), `fieldName` (or `fieldId`), `value` | `listName` |

### Custom Field Value Types

The `value` parameter type depends on the custom field type:
- **Text**: String value
- **Number**: Numeric value
- **Date**: Unix timestamp in milliseconds
- **Checkbox**: Boolean (`true`/`false`)
- **Dropdown**: Option UUID (use `get_list_custom_fields` to find option UUIDs)
- **Labels**: Array of label UUIDs

### Examples

#### Discovering Custom Fields
```
What custom fields are available on the "Sprint Backlog" list?
```

```json
{
  "listName": "Sprint Backlog"
}
```

#### Setting a Custom Field
```
Set the "Story Points" field to 5 on the task "Implement Login"
```

```json
{
  "task": "Implement Login",
  "fieldName": "Story Points",
  "value": 5
}
```

## Multi-List (TIML)

Tasks in Multiple Lists (TIML) allows a single task to appear in multiple lists simultaneously. The task retains its original ID and all data (comments, history, custom fields) across all lists.

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| add_task_to_list | Add a task to an additional list | `task` (Name or ID) | `listId`, `listName`, `taskListName` |
| remove_task_from_list | Remove a task from a specific list (does NOT delete the task) | `task` (Name or ID) | `listId`, `listName`, `taskListName` |

### Important Notes

- A task must remain in at least one list — you cannot remove it from its last list
- TIML is also used internally by `move_task` for high-integrity moves (add to destination, then remove from source)
- TIML availability depends on your ClickUp workspace plan

### Examples

#### Adding a Task to Multiple Lists
```
Add the task "Shared Component" to the "Frontend" list as well
```

```json
{
  "task": "Shared Component",
  "listName": "Frontend"
}
```

#### Removing a Task from a List
```
Remove "Shared Component" from the "Backend" list (keep it in Frontend)
```

```json
{
  "task": "Shared Component",
  "listName": "Backend"
}
```

## Time Tracking

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| get_task_time_entries | Get time entries for a specific task | `task` (Name or ID) | `listName` |
| get_workspace_time_entries | Get time entries across the workspace with filtering | None (at least one filter recommended) | `startDate`, `endDate`, `taskId`, `taskName`, `listId`, `listName`, `folderId`, `spaceId`, `spaceName`, `assignees`, `assigneeNames` |
| start_time_tracking | Start a timer on a task | `task` (Name or ID) | `listName`, `description`, `billable`, `tags` |
| stop_time_tracking | Stop the current running timer | None | `description`, `tags` |
| add_time_entry | Add a manual time entry | `task` (Name or ID), `start`, `duration` | `listName`, `description`, `end`, `billable`, `tags` |
| delete_time_entry | Delete a time entry | `timeEntryId` | None |
| get_current_time_entry | Get the currently running timer | None | None |

### Time Tracking Parameters

- **duration**: Time in milliseconds
- **startDate/endDate**: Support Unix timestamps and natural language expressions (e.g., "last week", "start of month")
- **billable**: Boolean flag for billable time
- **tags**: Array of tag objects for categorizing time entries

### Examples

#### Getting Workspace Time Report
```
Show me all time entries from last week for the "Development" space
```

```json
{
  "startDate": "start of last week",
  "endDate": "end of last week",
  "spaceName": "Development"
}
```

#### Starting a Timer
```
Start tracking time on "Fix Login Bug"
```

```json
{
  "task": "Fix Login Bug",
  "description": "Debugging authentication issue"
}
```

## List Management

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| create_list | Create a new list | `name` and either `spaceId` or `spaceName` | content, dueDate, priority, assignee |
| create_list_in_folder | Create list in folder | `name` and either `folderId` or `folderName` | content, status |
| get_list | Get list details | Either `listId` or `listName` | None |
| update_list | Update list properties | Either `listId` or `listName` | name, content, status |
| delete_list | Delete a list | Either `listId` or `listName` | None |
| move_list | Move list to a different Space or Folder (high-integrity TIML move) | Either `listId` or `listName` | `destinationFolderId`, `destinationSpaceId`, `allowDestructiveFallback` |
| get_list_custom_fields | Get all custom field definitions for a list | Either `listId` or `listName` | None |

### Examples

#### Getting List Details
**User Prompt:**
```
Get details for the "Sprint Backlog" list
```

**System Response:**
```json
{
  "listName": "Sprint Backlog"
}
```

#### Updating a List
**User Prompt:**
```
Update the "Sprint Backlog" list to have the description "Current sprint planning items and priorities"
```

**System Response:**
```json
{
  "listName": "Sprint Backlog",
  "content": "Current sprint planning items and priorities"
}
```

## Folder Management

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| create_folder | Create a new folder | `name` and either `spaceId` or `spaceName` | override_statuses |
| get_folder | Get folder details | Either `folderId` or `folderName` | `spaceId` or `spaceName` (if using `folderName`) |
| update_folder | Update folder properties | Either `folderId` or `folderName` | name, override_statuses, `spaceId` or `spaceName` (if using `folderName`) |
| delete_folder | Delete a folder | Either `folderId` or `folderName` | `spaceId` or `spaceName` (if using `folderName`) |
| move_folder | Move folder to a different Space (high-integrity move) | Either `folderId` or `folderName`, and `destinationSpaceId` | `allowDestructiveFallback` |

### Examples

#### Getting Folder Details
**User Prompt:**
```
Get details for the "Development Projects" folder
```

**System Response:**
```json
{
  "folderName": "Development Projects"
}
```

#### Updating a Folder
**User Prompt:**
```
Update the "Development Projects" folder to be named "Active Development Projects"
```

**System Response:**
```json
{
  "folderName": "Development Projects",
  "name": "Active Development Projects"
}
```

## Tag Management

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| get_space_tags | Get all tags in a space | Either `spaceId` or `spaceName` | None |
| create_space_tag | Create a new tag | `tagName` and either `spaceId` or `spaceName` | `tagBg` (hex color), `tagFg` (hex color), `colorCommand` (natural language) |
| update_space_tag | Update an existing tag | `tagName` and either `spaceId` or `spaceName` | `newTagName`, `tagBg`, `tagFg`, `colorCommand` (natural language) |
| delete_space_tag | Delete a tag | `tagName` and either `spaceId` or `spaceName` | None |
| add_tag_to_task | Add tag to a task | `tagName` and either `taskId` or (`taskName` + `listName`) | None |
| remove_tag_from_task | Remove tag from task | `tagName` and either `taskId` or (`taskName` + `listName`) | None |

### Tag Parameters

- **tagName**: Name of the tag (case-sensitive)
- **tagBg**: Background color in hex format (e.g., "#FF5733")
- **tagFg**: Foreground (text) color in hex format (e.g., "#FFFFFF")
- **newTagName**: New name when updating a tag
- **colorCommand**: Natural language color description (e.g., "blue tag", "dark red background")

### Examples

#### Getting Space Tags
**User Prompt:**
```
Show me all tags in the "Development" space
```

**System Response:**
```json
{
  "spaceName": "Development",
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
    }
  ]
}
```
#### Creating a Tag
**User Prompt:**
```
Create a new tag called "priority" in the "Development" space with red background
```

**System Response:**
```json
{
  "spaceName": "Development",
  "tagName": "priority",
  "tagBg": "#FF0000",
  "tagFg": "#FFFFFF"
}
```

#### Creating a Tag with Natural Language Color Command
**User Prompt:**
```
Create a new tag called "important" in the "Development" space using dark blue color
```

**System Response:**
```json
{
  "spaceName": "Development",
  "tagName": "important",
  "colorCommand": "dark blue color"
}
```

#### Updating a Tag
**User Prompt:**
```
Update the "priority" tag to have a blue background
```

**System Response:**
```json
{
  "spaceName": "Development",
  "tagName": "priority",
  "tagBg": "#0000FF"
}
```

#### Updating a Tag with Natural Language Color Command
**User Prompt:**
```
Change the "priority" tag color to light green
```

**System Response:**
```json
{
  "spaceName": "Development",
  "tagName": "priority",
  "colorCommand": "light green"
}
```

#### Adding a Tag to a Task
**User Prompt:**
```
Add the "feature" tag to the task "Implement Authentication"
```

**System Response:**
```json
{
  "taskName": "Implement Authentication",
  "tagName": "feature"
}
```

### Important Notes

1. **Tag Existence**: Before adding a tag to a task, ensure the tag exists in the space. Use `get_space_tags` to verify tag existence and `create_space_tag` to create it if needed.

2. **Color Formats**: 
   - **Hex Format**: Colors can be provided in hex format (e.g., "#FF5733", "#fff")
   - **Natural Language**: Colors can be specified using natural language (e.g., "blue", "dark red", "light green")
   - When using natural language colors, the system automatically generates appropriate foreground (text) colors for optimal contrast

3. **Case Sensitivity**: Tag names are case-sensitive. "Feature" and "feature" are treated as different tags.

4. **Task Tags**: When creating or updating tasks, you can include tags in the task properties:
   ```json
   {
     "name": "New Task",
     "tags": ["feature", "priority"]
   }
   ```

## Document Management

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| create_document | Create a document | `name`, `parent` (with `id` and `type`), `visibility`, `create_page` | None |
| get_document | Get document details | `documentId` or `documentName` | `workspaceId` |
| list_documents | List documents | None | `id`, `creator`, `deleted`, `archived`, `parent_id`, `parent_type`, `limit`, `next_cursor` |
| list_document_pages | List document pages | `documentId` or `documentName` | `max_page_depth` (-1 for unlimited) |
| get_document_pages | Get document pages | `documentId` or `documentName`, `pageIds` | `content_format` ('text/md'/'text/html') |
| create_document_page | Create a document page | `documentId` or `documentName`, `name` | `content`, `sub_title`, `parent_page_id` |
| update_document_page | Update a document page | `documentId` or `documentName`, `pageId` | `name`, `sub_title`, `content`, `content_format`, `content_edit_mode` |

### Document Parameters

- **Parent Types**:
  - Space (4)
  - Folder (5)
  - List (6)
  - All (7)
  - Workspace (12)

- **Visibility Settings**:
  - PUBLIC: Document is visible to all workspace members
  - PRIVATE: Document is visible only to specific members

- **Content Formats**:
  - text/md: Markdown format (default)
  - text/html: HTML format (for get_document_pages)
  - text/plain: Plain text format (for update_document_page)

- **Content Edit Modes**:
  - replace: Replace existing content (default)
  - append: Add content at the end
  - prepend: Add content at the beginning

### Examples

#### Creating a Document with Initial Page
```json
{
  "name": "Technical Documentation",
  "parent": {
    "id": "123456",
    "type": 4
  },
  "visibility": "PUBLIC",
  "create_page": true
}
```

#### Getting Document Details
**User Prompt:**
```
Get details for the document with id 8cdu22c-13153
```

**System Response:**
```json
{
  "id": "8cdu22c-13153",
  "name": "Project Documentation",
  "parent": {
    "id": "90130315830",
    "type": 4
  },
  "created": "2025-04-18T20:47:23.611Z",
  "updated": "2025-04-18T20:47:23.611Z",
  "creator": 55154194,
  "public": false,
  "type": 1,
  "url": "https://app.clickup.com/..."
}
```

#### Listing Documents
**User Prompt:**
```
Show me all documents in the workspace
```

**System Response:**
```json
{
  "documents": [
    {
      "id": "8cdu22c-10153",
      "name": "First Doc name",''
      "url": "https://app.clickup.com/...",
      "parent": {
        "id": "90131843402",
        "type": 5
      },
      "created": "2024-08-16T19:30:17.853Z",
      "updated": "2025-04-02T14:07:42.454Z",
      "creator": 55158625,
      "public": false,
      "type": 1
    },
    {
      "id": "8cdu22c-10173",
      ...
    },
  ]
}
```

#### Listing Document Pages
**User Prompt:**
``` 
Show me all pages for the document with id 8cdu22c-13153
```

**System Response:**
```json
[
  {
    "id": "8cdu22c-11473",
    "doc_id": "8cdu22c-3747",
    "workspace_id": 9007073356,
    "name": "Model"
  },
  {
    "id": "8cdu22c-13013",
    "doc_id": "8cdu22c-3747",
    "workspace_id": 9007073356,
    "name": "Document Example",
    "pages": [
      {
        "id": "8cdu22c-1687",
        "doc_id": "8cdu22c-3747",
        "parent_page_id": "8cdu22c-13013",
        "workspace_id": 9007073356,
        "name": "Aditional Features",
        "pages": [
          {
            "id": "8cdu22c-1687",
            "doc_id": "8cdu22c-3747",
            "parent_page_id": "8cdu22c-13013",
            "workspace_id": 9007073356,
            "name": "Aditional Features pt 2",
          },
          ...
        ],
      }
    ]
  }
]
```

#### Getting Document Page
**User Prompt:**
```
Get details for the page "Milestones" in the document with id 8cdu22c-13153

Obs: you can also ask for more pages at once
```

**System Response:**
```json
{
  "pages": [
    {
      "id": "8cdu22c-36253",
      "doc_id": "8cdu22c-13133",
      "workspace_id": 9007073356,
      "name": "teste2",
      "date_created": 1745010444340,
      "date_updated": 1745010454496,
      "content": "....#md",
      "creator_id": 55154194,
      "deleted": false,
      "date_edited": 1745010454496,
      "edited_by": 55154194,
      "archived": false,
      "protected": false,
      "presentation_details": {
        "show_contributor_header": false
      }
    },
    ....
  ]
}
```

#### Creating Document Page
**User Prompt:**
```
Create a page at the document 8cdu22c-13133 with ...
or
Create a subpage for page 8cdu22c-151232 with ...
```

**System Response:**
```json
{
  "id": "8cdu22c-36273",
  "doc_id": "8cdu22c-13133",
  "workspace_id": 9007073356,
  "name": "📝 Página de Exemplo",
  "sub_title": "Demonstração de criação de página",
  "date_created": 1745171083589,
  "date_updated": 1745171083589,
  "content": "Md example content",
  "creator_id": 55154194,
  "deleted": false,
  "archived": false,
  "protected": false
}
```

#### Updating / Editing Document Page
**User Prompt:**
```
Edit page 8cdu22c-36293 adding, in the end, another information...
```

**System Response:**
```json
{
  "message": "Page updated successfully"
}
```

## Workspace Organization

| Tool | Description | Required Parameters | Response |
|------|-------------|-------------------|----------|
| get_workspace_hierarchy | Get complete structure | None | Full workspace tree with spaces, folders, and lists |

### Workspace Tree Structure
```json
{
  "workspace": {
    "id": "team_id",
    "name": "Workspace Name",
    "spaces": [{
      "id": "space_id",
      "name": "Space Name",
      "lists": [...],
      "folders": [{
        "id": "folder_id",
        "name": "Folder Name",
        "lists": [...]
      }]
    }]
  }
}
```

## Feedback

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| submit_feedback | Submit bug reports, feature requests, or questions via GitHub | `type` (bug/feature/question), `title`, `description` | `nodeVersion`, `mcpHost`, `operatingSystem`, `additionalContext` |

The `submit_feedback` tool generates a pre-filled GitHub issue link that the user can review and submit. The AI agent will proactively suggest this tool when errors occur or when users express frustration with missing features.

## Prompts

The server exposes MCP prompts that guide multi-step workflows.

### organize_workspace

Analyzes your workspace structure and creates an actionable organization plan.

| Argument | Required | Description |
|----------|----------|-------------|
| `focus` | No | Limit analysis to a specific area of the workspace |
| `goals` | No | Describe what you want to achieve (e.g., "simplify navigation", "consolidate projects", "clean up old tasks") |

The prompt guides the AI through a 5-step process:
1. **Gather Data** — Calls `get_workspace_hierarchy` to map your workspace
2. **Analyze** — Evaluates against best practices (hierarchy depth, naming consistency, task distribution, etc.)
3. **Create Plan** — Produces a phased plan: non-destructive changes first, structural moves second, destructive cleanup last (with explicit approval)
4. **Save Plan** — Creates a ClickUp Doc titled "Workspace Organization Plan — [Date]"
5. **Execute** — Waits for user approval, then executes phase by phase with progress reporting

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CLICKUP_MCP_LICENSE_KEY` | Your Polar.sh license key | Required |
| `CLICKUP_API_KEY` | ClickUp API token | Required (STDIO mode) |
| `CLICKUP_TEAM_ID` | Default workspace/team ID | Required |
| `ENABLED_TOOLS` | Comma-separated list of tool names to enable (all others disabled) | All tools enabled |
| `DISABLED_TOOLS` | Comma-separated list of tool names to disable (all others enabled) | None disabled |
| `DOCUMENT_SUPPORT` | Enable document management tools | `false` |

### Tool Filtering

You can control which tools are exposed to the AI agent using `ENABLED_TOOLS` or `DISABLED_TOOLS` (mutually exclusive — do not use both):

**Allow only specific tools:**
```json
{
  "env": {
    "ENABLED_TOOLS": "get_task,create_task,update_task,get_workspace_hierarchy"
  }
}
```

**Disable specific tools:**
```json
{
  "env": {
    "DISABLED_TOOLS": "delete_task,delete_bulk_tasks,delete_list,delete_folder"
  }
}
```

## Error Handling

The server provides clear error messages for:
- Missing required parameters
- Invalid IDs or names
- Items not found
- Permission issues
- API rate limiting

### Common Error Responses
```json
{
  "error": "List with name 'Development' not found",
  "type": "NOT_FOUND"
}
```

```json
{
  "error": "Either taskId or taskName is required",
  "type": "MISSING_PARAMETER"
}
```

### Rate Limiting
- Automatic handling of ClickUp API rate limits
- Built-in retry mechanism with exponential backoff
- Status updates during rate limit waits

## Chat Management

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| get_chat_channels | Retrieve all chat channels in the workspace | None | None |
| create_chat_channel | Create a new chat channel | `name` | `space_id`, `folder_id`, `list_id` |
| create_chat_message | Send a message to a channel | `comment_text` and either `channel_id` or `channel_name` | `notify_all` |
| get_chat_messages | Retrieve message history from a channel | Either `channel_id` or `channel_name` | None |

### Chat Parameters

- **Markdown Support**: Messages sent via `create_chat_message` support standard markdown formatting (**bold**, *italic*, etc.).
- **Channel Resolution**: You can interact with channels by their `channel_name` instead of needing the internal ID. The server will resolve the name to the correct ID automatically.
- **Privacy**: Channels can be workspace-wide or restricted to specific spaces, folders, or lists.

### Examples

#### Listing Channels
**User Prompt:**
```
List all chat channels in my workspace.
```

**System Response:**
```json
{
  "channels": [
    {
      "id": "8cm397h-433",
      "name": "General",
      "type": "CHANNEL",
      "visibility": "PUBLIC"
    },
    {
      "id": "8cm397h-452",
      "name": "Development",
      "type": "CHANNEL",
      "visibility": "PUBLIC"
    }
  ]
}
```

#### Sending a Message
**User Prompt:**
```
Send a message to the "General" channel saying "Hello everyone! The deployment is successful." 
Use bold for "deployment" and italics for "successful".
```

**System Response:**
```json
{
  "channel_name": "General",
  "comment_text": "Hello everyone! The **deployment** is *successful*."
}
```

#### Creating a Channel
**User Prompt:**
```
Create a new chat channel called "Project Alpha" in the "Engineering" space.
```

**System Response:**
```json
{
  "name": "Project Alpha",
  "space_id": "90132678315"
}
```

#### Getting Message History
**User Prompt:**
```
Show me the last messages from the "Development" chat.
```

**System Response:**
```json
{
  "channel_name": "Development"
}
```


## Member Management Tools

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| get_workspace_members | Get all members in workspace | None | None |
| find_member_by_name | Find member by name or email | `nameOrEmail` | None |

---

<div align="center">
  <sub>💳 <a href="https://buy.polar.sh/polar_cl_tZ2q8jRvtaaduurOkQKKJmRgdD43ZiB5K0GZn0aQcur?utm_source=github&utm_medium=user-guide">Purchase License</a> · 25% OFF Lifetime with code <strong>MAR25</strong></sub><br>
  <sub>Created by <a href="https://github.com/taazkareem">taazkareem</a></sub>
</div>
