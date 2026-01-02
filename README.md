# ClickUp MCP Server

![ClickUp MCP Server Premium Image](https://raw.githubusercontent.com/taazkareem/clickup-mcp-server/main/assets/images/header_image.png)


**A Model Context Protocol (MCP) server for integrating ClickUp with AI applications like Claude Desktop, Gemini CLI, n8n, Cursor IDE, and custom AI agents.** This server enables seamless interaction with ClickUp tasks, spaces, lists, documents, files, folders, and chat channels through a standardized protocol, using natural language. 

> **Status Update: This project has moved to a Sponsorware model.**
> **🔒 Premium Version** - Choice of [Subscription](https://buy.polar.sh/polar_cl_3xQojQLgzQXKCLzsxc49YfL6z8hzSBBqh9ivy1qZdwW) or [Lifetime](https://buy.polar.sh/polar_cl_whcMn4lbBFwZUoWU5p2qDSn0fs23ACC6IwK3e15hXV5) Access

[![npm version](https://img.shields.io/npm/v/@taazkareem/clickup-mcp-server.svg)](https://www.npmjs.com/package/@taazkareem/clickup-mcp-server)
[![npm downloads](https://img.shields.io/npm/dm/@taazkareem/clickup-mcp-server.svg)](https://www.npmjs.com/package/@taazkareem/clickup-mcp-server)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/TaazKareem/clickup-mcp-server/graphs/commit-activity)

### ⭐️ 460+ Stars (from previous public repo) - Industry-Standard ClickUp MCP Integration
Powering 8,000+ monthly workflow sessions for developers and AI consultants.

Thank you for your interest in the ClickUp MCP Server. Due to the high volume of traffic and the resources required to maintain, update, and support this integration, the source code is now exclusively available to supporters.

This change ensures dedicated time for:
*   **Maintenance:** Keeping up with ClickUp API changes and MCP protocol updates.
*   **Support:** Providing priority assistance to active users.
*   **New Features:** Developing advanced capabilities.

## 🚀 How to Get Access

You can get **instant access** by choosing the plan that fits you best. Setup takes less than 2 minutes!

We use **Polar.sh** to handle payments and deliver your license key immediately.

### 💳 Pricing Options:
*   👉 **[Monthly Subscription: $9/month](https://buy.polar.sh/polar_cl_3xQojQLgzQXKCLzsxc49YfL6z8hzSBBqh9ivy1qZdwW)** - Perfect for ongoing projects and updates.
*   👉 **[Lifetime Access: $59 (One-time)](https://buy.polar.sh/polar_cl_whcMn4lbBFwZUoWU5p2qDSn0fs23ACC6IwK3e15hXV5)** - Same benefits. Pay once, use forever.

[![Get Access](https://img.shields.io/badge/Get_Access-Purchase_License-blue?style=for-the-badge&logo=github)](https://buy.polar.sh/polar_cl_whcMn4lbBFwZUoWU5p2qDSn0fs23ACC6IwK3e15hXV5)

## ⚡ Super Simple Setup

### Requirements

- **Node.js v18.0.0 or higher** (required for MCP SDK compatibility)
- Valid license key from [Polar.sh](https://buy.polar.sh/polar_cl_3xQojQLgzQXKCLzsxc49YfL6z8hzSBBqh9ivy1qZdwW)
- ClickUp API key and Team ID

### 2. Add to Your MCP Configuration

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
        "CLICKUP_MCP_LICENSE_KEY": "your-license-key-here",
        "CLICKUP_API_KEY": "your-clickup-api-key",
        "CLICKUP_TEAM_ID": "your-team-id",
        "DOCUMENT_SUPPORT": "true"
      }
    }
  }
}
```

### 3. Restart Your MCP Client

That's it! The server will validate your license key and start automatically.

## Authorization & Configuration

### Getting Your ClickUp Credentials

1. **ClickUp API Key**: 
   - Go to [ClickUp Settings → Apps](https://app.clickup.com/settings/apps)
   - Generate a new API token under "API Token"

2. **ClickUp Team ID**:
   - This is the **first UUID** in your ClickUp workspace URL when viewing it in your browser
    - **Example**: In `https://app.clickup.com/[TEAM_ID]/v/l/[PROJECT_ID]`, use the `[TEAM_ID]` portion
    - **Note**: ClickUp's API documentation refers to this as `team_id`, but it actually represents your Workspace ID (this naming is due to legacy API design)
    - For reference: In ClickUp's API, `team_id` = Workspace ID, and `group_id` = Team (group of users)

### Tool Filtering

You can control which tools are available using two complementary environment variables:

#### ENABLED_TOOLS (Recommended)
Use `ENABLED_TOOLS` to specify exactly which tools should be available:
```bash
# Environment variable in your config
"ENABLED_TOOLS": "create_task,get_task,update_task,get_workspace_hierarchy"
```

## 📦 What is Included?

By purchasing a license, you get:

1.  **Instant Access:** License key delivered immediately after purchase
2.  **Full Functionality:** All 50 tools for task, chat, document, and workspace management
3.  **Automatic Updates:** Always get the latest features via `npx`
4.  **Priority Support:** Open issues and request features directly

## Features

| 📝 Task Management | 🏷️ Tag Management |
| ------------------ | ----------------- |
| • Create, update, and delete tasks<br>• Move and duplicate tasks anywhere<br>• Support for single and bulk operations<br>• Set start/due dates with natural language<br>• Create and manage subtasks<br>• Add comments and attachments<br>• Link tasks and manage dependencies | • Create, update, and delete space tags<br>• Add and remove tags from tasks<br>• Use natural language color commands<br>• Automatic contrasting foreground colors<br>• View all space tags<br>• Tag-based task organization across workspace |
| ⏱️ **Time Tracking** | 🌳 **Workspace Organization** |
| • View time entries for tasks<br>• Start/stop time tracking on tasks<br>• Add manual time entries<br>• Delete time entries<br>• View currently running timer<br>• Track billable and non-billable time | • Navigate spaces, folders, and lists<br>• Create and manage folders<br>• Organize lists within spaces<br>• Create lists in folders<br>• View workspace hierarchy<br>• Efficient path navigation |
| 📄 **Document Management** | 👥 **Member Management** |
| ------------------------- | ------------------------ |
| • Document Listing through all workspace<br>• Document Page listing<br>• Document Page Details<br>• Document Creation<br>• Document page update (append & prepend) | • Find workspace members by name or email<br>• Resolve assignees for tasks<br>• View member details and permissions<br>• Assign tasks to users during creation and updates<br>• Support for user IDs, emails, or usernames<br>• Team-wide user management |
| 💬 **Chat Management** | ⚡ **Integration Features** |
| ---------------------- | -------------------------- |
| • Create and manage chat channels<br>• Send messages with markdown support<br>• Retrieve message history<br>• Smart channel name resolution<br>• Cross-workspace communication support | • Global name or ID-based lookups<br>• Case-insensitive matching<br>• Markdown formatting support<br>• Built-in rate limiting<br>• Error handling and validation<br>• Comprehensive API coverage |
| 🏗️ **Architecture & Performance** | |
| -------------------------------- | - |
| • **70% codebase reduction** for improved performance<br>• **Unified architecture** across all transport types<br>• **Zero code duplication**<br>• **HTTP Streamable transport** (MCP Inspector compatible)<br>• **Legacy SSE support** for backwards compatibility | |

## Available Tools

| Tool | Description | Required Parameters |
| ------------------------------------------------------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [get_workspace_hierarchy](docs/user-guide.md#workspace-navigation) | Get workspace structure | None |
| [create_task](docs/user-guide.md#task-management) | Create a task | `name`, (`listId`/`listName`) |
| [create_bulk_tasks](docs/user-guide.md#task-management) | Create multiple tasks | `tasks[]` |
| [update_task](docs/user-guide.md#task-management) | Modify task | `taskId`/`taskName` |
| [update_bulk_tasks](docs/user-guide.md#task-management) | Update multiple tasks | `tasks[]` with IDs or names |
| [get_tasks](docs/user-guide.md#task-management) | Get tasks from list | `listId`/`listName` |
| [get_task](docs/user-guide.md#task-management) | Get single task details | `taskId`/`taskName` (with smart disambiguation) |
| [get_workspace_tasks](docs/user-guide.md#task-management) | Get tasks with filtering | At least one filter (tags, list_ids, space_ids, etc.) |
| [get_task_comments](docs/user-guide.md#task-management) | Get comments on a task | `taskId`/`taskName`, `include_replies` |
| [create_task_comment](docs/user-guide.md#task-management) | Add a comment to a task | `commentText`, (`taskId`/(`taskName`+`listName`)) |
| [attach_task_file](docs/user-guide.md#task-management) | Attach file to a task | `taskId`/`taskName`, (`file_data` or `file_url`) |
| [delete_task](docs/user-guide.md#task-management) | Remove task | `taskId`/`taskName` |
| [delete_bulk_tasks](docs/user-guide.md#task-management) | Remove multiple tasks | `tasks[]` with IDs or names |
| [move_task](docs/user-guide.md#task-management) | Move task | `taskId`/`taskName`, `listId`/`listName` |
| [move_bulk_tasks](docs/user-guide.md#task-management) | Move multiple tasks | `tasks[]` with IDs or names, target list |
| [duplicate_task](docs/user-guide.md#task-management) | Copy task | `taskId`/`taskName`, `listId`/`listName` |
| [add_task_link](docs/user-guide.md#task-management) | Link two tasks together | `taskId`/`taskName`, `targetTaskId`/`targetTaskName` |
| [get_task_links](docs/user-guide.md#task-management) | Get all links for a task | `taskId`/`taskName` |
| [delete_task_link](docs/user-guide.md#task-management) | Remove a task link | `taskId`/`taskName`, `linkId`/`targetTaskName` |
| [create_list](docs/user-guide.md#list-management) | Create list in space | `name`, `spaceId`/`spaceName` |
| [create_folder](docs/user-guide.md#folder-management) | Create folder | `name`, `spaceId`/`spaceName` |
| [create_list_in_folder](docs/user-guide.md#list-management) | Create list in folder | `name`, `folderId`/`folderName` |
| [get_folder](docs/user-guide.md#folder-management) | Get folder details | `folderId`/`folderName` |
| [update_folder](docs/user-guide.md#folder-management) | Update folder properties | `folderId`/`folderName` |
| [delete_folder](docs/user-guide.md#folder-management) | Delete folder | `folderId`/`folderName` |
| [get_list](docs/user-guide.md#list-management) | Get list details | `listId`/`listName` |
| [update_list](docs/user-guide.md#list-management) | Update list properties | `listId`/`listName` |
| [delete_list](docs/user-guide.md#list-management) | Delete list | `listId`/`listName` |
| [get_space_tags](docs/user-guide.md#tag-management) | Get space tags | `spaceId`/`spaceName` |
| [create_space_tag](docs/user-guide.md#tag-management) | Create tag | `tagName`, `spaceId`/`spaceName` |
| [update_space_tag](docs/user-guide.md#tag-management) | Update tag | `tagName`, `spaceId`/`spaceName` |
| [delete_space_tag](docs/user-guide.md#tag-management) | Delete tag | `tagName`, `spaceId`/`spaceName` |
| [add_tag_to_task](docs/user-guide.md#tag-management) | Add tag to task | `tagName`, `taskId`/(`taskName`+`listName`) |
| [remove_tag_from_task](docs/user-guide.md#tag-management) | Remove tag from task | `tagName`, `taskId`/(`taskName`+`listName`) |
| [get_task_time_entries](docs/user-guide.md#time-tracking) | Get time entries for a task | `taskId`/`taskName` |
| [start_time_tracking](docs/user-guide.md#time-tracking) | Start time tracking on a task | `taskId`/`taskName` |
| [stop_time_tracking](docs/user-guide.md#time-tracking) | Stop current time tracking | None |
| [add_time_entry](docs/user-guide.md#time-tracking) | Add manual time entry to a task | `taskId`/`taskName`, `start`, `duration` |
| [delete_time_entry](docs/user-guide.md#time-tracking) | Delete a time entry | `timeEntryId` |
| [get_current_time_entry](docs/user-guide.md#time-tracking) | Get currently running timer | None |
| [get_workspace_members](docs/user-guide.md#member-management) | Get all workspace members | None |
| [find_member_by_name](docs/user-guide.md#member-management) | Find member by name or email | `nameOrEmail` |
| [resolve_assignees](docs/user-guide.md#member-management) | Resolve member names to IDs | `assignees[]` |
| [create_document](docs/user-guide.md#document-management) | Create a document | `workspaceId`, `name`, `parentId`/`parentType`, `visibility`, `create_pages` |
| [get_document](docs/user-guide.md#document-management) | Get a document | `workspaceId`/`documentId`/`documentName` |
| [list_documents](docs/user-guide.md#document-management) | List documents | `workspaceId`, `documentId`/`creator`/`deleted`/`archived`/`parent_id`/`parent_type`/`limit`/`next_cursor` |
| [list_document_pages](docs/user-guide.md#document-management) | List document pages | `documentId`/`documentName` |
| [get_document_pages](docs/user-guide.md#document-management) | Get document pages | `documentId`/`documentName`, `pageIds` |
| [create_document_pages](docs/user-guide.md#document-management) | Create a document page | `workspaceId`/`documentId`/`documentName`, `parent_page_id`/`name`/`sub_title`,`content`/`content_format` |
| [update_document_page](docs/user-guide.md#document-management) | Update a document page | `workspaceId`/`documentId`/`documentName`, `name`/`sub_title`,`content`/`content_edit_mode`/`content_format` |
| [create_chat_channel](docs/user-guide.md#chat-management) | Create a chat channel | `name` |
| [get_chat_channels](docs/user-guide.md#chat-management) | List all chat channels | None |
| [create_chat_message](docs/user-guide.md#chat-management) | Send a message to a channel | `comment_text`, (`channel_id`/`channel_name`) |
| [get_chat_messages](docs/user-guide.md#chat-management) | Get message history | `channel_id`/`channel_name` |

See [full documentation](docs/user-guide.md) for optional parameters and advanced usage.

## Running with HTTP Transport Support

The server supports both modern **HTTP Streamable** transport (MCP Inspector compatible) and legacy **SSE (Server-Sent Events)** transport.

```json
{
  "mcpServers": {
    "ClickUp": {
      "command": "npx",
      "args": ["-y", "@taazkareem/clickup-mcp-server@latest"],
      "env": {
        "CLICKUP_MCP_LICENSE_KEY": "your-license-key",
        "CLICKUP_API_KEY": "your-api-key",
        "CLICKUP_TEAM_ID": "your-team-id",
        "ENABLE_SSE": "true",
        "PORT": "3231"
      }
    }
  }
}
```

**Endpoints:**
- **Primary**: `http://127.0.0.1:3231/mcp` (Streamable HTTP)
- **Legacy**: `http://127.0.0.1:3231/sse` (SSE for backwards compatibility)

### n8n Integration

To integrate with n8n:

1. Start the clickup-mcp-server with SSE enabled
2. In n8n, add a new "MCP AI Tool" node
3. Configure the node with:
   - Transport: SSE
   - Server URL: `http://localhost:3231` (or your server address)
   - Tools: Select the ClickUp tools you want to use

## 🔒 Security Features

The server includes optional security enhancements for production deployments.

- **HTTPS Support**
- **Origin Validation**
- **Rate Limiting**

For detailed security configuration, see [Security Features Documentation](docs/security-features.md).

## ❓ FAQ

**How do I get my license key after paying?**
Immediately after purchase on Polar, you'll receive your license key. Just add it to your MCP configuration and restart!

**Why isn't this free anymore?**
Building and maintaining reliable MCP integrations requires significant time. Moving to a paid model allows this to be treated as a supported product rather than a hobby.

**I am already using an old version. Will it stop working?**
If you have already cloned a previous version locally, your copy will continue to work. However, you will not receive any new updates and fixes unless you purchase a license.

**Is it a one-time payment or subscription?**
We offer both! You can choose between a flexible **$9/month subscription** (cancel anytime) or a **$59 lifetime access** (one-time payment). Both options provide full access to all 50+ tools and upcoming features.

## Prompts

Not yet implemented and not supported by all client apps. Request a feature for a Prompt implementation that would be most beneficial for your workflow (without it being too specific). Examples:

| Prompt                                             | Purpose                   | Features                                  |
| -------------------------------------------------- | ------------------------- | ----------------------------------------- |
| [summarize_tasks](docs/user-guide.md#prompts)      | Task overview             | Status summary, priorities, relationships |
| [analyze_priorities](docs/user-guide.md#prompts)   | Priority optimization     | Distribution analysis, sequencing         |
| [generate_description](docs/user-guide.md#prompts) | Task description creation | Objectives, criteria, dependencies        |

## Premium Support

As a premium user, you have access to:

- **Priority Support**: Open issues directly in this private repository
- **Feature Requests**: Request new features and capabilities
- **Automatic Updates**: Pull the latest features and bug fixes
- **Direct Communication**: Get help from the maintainer

To get support, [open an issue](https://github.com/TaazKareem/clickup-mcp-server/issues) in this repository.

---
*Created by [taazkareem](https://github.com/taazkareem)*

## Disclaimer

This software makes use of third-party APIs and may reference trademarks
or brands owned by third parties. The use of such APIs or references does not imply
any affiliation with or endorsement by the respective companies. All trademarks and
brand names are the property of their respective owners. This project is an independent
work and is not officially associated with or sponsored by any third-party company mentioned.
