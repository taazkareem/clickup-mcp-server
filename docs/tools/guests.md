[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# manage_guests

Manage workspace guests (Enterprise plan) — invite external users, configure permissions, and grant/revoke access to tasks, lists, and folders.

## Actions

| Action | Required Parameters | Optional Parameters | Description |
|--------|---------------------|---------------------|-------------|
| `invite` | `email` | `can_edit_tags`, `can_see_time_spent`, `can_see_time_estimated`, `can_create_views`, `team_id` | Invite a guest to the workspace |
| `get` | `guest_id` | `team_id` | Get guest details |
| `edit` | `guest_id` | `username`, `can_edit_tags`, `can_see_time_spent`, `can_see_time_estimated`, `can_create_views`, `team_id` | Edit guest display name or permissions |
| `remove` | `guest_id` | `team_id` | Remove a guest from the workspace |
| `add_to_task` | `guest_id`, `task_id` | `permission_level`, `team_id` | Grant guest access to a task |
| `remove_from_task` | `guest_id`, `task_id` | `team_id` | Revoke guest access from a task |
| `add_to_list` | `guest_id`, `list_id` | `permission_level`, `team_id` | Grant guest access to a list |
| `remove_from_list` | `guest_id`, `list_id` | `team_id` | Revoke guest access from a list |
| `add_to_folder` | `guest_id`, `folder_id` | `permission_level`, `team_id` | Grant guest access to a folder |
| `remove_from_folder` | `guest_id`, `folder_id` | `team_id` | Revoke guest access from a folder |

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `action` | string | Action to perform (see table above) |
| `guest_id` | string | Guest ID. Required for all actions except `invite`. |
| `email` | string | Guest email address. Required for `invite`. |
| `username` | string | Display name. For `edit` action. |
| `can_edit_tags` | boolean | Permission: can edit tags. For `invite`/`edit`. |
| `can_see_time_spent` | boolean | Permission: can see time spent. For `invite`/`edit`. |
| `can_see_time_estimated` | boolean | Permission: can see time estimated. For `invite`/`edit`. |
| `can_create_views` | boolean | Permission: can create views. For `invite`/`edit`. |
| `task_id` | string | Task ID. Required for `add_to_task`/`remove_from_task`. |
| `list_id` | string | List ID. Required for `add_to_list`/`remove_from_list`. |
| `folder_id` | string | Folder ID. Required for `add_to_folder`/`remove_from_folder`. |
| `permission_level` | string | Access level: `read`, `comment`, `edit`, or `create`. For `add_to_*` actions. |
| `team_id` | string | Optional workspace/team ID override. |

## Examples

### Invite a guest

**User Prompt:** Invite contractor@example.com as a guest to the workspace.

**Generated Request:**
```json
{
  "action": "invite",
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

### Get guest details

**User Prompt:** Show me the details for guest 12345.

**Generated Request:**
```json
{
  "action": "get",
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

### Edit guest permissions

**User Prompt:** Update guest 12345 to allow tag editing and rename to "External Dev".

**Generated Request:**
```json
{
  "action": "edit",
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

### Add guest to a task

**User Prompt:** Give guest 12345 edit access to task abc123.

**Generated Request:**
```json
{
  "action": "add_to_task",
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

### Remove guest from workspace

**User Prompt:** Remove guest 12345 from the workspace.

**Generated Request:**
```json
{
  "action": "remove",
  "guest_id": "12345"
}
```

**Tool Response:**
```json
{
  "message": "Guest 12345 removed from workspace."
}
```
