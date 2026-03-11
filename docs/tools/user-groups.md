[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# User Groups

4 atomic tools to manage ClickUp user groups — named collections of workspace members used for bulk assignment, access scoping, and team organization.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|---------------------|---------------------|
| `list_user_groups` | List all user groups in the workspace | — | `detail_level`, `team_id` |
| `create_user_group` | Create a new user group with initial members | `group_name`, `member_ids` | `team_id` |
| `update_user_group` | Rename a group or add/remove members | `group_id` | `group_name`, `members_to_add`, `members_to_remove`, `team_id` |
| `delete_user_group` | Delete a user group | `group_id` | `team_id` |

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `detail_level` | string | `"names"` returns `{id, name}` only. `"detailed"` (default) returns full group metadata including members. For `list_user_groups`. |
| `group_id` | string | Group ID. Required for `update_user_group` and `delete_user_group`. |
| `group_name` | string | Group name. Required for `create_user_group`; optional for `update_user_group` (to rename). |
| `member_ids` | integer[] | User IDs to set as initial members. Required for `create_user_group`. |
| `members_to_add` | integer[] | User IDs to add to an existing group. For `update_user_group`. |
| `members_to_remove` | integer[] | User IDs to remove from a group. For `update_user_group`. |
| `team_id` | string | Optional workspace/team ID override. |

## Examples

### List all user groups (tool: `list_user_groups`)

**User Prompt:** Show me all the user groups in this workspace.

**Generated Request:**
```json
{}
```

**Tool Response:**
```json
{
  "groups": [
    {
      "id": "abc123",
      "name": "Engineering",
      "team_id": "9013667057",
      "members": [...]
    }
  ]
}
```

---

### Create a user group (tool: `create_user_group`)

**User Prompt:** Create a user group called "Design Team" with members 12345 and 67890.

**Generated Request:**
```json
{
  "group_name": "Design Team",
  "member_ids": [12345, 67890]
}
```

**Tool Response:**
```json
{
  "group": { "id": "xyz789", "name": "Design Team", "..." : "..." },
  "message": "User group \"Design Team\" created successfully (ID: xyz789)."
}
```

---

### Update a user group (tool: `update_user_group`)

**User Prompt:** Add user 99999 to the Engineering group (ID: abc123) and rename it to "Core Engineering".

**Generated Request:**
```json
{
  "group_id": "abc123",
  "group_name": "Core Engineering",
  "members_to_add": [99999]
}
```

**Tool Response:**
```json
{
  "group": { "id": "abc123", "name": "Core Engineering", "...": "..." },
  "message": "User group \"Core Engineering\" updated successfully."
}
```

---

### Delete a user group (tool: `delete_user_group`)

**User Prompt:** Delete the user group with ID abc123.

**Generated Request:**
```json
{
  "group_id": "abc123"
}
```

**Tool Response:**
```json
{
  "message": "User group abc123 deleted successfully."
}
```
