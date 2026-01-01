# SSE Transport for ClickUp MCP Server

## Overview

The Server-Sent Events (SSE) transport for the ClickUp MCP Server enables integration with web applications and services that support SSE, such as n8n. This transport works alongside the default STDIO transport, allowing the server to be accessed through both interfaces simultaneously.

## Configuration Options

| Option | Description | Default |
| ------ | ----------- | ------- |
| `ENABLE_SSE` | Enable the SSE transport | `false` |
| `SSE_PORT` | Port for the SSE server | `3000` |
| `HOST` | Binding address (use 0.0.0.0 for Docker) | `127.0.0.1` |
| `ENABLE_STDIO` | Enable the STDIO transport | `true` |

## Enabling SSE Transport

### Environment Variables

You can enable the SSE transport using environment variables:

```bash
ENABLE_SSE=true SSE_PORT=3000 HOST=0.0.0.0 npx @taazkareem/clickup-mcp-server
```

### Command Line Arguments

Alternatively, you can use command line arguments:

```bash
npx @taazkareem/clickup-mcp-server --env ENABLE_SSE=true --env SSE_PORT=3000
```

### MCP Configuration File

If you're using the server through an MCP configuration file (e.g., in Claude Desktop), add the SSE configuration to your settings:

```json
{
  "mcpServers": {
    "ClickUp": {
      "command": "npx",
      "args": [
        "-y",
        "@taazkareem/clickup-mcp-server@latest"
      ],
      "env": {
        "CLICKUP_API_KEY": "your-api-key",
        "CLICKUP_TEAM_ID": "your-team-id",
        "DOCUMENT_SUPPORT": "true",
        "ENABLE_SSE": "true",
        "SSE_PORT": "3000"
      }
    }
  }
}
```

## SSE Endpoints

When SSE is enabled, the server exposes the following endpoints:

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/events` | GET | SSE connection endpoint for receiving server events |
| `/request` | POST | Endpoint for sending requests to the server |
| `/health` | GET | Health check endpoint |

## n8n Integration

To integrate with n8n, follow these steps:

1. Start the clickup-mcp-server with SSE enabled
2. In n8n, add a new "MCP AI Tool" node
3. Configure the node with:
   - Transport: SSE
   - Server URL: `http://localhost:3000` (or your server address)
   - Tools: Select the ClickUp tools you want to use

## Technical Implementation

The SSE transport implements the ServerTransport interface and provides the following capabilities:

- Establishes SSE connections with clients
- Handles incoming JSON-RPC requests
- Routes requests to the appropriate server handlers
- Sends responses back through SSE events
- Manages connection lifecycle and cleanup

This implementation allows the server to be used with SSE-capable clients while maintaining compatibility with the default STDIO transport. 