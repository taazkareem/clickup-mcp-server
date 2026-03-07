---
id: time-entries
title: Manage Time Entries
description: Unified tool for managing time tracking and tags
---

# Manage Time Entries Tool

The `manage_time_entries` tool acts as a unified hub for all time tracking operations in ClickUp, consolidating 7 fragmented endpoint tools into one action-driven interface.

It handles fetching tracked time, managing your currently running timer, creating/updating/deleting time entries, and managing workspace-level time entry tags.

## Usage Overview

Every request requires the `action` parameter. Depending on the action chosen, different parameters become required or optional.

| Action | Description | Required Parameters | Optional Parameters |
|--------|-------------|---------------------|---------------------|
| `get_entries` | Fetch historical time entries | (None) | `taskName`, `startDate`, `endDate`, `assigneeNames`, etc. |
| `get_current` | Fetch currently running timer | (None) | (None) |
| `start_timer` | Start tracking time for a task | `task` (Task ID/Name) | `listName`, `description`, `billable`, `tags` |
| `stop_timer` | Stop the active timer | (None) | `description`, `tags` |
| `add_entry` | Manually log a time entry | `task`, `start_time`, `duration` | `listName`, `description`, `billable`, `tags` |
| `update_entry` | Modify an existing time entry | `timer_id`, `task` | `start_time`, `end_time`, `duration`, `description`, `tags` |
| `delete_entry` | Delete an existing entry | `timer_id` | (None) |
| `get_history` | View history of edits to an entry | `timer_id` | (None) |
| `get_tags` | Fetch all workspace time entry tags| (None) | (None) |
| `add_tags` | Add a tag to an entry | `timer_id`, `name` | (None) |
| `update_tags` | Rename a workspace tag globally | `name`, `new_name` | (None) |
| `delete_tags` | Remove a tag from an entry | `timer_id`, `name` | (None) |

## Quality of Life Features

This tool inherits the powerful "Name Resolution" and "Natural Language" systems of the ClickUp MCP server:
- **`task` resolution**: Instead of raw Task IDs, you can pass `"task": "Design Homepage", "listName": "Sprint 1"`.
- **`startDate` / `start_time` natural dates**: You can pass Unix timestamps OR plain English like `"yesterday"`, `"3 hours ago"`, or `"last week"`.
- **`duration` human formats**: Instead of calculating milliseconds, simply pass `"1h 30m"` or `"45m"`.
- **Location Filtering (`get_entries`)**: You can filter by `spaceName: "Engineering"`, `folderName: "Q1"`, or `assigneeNames: ["John Doe", "Jane"]`.

## Examples

### 1. View My Logged Time This Week

```json
{
  "action": "get_entries",
  "startDate": "start of week",
  "endDate": "now"
}
```

### 2. Start a Timer

```json
{
  "action": "start_timer",
  "task": "Update README",
  "description": "Porting API specs"
}
```

### 3. Log a Manual Time Entry

```json
{
  "action": "add_entry",
  "task": "Daily Standup",
  "start_time": "9:00 AM today",
  "duration": "30m",
  "billable": true,
  "tags": ["Meeting", "Internal"]
}
```

### 4. Tag existing time entries

```json
{
  "action": "add_tags",
  "timer_id": "893902384930238",
  "name": "UrgentFix"
}
```
