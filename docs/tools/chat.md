[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# Chat Management

Send messages, create channels, and browse message history in ClickUp Chat. Supports markdown formatting, @mentions, reactions, and threaded replies.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| manage_chat_channels | Manage chat channels (list, get, create, update, delete, get_members, get_followers, create_dm) | `action` | `channel_id`, `channel_name`, `name`, `description`, `topic`, `visibility`, `space_id`, `folder_id`, `list_id`, `member_ids`, `cursor`, `limit` |
| manage_chat_messages | Manage chat messages (get, create, update, delete, get_replies, create_reply, add_reaction, remove_reaction, get_reactions, get_tagged_users, get_subtypes) | `action` | `channel_id`, `channel_name`, `message_id`, `content`, `notify_all`, `resolved`, `reaction`, `cursor`, `limit`, `comment_type`, `type`, `post_title`, `subtype_id`, `subtype_name` |

## manage_chat_channels

### Actions

| Action | Description | Required Params |
|--------|-------------|-----------------|
| `list` | List all channels in the workspace | — |
| `get` | Get a single channel | `channel_id` or `channel_name` |
| `create` | Create a new channel (smart-routes to `/location` when space_id/folder_id/list_id given) | `name` |
| `update` | Update a channel | `channel_id` or `channel_name` |
| `delete` | Delete a channel | `channel_id` or `channel_name` |
| `get_members` | Get members of a channel | `channel_id` or `channel_name` |
| `get_followers` | Get followers of a channel | `channel_id` or `channel_name` |
| `create_dm` | Create a direct message channel | `member_ids` |

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `action` | string | Action to perform (required) |
| `channel_id` | string | Channel ID (preferred for get/update/delete/get_members) |
| `channel_name` | string | Channel name — auto-resolved to ID |
| `name` | string | Channel name. Required for create |
| `description` | string | Channel description. For create or update |
| `topic` | string | Channel topic. For create or update |
| `visibility` | string | `PUBLIC` or `PRIVATE`. For create or update |
| `space_id` | string | Space ID context. For create |
| `spaceName` | string | Space name (auto-resolved). For create |
| `folder_id` | string | Folder ID context. For create |
| `folderName` | string | Folder name (auto-resolved). For create |
| `list_id` | string | List ID context. For create |
| `listName` | string | List name (auto-resolved). For create |
| `member_ids` | integer[] | Array of member user IDs. Required for create_dm |
| `cursor` | string | Pagination cursor. For list, get_members, or get_followers |
| `limit` | number | Max results (up to 100). For list, get_members, or get_followers |

## manage_chat_messages

### Actions

| Action | Description | Required Params |
|--------|-------------|-----------------|
| `get` | Get messages from a channel | `channel_id` or `channel_name` |
| `create` | Send a message to a channel | `content` + `channel_id` or `channel_name` |
| `update` | Edit a message | `message_id` + `content` or `resolved` |
| `delete` | Delete a message | `message_id` |
| `get_replies` | Get threaded replies to a message | `message_id` |
| `create_reply` | Reply to a message in a thread | `message_id` + `content` |
| `add_reaction` | Add an emoji reaction to a message | `message_id` + `reaction` |
| `remove_reaction` | Remove an emoji reaction | `message_id` + `reaction` |
| `get_reactions` | Get all reactions on a message | `message_id` |
| `get_tagged_users` | Get users tagged in a message | `message_id` |
| `get_subtypes` | Get post subtype IDs for the workspace | `comment_type` (default: "post") |

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `action` | string | Action to perform (required) |
| `channel_id` | string | Channel ID (preferred for get/create) |
| `channel_name` | string | Channel name — auto-resolved to ID |
| `message_id` | string | Message ID. Required for update/delete/get_replies/create_reply/add_reaction/remove_reaction/get_reactions/get_tagged_users |
| `content` | string | Message text (Markdown supported). Required for create and create_reply. For update, required only when modifying message text (omit if only changing resolved status) |
| `notify_all` | boolean | Notify all channel members. For create |
| `resolved` | boolean | Mark message as resolved. For update |
| `reaction` | string | Lowercase emoji name (e.g. `thumbsup`). Required for add_reaction/remove_reaction |
| `comment_type` | string | Filter by comment type. For 'get_subtypes' action. Values: `post`, `ai`, `syncup`, `ai_via_brain`. |
| `type` | string | Message type. For 'create' action. Values: `message`, `post`. |
| `post_title` | string | Title for the post. Required if type is 'post'. |
| `subtype_id` | string | Subtype ID for the post. Required if type is 'post' and subtype_name not provided. |
| `subtype_name` | string | Subtype name for the post (e.g. 'Announcement'). Auto-resolved to ID. |
| `cursor` | string | Pagination cursor. For get or get_replies |
| `limit` | number | Max results (up to 100). For get or get_replies |

## Examples

### Listing Channels
**User Prompt:**
```
List all chat channels in my workspace.
```

**Generated Request:**
```json
{
  "action": "list"
}
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

### Creating a Channel
**User Prompt:**
```
Create a new private chat channel called "Project Alpha" with the topic "Q2 Launch".
```

**Generated Request:**
```json
{
  "action": "create",
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

### Sending a Message
**User Prompt:**
```
Send a message to the "General" channel saying "The deployment is successful."
```

**Generated Request:**
```json
{
  "action": "create",
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

### Getting Message History
**User Prompt:**
```
Show me the last messages from the "Development" channel.
```

**Generated Request:**
```json
{
  "action": "get",
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
  },
  {
    "id": "80140022762104",
    "content": "All tests passed successfully.",
    "type": "message",
    "user_id": "96055451",
    "date": 1770274352530,
    "parent_channel": "8cm397h-452",
    "resolved": false,
    "replies_count": 0
  }
]
```

### Replying to a Message
**User Prompt:**
```
Reply to message 80140022762565 saying "Confirmed, looks great!"
```

**Generated Request:**
```json
{
  "action": "create_reply",
  "message_id": "80140022762565",
  "content": "Confirmed, looks great!"
}
```

### Adding a Reaction
**User Prompt:**
```
Add a thumbs up reaction to message 80140022762565.
```

**Generated Request:**
```json
{
  "action": "add_reaction",
  "message_id": "80140022762565",
  "reaction": "thumbsup"
}
```

### Getting Channel Members
**User Prompt:**
```
Who are the members of the General channel?
```

**Generated Request:**
```json
{
  "action": "get_members",
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

### Creating a Direct Message Channel
**User Prompt:**
```
Start a DM with user 96055451.
```

**Generated Request:**
```json
{
  "action": "create_dm",
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

### Getting Reactions on a Message
**User Prompt:**
```
What reactions does message 80140022762565 have?
```

**Generated Request:**
```json
{
  "action": "get_reactions",
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

### Creating a "Post" Message
**User Prompt:**
```
Create a post in the "General" channel titled "Announcement" using the subtype "Announcement" with the content "Hello everyone!"
```

**Generated Request:**
```json
{
  "action": "create",
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
