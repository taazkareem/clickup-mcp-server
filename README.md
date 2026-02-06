# ClickUp MCP Server - Premium
![ClickUp MCP Server Premium Image](https://raw.githubusercontent.com/taazkareem/clickup-mcp-server/main/assets/images/header_image.png)

[![npm version](https://img.shields.io/npm/v/@taazkareem/clickup-mcp-server.svg)](https://www.npmjs.com/package/@taazkareem/clickup-mcp-server)
[![npm downloads](https://img.shields.io/npm/dm/@taazkareem/clickup-mcp-server.svg)](https://www.npmjs.com/package/@taazkareem/clickup-mcp-server)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/TaazKareem/clickup-mcp-server/graphs/commit-activity)

**Properly Connect ClickUp to AI Agents** including Claude Desktop, Antigravity, Gemini CLI, Claude Code, Codex, OpenCode, n8n, OpenClaw,Roo Code, Windsurf, Cursor IDE, and more.
*A high-performance Model Context Protocol (MCP) server for managing tasks, tags, lists, folders, files, docs, time, chat, and workflows using natural language.*

> **Status Update:** v0.12.9: New improvements including full @mention support for chat messages and comments, and full markdown support in chat messages, automatic rich text conversion for comments.

⭐️ **Proven Performance:** 460+ Stars (from previous public repo) & thousands of weekly NPM downloads. The industry-standard ClickUp integration for AI.
<hr>


## 🔥 Features

*   **📝 Task Management:** Create, update, move, duplicate, and link related tasks. Supports bulk operations, natural language dates, full markdown, and @mentions.
*   **🔍 Intelligent Search:** Find tasks workspace-wide with fuzzy matching across names, statuses, tags, custom fields, and descriptions. Automatic name resolution—just say the task name, no IDs needed.
*   **⏱️ Time Tracking:** Start/stop timers in natural language, view entries, and manage billable time.
*   **📄 Manage Documents:** Create, read, and append to ClickUp Documents in the correct location. Supports full markdown.
*   **💬 Chat & Collaboration:** Send and retrieve messages in chat channels and task comments with automatic rich-text conversion and @mention support. 
*   **🌳 Workspace Control:** Navigate spaces, folders, and lists. Manage task tags and member assignments
*   **🧠 Smart Defaults:** Fuzzy matching for statuses (`todo` → `to-do`), members, spaces, folders, and lists. Session-isolated caching for fast, secure multi-tenant operation.

---

<a name="available-tools"></a>
## 🛠️ Available Tools

<details>
<summary><strong>👇 Click to view all 50+ available tools</strong></summary>

| Category | Tool | Description |
| :--- | :--- | :--- |
| **Workspace** | `get_workspace_hierarchy` | Get workspace structure |
| | `get_workspace_members` | Get all workspace members |
| | `find_member_by_name` | Find member by name or email |
| **Tasks** | `create_task` | Create a task |
| | `create_bulk_tasks` | Create multiple tasks |
| | `update_task` | Modify task |
| | `update_bulk_tasks` | Update multiple tasks |
| | `get_tasks` | Get tasks from list |
| | `get_task` | Get single task details |
| | `get_workspace_tasks` | Get tasks with filtering |
| | `delete_task` | Remove task |
| | `move_task` | Move task to new list |
| | `duplicate_task` | Copy task |
| | `add_task_link` | Link two tasks together |
| **Comments** | `get_task_comments` | Get comments on a task |
| | `create_task_comment` | Add a comment to a task |
| | `attach_task_file` | Attach file to a task |
| **Lists/Folders** | `create_list` | Create list in space/folder |
| | `create_folder` | Create folder |
| | `get_folder` | Get folder details |
| | `update_folder` | Update folder properties |
| **Tags** | `get_space_tags` | Get space tags |
| | `create_space_tag` | Create tag |
| | `add_tag_to_task` | Add tag to task |
| **Time** | `start_time_tracking` | Start time tracking |
| | `stop_time_tracking` | Stop current time tracking |
| | `get_task_time_entries` | Get time entries for a task |
| **Docs** | `create_document` | Create a document |
| | `get_document` | Get a document |
| | `list_documents` | List documents |
| **Chat** | `create_chat_channel` | Create a chat channel |
| | `create_chat_message` | Send a message to a channel |
| | `get_chat_messages` | Get message history |

*See [full documentation](docs/user-guide.md) for parameters and advanced usage.*
</details>

---

<a name="premium-access"></a>
## 💎 Premium Access

**This project operates on a Sponsorware model.** This high-performance MCP server is maintained daily to ensure compatibility with the latest AI agents and ClickUp API changes. A license grants **full access to all 50+ tools, priority bug fixes, and enterprise-grade feature development.**

| [**Monthly Subscription ($9)**](https://buy.polar.sh/polar_cl_3xQojQLgzQXKCLzsxc49YfL6z8hzSBBqh9ivy1qZdwW?utm_source=github&utm_medium=readme) | [**Lifetime Access ($59)**](https://buy.polar.sh/polar_cl_whcMn4lbBFwZUoWU5p2qDSn0fs23ACC6IwK3e15hXV5?utm_source=github&utm_medium=readme) |
| :--- | :--- |
| • Perfect for ongoing projects<br>• Cancel anytime | • One-time payment<br>• Best value for agencies |

**⚡️ Instant Delivery:** Your license key is delivered immediately via **Polar.sh**. Total setup time is under 2 minutes.

---

---

<a name="quick-start"></a>
## 🚀 Quick Start

### 1. Prerequisites
*   **Node.js v18.0.0+**
*   **ClickUp Credentials:** API Key & Team ID
*   **License Key:** [Purchase here](https://buy.polar.sh/polar_cl_whcMn4lbBFwZUoWU5p2qDSn0fs23ACC6IwK3e15hXV5?utm_source=github&utm_medium=readme)

### 2. Local Configuration
Add the following to your `claude_desktop_config.json` or similar MCP settings file to run locally via `npx`:

```json
{
  "mcpServers": {
    "ClickUp": {
      "command": "npx",
      "args": [
        "-y",
        "--package", "@taazkareem/clickup-mcp-server@latest",
        "clickup-mcp-server"
      ],
      "env": {
        "CLICKUP_API_KEY": "your-clickup-api-key",
        "CLICKUP_TEAM_ID": "your-team-id",
        "CLICKUP_MCP_LICENSE_KEY": "your-license-key-here"
      }
    }
  }
}
```

### 3. Hosted / Remote Usage (Beta releases)
 -or- For zero-setup usage without local Node.js requirements, use the hosted version:

```json
{
  "mcpServers": {
    "ClickUp": {
      "serverUrl": "https://clickup-mcp.taazkareem.com/mcp",
      "headers": {
        "X-ClickUp-Key": "your-clickup-api-key",
        "X-ClickUp-Team-Id": "your-team-id",
        "X-License-Key": "your-license-key-here",
        "X-Enabled-Tools": "get_workspace_hierarchy,create_task,get_task,update_task,get_workspace_tasks"
      }
    }
  }
}
```

### 4. Restart
Restart your MCP Host (e.g., Cursor IDE). The server will validate your license and start automatically.

---



## ⚙️ Configuration

### Finding Your Credentials

1.  **ClickUp API Key:**
    *   Navigate to [ClickUp Settings → Apps](https://app.clickup.com/settings/apps).
    *   Generate a token under "API Token".
2.  **ClickUp Team ID:**
    *   Open ClickUp in your browser.
    *   Look at the URL: `https://app.clickup.com/[TEAM_ID]/v/...`
    *   The first number is your Team ID.
    *   *Note: ClickUp API calls this `team_id`, but it actually represents your Workspace ID.*

### Advanced Configuration

#### Filter Available Tools
💡 Pro Tip! Reduce context noise by limiting available tools in your `env` arguments:
```json
"ENABLED_TOOLS": "get_workspace_hierarchy,create_task,get_task,update_task"
```
-or- the hosted version `headers`:
```json
"X-Enabled-Tools": "get_workspace_hierarchy,create_task,get_task,update_task"
```

#### Enable Document Support (Beta)
Enable creation and management of ClickUp Docs:
```json
"DOCUMENT_SUPPORT": "true"
```

---

## 🔌 Compatibility

This server supports  **STDIO, HTTP Streamable, and SSE (Server-Sent Events)** for legacy integrations.

**Configuration:**
```json
{
  "env": {
    "ENABLE_SSE": "true",
    "PORT": "3231"
  }
}
```

**n8n Setup:**
1.  Set `ENABLE_SSE` to "true" and run the server.
2.  In n8n, add an **"MCP AI Tool"** node.
3.  Set Transport to `SSE` and URL to `http://localhost:3231/sse`.

---

## ❓ FAQ

**Why isn't this free anymore?**
Building reliable MCP integrations requires significant maintenance. Moving to a paid model allows us to support this as a product rather than a hobby, ensuring compatibility with API changes.

**I have an old version. Will it stop working?**
Existing local clones will continue to work, but you will not receive updates, bug fixes, or support without a license.

**How do I get support?**
Premium users get priority support. Please [open an issue](https://github.com/TaazKareem/clickup-mcp-server/issues) in this repository.

---

## ⚖️ Disclaimer

Originally developed as open source and refined during a consultancy with ClickUp, this project is now independently maintained.

This software makes use of third-party APIs and may reference trademarks or brands owned by third parties. The use of such APIs or references does not imply any affiliation with or endorsement by the respective companies. All trademarks and brand names are the property of their respective owners. This project is an independent work and is not officially associated with or sponsored by any third-party company mentioned.

<div align="center">
  <sub>Created by <a href="https://github.com/taazkareem">taazkareem</a></sub>
</div>
