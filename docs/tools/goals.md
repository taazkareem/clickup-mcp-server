[← Back to Documentation](../DOCUMENTATION.md)

# 🎯 Goals

8 atomic tools for managing ClickUp goals and key results.

## Tool Reference

| Tool | Description | Required Parameters |
|------|-------------|---------------------|
| `list_goals` | List all goals in the workspace | — |
| `get_goal` | Get a goal with its key results | `goalId` |
| `create_goal` | Create a new goal | `name` |
| `update_goal` | Update a goal's properties | `goalId` |
| `delete_goal` | Delete a goal | `goalId` |
| `create_key_result` | Add a key result to a goal | `goalId`, `name` |
| `update_key_result` | Update a key result | `keyResultId` |
| `delete_key_result` | Delete a key result | `keyResultId` |

## Parameters

| Parameter | Type | Tools | Description |
|-----------|------|-------|-------------|
| `goalId` | string (UUID) | `get_goal`, `update_goal`, `delete_goal`, `create_key_result` | Goal UUID |
| `keyResultId` | string (UUID) | `update_key_result`, `delete_key_result` | Key result UUID |
| `name` | string | `create_goal`, `create_key_result`, `update_goal`, `update_key_result` | Goal or key result name |
| `description` | string | `create_goal`, `update_goal` | Goal description |
| `dueDate` | string | `create_goal`, `update_goal` | Unix ms timestamp or ISO date (e.g. `"2026-12-31"`) |
| `color` | string | `create_goal`, `update_goal` | Hex color code (e.g. `"#6BC950"`) |
| `multipleOwners` | boolean | `create_goal` | Allow multiple owners |
| `owners` | integer[] | `create_goal` | User IDs to set as owners |
| `addOwners` | integer[] | `update_goal` | User IDs to add as owners |
| `remOwners` | integer[] | `update_goal` | User IDs to remove as owners |
| `includeCompleted` | boolean | `list_goals` | Include completed goals |
| `type` | enum | `create_key_result`, `update_key_result` | `number`, `percentage`, `automatic`, `boolean`, `currency` |
| `stepsStart` | number | `create_key_result`, `update_key_result` | Starting value |
| `stepsEnd` | number | `create_key_result`, `update_key_result` | Target value |
| `unit` | string | `create_key_result`, `update_key_result` | Unit label (e.g. `"tasks"`, `"$"`) |
| `taskIds` | string[] | `create_key_result`, `update_key_result` | Task IDs linked to key result |
| `listIds` | string[] | `create_key_result`, `update_key_result` | List IDs linked to key result |

> **Note:** Goal IDs and key result IDs are UUIDs, not numeric IDs.

## Examples

### List all goals

```json
{}
```

```json
{
  "includeCompleted": true
}
```

### Get a goal with key results (tool: `get_goal`)

```json
{
  "goalId": "e53a033c-900e-462d-a849-4a216b06d571"
}
```

### Create a goal (tool: `create_goal`)

```json
{
  "name": "Increase Revenue Q2",
  "description": "Grow MRR by 20% in Q2 2026",
  "dueDate": "2026-06-30",
  "color": "#6BC950",
  "multipleOwners": true,
  "owners": [1234567]
}
```

### Update a goal (tool: `update_goal`)

```json
{
  "goalId": "e53a033c-900e-462d-a849-4a216b06d571",
  "name": "Increase Revenue Q2 (Revised)",
  "addOwners": [7654321]
}
```

### Delete a goal (tool: `delete_goal`)

```json
{
  "goalId": "e53a033c-900e-462d-a849-4a216b06d571"
}
```

### Create a key result (tool: `create_key_result`)

```json
{
  "goalId": "e53a033c-900e-462d-a849-4a216b06d571",
  "name": "Close 50 new deals",
  "type": "number",
  "stepsStart": 0,
  "stepsEnd": 50,
  "unit": "deals"
}
```

### Update a key result (tool: `update_key_result`)

```json
{
  "keyResultId": "b8d1c8f0-1234-4abc-9def-000000000001",
  "stepsEnd": 60
}
```

### Delete a key result (tool: `delete_key_result`)

```json
{
  "keyResultId": "b8d1c8f0-1234-4abc-9def-000000000001"
}
```
