/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * ClickUp MCP Single Task Operations
 *
 * This module defines tools for single task operations including creating,
 * updating, moving, duplicating, and deleting tasks, as well as retrieving
 * task details and comments.
 */

import { 
  ClickUpComment,
  ClickUpTask, 
  CreateTaskData,
  TaskPriority, 
  UpdateTaskData
} from '../../services/clickup/types.js';
import { parseDueDate } from '../utils.js';
import { clickUpServices } from '../../services/shared.js';
import { 
  formatTaskData,
  resolveListIdWithValidation,
  validateTaskUpdateData,
  validateTaskIdentification,
  validateListIdentification
} from './utilities.js';

// Use shared services instance
const { task: taskService } = clickUpServices;

//=============================================================================
// COMMON VALIDATION UTILITIES
//=============================================================================

// Common validation functions
const validateTaskName = (name: string) => {
  if (!name || typeof name !== 'string') {
    throw new Error("A task name is required");
  }

  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    throw new Error("Task name cannot be empty or only whitespace");
  }
  return trimmedName;
};

const validatePriority = (priority?: number) => {
  if (priority !== undefined && (typeof priority !== 'number' || priority < 1 || priority > 4)) {
    throw new Error("Priority must be a number between 1 and 4");
  }
};

const validateDueDate = (dueDate?: string) => {
  if (dueDate && typeof dueDate !== 'string') {
    throw new Error("Due date must be a string in timestamp format or natural language");
  }
};

// Common error handler
const handleOperationError = (operation: string, error: any) => {
  console.error(`Error ${operation}:`, error);
  throw error;
};

//=============================================================================
// SINGLE TASK OPERATION TOOLS
//=============================================================================

/**
 * Tool definition for creating a single task
 */
export const createTaskTool = {
  name: "create_task",
  description: `Creates a single task in a ClickUp list. Use listId (preferred) or listName. Required: name + list info. For multiple tasks use create_bulk_tasks. Can create subtasks via parent param. Supports custom fields as array of {id, value}. Supports assignees as array of user IDs, emails, or usernames.`,
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "REQUIRED: Name of the task. Put a relevant emoji followed by a blank space before the name."
      },
      listId: {
        type: "string",
        description: "REQUIRED (unless listName provided): ID of the list to create the task in. If you have this ID from a previous response, use it directly rather than looking up by name."
      },
      listName: {
        type: "string",
        description: "REQUIRED (unless listId provided): Name of the list to create the task in - will automatically find the list by name."
      },
      description: {
        type: "string",
        description: "Optional plain text description for the task"
      },
      markdown_description: {
        type: "string",
        description: "Optional markdown formatted description for the task. If provided, this takes precedence over description"
      },
      status: {
        type: "string",
        description: "Optional: Override the default ClickUp status. In most cases, you should omit this to use ClickUp defaults"
      },
      priority: {
        type: "number",
        description: "Optional priority of the task (1-4), where 1 is urgent/highest priority and 4 is lowest priority. Only set this when explicitly requested."
      },
      dueDate: {
        type: "string",
        description: "Optional due date. Supports Unix timestamps (ms) or natural language like '1 hour from now', 'tomorrow', 'next week', etc."
      },
      startDate: {
        type: "string",
        description: "Optional start date. Supports Unix timestamps (ms) or natural language like 'now', 'start of today', etc."
      },
      parent: {
        type: "string",
        description: "Optional ID of the parent task. When specified, this task will be created as a subtask of the specified parent task."
      },
      tags: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Optional array of tag names to assign to the task. The tags must already exist in the space."
      },
      custom_fields: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID of the custom field"
            },
            value: {
              type: "string",
              description: "Value for the custom field. Type depends on the field type."
            }
          },
          required: ["id", "value"]
        },
        description: "Optional array of custom field values to set on the task. Each object must have an 'id' and 'value' property."
      },
      check_required_custom_fields: {
        type: "boolean",
        description: "Optional flag to check if all required custom fields are set before saving the task."
      },
      assignees: {
        type: "array",
        items: {
          oneOf: [
            { type: "number" },
            { type: "string" }
          ]
        },
        description: "Optional array of assignee user IDs (numbers), emails, or usernames to assign to the task."
      }
    }
  }
};

/**
 * Tool definition for updating a task
 */
export const updateTaskTool = {
  name: "update_task",
  description: `Updates task properties. Use taskId (preferred) or taskName + optional listName. At least one update field required. Custom fields supported as array of {id, value}. Supports assignees as array of user IDs, emails, or usernames. WARNING: Using taskName without listName may match multiple tasks.`,
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "ID of task to update (preferred). Automatically detects and handles both regular task IDs (9 characters) and custom IDs (like 'DEV-1234', 'PROJ-456')."
      },
      taskName: {
        type: "string",
        description: "Name of task to update. The tool will search for tasks with this name across all lists unless listName is specified."
      },
      listName: {
        type: "string",
        description: "Optional: Name of list containing the task. Providing this narrows the search to a specific list, improving performance and reducing ambiguity."
      },
      name: {
        type: "string",
        description: "New name for the task. Include emoji prefix if appropriate."
      },
      description: {
        type: "string",
        description: "New plain text description. Will be ignored if markdown_description is provided."
      },
      markdown_description: {
        type: "string",
        description: "New markdown description. Takes precedence over plain text description."
      },
      status: {
        type: "string",
        description: "New status. Must be valid for the task's current list."
      },
      priority: {
        type: "string",
        nullable: true,
        enum: ["1", "2", "3", "4", null],
        description: "New priority: 1 (urgent) to 4 (low). Set null to clear priority."
      },
      dueDate: {
        type: "string",
        description: "New due date. Supports both Unix timestamps (in milliseconds) and natural language expressions like '1 hour from now', 'tomorrow', 'next week', or '3 days from now'."
      },
      startDate: {
        type: "string",
        description: "New start date. Supports both Unix timestamps (in milliseconds) and natural language expressions."
      },
      time_estimate: {
        type: "string",
        description: "Time estimate for the task. For best compatibility with the ClickUp API, use a numeric value in minutes (e.g., '150' for 2h 30m)"
      },
      custom_fields: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID of the custom field"
            },
            value: {
              type: "string",
              description: "Value for the custom field. Type depends on the field type."
            }
          },
          required: ["id", "value"]
        },
        description: "Optional array of custom field values to set on the task. Each object must have an 'id' and 'value' property."
      },
      assignees: {
        type: "array",
        items: {
          oneOf: [
            { type: "number" },
            { type: "string" }
          ]
        },
        description: "Optional array of assignee user IDs (numbers), emails, or usernames to assign to the task."
      }
    }
  }
};

/**
 * Tool definition for moving a task
 */
export const moveTaskTool = {
  name: "move_task",
  description: `Moves task to different list. Use taskId + (listId/listName) preferred, or taskName + sourceListName + (listId/listName). WARNING: Task statuses may reset if destination list has different status options.`,
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "ID of the task to move (preferred). Automatically detects and handles both regular task IDs (9 characters) and custom IDs (like 'DEV-1234', 'PROJ-456')."
      },
      taskName: {
        type: "string",
        description: "Name of the task to move. When using this, you MUST also provide sourceListName."
      },
      sourceListName: {
        type: "string",
        description: "REQUIRED with taskName: Current list containing the task."
      },
      listId: {
        type: "string",
        description: "ID of destination list (preferred). Use this instead of listName if you have it."
      },
      listName: {
        type: "string",
        description: "Name of destination list. Only use if you don't have listId."
      }
    },
    required: []
  }
};

/**
 * Tool definition for duplicating a task
 */
export const duplicateTaskTool = {
  name: "duplicate_task",
  description: `Creates copy of task in same/different list. Use taskId + optional (listId/listName), or taskName + sourceListName + optional (listId/listName). Preserves original properties. Default: same list as original.`,
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "ID of task to duplicate (preferred). Automatically detects and handles both regular task IDs (9 characters) and custom IDs (like 'DEV-1234', 'PROJ-456')."
      },
      taskName: {
        type: "string",
        description: "Name of task to duplicate. When using this, you MUST provide sourceListName."
      },
      sourceListName: {
        type: "string",
        description: "REQUIRED with taskName: List containing the original task."
      },
      listId: {
        type: "string",
        description: "ID of list for the duplicate (optional). Defaults to same list as original."
      },
      listName: {
        type: "string",
        description: "Name of list for the duplicate. Only use if you don't have listId."
      }
    },
    required: []
  }
};

/**
 * Tool definition for retrieving task details
 */
export const getTaskTool = {
  name: "get_task",
  description: `Gets task details by taskId (automatically handles both regular and custom IDs) or taskName. For taskName search, provide listName for faster lookup. Set subtasks=true to include all subtask details.`,
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "ID of task to retrieve (preferred). Automatically detects and handles both regular task IDs (9 characters) and custom IDs (like 'DEV-1234', 'PROJ-456'). Simply provide any task ID format here."
      },
      taskName: {
        type: "string",
        description: "Name of task to retrieve. Can be used alone for a global search, or with listName for faster lookup."
      },
      listName: {
        type: "string",
        description: "Name of list containing the task. Optional but recommended when using taskName."
      },
      customTaskId: {
        type: "string",
        description: "Custom task ID (e.g., 'DEV-1234'). This parameter is now optional since taskId automatically handles custom IDs. Use only for explicit custom ID lookup or backward compatibility."
      },
      subtasks: {
        type: "boolean",
        description: "Whether to include subtasks in the response. Set to true to retrieve full details of all subtasks."
      }
    }
  }
};

/**
 * Tool definition for retrieving tasks from a list
 */
export const getTasksTool = {
  name: "get_tasks",
  description: `Purpose: Retrieve tasks from a list with optional filtering.

Valid Usage:
1. Use listId (preferred)
2. Use listName

Requirements:
- EITHER listId OR listName is REQUIRED

Notes:
- Use filters (archived, statuses, etc.) to narrow down results
- Pagination available through page parameter
- Sorting available through order_by and reverse parameters`,
  inputSchema: {
    type: "object",
    properties: {
      listId: {
        type: "string",
        description: "ID of list to get tasks from (preferred). Use this instead of listName if you have it."
      },
      listName: {
        type: "string",
        description: "Name of list to get tasks from. Only use if you don't have listId."
      },
      subtasks: {
        type: "boolean",
        description: "Include subtasks"
      },
      statuses: {
        type: "array",
        items: { type: "string" },
        description: "Filter by status names (e.g. ['To Do', 'In Progress'])"
      },
      archived: {
        type: "boolean",
        description: "Include archived tasks"
      },
      page: {
        type: "number",
        description: "Page number for pagination (starts at 0)"
      },
      order_by: {
        type: "string",
        description: "Sort field: due_date, created, updated"
      },
      reverse: {
        type: "boolean",
        description: "Reverse sort order (descending)"
      }
    },
    required: []
  }
};

/**
 * Tool definition for retrieving task comments
 */
export const getTaskCommentsTool = {
  name: "get_task_comments",
  description: `Gets task comments. Use taskId (preferred) or taskName + optional listName. Use start/startId params for pagination. Task names may not be unique across lists.`,
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "ID of task to retrieve comments for (preferred). Automatically detects and handles both regular task IDs (9 characters) and custom IDs (like 'DEV-1234', 'PROJ-456')."
      },
      taskName: {
        type: "string",
        description: "Name of task to retrieve comments for. Warning: Task names may not be unique."
      },
      listName: {
        type: "string",
        description: "Name of list containing the task. Helps find the right task when using taskName."
      },
      start: {
        type: "number",
        description: "Timestamp (in milliseconds) to start retrieving comments from. Used for pagination."
      },
      startId: {
        type: "string",
        description: "Comment ID to start from. Used together with start for pagination."
      }
    }
  }
};

/**
 * Tool definition for creating a comment on a task
 */
export const createTaskCommentTool = {
  name: "create_task_comment",
  description: `Creates task comment. Use taskId (preferred) or taskName + listName. Required: commentText. Optional: notifyAll to notify assignees, assignee to assign comment.`,
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "ID of task to comment on (preferred). Automatically detects and handles both regular task IDs (9 characters) and custom IDs (like 'DEV-1234', 'PROJ-456')."
      },
      taskName: {
        type: "string",
        description: "Name of task to comment on. When using this parameter, you MUST also provide listName."
      },
      listName: {
        type: "string",
        description: "Name of list containing the task. REQUIRED when using taskName."
      },
      commentText: {
        type: "string",
        description: "REQUIRED: Text content of the comment to create."
      },
      notifyAll: {
        type: "boolean",
        description: "Whether to notify all assignees. Default is false."
      },
      assignee: {
        type: "number",
        description: "Optional user ID to assign the comment to."
      }
    },
    required: ["commentText"]
  }
};

/**
 * Tool definition for deleting a task
 */
export const deleteTaskTool = {
  name: "delete_task",
  description: `PERMANENTLY deletes task. Use taskId (preferred/safest) or taskName + optional listName. WARNING: Cannot be undone. Using taskName without listName may match multiple tasks.`,
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "ID of task to delete (preferred). Automatically detects and handles both regular task IDs (9 characters) and custom IDs (like 'DEV-1234', 'PROJ-456')."
      },
      taskName: {
        type: "string",
        description: "Name of task to delete. The tool will search for tasks with this name across all lists unless listName is specified."
      },
      listName: {
        type: "string",
        description: "Optional: Name of list containing the task. Providing this narrows the search to a specific list, improving performance and reducing ambiguity."
      }
    }
  }
}; 
