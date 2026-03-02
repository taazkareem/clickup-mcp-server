[← Back to Documentation Index](../DOCUMENTATION.md)
<br>
[← Back to README](../../README.md)

# Feedback

Submit bug reports, feature requests, and questions directly from the AI agent to the project's GitHub repository.

## Tool Reference

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| submit_feedback | Submit bug reports, feature requests, or questions via GitHub | `type` (bug/feature/question), `title`, `description` | `nodeVersion`, `mcpHost`, `operatingSystem`, `additionalContext` |

The `submit_feedback` tool generates a pre-filled GitHub issue link that the user can review and submit. The AI agent will proactively suggest this tool when errors occur or when users express frustration with missing features.

## Examples

### Submitting a Bug Report
**User Prompt:**
```
I want to report that custom fields don't work with dropdown type
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "type": "bug",
  "title": "Custom field dropdown type not working",
  "description": "When attempting to set a custom field of type 'dropdown', the value is not applied correctly. The field type is not being resolved and the API returns an error.",
  "additionalContext": "Tested with set_task_custom_field tool using dropdown field name and option label"
}
```

**Tool Response:**
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "url": "https://github.com/taazkareem/clickup-mcp-server/issues/new?title=Custom+field+dropdown+type+not+working&body=...",
  "type": "bug"
}
```
