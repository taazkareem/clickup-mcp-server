# Architecture Documentation

This document describes the high-level architecture of the ClickUp MCP Server, with a focus on its multi-transport support and session isolation for remote deployments.

## 🏗️ System Overview

The ClickUp MCP Server is designed to bridge the gap between AI Agents (using the Model Context Protocol) and the ClickUp API. It supports two primary modes of operation:

1.  **Local (STDIO)**: Private process per user. Typically used with `npx` in desktop apps like Claude or Cursor.
2.  **Remote (SSE/Streamable HTTP)**: Managed, multi-tenant server. Typically hosted on Render, Smithery, or Railway.

---

## 🧩 Core Components

### 1. Configuration Layer (`src/config.ts`)
Handles the initial server configuration from environment variables and command-line arguments. In remote mode, these serve as "global fallbacks" if a request doesn't provide its own credentials.

### 2. Service Layer (`src/services/`)
-   **ClickUp Services**: Wraps the ClickUp API calls.
-   **Shared Services (`shared.ts`)**: A factory that creates isolated service instances. This is the heart of multi-tenancy. Every session gets its own unique **Service Instance** with private, instance-level state (caches, status maps, and context).

### 3. Server Logic (`src/server.ts`)
Contains the MCP tool definitions and handlers. It is transport-agnostic; it doesn't care if it's talking over a pipe (STDIO) or a socket (HTTP).

### 4. Transport Layer
-   **STDIO (`src/index.ts`)**: The standard entry point for local execution.
-   **SSE/HTTP (`src/sse_server.ts`)**: An Express-based server that manages multiple concurrent MCP sessions over the web.

### 5. Authentication
-   **OAuth 2.0 (`src/sse_server.ts`)**: Implements OAuth 2.0 Authorization Code Flow for secure user authentication. See [OAuth Architecture](OAUTH_ARCHITECTURE.md) for details.


---

## 🔒 Multi-Tenancy & Session Isolation

When running in Remote mode, the server handles multiple users within a single Node.js process. To ensure security and privacy, we use **Session-Based Isolation**.

### The Session Handshake
1.  **Initialize**: The client sends an `initialize` request with authentication headers (`X-ClickUp-Key`, `X-ClickUp-Team-Id`, `X-License-Key`, `X-Enabled-Tools`).
2.  **Creation**: The server reads these headers and creates a **Private Service Context** for that specific `sessionId`.
3.  **Persistence**: This context is stored in memory for the duration of the session. It contains the user's unique API tokens and their specific tool-filtering preferences.
4.  **Routing**: Every subsequent `CallTool` request for that `sessionId` is routed to its private service context. User A can never access User B's API key or see User B's enabled tools.

-   **Stateful**: Used by standard MCP clients. The configuration and all stateful caches (search results, task names, upload sessions) are remembered in RAM for that specific session.
-   **Stateless**: Used by simple HTTP clients. Credentials must be sent as headers with *every* request. The server builds a temporary context on-the-fly, executes the tool, and clears all session memory immediately.

---

## 🧠 Smart Caching & Normalization

The server implements an intelligent layer to bridge the gap between LLM output and ClickUp's strict API requirements.

### 1. Status Normalization
-   **Fuzzy Matching**: Automatically maps variations like `to-do`, `todo`, `in-progress` or `done` to the exact status strings defined in your ClickUp workspace.
-   **Context-Aware**: Prioritizes statuses retrieved from the specific List being worked on.
-   **Zero-API Overhead**: Status names are "learned" and cached whenever tasks are fetched or updated, avoiding extra meta-data requests to ClickUp.

### 2. Session-Isolated State
To ensure security in multi-tenant environments, every caching mechanism has been refactored to be **Instance-Level** instead of **Global**:
-   **Task Search RAM**: Global workspace search results are cached for 60 seconds but are strictly private to the session that triggered the search.
-   **Sequential Context**: Remembers the ID of the last task mentioned by name (e.g., "Create a task called Bug Fix" followed by "Update it"). This mapping is never shared between users.
-   **Upload Sessions**: Multi-chunk file uploads are tracked within the user's private service context.

---

## 🛠️ Tool Filtering Architecture

Users can customize which tools are visible to the AI on a per-session basis. This reduces "context noise" and prevents the AI from using dangerous or irrelevant tools.

### Precedence Logic
The server determines which tools to enable using the following priority:
1.  **Session Headers**: `X-Enabled-Tools` or `X-Disabled-Tools` sent by the client.
2.  **Local Environment**: `ENABLED_TOOLS` or `DISABLED_TOOLS` set on the server's OS.
3.  **Default**: If nothing is specified, all 50+ tools are enabled.

---

## 🚀 Deployment Flows

### Standard (Local)
`AI Agent` -> `OS Process (STDIO)` -> `ClickUp API`

### Remote (Hosted)
`AI Agent` -> `HTTPS/TLS` -> `Load Balancer` -> `MCP Server (Session Context)` -> `ClickUp API`
