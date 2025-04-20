/**
 * SPDX-FileCopyrightText: © 2025 João Santana <joaosantana@gmail.com>
 * SPDX-License-Identifier: MIT
 *
 * ClickUp MCP Document Tools
 * 
 * This module defines document-related tools including creating,
 * retrieving, updating, and deleting documents.
 */

import { CreateDocumentData, DocumentPagesOptions, UpdateDocumentPageData } from '../services/clickup/types.js';
import { workspaceService } from '../services/shared.js';
import config from '../config.js';
import { sponsorService } from '../utils/sponsor-service.js';
import { Logger } from "../logger.js";
import { clickUpServices } from "../services/shared.js";

const logger = new Logger('DocumentTools');
const { document: documentService } = clickUpServices;

/**
 * Tool definition for creating a document
 */
export const createDocumentTool = {
  name: "create_document",
  description: `Creates a document in a ClickUp space, folder, or list. Requires name, parent info, visibility and create_page flag.`,
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name and Title of the document"
      },
      parent: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "ID of the parent container (space, folder, or list)"
          },
          type: {
            type: "number",
            enum: [4, 5, 6, 7, 12],
            description: "Type of the parent container (4=space, 5=folder, 6=list, 7=everything, 12=workspace)"
          }
        },
        required: ["id", "type"],
        description: "Parent container information"
      },
      visibility: {
        type: "string",
        enum: ["PUBLIC", "PRIVATE"],
        description: "Document visibility setting"
      },
      create_page: {
        type: "boolean",
        description: "Whether to create an initial blank page"
      }
    },
    required: ["name", "parent", "visibility", "create_page"]
  }
};

/**
 * Tool definition for getting a document
 */
export const getDocumentTool = {
  name: "get_document",
  description: `Gets details of a ClickUp document. Use documentId (preferred) or search by title in a container.`,
  inputSchema: {
    type: "object",
    properties: {
      documentId: {
        type: "string",
        description: "ID of the document to retrieve"
      },
    },
    required: ["documentId"]
  }
};

/**
 * Tool definition for listing documents
 */
export const listDocumentsTool = {
  name: "list_documents",
  description: `Lists all documents in a ClickUp space, folder, or list.`,
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Optional document ID to filter by"
      },
      creator: {
        type: "number",
        description: "Optional creator ID to filter by"
      },
      deleted: {
        type: "boolean",
        description: "Whether to include deleted documents"
      },
      archived: {
        type: "boolean",
        description: "Whether to include archived documents"
      },
      parent_id: {
        type: "string",
        description: "ID of the parent container to list documents from"
      },
      parent_type: {
        type: "string",
        enum: ["space", "folder", "list"],
        description: "Type of the parent container"
      },
      limit: {
        type: "number",
        description: "Maximum number of documents to return"
      },
      next_cursor: {
        type: "string",
        description: "Cursor for pagination"
      }
    },
    required: []
  }
};

/**
 * Tool definition for listing document pages
 */
export const listDocumentPagesTool = {
  name: "list_document_pages",
  description: "Lists all pages in a document with optional depth control",
  inputSchema: {
    type: "object",
    properties: {
      documentId: {
        type: "string",
        description: "ID of the document to list pages from"
      },
      max_page_depth: {
        type: "number",
        description: "Maximum depth of pages to retrieve (-1 for unlimited)",
        optional: true
      }
    },
    required: ["documentId"]
  }
};

/**
 * Tool definition for getting document pages
 */
export const getDocumentPagesTool = {
  name: "get_document_pages",
  description: "Gets the content of specific pages from a document",
  inputSchema: {
    type: "object",
    properties: {
      documentId: {
        type: "string",
        description: "ID of the document to get pages from"
      },
      pageIds: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Array of page IDs to retrieve"
      },
      content_format: {
        type: "string",
        enum: ["text/md", "text/html"],
        description: "Format of the content to retrieve",
        optional: true
      }
    },
    required: ["documentId", "pageIds"]
  }
};

/**
 * Tool definition for creating a document page
 */
export const createDocumentPageTool = {
  name: "create_document_page",
  description: "Creates a new page in a ClickUp document",
  inputSchema: {
    type: "object",
    properties: {
      documentId: {
        type: "string",
        description: "ID of the document to create the page in"
      },
      content: {
        type: "string",
        description: "Content of the page",
        optional: true
      },
      name: {
        type: "string",
        description: "Name and title of the page",
      },
      sub_title: {
        type: "string",
        description: "Subtitle of the page",
        optional: true
      },
      parent_page_id: {
        type: "string",
        description: "ID of the parent page (if this is a sub-page)",
        optional: true
      }
    },
    required: ["documentId", "name"]
  }
};

/**
 * Tool definition for updating a document page
 */
export const updateDocumentPageTool = {
  name: "update_document_page",
  description: "Updates an existing page in a ClickUp document. Supports updating name, subtitle, and content with different edit modes (replace/append/prepend).",
  inputSchema: {
    type: "object",
    properties: {
      documentId: {
        type: "string",
        description: "ID of the document containing the page"
      },
      pageId: {
        type: "string",
        description: "ID of the page to update"
      },
      name: {
        type: "string",
        description: "New name for the page",
        optional: true
      },
      sub_title: {
        type: "string",
        description: "New subtitle for the page",
        optional: true
      },
      content: {
        type: "string",
        description: "New content for the page",
        optional: true
      },
      content_edit_mode: {
        type: "string",
        enum: ["replace", "append", "prepend"],
        description: "How to update the content. Defaults to replace",
        optional: true
      },
      content_format: {
        type: "string",
        enum: ["text/md", "text/plain"],
        description: "Format of the content. Defaults to text/md",
        optional: true
      },
    },
    required: ["documentId", "pageId"]
  }
};

/**
 * Helper function to find a document by title in a container
 */
async function findDocumentByTitle(parentId: string, title: string): Promise<string | null> {
  const response = await documentService.listDocuments({
    parent_id: parentId
  });
  const document = response.docs.find(doc => doc.name === title);
  return document ? document.id : null;
}

/**
 * Helper function to find parent container ID by name and type
 */
async function findParentIdByName(name: string, type: 'space' | 'folder' | 'list'): Promise<string | null> {
  const hierarchy = await workspaceService.getWorkspaceHierarchy();
  const container = workspaceService.findIDByNameInHierarchy(hierarchy, name, type);
  return container ? container.id : null;
}

/**
 * Handler for the create_document tool
 */
export async function handleCreateDocument(parameters: any) {
  const { name, parent, visibility, create_page } = parameters;

  if (!parent || !visibility || !create_page) {
    return sponsorService.createErrorResponse('Parent, visibility, and create_page are required');
  }

  // Prepare document data
  const documentData: CreateDocumentData = {
    name,
    parent,
    visibility,
    create_page
  };

  try {
    // Create the document
    const newDocument = await clickUpServices.document.createDocument(documentData);
    
    return sponsorService.createResponse({
      id: newDocument.id,
      name: newDocument.name,
      parent: newDocument.parent,
      url: `https://app.clickup.com/${config.clickupTeamId}/v/d/${newDocument.id}`,
      message: `Document "${name}" created successfully`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to create document: ${error.message}`);
  }
}

/**
 * Handler for the get_document tool
 */
export async function handleGetDocument(parameters: any) {
  const { documentId, title, parentId } = parameters;

  let targetDocumentId = documentId;

  // If no documentId but title and parentId are provided, look up the document ID
  if (!targetDocumentId && title && parentId) {
    targetDocumentId = await findDocumentByTitle(parentId, title);
    if (!targetDocumentId) {
      throw new Error(`Document "${title}" not found`);
    }
  }

  if (!targetDocumentId) {
    throw new Error("Either documentId or (title + parentId) must be provided");
  }

  try {
    // Get the document
    const document = await documentService.getDocument(targetDocumentId);
    
    return sponsorService.createResponse({
      id: document.id,
      name: document.name,
      parent: document.parent,
      created: new Date(document.date_created).toISOString(),
      updated: new Date(document.date_updated).toISOString(),
      creator: document.creator,
      public: document.public,
      type: document.type,
      url: `https://app.clickup.com/${config.clickupTeamId}/v/d/${document.id}`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to retrieve document: ${error.message}`);
  }
}

/**
 * Handler for the list_documents tool
 */
export async function handleListDocuments(parameters: any) {
  const { 
    id,
    creator,
    deleted,
    archived,
    parent_id,
    parent_type,
    limit,
    next_cursor
  } = parameters;

  try {
    // Prepare options object with all possible parameters
    const options: any = {};
    
    // Add each parameter to options only if it's defined
    if (id !== undefined) options.id = id;
    if (creator !== undefined) options.creator = creator;
    if (deleted !== undefined) options.deleted = deleted;
    if (archived !== undefined) options.archived = archived;
    if (parent_id !== undefined) options.parent_id = parent_id;
    if (parent_type !== undefined) options.parent_type = parent_type;
    if (limit !== undefined) options.limit = limit;
    if (next_cursor !== undefined) options.next_cursor = next_cursor;

    const response = await documentService.listDocuments(options);
    
    // Ensure we have a valid response
    if (!response || !response.docs) {
      return sponsorService.createResponse({
        documents: [],
        message: "No documents found"
      }, true);
    }

    // Map the documents to a simpler format
    const documents = response.docs.map(doc => ({
      id: doc.id,
      name: doc.name,
      url: `https://app.clickup.com/${config.clickupTeamId}/v/d/${doc.id}`,
      parent: doc.parent,
      created: new Date(doc.date_created).toISOString(),
      updated: new Date(doc.date_updated).toISOString(),
      creator: doc.creator,
      public: doc.public,
      type: doc.type
    }));

    return sponsorService.createResponse({
      documents,
      count: documents.length,
      next_cursor: response.next_cursor,
      message: `Found ${documents.length} document(s)`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to list documents: ${error.message}`);
  }
}

/**
 * Handler for listing document pages
 */
export async function handleListDocumentPages(params: any) {
  logger.info('Listing document pages', { params });
  
  try {
    const { documentId, max_page_depth = -1 } = params;
    const pages = await documentService.listDocumentPages(documentId, { max_page_depth });
    return sponsorService.createResponse(pages);
  } catch (error) {
    logger.error('Error listing document pages', error);
    return sponsorService.createErrorResponse(error);
  }
}

/**
 * Handler for getting document pages
 */
export async function handleGetDocumentPages(params: any) {
  const { documentId, pageIds, content_format } = params;

  if (!documentId) {
    return sponsorService.createErrorResponse('Document ID is required');
  }

  if (!pageIds || !Array.isArray(pageIds) || pageIds.length === 0) {
    return sponsorService.createErrorResponse('Page IDs array is required');
  }

  try {
    const options: Partial<DocumentPagesOptions> = {};
    
    // Adiciona content_format nas options se fornecido
    if (content_format) {
      options.content_format = content_format;
    }

    const pages = await clickUpServices.document.getDocumentPages(documentId, pageIds, options);
    return sponsorService.createResponse(pages);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to get document pages: ${error.message}`);
  }
}

/**
 * Handler for creating a new page in a document
 */
export async function handleCreateDocumentPage(parameters: any) {
  const { documentId, content, sub_title, name, parent_page_id } = parameters;

  if (!documentId) {
    return sponsorService.createErrorResponse('Document ID is required');
  }

  if (!name) {
    return sponsorService.createErrorResponse('Title/Name is required');
  }

  try {
    const page = await clickUpServices.document.createPage(documentId, {
      content,
      sub_title,
      name,
      parent_page_id,
    });

    return sponsorService.createResponse(page);
  } catch (error) {
    return sponsorService.createErrorResponse(
      `Failed to create document page: ${error.message}`
    );
  }
}

/**
 * Handler for updating a document page
 */
export async function handleUpdateDocumentPage(parameters: any) {
  const { documentId, pageId, name, sub_title, content, content_format, content_edit_mode } = parameters;

  if (!documentId) {
    return sponsorService.createErrorResponse('Document ID is required');
  }

  if (!pageId) {
    return sponsorService.createErrorResponse('Page ID is required');
  }

  // Prepare update data
  const updateData: UpdateDocumentPageData = {};
  if (name) updateData.name = name;
  if (sub_title) updateData.sub_title = sub_title;
  if (content) updateData.content = content;
  if (content_format) updateData.content_format = content_format;
  if (content_edit_mode) updateData.content_edit_mode = content_edit_mode;

  try {
    const page = await clickUpServices.document.updatePage(documentId, pageId, updateData);

    return sponsorService.createResponse({
      message: `Page updated successfully`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(
      `Failed to update document page: ${error.message}`
    );
  }
}

export const documentTools = [
  createDocumentTool,
  getDocumentTool,
  listDocumentsTool,
  listDocumentPagesTool,
  getDocumentPagesTool,
  createDocumentPageTool,
  updateDocumentPageTool
];