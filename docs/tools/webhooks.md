# Webhooks

4 atomic tools to manage ClickUp webhooks for real-time notifications about changes in your workspace.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|---------------------|---------------------|
| `list_webhooks` | List all webhooks in the workspace | — | `team_id` |
| `create_webhook` | Create a new webhook | `endpoint`, `events` | `space_id`, `folder_id`, `list_id`, `task_id`, `team_id` |
| `update_webhook` | Update an existing webhook | `webhook_id` | `endpoint`, `events`, `status` |
| `delete_webhook` | Delete a webhook permanently | `webhook_id` | — |

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

### Create a Webhook (tool: `create_webhook`)
```json
{
  "endpoint": "https://example.com/clickup/webhook",
  "events": ["taskCreated", "taskUpdated"],
  "list_id": "90130000000"
}
```

### Update a Webhook Status (tool: `update_webhook`)
```json
{
  "webhook_id": "b7ed7af0-be32-4dcd-b090-4f2c0af74c54",
  "status": "suspended"
}
```
