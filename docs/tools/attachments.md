# Attachments

3 atomic tools to list, get, or upload attachments for a Task or File Custom Field using the ClickUp v3 API.

## Tool Reference

| Tool | Description | Required Parameters |
|------|-------------|---------------------|
| `list_attachments` | List all attachments for a task or custom field | `taskId` or `customFieldId` |
| `get_attachment` | Get a specific attachment by ID or name | `taskId` or `customFieldId`, `attachment_id` or `attachment_name` |
| `upload_attachment` | Upload a file to a task or custom field | `taskId` or `customFieldId`, `file_data` or `file_url` |

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `taskId` | string | Conditional | Task ID (preferred). Mutually exclusive with `customFieldId`. |
| `taskName` | string | Conditional | Task name (fallback; use with `listName`). |
| `listName` | string | No | Narrows task name search. |
| `customFieldId` | string | Conditional | File Custom Field ID. Mutually exclusive with `taskId`. |
| `attachment_id` | string | For `get_attachment` | Exact attachment ID. Use when ID is known. |
| `attachment_name` | string | For `get_attachment` | Attachment file name (fuzzy matched). Use when ID is unknown — no prior list call needed. |
| `file_name` | string | For `upload_attachment` (with `file_data`) | File name for the upload. |
| `file_data` | string | Conditional | Base64-encoded file content. Files >10 MB are automatically chunked. |
| `file_url` | string | Conditional | Web URL (`http/https`) or absolute local path. |
| `auth_header` | string | No | Authorization header for authenticated URL downloads. |
| `chunk_session` | string | For chunk continuation | Session ID returned when a large file upload is initialized. |
| `chunk_index` | number | For chunk continuation | 0-based index of the current chunk. |
| `chunk_is_last` | boolean | For chunk continuation | Set `true` on the final chunk to trigger assembly and upload. |
| `team_id` | string | No | ClickUp Team ID or Workspace Name. |

## Examples

### List all attachments on a task (tool: `list_attachments`)
```json
{
  "taskId": "86afua62f"
}
```

### Get a specific attachment by ID (tool: `get_attachment`)
```json
{
  "taskId": "86afua62f",
  "attachment_id": "99c59a2a-da85-47a4-8023-542c8d33abd5.txt"
}
```

### Get an attachment by name — fuzzy matched (tool: `get_attachment`)
```json
{
  "taskId": "86afua62f",
  "attachment_name": "report"
}
```

### Upload a base64 file to a task (tool: `upload_attachment`)
```json
{
  "taskId": "86afua62f",
  "file_name": "report.pdf",
  "file_data": "<base64-encoded-content>"
}
```

### Upload a file from a URL to a task (tool: `upload_attachment`)
```json
{
  "taskId": "86afua62f",
  "file_url": "https://example.com/report.pdf",
  "file_name": "report.pdf"
}
```

### Upload a local file to a task (tool: `upload_attachment`)
```json
{
  "taskId": "86afua62f",
  "file_url": "/Users/me/Documents/report.pdf"
}
```

### List attachments on a File Custom Field (tool: `list_attachments`)
```json
{
  "customFieldId": "c18c447d-b954-464e-96b1-07f88ea79b62"
}
```

### Large file upload (chunked — step 1: initiate) (tool: `upload_attachment`)
Files over 10 MB are automatically split into 5 MB chunks. The first call returns a `chunk_session` token.
```json
{
  "taskId": "86afua62f",
  "file_name": "large-video.mp4",
  "file_data": "<base64-of-entire-file>"
}
```
Response includes `chunk_session`, `chunks_total`, and `chunk_uploaded`.

### Large file upload (chunked — step 2: finalize) (tool: `upload_attachment`)
On the last chunk, set `chunk_is_last: true`. The server assembles and uploads the file.
```json
{
  "taskId": "86afua62f",
  "chunk_session": "chunk_session_1234_abc",
  "chunk_index": 2,
  "file_data": "<base64-of-last-chunk>",
  "chunk_is_last": true
}
```
