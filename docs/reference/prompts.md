[← Back to Documentation Index](../DOCUMENTATION.md)
<br>
[← Back to README](../../README.md)

# Prompts

The server exposes MCP prompts that guide multi-step workflows.

## organize_workspace

Analyzes your workspace structure and creates an actionable organization plan.

| Argument | Required | Description |
|----------|----------|-------------|
| `focus` | No | Limit analysis to a specific area of the workspace |
| `goals` | No | Describe what you want to achieve (e.g., "simplify navigation", "consolidate projects", "clean up old tasks") |

The prompt guides the AI through a 5-step process:
1. **Gather Data** — Calls `get_workspace_hierarchy` to map your workspace
2. **Analyze** — Evaluates against best practices (hierarchy depth, naming consistency, task distribution, etc.)
3. **Create Plan** — Produces a phased plan: non-destructive changes first, structural moves second, destructive cleanup last (with explicit approval)
4. **Save Plan** — Creates a ClickUp Doc titled "Workspace Organization Plan — [Date]"
5. **Execute** — Waits for user approval, then executes phase by phase with progress reporting
