# manage_webhooks

Manage ClickUp webhooks to receive real-time notifications about changes in your workspace.

## Actions

The `manage_webhooks` tool supports the following actions:

| Action | Required Parameters | Optional Parameters | Description |
|--------|---------------------|---------------------|-------------|
| `list` | None | `team_id` | Lists all webhooks in the workspace. |
| `create` | `endpoint`, `events` | `space_id`, `folder_id`, `list_id`, `task_id`, `team_id` | Creates a new webhook with optional scope filters. |
| `update` | `webhook_id` | `endpoint`, `events`, `status` | Updates an existing webhook. |
| `delete` | `webhook_id` | None | Deletes a webhook permanently. |

## Available Event Types

You can specify the following events in the `events` array, or use `["*"]` for all events:

**Task Events:**
- `taskCreated`
- `taskUpdated`
- `taskDeleted`
- `taskPriorityUpdated`
- `taskStatusUpdated`
- `taskAssigneeUpdated`
- `taskDueDateUpdated`
- `taskTagUpdated`
- `taskMoved`
- `taskCommentPosted`
- `taskCommentUpdated`
- `taskTimeEstimateUpdated`
- `taskTimeTrackedUpdated`

**List Events:**
- `listCreated`
- `listUpdated`
- `listDeleted`

**Folder Events:**
- `folderCreated`
- `folderUpdated`
- `folderDeleted`

**Space Events:**
- `spaceCreated`
- `spaceUpdated`
- `spaceDeleted`

**Goal Events:**
- `goalCreated`
- `goalUpdated`
- `goalDeleted`
- `keyResultCreated`
- `keyResultUpdated`
- `keyResultDeleted`

## Scope Filtering

When creating a webhook, you can optionally filter events to a specific level of the ClickUp hierarchy. The most specific filter provided will take precedence:
- `task_id` (Most specific)
- `list_id`
- `folder_id`
- `space_id` (Least specific)

## Example Payloads

### Create a Webhook
```json
{
  "action": "create",
  "endpoint": "https://example.com/clickup/webhook",
  "events": ["taskCreated", "taskUpdated"],
  "list_id": "90130000000"
}
```

### Update a Webhook Status
```json
{
  "action": "update",
  "webhook_id": "b7ed7af0-be32-4dcd-b090-4f2c0af74c54",
  "status": "suspended"
}
```
