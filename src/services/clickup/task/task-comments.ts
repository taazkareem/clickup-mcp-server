/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * ClickUp Task Service - Comments Module
 *
 * Handles comment operations for ClickUp tasks, including:
 * - Retrieving comments for a task
 * - Creating comments on a task
 *
 * REFACTORED: Now uses composition instead of inheritance.
 * Only depends on TaskServiceCore for base functionality.
 */

import { TaskServiceCore } from './task-core.js';
import { ClickUpComment } from '../types.js';

/**
 * Comments functionality for the TaskService
 *
 * This service handles all comment-related operations for ClickUp tasks.
 * It uses composition to access core functionality instead of inheritance.
 */
export class TaskServiceComments {
  constructor(private core: TaskServiceCore) {}
  /**
   * Get all comments for a task
   * 
   * @param taskId ID of the task to get comments for
   * @param start Optional pagination start
   * @param startId Optional comment ID to start from
   * @returns Array of task comments
   */
  async getTaskComments(taskId: string, start?: number, startId?: string): Promise<ClickUpComment[]> {
    (this.core as any).logOperation('getTaskComments', { taskId, start, startId });

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

      return await (this.core as any).makeRequest(async () => {
        const response = await (this.core as any).client.get(
          `/task/${taskId}/comment${queryString}`
        );
        return response.data.comments || [];
      });
    } catch (error) {
      throw (this.core as any).handleError(error, 'Failed to get task comments');
    }
  }

  /**
   * Get all comments for a task along with their threaded replies
   * 
   * @param taskId ID of the task to get comments and replies for
   * @returns Array of task comments with threaded replies included
   */
  async getTaskCommentsWithReplies(taskId: string): Promise<ClickUpComment[]> {
    (this.core as any).logOperation('getTaskCommentsWithReplies', { taskId });

    try {
      // First get all task comments
      const comments = await this.getTaskComments(taskId);
      
      // For each comment, try to fetch replies
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          try {
            // Try to fetch replies for each comment
            const replies = await (this.core as any).makeRequest(async () => {
              const response = await (this.core as any).client.get(
                `/comment/${comment.id}/reply`
              );
              return response.data.comments || [];
            });
            
            // Only add replies if there are any
            if (replies.length > 0) {
              return {
                ...comment,
                replies: replies
              };
            }
          } catch (replyError) {
            // If fetching replies fails, it might mean there are no replies
            // or the user doesn't have permission to view them
            // In either case, we'll just return the comment as is
          }
          
          // Return comment as is
          return comment;
        })
      );

      return commentsWithReplies;
    } catch (error) {
      throw (this.core as any).handleError(error, 'Failed to get task comments with replies');
    }
  }

  /**
   * Create a comment on a task
   * 
   * @param taskId ID of the task to comment on
   * @param commentText Text content of the comment
   * @param notifyAll Whether to notify all assignees
   * @param assignee Optional user ID to assign the comment to
   * @returns The created comment
   */
  async createTaskComment(
    taskId: string,
    commentText: string,
    notifyAll: boolean = false,
    assignee?: number | null
  ): Promise<ClickUpComment> {
    (this.core as any).logOperation('createTaskComment', { taskId, commentText, notifyAll, assignee });

    try {
      const payload: {
        comment_text: string;
        notify_all: boolean;
        assignee?: number;
      } = {
        comment_text: commentText,
        notify_all: notifyAll
      };

      if (assignee) {
        payload.assignee = assignee;
      }

      // Make the request directly without using makeRequest for better error handling
      const response = await (this.core as any).client.post(
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
      
      throw (this.core as any).handleError(error, 'Failed to create task comment');
    }
  }
}

