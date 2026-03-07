[← Back to Documentation Index](../DOCUMENTATION.md)  
[← Back to README](../../README.md)  

# Members & Workspace Organization

Look up workspace members, find users by name or email, and explore the full workspace hierarchy of spaces, folders, and lists.

## Tool Reference

### Member Management

| Tool | Description | Required Parameters | Optional Parameters |
|------|-------------|-------------------|-------------------|
| find_member_by_name | Find member by name or email | `nameOrEmail` | None |

### Workspace Organization

| get_workspace | Get complete structure and metadata | None | `include_hierarchy` (default true), `include_members`, `include_plan`, `include_seats`, `include_shared`, `include_custom_items` | Full workspace tree and requested metadata |

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
  "team_id": "9876543210",
  "include_hierarchy": false,
  "include_members": true
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
      "profilePicture": "https://..."
    }
  ]
}
```

### Getting Workspace Plan & Usage
**User Prompt:**
```
What is our workspace plan and seat utilization?
```

**Generated Request:**
```json
{
  "include_hierarchy": false,
  "include_plan": true,
  "include_seats": true
}
```

**Tool Response:**
```json
{
  "plan": {
    "name": "Unlimited",
    "has_trial": false
  },
  "seats": {
    "total": 10,
    "filled": 5,
    "available": 5
  }
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
