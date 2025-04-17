/**
 * SPDX-FileCopyrightText: © 2025 João Santana <joaosantana@gmail.com>
 * SPDX-License-Identifier: MIT
 *
 * Document service for ClickUp
 * 
 * This service provides methods to manage ClickUp documents:
 * - Create documents
 * - Get document details
 * - List documents in a container
 * - List document pages
 * - Get document pages content
 * - Update document pages
 */

import { BaseClickUpService, ClickUpServiceError, ErrorCode } from './base.js';
import { 
  ClickUpDocument, 
  CreateDocumentData,
  ListDocumentsOptions,
  ClickUpDocumentResponse,
  DocumentPageListingOptions,
  DocumentPagesOptions,
  DocumentPagesResponse,
  CreateDocumentPageData,
  UpdateDocumentPageData,
  ClickUpDocumentPage
} from './types.js';

export class DocumentService extends BaseClickUpService {
  constructor(
    apiKey: string,
    teamId: string,
    baseUrl?: string
  ) {
    // Override baseUrl to use v3 API, since Docs are only available in v3
    super(apiKey, teamId, baseUrl || 'https://api.clickup.com/api/v3');
  }

  /**
   * Helper method to handle errors consistently
   * @param error The error that occurred
   * @param message Optional custom error message
   * @returns A ClickUpServiceError
   */
  private handleError(error: any, message?: string): ClickUpServiceError {
    if (error instanceof ClickUpServiceError) {
      return error;
    }
    return new ClickUpServiceError(
      message || `Document service error: ${error.message}`,
      ErrorCode.UNKNOWN,
      error
    );
  }

  /**
   * Creates a new document in a space, folder, or list
   * @param data - Document data with parent object structured as {id: string, type: number}
   * @returns Created document
   */
  async createDocument(data: CreateDocumentData): Promise<ClickUpDocument> {
    try {
      // Log the request data for debugging
      this.logOperation('Creating document with data:', { data });
      const response = await this.client.post(`/workspaces/${this.teamId}/docs`, {
        name: data.name,
        parent: data.parent,
        visibility: data.visibility || 'PRIVATE',
        create_page: data.create_page !== undefined ? data.create_page : true
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create document');
    }
  }

  /**
   * Creates a new page in a document
   * @param documentId - ID of the document to create the page in
   * @param data - Page data
   * @returns Created page
   */
  async createPage(documentId: string, data: CreateDocumentPageData): Promise<ClickUpDocumentPage> {
    try {
      this.logOperation('Creating page in document with data:', { documentId, data });
      const response = await this.client.post(
        `/workspaces/${this.teamId}/docs/${documentId}/pages`,
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Failed to create page in document ${documentId}`);
    }
  }

  /**
   * Gets a document by ID
   * @param documentId - ID of the document to retrieve
   * @returns Document details
   */
  async getDocument(documentId: string): Promise<ClickUpDocument> {
    try {
      this.logOperation('Getting document with ID:', { documentId });
      const response = await this.client.get(`/workspaces/${this.teamId}/docs/${documentId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Failed to get document ${documentId}`);
    }
  }

  /**
   * Lists documents in the workspace with optional filters
   * @param options - Search and filter options
   * @returns List of documents
   */
  async listDocuments(options: ListDocumentsOptions = {}): Promise<ClickUpDocumentResponse> {
    try {
      this.logOperation('Listing documents with options:', { options });
      const response = await this.client.get(`/workspaces/${this.teamId}/docs`, {
        params: options
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to list documents');
    }
  }

  /**
   * Lists all pages in a document with optional depth control
   * @param documentId - ID of the document
   * @param options - Options for page listing
   * @returns List of document pages
   */
  async listDocumentPages(documentId: string, options: DocumentPageListingOptions = {}): Promise<DocumentPagesResponse> {
    try {
      this.logOperation('Listing pages for document with ID:', { documentId, options });
      const response = await this.client.get(
        `/workspaces/${this.teamId}/docs/${documentId}/pageListing`,
        { params: options }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Failed to list pages for document ${documentId}`);
    }
  }

  /**
   * Gets the content of specific pages in a document
   * @param documentId - ID of the document
   * @param pageIds - Array of page IDs to retrieve
   * @param options - Options for retrieving pages content
   * @returns Document pages with content
   */
  async getDocumentPages(documentId: string, pageIds: string[], options: Partial<DocumentPagesOptions> = {}): Promise<DocumentPagesResponse> {
    try {
      // Get pages in parallel
      this.logOperation('Getting pages for document with ID:', { documentId, pageIds, options });
      const pagePromises = pageIds.map(pageId => 
        this.client.get(
          `/workspaces/${this.teamId}/docs/${documentId}/pages/${pageId}`,
          { params: { ...options, pageIds } }
        )
      );
      const responses = await Promise.all(pagePromises);
      const pages = responses.map(response => response.data);
      return { pages };
    } catch (error) {
      throw this.handleError(error, `Failed to get pages for document ${documentId}`);
    }
  }

  /**
   * Updates an existing page in a document
   * @param documentId - ID of the document containing the page
   * @param pageId - ID of the page to update
   * @param data - Updated page data
   * @returns Updated page
   */
  async updatePage(documentId: string, pageId: string, data: UpdateDocumentPageData): Promise<ClickUpDocumentPage> {
    try {
      this.logOperation('Updating page in document with ID:', { documentId, pageId, data });
      const response = await this.client.put(
        `/workspaces/${this.teamId}/docs/${documentId}/pages/${pageId}`,
        {
          ...data,
          content_format: data.content_format || 'text/md',
          content_edit_mode: data.content_edit_mode || 'append'
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Failed to update page ${pageId} in document ${documentId}`);
    }
  }
} 