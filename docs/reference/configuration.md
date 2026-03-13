[← Back to Documentation Index](../DOCUMENTATION.md)  
[← Back to README](../../README.md)  

# Configuration

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CLICKUP_MCP_LICENSE_KEY` | Your Polar.sh license key | Required |
| `CLICKUP_API_KEY` | ClickUp API token (primary) | Required (STDIO mode) |
| `CLICKUP_TEAM_ID` | Default workspace/team ID (primary) | Required |
| `CLICKUP_ADDITIONAL_API_KEYS` | Comma-separated list of additional API keys for Multi-Account support | `""` |
| `CLICKUP_ADDITIONAL_TEAM_IDS` | Comma-separated list of additional team IDs | `""` |
| `ENABLED_TOOLS` | Comma-separated list of tool names to enable (all others disabled) | All tools enabled |
| `DISABLED_TOOLS` | Comma-separated list of tool names to disable (all others enabled) | None disabled |
| `DOCUMENT_SUPPORT` | Enable document management tools | `false` |

## Tool Filtering

You can control which tools are exposed to the AI agent using `ENABLED_TOOLS` or `DISABLED_TOOLS` (mutually exclusive — do not use both):

**Allow only specific tools:**
```json
{
  "env": {
    "ENABLED_TOOLS": "get_task,create_task,update_task,get_workspace"
  }
}
```

**Disable specific tools:**
```json
{
  "env": {
    "DISABLED_TOOLS": "delete_task,delete_bulk_tasks,delete_task_link,delete_task_dependency"
  }
}
```

## Multi-Account & Cross-Workspace Support

The server supports managing multiple accounts (OAuth + multiple API keys) in a single session. This enables cross-workspace coordination (e.g. moving a task from an account you authenticated via OAuth to a separate admin or client account configured via API Key).

Below are different configurations that illustrate this feature:

### Configuration A: OAuth Flow (No explicit API Keys)
The server initializes in unauthenticated mode and prompts the MCP client to start the OAuth flow.
```json
{
  "mcpServers": {
    "ClickUp": {
      "url": "https://clickup-mcp.taazkareem.com/mcp",
      "headers": {
        "X-License-Key": "your-license-key"
      }
    }
  }
}
```

### Configuration B: Standard Single-Account (Personal Access Token)
Bypasses OAuth entirely. The AI agent uses this key for all requests.
```json
{
  "mcpServers": {
    "ClickUp": {
      "url": "https://clickup-mcp.taazkareem.com/mcp",
      "headers": {
        "X-License-Key": "your-license-key",
        "X-ClickUp-Key": "your-api-key",
        "X-ClickUp-Team-Id": "your-team-id"
      }
    }
  }
}
```

### Configuration C: Multi-Account Federated Mode
Uses a primary token but also loads additional API keys. Workspaces for all provided keys will be mapped internally, and requests will be automatically routed to the correct token based on the `team_id` tool parameter.
```json
{
  "mcpServers": {
    "ClickUp": {
      "url": "https://clickup-mcp.taazkareem.com/mcp",
      "headers": {
        "X-License-Key": "your-license-key",
        "X-ClickUp-Key": "your-api-key",
        "X-ClickUp-Team-Id": "your-team-id",
        "X-ClickUp-Additional-Keys": "key2,key3",
        "X-ClickUp-Additional-Team-Ids": "teamId2"
      }
    }
  }
}
```

### Configuration D: Hybrid Mode (OAuth Primary + Explicit Secondary Keys)
Triggers OAuth for the primary user authentication, but seamlessly federates additional Service Account / Admin API Keys in the background. The agent can bridge tasks between the user's OAuth workspaces and the configured secondary workspaces.
```json
{
  "mcpServers": {
    "ClickUp": {
      "url": "https://clickup-mcp.taazkareem.com/mcp",
      "headers": {
        "X-License-Key": "your-license-key",
        "X-ClickUp-Additional-Keys": "key2,key3"
      }
    }
  }
}
```
