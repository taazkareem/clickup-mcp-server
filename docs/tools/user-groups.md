[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# manage_user_groups

Manage ClickUp user groups — named collections of workspace members used for bulk assignment, access scoping, and team organization.

## Actions

| Action | Required Parameters | Optional Parameters | Description |
|--------|---------------------|---------------------|-------------|
| `list` | _(none)_ | `team_id` | List all user groups in the workspace |
| `create` | `group_name`, `member_ids` | `team_id` | Create a new user group with initial members |
| `update` | `group_id` | `group_name`, `members_to_add`, `members_to_remove`, `team_id` | Rename a group or add/remove members |
| `delete` | `group_id` | `team_id` | Delete a user group |

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `action` | string | Action to perform: `list`, `create`, `update`, or `delete` |
| `group_id` | string | Group ID. Required for `update` and `delete`. |
| `group_name` | string | Group name. Required for `create`; optional for `update` (to rename). |
| `member_ids` | integer[] | User IDs to set as initial members. Required for `create`. |
| `members_to_add` | integer[] | User IDs to add to an existing group. For `update`. |
| `members_to_remove` | integer[] | User IDs to remove from a group. For `update`. |
| `team_id` | string | Optional workspace/team ID override. |

## Examples

### List all user groups

**User Prompt:** Show me all the user groups in this workspace.

**Generated Request:**
```json
{
  "action": "list"
}
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

### Create a user group

**User Prompt:** Create a user group called "Design Team" with members 12345 and 67890.

**Generated Request:**
```json
{
  "action": "create",
  "group_name": "Design Team",
  "member_ids": [12345, 67890]
}
```

**Tool Response:**
```json
{
  "group": { "id": "xyz789", "name": "Design Team", ... },
  "message": "User group \"Design Team\" created successfully (ID: xyz789)."
}
```

---

### Update a user group

**User Prompt:** Add user 99999 to the Engineering group (ID: abc123) and rename it to "Core Engineering".

**Generated Request:**
```json
{
  "action": "update",
  "group_id": "abc123",
  "group_name": "Core Engineering",
  "members_to_add": [99999]
}
```

**Tool Response:**
```json
{
  "group": { "id": "abc123", "name": "Core Engineering", ... },
  "message": "User group \"Core Engineering\" updated successfully."
}
```

---

### Delete a user group

**User Prompt:** Delete the user group with ID abc123.

**Generated Request:**
```json
{
  "action": "delete",
  "group_id": "abc123"
}
```

**Tool Response:**
```json
{
  "message": "User group abc123 deleted successfully."
}
```
