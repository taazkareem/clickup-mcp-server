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
  description: `Creates a document in a ClickUp space, folder, or list. Requires parent ID/name and document title. Optional: content, status, assignee.`,
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name and Title of the document"
      },
      parentName: {
        type: "string",
        description: "Name of the parent space, folder, or list. Only use if you don't have parentId."
      },
      parentId: {
        type: "string",
        description: "ID of the parent space, folder, or list where the document will be created"
      },
      parentType: {
        type: "string",
        enum: ["space", "folder", "list"],
        description: "Type of the parent container when using parentName"
      },
    },
    required: ["name", "parentId", "parentType"]
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
      title: {
        type: "string",
        description: "Title of the document to find"
      },
      parentId: {
        type: "string",
        description: "ID of the parent container to search in when using title"
      }
    },
    required: []
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
      parentId: {
        type: "string",
        description: "ID of the container to list documents from"
      },
      parentName: {
        type: "string",
        description: "Name of the container to list documents from. Only use if you don't have parentId."
      },
      parentType: {
        type: "string",
        enum: ["space", "folder", "list"],
        description: "Type of the parent container when using parentName"
      },
      archived: {
        type: "boolean",
        description: "Whether to include archived documents"
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
      content_format: {
        type: "string",
        enum: ["text/md", "text/plain"],
        description: "Format of the content. Defaults to text/md",
        optional: true
      },
      content_edit_mode: {
        type: "string",
        enum: ["replace", "append", "prepend"],
        description: "How to update the content. Defaults to replace",
        optional: true
      }
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
  const { name, parentId, parentType } = parameters;

  if (!parentId || !parentType) {
    return sponsorService.createErrorResponse('Parent ID and type are required');
  }

  // Map string type to numeric value
  const parentTypeMap = {
    'space': 4,
    'folder': 5,
    'list': 6,
    'everything': 7,
    'workspace': 12
  };

  const parentTypeValue = parentTypeMap[parentType.toLowerCase()];
  if (parentTypeValue === undefined) {
    return sponsorService.createErrorResponse('Invalid parent type. Must be one of: space, folder, list, everything, workspace');
  }

  // Prepare document data
  const documentData: CreateDocumentData = {
    name,
    parent: {
      id: parentId,
      type: parentTypeValue
    }
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
  const { parentId, parentName, parentType, archived } = parameters;

  let targetParentId = parentId;

  // If no parentId but parentName is provided, look up the parent ID
  if (!targetParentId && parentName && parentType) {
    targetParentId = await findParentIdByName(parentName, parentType);
    if (!targetParentId) {
      throw new Error(`Parent container "${parentName}" not found`);
    }
  }

  try {
    // List documents with options
    const options: any = {};
    if (targetParentId) options.parent_id = targetParentId;
    if (archived !== undefined) options.deleted = archived;

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
    const options: DocumentPagesOptions = {
      content_format: content_format || 'text/md',
      pageIds
    };

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
      id: page.id,
      name: page.name,
      sub_title: page.sub_title,
      content: page.content,
      parent_id: page.parent_id,
      parent_page_id: page.parent_page_id,
      message: `Page "${page.name}" updated successfully`
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