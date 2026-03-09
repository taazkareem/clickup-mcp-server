[← Back to Documentation Index](../DOCUMENTATION.md)  
[← Back to README](../../README.md)  

# Task Management

The core of ClickUp MCP Server — create, update, move, delete, and query tasks across your workspace. Supports global task lookup by name, bulk operations, subtasks, file attachments, task linking, and natural language dates.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| get_task | Get single task details with global lookup | `task` (Name or ID) | `listName` (disambiguation), `subtasks`, `include_markdown_description` |
| manage_comments | Full comment lifecycle on tasks, lists, or views: get, create, update, delete, get_replies, create_reply, add_reaction, remove_reaction | `action` + action-specific params (see below) | `context_type` (default: `task`), varies by action |
| list_attachments | List attachments for a task or file custom field (v3) | `taskId` or `customFieldId` | `team_id` |
| get_attachment | Get a specific attachment by ID or name (v3) | `taskId` or `customFieldId`, `attachment_id` or `attachment_name` | `team_id` |
| upload_attachment | Upload a file to a task or custom field (v3) | `taskId` or `customFieldId`, `file_data` or `file_url` | `file_name`, `chunk_*` for large files, `team_id` |
| create_task | Create a new task | `name` and either `listId` or `listName` | description, status, priority (1-4), dueDate, startDate, time_estimate, parent (ID or Name), assignees, custom_task_type |
| create_bulk_tasks | Create multiple tasks | `tasks[]` | `listId` or `listName`; each task supports: name, description, status, priority, dueDate, startDate, time_estimate, assignees |
| update_task | Modify task properties | `task` (Name or ID) | name, description, status, priority, dueDate, startDate, time_estimate, parent (ID or Name), assignees, custom_task_type |
| update_bulk_tasks | Modify multiple tasks | `tasks[]` with task identifiers | Each task can have: name, description, status, priority, dueDate, startDate, time_estimate, assignees, custom_fields |
| delete_task | Remove a task | `task` (Name or ID) | `listName` |
| delete_bulk_tasks | Remove multiple tasks | `tasks[]` with task identifiers | None |
| move_task | Move task to another list (high-integrity TIML by default) | `task` (Name or ID) | `listId`, `listName`, `sourceListName`, `allowDestructiveFallback` |
| move_bulk_tasks | Move multiple tasks | `tasks[]` with task identifiers, and target list | `allowDestructiveFallback` |
| duplicate_task | Full-fidelity task duplication (copies tags, custom fields, checklists, subtasks; attachments are NOT copied — ClickUp API limitation) | `task` (Name or ID) | `listId`, `listName`, `sourceListName` |
| add_task_to_list | Add task to an additional list (TIML) | `task` (Name or ID) | `listId`, `listName`, `taskListName` |
| remove_task_from_list | Remove task from a list without deleting it (TIML) | `task` (Name or ID) | `listId`, `listName`, `taskListName` |
| get_workspace_tasks | Retrieve tasks across the workspace with enhanced filtering | At least one filter parameter (tags, list_ids, folder_ids, space_ids, statuses, assignees, or date filters) | page, order_by, reverse, detail_level, subtasks |
| add_task_link | Link two tasks together | `task` (Name or ID), `targetTask` (Name or ID) | `listName`, `targetListName` |
| get_task_links | Get all links for a task | `task` (Name or ID) | `listName` |
| delete_task_link | Remove a task link | `task` (Name or ID), `linkId` (target task Name or ID) | `listName`, `targetListName` |
| add_task_dependency | Add a blocking dependency between tasks | `task` (Name or ID), and exactly one of `depends_on` or `dependency_of` | `listName`, `depends_on_list`, `dependency_of_list` |
| delete_task_dependency | Remove a blocking dependency between tasks | `task` (Name or ID), and exactly one of `depends_on` or `dependency_of` | `listName`, `depends_on_list`, `dependency_of_list` |

## manage_comments Actions

| Action | Context | Description | Required Params | Optional Params |
|--------|---------|-------------|-----------------|-----------------|
| `get` | `task` | List all comments on a task | `task` | `listName`, `start`, `startId`, `include_replies` |
| `get` | `list` | List all comments on a list | `list_id` or `list_name` | — |
| `get` | `view` | List all comments on a view | `view_id` | — |
| `create` | `task` | Add a comment to a task | `task`, `commentText` or `formattedComment` | `listName`, `notifyAll`, `assignee` |
| `create` | `list` | Add a comment to a list | `list_id` or `list_name`, `commentText` or `formattedComment` | `notifyAll`, `assignee` |
| `create` | `view` | Add a comment to a view | `view_id`, `commentText` or `formattedComment` | `notifyAll`, `assignee` |
| `update` | any | Edit comment text or resolve/unresolve | `comment_id`, at least one of: `commentText`, `formattedComment`, `resolved` | — |
| `delete` | any | Permanently delete a comment | `comment_id` | — |
| `get_replies` | any | Get threaded replies for a comment | `comment_id` | — |
| `create_reply` | any | Reply to a comment thread | `comment_id`, `commentText` or `formattedComment` | `notifyAll`, `assignee` |
| `add_reaction` | any | Add an emoji reaction to a comment | `comment_id`, `reaction` | — |
| `remove_reaction` | any | Remove an emoji reaction from a comment | `comment_id`, `reaction` | — |

**Parameters:**
- `context_type` — `task` (default), `list`, or `view`. Determines where get/create operate. Ignored for update, delete, get_replies, create_reply, add_reaction, remove_reaction.
- `task` — Task Name (auto-resolved) or Task ID. Required for `get`/`create` when `context_type` is `task`.
- `list_id` — List ID. Required for `get`/`create` when `context_type` is `list`.
- `list_name` — List name (auto-resolved). Used when `context_type` is `list` and `list_id` is not provided.
- `view_id` — View ID. Required for `get`/`create` when `context_type` is `view`.
- `listName` — Disambiguates tasks when multiple share the same name (task context only).
- `comment_id` — The ClickUp comment ID. Required for `update`, `delete`, `get_replies`, `create_reply`, `add_reaction`, `remove_reaction`.
- `commentText` — Plain text / markdown (`**bold**`, `_italic_`, `` `code` ``, `- lists`). Automatically converted to ClickUp rich text.
- `formattedComment` — Rich text array with text blocks, `{type:'tag', user:{id}}` for @mentions, `{type:'emoji', unicode}` for emoji.
- `notifyAll` — Boolean. Notify all assignees (applies to `create`, `create_reply`).
- `assignee` — User ID number to assign the comment to.
- `resolved` — Boolean. Mark a comment resolved (`true`) or unresolved (`false`). Applies to `update`.
- `reaction` — Lowercase emoji name (e.g. `+1`, `-1`, `joy`, `heart`, `tada`). Required for `add_reaction`/`remove_reaction`.
- `include_replies` — Boolean. Fetch threaded replies inline for each comment. Applies to `get` (task context).

## Parameters

- **Priority Levels**: 1 (Urgent/Highest) to 4 (Low) — accepts string or number (e.g., `"1"` or `1`)
- **Dates**: Unix timestamps in milliseconds
- **Status**: Uses list's default if not specified
- **Description**: Supports both plain text and markdown. Use `include_markdown_description: true` on `get_task` to retrieve high-fidelity markdown formatting.
- **Files**: Attach files using base64 encoding or URLs
- **Subtasks**:
  - Retrieve subtasks with `subtasks: true` parameter on `get_task` or `get_tasks`
  - Create subtasks by setting `parent` parameter with parent task ID or Name on `create_task`
  - Convert tasks to subtasks by setting `parent` parameter with parent task ID or Name on `update_task` (parent must be in same list)
  - Multi-level subtasks are supported (subtasks can have their own subtasks)
- **Time Estimates**:
  - Accepts natural language: `"2h"`, `"45m"`, `"1h 30m"`, `"2.5h"`
  - Accepts a plain number (treated as minutes): `"90"` → 90 minutes
  - On `update_task` / `update_bulk_tasks`, pass `"null"` to clear an existing estimate
  - Supported on: `create_task`, `create_bulk_tasks`, `update_task`, `update_bulk_tasks`
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

## Examples

### Creating a Task
**User Prompt:**
```
Create a new task in the "Development Tasks" list called "Implement Authentication".
It should be high priority and due on July 1st, 2026.
Add these requirements:
- OAuth2 support
- JWT tokens
- Refresh token flow
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "listName": "Development Tasks",
  "name": "Implement Authentication",
  "markdown_description": "## Requirements\n- OAuth2 support\n- JWT tokens\n- Refresh token flow",
  "priority": 1,
  "dueDate": 1703980800000
}
```

**Tool Response:**
```json
{
  "id": "8b9n2x0q7",
  "name": "Implement Authentication",
  "description": "## Requirements\n- OAuth2 support\n- JWT tokens\n- Refresh token flow",
  "url": "https://app.clickup.com/t/8b9n2x0q7",
  "status": {
    "status": "To Do",
    "color": "#ddd",
    "type": "custom"
  },
  "date_created": "2024-03-16T10:00:00.000Z",
  "date_updated": "2024-03-16T10:00:00.000Z",
  "creator": {
    "id": 1234567,
    "username": "developer1"
  },
  "assignees": [],
  "priority": 1,
  "due_date": "2024-07-01T23:59:59.000Z",
  "list": {
    "id": "list123",
    "name": "Development Tasks"
  },
  "space": {
    "id": "space123",
    "name": "Engineering"
  }
}
```

### Creating a Task with Start Date and Due Date
**User Prompt:**
```
Create a task called "Database Migration" that starts tomorrow at 9am and is due by the end of the week.
It should be in the "Backend Tasks" list.
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "listName": "Backend Tasks",
  "name": "Database Migration",
  "startDate": "tomorrow at 9am",
  "dueDate": "end of week"
}
```

**Tool Response:**
```json
{
  "id": "9c4k3y1r2",
  "name": "Database Migration",
  "description": "",
  "url": "https://app.clickup.com/t/9c4k3y1r2",
  "status": {
    "status": "To Do",
    "color": "#ddd",
    "type": "custom"
  },
  "date_created": "2024-03-16T10:15:00.000Z",
  "date_updated": "2024-03-16T10:15:00.000Z",
  "creator": {
    "id": 1234567,
    "username": "developer1"
  },
  "assignees": [],
  "priority": 3,
  "start_date": "2024-03-17T09:00:00.000Z",
  "due_date": "2024-03-22T23:59:59.000Z",
  "list": {
    "id": "list456",
    "name": "Backend Tasks"
  },
  "space": {
    "id": "space123",
    "name": "Engineering"
  }
}
```

### Updating a Task's Start Date
**User Prompt:**
```
Change the start date of the "Database Migration" task to next Monday at 8am
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "taskName": "Database Migration",
  "startDate": "next Monday at 8am"
}
```

**Tool Response:**
```json
{
  "id": "9c4k3y1r2",
  "name": "Database Migration",
  "description": "",
  "url": "https://app.clickup.com/t/9c4k3y1r2",
  "status": {
    "status": "To Do",
    "color": "#ddd"
  },
  "date_updated": "2024-03-16T10:20:00.000Z",
  "priority": 3,
  "start_date": "2024-03-24T08:00:00.000Z",
  "due_date": "2024-03-22T23:59:59.000Z",
  "list": {
    "id": "list456",
    "name": "Backend Tasks"
  }
}
```

### Getting Task Comments
**User Prompt:**
```
Show me the comments on the "Bug Fix" task.
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "task": "Bug Fix"
}
```

**Tool Response:**
```json
{
  "comments": [
    {
      "id": "abcd1234",
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
  "count": 2
}
```

### Getting Task Comments with Replies
**User Prompt:**
```
Show me the comments on the "Bug Fix" task including replies.
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "taskName": "Bug Fix",
  "include_replies": true
}
```

**Tool Response:**
```json
{
  "comments": [
    {
      "id": "abcd1234",
      "comment_text": "I've identified the root cause. It's related to a race condition in the auth flow.",
      "user": {
        "id": 1234567,
        "username": "developer1",
        "email": "dev1@example.com",
        "color": "#ff7800"
      },
      "resolved": false,
      "date": "2024-03-15T10:30:45.000Z",
      "replies": [
        {
          "id": "reply1",
          "comment_text": "Good catch! Let's discuss in the standup.",
          "user": {
            "id": 7654321,
            "username": "manager1",
            "email": "manager@example.com"
          },
          "date": "2024-03-15T10:45:00.000Z"
        }
      ]
    },
    {
      "id": "efgh5678",
      "comment_text": "Great work! Could you submit a PR by tomorrow?",
      "user": {
        "id": 7654321,
        "username": "manager1",
        "email": "manager@example.com",
        "color": "#0080ff"
      },
      "resolved": false,
      "date": "2024-03-15T11:15:20.000Z",
      "replies": []
    }
  ],
  "count": 2
}
```

### Creating a Task Comment
**User Prompt:**
```
Add a comment to the "Bug Fix" task saying "I've fixed the issue by implementing proper mutex locks."
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "task": "Bug Fix",
  "commentText": "I've fixed the issue by implementing proper mutex locks."
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "comment": {
    "id": "ijkl9012",
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

### Creating a Formatted Task Comment
**User Prompt:**
```
Add a formatted comment to "Bug Fix" with:
- Bold text for "Analysis"
- A bullet list of findings
- A code block with the fix
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
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

**Tool Response:**
```json
{
  "success": true,
  "message": "Formatted comment added successfully",
  "comment": {
    "id": "fmtcomment1",
    "comment_text": "Analysis\nHere are the findings:\nRace condition identified\nMutex lock missing\nconst lock = new Mutex();\nawait lock.acquire();",
    "user": {
      "id": 1234567,
      "username": "developer1",
      "email": "dev1@example.com",
      "color": "#ff7800"
    },
    "date": "2024-03-16T14:30:00.000Z",
    "resolved": false,
    "formatted": true
  }
}
```

**Supported Formatting:**
The `formattedComment` parameter accepts a JSON object following the Quill Delta format. Supported attributes include:
- **Text Styles**: `bold`, `italic`, `underline`, `strike`, `code`
- **Lists**: `list: "bullet"`, `list: "ordered"`, `list: "checked"`, `list: "unchecked"`
- **Structure**: `header` (1-4), `code-block`
- **Elements**: `link`, `image`, `user` (mentions)


### Moving a Task
**User Prompt:**
```
Move the "Bug Fix" task from the "Sprint Backlog" list to "Current Sprint" list
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "taskName": "Bug Fix",
  "sourceListName": "Sprint Backlog",
  "destinationListName": "Current Sprint"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Task moved successfully using TIML",
  "task": {
    "id": "2j1x9q3y4",
    "name": "Bug Fix",
    "status": {
      "status": "To Do",
      "color": "#ddd"
    },
    "lists": [
      {
        "id": "list_sprint",
        "name": "Current Sprint"
      },
      {
        "id": "list_backlog",
        "name": "Sprint Backlog"
      }
    ]
  }
}
```

### Global Task Lookup
**User Prompt:**
```
Get details for task "Roadmap Planning"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "taskName": "Roadmap Planning"
}
```

**Tool Response:**
```json
{
  "id": "5l2k8m4p9",
  "name": "Roadmap Planning",
  "description": "Plan Q2 and Q3 roadmap",
  "url": "https://app.clickup.com/t/5l2k8m4p9",
  "status": {
    "status": "In Progress",
    "color": "#f1c975"
  },
  "date_created": "2024-02-01T09:00:00.000Z",
  "date_updated": "2024-03-16T11:00:00.000Z",
  "creator": {
    "id": 1234567,
    "username": "developer1"
  },
  "assignees": [
    {
      "id": 987654,
      "username": "product_manager"
    }
  ],
  "priority": 1,
  "due_date": "2024-03-31T23:59:59.000Z",
  "list": {
    "id": "list789",
    "name": "Strategic Planning"
  },
  "space": {
    "id": "space123",
    "name": "Product"
  }
}
```

### Getting Task Details with Markdown
**User Prompt:**
```
Get the task details for "Implement Authentication" including its markdown description.
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "taskName": "Implement Authentication",
  "include_markdown_description": true
}
```

**Tool Response:**
```json
{
  "id": "8b9n2x0q7",
  "name": "Implement Authentication",
  "description": "## Requirements\n- OAuth2 support\n- JWT tokens\n- Refresh token flow",
  "markdown_description": "## Requirements\n- OAuth2 support\n- JWT tokens\n- Refresh token flow",
  "url": "https://app.clickup.com/t/8b9n2x0q7",
  "status": {
    "status": "In Progress",
    "color": "#f1c975"
  },
  "date_created": "2024-03-16T10:00:00.000Z",
  "date_updated": "2024-03-16T14:30:00.000Z",
  "creator": {
    "id": 1234567,
    "username": "developer1"
  },
  "assignees": [
    {
      "id": 1234567,
      "username": "developer1"
    }
  ],
  "priority": 1,
  "due_date": "2024-07-01T23:59:59.000Z",
  "list": {
    "id": "list123",
    "name": "Development Tasks"
  },
  "space": {
    "id": "space123",
    "name": "Engineering"
  }
}
```

**Response for Multiple Matches:**
```json
{
  "matches": [
    {
      "id": "abc123",
      "name": "Website Update",
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
      "name": "Website Update",
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

### Updating Task Status
**User Prompt:**
```
Update the "Bug Fix" task status to "Done"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "taskName": "Bug Fix",
  "status": "Done"
}
```

**Tool Response:**
```json
{
  "id": "2j1x9q3y4",
  "name": "Bug Fix",
  "description": "Fix authentication bug in login flow",
  "url": "https://app.clickup.com/t/2j1x9q3y4",
  "status": {
    "status": "Done",
    "color": "#5dce0f",
    "type": "custom"
  },
  "date_updated": "2024-03-16T15:00:00.000Z",
  "priority": 1,
  "list": {
    "id": "list_sprint",
    "name": "Current Sprint"
  },
  "space": {
    "id": "space123",
    "name": "Engineering"
  }
}
```

### Bulk Creating Tasks
**User Prompt:**
```
Create these tasks in the "Sprint Backlog" list:
1. Set up CI/CD pipeline (high priority)
2. Write unit tests (normal priority)
3. Update documentation (low priority)
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
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

**Tool Response:**
```json
{
  "tasks": [
    {
      "id": "task_ci_cd",
      "name": "Set up CI/CD pipeline",
      "status": {
        "status": "To Do",
        "color": "#ddd"
      },
      "priority": 2,
      "url": "https://app.clickup.com/t/task_ci_cd",
      "list": {
        "id": "list_backlog",
        "name": "Sprint Backlog"
      }
    },
    {
      "id": "task_tests",
      "name": "Write unit tests",
      "status": {
        "status": "To Do",
        "color": "#ddd"
      },
      "priority": 3,
      "url": "https://app.clickup.com/t/task_tests",
      "list": {
        "id": "list_backlog",
        "name": "Sprint Backlog"
      }
    },
    {
      "id": "task_docs",
      "name": "Update documentation",
      "status": {
        "status": "To Do",
        "color": "#ddd"
      },
      "priority": 4,
      "url": "https://app.clickup.com/t/task_docs",
      "list": {
        "id": "list_backlog",
        "name": "Sprint Backlog"
      }
    }
  ],
  "count": 3,
  "successful": 3,
  "failed": 0
}
```

### Bulk Creating Tasks with Start and Due Dates
**User Prompt:**
```
Create these tasks in the "Project X" list:
1. Research - starts today, due in 3 days
2. Design - starts after Research ends, due in a week from start
3. Implementation - starts after Design, due in 2 weeks from start
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
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

**Tool Response:**
```json
{
  "tasks": [
    {
      "id": "task_research",
      "name": "Research",
      "status": {
        "status": "To Do",
        "color": "#ddd"
      },
      "start_date": "2024-03-16T00:00:00.000Z",
      "due_date": "2024-03-19T23:59:59.000Z",
      "list": {
        "id": "list_proj_x",
        "name": "Project X"
      }
    },
    {
      "id": "task_design",
      "name": "Design",
      "status": {
        "status": "To Do",
        "color": "#ddd"
      },
      "start_date": "2024-03-20T00:00:00.000Z",
      "due_date": "2024-03-27T23:59:59.000Z",
      "list": {
        "id": "list_proj_x",
        "name": "Project X"
      }
    },
    {
      "id": "task_impl",
      "name": "Implementation",
      "status": {
        "status": "To Do",
        "color": "#ddd"
      },
      "start_date": "2024-03-28T00:00:00.000Z",
      "due_date": "2024-04-11T23:59:59.000Z",
      "list": {
        "id": "list_proj_x",
        "name": "Project X"
      }
    }
  ],
  "count": 3,
  "successful": 3,
  "failed": 0
}
```

### Filtering Tasks by Tags
**User Prompt:**
```
Find all tasks with the tags "bug" and "high-priority" across the workspace
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "tags": ["bug", "high-priority"],
  "include_closed": false
}
```

**Tool Response:**
```json
{
  "tasks": [
    {
      "id": "abcd1234",
      "name": "Fix authentication bug",
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
      ],
      "list": {
        "id": "list123",
        "name": "Current Sprint"
      },
      "due_date": "2024-03-20T23:59:59.000Z",
      "url": "https://app.clickup.com/t/abc123"
    }
  ],
  "count": 1
}
```

### Adaptive Response Format in Workspace Tasks

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
      "name": "Important Task",
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
      "id": "123abc",
      "name": "Important Task",
      "description": "Detailed task description...",
      "status": {
        "status": "in progress",
        "color": "#4A90E2"
      },
      "custom_fields": [],
      "assignees": [],
      "watchers": [],
      "checklists": []
    }
  ],
  "total_count": 100,
  "has_more": true,
  "next_page": 1
}
```

### Workspace Task Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `detail_level` | string | Response format: `"summary"`, `"detailed"`, or `"names"` | `"detailed"` |
| `subtasks` | boolean | Include subtasks in results (must match filter criteria) | `false` |
| `list_ids` | array | Filter by specific list IDs | - |

#### Best Practices for Workspace Tasks

1. **Use Filters or Search**: At least one filter or search parameter is required to prevent overly broad queries:
   - `search_query`: Broad, cross-field fuzzy search (matches task name, status, tags, description)
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
     "team_id": "9876543210",
     "search_query": "authentication",
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

### Bulk Updating Tasks
**User Prompt:**
```
Update all the following tasks to high priority:
1. "Implement login screen"
2. "Create database schema"
3. "Set up CI pipeline"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
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

**Tool Response:**
```json
{
  "successful": 3,
  "failed": 0,
  "tasks": [
    {
      "id": "task_login",
      "name": "Implement login screen",
      "priority": 2,
      "status": {
        "status": "In Progress",
        "color": "#f1c975"
      }
    },
    {
      "id": "task_db",
      "name": "Create database schema",
      "priority": 2,
      "status": {
        "status": "To Do",
        "color": "#ddd"
      }
    },
    {
      "id": "task_ci",
      "name": "Set up CI pipeline",
      "priority": 2,
      "status": {
        "status": "To Do",
        "color": "#ddd"
      }
    }
  ]
}
```

### Bulk Updating Tasks with Start Dates
**User Prompt:**
```
Update these tasks to have new start dates:
1. "Research" should start now
2. "Design" should start after "Research" is done (3 days from now)
3. "Implementation" should start next week
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
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

**Tool Response:**
```json
{
  "successful": 3,
  "failed": 0,
  "tasks": [
    {
      "id": "task_research",
      "name": "Research",
      "start_date": "2024-03-16T00:00:00.000Z",
      "date_updated": "2024-03-16T10:00:00.000Z"
    },
    {
      "id": "task_design",
      "name": "Design",
      "start_date": "2024-03-19T00:00:00.000Z",
      "date_updated": "2024-03-16T10:00:00.000Z"
    },
    {
      "id": "task_impl",
      "name": "Implementation",
      "start_date": "2024-03-23T00:00:00.000Z",
      "date_updated": "2024-03-16T10:00:00.000Z"
    }
  ]
}
```

### Bulk Moving Tasks
**User Prompt:**
```
Move all the completed tasks from "In Progress" list to "Done" list:
1. "Backend API implementation"
2. "Frontend form validation"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
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

**Tool Response:**
```json
{
  "successful": 2,
  "failed": 0,
  "message": "Tasks moved successfully",
  "moved_tasks": [
    {
      "id": "task_api",
      "name": "Backend API implementation",
      "from_list": "In Progress",
      "to_list": "Done"
    },
    {
      "id": "task_form",
      "name": "Frontend form validation",
      "from_list": "In Progress",
      "to_list": "Done"
    }
  ]
}
```

### Bulk Deleting Tasks
**User Prompt:**
```
Delete all these tasks from the "Archived" list:
1. "Outdated feature"
2. "Duplicate bug report"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
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

**Tool Response:**
```json
{
  "successful": 2,
  "failed": 0,
  "message": "Tasks deleted successfully",
  "deleted_tasks": [
    {
      "id": "task_outdated",
      "name": "Outdated feature"
    },
    {
      "id": "task_duplicate",
      "name": "Duplicate bug report"
    }
  ]
}
```

### Attaching a File to a Task
**User Prompt:**
```
Attach a file to the task "Implement Authentication". The file is at URL "https://example.com/files/specs.pdf"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "taskName": "Implement Authentication",
  "file_url": "https://example.com/files/specs.pdf",
  "file_name": "specs.pdf"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "File attached successfully",
  "attachment": {
    "id": "attach_specs_001",
    "title": "specs.pdf",
    "size": 524288,
    "date": "2024-03-16T10:30:00.000Z",
    "url": "https://app.clickup.com/attachments/attach_specs_001",
    "uploader": {
      "id": 1234567,
      "username": "developer1"
    }
  }
}
```

**User Prompt:**
```
Attach this document to the task with ID 86b4bnnny
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "taskId": "86b4bnnny",
  "file_data": "<base64-encoded-content>",
  "file_name": "document.txt"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "File attached successfully",
  "attachment": {
    "id": "attach_doc_001",
    "title": "document.txt",
    "size": 2048,
    "date": "2024-03-16T10:35:00.000Z",
    "url": "https://app.clickup.com/attachments/attach_doc_001",
    "uploader": {
      "id": 1234567,
      "username": "developer1"
    }
  }
}
```

### Retrieving Tasks with Subtasks
**User Prompt:**
```
Get the "Project Planning" task with all its subtasks
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "taskName": "Project Planning",
  "subtasks": true
}
```

**Tool Response:**
```json
{
  "id": "abc123",
  "name": "Project Planning",
  "description": "Plan the new project phase",
  "url": "https://app.clickup.com/t/abc123",
  "status": {
    "status": "In Progress",
    "color": "#f1c975"
  },
  "priority": 1,
  "list": {
    "id": "list789",
    "name": "Strategic Planning"
  },
  "subtasks": [
    {
      "id": "def456",
      "name": "Define Requirements",
      "status": {
        "status": "To Do",
        "color": "#ddd"
      },
      "parent": "abc123",
      "url": "https://app.clickup.com/t/def456"
    },
    {
      "id": "ghi789",
      "name": "Create Timeline",
      "status": {
        "status": "To Do",
        "color": "#ddd"
      },
      "parent": "abc123",
      "url": "https://app.clickup.com/t/ghi789"
    }
  ],
  "subtask_count": 2
}
```

### Creating a Subtask
**User Prompt:**
```
Create a subtask under "Project Planning" called "Schedule Team Meeting"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "name": "Schedule Team Meeting",
  "parent": "abc123",
  "listName": "Development Tasks"
}
```

**Tool Response:**
```json
{
  "id": "subtask_001",
  "name": "Schedule Team Meeting",
  "description": "",
  "url": "https://app.clickup.com/t/subtask_001",
  "status": {
    "status": "To Do",
    "color": "#ddd"
  },
  "date_created": "2024-03-16T10:45:00.000Z",
  "parent": "abc123",
  "list": {
    "id": "list123",
    "name": "Development Tasks"
  },
  "creator": {
    "id": 1234567,
    "username": "developer1"
  }
}
```

### Converting a Task to a Subtask
**User Prompt:**
```
Convert the "Schedule Team Meeting" task to be a subtask of "Project Planning"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "taskName": "Schedule Team Meeting",
  "parent": "abc123"
}
```

**Tool Response:**
```json
{
  "id": "subtask_001",
  "name": "Schedule Team Meeting",
  "status": {
    "status": "To Do",
    "color": "#ddd"
  },
  "parent": "abc123",
  "date_updated": "2024-03-16T11:00:00.000Z",
  "list": {
    "id": "list123",
    "name": "Development Tasks"
  }
}
```

**Notes:**
- The parent task must be in the same list as the task being converted
- Use the task ID or name as the `parent` value
- This is equivalent to the "Convert to subtask" operation in the ClickUp UI
- Converting a subtask back to a task by setting `parent` to `null` is not supported by the ClickUp API


### Task Relationships (Linking Tasks)

The server supports linking tasks together to express dependencies or relationships.

**Adding a Link:**
**User Prompt:**
```
Link task "Backend API implementation" to task "Frontend form validation"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "task": "Backend API implementation",
  "targetTask": "Frontend form validation"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Task link created successfully",
  "link": {
    "link_id": "link_new_001",
    "task_id": "task_api",
    "target_task_id": "task_form",
    "link_type": "relates_to",
    "date_created": "2024-03-16T12:30:00.000Z"
  }
}
```

### Getting Task Links
**User Prompt:**
```
What tasks are linked to "API Migration"?
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "task": "API Migration"
}
```

**Tool Response:**
```json
{
  "success": true,
  "count": 2,
  "links": [
    {
      "task_id": "86b4bmmm5",
      "link_id": "86b4bmmmx",
      "date_created": "1703980800000",
      "userid": "123456",
      "workspace_id": "789012"
    },
    {
      "task_id": "86b4bppp3",
      "link_id": "86b4bpppz",
      "date_created": "1703981000000",
      "userid": "123456",
      "workspace_id": "789012"
    }
  ]
}
```

### Deleting a Task Link
**User Prompt:**
```
Remove the link between "API Migration" and "Database Upgrade"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "task": "API Migration",
  "linkId": "Database Upgrade"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Task link deleted successfully"
}
```

**Note:** Use `task` for the source task and `linkId` for the target task (Name or ID).

---

### Task Dependencies

Task dependencies model **blocking relationships** between tasks — e.g., "Task B cannot start until Task A is done." This is distinct from task links, which are generic associations with no directional blocking semantics.

There are two directions for a dependency:
- **`depends_on`** — the `task` is blocked BY another task (the other task must finish first).
- **`dependency_of`** — the `task` is blocking another task (the other task cannot start until `task` finishes).

Provide exactly one of `depends_on` or `dependency_of` per call, not both.

#### add_task_dependency Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task` | string | Yes | Task name or ID to set the dependency on. |
| `listName` | string | No | List name for resolving `task` by name. |
| `depends_on` | string | No | Task name or ID that `task` depends on (task is blocked BY this). Provide this OR `dependency_of`, not both. |
| `depends_on_list` | string | No | List name for resolving `depends_on` task by name. |
| `dependency_of` | string | No | Task name or ID that depends on `task` (task is blocking THIS). Provide this OR `depends_on`, not both. |
| `dependency_of_list` | string | No | List name for resolving `dependency_of` task by name. |

#### delete_task_dependency Parameters

Same parameters as `add_task_dependency` — provide the `task` and the same `depends_on` or `dependency_of` value that matches the existing dependency to remove.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task` | string | Yes | Task name or ID to remove the dependency from. |
| `listName` | string | No | List name for resolving `task` by name. |
| `depends_on` | string | No | Task name or ID of the blocking task to remove (task was blocked BY this). |
| `depends_on_list` | string | No | List name for resolving `depends_on` task by name. |
| `dependency_of` | string | No | Task name or ID that was blocked by `task` to remove. |
| `dependency_of_list` | string | No | List name for resolving `dependency_of` task by name. |

### Adding a Task Dependency
**User Prompt:**
```
Make "Deploy to Production" depend on "Run Integration Tests" — it can't start until tests pass.
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "task": "Deploy to Production",
  "depends_on": "Run Integration Tests"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Task dependency added successfully",
  "dependency": {
    "task_id": "task_deploy",
    "depends_on": "task_tests",
    "type": "depends_on"
  }
}
```

### Adding a Dependency (blocking direction)
**User Prompt:**
```
Mark "Run Integration Tests" as blocking "Deploy to Production"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "task": "Run Integration Tests",
  "dependency_of": "Deploy to Production"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Task dependency added successfully",
  "dependency": {
    "task_id": "task_tests",
    "dependency_of": "task_deploy",
    "type": "dependency_of"
  }
}
```

### Removing a Task Dependency
**User Prompt:**
```
Remove the dependency between "Deploy to Production" and "Run Integration Tests"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "task": "Deploy to Production",
  "depends_on": "Run Integration Tests"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Task dependency removed successfully"
}
```

---

### Deleting a Task
**User Prompt:**
```
Delete the task called "Old Draft"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "task": "Old Draft"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Task 'Old Draft' (86b4bnnn1) deleted successfully"
}
```

### Duplicating a Task
**User Prompt:**
```
Duplicate "Project Template" into the "Q2 Planning" list
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "task": "Project Template",
  "listName": "Q2 Planning"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Task duplicated successfully",
  "task": {
    "id": "8k2m4n6p8",
    "name": "Project Template (copy)",
    "url": "https://app.clickup.com/t/8k2m4n6p8",
    "status": {
      "status": "To Do",
      "color": "#ddd"
    },
    "list": {
      "id": "list_q2",
      "name": "Q2 Planning"
    }
  }
}
```

### Natural Language Date Support

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
