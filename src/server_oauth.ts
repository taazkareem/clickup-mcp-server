import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import { z } from 'zod';
import configuration from './config.js';
import { Logger } from './logger.js';

// Import all tool handlers
import {
  createDocumentPageTool,
  createDocumentTool,
  getDocumentPagesTool,
  getDocumentTool,
  handleCreateDocument,
  handleCreateDocumentPage,
  handleGetDocument,
  handleGetDocumentPages,
  handleListDocumentPages,
  handleListDocuments,
  handleUpdateDocumentPage,
  listDocumentPagesTool,
  listDocumentsTool,
  updateDocumentPageTool,
} from './tools/documents.js';
import {
  createFolderTool,
  deleteFolderTool,
  getFolderTool,
  handleCreateFolder,
  handleDeleteFolder,
  handleGetFolder,
  handleUpdateFolder,
  updateFolderTool,
} from './tools/folder.js';
import {
  addTimeEntryTool,
  attachTaskFileTool,
  createBulkTasksTool,
  createTaskCommentTool,
  createTaskTool,
  deleteBulkTasksTool,
  deleteTaskTool,
  deleteTimeEntryTool,
  duplicateTaskTool,
  getCurrentTimeEntryTool,
  getTaskCommentsTool,
  getTaskTimeEntriesTool,
  getTaskTool,
  getWorkspaceTasksTool,
  handleAddTimeEntry,
  handleAttachTaskFile,
  handleCreateBulkTasks,
  handleCreateTask,
  handleCreateTaskComment,
  handleDeleteBulkTasks,
  handleDeleteTask,
  handleDeleteTimeEntry,
  handleDuplicateTask,
  handleGetCurrentTimeEntry,
  handleGetTask,
  handleGetTaskComments,
  handleGetTaskTimeEntries,
  handleGetWorkspaceTasks,
  handleMoveBulkTasks,
  handleMoveTask,
  handleStartTimeTracking,
  handleStopTimeTracking,
  handleUpdateBulkTasks,
  handleUpdateTask,
  moveBulkTasksTool,
  moveTaskTool,
  startTimeTrackingTool,
  stopTimeTrackingTool,
  updateBulkTasksTool,
  updateTaskTool,
} from './tools/index.js';
import {
  createListInFolderTool,
  createListTool,
  deleteListTool,
  getListTool,
  handleCreateList,
  handleCreateListInFolder,
  handleDeleteList,
  handleGetList,
  handleUpdateList,
  updateListTool,
} from './tools/list.js';
import {
  addTagToTaskTool,
  getSpaceTagsTool,
  handleAddTagToTask,
  handleGetSpaceTags,
  handleRemoveTagFromTask,
  removeTagFromTaskTool,
} from './tools/tag.js';
import { handleGetWorkspaceHierarchy } from './tools/workspace.js';

const logger = new Logger('OAuthServer');

/**
 * Extract OAuth credentials from request headers
 */
function extractOAuthCredentials(req: express.Request): { accessToken: string; teamId: string } {
  const accessToken = req.headers['authorization'] as string;
  const teamId = req.headers['x-clickup-team-id'] as string;

  if (!accessToken) {
    throw new Error('Missing required header: Authorization');
  }
  if (!teamId) {
    throw new Error('Missing required header: x-clickup-team-id');
  }

  return { accessToken, teamId };
}

/**
 * Enhanced transport that tracks OAuth credentials per session
 */
class OAuthStreamableHTTPServerTransport extends StreamableHTTPServerTransport {
  private _credentials: { accessToken: string; teamId: string } | null = null;

  setCredentials(accessToken: string, teamId: string) {
    this._credentials = { accessToken, teamId };
  }

  getCredentials(): { accessToken: string; teamId: string } {
    if (!this._credentials) {
      throw new Error('OAuth credentials not set for this transport');
    }
    return this._credentials;
  }
}

export function startOAuthServer() {
  const server = new McpServer({
    name: 'clickup-mcp-server-oauth',
    version: '0.7.2',
  });

  const app = express();
  app.use(express.json());

  // Store transports per session
  const transports: Record<string, OAuthStreamableHTTPServerTransport> = {};

  // CORS middleware
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, mcp-session-id, Authorization, x-clickup-team-id');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    
    next();
  });

  // Request queue for sequential processing
  interface QueuedRequest {
    req: express.Request;
    res: express.Response;
    handler: (req: express.Request, res: express.Response, body?: any) => Promise<void>;
    body?: any;
  }

  const requestQueue: QueuedRequest[] = [];
  let isProcessing = false;

  const processNextRequest = async (): Promise<void> => {
    if (isProcessing || requestQueue.length === 0) {
      return;
    }

    isProcessing = true;
    const queuedRequest = requestQueue.shift()!;
    
    try {
      logger.info('Processing queued request', { 
        method: queuedRequest.req.method,
        url: queuedRequest.req.url,
        queueLength: requestQueue.length 
      });
      
      await queuedRequest.handler(queuedRequest.req, queuedRequest.res, queuedRequest.body);
    } catch (error) {
      logger.error('Error processing queued request', { 
        error: error.message, 
        method: queuedRequest.req.method,
        url: queuedRequest.req.url 
      });
      
      // Ensure response is sent if not already sent
      if (!queuedRequest.res.headersSent) {
        queuedRequest.res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
          },
          id: null,
        });
      }
    } finally {
      isProcessing = false;
      // Process next request if any
      setImmediate(() => processNextRequest());
    }
  };

  const queueRequest = (req: express.Request, res: express.Response, handler: (req: express.Request, res: express.Response, body?: any) => Promise<void>, body?: any): void => {
    requestQueue.push({ req, res, handler, body });
    logger.info('Request queued', { 
      method: req.method, 
      url: req.url, 
      queueLength: requestQueue.length 
    });
    processNextRequest();
  };

  // Note: Since we can't access the request object directly in tool handlers,
  // we'll use a different approach where we override the shared services 
  // during request processing at the transport level

  server.tool(
  'get_workspace_hierarchy',
  'Get Workspace Hierarchy',
  {},
  async () => {
    const hierarchy = (await handleGetWorkspaceHierarchy()) as Tool;
    return hierarchy;
  }
);

server.tool(
  getTaskTool.name,
  getTaskTool.description,
  {
    taskId: z
      .string()
      .optional()
      .describe(
        "ID of task to retrieve (preferred). Works with both regular task IDs (9 characters) and custom IDs with uppercase prefixes (like 'DEV-1234'). The system automatically detects the ID format."
      ),
    taskName: z
      .string()
      .optional()
      .describe(
        'Name of task to retrieve. Can be used alone for a global search, or with listName for faster lookup.'
      ),
    listName: z
      .string()
      .optional()
      .describe(
        'Name of list containing the task. Optional but recommended when using taskName.'
      ),
    customTaskId: z
      .string()
      .optional()
      .describe(
        "Custom task ID (e.g., 'DEV-1234'). Only use this if you want to explicitly force custom ID lookup. In most cases, you can just use taskId which auto-detects ID format."
      ),
    subtasks: z
      .boolean()
      .optional()
      .describe(
        'Whether to include subtasks in the response. Set to true to retrieve full details of all subtasks.'
      ),
  },
  async (params) => {
    return (await handleGetTask(params)) as Tool;
  }
);

server.tool(
  createTaskTool.name,
  createTaskTool.description,
  {
    name: z
      .string()
      .describe(
        'REQUIRED: Name of the task. Put a relevant emoji followed by a blank space before the name.'
      ),
    listId: z
      .string()
      .optional()
      .describe(
        'REQUIRED (unless listName provided): ID of the list to create the task in. If you have this ID from a previous response, use it directly rather than looking up by name.'
      ),
    listName: z
      .string()
      .optional()
      .describe(
        'REQUIRED (unless listName provided): Name of the list to create the task in - will automatically find the list by name.'
      ),
    description: z
      .string()
      .optional()
      .describe('Optional plain text description for the task'),
    markdown_description: z
      .string()
      .optional()
      .describe(
        'Optional markdown formatted description for the task. If provided, this takes precedence over description'
      ),
    status: z
      .string()
      .optional()
      .describe(
        'Optional: Override the default ClickUp status. In most cases, you should omit this to use ClickUp defaults'
      ),
    priority: z
      .number()
      .optional()
      .describe(
        'Optional priority of the task (1-4), where 1 is urgent/highest priority and 4 is lowest priority. Only set this when explicitly requested.'
      ),
    dueDate: z
      .string()
      .optional()
      .describe(
        "Optional due date. Supports Unix timestamps (ms) or natural language like '1 hour from now', 'tomorrow', 'next week', etc."
      ),
    startDate: z
      .string()
      .optional()
      .describe(
        "Optional start date. Supports Unix timestamps (ms) or natural language like 'now', 'start of today', etc."
      ),
    parent: z
      .string()
      .optional()
      .describe(
        'Optional ID of the parent task. When specified, this task will be created as a subtask of the specified parent task.'
      ),
    tags: z
      .array(z.string())
      .optional()
      .describe(
        'Optional array of tag names to assign to the task. The tags must already exist in the space.'
      ),
    custom_fields: z
      .array(
        z.object({
          id: z.string().describe('ID of the custom field'),
          value: z
            .any()
            .describe(
              'Value for the custom field. Type depends on the field type.'
            ),
        })
      )
      .optional()
      .describe(
        "Optional array of custom field values to set on the task. Each object must have an 'id' and 'value' property."
      ),
    check_required_custom_fields: z
      .boolean()
      .optional()
      .describe(
        'Optional flag to check if all required custom fields are set before saving the task.'
      ),
  },
  async (params) => {
    return (await handleCreateTask(params)) as Tool;
  }
);

server.tool(
  updateTaskTool.name,
  updateTaskTool.description,
  {
    taskId: z
      .string()
      .optional()
      .describe(
        "ID of task to update (preferred). Works with both regular task IDs (9 characters) and custom IDs with uppercase prefixes (like 'DEV-1234')."
      ),
    taskName: z
      .string()
      .optional()
      .describe(
        'Name of task to update. The tool will search for tasks with this name across all lists unless listName is specified.'
      ),
    listName: z
      .string()
      .optional()
      .describe(
        'Optional: Name of list containing the task. Providing this narrows the search to a specific list, improving performance and reducing ambiguity.'
      ),
    name: z
      .string()
      .optional()
      .describe('New name for the task. Include emoji prefix if appropriate.'),
    description: z
      .string()
      .optional()
      .describe(
        'New plain text description. Will be ignored if markdown_description is provided.'
      ),
    markdown_description: z
      .string()
      .optional()
      .describe(
        'New markdown description. Takes precedence over plain text description.'
      ),
    status: z
      .string()
      .optional()
      .describe("New status. Must be valid for the task's current list."),
    priority: z
      .number()
      .optional()
      .describe(
        'New priority: 1 (urgent) to 4 (low). Set null to clear priority.'
      ),
    dueDate: z
      .string()
      .optional()
      .describe(
        "New due date. Supports both Unix timestamps (in milliseconds) and natural language expressions like '1 hour from now', 'tomorrow', 'next week', or '3 days from now'."
      ),
    startDate: z
      .string()
      .optional()
      .describe(
        'New start date. Supports both Unix timestamps (in milliseconds) and natural language expressions.'
      ),
    time_estimate: z
      .string()
      .optional()
      .describe(
        "Time estimate for the task. For best compatibility with the ClickUp API, use a numeric value in minutes (e.g., '150' for 2h 30m)"
      ),
    custom_fields: z
      .array(
        z.object({
          id: z.string().describe('ID of the custom field'),
          value: z
            .any()
            .describe(
              'Value for the custom field. Type depends on the field type.'
            ),
        })
      )
      .optional()
      .describe(
        "Optional array of custom field values to set on the task. Each object must have an 'id' and 'value' property."
      ),
  },
  async (params) => {
    return (await handleUpdateTask(params)) as Tool;
  }
);

server.tool(
  moveTaskTool.name,
  moveTaskTool.description,
  {
    taskId: z
      .string()
      .optional()
      .describe(
        "ID of the task to move (preferred). Works with both regular task IDs (9 characters) and custom IDs with uppercase prefixes (like 'DEV-1234')."
      ),
    taskName: z
      .string()
      .optional()
      .describe(
        'Name of the task to move. When using this, you MUST also provide sourceListName.'
      ),
    sourceListName: z
      .string()
      .optional()
      .describe('REQUIRED with taskName: Current list containing the task.'),
    listId: z
      .string()
      .optional()
      .describe(
        'ID of destination list (preferred). Use this instead of listName if you have it.'
      ),
    listName: z
      .string()
      .optional()
      .describe("Name of destination list. Only use if you don't have listId."),
  },
  async (params) => {
    return (await handleMoveTask(params)) as Tool;
  }
);

server.tool(
  duplicateTaskTool.name,
  duplicateTaskTool.description,
  {
    taskId: z
      .string()
      .optional()
      .describe(
        "ID of task to duplicate (preferred). Works with both regular task IDs (9 characters) and custom IDs with uppercase prefixes (like 'DEV-1234')."
      ),
    taskName: z
      .string()
      .optional()
      .describe(
        'Name of task to duplicate. When using this, you MUST provide sourceListName.'
      ),
    sourceListName: z
      .string()
      .optional()
      .describe('REQUIRED with taskName: List containing the original task.'),
    listId: z
      .string()
      .optional()
      .describe(
        'ID of list for the duplicate (optional). Defaults to same list as original.'
      ),
    listName: z
      .string()
      .optional()
      .describe(
        "Name of list for the duplicate. Only use if you don't have listId."
      ),
  },
  async (params) => {
    return (await handleDuplicateTask(params)) as Tool;
  }
);

server.tool(
  deleteTaskTool.name,
  deleteTaskTool.description,
  {
    taskId: z
      .string()
      .optional()
      .describe(
        "ID of task to delete (preferred). Works with both regular task IDs (9 characters) and custom IDs with uppercase prefixes (like 'DEV-1234')."
      ),
    taskName: z
      .string()
      .optional()
      .describe(
        'Name of task to delete. The tool will search for tasks with this name across all lists unless listName is specified.'
      ),
    listName: z
      .string()
      .optional()
      .describe(
        'Optional: Name of list containing the task. Providing this narrows the search to a specific list, improving performance and reducing ambiguity.'
      ),
  },
  async (params) => {
    return (await handleDeleteTask(params)) as Tool;
  }
);

server.tool(
  getTaskCommentsTool.name,
  getTaskCommentsTool.description,
  {
    taskId: z
      .string()
      .optional()
      .describe(
        "ID of task to retrieve comments for (preferred). Works with both regular task IDs (9 characters) and custom IDs with uppercase prefixes (like 'DEV-1234')."
      ),
    taskName: z
      .string()
      .optional()
      .describe(
        'Name of task to retrieve comments for. Warning: Task names may not be unique.'
      ),
    listName: z
      .string()
      .optional()
      .describe(
        'Name of list containing the task. Helps find the right task when using taskName.'
      ),
    start: z
      .number()
      .optional()
      .describe(
        'Timestamp (in milliseconds) to start retrieving comments from. Used for pagination.'
      ),
    startId: z
      .string()
      .optional()
      .describe(
        'Comment ID to start from. Used together with start for pagination.'
      ),
  },
  async (params) => {
    return (await handleGetTaskComments(params)) as Tool;
  }
);

server.tool(
  createTaskCommentTool.name,
  createTaskCommentTool.description,
  {
    taskId: z
      .string()
      .optional()
      .describe(
        "ID of task to comment on (preferred). Works with both regular task IDs (9 characters) and custom IDs with uppercase prefixes (like 'DEV-1234')."
      ),
    taskName: z
      .string()
      .optional()
      .describe(
        'Name of task to comment on. When using this parameter, you MUST also provide listName.'
      ),
    listName: z
      .string()
      .optional()
      .describe(
        'Name of list containing the task. REQUIRED when using taskName.'
      ),
    commentText: z
      .string()
      .describe('REQUIRED: Text content of the comment to create.'),
    notifyAll: z
      .boolean()
      .optional()
      .describe('Whether to notify all assignees. Default is false.'),
    assignee: z
      .number()
      .optional()
      .describe('Optional user ID to assign the comment to.'),
  },
  async (params) => {
    return (await handleCreateTaskComment(params)) as Tool;
  }
);

server.tool(
  attachTaskFileTool.name,
  attachTaskFileTool.description,
  {
    taskId: z.string().describe('ID of the task to attach the file to.'),
    filePath: z.string().describe('Path to the file to attach.'),
    fileName: z
      .string()
      .optional()
      .describe('Name of the file. Defaults to the original file name.'),
  },
  async (params) => {
    // Note: handleAttachTaskFile in server.ts might need adjustment
    // if it expects a different structure for file path/content in SSE context.
    // For now, assuming it can handle a file path.
    return (await handleAttachTaskFile(params)) as Tool;
  }
);

server.tool(
  createBulkTasksTool.name,
  createBulkTasksTool.description,
  {
    listId: z.string().describe('ID of the list to create the tasks in.'),
    tasks: z
      .array(
        z.object({
          name: z.string().describe('Name of the task.'),
          description: z
            .string()
            .optional()
            .describe('Description of the task.'),
          assignees: z
            .array(z.string())
            .optional()
            .describe('Array of user IDs to assign to the task.'),
          tags: z
            .array(z.string())
            .optional()
            .describe('Array of tag names to add to the task.'),
          status: z.string().optional().describe('Status to set for the task.'),
          priority: z.number().optional().describe('Priority of the task.'),
          dueDate: z
            .string()
            .optional()
            .describe('Due date of the task (YYYY-MM-DD).'),
          startDate: z
            .string()
            .optional()
            .describe('Start date of the task (YYYY-MM-DD).'),
          customFields: z
            .array(z.object({ id: z.string(), value: z.any() }))
            .optional()
            .describe('Array of custom fields to set for the task.'),
          parentTask: z
            .string()
            .optional()
            .describe('ID of the parent task, if creating a subtask.'),
        })
      )
      .describe('Array of task objects to create.'),
  },
  async (params) => {
    return (await handleCreateBulkTasks(params)) as Tool;
  }
);

server.tool(
  updateBulkTasksTool.name,
  updateBulkTasksTool.description,
  {
    tasks: z
      .array(
        z.object({
          id: z.string().describe('ID of the task to update.'),
          name: z.string().optional().describe('New name for the task.'),
          description: z
            .string()
            .optional()
            .describe('New description for the task.'),
          assignees: z
            .array(z.string())
            .optional()
            .describe('New array of user IDs to assign to the task.'),
          tags: z
            .array(z.string())
            .optional()
            .describe('New array of tag names to add to the task.'),
          status: z
            .string()
            .optional()
            .describe('New status to set for the task.'),
          priority: z.number().optional().describe('New priority of the task.'),
          dueDate: z
            .string()
            .optional()
            .describe('New due date of the task (YYYY-MM-DD).'),
          startDate: z
            .string()
            .optional()
            .describe('New start date of the task (YYYY-MM-DD).'),
          customFields: z
            .array(z.object({ id: z.string(), value: z.any() }))
            .optional()
            .describe('New array of custom fields to set for the task.'),
          parentTask: z
            .string()
            .optional()
            .describe('New ID of the parent task.'),
        })
      )
      .describe('Array of task objects to update.'),
  },
  async (params) => {
    return (await handleUpdateBulkTasks(params)) as Tool;
  }
);

server.tool(
  moveBulkTasksTool.name,
  moveBulkTasksTool.description,
  {
    taskIds: z.array(z.string()).describe('Array of task IDs to move.'),
    newListId: z.string().describe('ID of the list to move the tasks to.'),
    newStatus: z
      .string()
      .optional()
      .describe('New status for the tasks in the new list.'),
  },
  async (params) => {
    return (await handleMoveBulkTasks(params)) as Tool;
  }
);

server.tool(
  deleteBulkTasksTool.name,
  deleteBulkTasksTool.description,
  {
    taskIds: z.array(z.string()).describe('Array of task IDs to delete.'),
  },
  async (params) => {
    return (await handleDeleteBulkTasks(params)) as Tool;
  }
);

server.tool(
  getWorkspaceTasksTool.name,
  getWorkspaceTasksTool.description,
  {
    workspaceId: z
      .string()
      .optional()
      .describe(
        'ID of the workspace to get tasks from. Defaults to the current workspace.'
      ),
    listIds: z
      .array(z.string())
      .optional()
      .describe('Array of list IDs to filter tasks by.'),
    statuses: z
      .array(z.string())
      .optional()
      .describe('Array of statuses to filter tasks by.'),
    assignees: z
      .array(z.string())
      .optional()
      .describe('Array of user IDs to filter tasks by.'),
    tags: z
      .array(z.string())
      .optional()
      .describe('Array of tag names to filter tasks by.'),
    dueDateGreaterThan: z
      .string()
      .optional()
      .describe('Filter tasks with due date greater than (YYYY-MM-DD).'),
    dueDateLessThan: z
      .string()
      .optional()
      .describe('Filter tasks with due date less than (YYYY-MM-DD).'),
    createdDateGreaterThan: z
      .string()
      .optional()
      .describe('Filter tasks with created date greater than (YYYY-MM-DD).'),
    createdDateLessThan: z
      .string()
      .optional()
      .describe('Filter tasks with created date less than (YYYY-MM-DD).'),
    updatedDateGreaterThan: z
      .string()
      .optional()
      .describe('Filter tasks with updated date greater than (YYYY-MM-DD).'),
    updatedDateLessThan: z
      .string()
      .optional()
      .describe('Filter tasks with updated date less than (YYYY-MM-DD).'),
    includeSubtasks: z
      .boolean()
      .optional()
      .describe('Include subtasks in the results.'),
    includeClosed: z
      .boolean()
      .optional()
      .describe('Include closed tasks in the results.'),
    sortBy: z
      .string()
      .optional()
      .describe(
        "Field to sort tasks by (e.g., 'dueDate', 'createdDate', 'priority')."
      ),
    sortOrder: z
      .enum(['asc', 'desc'])
      .optional()
      .describe("Sort order ('asc' or 'desc')."),
    page: z.number().optional().describe('Page number for pagination.'),
  },
  async (params) => {
    return (await handleGetWorkspaceTasks(params)) as Tool;
  }
);

server.tool(
  getTaskTimeEntriesTool.name,
  getTaskTimeEntriesTool.description,
  {
    taskId: z.string().describe('ID of the task to get time entries for.'),
    startDate: z
      .string()
      .optional()
      .describe('Filter time entries starting after this date (YYYY-MM-DD).'),
    endDate: z
      .string()
      .optional()
      .describe('Filter time entries ending before this date (YYYY-MM-DD).'),
    assignee: z.string().optional().describe('Filter time entries by user ID.'),
  },
  async (params) => {
    return (await handleGetTaskTimeEntries(params)) as Tool;
  }
);

server.tool(
  startTimeTrackingTool.name,
  startTimeTrackingTool.description,
  {
    taskId: z.string().describe('ID of the task to start time tracking for.'),
    assignee: z
      .string()
      .optional()
      .describe(
        'User ID to start time tracking for. Defaults to the authenticated user.'
      ),
  },
  async (params) => {
    return (await handleStartTimeTracking(params)) as Tool;
  }
);

server.tool(
  stopTimeTrackingTool.name,
  stopTimeTrackingTool.description,
  {
    assignee: z
      .string()
      .optional()
      .describe(
        'User ID to stop time tracking for. Defaults to the authenticated user.'
      ),
  },
  async (params) => {
    return (await handleStopTimeTracking(params)) as Tool;
  }
);

server.tool(
  addTimeEntryTool.name,
  addTimeEntryTool.description,
  {
    taskId: z.string().describe('ID of the task to add time entry to.'),
    duration: z
      .number()
      .describe('Duration of the time entry in milliseconds.'),
    description: z
      .string()
      .optional()
      .describe('Description of the time entry.'),
    start: z
      .string()
      .optional()
      .describe('Start time of the entry (Unix timestamp in milliseconds).'),
    end: z
      .string()
      .optional()
      .describe('End time of the entry (Unix timestamp in milliseconds).'),
    assignee: z
      .string()
      .optional()
      .describe(
        'User ID for the time entry. Defaults to the authenticated user.'
      ),
    billable: z
      .boolean()
      .optional()
      .describe('Whether the time entry is billable.'),
  },
  async (params) => {
    return (await handleAddTimeEntry(params)) as Tool;
  }
);

server.tool(
  deleteTimeEntryTool.name,
  deleteTimeEntryTool.description,
  {
    timeEntryId: z.string().describe('ID of the time entry to delete.'),
  },
  async (params) => {
    return (await handleDeleteTimeEntry(params)) as Tool;
  }
);

server.tool(
  getCurrentTimeEntryTool.name,
  getCurrentTimeEntryTool.description,
  {
    assignee: z
      .string()
      .optional()
      .describe(
        'User ID to get current time entry for. Defaults to the authenticated user.'
      ),
  },
  async (params) => {
    return (await handleGetCurrentTimeEntry(params)) as Tool;
  }
);

server.tool(
  createListTool.name,
  createListTool.description,
  {
    spaceId: z.string().describe('ID of the space to create the list in.'),
    listName: z.string().describe('Name of the list to create.'),
    status: z.string().optional().describe('Status for the list.'),
    priority: z.number().optional().describe('Priority for the list.'),
    dueDate: z
      .string()
      .optional()
      .describe('Due date for the list (YYYY-MM-DD).'),
  },
  async (params) => {
    return (await handleCreateList(params)) as Tool;
  }
);

server.tool(
  createListInFolderTool.name,
  createListInFolderTool.description,
  {
    folderId: z.string().describe('ID of the folder to create the list in.'),
    listName: z.string().describe('Name of the list to create.'),
    status: z.string().optional().describe('Status for the list.'),
    priority: z.number().optional().describe('Priority for the list.'),
    dueDate: z
      .string()
      .optional()
      .describe('Due date for the list (YYYY-MM-DD).'),
  },
  async (params) => {
    return (await handleCreateListInFolder(params)) as Tool;
  }
);

server.tool(
  getListTool.name,
  getListTool.description,
  {
    listId: z.string().describe('ID of the list to retrieve.'),
  },
  async (params) => {
    return (await handleGetList(params)) as Tool;
  }
);

server.tool(
  updateListTool.name,
  updateListTool.description,
  {
    listId: z.string().describe('ID of the list to update.'),
    listName: z.string().optional().describe('New name for the list.'),
    status: z.string().optional().describe('New status for the list.'),
    priority: z.number().optional().describe('New priority for the list.'),
    dueDate: z
      .string()
      .optional()
      .describe('New due date for the list (YYYY-MM-DD).'),
    unsetStatus: z
      .boolean()
      .optional()
      .describe('Set to true to remove the status from the list.'),
  },
  async (params) => {
    return (await handleUpdateList(params)) as Tool;
  }
);

server.tool(
  deleteListTool.name,
  deleteListTool.description,
  {
    listId: z.string().describe('ID of the list to delete.'),
  },
  async (params) => {
    return (await handleDeleteList(params)) as Tool;
  }
);

server.tool(
  createFolderTool.name,
  createFolderTool.description,
  {
    spaceId: z.string().describe('ID of the space to create the folder in.'),
    folderName: z.string().describe('Name of the folder to create.'),
  },
  async (params) => {
    return (await handleCreateFolder(params)) as Tool;
  }
);

server.tool(
  getFolderTool.name,
  getFolderTool.description,
  {
    folderId: z.string().describe('ID of the folder to retrieve.'),
  },
  async (params) => {
    return (await handleGetFolder(params)) as Tool;
  }
);

server.tool(
  updateFolderTool.name,
  updateFolderTool.description,
  {
    folderId: z.string().describe('ID of the folder to update.'),
    folderName: z.string().optional().describe('New name for the folder.'),
  },
  async (params) => {
    return (await handleUpdateFolder(params)) as Tool;
  }
);

server.tool(
  deleteFolderTool.name,
  deleteFolderTool.description,
  {
    folderId: z.string().describe('ID of the folder to delete.'),
  },
  async (params) => {
    return (await handleDeleteFolder(params)) as Tool;
  }
);

server.tool(
  getSpaceTagsTool.name,
  getSpaceTagsTool.description,
  {
    spaceId: z.string().describe('ID of the space to get tags from.'),
  },
  async (params) => {
    return (await handleGetSpaceTags(params)) as Tool;
  }
);

server.tool(
  addTagToTaskTool.name,
  addTagToTaskTool.description,
  {
    taskId: z.string().describe('ID of the task to add the tag to.'),
    tagName: z.string().describe('Name of the tag to add.'),
  },
  async (params) => {
    return (await handleAddTagToTask(params)) as Tool;
  }
);

server.tool(
  removeTagFromTaskTool.name,
  removeTagFromTaskTool.description,
  {
    taskId: z.string().describe('ID of the task to remove the tag from.'),
    tagName: z.string().describe('Name of the tag to remove.'),
  },
  async (params) => {
    return (await handleRemoveTagFromTask(params)) as Tool;
  }
);

server.tool(
  createDocumentTool.name,
  createDocumentTool.description,
  {
    spaceId: z.string().describe('ID of the space to create the document in.'),
    name: z.string().describe('Name of the document.'),
    content: z.string().optional().describe('Initial content of the document.'),
    parentType: z
      .enum(['list', 'folder', 'space'])
      .optional()
      .describe('Type of the parent entity.'),
    parentId: z.string().optional().describe('ID of the parent entity.'),
  },
  async (params) => {
    return (await handleCreateDocument(params)) as Tool;
  }
);

server.tool(
  getDocumentTool.name,
  getDocumentTool.description,
  {
    documentId: z.string().describe('ID of the document to retrieve.'),
  },
  async (params) => {
    return (await handleGetDocument(params)) as Tool;
  }
);

server.tool(
  listDocumentsTool.name,
  listDocumentsTool.description,
  {
    spaceId: z
      .string()
      .optional()
      .describe(
        'ID of the space to list documents from. Defaults to all accessible documents.'
      ),
    includeArchived: z
      .boolean()
      .optional()
      .describe('Include archived documents.'),
  },
  async (params) => {
    return (await handleListDocuments(params)) as Tool;
  }
);

server.tool(
  listDocumentPagesTool.name,
  listDocumentPagesTool.description,
  {
    documentId: z.string().describe('ID of the document to list pages from.'),
  },
  async (params) => {
    return (await handleListDocumentPages(params)) as Tool;
  }
);

server.tool(
  getDocumentPagesTool.name,
  getDocumentPagesTool.description,
  {
    documentId: z.string().describe('ID of the document to get pages from.'),
    pageIds: z
      .array(z.string())
      .optional()
      .describe(
        'Array of page IDs to retrieve. If not provided, all pages are retrieved.'
      ),
  },
  async (params) => {
    return (await handleGetDocumentPages(params)) as Tool;
  }
);

server.tool(
  createDocumentPageTool.name,
  createDocumentPageTool.description,
  {
    documentId: z.string().describe('ID of the document to add the page to.'),
    title: z.string().describe('Title of the new page.'),
    content: z.string().optional().describe('Content of the new page.'),
    orderIndex: z
      .number()
      .optional()
      .describe('Order index of the page within the document.'),
  },
  async (params) => {
    return (await handleCreateDocumentPage(params)) as Tool;
  }
);

server.tool(
  updateDocumentPageTool.name,
  updateDocumentPageTool.description,
  {
    pageId: z.string().describe('ID of the page to update.'),
    title: z.string().optional().describe('New title for the page.'),
    content: z.string().optional().describe('New content for the page.'),
    orderIndex: z.number().optional().describe('New order index for the page.'),
  },
  async (params) => {
    return (await handleUpdateDocumentPage(params)) as Tool;
  }
);

  // Enhanced request handler that manages OAuth credentials
  const handleOAuthRequest = async (transport: OAuthStreamableHTTPServerTransport, req: express.Request, res: express.Response, body: any) => {
    try {
      // Extract OAuth credentials from request
      const { accessToken, teamId } = extractOAuthCredentials(req);
      
      // Get the shared services and update credentials dynamically
      const sharedModule = await import('./services/shared.js');
      const services = sharedModule.clickUpServices;
      
      try {
        // Update all services with new credentials for this request
        services.workspace.updateCredentials(accessToken, teamId);
        services.task.updateCredentials(accessToken, teamId);
        services.list.updateCredentials(accessToken, teamId);
        services.folder.updateCredentials(accessToken, teamId);
        services.tag.updateCredentials(accessToken, teamId);
        services.timeTracking.updateCredentials(accessToken, teamId);
        services.document.updateCredentials(accessToken, teamId);
        
        // Process the request with updated credentials
        await transport.handleRequest(req, res, body);
      } finally {
        // Clear credentials after request for security (reset to empty)
        services.workspace.updateCredentials('', '');
        services.task.updateCredentials('', '');
        services.list.updateCredentials('', '');
        services.folder.updateCredentials('', '');
        services.tag.updateCredentials('', '');
        services.timeTracking.updateCredentials('', '');
        services.document.updateCredentials('', '');
      }
    } catch (error) {
      logger.error('Error in OAuth request handler', { error: error.message, stack: error.stack });
      throw error;
    }
  };

  // Handler for POST requests
  const handlePostRequest = async (req: express.Request, res: express.Response, body?: any): Promise<void> => {
    try {
      // Validate OAuth credentials first
      extractOAuthCredentials(req);
      
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      let transport: OAuthStreamableHTTPServerTransport;

      if (sessionId && transports[sessionId]) {
        transport = transports[sessionId];
      } else if (!sessionId && isInitializeRequest(body || req.body)) {
        transport = new OAuthStreamableHTTPServerTransport({
          sessionIdGenerator: () => `oauth_session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
          onsessioninitialized: (sessionId) => {
            transports[sessionId] = transport;
            logger.info('OAuth session initialized', { sessionId });
          }
        });

        transport.onclose = () => {
          if (transport.sessionId) {
            delete transports[transport.sessionId];
            logger.info('OAuth session closed', { sessionId: transport.sessionId });
          }
        };

        await server.connect(transport);
      } else {
        res.status(400).json({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Bad Request: No valid session ID provided',
          },
          id: null,
        });
        return;
      }

      // Use the enhanced OAuth request handler
      await handleOAuthRequest(transport, req, res, body || req.body);
    } catch (error) {
      logger.error('Error handling OAuth MCP request', { error: error.message, stack: error.stack });
      if (!res.headersSent) {
        if (error.message.includes('Missing required header')) {
          res.status(401).json({
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: `Unauthorized: ${error.message}`,
            },
            id: null,
          });
        } else {
          res.status(500).json({
            jsonrpc: '2.0',
            error: {
              code: -32603,
              message: 'Internal server error',
            },
            id: null,
          });
        }
      }
    }
  };

  // Streamable HTTP endpoint - handles POST requests for client-to-server communication
  app.post('/mcp', (req, res) => {
    queueRequest(req, res, handlePostRequest, req.body);
  });

  const handleSessionRequest = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      extractOAuthCredentials(req);
      
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      if (!sessionId || !transports[sessionId]) {
        res.status(400).send('Invalid or missing session ID');
        return;
      }
      
      const transport = transports[sessionId];
      await handleOAuthRequest(transport, req, res, undefined);
    } catch (error) {
      logger.error('Error in OAuth session request', { error: error.message });
      if (!res.headersSent) {
        if (error.message.includes('Missing required header')) {
          res.status(401).send('Unauthorized: ' + error.message);
        } else {
            console.log(error);
          res.status(500).send('Internal server error');
        }
      }
    }
  };

  app.get('/mcp', (req, res) => {
    queueRequest(req, res, handleSessionRequest);
  });
  
  app.delete('/mcp', (req, res) => {
    queueRequest(req, res, handleSessionRequest);
  });

  const PORT = Number(configuration.port ?? '3231');
  
  // Bind to all interfaces when running in Docker container
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OAuth server started on http://0.0.0.0:${PORT}`);
    console.log(`OAuth HTTP endpoint: http://0.0.0.0:${PORT}/mcp`);
    console.log('Required headers: Authorization, x-clickup-team-id');
  });
} 