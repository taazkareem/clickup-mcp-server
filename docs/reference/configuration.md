[← Back to Documentation Index](../DOCUMENTATION.md)  
[← Back to README](../../README.md)

# Configuration

## Environment Variables

| Variable                      | Description                                                           | Default                |
| ----------------------------- | --------------------------------------------------------------------- | ---------------------- |
| `CLICKUP_MCP_LICENSE_KEY`     | Your Polar.sh license key                                             | Required               |
| `CLICKUP_API_KEY`             | ClickUp API token (primary)                                           | Required (STDIO mode)  |
| `CLICKUP_TEAM_ID`             | Default workspace/team ID (primary)                                   | Required               |
| `CLICKUP_ADDITIONAL_API_KEYS` | Comma-separated list of additional API keys for Multi-Account support | `""`                   |
| `CLICKUP_MCP_PERSONA`         | Comma-separated list of tool personas                                 | `""`                   |
| `ENABLED_TOOLS`               | Comma-separated list of tool names to enable (all others disabled)    | All tools enabled      |
| `DISABLED_TOOLS`              | Comma-separated list of tool names to disable (all others enabled)    | None disabled          |
| `ENABLED_CATEGORIES`          | Comma-separated list of categories to enable (all others disabled)    | All categories enabled |
| `DISABLED_CATEGORIES`         | Comma-separated list of categories to disable (all others enabled)    | None disabled          |

## Tool Filtering

You can control which tools are exposed to the AI agent using the following environment variables (which can also be passed as HTTP headers like `X-Enabled-Categories`):

- `CLICKUP_MCP_PERSONA`: Filter tools based on pre-defined job roles (e.g., `developer`, `project_manager`). See [Personas](personas.md) for more details on available personas.
- `ENABLED_TOOLS` / `DISABLED_TOOLS`: Filter by specific tool names (e.g., `create_task`).
- `ENABLED_CATEGORIES` / `DISABLED_CATEGORIES`: Filter by tool categories (e.g., `workspace`, `task`, `time_tracking`).

**Note on Categories:**
Categories follow the groupings in the "Available Tools" section (using lower `snake_case`). Available categories: `workspace`, `task`, `attachment`, `checklist`, `sprint`, `list`, `custom_field`, `space`, `goal`, `view`, `folder`, `tag`, `time_tracking`, `document`, `chat`, `webhook`, `user_group`, `guest`, `task_template`, `feedback`.

**Allow only specific categories:**

```json
{
  "env": {
    "ENABLED_CATEGORIES": "task,workspace,time_tracking"
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

Simultaneously federates multiple API keys with autonomous routing to ensure the AI can discover and manage tasks across all authorized accounts automatically. Also Bypasses OAuth entirely.

```json
{
  "mcpServers": {
    "ClickUp": {
      "url": "https://clickup-mcp.taazkareem.com/mcp",
      "headers": {
        "X-License-Key": "your-license-key",
        "X-ClickUp-Key": "your-api-key",
        "X-ClickUp-Team-Id": "your-team-id",
        "X-ClickUp-Additional-Keys": "apiKey2,apiKey3"
      }
    }
  }
}
```

### Configuration D: Hybrid Mode (OAuth Primary + Explicit Secondary Keys)

Triggers user OAuth while federating background API keys to enable seamless, zero-config task bridging between all connected workspaces.

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
