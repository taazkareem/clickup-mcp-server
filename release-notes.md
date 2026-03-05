# v0.13.1 Release Notes

### 🐛 Bug Fixes
- **More Reliable Remote Connections**: Fixed an issue where restarting the server or scaling instances could cause active connections to fail with a "Bad Request" error.
- **Smoother Authentication Fallback**: Authenticated requests now correctly fall back to "stateless" mode if a session ID is missing or unrecognized, ensuring uninterrupted service for remote clients and high-availability deployments.

---

# v0.13.0 Release Notes

### 🚀 New Features
- **Task Templates**: Two new tools — `get_task_templates` retrieves available templates in a list, and `create_task_from_template` creates a fully-configured task from any saved template.
- **Space Management (`manage_spaces`)**: Full CRUD for ClickUp Spaces — create, update, delete, get, and list spaces directly from AI. Supports name-based lookup.
- **Goals & Key Results (`manage_goals`)**: Comprehensive goal tracking with 8 actions covering full lifecycle management of Goals and their Key Results.
- **View Management (`manage_views`)**: Create, list, and delete views at any level of the hierarchy — teams, spaces, folders, lists, and workspace-level views.
- **Custom Field Management (`manage_custom_fields`)**: Unified tool for listing custom fields and setting field values on tasks by name — no UUID required.
- **Space Tag Management (`manage_space_tags`)**: A single tool replacing four — create, update, delete, and list space tags with built-in fuzzy name resolution.

### ⚡️ Improvements
- **Fuzzy Name Resolution**: All new consolidated tools support finding resources by approximate name match, making them more forgiving and easier for AI models to use.
- **Session-Aware Logging & Telemetry**: Implemented structured JSON logging with session context and per-request performance tracking for improved observability.
- **AI Instructions Hardening**: Server-level AI persona instructions now more explicitly guide models to use the Ask User tool before destructive or ambiguous operations.

### 🚨 Breaking Changes
- **Space Tag Tool Consolidation**: Separate space tag tools have been replaced by a single `manage_space_tags` tool.
- **Custom Field Tool Consolidation**: `set_task_custom_field` and `get_list_custom_fields` have been replaced by the new `manage_custom_fields` tool.
