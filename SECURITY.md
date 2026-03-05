# Security Policy

## Supported Versions

We currently provide security updates for the following versions of ClickUp MCP Server:

| Version | Supported          |
| ------- | ------------------ |
| 0.5.x   | :white_check_mark: |
| < 0.5.0 | :x:                |

## Reporting a Vulnerability

We take the security of the ClickUp MCP Server seriously, especially since it handles API keys and sensitive task data. If you discover a security vulnerability, please follow these steps:

1. **Do NOT disclose the vulnerability publicly** until it has been addressed by the maintainers.
2. Send details of the vulnerability to the project maintainer directly at [create a private security report](https://github.com/TaazKareem/clickup-mcp-server/security/advisories/new).
3. Include as much information as possible, such as:
   - A clear description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact of the vulnerability
   - Suggested fix if you have one

## Response Time

- You will receive an initial response to your report within 48 hours.
- We will keep you updated on our progress in addressing the vulnerability.
- Once the vulnerability is fixed, we may ask you to verify the solution.

## Security Best Practices

When using ClickUp MCP Server, please follow these security best practices:

1. **Never commit your ClickUp API keys to version control**. Always use environment variables or secure configuration management.
2. Keep your npm dependencies up to date.
3. Run the server in an isolated environment when possible.
4. Regularly check for updates to the ClickUp MCP Server to ensure you have the latest security patches.

## Policy Updates

This security policy may be updated from time to time. Please check back regularly for any changes.

## Acknowledgments

We appreciate the responsible disclosure of security vulnerabilities and will acknowledge your contribution once the issue is resolved, unless you prefer to remain anonymous. 