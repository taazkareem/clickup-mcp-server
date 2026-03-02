[← Back to Documentation Index](../DOCUMENTATION.md)
<br>
[← Back to README](../../README.md)

# Members & Workspace Organization

Look up workspace members, find users by name or email, and explore the full workspace hierarchy of spaces, folders, and lists.

## Tool Reference

### Member Management

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| get_workspace_members | Get all members in workspace | None | None |
| find_member_by_name | Find member by name or email | `nameOrEmail` | None |

### Workspace Organization

| Tool | Description | Required Parameters | Response |
|------|-------------|-------------------|----------|
| get_workspace_hierarchy | Get complete structure | None | Full workspace tree with spaces, folders, and lists |

## Examples

### Viewing Workspace Structure
**User Prompt:**
```
Show me the workspace structure
```

**Generated Request:**
```json
{
  "team_id": "9876543210"
}
```

**Tool Response:**
```json
{
  "workspace": {
    "id": "team_123",
    "name": "My Workspace",
    "spaces": [
      {
        "id": "space_eng",
        "name": "Engineering",
        "lists": [
          {
            "id": "list_backlog",
            "name": "Sprint Backlog"
          }
        ],
        "folders": [
          {
            "id": "folder_dev",
            "name": "Development",
            "lists": [
              {
                "id": "list_frontend",
                "name": "Frontend Tasks"
              },
              {
                "id": "list_backend",
                "name": "Backend Tasks"
              }
            ]
          }
        ]
      },
      {
        "id": "space_product",
        "name": "Product",
        "lists": [
          {
            "id": "list_roadmap",
            "name": "Roadmap"
          }
        ],
        "folders": []
      }
    ]
  }
}
```

### Listing Workspace Members
**User Prompt:**
```
Who is in my workspace?
```

**Generated Request:**
```json
{
  "team_id": "9876543210"
}
```

**Tool Response:**
```json
{
  "members": [
    {
      "id": 1234567,
      "username": "developer1",
      "email": "dev1@example.com",
      "role": 1,
      "color": "#ff7800"
    },
    {
      "id": 7654321,
      "username": "manager1",
      "email": "manager@example.com",
      "role": 2,
      "color": "#0080ff"
    },
    {
      "id": 9876543,
      "username": "sarah_connor",
      "email": "sarah@example.com",
      "role": 3,
      "color": "#28a745"
    }
  ],
  "count": 3
}
```

### Finding a Member
**User Prompt:**
```
Find the user named Sarah
```

**Generated Request:**
```json
{
  "team_id": "9876543210",
  "nameOrEmail": "Sarah"
}
```

**Tool Response:**
```json
{
  "member": {
    "id": 9876543,
    "username": "sarah_connor",
    "email": "sarah@example.com",
    "role": 3,
    "color": "#28a745"
  }
}
```
