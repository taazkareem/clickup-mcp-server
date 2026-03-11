[← Back to Documentation Index](../DOCUMENTATION.md)  
[← Back to README](../../README.md)

# Persona Configurations

To help AI agents focus on their specific tasks, you can limit the MCP tools they have access to. We provide pre-packaged preset configurations—or "personas"—that you can apply via the `CLICKUP_MCP_PERSONA` environment variable or `X-Persona` HTTP header. 

Alternatively, if you want to build a custom configuration, you can use the raw comma-separated lists below with the `ENABLED_TOOLS`/`DISABLED_TOOLS` environment variable or `X-Enabled-Tools`/`X-Disabled-Tools` HTTP header.

## Configuration Values

### 1. Auditor
Read-only access across the entire workspace (including goals and docs).
**Value:**
```text
get_workspace,get_workspace_seats,get_audit_logs,get_task,get_workspace_tasks,get_comments,get_comment_replies,get_comment_subtypes,get_task_links,list_attachments,get_attachment,get_active_sprint,list_sprints,get_sprint_tasks,list_lists,get_list,list_custom_fields,list_spaces,get_space,list_goals,get_goal,list_views,get_view,get_view_tasks,get_folder,list_space_tags,get_time_entries,get_current_time_entry,get_time_entry_tags,get_time_entry_history,get_time_in_status,list_documents,get_document,list_document_pages,get_document_page,get_document_pages,list_chat_channels,get_chat_channel,get_chat_channel_members,get_chat_channel_followers,get_chat_messages,get_chat_message_replies,get_chat_reactions,get_chat_tagged_users,get_chat_message_subtypes,list_webhooks,list_user_groups,get_guest,get_task_templates,submit_feedback
```

### 2. Task Worker
Full task lifecycle management, checklists, time tracking, and tags. No structural workspace changes (spaces).
**Value:**
```text
get_workspace,create_task,get_task,update_task,move_task,duplicate_task,delete_task,add_task_to_list,remove_task_from_list,get_workspace_tasks,get_comments,create_comment,update_comment,delete_comment,get_comment_replies,create_comment_reply,add_comment_reaction,remove_comment_reaction,get_comment_subtypes,add_task_link,get_task_links,delete_task_link,add_task_dependency,delete_task_dependency,list_attachments,get_attachment,upload_attachment,create_checklist,edit_checklist,delete_checklist,create_checklist_item,edit_checklist_item,delete_checklist_item,get_active_sprint,list_sprints,get_sprint_tasks,list_custom_fields,set_custom_field_value,remove_custom_field_value,list_views,get_view,get_view_tasks,add_tag_to_task,remove_tag_from_task,get_time_entries,get_current_time_entry,start_time_entry,stop_time_entry,add_time_entry,update_time_entry,delete_time_entry,get_time_entry_tags,add_time_entry_tags,update_time_entry_tags,delete_time_entry_tags,get_time_entry_history,get_time_in_status,get_task_templates,create_task_from_template,submit_feedback
```

### 3. Time Specialist
Dedicated to logging time and reviewing timesheets.
**Value:**
```text
get_workspace,get_task,get_workspace_tasks,get_time_entries,get_current_time_entry,start_time_entry,stop_time_entry,add_time_entry,update_time_entry,delete_time_entry,get_time_entry_tags,add_time_entry_tags,update_time_entry_tags,delete_time_entry_tags,get_time_entry_history,get_time_in_status,submit_feedback
```

### 4. Project Manager
Workspace building, alignment, and oversight. Creates spaces, folders, lists, and goals. Handles bulk operations, templates, and communication (comments/attachments).
**Value:**
```text
get_workspace,get_workspace_seats,create_task,get_task,update_task,get_workspace_tasks,create_bulk_tasks,update_bulk_tasks,move_bulk_tasks,delete_bulk_tasks,add_task_dependency,delete_task_dependency,get_active_sprint,list_sprints,get_sprint_tasks,list_lists,get_list,create_list,update_list,delete_list,move_list,set_list_permissions,list_custom_fields,create_custom_field,set_custom_field_value,remove_custom_field_value,list_spaces,get_space,create_space,update_space,delete_space,set_space_permissions,list_goals,get_goal,create_goal,update_goal,delete_goal,create_key_result,update_key_result,delete_key_result,list_views,get_view,create_view,update_view,delete_view,get_view_tasks,get_folder,create_folder,update_folder,delete_folder,move_folder,set_folder_permissions,list_space_tags,create_space_tag,update_space_tag,delete_space_tag,list_webhooks,create_webhook,update_webhook,delete_webhook,list_user_groups,create_user_group,update_user_group,delete_user_group,get_task_templates,create_task_from_template,submit_feedback,create_comment,update_comment,delete_comment,get_comments,get_comment_replies,upload_attachment,list_attachments,get_attachment
```

### 5. Content Manager
Managing text, wikis, team communications, and attachments in Docs, Chat, and Tasks.
**Value:**
```text
get_workspace,get_task,get_workspace_tasks,get_comments,create_comment,update_comment,delete_comment,get_comment_replies,create_comment_reply,add_comment_reaction,remove_comment_reaction,get_comment_subtypes,list_attachments,get_attachment,upload_attachment,list_views,get_view,create_view,update_view,delete_view,get_view_tasks,list_documents,get_document,create_document,list_document_pages,get_document_page,get_document_pages,create_document_page,update_document_page,list_chat_channels,get_chat_channel,create_chat_channel,update_chat_channel,delete_chat_channel,get_chat_channel_members,get_chat_channel_followers,create_chat_dm,get_chat_messages,create_chat_message,update_chat_message,delete_chat_message,get_chat_message_replies,create_chat_message_reply,add_chat_reaction,remove_chat_reaction,get_chat_reactions,get_chat_tagged_users,get_chat_message_subtypes,submit_feedback
```

### 6. Workspace Admin
Administrative control focus. Manages structure (Spaces, Folders, Lists), permissions, custom fields, guest access, and audit logs.
**Value:**
```text
get_workspace,get_workspace_seats,get_workspace_tasks,get_audit_logs,list_spaces,get_space,create_space,update_space,delete_space,set_space_permissions,get_folder,create_folder,update_folder,delete_folder,move_folder,set_folder_permissions,list_lists,get_list,create_list,update_list,delete_list,move_list,set_list_permissions,list_webhooks,create_webhook,update_webhook,delete_webhook,list_user_groups,create_user_group,update_user_group,delete_user_group,invite_guest,get_guest,edit_guest,remove_guest,add_guest_to_task,remove_guest_from_task,add_guest_to_list,remove_guest_from_list,add_guest_to_folder,remove_guest_from_folder,list_custom_fields,create_custom_field,submit_feedback
```

### 7. Developer / Integrator
Programmatic focus. Manages webhooks, custom fields, bulk automation, audit logs, and file integrations (attachments).
**Value:**
```text
get_workspace,get_task,create_task,update_task,delete_task,get_workspace_tasks,create_bulk_tasks,update_bulk_tasks,move_bulk_tasks,delete_bulk_tasks,list_custom_fields,create_custom_field,set_custom_field_value,remove_custom_field_value,list_webhooks,create_webhook,update_webhook,delete_webhook,get_audit_logs,upload_attachment,submit_feedback
```

### 8. Safe Power User
Enables all functionality except destructive operations. Protects against accidental deletion of tasks, spaces, folders, lists, documents, and other structural data.
**Disabled Value:**
```text
delete_task,delete_bulk_tasks,delete_task_link,delete_task_dependency,delete_space,delete_folder,delete_list,delete_goal,delete_key_result,delete_view,delete_space_tag,delete_chat_channel,delete_user_group,delete_webhook,delete_checklist,delete_checklist_item,delete_comment,delete_chat_message,delete_time_entry,delete_time_entry_tags,remove_guest,remove_guest_from_task,remove_guest_from_list,remove_guest_from_folder
```