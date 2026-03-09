[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# Persona Configurations

To help AI agents focus on their specific tasks, you can limit the MCP tools they have access to. We provide pre-packaged preset configurations—or "personas"—that you can apply via the `ENABLED_TOOLS`/`DISABLED_TOOLS` environment variable or `X-Enabled-Tools`/`X-Disabled-Tools` HTTP header.

## Persona Matrix (All 145 Tools)

| Category & Tool | Auditor | Task Worker | Time Specialist | Project Manager | Content Manager | Safe Power User |
|:---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Workspace** | | | | | | |
| `get_workspace` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Tasks** | | | | | | |
| `create_task` | | ✅ | | ✅ | | ✅ |
| `get_task` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `update_task` | | ✅ | | ✅ | | ✅ |
| `move_task` | | ✅ | | | | ✅ |
| `duplicate_task` | | ✅ | | | | ✅ |
| `delete_task` | | ✅ | | | | |
| `get_workspace_tasks` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `get_comments` | ✅ | ✅ | | | ✅ | ✅ |
| `create_comment` | | ✅ | | | ✅ | ✅ |
| `update_comment` | | ✅ | | | ✅ | ✅ |
| `delete_comment` | | ✅ | | | ✅ | ✅ |
| `get_comment_replies` | ✅ | ✅ | | | ✅ | ✅ |
| `create_comment_reply` | | ✅ | | | ✅ | ✅ |
| `add_comment_reaction` | | ✅ | | | ✅ | ✅ |
| `remove_comment_reaction` | | ✅ | | | ✅ | ✅ |
| `get_comment_subtypes` | ✅ | ✅ | | | ✅ | ✅ |
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
| **Attachments** | | | | | | |
| `list_attachments` | | ✅ | | | | ✅ |
| `get_attachment` | | ✅ | | | | ✅ |
| `upload_attachment` | | ✅ | | | | ✅ |
| **Checklists** | | | | | | |
| `create_checklist` | | ✅ | | | | ✅ |
| `edit_checklist` | | ✅ | | | | ✅ |
| `delete_checklist` | | ✅ | | | | ✅ |
| `create_checklist_item` | | ✅ | | | | ✅ |
| `edit_checklist_item` | | ✅ | | | | ✅ |
| `delete_checklist_item` | | ✅ | | | | ✅ |
| **Sprints** | | | | | | |
| `get_active_sprint` | | ✅ | | ✅ | | ✅ |
| `list_sprints` | | ✅ | | ✅ | | ✅ |
| `get_sprint_tasks` | | ✅ | | ✅ | | ✅ |
| **Lists** | | | | | | |
| `list_lists` | ✅ | ✅ | | ✅ | | ✅ |
| `get_list` | ✅ | ✅ | | ✅ | | ✅ |
| `create_list` | | ✅ | | ✅ | | ✅ |
| `update_list` | | ✅ | | ✅ | | ✅ |
| `delete_list` | | ✅ | | ✅ | | ✅ |
| `move_list` | | ✅ | | ✅ | | ✅ |
| `set_list_permissions` | | ✅ | | ✅ | | ✅ |
| **Custom Fields** | | | | | | |
| `list_custom_fields` | ✅ | ✅ | | ✅ | | ✅ |
| `create_custom_field` | | ✅ | | ✅ | | ✅ |
| `set_custom_field_value` | | ✅ | | ✅ | | ✅ |
| `remove_custom_field_value` | | ✅ | | ✅ | | ✅ |
| **Spaces** | | | | | | |
| `list_spaces` | ✅ | | | ✅ | | ✅ |
| `get_space` | ✅ | | | ✅ | | ✅ |
| `create_space` | | | | ✅ | | ✅ |
| `update_space` | | | | ✅ | | ✅ |
| `delete_space` | | | | ✅ | | ✅ |
| `set_space_permissions` | | | | ✅ | | ✅ |
| **Goals** | | | | | | |
| `list_goals` | ✅ | ✅ | | ✅ | | ✅ |
| `get_goal` | ✅ | ✅ | | ✅ | | ✅ |
| `create_goal` | | ✅ | | ✅ | | ✅ |
| `update_goal` | | ✅ | | ✅ | | ✅ |
| `delete_goal` | | ✅ | | ✅ | | ✅ |
| `create_key_result` | | ✅ | | ✅ | | ✅ |
| `update_key_result` | | ✅ | | ✅ | | ✅ |
| `delete_key_result` | | ✅ | | ✅ | | ✅ |
| **Views** | | | | | | |
| `list_views` | ✅ | ✅ | | ✅ | ✅ | ✅ |
| `get_view` | ✅ | ✅ | | ✅ | ✅ | ✅ |
| `create_view` | | ✅ | | ✅ | ✅ | ✅ |
| `update_view` | | ✅ | | ✅ | ✅ | ✅ |
| `delete_view` | | ✅ | | ✅ | ✅ | ✅ |
| `get_view_tasks` | ✅ | ✅ | | ✅ | ✅ | ✅ |
| **Folders** | | | | | | |
| `get_folder` | ✅ | ✅ | | ✅ | | ✅ |
| `create_folder` | | ✅ | | ✅ | | ✅ |
| `update_folder` | | ✅ | | ✅ | | ✅ |
| `delete_folder` | | ✅ | | ✅ | | ✅ |
| `move_folder` | | ✅ | | ✅ | | ✅ |
| `set_folder_permissions` | | ✅ | | ✅ | | ✅ |
| **Tags** | | | | | | |
| `list_space_tags` | | | | ✅ | | ✅ |
| `create_space_tag` | | | | ✅ | | ✅ |
| `update_space_tag` | | | | ✅ | | ✅ |
| `delete_space_tag` | | | | ✅ | | ✅ |
| `add_tag_to_task` | | ✅ | | | | ✅ |
| `remove_tag_from_task` | | ✅ | | | | ✅ |
| **Time Tracking** | | | | | | |
| `get_time_entries` | ✅ | ✅ | ✅ | | | ✅ |
| `get_current_time_entry` | ✅ | ✅ | ✅ | | | ✅ |
| `start_time_entry` | | ✅ | ✅ | | | ✅ |
| `stop_time_entry` | | ✅ | ✅ | | | ✅ |
| `add_time_entry` | | ✅ | ✅ | | | ✅ |
| `update_time_entry` | | ✅ | ✅ | | | ✅ |
| `delete_time_entry` | | ✅ | ✅ | | | ✅ |
| `get_time_entry_tags` | ✅ | ✅ | ✅ | | | ✅ |
| `add_time_entry_tags` | | ✅ | ✅ | | | ✅ |
| `update_time_entry_tags` | | ✅ | ✅ | | | ✅ |
| `delete_time_entry_tags` | | ✅ | ✅ | | | ✅ |
| `get_time_entry_history` | ✅ | ✅ | ✅ | | | ✅ |
| `get_time_in_status` | ✅ | ✅ | ✅ | | | ✅ |
| **Docs** | | | | | | |
| `list_documents` | ✅ | | | | ✅ | ✅ |
| `get_document` | ✅ | | | | ✅ | ✅ |
| `create_document` | | | | | ✅ | ✅ |
| `list_document_pages` | ✅ | | | | ✅ | ✅ |
| `get_document_page` | ✅ | | | | ✅ | ✅ |
| `get_document_pages` | ✅ | | | | ✅ | ✅ |
| `create_document_page` | | | | | ✅ | ✅ |
| `update_document_page` | | | | | ✅ | ✅ |
| **Chat** | | | | | | |
| `list_chat_channels` | ✅ | | | | ✅ | ✅ |
| `get_chat_channel` | ✅ | | | | ✅ | ✅ |
| `create_chat_channel` | | | | | ✅ | ✅ |
| `update_chat_channel` | | | | | ✅ | ✅ |
| `delete_chat_channel` | | | | | ✅ | ✅ |
| `get_chat_channel_members` | ✅ | | | | ✅ | ✅ |
| `get_chat_channel_followers` | ✅ | | | | ✅ | ✅ |
| `create_chat_dm` | | | | | ✅ | ✅ |
| `get_chat_messages` | ✅ | | | | ✅ | ✅ |
| `create_chat_message` | | | | | ✅ | ✅ |
| `update_chat_message` | | | | | ✅ | ✅ |
| `delete_chat_message` | | | | | ✅ | ✅ |
| `get_chat_message_replies` | ✅ | | | | ✅ | ✅ |
| `create_chat_message_reply` | | | | | ✅ | ✅ |
| `add_chat_reaction` | | | | | ✅ | ✅ |
| `remove_chat_reaction` | | | | | ✅ | ✅ |
| `get_chat_reactions` | ✅ | | | | ✅ | ✅ |
| `get_chat_tagged_users` | ✅ | | | | ✅ | ✅ |
| `get_chat_message_subtypes` | ✅ | | | | ✅ | ✅ |
| **Webhooks** | | | | | | |
| `list_webhooks` | | ✅ | | ✅ | | ✅ |
| `create_webhook` | | ✅ | | ✅ | | ✅ |
| `update_webhook` | | ✅ | | ✅ | | ✅ |
| `delete_webhook` | | ✅ | | ✅ | | ✅ |
| **User Groups** | | | | | | |
| `list_user_groups` | ✅ | ✅ | | ✅ | | ✅ |
| `create_user_group` | | ✅ | | ✅ | | ✅ |
| `update_user_group` | | ✅ | | ✅ | | ✅ |
| `delete_user_group` | | ✅ | | ✅ | | ✅ |
| **Task Templates** | | | | | | |
| `get_task_templates` | ✅ | ✅ | | ✅ | | ✅ |
| `create_task_from_template` | | ✅ | | ✅ | | ✅ |
| **Feedback** | | | | | | |
| `submit_feedback` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Configuration Values

#### 1. Auditor
Read-only access across the entire workspace (including goals and docs).
**Value:** `get_workspace,get_task,get_workspace_tasks,get_comments,get_comment_replies,get_comment_subtypes,get_task_links,list_lists,get_list,list_custom_fields,list_spaces,get_space,list_goals,get_goal,list_views,get_view,get_view_tasks,get_folder,get_time_entries,get_current_time_entry,get_time_entry_tags,get_time_entry_history,get_time_in_status,list_documents,get_document,list_document_pages,get_document_page,get_document_pages,list_chat_channels,get_chat_channel,get_chat_channel_members,get_chat_channel_followers,get_chat_messages,get_chat_message_replies,get_chat_reactions,get_chat_tagged_users,get_chat_message_subtypes,list_user_groups,get_task_templates,submit_feedback`

#### 2. Task Worker
Full task lifecycle management, checklists, time tracking, and tags. No structural workspace changes (spaces).
**Value:** `get_workspace,create_task,get_task,update_task,move_task,duplicate_task,delete_task,get_workspace_tasks,get_comments,create_comment,update_comment,delete_comment,get_comment_replies,create_comment_reply,add_comment_reaction,remove_comment_reaction,get_comment_subtypes,list_attachments,get_attachment,upload_attachment,add_task_to_list,remove_task_from_list,add_task_link,get_task_links,delete_task_link,add_task_dependency,delete_task_dependency,create_checklist,edit_checklist,delete_checklist,create_checklist_item,edit_checklist_item,delete_checklist_item,get_active_sprint,list_sprints,get_sprint_tasks,list_lists,get_list,create_list,update_list,delete_list,move_list,set_list_permissions,list_custom_fields,create_custom_field,set_custom_field_value,remove_custom_field_value,list_goals,get_goal,create_goal,update_goal,delete_goal,create_key_result,update_key_result,delete_key_result,list_views,get_view,create_view,update_view,delete_view,get_view_tasks,get_folder,create_folder,update_folder,delete_folder,move_folder,set_folder_permissions,add_tag_to_task,remove_tag_from_task,get_time_entries,get_current_time_entry,start_time_entry,stop_time_entry,add_time_entry,update_time_entry,delete_time_entry,get_time_entry_tags,add_time_entry_tags,update_time_entry_tags,delete_time_entry_tags,get_time_entry_history,get_time_in_status,list_webhooks,create_webhook,update_webhook,delete_webhook,list_user_groups,create_user_group,update_user_group,delete_user_group,get_task_templates,create_task_from_template,submit_feedback`

#### 3. Time Specialist
Dedicated to logging time and reviewing timesheets.
**Value:** `get_workspace,get_task,get_workspace_tasks,get_time_entries,get_current_time_entry,start_time_entry,stop_time_entry,add_time_entry,update_time_entry,delete_time_entry,get_time_entry_tags,add_time_entry_tags,update_time_entry_tags,delete_time_entry_tags,get_time_entry_history,get_time_in_status,submit_feedback`

#### 4. Project Manager
Workspace building and alignment. Creates spaces, folders, lists, and goals. Handles bulk task operations and templates.
**Value:** `get_workspace,create_task,get_task,update_task,get_workspace_tasks,create_bulk_tasks,update_bulk_tasks,move_bulk_tasks,delete_bulk_tasks,add_task_dependency,delete_task_dependency,get_active_sprint,list_sprints,get_sprint_tasks,list_lists,get_list,create_list,update_list,delete_list,move_list,set_list_permissions,list_custom_fields,create_custom_field,set_custom_field_value,remove_custom_field_value,list_spaces,get_space,create_space,update_space,delete_space,set_space_permissions,list_goals,get_goal,create_goal,update_goal,delete_goal,create_key_result,update_key_result,delete_key_result,list_views,get_view,create_view,update_view,delete_view,get_view_tasks,get_folder,create_folder,update_folder,delete_folder,move_folder,set_folder_permissions,list_space_tags,create_space_tag,update_space_tag,delete_space_tag,list_webhooks,create_webhook,update_webhook,delete_webhook,list_user_groups,create_user_group,update_user_group,delete_user_group,get_task_templates,create_task_from_template,submit_feedback`

#### 5. Content Manager
Managing text, wikis, and team communications in Docs and Chat.
**Value:** `get_workspace,get_task,get_workspace_tasks,get_comments,create_comment,update_comment,delete_comment,get_comment_replies,create_comment_reply,add_comment_reaction,remove_comment_reaction,get_comment_subtypes,list_views,get_view,create_view,update_view,delete_view,get_view_tasks,list_documents,get_document,create_document,list_document_pages,get_document_page,get_document_pages,create_document_page,update_document_page,list_chat_channels,get_chat_channel,create_chat_channel,update_chat_channel,delete_chat_channel,get_chat_channel_members,get_chat_channel_followers,create_chat_dm,get_chat_messages,create_chat_message,update_chat_message,delete_chat_message,get_chat_message_replies,create_chat_message_reply,add_chat_reaction,remove_chat_reaction,get_chat_reactions,get_chat_tagged_users,get_chat_message_subtypes,submit_feedback`

#### 6. Safe Power User
Enables all 145 tools except standalone destructive deletion tools. Set using `DISABLED_TOOLS`.
**Disabled Value:** `delete_task,delete_bulk_tasks,delete_task_link,delete_task_dependency`
