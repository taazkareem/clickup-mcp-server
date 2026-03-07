[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# Persona Configurations

To help AI agents focus on their specific tasks, you can limit the MCP tools they have access to. We provide pre-packaged preset configurations—or "personas"—that you can apply via the `ENABLED_TOOLS`/`DISABLED_TOOLS` environment variable or `X-Enabled-Tools`/`X-Disabled-Tools` HTTP header.

## Persona Matrix (All 48 Tools)

| Category & Tool | Auditor | Task Worker | Time Specialist | Project Manager | Content Manager | Safe Power User |
|:---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Workspace** | | | | | | |
| `get_workspace_hierarchy` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `get_workspace_members` | ✅ | | | ✅ | | ✅ |
| `find_member_by_name` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Tasks** | | | | | | |
| `create_task` | | ✅ | | ✅ | | ✅ |
| `get_task` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `update_task` | | ✅ | | ✅ | | ✅ |
| `move_task` | | ✅ | | | | ✅ |
| `duplicate_task` | | ✅ | | | | ✅ |
| `delete_task` | | ✅ | | | | |
| `get_workspace_tasks` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `manage_comments` | ✅ | ✅ | | | ✅ | ✅ |
| `attach_task_file` | | ✅ | | | | ✅ |
| `add_task_to_list` | | ✅ | | | | ✅ |
| `remove_task_from_list` | | ✅ | | | | ✅ |
| `create_bulk_tasks` | | | | ✅ | | ✅ |
| `update_bulk_tasks` | | | | ✅ | | ✅ |
| `move_bulk_tasks` | | | | ✅ | | ✅ |
| `delete_bulk_tasks` | | | | ✅ | | |
| `add_task_link` | | ✅ | | | | ✅ |
| `get_task_links` | ✅ | ✅ | | | | ✅ |
| `delete_task_link` | | ✅ | | | | |
| `add_task_dependency` | | ✅ | | ✅ | | ✅ |
| `delete_task_dependency` | | ✅ | | ✅ | | |
| **Checklists** | | | | | | |
| `manage_checklists` | | ✅ | | | | ✅ |
| **Lists** | | | | | | |
| `manage_lists` | ✅ | ✅ | | ✅ | | ✅ |
| **Custom Fields** | | | | | | |
| `manage_custom_fields` | ✅ | ✅ | | ✅ | | ✅ |
| **Spaces** | | | | | | |
| `manage_spaces` | ✅ | | | ✅ | | ✅ |
| **Goals** | | | | | | |
| `manage_goals` | ✅ | ✅ | | ✅ | | ✅ |
| **Views** | | | | | | |
| `manage_views` | ✅ | ✅ | | ✅ | ✅ | ✅ |
| **Folders** | | | | | | |
| `manage_folders` | ✅ | ✅ | | ✅ | | ✅ |
| **Tags** | | | | | | |
| `manage_space_tags` | | | | ✅ | | ✅ |
| `add_tag_to_task` | | ✅ | | | | ✅ |
| `remove_tag_from_task` | | ✅ | | | | ✅ |
| **Time Tracking** | | | | | | |
| `manage_time_entries` | ✅ | ✅ | ✅ | | | ✅ |
| **Docs** | | | | | | |
| `create_document` | | | | | ✅ | ✅ |
| `get_document` | ✅ | | | | ✅ | ✅ |
| `list_documents` | ✅ | | | | ✅ | ✅ |
| `list_document_pages` | ✅ | | | | ✅ | ✅ |
| `get_document_pages` | ✅ | | | | ✅ | ✅ |
| `create_document_page` | | | | | ✅ | ✅ |
| `update_document_page` | | | | | ✅ | ✅ |
| **Chat** | | | | | | |
| `manage_chat_channels` | ✅ | | | | ✅ | ✅ |
| `manage_chat_messages` | ✅ | | | | ✅ | ✅ |
| **Webhooks** | | | | | | |
| `manage_webhooks` | | ✅ | | ✅ | | ✅ |
| **User Groups** | | | | | | |
| `manage_user_groups` | ✅ | ✅ | | ✅ | | ✅ |
| **Task Templates** | | | | | | |
| `get_task_templates` | ✅ | ✅ | | ✅ | | ✅ |
| `create_task_from_template` | | ✅ | | ✅ | | ✅ |
| **Feedback** | | | | | | |
| `submit_feedback` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Configuration Values

#### 1. Auditor
Read-only access across the entire workspace (including goals and docs).
**Value:** `get_workspace_hierarchy,get_workspace_members,find_member_by_name,get_task,get_workspace_tasks,manage_comments,get_task_links,manage_lists,manage_custom_fields,manage_spaces,manage_goals,manage_views,manage_folders,manage_time_entries,get_document,list_documents,list_document_pages,get_document_pages,manage_chat_channels,manage_chat_messages,get_task_templates,manage_user_groups,submit_feedback`

#### 2. Task Worker
Full task lifecycle management, checklists, time tracking, and tags. No structural changes (spaces) or document editing.
**Value:** `get_workspace_hierarchy,find_member_by_name,create_task,get_task,update_task,manage_custom_fields,move_task,duplicate_task,delete_task,get_workspace_tasks,manage_comments,attach_task_file,add_task_to_list,remove_task_from_list,add_task_link,get_task_links,delete_task_link,add_task_dependency,delete_task_dependency,manage_checklists,manage_lists,manage_goals,manage_views,manage_folders,add_tag_to_task,remove_tag_from_task,manage_time_entries,get_task_templates,create_task_from_template,manage_webhooks,manage_user_groups,submit_feedback`

#### 3. Time Specialist
Dedicated to logging time and reviewing timesheets.
**Value:** `get_workspace_hierarchy,find_member_by_name,get_task,get_workspace_tasks,manage_time_entries,submit_feedback`

#### 4. Project Manager
Workspace building and alignment. Creates spaces, folders, lists, and goals. Handles bulk task operations and templates.
**Value:** `get_workspace_hierarchy,get_workspace_members,find_member_by_name,create_task,get_task,update_task,get_workspace_tasks,create_bulk_tasks,update_bulk_tasks,move_bulk_tasks,delete_bulk_tasks,manage_lists,manage_custom_fields,manage_spaces,manage_goals,manage_views,manage_folders,manage_space_tags,add_task_dependency,delete_task_dependency,get_task_templates,create_task_from_template,manage_webhooks,manage_user_groups,submit_feedback`

#### 5. Content Manager
Managing text, wikis, and team communications in Docs and Chat.
**Value:** `get_workspace_hierarchy,find_member_by_name,get_task,get_workspace_tasks,manage_comments,manage_views,create_document,get_document,list_documents,list_document_pages,get_document_pages,create_document_page,update_document_page,manage_chat_channels,manage_chat_messages,submit_feedback`

#### 6. Safe Power User
Enables all 48 tools except standalone destructive deletion tools. Note: consolidated tools (`manage_lists`, `manage_folders`, `manage_checklists`) include delete actions internally — use system prompts to instruct the agent to avoid destructive actions if needed. Set using `DISABLED_TOOLS`.
**Disabled Value:** `delete_task,delete_bulk_tasks,delete_task_link,delete_task_dependency`
