/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * ClickUp MCP Task Operation Handlers
 * 
 * This module implements the handlers for task operations, both for single task
 * and bulk operations. These handlers are used by the tool definitions.
 */

import { ClickUpComment, ClickUpTask, TaskPriority, UpdateTaskData, TaskFilters, toTaskPriority, CreateTaskData, TaskSummary } from '../../services/clickup/types.js';
import { clickUpServices } from '../../services/shared.js';
import { BulkService } from '../../services/clickup/bulk.js';
import { BatchResult } from '../../utils/concurrency-utils.js';
import { parseDueDate } from '../utils.js';
import {
  validateTaskIdentification,
  validateListIdentification,
  validateTaskUpdateData,
  validateBulkTasks,
  parseBulkOptions,
  resolveListIdWithValidation,
  formatTaskData
} from './utilities.js';
import { TaskService } from '../../services/clickup/task/task-service.js';
import { ExtendedTaskFilters } from '../../services/clickup/types.js';
import { handleResolveAssignees } from '../member.js';
import { findListIDByName } from '../list.js';
import { workspaceService } from '../../services/shared.js';
import { isNameMatch } from '../../utils/resolver-utils.js';
import { Logger } from '../../logger.js';

// Use shared services instance
const { task: taskService, list: listService } = clickUpServices;

// Create a bulk service instance that uses the task service
const bulkService = new BulkService(taskService);

// Create a logger instance for task handlers
const logger = new Logger('TaskHandlers');

// Token limit constant for workspace tasks
const WORKSPACE_TASKS_TOKEN_LIMIT = 50000;

// Cache for task context between sequential operations
const taskContextCache = new Map<string, { id: string, timestamp: number }>();
const TASK_CONTEXT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Store task context for sequential operations
 */
function storeTaskContext(taskName: string, taskId: string) {
  taskContextCache.set(taskName, {
    id: taskId,
    timestamp: Date.now()
  });
}

/**
 * Get cached task context if valid
 */
function getCachedTaskContext(taskName: string): string | null {
  const context = taskContextCache.get(taskName);
  if (!context) return null;

  if (Date.now() - context.timestamp > TASK_CONTEXT_TTL) {
    taskContextCache.delete(taskName);
    return null;
  }

  return context.id;
}

//=============================================================================
// SHARED UTILITY FUNCTIONS
//=============================================================================

/**
 * Parse time estimate string into minutes
 * Supports formats like "2h 30m", "150m", "2.5h"
 */
function parseTimeEstimate(timeEstimate: string | number): number {
  // If it's already a number, return it directly
  if (typeof timeEstimate === 'number') {
    return timeEstimate;
  }

  if (!timeEstimate || typeof timeEstimate !== 'string') return 0;

  // If it's just a number as string, parse it
  if (/^\d+$/.test(timeEstimate)) {
    return parseInt(timeEstimate, 10);
  }

  let totalMinutes = 0;

  // Extract hours
  const hoursMatch = timeEstimate.match(/(\d+\.?\d*)h/);
  if (hoursMatch) {
    totalMinutes += parseFloat(hoursMatch[1]) * 60;
  }

  // Extract minutes
  const minutesMatch = timeEstimate.match(/(\d+)m/);
  if (minutesMatch) {
    totalMinutes += parseInt(minutesMatch[1], 10);
  }

  return Math.round(totalMinutes); // Return minutes
}

/**
 * Resolve assignees from mixed input (user IDs, emails, usernames) to user IDs
 */
async function resolveAssignees(assignees: (number | string)[]): Promise<number[]> {
  if (!assignees || !Array.isArray(assignees) || assignees.length === 0) {
    return [];
  }

  const resolved: number[] = [];
  const toResolve: string[] = [];

  // Separate numeric IDs from strings that need resolution
  for (const assignee of assignees) {
    if (typeof assignee === 'number') {
      resolved.push(assignee);
    } else if (typeof assignee === 'string') {
      // Check if it's a numeric string
      const numericId = parseInt(assignee, 10);
      if (!isNaN(numericId) && numericId.toString() === assignee) {
        resolved.push(numericId);
      } else {
        // It's an email or username that needs resolution
        toResolve.push(assignee);
      }
    }
  }

  // Resolve emails/usernames to user IDs if any
  if (toResolve.length > 0) {
    try {
      const result = await handleResolveAssignees({ assignees: toResolve });
      // The result is wrapped by sponsorService.createResponse, so we need to parse the JSON
      if (result.content && Array.isArray(result.content) && result.content.length > 0) {
        const dataText = result.content[0].text;
        const parsedData = JSON.parse(dataText);
        if (parsedData.userIds && Array.isArray(parsedData.userIds)) {
          for (const userId of parsedData.userIds) {
            if (userId !== null && typeof userId === 'number') {
              resolved.push(userId);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Failed to resolve some assignees:', error.message);
      // Continue with the IDs we could resolve
    }
  }

  return resolved;
}

/**
 * Build task update data from parameters
 */
async function buildUpdateData(params: any): Promise<UpdateTaskData> {
  const updateData: UpdateTaskData = {};

  if (params.name !== undefined) updateData.name = params.name;
  if (params.description !== undefined) updateData.description = params.description;
  if (params.markdown_description !== undefined) updateData.markdown_description = params.markdown_description;
  if (params.status !== undefined) updateData.status = params.status;

  // Use toTaskPriority to properly handle null values and validation
  if (params.priority !== undefined) {
    updateData.priority = toTaskPriority(params.priority);
  }

  if (params.dueDate !== undefined) {
    const parsedDueDate = parseDueDate(params.dueDate);
    if (parsedDueDate !== undefined) {
      updateData.due_date = parsedDueDate;
      updateData.due_date_time = true;
    } else {
      // Clear the due date by setting it to null
      updateData.due_date = null;
      updateData.due_date_time = false;
    }
  }

  if (params.startDate !== undefined) {
    const parsedStartDate = parseDueDate(params.startDate);
    if (parsedStartDate !== undefined) {
      updateData.start_date = parsedStartDate;
      updateData.start_date_time = true;
    } else {
      // Clear the start date by setting it to null
      updateData.start_date = null;
      updateData.start_date_time = false;
    }
  }

  // Handle time estimate if provided - convert from string to minutes
  if (params.time_estimate !== undefined) {
    // Log the time estimate for debugging
    console.log(`Original time_estimate: ${params.time_estimate}, typeof: ${typeof params.time_estimate}`);

    // Parse and convert to number in minutes
    const minutes = parseTimeEstimate(params.time_estimate);

    console.log(`Converted time_estimate: ${minutes}`);
    updateData.time_estimate = minutes;
  }

  // Handle custom fields if provided
  if (params.custom_fields !== undefined) {
    updateData.custom_fields = params.custom_fields;
  }

  // Handle assignees if provided - resolve emails/usernames to user IDs
  if (params.assignees !== undefined) {
    // Parse assignees if it's a string (from MCP serialization)
    let assigneesArray = params.assignees;
    if (typeof params.assignees === 'string') {
      try {
        assigneesArray = JSON.parse(params.assignees);
      } catch (error) {
        console.warn('Failed to parse assignees string:', params.assignees, error);
        assigneesArray = [];
      }
    }

    const resolvedAssignees = await resolveAssignees(assigneesArray);

    // Store the resolved assignees for processing in the updateTask method
    // The actual add/rem logic will be handled there based on current vs new assignees
    updateData.assignees = resolvedAssignees;
  }

  return updateData;
}

/**
 * Core function to find a task by ID or name
 * This consolidates all task lookup logic in one place for consistency
 */
async function findTask(params: {
  taskId?: string,
  taskName?: string,
  listName?: string,
  customTaskId?: string,
  requireId?: boolean,
  includeSubtasks?: boolean
}) {
  const { taskId, taskName, listName, customTaskId, requireId = false, includeSubtasks = false } = params;

  // Validate that we have enough information to identify a task
  const validationResult = validateTaskIdentification(
    { taskId, taskName, listName, customTaskId },
    { requireTaskId: requireId, useGlobalLookup: true }
  );

  if (!validationResult.isValid) {
    throw new Error(validationResult.errorMessage);
  }

  try {
    // Direct path for taskId - most efficient (now includes automatic custom ID detection)
    if (taskId) {
      const task = await taskService.getTask(taskId);

      // Add subtasks if requested
      if (includeSubtasks) {
        const subtasks = await taskService.getSubtasks(task.id);
        return { task, subtasks };
      }

      return { task };
    }

    // Direct path for customTaskId - for explicit custom ID requests
    // Note: This is now mainly for backward compatibility since getTask() handles custom IDs automatically
    if (customTaskId) {
      const task = await taskService.getTaskByCustomId(customTaskId);

      // Add subtasks if requested
      if (includeSubtasks) {
        const subtasks = await taskService.getSubtasks(task.id);
        return { task, subtasks };
      }

      return { task };
    }

    // Special optimized path for taskName + listName combination
    if (taskName && listName) {
      const listId = await resolveListIdWithValidation(null, listName);

      // Get all tasks in the list
      const allTasks = await taskService.getTasks(listId);

      // Find the task that matches the name
      const matchingTask = findTaskByName(allTasks, taskName);

      if (!matchingTask) {
        throw new Error(`Task "${taskName}" not found in list "${listName}"`);
      }

      // Add subtasks if requested
      if (includeSubtasks) {
        const subtasks = await taskService.getSubtasks(matchingTask.id);
        return { task: matchingTask, subtasks };
      }

      return { task: matchingTask };
    }

    // Fallback to searching all lists for taskName-only case
    if (taskName) {
      logger.debug(`Searching all lists for task: "${taskName}"`);

      // Get workspace hierarchy which contains all lists
      const hierarchy = await workspaceService.getWorkspaceHierarchy();

      // Extract all list IDs from the hierarchy
      const listIds: string[] = [];
      const extractListIds = (node: any) => {
        if (node.type === 'list') {
          listIds.push(node.id);
        }
        if (node.children) {
          node.children.forEach(extractListIds);
        }
      };

      // Start from the root's children
      hierarchy.root.children.forEach(extractListIds);

      // Search through each list
      const searchPromises = listIds.map(async (listId) => {
        try {
          const tasks = await taskService.getTasks(listId);
          const matchingTask = findTaskByName(tasks, taskName);
          if (matchingTask) {
            logger.debug(`Found task "${matchingTask.name}" (ID: ${matchingTask.id}) in list with ID "${listId}"`);
            return matchingTask;
          }
          return null;
        } catch (error) {
          logger.warn(`Error searching list ${listId}: ${error.message}`);
          return null;
        }
      });

      // Wait for all searches to complete
      const results = await Promise.all(searchPromises);

      // Filter out null results and sort by match quality and recency
      const matchingTasks = results
        .filter(task => task !== null)
        .sort((a, b) => {
          const aMatch = isNameMatch(a.name, taskName);
          const bMatch = isNameMatch(b.name, taskName);

          // First sort by match quality
          if (bMatch.score !== aMatch.score) {
            return bMatch.score - aMatch.score;
          }

          // Then sort by recency
          return parseInt(b.date_updated) - parseInt(a.date_updated);
        });

      if (matchingTasks.length === 0) {
        throw new Error(`Task "${taskName}" not found in any list across your workspace. Please check the task name and try again.`);
      }

      const bestMatch = matchingTasks[0];

      // Add subtasks if requested
      if (includeSubtasks) {
        const subtasks = await taskService.getSubtasks(bestMatch.id);
        return { task: bestMatch, subtasks };
      }

      return { task: bestMatch };
    }

    // We shouldn't reach here if validation is working correctly
    throw new Error("No valid task identification provided");

  } catch (error) {
    // Enhance error message for non-existent tasks
    if (taskName && error.message.includes('not found')) {
      throw new Error(`Task "${taskName}" not found. Please check the task name and try again.`);
    }

    // Pass along other formatted errors
    throw error;
  }
}

/**
 * Helper function to find a task by name in an array of tasks
 */
function findTaskByName(tasks, name) {
  if (!tasks || !Array.isArray(tasks) || !name) return null;

  const normalizedSearchName = name.toLowerCase().trim();

  // Get match scores for all tasks
  const taskMatchScores = tasks.map(task => {
    const matchResult = isNameMatch(task.name, name);
    return {
      task,
      matchResult,
      // Parse the date_updated field as a number for sorting
      updatedAt: task.date_updated ? parseInt(task.date_updated, 10) : 0
    };
  }).filter(result => result.matchResult.isMatch);

  if (taskMatchScores.length === 0) {
    return null;
  }

  // First, try to find exact matches
  const exactMatches = taskMatchScores
    .filter(result => result.matchResult.exactMatch)
    .sort((a, b) => {
      // For exact matches with the same score, sort by most recently updated
      if (b.matchResult.score === a.matchResult.score) {
        return b.updatedAt - a.updatedAt;
      }
      return b.matchResult.score - a.matchResult.score;
    });

  // Get the best matches based on whether we have exact matches or need to fall back to fuzzy matches
  const bestMatches = exactMatches.length > 0 ? exactMatches : taskMatchScores.sort((a, b) => {
    // First sort by match score (highest first)
    if (b.matchResult.score !== a.matchResult.score) {
      return b.matchResult.score - a.matchResult.score;
    }
    // Then sort by most recently updated
    return b.updatedAt - a.updatedAt;
  });

  // Get the best match
  return bestMatches[0].task;
}

/**
 * Handler for getting a task - uses the consolidated findTask function
 */
export async function getTaskHandler(params) {
  try {
    const result = await findTask({
      taskId: params.taskId,
      taskName: params.taskName,
      listName: params.listName,
      customTaskId: params.customTaskId,
      includeSubtasks: params.subtasks
    });

    if (result.subtasks) {
      return { ...result.task, subtasks: result.subtasks };
    }

    return result.task;
  } catch (error) {
    throw error;
  }
}

/**
 * Get task ID from various identifiers - uses the consolidated findTask function
 */
export async function getTaskId(taskId?: string, taskName?: string, listName?: string, customTaskId?: string, requireId?: boolean, includeSubtasks?: boolean): Promise<string> {
  // Check task context cache first if we have a task name
  if (taskName && !taskId && !customTaskId) {
    const cachedId = getCachedTaskContext(taskName);
    if (cachedId) {
      return cachedId;
    }
  }

  const result = await findTask({
    taskId,
    taskName,
    listName,
    customTaskId,
    requireId,
    includeSubtasks
  });

  // Store task context for future operations
  if (taskName && result.task.id) {
    storeTaskContext(taskName, result.task.id);
  }

  return result.task.id;
}

/**
 * Process a list identification validation, returning the list ID
 */
async function getListId(listId?: string, listName?: string): Promise<string> {
  validateListIdentification(listId, listName);
  return await resolveListIdWithValidation(listId, listName);
}

/**
 * Extract and build task filters from parameters
 */
function buildTaskFilters(params: any): TaskFilters {
  const { subtasks, statuses, page, order_by, reverse } = params;
  const filters: TaskFilters = {};

  if (subtasks !== undefined) filters.subtasks = subtasks;
  if (statuses !== undefined) filters.statuses = statuses;
  if (page !== undefined) filters.page = page;
  if (order_by !== undefined) filters.order_by = order_by;
  if (reverse !== undefined) filters.reverse = reverse;

  return filters;
}

/**
 * Map tasks for bulk operations, resolving task IDs
 * Uses smart disambiguation for tasks without list context
 */
async function mapTaskIds(tasks: any[]): Promise<string[]> {
  return Promise.all(tasks.map(async (task) => {
    const validationResult = validateTaskIdentification(
      { taskId: task.taskId, taskName: task.taskName, listName: task.listName, customTaskId: task.customTaskId },
      { useGlobalLookup: true }
    );

    if (!validationResult.isValid) {
      throw new Error(validationResult.errorMessage);
    }

    return await getTaskId(task.taskId, task.taskName, task.listName, task.customTaskId);
  }));
}

//=============================================================================
// SINGLE TASK OPERATIONS
//=============================================================================

/**
 * Handler for creating a task
 */
export async function createTaskHandler(params) {
  const {
    name,
    description,
    markdown_description,
    status,
    dueDate,
    startDate,
    parent,
    tags,
    custom_fields,
    check_required_custom_fields,
    assignees
  } = params;

  if (!name) throw new Error("Task name is required");

  // Use our helper function to validate and convert priority
  const priority = toTaskPriority(params.priority);

  const listId = await getListId(params.listId, params.listName);

  // Resolve assignees if provided
  let resolvedAssignees = undefined;
  if (assignees) {
    // Parse assignees if it's a string (from MCP serialization)
    let assigneesArray = assignees;
    if (typeof assignees === 'string') {
      try {
        assigneesArray = JSON.parse(assignees);
      } catch (error) {
        console.warn('Failed to parse assignees string in createTask:', assignees, error);
        assigneesArray = [];
      }
    }
    resolvedAssignees = await resolveAssignees(assigneesArray);
  }

  const taskData: CreateTaskData = {
    name,
    description,
    markdown_description,
    status,
    parent,
    tags,
    custom_fields,
    check_required_custom_fields,
    assignees: resolvedAssignees
  };

  // Only include priority if explicitly provided by the user
  if (priority !== undefined) {
    taskData.priority = priority;
  }

  // Add due date if specified
  if (dueDate) {
    taskData.due_date = parseDueDate(dueDate);
    taskData.due_date_time = true;
  }

  // Add start date if specified
  if (startDate) {
    taskData.start_date = parseDueDate(startDate);
    taskData.start_date_time = true;
  }

  return await taskService.createTask(listId, taskData);
}



/**
 * Handler for updating a task
 */
export async function updateTaskHandler(
  taskService: TaskService,
  params: UpdateTaskData & {
    taskId?: string;
    taskName?: string;
    listName?: string;
    customTaskId?: string;
  }
): Promise<ClickUpTask> {
  const { taskId, taskName, listName, customTaskId, ...rawUpdateData } = params;

  // Validate task identification with global lookup enabled
  const validationResult = validateTaskIdentification(params, { useGlobalLookup: true });
  if (!validationResult.isValid) {
    throw new Error(validationResult.errorMessage);
  }

  // Build properly formatted update data from raw parameters (now async)
  const updateData = await buildUpdateData(rawUpdateData);

  // Validate update data
  validateTaskUpdateData(updateData);

  try {
    // Get the task ID using global lookup
    const id = await getTaskId(taskId, taskName, listName, customTaskId);
    return await taskService.updateTask(id, updateData);
  } catch (error) {
    throw new Error(`Failed to update task: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Handler for moving a task
 */
export async function moveTaskHandler(params) {
  const taskId = await getTaskId(params.taskId, params.taskName, undefined, params.customTaskId, false);
  const listId = await getListId(params.listId, params.listName);
  return await taskService.moveTask(taskId, listId);
}

/**
 * Handler for duplicating a task
 */
export async function duplicateTaskHandler(params) {
  const taskId = await getTaskId(params.taskId, params.taskName, undefined, params.customTaskId, false);
  let listId;

  if (params.listId || params.listName) {
    listId = await getListId(params.listId, params.listName);
  }

  return await taskService.duplicateTask(taskId, listId);
}

/**
 * Handler for getting tasks
 */
export async function getTasksHandler(params) {
  const listId = await getListId(params.listId, params.listName);
  return await taskService.getTasks(listId, buildTaskFilters(params));
}

/**
 * Handler for getting task comments
 */
export async function getTaskCommentsHandler(params) {
  const taskId = await getTaskId(params.taskId, params.taskName, params.listName);
  const { start, startId } = params;
  return await taskService.getTaskComments(taskId, start, startId);
}

/**
 * Handler for creating a task comment
 */
export async function createTaskCommentHandler(params) {
  // Validate required parameters - either commentText or formattedComment must be provided
  if (!params.commentText && !params.formattedComment) {
    throw new Error('Either commentText or formattedComment is required');
  }

  try {
    // Resolve the task ID
    const taskId = await getTaskId(params.taskId, params.taskName, params.listName);

    // Extract other parameters with defaults
    const {
      commentText = '',
      formattedComment,
      notifyAll = false,
      assignee = null
    } = params;

    // Create the comment
    return await taskService.createTaskComment(taskId, commentText, notifyAll, assignee, formattedComment);
  } catch (error) {
    // If this is a task lookup error, provide more helpful message
    if (error.message?.includes('not found') || error.message?.includes('identify task')) {
      if (params.taskName) {
        throw new Error(`Could not find task "${params.taskName}" in list "${params.listName}"`);
      } else {
        throw new Error(`Task with ID "${params.taskId}" not found`);
      }
    }

    // Otherwise, rethrow the original error
    throw error;
  }
}

/**
 * Estimate tokens for a task response
 * This is a simplified estimation - adjust based on actual token counting needs
 */
function estimateTaskResponseTokens(task: ClickUpTask): number {
  // Base estimation for task structure
  let tokenCount = 0;

  // Core fields
  tokenCount += (task.name?.length || 0) / 4; // Approximate tokens for name
  tokenCount += (task.description?.length || 0) / 4; // Approximate tokens for description
  tokenCount += (task.text_content?.length || 0) / 4; // Use text_content instead of markdown_description

  // Status and other metadata
  tokenCount += 5; // Basic metadata fields

  // Custom fields
  if (task.custom_fields) {
    tokenCount += Object.keys(task.custom_fields).length * 10; // Rough estimate per custom field
  }

  // Add overhead for JSON structure
  tokenCount *= 1.1;

  return Math.ceil(tokenCount);
}

/**
 * Check if response would exceed token limit
 */
function wouldExceedTokenLimit(response: any): boolean {
  if (!response.tasks?.length) return false;

  // Calculate total estimated tokens
  const totalTokens = response.tasks.reduce((sum: number, task: ClickUpTask) =>
    sum + estimateTaskResponseTokens(task), 0
  );

  // Add overhead for response structure
  const estimatedTotal = totalTokens * 1.1;

  return estimatedTotal > WORKSPACE_TASKS_TOKEN_LIMIT;
}

/**
 * Handler for getting workspace tasks with filtering
 */
export async function getWorkspaceTasksHandler(
  taskService: TaskService,
  params: Record<string, any>
): Promise<Record<string, any>> {
  try {
    // Require at least one filter parameter
    const hasFilter = [
      'tags',
      'list_ids',
      'folder_ids',
      'space_ids',
      'statuses',
      'assignees',
      'date_created_gt',
      'date_created_lt',
      'date_updated_gt',
      'date_updated_lt',
      'due_date_gt',
      'due_date_lt'
    ].some(key => params[key] !== undefined);

    if (!hasFilter) {
      throw new Error('At least one filter parameter is required (tags, list_ids, folder_ids, space_ids, statuses, assignees, or date filters)');
    }

    // Check if list_ids are provided for enhanced filtering via Views API
    if (params.list_ids && params.list_ids.length > 0) {
      logger.info('Using Views API for enhanced list filtering', {
        listIds: params.list_ids,
        listCount: params.list_ids.length
      });

      // Warning for broad queries
      const hasOnlyListIds = Object.keys(params).filter(key =>
        params[key] !== undefined && key !== 'list_ids' && key !== 'detail_level'
      ).length === 0;

      if (hasOnlyListIds && params.list_ids.length > 5) {
        logger.warn('Broad query detected: many lists with no additional filters', {
          listCount: params.list_ids.length,
          recommendation: 'Consider adding additional filters (tags, statuses, assignees, etc.) for better performance'
        });
      }

      // Use Views API for enhanced list filtering
      let allTasks: ClickUpTask[] = [];
      const processedTaskIds = new Set<string>();

      // Create promises for concurrent fetching
      const fetchPromises = params.list_ids.map(async (listId: string) => {
        try {
          // Get the default list view ID
          const viewId = await taskService.getListViews(listId);

          if (!viewId) {
            logger.warn(`No default view found for list ${listId}, skipping`);
            return [];
          }

          // Extract filters supported by the Views API
          const supportedFilters: ExtendedTaskFilters = {
            subtasks: params.subtasks,
            include_closed: params.include_closed,
            archived: params.archived,
            order_by: params.order_by,
            reverse: params.reverse,
            page: params.page,
            statuses: params.statuses,
            assignees: params.assignees,
            date_created_gt: params.date_created_gt,
            date_created_lt: params.date_created_lt,
            date_updated_gt: params.date_updated_gt,
            date_updated_lt: params.date_updated_lt,
            due_date_gt: params.due_date_gt,
            due_date_lt: params.due_date_lt,
            custom_fields: params.custom_fields
          };

          // Get tasks from the view
          const tasksFromView = await taskService.getTasksFromView(viewId, supportedFilters);
          return tasksFromView;

        } catch (error) {
          logger.error(`Failed to get tasks from list ${listId}`, { error: error.message });
          return []; // Continue with other lists even if one fails
        }
      });

      // Execute all fetches concurrently
      const taskArrays = await Promise.all(fetchPromises);

      // Aggregate tasks and remove duplicates
      for (const tasks of taskArrays) {
        for (const task of tasks) {
          if (!processedTaskIds.has(task.id)) {
            allTasks.push(task);
            processedTaskIds.add(task.id);
          }
        }
      }

      logger.info('Aggregated tasks from Views API', {
        totalTasks: allTasks.length,
        uniqueTasks: processedTaskIds.size
      });

      // Apply client-side filtering for unsupported filters
      if (params.tags && params.tags.length > 0) {
        allTasks = allTasks.filter(task =>
          params.tags.every((tag: string) =>
            task.tags.some(t => t.name === tag)
          )
        );
        logger.debug('Applied client-side tag filtering', {
          tags: params.tags,
          remainingTasks: allTasks.length
        });
      }

      if (params.folder_ids && params.folder_ids.length > 0) {
        allTasks = allTasks.filter(task =>
          task.folder && params.folder_ids.includes(task.folder.id)
        );
        logger.debug('Applied client-side folder filtering', {
          folderIds: params.folder_ids,
          remainingTasks: allTasks.length
        });
      }

      if (params.space_ids && params.space_ids.length > 0) {
        allTasks = allTasks.filter(task =>
          params.space_ids.includes(task.space.id)
        );
        logger.debug('Applied client-side space filtering', {
          spaceIds: params.space_ids,
          remainingTasks: allTasks.length
        });
      }

      // Check token limit and format response
      const shouldUseSummary = params.detail_level === 'summary' || wouldExceedTokenLimit({ tasks: allTasks });

      if (shouldUseSummary) {
        logger.info('Using summary format for Views API response', {
          totalTasks: allTasks.length,
          reason: params.detail_level === 'summary' ? 'requested' : 'token_limit'
        });

        return {
          summaries: allTasks.map(task => ({
            id: task.id,
            name: task.name,
            status: task.status.status,
            list: {
              id: task.list.id,
              name: task.list.name
            },
            due_date: task.due_date,
            url: task.url,
            priority: task.priority?.priority || null,
            tags: task.tags.map(tag => ({
              name: tag.name,
              tag_bg: tag.tag_bg,
              tag_fg: tag.tag_fg
            }))
          })),
          total_count: allTasks.length,
          has_more: false,
          next_page: 0
        };
      }

      return {
        tasks: allTasks,
        total_count: allTasks.length,
        has_more: false,
        next_page: 0
      };
    }

    // Fallback to existing workspace-wide task retrieval when list_ids are not provided
    logger.info('Using standard workspace task retrieval');

    const filters: ExtendedTaskFilters = {
      tags: params.tags,
      list_ids: params.list_ids,
      folder_ids: params.folder_ids,
      space_ids: params.space_ids,
      statuses: params.statuses,
      include_closed: params.include_closed,
      include_archived_lists: params.include_archived_lists,
      include_closed_lists: params.include_closed_lists,
      archived: params.archived,
      order_by: params.order_by,
      reverse: params.reverse,
      due_date_gt: params.due_date_gt,
      due_date_lt: params.due_date_lt,
      date_created_gt: params.date_created_gt,
      date_created_lt: params.date_created_lt,
      date_updated_gt: params.date_updated_gt,
      date_updated_lt: params.date_updated_lt,
      assignees: params.assignees,
      page: params.page,
      detail_level: params.detail_level || 'detailed',
      subtasks: params.subtasks,
      include_subtasks: params.include_subtasks,
      include_compact_time_entries: params.include_compact_time_entries,
      custom_fields: params.custom_fields
    };

    // Get tasks with adaptive response format support
    const response = await taskService.getWorkspaceTasks(filters);

    // Check token limit at handler level
    if (params.detail_level !== 'summary' && wouldExceedTokenLimit(response)) {
      logger.info('Response would exceed token limit, fetching summary format instead');

      // Refetch with summary format
      const summaryResponse = await taskService.getWorkspaceTasks({
        ...filters,
        detail_level: 'summary'
      });

      return summaryResponse;
    }

    // Return the response without adding the redundant _note field
    return response;
  } catch (error) {
    throw new Error(`Failed to get workspace tasks: ${error.message}`);
  }
}

//=============================================================================
// BULK TASK OPERATIONS
//=============================================================================

/**
 * Handler for creating multiple tasks
 */
export async function createBulkTasksHandler(params: any) {
  const { tasks, listId, listName, options } = params;

  // Validate tasks array
  validateBulkTasks(tasks, 'create');

  // Validate and resolve list ID
  const targetListId = await resolveListIdWithValidation(listId, listName);

  // Format tasks for creation - resolve assignees for each task
  const formattedTasks: CreateTaskData[] = await Promise.all(tasks.map(async task => {
    // Resolve assignees if provided
    const resolvedAssignees = task.assignees ? await resolveAssignees(task.assignees) : undefined;

    const taskData: CreateTaskData = {
      name: task.name,
      description: task.description,
      markdown_description: task.markdown_description,
      status: task.status,
      tags: task.tags,
      custom_fields: task.custom_fields,
      assignees: resolvedAssignees
    };

    // Only include priority if explicitly provided by the user
    const priority = toTaskPriority(task.priority);
    if (priority !== undefined) {
      taskData.priority = priority;
    }

    // Add due date if specified
    if (task.dueDate) {
      taskData.due_date = parseDueDate(task.dueDate);
      taskData.due_date_time = true;
    }

    // Add start date if specified
    if (task.startDate) {
      taskData.start_date = parseDueDate(task.startDate);
      taskData.start_date_time = true;
    }

    return taskData;
  }));

  // Parse bulk options
  const bulkOptions = parseBulkOptions(options);

  // Create tasks - pass arguments in correct order: listId, tasks, options
  return await bulkService.createTasks(targetListId, formattedTasks, bulkOptions);
}

/**
 * Handler for updating multiple tasks
 */
export async function updateBulkTasksHandler(params: any) {
  const { tasks, options } = params;

  // Validate tasks array
  validateBulkTasks(tasks, 'update');

  // Parse bulk options
  const bulkOptions = parseBulkOptions(options);

  // Update tasks
  return await bulkService.updateTasks(tasks, bulkOptions);
}

/**
 * Handler for moving multiple tasks
 */
export async function moveBulkTasksHandler(params: any) {
  const { tasks, targetListId, targetListName, options } = params;

  // Validate tasks array
  validateBulkTasks(tasks, 'move');

  // Validate and resolve target list ID
  const resolvedTargetListId = await resolveListIdWithValidation(targetListId, targetListName);

  // Parse bulk options
  const bulkOptions = parseBulkOptions(options);

  // Move tasks
  return await bulkService.moveTasks(tasks, resolvedTargetListId, bulkOptions);
}

/**
 * Handler for deleting multiple tasks
 */
export async function deleteBulkTasksHandler(params: any) {
  const { tasks, options } = params;

  // Validate tasks array
  validateBulkTasks(tasks, 'delete');

  // Parse bulk options
  const bulkOptions = parseBulkOptions(options);

  // Delete tasks
  return await bulkService.deleteTasks(tasks, bulkOptions);
}

/**
 * Handler for deleting a task
 */
export async function deleteTaskHandler(params) {
  const taskId = await getTaskId(params.taskId, params.taskName, params.listName);
  await taskService.deleteTask(taskId);
  return true;
} 