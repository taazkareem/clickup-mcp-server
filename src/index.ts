#!/usr/bin/env node

/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * ClickUp MCP Server
 *
 * This custom server implements the Model Context Protocol (MCP) specification to enable
 * AI applications to interact with ClickUp workspaces. It provides a standardized
 * interface for managing tasks, lists, folders and other ClickUp entities using Natural Language.
 *
 * Key Features:
 * - Complete task management (CRUD operations, moving, duplicating)
 * - Workspace organization (spaces, folders, lists)
 * - Bulk operations with concurrent processing
 * - Natural language date parsing
 * - File attachments support
 * - Name-based entity resolution
 * - Markdown formatting
 * - Built-in rate limiting
 *
 * For full documentation and usage examples, please refer to the README.md file.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { configureServer, server } from './server.js';
import { clickUpServices } from './services/shared.js';
import { info, error } from './logger.js';
import config from './config.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { startSSEServer } from './sse_server.js';
import { startOAuthServer } from './server_oauth.js';

// Get directory name for module paths
const __dirname = dirname(fileURLToPath(import.meta.url));

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  error('Uncaught Exception', { message: err.message, stack: err.stack });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  error('Unhandled Rejection', { reason });
  process.exit(1);
});

async function startStdioServer() {
  info('Starting ClickUp MCP Server...');

  // Log essential information about the environment
  info('Server environment', {
    pid: process.pid,
    node: process.version,
    os: process.platform,
    arch: process.arch,
  });

  // Configure the server with all handlers
  info('Configuring server request handlers');
  await configureServer();

  // Connect using stdio transport
  info('Connecting to MCP stdio transport');
  const transport = new StdioServerTransport();
  await server.connect(transport);

  info('Server startup complete - ready to handle requests');
}

/**
 * Application entry point that configures and starts the MCP server.
 */
async function main() {
  try {
    if (config.enableOAuth) {
      info('Starting ClickUp MCP Server in OAuth mode');
      startOAuthServer();
    } else if (config.enableSSE) {
      info('Starting ClickUp MCP Server in SSE mode');
      startSSEServer();
    } else {
      info('Starting ClickUp MCP Server in STDIO mode');
      await startStdioServer();
    }
  } catch (err) {
    error('Error during server startup', {
      message: err.message,
      stack: err.stack,
    });
    process.exit(1);
  }
}

main().catch(err => {
  error('Unhandled server error', { message: err.message, stack: err.stack });
  process.exit(1);
});
