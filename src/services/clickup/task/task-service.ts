/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * ClickUp Task Service
 *
 * Complete task service combining all task-related functionality
 *
 * REFACTORED: Now uses composition instead of linear inheritance.
 * Extends TaskServiceCore and composes other services as properties.
 */

import { TaskServiceCore } from './task-core.js';
import { TaskServiceSearch } from './task-search.js';
import { TaskServiceAttachments } from './task-attachments.js';
import { TaskServiceComments } from './task-comments.js';
import { TaskServiceTags } from './task-tags.js';
import { TaskServiceCustomFields } from './task-custom-fields.js';
import { WorkspaceService } from '../workspace.js';
import {
  ClickUpTask,
  UpdateTaskData,
  ClickUpComment,
  ClickUpTag,
  ClickUpTaskAttachment,
  ExtendedTaskFilters,
  DetailedTaskResponse,
  WorkspaceTasksResponse
} from '../types.js';
import { CustomFieldValue } from './task-custom-fields.js';

/**
 * Complete TaskService combining all task-related functionality
 *
 * This service uses composition to provide access to all task operations
 * while maintaining clean separation of concerns and eliminating artificial
 * dependencies between service modules.
 */
export class TaskService extends TaskServiceCore {
  public readonly search: TaskServiceSearch;
  public readonly attachments: TaskServiceAttachments;
  public readonly comments: TaskServiceComments;
  public readonly tags: TaskServiceTags;
  public readonly customFields: TaskServiceCustomFields;

  constructor(apiKey: string, teamId: string, baseUrl?: string, workspaceService?: WorkspaceService) {
    super(apiKey, teamId, baseUrl, workspaceService);
    this.logOperation('constructor', { initialized: true });

    // Initialize composed services with core as dependency
    this.search = new TaskServiceSearch(this);
    this.attachments = new TaskServiceAttachments(this);
    this.comments = new TaskServiceComments(this);
    this.tags = new TaskServiceTags(this);
    this.customFields = new TaskServiceCustomFields(this);
  }

  // ===== DELEGATED SEARCH METHODS =====

  async findTaskByName(listId: string, taskName: string): Promise<ClickUpTask | null> {
    return this.search.findTaskByName(listId, taskName);
  }

  async getWorkspaceTasks(filters: ExtendedTaskFilters = {}): Promise<DetailedTaskResponse | WorkspaceTasksResponse> {
    return this.search.getWorkspaceTasks(filters);
  }

  async getTaskSummaries(filters: ExtendedTaskFilters = {}): Promise<WorkspaceTasksResponse> {
    return this.search.getTaskSummaries(filters);
  }

  async getListViews(listId: string): Promise<string | null> {
    return this.search.getListViews(listId);
  }

  async getTasksFromView(viewId: string, filters: ExtendedTaskFilters = {}): Promise<ClickUpTask[]> {
    return this.search.getTasksFromView(viewId, filters);
  }

  async getTaskDetails(filters: ExtendedTaskFilters = {}): Promise<DetailedTaskResponse> {
    return this.search.getTaskDetails(filters);
  }

  async updateTaskByName(listId: string, taskName: string, updateData: UpdateTaskData): Promise<ClickUpTask> {
    return this.search.updateTaskByName(listId, taskName, updateData);
  }

  async findTaskByNameGlobally(taskName: string): Promise<ClickUpTask | null> {
    return this.search.findTaskByNameGlobally(taskName);
  }

  async findTasks(params: {
    taskId?: string;
    customTaskId?: string;
    taskName?: string;
    listId?: string;
    listName?: string;
    allowMultipleMatches?: boolean;
    useSmartDisambiguation?: boolean;
    includeFullDetails?: boolean;
    includeListContext?: boolean;
    requireExactMatch?: boolean;
  }): Promise<ClickUpTask | ClickUpTask[] | null> {
    return this.search.findTasks(params);
  }

  // ===== DELEGATED ATTACHMENT METHODS =====

  async uploadTaskAttachment(taskId: string, fileData: Buffer, fileName: string): Promise<ClickUpTaskAttachment> {
    return this.attachments.uploadTaskAttachment(taskId, fileData, fileName);
  }

  async uploadTaskAttachmentFromUrl(taskId: string, fileUrl: string, fileName?: string, authHeader?: string): Promise<ClickUpTaskAttachment> {
    return this.attachments.uploadTaskAttachmentFromUrl(taskId, fileUrl, fileName, authHeader);
  }

  // ===== DELEGATED COMMENT METHODS =====

  async getTaskComments(taskId: string, start?: number, startId?: string): Promise<ClickUpComment[]> {
    return this.comments.getTaskComments(taskId, start, startId);
  }

  async getTaskCommentsWithReplies(taskId: string): Promise<ClickUpComment[]> {
    return this.comments.getTaskCommentsWithReplies(taskId);
  }

  async createTaskComment(taskId: string, commentText: string, notifyAll?: boolean, assignee?: number): Promise<ClickUpComment> {
    return this.comments.createTaskComment(taskId, commentText, notifyAll, assignee);
  }

  // ===== DELEGATED TAG METHODS =====

  async addTagToTask(taskId: string, tagName: string): Promise<boolean> {
    return this.tags.addTagToTask(taskId, tagName);
  }

  async removeTagFromTask(taskId: string, tagName: string): Promise<boolean> {
    return this.tags.removeTagFromTask(taskId, tagName);
  }

  async getTaskTags(taskId: string): Promise<ClickUpTag[]> {
    return this.tags.getTaskTags(taskId);
  }

  async updateTaskTags(taskId: string, tagNames: string[]): Promise<boolean> {
    return this.tags.updateTaskTags(taskId, tagNames);
  }

  // ===== DELEGATED CUSTOM FIELD METHODS =====

  async setCustomFieldValue(taskId: string, fieldId: string, value: any): Promise<boolean> {
    return this.customFields.setCustomFieldValue(taskId, fieldId, value);
  }

  async setCustomFieldValues(taskId: string, customFields: CustomFieldValue[]): Promise<boolean> {
    return this.customFields.setCustomFieldValues(taskId, customFields);
  }

  async getCustomFieldValues(taskId: string): Promise<Record<string, any>> {
    return this.customFields.getCustomFieldValues(taskId);
  }

  async getCustomFieldValue(taskId: string, fieldId: string): Promise<any> {
    return this.customFields.getCustomFieldValue(taskId, fieldId);
  }
}