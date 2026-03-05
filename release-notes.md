# v0.13.0 Release Notes

### 🚨 Breaking Changes
- **Tool Consolidation**: Six older tools have been removed and replaced by unified equivalents. If you have saved prompts or workflows referencing these tool names, update them:
  - `get_space_tags`, `create_space_tag`, `update_space_tag`, `delete_space_tag` → **`manage_space_tags`**
  - `set_task_custom_field`, `get_list_custom_fields` → **`manage_custom_fields`**

### 🚀 What's New
- **Task Templates**: Use `get_task_templates` to browse saved templates and `create_task_from_template` to spin up fully-configured tasks from them.
- **Space Management**: `manage_spaces` gives AI full control over ClickUp Spaces — create, update, delete, and retrieve spaces by name or ID.
- **Goals & Key Results**: `manage_goals` covers the full lifecycle of Goals and Key Results with 8 actions in a single tool.
- **View Management**: `manage_views` lets you create, list, and delete views at every level — including workspace-level views.
- **Custom Field Management**: `manage_custom_fields` replaces two older tools with a unified interface for listing fields and setting values by name (no UUID needed).
- **Space Tag Management**: `manage_space_tags` consolidates four separate tag tools into one with built-in fuzzy name matching.

### ⚡️ Improvements
- **Smarter Name Matching**: All new consolidated tools support fuzzy name resolution, making them more forgiving when exact names or IDs aren't available.
- **Better Observability**: Structured JSON logs now include session context and per-tool performance metrics, improving visibility into production deployments.
- **Updated Documentation**: Updated the [Documentation](https://github.com/taazkareem/clickup-mcp-server/blob/main/docs/DOCUMENTATION.md) to include the new consolidated tools and provide clearer examples.

### 🐛 Bug Fixes
- **Composite Tool Actions**: Fixed false-positive destructive-action checks that could block legitimate multi-step operations.
