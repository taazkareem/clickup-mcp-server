# Audit Logs Tool

## Tool Name
`get_audit_logs`

## Description
Get workspace audit logs. Retrieves security, user, and hierarchy activity.
**Note:** This feature is only available on the **Enterprise Plan** and requires **Workspace Owner** permissions.

## Actions

| Action | Endpoint | Required Params |
|--------|----------|-----------------|
| `get_audit_logs` | `POST /v3/workspaces/{workspace_id}/auditlogs` | `applicability` |

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `applicability` | string | **Yes** | Type of logs to filter by. Options: `auth-and-security`, `custom-fields`, `hierarchy-activity`, `user-activity`, `agent-settings-activity`, `other-activity`. |
| `start_date` | string | No | ISO 8601 timestamp for the beginning of the range. |
| `end_date` | string | No | ISO 8601 timestamp for the end of the range. |
| `limit` | number | No | Maximum number of logs to return (max 100). |
| `cursor` | string | No | Cursor for pagination. |
| `team_id` | string | No | The ClickUp Team ID or Workspace Name to use. |

## Examples

### Getting Auth and Security Logs
```json
{
  "applicability": "auth-and-security",
  "limit": 50
}
```

### Getting User Activity in a Specific Date Range
```json
{
  "applicability": "user-activity",
  "start_date": "2023-01-01T00:00:00Z",
  "end_date": "2023-01-31T23:59:59Z"
}
```
