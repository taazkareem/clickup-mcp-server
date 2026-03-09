---
id: time-entries
title: Time Entries
description: Atomic tools for managing time tracking
---

# Time Tracking Tools

13 atomic tools covering all time tracking operations in ClickUp — fetching tracked time, managing your running timer, creating/updating/deleting time entries, and managing workspace-level time entry tags.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|---------------------|---------------------|
| `get_time_entries` | Fetch historical time entries | — | `taskName`, `startDate`, `endDate`, `assigneeNames`, `spaceName`, `folderName`, etc. |
| `get_current_time_entry` | Get currently running timer | — | — |
| `start_time_entry` | Start tracking time for a task | `task` (Task ID/Name) | `listName`, `description`, `billable`, `tags` |
| `stop_time_entry` | Stop the active timer | — | `description`, `tags` |
| `add_time_entry` | Manually log a time entry | `task`, `start_time`, `duration` | `listName`, `description`, `billable`, `tags` |
| `update_time_entry` | Modify an existing time entry | `timer_id`, `task` | `start_time`, `end_time`, `duration`, `description`, `tags` |
| `delete_time_entry` | Delete an existing entry | `timer_id` | — |
| `get_time_entry_history` | View edit history of an entry | `timer_id` | — |
| `get_time_entry_tags` | Fetch all workspace time entry tags | — | — |
| `add_time_entry_tags` | Add a tag to an entry | `timer_id`, `name` | — |
| `update_time_entry_tags` | Rename a workspace tag globally | `name`, `new_name` | — |
| `delete_time_entry_tags` | Remove a tag from an entry | `timer_id`, `name` | — |
| `get_time_in_status` | Get time-in-status for multiple tasks | `task_ids` | `custom_task_ids` |

## Quality of Life Features

- **`task` resolution**: Instead of raw Task IDs, pass `"task": "Design Homepage", "listName": "Sprint 1"`.
- **`startDate` / `start_time` natural dates**: Pass Unix timestamps OR plain English like `"yesterday"`, `"3 hours ago"`, or `"last week"`.
- **`duration` human formats**: Instead of calculating milliseconds, pass `"1h 30m"` or `"45m"`.
- **Location Filtering (`get_time_entries`)**: Filter by `spaceName: "Engineering"`, `folderName: "Q1"`, or `assigneeNames: ["John Doe", "Jane"]`.

## Examples

### 1. View My Logged Time This Week (tool: `get_time_entries`)

```json
{
  "startDate": "start of week",
  "endDate": "now"
}
```

### 2. Start a Timer (tool: `start_time_entry`)

```json
{
  "task": "Update README",
  "description": "Porting API specs"
}
```

### 3. Log a Manual Time Entry (tool: `add_time_entry`)

```json
{
  "task": "Daily Standup",
  "start_time": "9:00 AM today",
  "duration": "30m",
  "billable": true,
  "tags": ["Meeting", "Internal"]
}
```

### 4. Tag an existing time entry (tool: `add_time_entry_tags`)

```json
{
  "timer_id": "893902384930238",
  "name": "UrgentFix"
}
```

### 5. Get time-in-status across tasks (tool: `get_time_in_status`)

```json
{
  "task_ids": ["abc123", "def456", "ghi789"]
}
```
