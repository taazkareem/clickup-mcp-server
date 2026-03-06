[← Back to Documentation Index](../DOCUMENTATION.md)  
[← Back to README](../../README.md)  

# 🎭 Persona Configurations

To help AI agents focus on their specific tasks, you can limit the MCP tools they have access to. We provide pre-packaged preset configurations—or "personas"—that you can apply via the `ENABLED_TOOLS`/`DISABLED_TOOLS` environment variable or `X-Enabled-Tools`/`X-Disabled-Tools` HTTP header.

## Persona Matrix (All 67 Tools)

| Category & Tool | 📋 Auditor | 👷 Task Worker | ⏱️ Time Specialist | 🏗️ Project Manager | 📚 Content Manager | 🛡️ Safe Power User |
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
| `get_task_comments` | ✅ | ✅ | | | ✅ | ✅ |
| `create_task_comment` | | ✅ | | | ✅ | ✅ |
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
| `create_checklist` | | ✅ | | | | ✅ |
| `edit_checklist` | | ✅ | | | | ✅ |
| `delete_checklist` | | ✅ | | | | |
| `create_checklist_item` | | ✅ | | | | ✅ |
| `edit_checklist_item` | | ✅ | | | | ✅ |
| `delete_checklist_item` | | ✅ | | | | |
| **Lists** | | | | | | |
| `create_list` | | | | ✅ | | ✅ |
| `create_list_in_folder` | | | | ✅ | | ✅ |
| `get_list` | ✅ | ✅ | | ✅ | | ✅ |
| `update_list` | | | | ✅ | | ✅ |
| `move_list` | | | | ✅ | | ✅ |
| `delete_list` | | | | ✅ | | |
| **Custom Fields** | | | | | | |
| `manage_custom_fields` | ✅ | ✅ | | ✅ | | ✅ |
| **Spaces** | | | | | | |
| `manage_spaces` | ✅ | | | ✅ | | ✅ |
| **Goals** | | | | | | |
| `manage_goals` | ✅ | ✅ | | ✅ | | ✅ |
| **Views** | | | | | | |
| `manage_views` | ✅ | ✅ | | ✅ | ✅ | ✅ |
| **Folders** | | | | | | |
| `create_folder` | | | | ✅ | | ✅ |
| `get_folder` | ✅ | ✅ | | ✅ | | ✅ |
| `update_folder` | | | | ✅ | | ✅ |
| `move_folder` | | | | ✅ | | ✅ |
| `delete_folder` | | | | ✅ | | |
| **Tags** | | | | | | |
| `manage_space_tags` | | | | ✅ | | ✅ |
| `add_tag_to_task` | | ✅ | | | | ✅ |
| `remove_tag_from_task` | | ✅ | | | | ✅ |
| **Time Tracking** | | | | | | |
| `get_task_time_entries` | ✅ | | ✅ | | | ✅ |
| `get_workspace_time_entries` | ✅ | | ✅ | | | ✅ |
| `start_time_tracking` | | ✅ | ✅ | | | ✅ |
| `stop_time_tracking` | | ✅ | ✅ | | | ✅ |
| `add_time_entry` | | | ✅ | | | ✅ |
| `delete_time_entry` | | | ✅ | | | |
| `get_current_time_entry` | ✅ | | ✅ | | | ✅ |
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
| **Task Templates** | | | | | | |
| `get_task_templates` | ✅ | ✅ | | ✅ | | ✅ |
| `create_task_from_template` | | ✅ | | ✅ | | ✅ |
| **Feedback** | | | | | | |
| `submit_feedback` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Configuration Values

#### 1. 📋 Auditor
Read-only access across the entire workspace (including goals and docs).
**Value:** `get_workspace_hierarchy,get_workspace_members,find_member_by_name,get_task,get_workspace_tasks,get_task_comments,get_task_links,get_list,manage_custom_fields,manage_spaces,manage_goals,manage_views,get_folder,get_task_time_entries,get_workspace_time_entries,get_current_time_entry,get_document,list_documents,list_document_pages,get_document_pages,manage_chat_channels,manage_chat_messages,get_task_templates,submit_feedback`

#### 2. 👷 Task Worker
Full task lifecycle management, checklists, time tracking, and tags. No structural changes (spaces/folders/lists) or document editing.
**Value:** `get_workspace_hierarchy,find_member_by_name,create_task,get_task,update_task,manage_custom_fields,move_task,duplicate_task,delete_task,get_workspace_tasks,get_task_comments,create_task_comment,attach_task_file,add_task_to_list,remove_task_from_list,add_task_link,get_task_links,delete_task_link,add_task_dependency,delete_task_dependency,create_checklist,edit_checklist,delete_checklist,create_checklist_item,edit_checklist_item,delete_checklist_item,get_list,manage_goals,manage_views,get_folder,add_tag_to_task,remove_tag_from_task,start_time_tracking,stop_time_tracking,get_task_templates,create_task_from_template,submit_feedback`

#### 3. ⏱️ Time Specialist
Dedicated to logging time and reviewing timesheets.
**Value:** `get_workspace_hierarchy,find_member_by_name,get_task,get_workspace_tasks,get_task_time_entries,get_workspace_time_entries,start_time_tracking,stop_time_tracking,add_time_entry,delete_time_entry,get_current_time_entry,submit_feedback`

#### 4. 🏗️ Project Manager
Workspace building and alignment. Creates spaces, folders, lists, and goals. Handles bulk task operations and templates.
**Value:** `get_workspace_hierarchy,get_workspace_members,find_member_by_name,create_task,get_task,update_task,get_workspace_tasks,create_bulk_tasks,update_bulk_tasks,move_bulk_tasks,delete_bulk_tasks,create_list,create_list_in_folder,get_list,update_list,move_list,delete_list,manage_custom_fields,manage_spaces,manage_goals,manage_views,create_folder,get_folder,update_folder,move_folder,delete_folder,manage_space_tags,add_task_dependency,delete_task_dependency,get_task_templates,create_task_from_template,submit_feedback`

#### 5. 📚 Content Manager
Managing text, wikis, and team communications in Docs and Chat.
**Value:** `get_workspace_hierarchy,find_member_by_name,get_task,get_workspace_tasks,get_task_comments,create_task_comment,manage_views,create_document,get_document,list_documents,list_document_pages,get_document_pages,create_document_page,update_document_page,manage_chat_channels,manage_chat_messages,submit_feedback`

#### 6. 🛡️ Safe Power User
Has access to 58 out of 67 tools. Only destructive deletion tools are removed. Set using `DISABLED_TOOLS`.
**Disabled Value:** `delete_task,delete_bulk_tasks,delete_task_link,delete_task_dependency,delete_checklist,delete_checklist_item,delete_list,delete_folder,delete_time_entry`