[← Back to Documentation Index](../DOCUMENTATION.md)
[← Back to README](../../README.md)

# Document Management

8 atomic tools for creating, browsing, and editing ClickUp documents and their pages. Supports markdown and HTML content formats, nested page hierarchies, and name resolution for parents and documents.

> **Note**: Permanently deleting documents or individual pages is currently not supported via the MCP tools. Please use the ClickUp UI for deletion operations.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|---------------------|---------------------|
| `list_documents` | List documents in a workspace or container | — | `parentId`, `parentType`, `creator`, `archived`, `deleted`, `limit`, `next_cursor`, `detail_level`, `team_id` |
| `get_document` | Get document metadata | `documentId` OR (`title` + `parentId`/`parentName` + `parentType`) | `team_id` |
| `create_document` | Create a new standalone document | `name`, `parentType` | `parentId`/`parentName`, `visibility`, `create_page`, `team_id` |
| `list_document_pages` | List all pages in a document | `documentId` OR `title` context | `max_page_depth`, `detail_level`, `team_id` |
| `get_document_page` | Get content for a single page | `documentId`, `pageId` | `content_format`, `team_id` |
| `get_document_pages` | Get content for multiple pages in one call | `documentId`, `pageIds` | `content_format`, `team_id` |
| `create_document_page` | Add a new page to a document | `documentId`, `name` | `content`, `sub_title`, `parent_page_id`, `content_format`, `team_id` |
| `update_document_page` | Modify an existing page | `documentId`, `pageId` | `name`, `sub_title`, `content`, `content_format`, `content_edit_mode`, `team_id` |

### Shared Parameters
- `team_id` (string): Optional workspace override.
- `documentId` (string): ID of the document (required for most page tools).
- `title` (string): Document title (used for resolution if ID is missing).
- `parentId`, `parentName`, `parentType`: Used for document resolution or creation context.

### Tool-Specific Notes

**`list_documents`**: Optional `parentType` values include `"workspace"`, `"space"`, `"list"`, etc. Use `detail_level="names"` to return only `{id, name, url}` per document.

**`list_document_pages`**: Use `detail_level="names"` to return a flat list of `{id, name}` for all pages (children flattened). `"detailed"` (default) returns the full nested page tree.

**`create_document`**: `parentType` required (e.g., `"workspace"`, `"space"`, `"list"`). Defaults to current workspace if `parentId`/`parentName` omitted. `visibility` accepts `"PUBLIC"` or `"PRIVATE"`.

**`update_document_page`**: `content_edit_mode` accepts `"replace"` (default), `"append"`, or `"prepend"`.

**`get_document_page` / `get_document_pages`**: `content_format` accepts `"text/md"` or `"text/html"`.

---

## Examples

### Creating a Document (tool: `create_document`)
**User Prompt:**
```
Create a new public document called "API Specs" in the "Development" space.
```

**Request:**
```json
{
  "name": "API Specs",
  "parentName": "Development",
  "parentType": "space",
  "visibility": "PUBLIC"
}
```

### Getting a Specific Page (tool: `get_document_page`)
**User Prompt:**
```
Read the content of page "Overview" (ID: 8cdu22c-11473) in document 8cdu22c-13153.
```

**Request:**
```json
{
  "documentId": "8cdu22c-13153",
  "pageId": "8cdu22c-11473"
}
```

### Appending Content to a Page (tool: `update_document_page`)
**User Prompt:**
```
Add a new section to the end of page 8cdu22c-36293 in doc 8cdu22c-13133.
```

**Request:**
```json
{
  "documentId": "8cdu22c-13133",
  "pageId": "8cdu22c-36293",
  "content": "\n## New Section\nDetails here...",
  "content_edit_mode": "append"
}
```
