[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# Chat Management

19 atomic tools for sending messages, creating channels, and browsing message history in ClickUp Chat. Supports markdown formatting, @mentions, reactions, and threaded replies.

## Tool Reference

### Channel Tools (8)

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|---------------------|---------------------|
| `list_chat_channels` | List all channels in the workspace | — | `cursor`, `limit`, `detail_level`, `team_id` |
| `get_chat_channel` | Get a single channel | `channel_id` or `channel_name` | `team_id` |
| `create_chat_channel` | Create a new channel | `name` | `description`, `topic`, `visibility`, `space_id`/`spaceName`, `folder_id`/`folderName`, `list_id`/`listName`, `team_id` |
| `update_chat_channel` | Update a channel | `channel_id` or `channel_name` | `name`, `description`, `topic`, `visibility`, `team_id` |
| `delete_chat_channel` | Delete a channel | `channel_id` or `channel_name` | `team_id` |
| `get_chat_channel_members` | Get members of a channel | `channel_id` or `channel_name` | `cursor`, `limit`, `team_id` |
| `get_chat_channel_followers` | Get followers of a channel | `channel_id` or `channel_name` | `cursor`, `limit`, `team_id` |
| `create_chat_dm` | Create a direct message channel | `member_ids` | `team_id` |

### Message Tools (11)

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|---------------------|---------------------|
| `get_chat_messages` | Get messages from a channel | `channel_id` or `channel_name` | `cursor`, `limit`, `team_id` |
| `create_chat_message` | Send a message to a channel | `content`, `channel_id` or `channel_name` | `notify_all`, `type`, `post_title`, `subtype_id`, `subtype_name`, `team_id` |
| `update_chat_message` | Edit a message | `message_id`, `content` or `resolved` | `team_id` |
| `delete_chat_message` | Delete a message | `message_id` | `team_id` |
| `get_chat_message_replies` | Get threaded replies to a message | `message_id` | `cursor`, `limit`, `team_id` |
| `create_chat_message_reply` | Reply to a message in a thread | `message_id`, `content` | `team_id` |
| `add_chat_reaction` | Add an emoji reaction to a message | `message_id`, `reaction` | `team_id` |
| `remove_chat_reaction` | Remove an emoji reaction | `message_id`, `reaction` | `team_id` |
| `get_chat_reactions` | Get all reactions on a message | `message_id` | `team_id` |
| `get_chat_tagged_users` | Get users tagged in a message | `message_id` | `team_id` |
| `get_chat_message_subtypes` | Get post subtype IDs for the workspace | — | `comment_type`, `team_id` |

## Channel Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `channel_id` | string | Channel ID (preferred for get/update/delete/get_members) |
| `channel_name` | string | Channel name — auto-resolved to ID |
| `name` | string | Channel name. Required for `create_chat_channel` |
| `description` | string | Channel description. For create or update |
| `topic` | string | Channel topic. For create or update |
| `visibility` | string | `PUBLIC` or `PRIVATE`. For create or update |
| `space_id` | string | Space ID context. For `create_chat_channel` |
| `spaceName` | string | Space name (auto-resolved). For `create_chat_channel` |
| `folder_id` | string | Folder ID context. For `create_chat_channel` |
| `folderName` | string | Folder name (auto-resolved). For `create_chat_channel` |
| `list_id` | string | List ID context. For `create_chat_channel` |
| `listName` | string | List name (auto-resolved). For `create_chat_channel` |
| `member_ids` | integer[] | Array of member user IDs. Required for `create_chat_dm` |
| `cursor` | string | Pagination cursor. For list, get_members, or get_followers |
| `limit` | number | Max results (up to 100). For list, get_members, or get_followers |
| `detail_level` | string | `"names"` returns `{id, name}` only. `"detailed"` (default) returns full channel metadata. For `list_chat_channels`. |

## Message Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `channel_id` | string | Channel ID (preferred for get/create) |
| `channel_name` | string | Channel name — auto-resolved to ID |
| `message_id` | string | Message ID. Required for update/delete/get_replies/create_reply/reactions |
| `content` | string | Message text (Markdown supported). Required for create and create_reply |
| `notify_all` | boolean | Notify all channel members. For `create_chat_message` |
| `resolved` | boolean | Mark message as resolved. For `update_chat_message` |
| `reaction` | string | Lowercase emoji name (e.g. `+1`, `-1`, `joy`, `heart`, `tada`). Required for add/remove reaction |
| `comment_type` | string | Filter by comment type. For `get_chat_message_subtypes`. Values: `post`, `ai`, `syncup`, `ai_via_brain`. |
| `type` | string | Message type. For `create_chat_message`. Values: `message`, `post`. |
| `post_title` | string | Title for the post. Required if type is `post`. |
| `subtype_id` | string | Subtype ID for the post. Required if type is `post` and subtype_name not provided. |
| `subtype_name` | string | Subtype name for the post (e.g. `'Announcement'`). Auto-resolved to ID. |
| `cursor` | string | Pagination cursor. For get or get_replies |
| `limit` | number | Max results (up to 100). For get or get_replies |

## Examples

### Listing Channels (tool: `list_chat_channels`)
**User Prompt:**
```
List all chat channels in my workspace.
```

**Generated Request:**
```json
{}
```

**Tool Response:**
```json
[
  {
    "id": "8cm397h-433",
    "name": "General",
    "type": "CHANNEL",
    "visibility": "PUBLIC",
    "workspace_id": "9876543210"
  },
  {
    "id": "8cm397h-452",
    "name": "Development",
    "type": "CHANNEL",
    "visibility": "PUBLIC",
    "workspace_id": "9876543210"
  }
]
```

### Creating a Channel (tool: `create_chat_channel`)
**User Prompt:**
```
Create a new private chat channel called "Project Alpha" with the topic "Q2 Launch".
```

**Generated Request:**
```json
{
  "name": "Project Alpha",
  "topic": "Q2 Launch",
  "visibility": "PRIVATE"
}
```

**Tool Response:**
```json
{
  "id": "8cm397h-999",
  "name": "Project Alpha",
  "type": "CHANNEL",
  "visibility": "PRIVATE"
}
```

### Sending a Message (tool: `create_chat_message`)
**User Prompt:**
```
Send a message to the "General" channel saying "The deployment is successful."
```

**Generated Request:**
```json
{
  "channel_name": "General",
  "content": "The **deployment** is *successful*."
}
```

**Tool Response:**
```json
{
  "id": "80140022762565",
  "content": "The **deployment** is *successful*.",
  "type": "message",
  "user_id": "96055451"
}
```

### Getting Message History (tool: `get_chat_messages`)
**User Prompt:**
```
Show me the last messages from the "Development" channel.
```

**Generated Request:**
```json
{
  "channel_name": "Development",
  "limit": 20
}
```

**Tool Response:**
```json
[
  {
    "id": "80140022762565",
    "content": "The API migration is complete.",
    "type": "message",
    "user_id": "96055451",
    "date": 1770274975143,
    "parent_channel": "8cm397h-452",
    "resolved": false,
    "replies_count": 2
  }
]
```

### Replying to a Message (tool: `create_chat_message_reply`)
**User Prompt:**
```
Reply to message 80140022762565 saying "Confirmed, looks great!"
```

**Generated Request:**
```json
{
  "message_id": "80140022762565",
  "content": "Confirmed, looks great!"
}
```

### Adding a Reaction (tool: `add_chat_reaction`)
**User Prompt:**
```
Add a thumbs up reaction to message 80140022762565.
```

**Generated Request:**
```json
{
  "message_id": "80140022762565",
  "reaction": "thumbsup"
}
```

### Getting Channel Members (tool: `get_chat_channel_members`)
**User Prompt:**
```
Who are the members of the General channel?
```

**Generated Request:**
```json
{
  "channel_name": "General"
}
```

**Tool Response:**
```json
[
  {
    "id": "96055451",
    "username": "Talib Kareem",
    "email": "user@example.com"
  }
]
```

### Creating a Direct Message Channel (tool: `create_chat_dm`)
**User Prompt:**
```
Start a DM with user 96055451.
```

**Generated Request:**
```json
{
  "member_ids": [96055451]
}
```

**Tool Response:**
```json
{
  "id": "8cmrr5e-3474",
  "type": "DM",
  "visibility": "PRIVATE",
  "workspace_id": "9014370478"
}
```

### Getting Reactions on a Message (tool: `get_chat_reactions`)
**User Prompt:**
```
What reactions does message 80140022762565 have?
```

**Generated Request:**
```json
{
  "message_id": "80140022762565"
}
```

**Tool Response:**
```json
[
  {
    "reaction": "thumbsup",
    "user_id": "96055451"
  }
]
```

### Creating a "Post" Message (tool: `create_chat_message`)
**User Prompt:**
```
Create a post in the "General" channel titled "Announcement" using the subtype "Announcement" with the content "Hello everyone!"
```

**Generated Request:**
```json
{
  "channel_name": "General",
  "type": "post",
  "post_title": "Announcement",
  "subtype_name": "Announcement",
  "content": "Hello everyone!"
}
```

**Tool Response:**
```json
{
  "id": "80130052614740",
  "type": "post",
  "content": "Hello everyone!",
  "post_data": {
    "title": "Announcement",
    "subtype": {
      "id": "1524389"
    }
  }
}
```
