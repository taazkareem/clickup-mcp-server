[← Back to Documentation Index](../DOCUMENTATION.md)  
[← Back to README](../../README.md)  

# Configuration

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CLICKUP_MCP_LICENSE_KEY` | Your Polar.sh license key | Required |
| `CLICKUP_API_KEY` | ClickUp API token | Required (STDIO mode) |
| `CLICKUP_TEAM_ID` | Default workspace/team ID | Required |
| `ENABLED_TOOLS` | Comma-separated list of tool names to enable (all others disabled) | All tools enabled |
| `DISABLED_TOOLS` | Comma-separated list of tool names to disable (all others enabled) | None disabled |
| `DOCUMENT_SUPPORT` | Enable document management tools | `false` |

## Tool Filtering

You can control which tools are exposed to the AI agent using `ENABLED_TOOLS` or `DISABLED_TOOLS` (mutually exclusive — do not use both):

**Allow only specific tools:**
```json
{
  "env": {
    "ENABLED_TOOLS": "get_task,create_task,update_task,get_workspace_hierarchy"
  }
}
```

**Disable specific tools:**
```json
{
  "env": {
    "DISABLED_TOOLS": "delete_task,delete_bulk_tasks,delete_list,delete_folder"
  }
}
```
