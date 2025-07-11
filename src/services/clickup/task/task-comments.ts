/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * ClickUp Task Service - Comments Module
 * 
 * Handles comment operations for ClickUp tasks, including:
 * - Retrieving comments for a task
 * - Creating comments on a task
 */

import { TaskServiceAttachments } from './task-attachments.js';
import { ClickUpComment, FormattedComment } from '../types.js';

/**
 * Comments functionality for the TaskService
 */
export class TaskServiceComments extends TaskServiceAttachments {
  /**
   * Get all comments for a task
   * 
   * @param taskId ID of the task to get comments for
   * @param start Optional pagination start
   * @param startId Optional comment ID to start from
   * @returns Array of task comments
   */
  async getTaskComments(taskId: string, start?: number, startId?: string): Promise<ClickUpComment[]> {
    this.logOperation('getTaskComments', { taskId, start, startId });
    
    try {
      // Build query parameters for pagination
      const queryParams = new URLSearchParams();
      if (start !== undefined) {
        queryParams.append('start', start.toString());
      }
      if (startId) {
        queryParams.append('start_id', startId);
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await this.client.get<{ comments: ClickUpComment[] }>(
        `/task/${taskId}/comment${queryString}`
      );
      
      return response.data.comments || [];
    } catch (error) {
      throw this.handleError(error, 'Failed to get task comments');
    }
  }

  /**
   * Create a comment on a task
   * 
   * @param taskId ID of the task to comment on
   * @param commentText Text content of the comment (used when formattedComment is not provided)
   * @param notifyAll Whether to notify all assignees
   * @param assignee Optional user ID to assign the comment to
   * @param formattedComment Optional formatted comment structure (takes precedence over commentText)
   * @returns The created comment
   */
  async createTaskComment(
    taskId: string, 
    commentText: string, 
    notifyAll: boolean = false,
    assignee?: number | null,
    formattedComment?: FormattedComment
  ): Promise<ClickUpComment> {
    this.logOperation('createTaskComment', { taskId, commentText, notifyAll, assignee, formattedComment });
    
    try {
      const payload: {
        comment_text?: string;
        comment?: FormattedComment;
        notify_all: boolean;
        assignee?: number;
      } = {
        notify_all: notifyAll
      };
      
      // Use formatted comment if provided, otherwise fall back to plain text
      if (formattedComment && formattedComment.length > 0) {
        payload.comment = formattedComment;
      } else {
        payload.comment_text = commentText;
      }
      
      if (assignee) {
        payload.assignee = assignee;
      }
      
      // Make the request directly without using makeRequest for better error handling
      const response = await this.client.post(
        `/task/${taskId}/comment`,
        payload
      );
      
      // Handle different response formats from ClickUp API
      if (response.data) {
        if (response.data.comment) {
          // Standard format: { comment: ClickUpComment }
          return response.data.comment;
        } else if (response.data.id && (response.data.comment_text || response.data.comment)) {
          // Direct format: the comment object itself
          return response.data as ClickUpComment;
        } else {
          // Fallback: construct a minimal valid comment object
          return {
            id: response.data.id || `custom-${Date.now()}`,
            comment: response.data.comment || commentText,
            comment_text: response.data.comment_text || commentText,
            user: response.data.user || { id: 0, username: 'Unknown', email: '', color: '' },
            date: response.data.date || new Date().toISOString(),
            resolved: false
          } as ClickUpComment;
        }
      }
      
      throw new Error('Invalid response from ClickUp API');
    } catch (error: any) {
      // Check if comment might have been created despite error
      if (error.response?.status === 200 || error.response?.status === 201) {
        // Try to construct a comment object from what we know
        return {
          id: `fallback-${Date.now()}`,
          comment: commentText,
          comment_text: commentText, 
          user: { id: 0, username: 'Unknown', email: '', color: '' },
          date: new Date().toISOString(),
          resolved: false
        } as ClickUpComment;
      }
      
      throw this.handleError(error, 'Failed to create task comment');
    }
  }
}

