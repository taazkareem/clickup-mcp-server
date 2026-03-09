[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# Guest Management

10 atomic tools to manage workspace guests (Enterprise plan) — invite external users, configure permissions, and grant/revoke access to tasks, lists, and folders.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|---------------------|---------------------|
| `invite_guest` | Invite a guest to the workspace | `email` | `can_edit_tags`, `can_see_time_spent`, `can_see_time_estimated`, `can_create_views`, `team_id` |
| `get_guest` | Get guest details | `guest_id` | `team_id` |
| `edit_guest` | Edit guest display name or permissions | `guest_id` | `username`, `can_edit_tags`, `can_see_time_spent`, `can_see_time_estimated`, `can_create_views`, `team_id` |
| `remove_guest` | Remove a guest from the workspace | `guest_id` | `team_id` |
| `add_guest_to_task` | Grant guest access to a task | `guest_id`, `task_id` | `permission_level`, `team_id` |
| `remove_guest_from_task` | Revoke guest access from a task | `guest_id`, `task_id` | `team_id` |
| `add_guest_to_list` | Grant guest access to a list | `guest_id`, `list_id` | `permission_level`, `team_id` |
| `remove_guest_from_list` | Revoke guest access from a list | `guest_id`, `list_id` | `team_id` |
| `add_guest_to_folder` | Grant guest access to a folder | `guest_id`, `folder_id` | `permission_level`, `team_id` |
| `remove_guest_from_folder` | Revoke guest access from a folder | `guest_id`, `folder_id` | `team_id` |

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `guest_id` | string | Guest ID. Required for all tools except `invite_guest`. |
| `email` | string | Guest email address. Required for `invite_guest`. |
| `username` | string | Display name. For `edit_guest`. |
| `can_edit_tags` | boolean | Permission: can edit tags. For `invite_guest`/`edit_guest`. |
| `can_see_time_spent` | boolean | Permission: can see time spent. For `invite_guest`/`edit_guest`. |
| `can_see_time_estimated` | boolean | Permission: can see time estimated. For `invite_guest`/`edit_guest`. |
| `can_create_views` | boolean | Permission: can create views. For `invite_guest`/`edit_guest`. |
| `task_id` | string | Task ID. Required for `add_guest_to_task`/`remove_guest_from_task`. |
| `list_id` | string | List ID. Required for `add_guest_to_list`/`remove_guest_from_list`. |
| `folder_id` | string | Folder ID. Required for `add_guest_to_folder`/`remove_guest_from_folder`. |
| `permission_level` | string | Access level: `read`, `comment`, `edit`, or `create`. For `add_guest_to_*` tools. |
| `team_id` | string | Optional workspace/team ID override. |

## Examples

### Invite a guest (tool: `invite_guest`)

**User Prompt:** Invite contractor@example.com as a guest to the workspace.

**Generated Request:**
```json
{
  "email": "contractor@example.com"
}
```

**Tool Response:**
```json
{
  "guest": { "id": 12345, "email": "contractor@example.com", "username": "Contractor" },
  "message": "Guest \"contractor@example.com\" invited successfully."
}
```

---

### Get guest details (tool: `get_guest`)

**User Prompt:** Show me the details for guest 12345.

**Generated Request:**
```json
{
  "guest_id": "12345"
}
```

**Tool Response:**
```json
{
  "guest": { "id": 12345, "email": "contractor@example.com", "username": "Contractor", "can_edit_tags": false, "can_see_time_spent": true }
}
```

---

### Edit guest permissions (tool: `edit_guest`)

**User Prompt:** Update guest 12345 to allow tag editing and rename to "External Dev".

**Generated Request:**
```json
{
  "guest_id": "12345",
  "username": "External Dev",
  "can_edit_tags": true
}
```

**Tool Response:**
```json
{
  "guest": { "id": 12345, "username": "External Dev", "can_edit_tags": true },
  "message": "Guest 12345 updated successfully."
}
```

---

### Add guest to a task (tool: `add_guest_to_task`)

**User Prompt:** Give guest 12345 edit access to task abc123.

**Generated Request:**
```json
{
  "guest_id": "12345",
  "task_id": "abc123",
  "permission_level": "edit"
}
```

**Tool Response:**
```json
{
  "message": "Guest 12345 added to task abc123."
}
```

---

### Remove guest from workspace (tool: `remove_guest`)

**User Prompt:** Remove guest 12345 from the workspace.

**Generated Request:**
```json
{
  "guest_id": "12345"
}
```

**Tool Response:**
```json
{
  "message": "Guest 12345 removed from workspace."
}
```
