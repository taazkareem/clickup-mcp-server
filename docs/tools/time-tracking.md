[← Back to Documentation Index](../DOCUMENTATION.md)  
[← Back to README](../../README.md)  

# Time Tracking

Track time spent on tasks with timers, manual entries, and workspace-wide reporting. Supports natural language dates for filtering and billable time tracking.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| get_task_time_entries | Get time entries for a specific task | `task` (Name or ID) | `listName`, `startDate`, `endDate`, `assignee` |
| get_workspace_time_entries | Get time entries across the workspace with filtering | None (at least one filter recommended) | `startDate`, `endDate`, `taskId`, `taskName`, `listId`, `listName`, `folderId`, `spaceId`, `spaceName`, `assignees`, `assigneeNames` |
| start_time_tracking | Start a timer on a task | `task` (Name or ID) | `listName`, `description`, `billable`, `tags` |
| stop_time_tracking | Stop the current running timer | None | `description`, `tags` |
| add_time_entry | Add a manual time entry | `task` (Name or ID), `start`, `duration` | `listName`, `description`, `end`, `billable`, `tags` |
| delete_time_entry | Delete a time entry | `timeEntryId` | None |
| get_current_time_entry | Get the currently running timer | None | None |

## Parameters

- **duration**: Time in milliseconds
- **startDate/endDate**: Support Unix timestamps and natural language expressions (e.g., "last week", "start of month")
- **billable**: Boolean flag for billable time
- **tags**: Array of tag objects for categorizing time entries
- **Note**: Manual time entries (`add_time_entry`) are most reliable with simple relative dates (e.g., "today", "yesterday") or Unix timestamps. Specific time-of-day strings may vary in interpretation across tools.

## Examples

### Getting Workspace Time Report
**User Prompt:**
```
Show me all time entries from last week for the "Development" space
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "startDate": "start of last week",
  "endDate": "end of last week",
  "spaceName": "Development"
}
```

### Starting a Timer
**User Prompt:**
```
Start tracking time on "Fix Login Bug"
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "task": "Fix Login Bug",
  "description": "Debugging authentication issue"
}
```

### Adding a Manual Time Entry
**User Prompt:**
```
Log 2 hours on "Fix Login Bug" for yesterday
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "task": "Fix Login Bug",
  "start": "yesterday",
  "duration": 7200000
}
```

**Tool Response:**
```json
{
  "success": true,
  "data": {
    "id": "te_001",
    "task": {
      "id": "86b4bnnny",
      "name": "Fix Login Bug"
    },
    "start": "2024-03-15T00:00:00.000Z",
    "end": "2024-03-15T02:00:00.000Z",
    "duration": 7200000,
    "billable": false,
    "user": {
      "id": 1234567,
      "username": "developer1"
    }
  }
}
```

### Deleting a Time Entry
**User Prompt:**
```
Delete time entry abc123
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "timeEntryId": "abc123"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Time entry deleted successfully"
}
```

### Getting Task Time Entries
**User Prompt:**
```
Show time entries for the "Design Review" task
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "task": "Design Review"
}
```

**Tool Response:**
```json
{
  "data": [
    {
      "id": "te_100",
      "task": {
        "id": "86b4bppp3",
        "name": "Design Review"
      },
      "start": "2024-03-14T09:00:00.000Z",
      "end": "2024-03-14T11:30:00.000Z",
      "duration": 9000000,
      "billable": true,
      "user": {
        "id": 1234567,
        "username": "developer1"
      },
      "description": "Reviewing wireframes"
    },
    {
      "id": "te_101",
      "task": {
        "id": "86b4bppp3",
        "name": "Design Review"
      },
      "start": "2024-03-15T14:00:00.000Z",
      "end": "2024-03-15T15:00:00.000Z",
      "duration": 3600000,
      "billable": true,
      "user": {
        "id": 7654321,
        "username": "designer1"
      },
      "description": "Final review pass"
    }
  ],
  "count": 2
}
```

### Checking Current Timer
**User Prompt:**
```
Is there a timer running right now?
```

**Generated Request:**
```json
{
  "team_id": "9876543210"
}
```

**Tool Response:**
```json
{
  "data": {
    "id": "te_running_001",
    "task": {
      "id": "86b4bnnny",
      "name": "Fix Login Bug"
    },
    "start": "2024-03-16T09:00:00.000Z",
    "duration": 3600000,
    "billable": false,
    "user": {
      "id": 1234567,
      "username": "developer1"
    },
    "description": "Debugging authentication issue"
  }
}
```
### Stopping the Current Timer
**User Prompt:**
```
Stop my current timer
```

**Generated Request:**
```json
{
  "team_id": "9876543210"
}
```

**Tool Response:**
```json
{
  "success": true,
  "data": {
    "id": "te_running_001",
    "task": {
      "id": "86b4bnnny",
      "name": "Fix Login Bug"
    },
    "start": "2024-03-16T09:00:00.000Z",
    "end": "2024-03-16T10:30:00.000Z",
    "duration": 5400000,
    "billable": false,
    "user": {
      "id": 1234567,
      "username": "developer1"
    }
  }
}
```
