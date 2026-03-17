# v0.14.1 Release Notes

### 🚀 What's New

- **Multi-Account Support**: You can now connect multiple ClickUp accounts at once by passing additional API keys in the `X-ClickUp-Additional-Api-Keys` header. The server automatically searches across all accounts when looking up tasks, lists, and workspaces by name — no manual workspace switching needed.
- **Cross-Workspace Task Migration**: Move or copy tasks between different workspaces and accounts while preserving all task data — assignees, tags, checklists, and custom fields. Essential for teams operating across multiple ClickUp environments.

### ⚡️ Improvements

- **Token-Efficient List Navigation**: All collection-listing tools (`list_tasks`, `list_lists`, `list_folders`, etc.) now support a `detail_level` parameter. Set it to `names` to get back only IDs and names — ideal for navigation and lookup queries where full details aren't needed.
- **Timezone-Aware Date Formatting**: Task and time entry dates are now formatted using your workspace's configured timezone, so dates displayed in responses match what you see in ClickUp instead of defaulting to UTC.

### 🐛 Bug Fixes

- **Custom Field Filtering**: Fixed a bug where using `get_workspace_tasks` with custom field filters (especially `RANGE` date conditions) would fail with a "statuses must be an array" error. All filter types now encode correctly and work as expected.
