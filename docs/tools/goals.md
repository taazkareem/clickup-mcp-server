[← Back to Documentation](../DOCUMENTATION.md)

# 🎯 Goals

The `manage_goals` tool provides consolidated CRUD for ClickUp goals and key results — 8 actions in one tool.

## Tool Reference

| Tool | Actions | Description |
|------|---------|-------------|
| `manage_goals` | `list`, `get`, `create`, `update`, `delete`, `create_key_result`, `update_key_result`, `delete_key_result` | Manage goals and key results in your ClickUp workspace |

## Parameters

| Parameter | Type | Required | Actions | Description |
|-----------|------|----------|---------|-------------|
| `action` | enum | ✅ Always | all | One of the 8 action values |
| `goalId` | string (UUID) | ✅ | `get`, `update`, `delete`, `create_key_result` | Goal UUID |
| `keyResultId` | string (UUID) | ✅ | `update_key_result`, `delete_key_result` | Key result UUID |
| `name` | string | ✅ for create | `create`, `update`, `create_key_result`, `update_key_result` | Goal or key result name |
| `description` | string | | `create`, `update` | Goal description |
| `dueDate` | string | | `create`, `update` | Unix ms timestamp or ISO date (e.g. `"2026-12-31"`) |
| `color` | string | | `create`, `update` | Hex color code (e.g. `"#6BC950"`) |
| `multipleOwners` | boolean | | `create` | Allow multiple owners |
| `owners` | integer[] | | `create` | User IDs to set as owners |
| `addOwners` | integer[] | | `update` | User IDs to add as owners |
| `remOwners` | integer[] | | `update` | User IDs to remove as owners |
| `includeCompleted` | boolean | | `list` | Include completed goals |
| `type` | enum | | `create_key_result`, `update_key_result` | `number`, `percentage`, `automatic`, `boolean`, `currency` |
| `stepsStart` | number | | `create_key_result`, `update_key_result` | Starting value |
| `stepsEnd` | number | | `create_key_result`, `update_key_result` | Target value |
| `unit` | string | | `create_key_result`, `update_key_result` | Unit label (e.g. `"tasks"`, `"$"`) |
| `taskIds` | string[] | | `create_key_result`, `update_key_result` | Task IDs linked to key result |
| `listIds` | string[] | | `create_key_result`, `update_key_result` | List IDs linked to key result |

> **Note:** Goal IDs and key result IDs are UUIDs, not numeric IDs.

## Examples

### List all goals

```json
{
  "action": "list"
}
```

```json
{
  "action": "list",
  "includeCompleted": true
}
```

### Get a goal with key results

```json
{
  "action": "get",
  "goalId": "e53a033c-900e-462d-a849-4a216b06d571"
}
```

### Create a goal

```json
{
  "action": "create",
  "name": "Increase Revenue Q2",
  "description": "Grow MRR by 20% in Q2 2026",
  "dueDate": "2026-06-30",
  "color": "#6BC950",
  "multipleOwners": true,
  "owners": [1234567]
}
```

### Update a goal

```json
{
  "action": "update",
  "goalId": "e53a033c-900e-462d-a849-4a216b06d571",
  "name": "Increase Revenue Q2 (Revised)",
  "addOwners": [7654321]
}
```

### Delete a goal

```json
{
  "action": "delete",
  "goalId": "e53a033c-900e-462d-a849-4a216b06d571"
}
```

### Create a key result

```json
{
  "action": "create_key_result",
  "goalId": "e53a033c-900e-462d-a849-4a216b06d571",
  "name": "Close 50 new deals",
  "type": "number",
  "stepsStart": 0,
  "stepsEnd": 50,
  "unit": "deals"
}
```

### Update a key result

```json
{
  "action": "update_key_result",
  "keyResultId": "b8d1c8f0-1234-4abc-9def-000000000001",
  "stepsEnd": 60
}
```

### Delete a key result

```json
{
  "action": "delete_key_result",
  "keyResultId": "b8d1c8f0-1234-4abc-9def-000000000001"
}
```