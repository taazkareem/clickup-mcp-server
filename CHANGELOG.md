# Changelog

## v0.12.16 (2026-03-01)

### 🚀 New Features
- **Organize Workspace Prompt**: A powerful new AI-guided workflow that analyzes your ClickUp hierarchy, identifies clutter (empty containers, excessive nesting), and generates a phased, non-destructive reorganization plan saved directly as a ClickUp Doc.

### 🐛 Bug Fixes
- **Universal AI Compatibility (Gemini CLI)**: Fixed a critical `400 Bad Request` error that prevented the Gemini CLI and Google Cloud Code from loading tools. This was caused by the introduction of unsupported JSON Schema keywords like `nullable` and `any`.
- **Schema Validation Hardening**: Added explicit property definitions for rich text comment attributes to prevent validation failures on stricter MCP hosts.
- **Strict Type Compliance**: Replaced all instances of `type: "any"` with valid JSON Schema types, ensuring successful registration across all "Big Three" AI platforms (Claude, Gemini, GPT-4).
- **Universal Schema Compatibility**: Standardized the task priority schema to string types across all task operations to ensure maximum compatibility with strict AI clients.
- **Document Creation Reliability**: Fixed a bug where creating document pages could fail because the ClickUp API expects the `parent_type` parameter to be strictly lowercase.

### ⚡️ Improvements
- **Optimized Task Filtering**: Cleaned up the `get_workspace_tasks` tool by removing redundant and stale parameter definitions, resulting in faster tool selection and reduced token overhead.
- **Cross-Platform Schema Standard**: Established a new "Safe-Schema Standard" in development guidelines to ensure all future tools work seamlessly across different AI environments without modification.
- **Smarter Tagging**: Adding tags to tasks now supports fuzzy matching for existing tags and automatically normalizes separators, making the tool much more forgiving and easier for AI models to use.
- **Clearer Bulk Deletion Confirmations**: The `delete_bulk_tasks` tool now returns the actual names of the deleted tasks in its response instead of just IDs, providing better context after the action.
- **Documentation**: Substantially updated the User Guide with clarified examples, improved documentation alignment, and corrected previous formatting inaccuracies.

## v0.12.15 (2026-02-28)

### 🚀 New Features
- **Task Checklists**: Full checklist management is now available with 6 new tools:
  - `create_checklist` — Add a named checklist to any task (resolved by name or ID).
  - `edit_checklist` — Rename a checklist or reorder it relative to others on a task.
  - `delete_checklist` — Remove a checklist and all its items from a task.
  - `create_checklist_item` — Add a line item to a checklist, with optional user assignment.
  - `edit_checklist_item` — Check/uncheck, rename, reassign, or nest checklist items under each other.
  - `delete_checklist_item` — Remove a single checklist item.
- **Checklist Visibility**: Existing checklists on a task are returned as part of `get_task` — no separate read tool needed.
- **Custom Field Discovery**: Added `get_list_custom_fields` to find field IDs and types instantly.
- **Direct Custom Field Updates**: Added `set_task_custom_field` with built-in name resolution—update fields by name without needing UUIDs.

### ⚡️ Improvements
- **Full-Fidelity Task Duplication**: `duplicate_task` now copies tags, time estimates, start dates, custom fields, checklists (with items), and subtasks. Previously only basic fields (name, description, status, priority, due date, assignees) were copied. Warns when source task has attachments (ClickUp API limitation).
- **Deep Search**: Implemented auto-paging (up to 1000 tasks) for custom field filters to ensure findings are accurate across deep task lists.
- **Smart Normalization**: Automatically handles both 10-digit (seconds) and 13-digit (milliseconds) timestamps for reliable date range filtering.
- **Token Efficiency**: Optimized task summaries to save up to 70% of response tokens by stripping redundant custom field metadata.
- **Multi-Select & Labels Support**: Enhanced filtering to correctly handle array-based values like Multi-select and Labels.

### 🐛 Bug Fixes
- **Search Accuracy (Double-Check)**: Integrated a client-side verification layer to ensure results always match criteria, even when ClickUp API endpoints are less precise.
- **Custom Field Formatting**: Fixed JSON structure for custom field filters to strictly match ClickUp API v2 specification.

## v0.12.14 (2026-02-21)

### 🚀 New Features & Improvements
- **Task Integrity (TIML) Support**:
  - Implemented high-integrity task moves using "Tasks in Multiple Lists" (TIML) strategy.
  - **Non-Destructive Moves**: Preserves Task ID, comments, attachments, and history.
  - **Explicit Fallback Confirmation**: Opt-in fallback to copy-delete strategy when plan limits are reached (403 Forbidden). Requires `allowDestructiveFallback: true`.
- **New Multi-List Tools**: `add_task_to_list` and `remove_task_from_list` for advanced cross-project tracking.
- **Context Awareness Enhancement**: Updated `get_list` and `get_folder` to include `statuses`, allowing AI agents to identify valid workflow states.
- **Structural Tools**: Added `move_list` and `move_folder` with "High-Integrity Move" strategy to bypass API limitations while preserving data.
- **Faster Workspace Discovery**: Optimized finding folders and lists by checking the hierarchy cache first, significantly reducing response times for name-based searches.

### ⚡️ Improvements & Architecture
- **Shared Service Caching**: Refactored service instantiation to use shared `ListService` instances, ensuring synchronized caches and reduced memory overhead.
- **Security Hardening**: Implemented SSRF mitigation with hostname validation for the ClickUp API `baseUrl`.
- **Global Search & Resolution**: Significantly improved name-based resolution for tasks, lists, and folders across the entire workspace.
- **Refined Error Handling**: Added differentiated handling for `403 Forbidden` errors to enable intelligent plan-aware fallbacks.


### ⚠️ Deprecations
- **resolve_assignees**: This tool has been deprecated and removed. Its functionality is now natively integrated into all task management tools (`create_task`, `update_task`, `create_bulk_tasks`, `create_task_comment`, etc.). You can now pass names directly to the `assignees` parameter in these tools.

## v0.12.12 (2026-02-14)

### 🚀 Hierarchical Task Creation
- Added support for recursive subtask creation in both `create_task` and `create_bulk_tasks`.
- Fixed `create_bulk_tasks` schema to properly allow `parent` fields.
- Updated `formatTaskData` to explicitly include the `parent` ID in tool responses.

### 🐛 Bug Fixes
- **Workspace Grounding**: Fixed a critical bug where the LLM lacked workspace context in single-workspace scenarios from OAuth flows.

## v0.12.11 (2026-02-14)

### 🚀 New Features & Security

- **Hybrid Authentication**: Implemented OAuth 2.1 compliant per MCP Authorization Specification. Supports backward compatibility with API Key/Team ID headers which when provided, bypasses the OAuth flow.
- **Enterprise-Grade Hardening**:
  - **Login Protection**: Added HMAC-signed state and CSRF binding to prevent login hijacking and unauthorized redirects.
  - **Rate Limiting**: Integrated smart rate limiting for authentication routes to protect against brute-force attacks.

### ⚡️ Improvements & Architecture

- **Rock-Solid Connections**: Resolved race conditions and login loops, particularly for bridges or adapters like `mcp-remote`.
- **Smarter Path Discovery**: Enhanced compatibility with IDEs like VS Code by improving how authentication and transport paths are discovered.
- **README Redesign**: Completely overhauled the project documentation with a new icon-based Table of Contents and a "Choose your integration" guide for 14+ different AI platforms and IDEs.
- **Modular Architecture**: Completely reorganized internal authentication logic into a dedicated module for better reliability and faster future updates.

### 🐛 Bug Fixes

- **Universal AI Compatibility**:
  - **Critical Schema Fix**: Resolved a high-priority issue where the Gemini API would reject tool definitions due to literal `null` values in `enum` arrays. (Eliminates `HTTP 400 Bad Request` and `cannot be empty` errors).
  - **Impact**: Ensures reliability across Antigravity Agent, Vertex AI, and Google AI SDKs.
  - **Refined Validation**: Corrected the `priority` schema in `bulk_update_tasks` while maintaining `nullable` support for standard JSON Schema compliance.

## v0.12.10 (2026-02-06)

### 🐛 Bug Fixes

- **Full Claude Code & Anthropic Compatibility**:
  - **Reliable Performance**: Resolved schema validation errors ensuring the server works perfectly with Claude Code, Claude Desktop, and other Anthropic-powered clients.
  - **Comprehensively Verified**: Tested across 34+ core tools and operations with a 100% success rate in Claude Code.
  - **Impact**: Eliminates "unsupported keyword" errors during tool discovery.

- **Improved Stability for CLI Tools**:
  - Fixed an issue where the server would terminate prematurely on errors, causing cryptic `-32603` "Internal error" messages in one-shot clients like `mcporter`.
  - **Impact**: CLI tools now correctly receive error responses instead of standard output being cut off.


## v0.12.9 (2026-02-04)

### 🚀 New Features & Improvements

- **Rich Markdown in Comments**:
  - Full markdown formatting support for chat messages.
  - Full @mention support for chat messages.
  - Partial markdown support (API limitation) for task comments. Working: **bold**, *italics*, `inline code`, and structured lists (bulleted and numbered).
  - Automatically converts standard Markdown into ClickUp's rich text format for beautiful, readable messages from AI agents.

- **Intelligent @Mention Support**:
  - **Smart Resolution**: Typing `@Name` or `mention Name` simply works. The server automatically finds the right user ID.
  - **Fuzzy Matching**: Matches partial names (e.g., `@Jess` finds "Jessica") and handles typos gracefully.
  - **Ambiguity Handling**: correctly distinguishes between similar names (e.g. `@Talib` vs `@Talib Kareem`), prioritizing exact matches when available but falling back to smart matches otherwise.


## v0.12.8 (2026-02-02)

### 🚀 New Features

- **Native Custom Task Types**: Set task types like "Bug" or "Milestone" using simple names. No more looking up obscure Type IDs—the server handles resolution and caching automatically while maintaining strict per-user isolation.
- **Hardened Multi-Tenant Security**: Every user session now runs in a 100% isolated environment. Caches, search history, and multi-chunk operations are strictly confined to the specific session, ensuring zero data leakage in multi-tenant deployments.
- **Proactive Status Normalization**: The server now intelligently maps conversational status names (e.g., "Ready", "Done") to your actual ClickUp statuses using fuzzy matching. No more errors when your AI assistant uses a slightly different status name than your workspace's strict defaults.
- **Dynamic Tool Access**: Administrators can now control tool availability on a per-session basis, allowing for granular permission management in remote/shared environments.

### ⚡️ Improvements

- **Smarter Name Searching**: Finding tasks, folders, and lists by name is now more reliable and handles small typos better across all ClickUp entities.
- **Faster Response Times**: Optimized task information retrieval and validation for improved performance and reduced token usage.
- **Clearer AI Instructions**: Improved tool descriptions so AI assistants understand how to use ClickUp tools more accurately and effectively.
- **Updated Guides**: Refreshed technical and user documentation to reflect recent improvements and best practices.


## v0.12.7 (2026-01-30)

### 🐛 Bug Fixes

- **Fixed license validation race condition in one-shot CLI environments**:
  - Resolved License errors when using fast-executing clients like `mcporter call`
  - **Root cause**: License validation was asynchronous and didn't block tool calls, causing the first `tools/call` request to arrive before validation completed
  - **Solution**: Tool handlers now await license initialization before checking validity
  - Added `waitForLicenseInit()` function that blocks until license validation completes
  - Modified `initializeLicense()` to store and reuse its promise, preventing duplicate validation attempts
  - **Impact**: One-shot CLI tools (mcporter, custom scripts) now work reliably without race conditions or artificial delays
  - **Files affected**: `license.ts`, `server.ts`

## v0.12.6 (2026-01-21)

### 🚀 New Features

- **Feedback Submission Tool**:
  - Added `submit_feedback` tool for submitting bug reports, feature requests, and questions.
  - Generates pre-filled GitHub issue URLs - no authentication required from users.
  - Supports `bug`, `feature`, and `question` issue types with automatic label assignment.
  - Includes environment fields: Node.js version, MCP Host (Claude Desktop, Cursor, etc.), and Operating System.
  - **Proactive Guidance**: Tool description instructs LLMs to suggest feedback submission when users encounter errors or express frustration.
  - **Error Hints**: Error responses now include a tip to use the feedback tool, making it easier for users to report issues.

## v0.12.4 (2026-01-18)

### 🚀 New Features

- **Markdown Description Support**:
  - Added `include_markdown_description` parameter to `get_task` tool.
  - Enables fetching the high-fidelity `markdown_description` field, preserving tables, formatting, and image references.
  - Implementation includes intelligent re-fetching for name-based resolution to ensure markdown content is always available when requested.
  - Empowers LLMs to dynamically request rich context when precise formatting is essential for either analysis or modification.


## v0.12.2 (2025-12-31)

### 🚨 Breaking Changes

- **Removed `delete_document` tool**:
  - The `delete_document` tool has been removed due to API limitations and inconsistencies with the ClickUp V3 API.
  - Verification confirmed that programmatic deletion via the available endpoints is not reliably supported for documents created via V3.
  - **Action Required**: Users relying on this tool should use the ClickUp UI for document deletion.

### 🚀 New Features

- **Document Name Resolution**:
  - Enable interacting with documents using their names (e.g., "Project Specs") instead of obscure UUIDs.
  - Supports context-aware resolution (finding "Specs" inside "Engineering" folder).
  - Applied to all document management tools (`get_document`, `create_document_page`, etc.).

- **Parent Task Name Resolution**:
  - Simply pass a task name to the `parent` parameter when creating or updating subtasks.
  - Eliminates the need to look up parent Task IDs beforehand.
  - **Tools Affected**: `create_task`, `update_task`.

### ⚡️ Improvements

- **LLM Tool Optimization**:
  - Refined all 50+ tool descriptions for maximum clarity and minimum token usage.
  - Specific optimizations for: `get_workspace_tasks`, `get_chat_channels`, `list_folders`, and member tools.
  - **Impact**: Faster tool selection and more accurate parameter generation by AI models.

- **Documentation Organization**:
  - Moved detailed Member Management technical documentation to the User Guide for better readability.


## v0.12.1 (2025-12-31)

### 🚀 New Features

- **ClickUp Chat Tool Support (V3 API)**:
  - Added full support for ClickUp Chat functionality using V3 API endpoints
  - **New Tools**:
    - `create_chat_channel`: Create new chat channels in workspaces/spaces
    - `get_chat_channels`: Retrieve all chat channels
    - `create_chat_message`: Send messages with markdown support
    - `get_chat_messages`: Read message history from channels
  - **Smart Features**:
    - Channel Name Resolution: Interact with channels by name instead of ID
    - Markdown Support: Send formatted messages including bold, italics, etc.

## v0.11.5 (2025-12-31)

### 🚀 New Features

- **Formatted Comment Support for Task Comments** (PR #80):
  - Enhanced `create_task_comment` tool to support rich text formatting via new `formattedComment` parameter
  - Supports text formatting: **bold**, *italic*, underline, strikethrough, and inline code
  - Supports hyperlinks with clickable URLs
  - Supports user mentions (@mentions) by user ID
  - Supports emojis via unicode values
  - Supports code blocks with optional language syntax highlighting
  - Supports bulleted lists, numbered lists, and checklists (with checked/unchecked states)
  - `commentText` and `formattedComment` are now mutually optional (at least one required)
  - **Impact**: Enables AI assistants to create richly formatted comments with structure and styling

### 🐛 Bug Fixes

- **Fixed MCP schema compatibility with strict clients**:
  - Added missing `type: "string"` to custom field `value` properties in task operation schemas
  - Resolves compatibility issues with MCP clients that require explicit type declarations (e.g., Home Assistant)
  - Affected tools: `create_task`, `update_task`, `create_bulk_tasks`, `update_bulk_tasks`
  - **Impact**: Server now works correctly with all MCP clients, including those with strict schema validation
  - Thanks to @jozala for identifying and reporting the issue in PR #88

### 🔒 Internal Improvements

- **Enhanced build pipeline security**:
  - Improved code protection for published npm package via obfuscation
  - Enhanced license validation robustness with checksums and fail-closed logic
  - Implemented secure hashed secret for sandbox mode activation
  - Internal infrastructure improvements for premium distribution

## v0.11.1 (2025-12-29)

### 🐛 Critical Bug Fixes

- **Fixed "EOF" and "Unexpected token" errors in MCP hosts when using SSE transport**:
  - Resolved protocol corruption caused by console output interfering with JSON-RPC stream
  - Moved all startup logs (license validation, SSE initialization, security warnings) to file-based logger (`build/server.log`)
  - Changed logger to append mode to preserve diagnostic information across restarts
  - Ensures completely silent `stdout` and `stderr` during startup for MCP protocol compliance
  - **Impact**: Eliminates connection failures with Claude Desktop and other strict MCP hosts

- **Port conflict handling for SSE transport**:
  - Added explicit error handlers for HTTP/HTTPS servers to gracefully handle port conflicts
  - Server now logs port binding errors to `build/server.log` instead of crashing silently
  - STDIO transport continues running even if SSE port (3231) is unavailable
  - **Impact**: Improved stability when multiple server instances are running

### 🚀 Improvements

- **Non-blocking license validation**:
  - Made license validation asynchronous to prevent handshake timeouts
  - Server now responds to MCP `initialize` requests immediately
  - License check runs in background without blocking startup sequence
  - **Impact**: Faster connection establishment with MCP hosts

- **Safe configuration validation**:
  - Moved config validation to explicit function call instead of import-time check
  - Configuration errors now logged to file instead of causing silent crashes
  - Better error diagnostics for missing environment variables
  - **Impact**: Easier troubleshooting of configuration issues

### 📋 Technical Details

- All console.log/console.error calls replaced with file-based Logger throughout codebase
- Enhanced error handling in server initialization sequence
- Improved logging detail for startup diagnostics
- Files affected: `logger.ts`, `license.ts`, `sse_server.ts`, `index.ts`, `config.ts`, `handlers.ts`

## v0.11.0 (2025-12-25)

### 🚀 New Features
- **Threaded Task Comments**: Added `include_replies` support to `get_task_comments` for retrieving full conversation threads and replies.
- **Configurable Host Binding**: Added `HOST` environment variable support to allow the server to bind to external interfaces (e.g., `0.0.0.0`), facilitating production and Docker deployments.
- **Task to Subtask Conversion**: Enhanced `update_task` tool with a `parent` parameter, allowing users to convert existing tasks into subtasks of another task (Issue #107).
- **Task Relationship Tools**:
  - **add_task_link**: Create relationships between tasks (equivalent to ClickUp's Task Links feature).
  - **get_task_links**: Retrieve all links/relationships for a task.
  - **delete_task_link**: Remove task links/relationships.
  - Supports both regular task IDs and custom task IDs, with name-based resolution for ease of use.
- **Lightweight Workspace Task Listing**: Added `'names'` detail level to `get_workspace_tasks` for optimized retrieval of just task names and IDs, reducing token usage.
- **Detailed Time Entries**: Upgraded `get_task_time_entries` to use the ClickUp V2 detailed endpoint, providing richer entry data including individual session details.
- **Document Deletion**: Added `delete_document` tool to manage ClickUp document cleanup.

### 🏗️ Architecture Improvements
- **TaskService Composition Architecture**: Major architectural refactoring, transitioning from deep inheritance to a clean composition pattern.
  - Composes `TaskServiceCore`, `TaskServiceSearch`, `TaskServiceComments`, `TaskServiceAttachments`, `TaskServiceTags`, and `TaskServiceCustomFields`.
  - Improves maintainability and testability while maintaining 100% backward compatibility for all 50+ MCP tools.

### 📋 Documentation & DX
- **README Updates**: Refined tool counts and descriptions to reflect the latest feature set.
- **Team ID Retrieval**: Clarified instructions for retrieving the ClickUp Team ID from Workspace URLs.
- **NPM Package Refinement**: Optimized package contents for faster installation and smaller footprint.

### 🐛 Bug Fixes
- **Workspace Tasks Filtering**: Fixed Issue #104 where `list_ids` filtering in workspace tasks occasionally returned empty results.
- **Estimate Token Context**: Resolved a runtime crash in `get_workspace_tasks` caused by incorrect context binding.

## v0.10.0 (2025-12-24)

### 🚀 Improvements
- **License Validation Sandbox**: Added support for Polar.sh sandbox environment.
- **Enhanced Debugging**: Implemented detailed logging for license key validation to improve troubleshooting.

## v0.9.1 (2025-12-24)

### 🐛 Bug Fixes
- **Polar.sh Checkout**: Updated links to use direct checkout URLs for a smoother premium upgrade flow.

## v0.9.0 (2025-12-24)

### 🚀 Major Changes
- **Premium Sponsorware Transition**: Transitioned the project to a premium sponsorware model.
- **License Key System**: Integrated license key validation powered by Polar.sh.
- **Storefront Documentation**: Updated README and assets for the new premium storefront.


## v0.8.5 (2025-07-11)

### 🚀 New Features & Improvements

- **Major Enhancement: Comprehensive Natural Language Date Parsing System**:
  - **Complete Natural Language Support**: 47+ natural language patterns with 100% accuracy
    - **Future expressions**: `"in 6 days"`, `"3 days later"`, `"after 2 weeks"`, `"5 days ahead"`, `"next 3 days"`
    - **Past expressions**: `"6 days ago"`, `"3 days back"`, `"2 weeks before"`, `"5 days earlier"`, `"last 3 days"`
    - **Article support**: `"a day ago"`, `"in a week"`, `"an hour later"` (a/an automatically converted to 1)
    - **Flexible connectors**: `"3 days later around 2pm"`, `"by 5pm"`, `"on Monday"` (at/around/by/on)
    - **Formal terms**: `"overmorrow"` (day after tomorrow), `"ereyesterday"` (day before yesterday)
  - **Extended Time Units**: Complete support for days, weeks, months, and years
    - **Months**: `"in 6 months"`, `"3 months ago"`, `"after 9 months"`, `"2 months later"`
    - **Years**: `"in 2 years"`, `"5 years ago"`, `"after 1 year"`, `"3 years from now"`
    - **Dynamic numbers**: Any number works (1, 6, 15, 30, 100, 365+) with perfect accuracy
  - **Smart Preprocessing**: Typo correction, time normalization, complex expression handling
  - **Enhanced Formats**: US dates, text months, relative expressions, timestamps, time specifications
  - **Performance**: Sub-millisecond parsing (~0.188ms) with 100% backward compatibility

### 🐛 Bug Fixes

- **Fixed Task Assignment Functionality**:
  - **Root Cause**: ClickUp API uses different formats for assignees in task creation vs updates
    - Creation: `"assignees": [user_id1, user_id2]` (simple array)
    - Updates: `"assignees": { "add": [user_id1], "rem": [user_id2] }` (object with add/rem arrays)
  - **Parameter Parsing**: Fixed MCP serialization issue where assignee arrays were received as strings
  - **Smart Assignment Logic**: Implemented intelligent add/remove calculation by comparing current vs desired assignees
  - **Complete Functionality**: Now supports adding, removing, and updating task assignees
  - **Multiple Formats**: Supports user IDs, emails, and usernames for assignee resolution
  - **TypeScript Types**: Updated interfaces to support both array and object assignee formats
  - **Testing**: Verified full assignment cycle (add → remove → re-add) works correctly

- **Fixed Track Time tool response formatting issue**:
  - Fixed issue where Track Time tools (start/stop time tracking, get time entries, etc.) were executing successfully but returning no output to users
  - **Root cause**: Time tracking handlers were returning raw JavaScript objects instead of using proper MCP server response formatting
  - **Solution**: Updated all 6 time tracking handlers to use `sponsorService.createResponse()` method for consistent response formatting
  - **Handlers fixed**: `handleStartTimeTracking`, `handleStopTimeTracking`, `handleGetTaskTimeEntries`, `handleAddTimeEntry`, `handleDeleteTimeEntry`, `handleGetCurrentTimeEntry`
  - **Enhanced error handling**: All error responses now use `sponsorService.createErrorResponse()` for consistent error formatting
  - **Added null safety**: Fixed potential undefined property access in time entries data with proper null checks
  - **Improved user experience**: Added helpful success messages and proper data structure formatting
  - **Impact**: Track Time tools now provide clear, formatted JSON responses instead of appearing to run silently

## v0.8.4 (2025-07-09)

### 🔒 Security Features

- **Comprehensive MCP Streamable HTTPS Transport Security Implementation**:
  - **HTTPS/TLS Support**: Added optional HTTPS server alongside HTTP for encrypted communication
    - Environment variables: `ENABLE_HTTPS`, `SSL_KEY_PATH`, `SSL_CERT_PATH`, `SSL_CA_PATH`, `HTTPS_PORT`
    - Dual protocol support: HTTP (3231) and HTTPS (3443) run simultaneously for backwards compatibility
    - Self-signed certificate generation script: `./scripts/generate-ssl-cert.sh`
    - Production-ready with CA-issued certificates
  - **Origin Header Validation**: Prevents cross-site attacks by validating Origin header against whitelist
    - Environment variable: `ENABLE_ORIGIN_VALIDATION=true`
    - Default allowed origins: `127.0.0.1:3231`, `localhost:3231`, plus HTTPS variants
    - Smart handling: Allows non-browser clients (n8n, MCP Inspector) while blocking unauthorized origins
  - **Rate Limiting Protection**: Protects against DoS attacks with configurable request limits
    - Environment variable: `ENABLE_RATE_LIMIT=true`
    - Default: 100 requests per minute per IP address
    - Configurable via: `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`
  - **CORS Configuration**: Secure cross-origin resource sharing for web applications
    - Environment variable: `ENABLE_CORS=true`
    - Supports GET, POST, DELETE, OPTIONS methods
    - Headers: Content-Type, mcp-session-id, Authorization
  - **Security Headers**: Web security best practices when `ENABLE_SECURITY_FEATURES=true`
    - X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
    - Referrer-Policy, Strict-Transport-Security (HTTPS only)
  - **Request Size Limits**: Prevents memory exhaustion attacks
    - Configurable limit: `MAX_REQUEST_SIZE=10mb` (default)
    - Hard limit: 50MB maximum
  - **Security Monitoring**: Comprehensive logging and health endpoint
    - Health endpoint: `/health` shows security status
    - Security event logging: origin validation, rate limits, violations
    - Log levels: DEBUG, INFO, WARN, ERROR for security events
  - **Zero Breaking Changes**: All security features are opt-in and disabled by default
    - Existing clients (Claude Desktop, n8n, MCP Inspector) work unchanged
    - No configuration changes required for current users
    - Backwards compatibility thoroughly tested and verified

### 🐛 Bug Fixes

- **Fixed priority null handling in task updates (Issue #23)**:
  - Fixed `update_task` tool failing when setting priority to `null` to clear/remove priority
  - Modified `buildUpdateData` function to use `toTaskPriority` helper for proper null value conversion
  - Priority updates now work correctly for both setting valid values (1-4) and clearing priority (null)
  - Bulk task updates (`update_bulk_tasks`) already worked correctly and continue to function properly

- **Fixed subtasks not being retrieved (Issue #69)**:
  - Fixed `getSubtasks` method in `task-core.ts` to include required query parameters
  - Added `subtasks=true` and `include_subtasks=true` parameters to ClickUp API call
  - Subtasks are now properly retrieved and displayed when using `get_task` tool with `subtasks=true`
  - Resolves issue where subtasks arrays were always empty despite subtasks existing in ClickUp

## v0.8.3 (2025-07-03)

### 🚀 New Features & Improvements

- **Enhanced workspace tasks filtering with Views API support (Issue #43)**:
  - **Enhanced list filtering**: When `list_ids` are provided, `get_workspace_tasks` now uses ClickUp's Views API for comprehensive task coverage
  - **Multi-list task support**: Now retrieves tasks that are *associated with* specified lists, including tasks created elsewhere and added to multiple lists
  - **Two-tier filtering strategy**:
    - **Server-side filtering**: Supported filters applied at ClickUp API level for efficiency (statuses, assignees, dates, etc.)
    - **Client-side filtering**: Additional filters applied after data retrieval (tags, folder_ids, space_ids)
  - **API endpoints used**:
    - `GET /list/{listId}/view` - Retrieves list views and identifies default list view
    - `GET /view/{viewId}/task` - Retrieves all tasks associated with the view/list
  - **Performance optimizations**:
    - Concurrent API calls for multiple lists using `Promise.all()`
    - Task deduplication to prevent duplicate results
    - Automatic summary format switching for large result sets
    - Safety limits to prevent infinite pagination loops
  - **Robust error handling**: Graceful degradation when some lists fail, comprehensive logging
  - **Backward compatibility**: Existing functionality unchanged when `list_ids` not provided
  - **Impact**: Addresses ClickUp's "tasks in multiple lists" feature, providing complete task coverage for list-based queries

    Thanks @dantearaujo for the help!

- **Added ENABLED_TOOLS configuration option (PR #39 & Issue #50)**:
  - Added `ENABLED_TOOLS` environment variable and command line argument support
  - Allows specifying exactly which tools should be available via comma-separated list
  - Provides complementary functionality to existing `DISABLED_TOOLS` option
  - **Precedence logic**: `ENABLED_TOOLS` takes precedence over `DISABLED_TOOLS` when both are specified
  - **Configuration options**:
    - `ENABLED_TOOLS=tool1,tool2` - Only enable specified tools
    - `DISABLED_TOOLS=tool1,tool2` - Disable specified tools (legacy approach)
    - If neither specified, all tools are available (default behavior)
  - **Enhanced tool filtering**:
    - Updated `ListToolsRequestSchema` handler to use new filtering logic
    - Updated `CallToolRequestSchema` handler with improved error messages
    - Clear distinction between "disabled" vs "not in enabled tools list" errors
  - **Impact**: Users can now precisely control tool availability for security, context limitations, or workflow optimization
  - **Backward compatibility**: Existing `DISABLED_TOOLS` functionality unchanged

  Thanks @somework & @colinmollenhour for the help!

### 🛠️ Bug Fixes

- **Fixed automatic priority assignment in task creation**:
  - Fixed issue where `create_task` and `create_bulk_tasks` tools were automatically setting priorities even when users didn't specify one
  - **Root cause**: Priority field was unconditionally included in API requests as `undefined`, which ClickUp interpreted as a request to set a default priority
  - **Solution**: Priority field is now only included in API requests when explicitly provided by the user
  - **Impact**: Tasks created without specifying a priority will now have `priority: null` instead of an automatically assigned priority
  - **Affected tools**: `create_task_ClickUp__Local_` and `create_bulk_tasks_ClickUp__Local_`
  - **Backward compatibility**: Tasks created with explicit priority values continue to work unchanged

## v0.8.2 (2025-06-12)

### 🚀 New Features & Improvements

### �🛠️ Bug Fixes

- **Fixed task assignment feature not working (Issue #48)**:
  - Fixed critical bug where task assignees were not being properly assigned despite successful API responses
  - Root cause: Missing assignee resolution logic in task creation and update handlers
  - Added comprehensive assignee resolution supporting multiple input formats:
    - Numeric user IDs (e.g., `96055451`)
    - Email addresses (e.g., `"user@example.com"`)
    - Usernames (e.g., `"John Doe"`)
    - Mixed format arrays (e.g., `[96055451, "user@example.com"]`)
  - Enhanced task handlers with automatic assignee resolution:
    - `create_task` - Now resolves assignees before task creation
    - `update_task` - Now resolves assignees during task updates
    - `create_bulk_tasks` - Now resolves assignees for each task in bulk operations
  - Added proper deduplication for duplicate assignees in mixed format requests
  - Added graceful error handling for unresolvable assignees (continues with resolved ones)
  - **Impact**: Task assignment now works correctly for all documented assignee formats
  - **Supported formats**: User IDs, email addresses, usernames, and mixed arrays

- **Fixed task due date updates not working (Issue #49)**:
  - Fixed critical bug where `update_task` returned success but didn't actually update due dates
  - Root cause: `updateTaskHandler` was not calling `buildUpdateData()` to parse date strings into timestamps
  - Enhanced natural language date parsing to support complex formats:
    - Added support for day names: "Monday", "Friday", "Saturday", etc.
    - Added time parsing: "Monday at 3pm EST", "Friday at 2:30pm", etc.
    - Added "next" prefix handling: "next Friday", "next Monday", etc.
    - Improved fallback parsing with multiple strategies and validation
  - **Impact**: Due date updates now work correctly for all supported date formats
  - **Supported formats**: "tomorrow", "Monday at 3pm EST", "next Friday", Unix timestamps, "MM/DD/YYYY", relative times like "2 hours from now"

- **Fixed subtask visibility in workspace tasks (Issue #56)**:
  - Added missing `subtasks` parameter to `get_workspace_tasks` tool
  - Added missing `include_subtasks`, `include_compact_time_entries`, and `custom_fields` parameters for completeness
  - Updated tool description to clarify how subtasks parameter works with filtering
  - **Impact**: Users can now access subtasks through workspace-wide queries when subtasks match filter criteria
  - **Note**: Subtasks must still match other filter criteria (tags, lists, etc.) to appear in results
  - **Alternative**: Use `get_task` tool with `subtasks=true` to see all subtasks of a specific task regardless of filters

### 🔗 References

- #48: [Task Assignment Feature Not Working through ClickUp MCP Integration API](https://github.com/taazkareem/clickup-mcp-server/issues/48)
- #49: [update_task not updating due dates](https://github.com/taazkareem/clickup-mcp-server/issues/49)
- #56: [Can't see sub-tasks](https://github.com/taazkareem/clickup-mcp-server/issues/56)
## v0.8.1 (2025-06-12)

### 🛠️ Critical Bug Fixes

- **Fixed JSON Schema Validation Error**:
  - Resolved server startup failure with error: `Invalid schema for tool list_document_pages: strict mode: unknown keyword: "optional"`
  - Removed invalid `optional: true` keywords from document tool schemas
  - Fixed schemas for: `list_document_pages`, `get_document_pages`, `create_document_page`, `update_document_page`
  - **Technical Note**: In JSON Schema, optional properties are defined by omitting them from the `required` array, not by using an `optional` keyword
  - **Impact**: Server now starts correctly without schema validation errors

### 🔄 Repository Updates

- Updated document tool schemas to comply with strict JSON Schema validation
- Ensured all tools load properly and are fully functional
- Maintained zero breaking changes - all existing functionality preserved

## v0.8.0 (2025-06-12)

### 🚀 Major Features & Architectural Improvements

- **HTTP Streamable Transport Support**:
  - Added HTTP Streamable transport implementation for modern web-based integrations
  - Dual transport support: can run both STDIO and HTTP/SSE simultaneously
  - New configuration options:
    - `ENABLE_SSE` - Enable HTTP/SSE transport (default: false)
    - `PORT` - HTTP server port (default: 3231)
    - `ENABLE_STDIO` - Enable STDIO transport (default: true)
  - HTTP server endpoints:
    - `/mcp` - HTTP Streamable endpoint for MCP protocol communication
    - `/sse` - Legacy SSE endpoint for backwards compatibility
  - Enhanced integration capabilities:
    - MCP Inspector compatibility
    - Web application compatibility
    - Multiple client connection support
    - Session management for stateful interactions

- **Massive Codebase Refactor & Optimization**:
  - **70% total codebase reduction** (1,566 → 466 lines)
  - **Eliminated 1,100+ lines of duplicated tool definitions** (89% reduction in SSE server)
  - Unified server architecture eliminating code duplication
  - Single source of truth for server configuration
  - Clean separation between server logic and transport setup
  - Improved maintainability and extensibility

- **Member Management Tools**:
  - Added `get_workspace_members` - Retrieve all workspace members with details
  - Added `find_member_by_name` - Find specific members by name or email
  - Added `resolve_assignees` - Resolve user IDs/emails to assignee objects
  - Enhanced task creation with `assignees` parameter for user assignment
  - **Enhanced task updating with `assignees` parameter** for both single and bulk operations
  - Support for assignees in create, update, and bulk operations (create/update)
  - Improved error handling and response formatting for member operations

### 🔄 Repository Updates

- Refactored transport architecture for unified server configuration
- Enhanced configuration system for transport selection
- Improved imports and code organization for maintainability
- Updated tool schemas to support assignees parameter
- Comprehensive testing across all transport types

## v0.7.2 (2025-04-25)

### 🛠️ Bug Fixes

- Fixed time estimate support in task updates:
  - Removed redundant field-specific validation check in task update operations
  - Simplified validation to check only for the presence of update fields
  - Fixed "At least one field to update must be provided" error when using time_estimate
  - Added time string parsing for converting formats like "2h 30m" to minutes
  - Improved tool description for clear guidance on supported formats
  - Ensures compatibility with all fields defined in the UpdateTaskData type

### 🔗 References

- #45: [Bug: Time estimates not allowed when updating tasks](https://github.com/taazkareem/clickup-mcp-server/issues/45)

## v0.7.1 (2025-04-24)

### 🚀 New Features & Improvements

- Added Documents Module with comprehensive document management:
  - Document listing and search across workspace
  - Document creation with customizable visibility
  - Document page management (create, list, get, update)
  - Optional module activation via `DOCUMENT_SUPPORT=true` environment variable
  - Support for both API V2 and V3 endpoints
- Added comprehensive Time Tracking functionality:
  - View time entries for tasks with filtering options
  - Start/stop time tracking on tasks
  - Add manual time entries with flexible duration formats
  - Delete time entries
  - View currently running timer with elapsed time information
  - Track billable and non-billable time
- Added command disabling capability:
  - New `DISABLED_TOOLS` environment variable
  - Disable specific commands via comma-separated list
  - Support for both environment variable and command line argument
  - Improved security through selective command access
  - Clear error messages for disabled command attempts

### 🛠️ Bug Fixes & Improvements

- Fixed custom task ID lookup in `getTaskByCustomId` method:
  - Corrected API endpoint from `/task/custom_task_ids` to `/task/{id}` with proper parameters
  - Added required `custom_task_ids=true` and `team_id` parameters for proper authentication
  - Fixed "Authorization failed" error when retrieving tasks by custom ID
  - Improved error handling and logging for custom ID operations
- Fixed JSON schema type definitions in task tools for improved compatibility with third-party parsers:
  - Updated schema to use single string type with nullable property instead of array types
  - Ensures compatibility with Go-based parsers like windsurf that have strict type requirements
  - Affected tools: `update_task`, `update_bulk_tasks`
- Enhanced custom field handling in task updates:
  - Fixed issue with custom field updates not being properly applied
  - Improved validation and processing of custom field values
  - Ensures consistent behavior across all task update operations

### 🔄 Repository Updates

- Updated documentation with new document module features
- Added configuration guide for disabled commands
- Enhanced API reference with document management examples
- Added documentation for time tracking tools
- Improved API reference accuracy for task update operations

### 🔗 References

- #37: [Fix authorization issue with custom task IDs](https://github.com/taazkareem/clickup-mcp-server/issues/37)
- #36: [Fix types for windsurf compatibility](https://github.com/taazkareem/clickup-mcp-server/pull/36)
- #38: [Add time tracking functionality](https://github.com/taazkareem/clickup-mcp-server/pull/38)
- #39: [Add command disabling capability](https://github.com/taazkareem/clickup-mcp-server/pull/39)
- #40: [Fix custom field updates](https://github.com/taazkareem/clickup-mcp-server/pull/40)
- #41: [Add document module](https://github.com/taazkareem/clickup-mcp-server/pull/41)

## v0.6.9 (2025-04-03)

### 🚀 New Features & Improvements

- Enhanced token limit protection for workspace tasks:
  - Added handler-level token limit validation (50,000 tokens)
  - Implemented smart response format switching
  - Automatic fallback to summary format for large responses
  - Improved token estimation for task responses
  - Added logging for format switching events
  - Double-layer protection at both service and handler levels

### 🔄 Repository Updates

- Updated task handler implementation with token limit checks
- Added token estimation utilities for task responses

## v0.6.6 (2025-04-03)

### 🐛 Bug Fixes

- Fixed task caching issue causing rate limits:
  - Task IDs from name lookups weren't being shared between sequential operations
  - Each tool operation was performing redundant global task searches
  - Added task name-to-ID mapping in cache to prevent duplicate lookups
  - Improved caching efficiency for sequential operations on same task

## v0.6.5 (2025-03-28)

- Added start date support for tasks:
  - Set task start dates with natural language expressions (e.g., "now", "tomorrow at 9am")
  - Support for both creation and updates via `startDate` parameter
  - Proper time handling with `start_date_time` flag
- Added Global Task Lookup feature:
  - Find tasks by name across the entire workspace without specifying a list
  - Smart disambiguation when multiple tasks share the same name
  - Context-aware results showing list, folder, and space for each match
  - Default selection of most recently updated task when multiple matches exist
  - Backward compatible with list-specific lookups
  - Applied to all task operations: get_task, update_task, delete_task, etc.
  - Improved error messages with actionable information for disambiguation

### 🚀 Performance Optimizations

- Implemented parallel request optimization for task operations:
  - Parallel validation of tasks and lists in move operations
  - Concurrent processing of task and list data
- Added task validation caching:
  - 5-minute TTL cache for task and list validations
  - Reduced redundant API calls in bulk operations
  - Optimized cache updates after successful operations
- Enhanced workspace hierarchy fetching:
  - Implemented batched space processing (3 spaces at a time)
  - Added batched folder processing (5 folders at a time)
  - Improved rate limit compliance with controlled concurrency
  - Added detailed performance logging and metrics

## v0.6.2 (2025-03-27)

### 🛠️ Bug Fixes

- Fixed binary execution issue by adding proper shebang line to the main executable

### 🚀 New Features & Improvements

- Added tag support with tools for:
  - Managing tags at the space level (get, create, update, delete)
  - Adding/removing tags from tasks
  - Support for tags when creating and updating tasks
- Enhanced bulk task creation with tags support
- Added natural language color processing for tags:
  - Create tags with color names (e.g., "blue", "red", "yellow")
  - Support for color variations (e.g., "dark blue", "light green")
  - Automatic generation of contrasting foreground colors
  - Color commands in both tag creation and updates
- Added `get_workspace_tasks` tool for retrieving filtered workspace tasks by various criteria:
  - Requires at least one filter parameter (tags, list_ids, space_ids, etc.)
  - Supports filtering by tags, due dates, status, and more
  - Includes pagination and sorting options
  - Implements Adaptive Response Format with two detail levels:
    - `summary`: Lightweight response with essential task information
    - `detailed`: Complete task information with all fields (default)
  - Automatic format selection based on response size (50,000 token threshold)
  - Optimized for handling large datasets efficiently

### 🔄 Repository Updates

- Updated documentation to reflect new tool requirements and capabilities
- Improved API reference with detailed examples and response formats

## v0.6.0 (2025-03-26)

### 🚀 New Features & Improvements

- Added subtasks support with multi-level nesting capability
- Implemented parent parameter for creating subtasks
- Made logging level configurable via environment variable or command line
- Fixed custom task ID handling across all operations
- Default log level now set to ERROR for improved compatibility

### 📦 Dependencies

- No dependency changes in this release

### 🔄 Repository Updates

- Updated documentation for subtasks feature
- Improved API reference with subtasks examples
- Added Security Policy and Code of Conduct

### 🔗 References

- #18: [See pull request](https://github.com/taazkareem/clickup-mcp-server/pull/18)
- #20: [See pull request](https://github.com/taazkareem/clickup-mcp-server/pull/20)

## v0.5.1 (2025-03-23)

### 🚀 New Features & Improvements

- Added support for Custom IDs across all tools
- New tools:
  - `attach_task_file`: Attach files to tasks using local paths, URLs, or base64 data
  - `create_task_comment`: Add comments to tasks
  - `get_task_comments`: Retrieve comments from tasks
- Enhanced date parsing with support for "X minutes from now" expressions
- Improved task name matching with greater flexibility:
  - Case-insensitive matching
  - Partial name matching
  - Matching without emojis
- Fixed error response formatting in task comment retrieval
- Improved workspace hierarchy display to correctly show lists directly in spaces

### 📦 Dependencies

- Updated dependencies to use semantic versioning
- Upgraded:
  - @modelcontextprotocol/sdk: 0.6.0 → 0.6.1
  - axios: 1.6.7 → 1.8.4
  - dotenv: 16.4.1 → 16.4.7

### 🔄 Repository Updates

- Added automated changelog generation
- Updated documentation and README
- Added funding options through GitHub Sponsors and Buy Me A Coffee

## v0.5.0 (2025-03-22)

### 🚀 Initial Release

- First public version of ClickUp MCP Server
- Core functionality for task, list, and folder management
- Basic workspace hierarchy navigation
- NPM and Smithery deployment options

### 🔄 Repository Updates

- Initial README and documentation
- Added GitHub workflow for publishing
- Created Funding options through GitHub Sponsors and Buy Me a Coffee

### 🔗 References

- #12: [See pull request](https://github.com/taazkareem/clickup-mcp-server/pull/12)
