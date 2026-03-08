# Attachments Tool

## Tool Name
`manage_attachments`

## Description
List, get, or upload attachments for a Task or File Custom Field using the ClickUp v3 API. Supports tasks (by `taskId` or `taskName`) and file-type custom fields (by `customFieldId`).

## Actions

| Action | Endpoint | Required Params |
|--------|----------|-----------------|
| `list` | `GET /v3/workspaces/{wid}/{entity_type}/{eid}/attachments` | `taskId` or `customFieldId` |
| `get` | `GET /v3/workspaces/{wid}/{entity_type}/{eid}/attachments` (filtered) | `taskId` or `customFieldId`, `attachment_id` |
| `upload` | `POST /v3/workspaces/{wid}/{entity_type}/{eid}/attachments` | `taskId` or `customFieldId`, `file_data` or `file_url` |

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string (enum) | **Yes** | `list`, `get`, or `upload`. |
| `taskId` | string | Conditional | Task ID (preferred). Mutually exclusive with `customFieldId`. |
| `taskName` | string | Conditional | Task name (fallback; use with `listName`). |
| `listName` | string | No | Narrows task name search. |
| `customFieldId` | string | Conditional | File Custom Field ID. Mutually exclusive with `taskId`. |
| `attachment_id` | string | For `get` | Attachment ID to fetch. |
| `file_name` | string | For `upload` (with `file_data`) | File name for the upload. |
| `file_data` | string | Conditional | Base64-encoded file content. Files >10 MB are automatically chunked. |
| `file_url` | string | Conditional | Web URL (`http/https`) or absolute local path. |
| `auth_header` | string | No | Authorization header for authenticated URL downloads. |
| `chunk_session` | string | For chunk continuation | Session ID returned when a large file upload is initialized. |
| `chunk_index` | number | For chunk continuation | 0-based index of the current chunk. |
| `chunk_is_last` | boolean | For chunk continuation | Set `true` on the final chunk to trigger assembly and upload. |
| `team_id` | string | No | ClickUp Team ID or Workspace Name. |

## Examples

### List all attachments on a task
```json
{
  "action": "list",
  "taskId": "86afua62f"
}
```

### Get a specific attachment by ID
```json
{
  "action": "get",
  "taskId": "86afua62f",
  "attachment_id": "99c59a2a-da85-47a4-8023-542c8d33abd5.txt"
}
```

### Upload a base64 file to a task
```json
{
  "action": "upload",
  "taskId": "86afua62f",
  "file_name": "report.pdf",
  "file_data": "<base64-encoded-content>"
}
```

### Upload a file from a URL to a task
```json
{
  "action": "upload",
  "taskId": "86afua62f",
  "file_url": "https://example.com/report.pdf",
  "file_name": "report.pdf"
}
```

### Upload a local file to a task
```json
{
  "action": "upload",
  "taskId": "86afua62f",
  "file_url": "/Users/me/Documents/report.pdf"
}
```

### List attachments on a File Custom Field
```json
{
  "action": "list",
  "customFieldId": "c18c447d-b954-464e-96b1-07f88ea79b62"
}
```

### Large file upload (chunked — step 1: initiate)
Files over 10 MB are automatically split into 5 MB chunks. The first call returns a `chunk_session` token.
```json
{
  "action": "upload",
  "taskId": "86afua62f",
  "file_name": "large-video.mp4",
  "file_data": "<base64-of-entire-file>"
}
```
Response includes `chunk_session`, `chunks_total`, and `chunk_uploaded`.

### Large file upload (chunked — step 2: finalize)
On the last chunk, set `chunk_is_last: true`. The server assembles and uploads the file.
```json
{
  "action": "upload",
  "taskId": "86afua62f",
  "chunk_session": "chunk_session_1234_abc",
  "chunk_index": 2,
  "file_data": "<base64-of-last-chunk>",
  "chunk_is_last": true
}
```
