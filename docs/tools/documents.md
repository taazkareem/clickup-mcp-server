[← Back to Documentation Index](../DOCUMENTATION.md)  
[← Back to README](../../README.md)  

# Document Management

Action-based tool for creating, browsing, and editing ClickUp documents and their pages. Supports markdown and HTML content formats, nested page hierarchies, and name resolution for parents and documents.

## Tool Reference

| Tool | Description | Actions |
|------|-------------|---------|
| `manage_documents` | Consolidated tool for documents and pages | `get`, `list`, `create`, `list_pages`, `get_page`, `get_pages`, `create_page`, `update_page` |

## Actions & Parameters

### Shared Parameters
- `team_id` (string): Optional workspace override.
- `documentId` (string): ID of the document (required for most page actions).
- `title` (string): Document title (used for resolution if ID is missing).
- `parentId`, `parentName`, `parentType`: Used for document resolution or creation context.

### 1. `get`
Retrieve document metadata.
- **Requires**: `documentId` OR (`title` + `parentId`/`parentName` + `parentType`).

### 2. `list`
List documents in a workspace or specific container.
- **Optional**: `parentId`, `parentType`, `creator`, `archived`, `deleted`, `limit`, `next_cursor`.

### 3. `create`
Create a new standalone document.
- **Requires**: `name`, `parentType` (e.g., "workspace", "space", "list").
- **Optional**: `parentId`/`parentName` (defaults to current workspace), `visibility` ("PUBLIC"/"PRIVATE"), `create_page` (boolean).

### 4. `list_pages`
List all pages in a document.
- **Requires**: `documentId` OR `title` context.
- **Optional**: `max_page_depth` (-1 for unlimited).

### 5. `get_page`
Get content for a single page.
- **Requires**: `documentId`, `pageId`.
- **Optional**: `content_format` ("text/md", "text/html").

### 6. `get_pages`
Get content for multiple pages in one call.
- **Requires**: `documentId`, `pageIds` (array).
- **Optional**: `content_format`.

### 7. `create_page`
Add a new page to a document.
- **Requires**: `documentId`, `name`.
- **Optional**: `content`, `sub_title`, `parent_page_id`, `content_format`.

### 8. `update_page`
Modify an existing page.
- **Requires**: `documentId`, `pageId`.
- **Optional**: `name`, `sub_title`, `content`, `content_format`, `content_edit_mode` ("replace", "append", "prepend").

---

## Examples

### Creating a Document
**User Prompt:**
```
Create a new public document called "API Specs" in the "Development" space.
```

**Request:**
```json
{
  "action": "create",
  "name": "API Specs",
  "parentName": "Development",
  "parentType": "space",
  "visibility": "PUBLIC"
}
```

### Getting a Specific Page
**User Prompt:**
```
Read the content of page "Overview" (ID: 8cdu22c-11473) in document 8cdu22c-13153.
```

**Request:**
```json
{
  "action": "get_page",
  "documentId": "8cdu22c-13153",
  "pageId": "8cdu22c-11473"
}
```

### Appending Content to a Page
**User Prompt:**
```
Add a new section to the end of page 8cdu22c-36293 in doc 8cdu22c-13133.
```

**Request:**
```json
{
  "action": "update_page",
  "documentId": "8cdu22c-13133",
  "pageId": "8cdu22c-36293",
  "content": "\n## New Section\nDetails here...",
  "content_edit_mode": "append"
}
```
