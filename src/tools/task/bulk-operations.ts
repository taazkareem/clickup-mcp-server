/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * ClickUp MCP Bulk Task Operations
 * 
 * This module defines tools for bulk task operations including creating,
 * updating, moving, and deleting multiple tasks at once.
 */

import { TaskPriority } from '../../services/clickup/types.js';
import { clickUpServices } from '../../services/shared.js';
import { BulkService } from '../../services/clickup/bulk.js';
import { parseDueDate } from '../utils.js';
import { 
  validateBulkTasks, 
  parseBulkOptions,
  validateTaskIdentification,
  validateListIdentification,
  validateTaskUpdateData,
  resolveListIdWithValidation
} from './utilities.js';
import { getTaskId } from './handlers.js';
import { BatchProcessingOptions } from '../../utils/concurrency-utils.js';

// Initialize services
const { task: taskService } = clickUpServices;
const bulkService = new BulkService(taskService);

//=============================================================================
// COMMON SCHEMA DEFINITIONS
//=============================================================================

// Common schema definitions
const bulkOptionsSchema = {
  oneOf: [
    {
      type: "object",
      description: "Optional processing settings",
      properties: {
        batchSize: {
          type: "number", 
          description: "Tasks per batch (default: 10)"
        },
        concurrency: {
          type: "number",
          description: "Parallel operations (default: 3)"
        },
        continueOnError: {
          type: "boolean",
          description: "Continue if some tasks fail"
        },
        retryCount: {
          type: "number",
          description: "Retry attempts for failures"
        }
      }
    },
    {
      type: "string",
      description: "JSON string representing options. Will be parsed automatically."
    }
  ],
  description: "Processing options (or JSON string representing options)"
};

const taskIdentifierSchema = {
  taskId: {
    type: "string",
    description: "Task ID (preferred). Automatically detects and handles both regular task IDs (9 characters) and custom IDs (like 'DEV-1234', 'PROJ-456')."
  },
  taskName: {
    type: "string",
    description: "Task name. Requires listName when used."
  },
  listName: {
    type: "string",
    description: "REQUIRED with taskName: List containing the task."
  },
  customTaskId: {
    type: "string",
    description: "Custom task ID (e.g., 'DEV-1234'). This parameter is now optional since taskId automatically handles custom IDs. Use only for explicit custom ID lookup or backward compatibility."
  }
};

//=============================================================================
// BULK TASK OPERATION TOOLS
//=============================================================================

/**
 * Tool definition for creating multiple tasks at once
 */
export const createBulkTasksTool = {
  name: "create_bulk_tasks",
  description: `Creates multiple tasks in one list. Use listId (preferred) or listName + array of tasks (each needs name). Configure batch size/concurrency via options. Tasks can have custom fields as {id, value} array and assignees as array of user IDs, emails, or usernames.`,
  inputSchema: {
    type: "object",
    properties: {
      tasks: {
        type: "array",
        description: "Array of tasks to create. Each task must have at least a name.",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Task name with emoji prefix"
            },
            description: {
              type: "string",
              description: "Plain text description"
            },
            markdown_description: {
              type: "string",
              description: "Markdown description (overrides plain text)"
            },
            status: {
              type: "string",
              description: "Task status (uses list default if omitted)"
            },
            priority: {
              type: "number",
              description: "Priority 1-4 (1=urgent, 4=low)"
            },
            dueDate: {
              type: "string",
              description: "Due date. Supports Unix timestamps (in milliseconds) and natural language expressions like '1 hour from now', 'tomorrow', 'next week', etc."
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
              description: "Optional array of custom field values to set on the task."
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
          },
          required: ["name"]
        }
      },
      listId: {
        type: "string",
        description: "ID of list for new tasks (preferred). Use this instead of listName if you have it."
      },
      listName: {
        type: "string",
        description: "Name of list for new tasks. Only use if you don't have listId."
      },
      options: bulkOptionsSchema
    },
    required: ["tasks"]
  }
};

/**
 * Tool definition for updating multiple tasks
 */
export const updateBulkTasksTool = {
  name: "update_bulk_tasks",
  description: `Updates multiple tasks efficiently. For each task: use taskId (preferred) or taskName + listName. At least one update field per task. Supports assignees as array of user IDs, emails, or usernames. Configure batch size/concurrency via options. WARNING: taskName without listName will fail.`,
  inputSchema: {
    type: "object",
    properties: {
      tasks: {
        type: "array",
        description: "Array of tasks to update",
        items: {
          type: "object",
          properties: {
            taskId: {
              type: "string",
              description: "Task ID (preferred). Automatically detects and handles both regular task IDs (9 characters) and custom IDs (like 'DEV-1234', 'PROJ-456')."
            },
            taskName: {
              type: "string",
              description: "Task name. Requires listName when used."
            },
            listName: {
              type: "string",
              description: "REQUIRED with taskName: List containing the task."
            },
            customTaskId: {
              type: "string",
              description: "Custom task ID (e.g., 'DEV-1234'). Only use if you want to explicitly force custom ID lookup. In most cases, use taskId which auto-detects ID format."
            },
            name: {
              type: "string",
              description: "New name with emoji prefix"
            },
            description: {
              type: "string",
              description: "New plain text description"
            },
            markdown_description: {
              type: "string",
              description: "New markdown description"
            },
            status: {
              type: "string",
              description: "New status"
            },
            priority: {
              type: "string",
              nullable: true,
              enum: ["1", "2", "3", "4", null],
              description: "New priority (1-4 or null)"
            },
            dueDate: {
              type: "string",
              description: "New due date. Supports Unix timestamps (in milliseconds) and natural language expressions like '1 hour from now', 'tomorrow', etc."
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
              description: "Optional array of custom field values to set on the task."
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
      },
      options: bulkOptionsSchema
    },
    required: ["tasks"]
  }
};

/**
 * Tool definition for moving multiple tasks
 */
export const moveBulkTasksTool = {
  name: "move_bulk_tasks",
  description: `Moves multiple tasks to one list. For each task: use taskId (preferred) or taskName + listName. Target list: use targetListId/Name. Configure batch size/concurrency via options. WARNING: Task statuses may reset, taskName needs listName.`,
  inputSchema: {
    type: "object",
    properties: {
      tasks: {
        type: "array",
        description: "Array of tasks to move",
        items: {
          type: "object",
          properties: {
            taskId: {
              type: "string",
              description: "Task ID (preferred). Automatically detects and handles both regular task IDs (9 characters) and custom IDs (like 'DEV-1234', 'PROJ-456')."
            },
            taskName: {
              type: "string",
              description: "Task name. Requires listName when used."
            },
            listName: {
              type: "string",
              description: "REQUIRED with taskName: List containing the task."
            },
            customTaskId: {
              type: "string",
              description: "Custom task ID (e.g., 'DEV-1234'). Only use if you want to explicitly force custom ID lookup. In most cases, use taskId which auto-detects ID format."
            }
          }
        }
      },
      targetListId: {
        type: "string",
        description: "ID of destination list (preferred). Use instead of targetListName if available."
      },
      targetListName: {
        type: "string",
        description: "Name of destination list. Only use if you don't have targetListId."
      },
      options: bulkOptionsSchema
    },
    required: ["tasks"]
  }
};

/**
 * Tool definition for deleting multiple tasks
 */
export const deleteBulkTasksTool = {
  name: "delete_bulk_tasks",
  description: `PERMANENTLY deletes multiple tasks. For each task: use taskId (preferred/safest) or taskName + listName. Configure batch size/concurrency via options. WARNING: Cannot be undone, taskName without listName is dangerous.`,
  inputSchema: {
    type: "object",
    properties: {
      tasks: {
        type: "array",
        description: "Array of tasks to delete",
        items: {
          type: "object",
          properties: {
            taskId: {
              type: "string",
              description: "Task ID (preferred). Automatically detects and handles both regular task IDs (9 characters) and custom IDs (like 'DEV-1234', 'PROJ-456')."
            },
            taskName: {
              type: "string",
              description: "Task name. Requires listName when used."
            },
            listName: {
              type: "string",
              description: "REQUIRED with taskName: List containing the task."
            },
            customTaskId: {
              type: "string",
              description: "Custom task ID (e.g., 'DEV-1234'). Only use if you want to explicitly force custom ID lookup. In most cases, use taskId which auto-detects ID format."
            }
          }
        }
      },
      options: bulkOptionsSchema
    },
    required: ["tasks"]
  }
};
