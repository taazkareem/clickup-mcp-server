[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# Chat Management

Send messages, create channels, and browse message history in ClickUp Chat. Supports markdown formatting and @mentions.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| get_chat_channels | Retrieve all chat channels in the workspace | None | None |
| create_chat_channel | Create a new chat channel | `name` | `space_id`, `folder_id`, `list_id` |
| create_chat_message | Send a message to a channel | `comment_text` and either `channel_id` or `channel_name` | `notify_all` |
| get_chat_messages | Retrieve message history from a channel | Either `channel_id` or `channel_name` | None |

## Parameters

- **Markdown Support**: Messages sent via `create_chat_message` support standard markdown formatting (**bold**, *italic*, etc.).
- **Channel Resolution**: You can interact with channels by their `channel_name` instead of needing the internal ID. The server will resolve the name to the correct ID automatically.
- **Privacy**: Channels can be workspace-wide or restricted to specific spaces, folders, or lists.

## Examples

### Listing Channels
**User Prompt:**
```
List all chat channels in my workspace.
```

**Generated Request:**
```json
{
  "team_id": "9876543210"
}
```

**Tool Response:**
```json
{
  "channels": [
    {
      "id": "8cm397h-433",
      "name": "General",
      "type": "CHANNEL",
      "visibility": "PUBLIC",
      "created_by": 55154194,
      "created": 1703980800000
    },
    {
      "id": "8cm397h-452",
      "name": "Development",
      "type": "CHANNEL",
      "visibility": "PUBLIC",
      "created_by": 55154194,
      "created": 1703981000000
    },
    {
      "id": "8cm397h-478",
      "name": "random",
      "type": "CHANNEL",
      "visibility": "PUBLIC",
      "created_by": 55154194,
      "created": 1703981200000
    }
  ]
}
```

### Sending a Message
**User Prompt:**
```
Send a message to the "General" channel saying "Hello everyone! The deployment is successful."
Use bold for "deployment" and italics for "successful".
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "channel_name": "General",
  "comment_text": "Hello everyone! The **deployment** is *successful*."
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "message_data": {
    "id": "msg_general_001",
    "text": "Hello everyone! The deployment is successful.",
    "user": {
      "id": 1234567,
      "username": "developer1",
      "email": "dev1@example.com"
    },
    "created_date": "2024-03-16T12:00:00.000Z",
    "channel": {
      "id": "channel_general",
      "name": "General"
    }
  }
}
```

### Creating a Channel
**User Prompt:**
```
Create a new chat channel called "Project Alpha" in the "Engineering" space.
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "name": "Project Alpha",
  "space_id": "90132678315"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Channel created successfully",
  "channel": {
    "id": "channel_alpha",
    "name": "project-alpha",
    "created_date": "2024-03-16T12:15:00.000Z",
    "creator": {
      "id": 1234567,
      "username": "developer1"
    },
    "space_id": "90132678315",
    "url": "https://app.clickup.com/chat/channel_alpha"
  }
}
```

### Getting Message History
**User Prompt:**
```
Show me the last messages from the "Development" chat.
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "channel_name": "Development"
}
```

**Tool Response:**
```json
{
  "messages": [
    {
      "id": "msg_dev_001",
      "text": "The API migration is complete",
      "user": {
        "id": 1234567,
        "username": "developer1",
        "email": "dev1@example.com"
      },
      "created_date": "2024-03-16T10:30:00.000Z"
    },
    {
      "id": "msg_dev_002",
      "text": "Great! Let's run the integration tests",
      "user": {
        "id": 7654321,
        "username": "qa_engineer",
        "email": "qa@example.com"
      },
      "created_date": "2024-03-16T10:45:00.000Z"
    },
    {
      "id": "msg_dev_003",
      "text": "All tests passed successfully",
      "user": {
        "id": 1234567,
        "username": "developer1",
        "email": "dev1@example.com"
      },
      "created_date": "2024-03-16T11:15:00.000Z"
    }
  ],
  "count": 3,
  "channel": {
    "id": "channel_dev",
    "name": "Development"
  }
}
```
