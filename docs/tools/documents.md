[← Back to Documentation Index](../DOCUMENTATION.md)
<br>
[← Back to README](../../README.md)

# Document Management

Create, browse, and edit ClickUp documents and their pages. Supports markdown and HTML content formats, nested page hierarchies, and multiple content edit modes.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| create_document | Create a document | `name`, `parent` (with `id` and `type`), `visibility`, `create_page` | None |
| get_document | Get document details | `documentId` or `documentName` | `workspaceId` |
| list_documents | List documents | None | `id`, `creator`, `deleted`, `archived`, `parent_id`, `parent_type`, `limit`, `next_cursor` |
| list_document_pages | List document pages | `documentId` or `documentName` | `max_page_depth` (-1 for unlimited) |
| get_document_pages | Get document pages | `documentId` or `documentName`, `pageIds` | `content_format` ('text/md'/'text/html') |
| create_document_page | Create a document page | `documentId` or `documentName`, `name` | `content`, `sub_title`, `parent_page_id` |
| update_document_page | Update a document page | `documentId` or `documentName`, `pageId` | `name`, `sub_title`, `content`, `content_format`, `content_edit_mode` |

## Parameters

- **Parent Types**:
  - Space (4)
  - Folder (5)
  - List (6)
  - All (7)
  - Workspace (12)

- **Visibility Settings**:
  - PUBLIC: Document is visible to all workspace members
  - PRIVATE: Document is visible only to specific members

- **Content Formats**:
  - text/md: Markdown format (default)
  - text/html: HTML format (for get_document_pages)
  - text/plain: Plain text format (for update_document_page)

- **Content Edit Modes**:
  - replace: Replace existing content (default)
  - append: Add content at the end
  - prepend: Add content at the beginning

## Examples

### Creating a Document with Initial Page
```json
{
  "team_id": "9876543210",
  "name": "Technical Documentation",
  "parent": {
    "id": "123456",
    "type": 4
  },
  "visibility": "PUBLIC",
  "create_page": true
}
```

### Getting Document Details
**User Prompt:**
```
Get details for the document with id 8cdu22c-13153
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "documentId": "8cdu22c-13153"
}
```

**Tool Response:**
```json
{
  "id": "8cdu22c-13153",
  "name": "Project Documentation",
  "parent": {
    "id": "90130315830",
    "type": 4
  },
  "created": "2025-04-18T20:47:23.611Z",
  "updated": "2025-04-18T20:47:23.611Z",
  "creator": 55154194,
  "public": false,
  "type": 1,
  "url": "https://app.clickup.com/docs/8cdu22c-13153"
}
```

### Listing Documents
**User Prompt:**
```
Show me all documents in the workspace
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
  "documents": [
    {
      "id": "8cdu22c-10153",
      "name": "Project Planning",
      "url": "https://app.clickup.com/docs/8cdu22c-10153",
      "parent": {
        "id": "90131843402",
        "type": 5
      },
      "created": "2024-08-16T19:30:17.853Z",
      "updated": "2025-04-02T14:07:42.454Z",
      "creator": 55158625,
      "public": false,
      "type": 1
    },
    {
      "id": "8cdu22c-10173",
      "name": "API Documentation",
      "url": "https://app.clickup.com/docs/8cdu22c-10173",
      "parent": {
        "id": "90131843402",
        "type": 5
      },
      "created": "2024-09-20T10:15:00.000Z",
      "updated": "2025-03-25T16:22:11.000Z",
      "creator": 55158625,
      "public": true,
      "type": 1
    }
  ]
}
```

### Listing Document Pages
**User Prompt:**
```
Show me all pages for the document with id 8cdu22c-13153
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "documentId": "8cdu22c-13153"
}
```

**Tool Response:**
```json
{
  "pages": [
    {
      "id": "8cdu22c-11473",
      "doc_id": "8cdu22c-13153",
      "workspace_id": 9007073356,
      "name": "Overview",
      "date_created": 1745010444340,
      "date_updated": 1745010454496
    },
    {
      "id": "8cdu22c-13013",
      "doc_id": "8cdu22c-13153",
      "workspace_id": 9007073356,
      "name": "Getting Started",
      "date_created": 1744980000000,
      "date_updated": 1745010454496,
      "pages": [
        {
          "id": "8cdu22c-1687",
          "doc_id": "8cdu22c-13153",
          "parent_page_id": "8cdu22c-13013",
          "workspace_id": 9007073356,
          "name": "Installation",
          "date_created": 1744990000000,
          "date_updated": 1745010454496
        }
      ]
    }
  ]
}
```

### Getting Document Page
**User Prompt:**
```
Get details for the page "Milestones" in the document with id 8cdu22c-13153

Obs: you can also ask for more pages at once
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "documentId": "8cdu22c-13153",
  "pageIds": ["8cdu22c-36253"]
}
```

**Tool Response:**
```json
{
  "pages": [
    {
      "id": "8cdu22c-36253",
      "doc_id": "8cdu22c-13153",
      "workspace_id": 9007073356,
      "name": "Milestones",
      "date_created": 1745010444340,
      "date_updated": 1745010454496,
      "content": "# Project Milestones\n\n## Phase 1\n- [ ] Design mockups\n- [ ] Review with stakeholders\n\n## Phase 2\n- [ ] Development\n- [ ] Testing",
      "creator_id": 55154194,
      "deleted": false,
      "date_edited": 1745010454496,
      "edited_by": 55154194,
      "archived": false,
      "protected": false
    }
  ]
}
```

### Creating Document Page
**User Prompt:**
```
Create a page at the document 8cdu22c-13133 with ...
or
Create a subpage for page 8cdu22c-151232 with ...
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "documentId": "8cdu22c-13133",
  "name": "New Page Title",
  "content": "Page content in markdown..."
}
```
For a subpage, add `"parent_page_id": "8cdu22c-151232"`.

**Tool Response:**
```json
{
  "id": "8cdu22c-36273",
  "doc_id": "8cdu22c-13133",
  "workspace_id": 9007073356,
  "name": "New Page Title",
  "date_created": 1745171083589,
  "date_updated": 1745171083589,
  "content": "Page content in markdown...",
  "creator_id": 55154194,
  "deleted": false,
  "archived": false,
  "protected": false,
  "url": "https://app.clickup.com/docs/8cdu22c-13133/p/8cdu22c-36273"
}
```

### Updating / Editing Document Page
**User Prompt:**
```
Edit page 8cdu22c-36293 adding, in the end, another information...
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "documentId": "8cdu22c-13133",
  "pageId": "8cdu22c-36293",
  "content": "Additional information to append...",
  "content_edit_mode": "append"
}
```

**Tool Response:**
```json
{
  "id": "8cdu22c-36293",
  "doc_id": "8cdu22c-13133",
  "workspace_id": 9007073356,
  "name": "Updated Page",
  "date_created": 1745010444340,
  "date_updated": 1745175600000,
  "content": "Original page content...\n\nAdditional information to append...",
  "creator_id": 55154194,
  "deleted": false,
  "date_edited": 1745175600000,
  "edited_by": 55154194,
  "archived": false,
  "protected": false
}
```
