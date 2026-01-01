# ClickUp MCP Server Documentation

This document provides detailed information about all available tools, their parameters, and usage examples for the ClickUp MCP Server.

## Table of Contents
- [Server Transport Options](#server-transport-options)
- [Task Management](#task-management)
- [List Management](#list-management)
- [Folder Management](#folder-management)
- [Tag Management](#tag-management)
- [Time Tracking](#time-tracking)
- [Document Management](#document-management)
- [Chat Management](#chat-management)
- [Workspace Organization](#workspace-organization)
- [Prompts](#prompts)
- [Common Parameters](#common-parameters)
- [Error Handling](#error-handling)
- [Member Management Tools](#member-management-tools)
- [Task Creation with Assignees](#task-creation-and-updates-with-assignees)

## Server Transport Options

The ClickUp MCP Server supports multiple transport mechanisms for communication with clients:

### STDIO Transport (Default)
The standard transport using stdin/stdout communication. Compatible with most MCP clients including Claude Desktop.

### SSE Transport (Server-Sent Events)
Enables web-based integrations and real-time communication. Perfect for:
- **n8n workflow automation**
- **Web applications**
- **Custom browser-based clients**
- **Real-time task monitoring**

#### SSE Configuration
```json
{
  "env": {
    "ENABLE_SSE": "true",
    "SSE_PORT": "3000",
    "ENABLE_STDIO": "true"
  }
}
```

#### SSE Endpoints
- **`GET /events`** - SSE connection endpoint for receiving server events
- **`POST /request`** - Send JSON-RPC requests to the server
- **`GET /health`** - Health check endpoint

For detailed SSE setup instructions, see [SSE Transport Documentation](sse-transport.md).

## Task Management

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| get_tasks | Retrieve tasks from a list | Either `listId` or `listName` | archived, page, order_by, reverse, subtasks, statuses, include_closed, assignees, due_date_gt/lt |
| get_task | Get single task details with global lookup | Either `taskId` or `taskName` (list context optional) | `listName` (for disambiguation), `subtasks` |
| get_task_comments | Retrieve comments for a task | Either `taskId` or `taskName` | `listName`, `start`, `startId`, `include_replies` |
| create_task_comment | Add a comment to a task | `commentText` OR `formattedComment`, and either `taskId` or (`taskName`+`listName`) | `notifyAll`, `assignee` |
| attach_task_file | Attach a file to a task | Either `taskId` or `taskName`, and EITHER `file_data` OR `file_url` | `file_name`, `chunk_*` parameters for large files |
| create_task | Create a new task | `name` and either `listId` or `listName` | description, status, priority (1-4), dueDate, startDate, parent (ID or Name), assignees |
| create_bulk_tasks | Create multiple tasks | `tasks[]` | `listId` or `listName` |
| update_task | Modify task properties | Either `taskId` or `taskName` | name, description, status, priority, dueDate, startDate, parent (ID or Name) |
| update_bulk_tasks | Modify multiple tasks | `tasks[]` with task identifiers | Each task can have: name, description, status, priority, dueDate, startDate, etc. |
| delete_task | Remove a task | `taskId` | `taskName`, `listName` |
| delete_bulk_tasks | Remove multiple tasks | `tasks[]` with task identifiers | None |
| move_task | Move task to another list | Either `taskId` or `taskName`, and either `listId` or `listName` | `sourceListName` |
| move_bulk_tasks | Move multiple tasks | `tasks[]` with task identifiers, and target list | None |
| duplicate_task | Copy task to another list | Either `taskId` or `taskName`, and either `listId` or `listName` | `sourceListName` |
| get_workspace_tasks | Retrieve tasks across the workspace with enhanced filtering | At least one filter parameter (tags, list_ids, folder_ids, space_ids, statuses, assignees, or date filters) | page, order_by, reverse, detail_level, subtasks |
| add_task_link | Link two tasks together | Either `taskId` or `taskName`, and either `targetTaskId` or `targetTaskName` | `listName`, `targetListName`, `linksTo` |
| get_task_links | Get all links for a task | Either `taskId` or `taskName` | `listName` |
| delete_task_link | Remove a task link | Either `taskId` or `taskName`, and either `linkId` or `targetTaskName` | `listName`, `targetListName` |

### Task Parameters

- **Priority Levels**: 1 (Urgent/Highest) to 4 (Low)
- **Dates**: Unix timestamps in milliseconds
- **Status**: Uses list's default if not specified
- **Description**: Supports both plain text and markdown
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
  "taskId": "DEV-1234"  // Custom ID - automatically detected
}
```

```json
{
  "taskId": "86b4bnnny"  // Regular ClickUp ID - 9 characters
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
It should be high priority and due on January 1st, 2024. 
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

The `get_workspace_tasks` tool offers two response formats to optimize for different use cases:

1. **Summary Format** (`detail_level: 'summary'`):
   - Lightweight response with essential task information
   - Ideal for lists, overviews, and large datasets
   - Includes: id, name, status, list info, due date, URL, priority, and tags
   - Automatically used when response size exceeds 50,000 tokens

2. **Detailed Format** (`detail_level: 'detailed'`):
   - Complete task information including all fields
   - Best for detailed views and task management
   - Includes: all task data, custom fields, descriptions, comments, etc.

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

#### New Parameters for Enhanced Workspace Tasks

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `detail_level` | string | Response format: `"summary"`, `"detailed"`, or `"names"` | `"detailed"` |
| `subtasks` | boolean | Include subtasks in results (must match filter criteria) | `false` |
| `list_ids` | array | **Enhanced**: Uses Views API for comprehensive task coverage | - |

**Important Notes**:
- **`detail_level`**: Controls response format and size
  - `"summary"`: Lightweight response with essential fields
  - `"names"`: Ultra-lightweight response with only task IDs and names
  - `"detailed"`: Complete task data with all fields
  - Automatically switches to summary if response exceeds 50,000 tokens
- **`subtasks`**: Subtasks must still match your other filter criteria to appear
- **`list_ids`**: Now provides enhanced coverage using Views API

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

#### Enhanced List Filtering with Views API (Multi-List Tasks)

**NEW FEATURE**: When using `list_ids` parameter, `get_workspace_tasks` now uses ClickUp's Views API for comprehensive task coverage, including tasks in multiple lists.

**Key Benefits**:
- ✅ Retrieves tasks *associated with* specified lists (not just created in them)
- ✅ Includes tasks created elsewhere and added to multiple lists
- ✅ Supports ClickUp's "tasks in multiple lists" feature
- ✅ Two-tier filtering strategy for optimal performance
- ✅ Concurrent API calls for multiple lists

**How It Works**:
1. **Views API Integration**: Calls `/list/{listId}/view` and `/view/{viewId}/task` endpoints
2. **Server-side Filtering**: Supported filters applied at ClickUp API level
3. **Client-side Filtering**: Additional filters (tags, folders, spaces) applied after retrieval
4. **Task Deduplication**: Prevents duplicate results when tasks appear in multiple lists

**Example - Enhanced List Filtering**:
```json
{
  "list_ids": ["901407112060", "901407112061"],
  "tags": ["cursor agent"],
  "detail_level": "summary"
}
```

**Response includes**:
- Tasks originally created in the specified lists
- Tasks created elsewhere but added to the specified lists
- Tasks appearing through multi-list associations
- Proper deduplication for tasks in multiple specified lists

**Performance Features**:
- Concurrent processing of multiple lists
- Automatic summary format for large responses (>50,000 tokens)
- Safety limits to prevent infinite pagination
- Comprehensive error handling with graceful degradation

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

#### Handling Different File Types
The attach_task_file tool supports various file types including:
- Documents (PDF, DOCX, TXT)
- Images (PNG, JPG, SVG)
- Data files (CSV, JSON)
- And many others

Files can be attached using either:
1. **Base64 Method**: For small files (using `file_data` parameter)
2. **URL Method**: For files already available online (using `file_url` parameter)
3. **Local File Path**: For files on the local filesystem (using `file_url` parameter with an absolute file path)
4. **Chunked Upload**: For large files (automatically selected for `file_data` > 10MB)

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
  "taskId": "86b4bnnny", 
  "targetTaskId": "86b4bmmmx",
  "link_id": "12345678"
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
  "taskId": "86b4bnnny",
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
**Note:** The `linkId` parameter corresponds to the Task ID of the linked task (the target task).
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

## List Management

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| create_list | Create a new list | `name` and either `spaceId` or `spaceName` | content, dueDate, priority, assignee |
| create_list_in_folder | Create list in folder | `name` and either `folderId` or `folderName` | content, status |
| get_list | Get list details | Either `listId` or `listName` | None |
| update_list | Update list properties | Either `listId` or `listName` | name, content, status |
| delete_list | Delete a list | Either `listId` or `listName` | None |

### List Parameters

- **Content**: Description or purpose of the list
- **Priority**: Same scale as tasks (1-4)
- **Status**: Initial status for the list

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

### Folder Parameters

- **override_statuses**: Boolean to determine if folder should use custom statuses
- **name**: Display name for the folder

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

5. **Supported Color Names**: Basic colors (red, blue, green, etc.) and common variations (dark blue, light green, etc.) are supported.

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

### Best Practices and Limits

1. **Document Creation**:
   - Choose appropriate parent type based on your organization structure
   - Use meaningful names that follow your documentation standards
   - Consider visibility settings carefully for sensitive information

2. **Page Organization**:
   - Create a clear hierarchy using parent_page_id
   - Use descriptive titles and subtitles
   - Keep content modular and well-structured

3. **Performance Considerations**:
   - Use pagination (limit and next_cursor) when listing documents
   - Set appropriate max_page_depth when listing pages
   - Batch page retrievals using get_document_pages with multiple pageIds

4. **API Limits**:
   - Maximum content size: 2MB per page
   - Rate limits: 100 requests per minute
   - Maximum page depth: No hard limit, but recommended to stay under 5 levels
   - Maximum pages per document: 1000

### Common Use Cases and Examples

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

## Common Parameters

### Name-based Lookup
All tools support looking up items by name instead of ID:
- `listName` instead of `listId`
- `taskName` instead of `taskId`
- `spaceName` instead of `spaceId`
- `folderName` instead of `folderId`
- `documentName` instead of `documentId`

### Date Formats
- All dates should be provided as Unix timestamps in milliseconds
- Example: `1703980800000` for January 1, 2024

### Priority Levels
1. Urgent/Highest
2. High
3. Normal
4. Low

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
| resolve_assignees | Resolve names/emails to user IDs | `assignees[]` | None |

## get_workspace_members

Returns all members (users) in the ClickUp workspace/team. Useful for resolving assignees by name or email.

### Parameters
- None

### Response
```json
{
  "members": [
    {
      "id": 123,
      "username": "jdoe",
      "email": "jdoe@example.com",
      "full_name": "John Doe",
      "profile_picture": "https://...",
      "role": 1,
      "role_name": "Admin",
      "initials": "JD",
      "last_active": "2025-05-17T12:00:00Z"
    }
  ]
}
```

## find_member_by_name

Finds a member in the ClickUp workspace by name or email. Returns the member object if found, or null if not found.

### Parameters
| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| nameOrEmail | string | Name or email of the member to find | Yes |

### Response
```json
{
  "member": {
    "id": 123,
    "username": "jdoe",
    "email": "jdoe@example.com",
    "full_name": "John Doe",
    "profile_picture": "https://...",
    "role": 1,
    "role_name": "Admin",
    "initials": "JD",
    "last_active": "2025-05-17T12:00:00Z"
  }
}
```

## resolve_assignees

Resolves an array of assignee names or emails to ClickUp user IDs. Returns an array of user IDs, or null for any that cannot be resolved.

### Parameters
| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| assignees | array | Array of names or emails to resolve | Yes |

### Response
```json
{
  "userIds": [123, 456]
}
```

## Task Creation and Updates with Assignees

When creating or updating tasks, you can assign users using the `assignees` parameter. The server automatically resolves user references, accepting an array of:
- **User IDs** (numeric or string)
- **Email addresses**
- **Usernames** or **Full Names**

### Examples

**Creating tasks with assignees:**
```json
{
  "name": "New Task",
  "description": "This is a new task.",
  "assignees": ["jdoe@example.com", "Jane Smith"]
}
```

**Updating task assignees:**
```json
{
  "taskId": "abc123",
  "assignees": ["newuser@example.com"]
}
```
*Note: Updating assignees will replace the existing assignees for that task.*

### Important Notes
- The member management tools help resolve user references when needed.
- The server automatically converts non-ID values (emails, usernames) to ClickUp user IDs.
- If a user cannot be found, the assignment will be skipped for that specific user without causing the entire request to fail.
- You can use `get_workspace_members` or `find_member_by_name` to verify user details before assignment.