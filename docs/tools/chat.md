[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# Chat Management

Send messages, create channels, and browse message history in ClickUp Chat. Supports markdown formatting, @mentions, reactions, and threaded replies.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| manage_chat_channels | Manage chat channels (list, get, create, update, delete, get_members) | `action` | `channel_id`, `channel_name`, `name`, `description`, `topic`, `visibility`, `space_id`, `folder_id`, `list_id`, `cursor`, `limit` |
| manage_chat_messages | Manage chat messages (get, create, update, delete, get_replies, create_reply, add_reaction, remove_reaction) | `action` | `channel_id`, `channel_name`, `message_id`, `content`, `notify_all`, `resolved`, `reaction`, `cursor`, `limit` |

## manage_chat_channels

### Actions

| Action | Description | Required Params |
|--------|-------------|-----------------|
| `list` | List all channels in the workspace | — |
| `get` | Get a single channel | `channel_id` or `channel_name` |
| `create` | Create a new channel | `name` |
| `update` | Update a channel | `channel_id` or `channel_name` |
| `delete` | Delete a channel | `channel_id` or `channel_name` |
| `get_members` | Get members of a channel | `channel_id` or `channel_name` |

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
| `cursor` | string | Pagination cursor. For list or get_members |
| `limit` | number | Max results (up to 100). For list or get_members |

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

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `action` | string | Action to perform (required) |
| `channel_id` | string | Channel ID (preferred for get/create) |
| `channel_name` | string | Channel name — auto-resolved to ID |
| `message_id` | string | Message ID. Required for update/delete/get_replies/create_reply/add_reaction/remove_reaction |
| `content` | string | Message text (Markdown supported). Required for create and create_reply. For update, required only when modifying message text (omit if only changing resolved status) |
| `notify_all` | boolean | Notify all channel members. For create |
| `resolved` | boolean | Mark message as resolved. For update |
| `reaction` | string | Lowercase emoji name (e.g. `thumbsup`). Required for add_reaction/remove_reaction |
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
