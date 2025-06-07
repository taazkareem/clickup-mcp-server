<img src="assets/images/clickup_mcp_server_social_image.png" alt="ClickUp MCP Server" width="100%">

![Total Supporters](https://img.shields.io/badge/🏆%20Total%20Supporters-4-gold)
[![GitHub Stars](https://img.shields.io/github/stars/TaazKareem/clickup-mcp-server?style=flat&logo=github)](https://github.com/TaazKareem/clickup-mcp-server/stargazers)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-brightgreen.svg)](https://github.com/TaazKareem/clickup-mcp-server/graphs/commit-activity)

A Model Context Protocol (MCP) server for integrating ClickUp tasks with AI applications. This server allows AI agents to interact with ClickUp tasks, spaces, lists, and folders through a standardized protocol.

> 🚀 **Status Update:** v0.7.2 now available with complete Time Tracking support and Document Management features.  Please note, some of the latest features/tools are not rolled out yet and will only work when cloning the repo and running locally as node command instead of npx.

## Setup

1. Get your credentials:
   - ClickUp API key from [ClickUp Settings](https://app.clickup.com/settings/apps)
   - Team ID from your ClickUp workspace URL
2. Choose either hosted installation (sends webhooks) or NPX installation (downloads to local path and installs dependencies)
3. Use natural language to manage your workspace!

## Smithery Installation (Quick Start)

[![smithery badge](https://smithery.ai/badge/@taazkareem/clickup-mcp-server)](https://smithery.ai/server/@TaazKareem/clickup-mcp-server)

The server is hosted on [Smithery](https://smithery.ai/server/@taazkareem/clickup-mcp-server). There, you can preview the available tools or copy the commands to run on your specific client app.

## NPX Installation

[![NPM Version](https://img.shields.io/npm/v/@taazkareem/clickup-mcp-server.svg?style=flat&logo=npm)](https://www.npmjs.com/package/@taazkareem/clickup-mcp-server)
[![Dependency Status](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen)](https://github.com/TaazKareem/clickup-mcp-server/blob/main/package.json)
[![NPM Downloads](https://img.shields.io/npm/dm/@taazkareem/clickup-mcp-server.svg?style=flat&logo=npm)](https://npmcharts.com/compare/@taazkareem/clickup-mcp-server?minimal=true)

Add this entry to your client's MCP settings JSON file:

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
        "DOCUMENT_SUPPORT": "true"
      }
    }
  }
}
```

Or use this npx command:

`npx -y @taazkareem/clickup-mcp-server@latest --env CLICKUP_API_KEY=your-api-key --env CLICKUP_TEAM_ID=your-team-id`

**Obs: if you don't pass "DOCUMENT_SUPPORT": "true", the default is false and document support will not be active.**

Additionally, you can use the `DISABLED_TOOLS` environment variable or `--env DISABLED_TOOLS` argument to disable specific tools. Provide a comma-separated list of tool names to disable (e.g., `create_task,delete_task`).

Please disable tools you don't need if you are having issues with the number of tools or any context limitations

## Running with HTTP and SSE Transport Support

The server supports both modern **Streamable HTTP** transport and legacy **SSE (Server-Sent Events)** transport for backwards compatibility.


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
        "ENABLE_SSE": "true",
        "PORT": "8000"  // Optional, defaults to 3231
      }
    }
  }
}
```

**Endpoints:**
- **Primary**: `http://127.0.0.1:3231/mcp` (Streamable HTTP)
- **Legacy**: `http://127.0.0.1:3231/sse` (SSE for backwards compatibility)

### Command Line Usage

```bash
npx -y @taazkareem/clickup-mcp-server@latest --env CLICKUP_API_KEY=your-api-key --env CLICKUP_TEAM_ID=your-team-id --env ENABLE_SSE=true --env PORT=8000
```

## Docker-compose example 
```yaml
version: '3.8'

services:
  clickup-mcp-server:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3231:8000'
    environment:
      - CLICKUP_API_KEY=${CLICKUP_API_KEY}
      - CLICKUP_TEAM_ID=${CLICKUP_TEAM_ID}
      - ENABLE_SSE=true
      - LOG_LEVEL=info
      - DOCUMENT_SUPPORT=true
    volumes:
      - ./src:/app/src
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s
```
## Features

| 📝 Task Management                                                                                                                                                                                                                                                   | 🏷️ Tag Management                                                                                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| • Create, update, and delete tasks<br>• Move and duplicate tasks anywhere<br>• Support for single and bulk operations<br>• Set start/due dates with natural language<br>• Create and manage subtasks<br>• Add comments and attachments | • Create, update, and delete space tags<br>• Add and remove tags from tasks<br>• Use natural language color commands<br>• Automatic contrasting foreground colors<br>• View all space tags<br>• Tag-based task organization across workspace |
| ⏱️ **Time Tracking**                                                                                                                                                                                                                                          | 🌳 **Workspace Organization**                                                                                                                                                                                                                                         |
| • View time entries for tasks<br>• Start/stop time tracking on tasks<br>• Add manual time entries<br>• Delete time entries<br>• View currently running timer<br>• Track billable and non-billable time                                 | • Navigate spaces, folders, and lists<br>• Create and manage folders<br>• Organize lists within spaces<br>• Create lists in folders<br>• View workspace hierarchy<br>• Efficient path navigation                                             |
| 📄 **Document Management**                                                                                                                                                                                                                                      | 👥 **Member Management**                                                                                                                                                                                                                                             |
| • Document Listing through all workspace<br>• Document Page listing<br>• Document Page Details<br>• Document Creation<br>• Document page update (append & prepend)                                                                       | • Find workspace members by name or email<br>• Resolve assignees for tasks<br>• View member details and permissions<br>• Assign tasks to users during creation<br>• Support for user IDs, emails, or usernames<br>• Team-wide user management                            |
| ⚡ **Integration Features**                                                                                                                                                                                                                                      |                                                                                                                                                                                                                                                                            |
| • Global name or ID-based lookups<br>• Case-insensitive matching<br>• Markdown formatting support<br>• Built-in rate limiting<br>• Error handling and validation<br>• Comprehensive API coverage                                             |                                                                                                                                                                                                                                                                            |

## Available Tools

| Tool                                                               | Description                     | Required Parameters                                                                                                          |
| ------------------------------------------------------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [get_workspace_hierarchy](docs/api-reference.md#workspace-navigation) | Get workspace structure         | None                                                                                                                         |
| [create_task](docs/api-reference.md#task-management)                  | Create a task                   | `name`, (`listId`/`listName`)                                                                                          |
| [create_bulk_tasks](docs/api-reference.md#task-management)            | Create multiple tasks           | `tasks[]`                                                                                                                  |
| [update_task](docs/api-reference.md#task-management)                  | Modify task                     | `taskId`/`taskName`                                                                                                      |
| [update_bulk_tasks](docs/api-reference.md#task-management)            | Update multiple tasks           | `tasks[]` with IDs or names                                                                                                |
| [get_tasks](docs/api-reference.md#task-management)                    | Get tasks from list             | `listId`/`listName`                                                                                                      |
| [get_task](docs/api-reference.md#task-management)                     | Get single task details         | `taskId`/`taskName` (with smart disambiguation)                                                                          |
| [get_workspace_tasks](docs/api-reference.md#task-management)          | Get tasks with filtering        | At least one filter (tags, list_ids, space_ids, etc.)                                                                        |
| [get_task_comments](docs/api-reference.md#task-management)            | Get comments on a task          | `taskId`/`taskName`                                                                                                      |
| [create_task_comment](docs/api-reference.md#task-management)          | Add a comment to a task         | `commentText`, (`taskId`/(`taskName`+`listName`))                                                                    |
| [attach_task_file](docs/api-reference.md#task-management)             | Attach file to a task           | `taskId`/`taskName`, (`file_data` or `file_url`)                                                                     |
| [delete_task](docs/api-reference.md#task-management)                  | Remove task                     | `taskId`/`taskName`                                                                                                      |
| [delete_bulk_tasks](docs/api-reference.md#task-management)            | Remove multiple tasks           | `tasks[]` with IDs or names                                                                                                |
| [move_task](docs/api-reference.md#task-management)                    | Move task                       | `taskId`/`taskName`, `listId`/`listName`                                                                             |
| [move_bulk_tasks](docs/api-reference.md#task-management)              | Move multiple tasks             | `tasks[]` with IDs or names, target list                                                                                   |
| [duplicate_task](docs/api-reference.md#task-management)               | Copy task                       | `taskId`/`taskName`, `listId`/`listName`                                                                             |
| [create_list](docs/api-reference.md#list-management)                  | Create list in space            | `name`, `spaceId`/`spaceName`                                                                                          |
| [create_folder](docs/api-reference.md#folder-management)              | Create folder                   | `name`, `spaceId`/`spaceName`                                                                                          |
| [create_list_in_folder](docs/api-reference.md#list-management)        | Create list in folder           | `name`, `folderId`/`folderName`                                                                                        |
| [get_folder](docs/api-reference.md#folder-management)                 | Get folder details              | `folderId`/`folderName`                                                                                                  |
| [update_folder](docs/api-reference.md#folder-management)              | Update folder properties        | `folderId`/`folderName`                                                                                                  |
| [delete_folder](docs/api-reference.md#folder-management)              | Delete folder                   | `folderId`/`folderName`                                                                                                  |
| [get_list](docs/api-reference.md#list-management)                     | Get list details                | `listId`/`listName`                                                                                                      |
| [update_list](docs/api-reference.md#list-management)                  | Update list properties          | `listId`/`listName`                                                                                                      |
| [delete_list](docs/api-reference.md#list-management)                  | Delete list                     | `listId`/`listName`                                                                                                      |
| [get_space_tags](docs/api-reference.md#tag-management)                | Get space tags                  | `spaceId`/`spaceName`                                                                                                    |
| [create_space_tag](docs/api-reference.md#tag-management)              | Create tag                      | `tagName`, `spaceId`/`spaceName`                                                                                       |
| [update_space_tag](docs/api-reference.md#tag-management)              | Update tag                      | `tagName`, `spaceId`/`spaceName`                                                                                       |
| [delete_space_tag](docs/api-reference.md#tag-management)              | Delete tag                      | `tagName`, `spaceId`/`spaceName`                                                                                       |
| [add_tag_to_task](docs/api-reference.md#tag-management)               | Add tag to task                 | `tagName`, `taskId`/(`taskName`+`listName`)                                                                          |
| [remove_tag_from_task](docs/api-reference.md#tag-management)          | Remove tag from task            | `tagName`, `taskId`/(`taskName`+`listName`)                                                                          |
| [get_task_time_entries](docs/api-reference.md#time-tracking)          | Get time entries for a task     | `taskId`/`taskName`                                                                                                      |
| [start_time_tracking](docs/api-reference.md#time-tracking)            | Start time tracking on a task   | `taskId`/`taskName`                                                                                                      |
| [stop_time_tracking](docs/api-reference.md#time-tracking)             | Stop current time tracking      | None                                                                                                                         |
| [add_time_entry](docs/api-reference.md#time-tracking)                 | Add manual time entry to a task | `taskId`/`taskName`, `start`, `duration`                                                                             |
| [delete_time_entry](docs/api-reference.md#time-tracking)              | Delete a time entry             | `timeEntryId`                                                                                                              |
| [get_current_time_entry](docs/api-reference.md#time-tracking)         | Get currently running timer     | None                                                                                                                         |
| [get_workspace_members](docs/api-reference.md#member-management)      | Get all workspace members       | None                                                                                                                         |
| [find_member_by_name](docs/api-reference.md#member-management)        | Find member by name or email    | `nameOrEmail`                                                                                                               |
| [resolve_assignees](docs/api-reference.md#member-management)          | Resolve member names to IDs     | `assignees[]`                                                                                                              |
| [create_document](docs/api-reference.md#document-management)          | Create a document               | `workspaceId`, `name`, `parentId`/`parentType`, `visibility`, `create_pages`                                     |
| [get_document](docs/api-reference.md#document-management)             | Get a document                  | `workspaceId`/`documentId`                                                                                               |
| [list_documents](docs/api-reference.md#document-management)           | List documents                  | `workspaceId`, `documentId`/`creator`/`deleted`/`archived`/`parent_id`/`parent_type`/`limit`/`next_cursor` |
| [list_document_pages](docs/api-reference.md#document-management)      | List document pages             | `documentId`/`documentName`                                                                                              |
| [get_document_pages](docs/api-reference.md#document-management)       | Get document pages              | `documentId`/`documentName`, `pageIds`                                                                                 |
| [create_document_pages](docs/api-reference.md#document-management)    | Create a document page          | `workspaceId`/`documentId`, `parent_page_id`/`name`/`sub_title`,`content`/`content_format`                     |
| [update_document_page](docs/api-reference.md#document-management)     | Update a document page          | `workspaceId`/`documentId`, `name`/`sub_title`,`content`/`content_edit_mode`/`content_format`                  |

See [full documentation](docs/api-reference.md) for optional parameters and advanced usage.

## Member Management Tools

When creating tasks, you can now assign users using the `assignees` parameter. The parameter accepts an array of user IDs, emails, or usernames:

```json
{
  "name": "New Task",
  "description": "This is a new task.",
  "assignees": ["jdoe@example.com", "Jane Smith"]  // Emails, usernames, or user IDs
}
```

The member management tools help resolve user references when needed.

## Prompts

Not yet implemented and not supported by all client apps. Request a feature for a Prompt implementation that would be most beneficial for your workflow (without it being too specific). Examples:

| Prompt                                             | Purpose                   | Features                                  |
| -------------------------------------------------- | ------------------------- | ----------------------------------------- |
| [summarize_tasks](docs/api-reference.md#prompts)      | Task overview             | Status summary, priorities, relationships |
| [analyze_priorities](docs/api-reference.md#prompts)   | Priority optimization     | Distribution analysis, sequencing         |
| [generate_description](docs/api-reference.md#prompts) | Task description creation | Objectives, criteria, dependencies        |

## Error Handling

The server provides clear error messages for:

- Missing required parameters
- Invalid IDs or names
- Items not found
- Permission issues
- API errors
- Rate limiting

The `LOG_LEVEL` environment variable can be specified to control the verbosity of server logs. Valid values are `trace`, `debug`, `info`, `warn`, and `error` (default).
This can be also be specified on the command line as, e.g. `--env LOG_LEVEL=info`.

## Support the Developer

When using this server, you may occasionally see a small sponsor message with a link to this repository included in tool responses. I hope you can support the project!
If you find this project useful, please consider supporting:

[![Sponsor TaazKareem](https://img.shields.io/badge/Sponsor-TaazKareem-orange?logo=github)](https://github.com/sponsors/TaazKareem)

<a href="https://buymeacoffee.com/taazkareem">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width="200" alt="Buy Me A Coffee">
</a>

## Acknowledgements

Special thanks to [ClickUp](https://clickup.com) for their excellent API and services that make this integration possible.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This software makes use of third-party APIs and may reference trademarks
or brands owned by third parties. The use of such APIs or references does not imply
any affiliation with or endorsement by the respective companies. All trademarks and
brand names are the property of their respective owners. This project is an independent
work and is not officially associated with or sponsored by any third-party company mentioned.
