# 🔐 Security

The ClickUp MCP Server is built with security as a core concern, not an afterthought. Below is a summary of the protections in place for both STDIO (local) and hosted/remote deployments.

## Credential Handling

- **API keys are never stored or logged.** Your `CLICKUP_API_KEY` (or OAuth token) is held only in memory for the duration of the session and never written to disk or any external service.
- **No third-party credential exposure.** All ClickUp API calls are made directly from the server to ClickUp — your credentials never pass through any intermediary.

## Tenant Isolation (Hosted/Remote Mode)

In the remote deployment, every MCP session gets its own **isolated service instance** in memory:

- No user-specific data (API keys, workspace IDs, tool filters) is stored in global state
- Data from one user's session cannot leak to another
- Tool execution is scoped strictly to the session that initiated it
- Client-provided credentials always take precedence over any server-side defaults

## OAuth Security

When using OAuth 2.1 (remote mode), the server implements enterprise-grade protections:

- **HMAC-Signed State** — All redirect parameters are cryptographically signed to prevent manipulation
- **CSRF Session Binding** — Logins are bound to the initiating browser session via secure cookies
- **Timing-Safe Verification** — Cryptographic comparisons use constant-time checks to prevent side-channel attacks
- **Auto-Expiring Credentials** — Issued codes and client registrations have enforced TTLs; stale tokens are automatically rejected

## Rate Limit Handling

The server automatically manages ClickUp's API rate limits (100 requests/minute):

- Requests are spaced and queued to avoid hitting limits
- If a rate limit is reached, the server backs off and retries transparently
- No requests are silently dropped

## Tool Access Control

You can limit which tools the AI agent is allowed to use, following the principle of least privilege:

- `ENABLED_TOOLS` — whitelist specific tools; all others are blocked
- `DISABLED_TOOLS` — blacklist specific tools; all others remain available

Disabled tools are completely absent from the AI's tool list — the LLM never sees them and cannot select them. A secondary call-time check also blocks any attempt to invoke a disabled tool directly.

## Responsible Disclosure

If you discover a security vulnerability, please report it by [opening a GitHub issue](https://github.com/TaazKareem/clickup-mcp-server/issues) marked as a security concern.

---

<div align="center">
  <sub>💳 <a href="https://buy.polar.sh/polar_cl_tZ2q8jRvtaaduurOkQKKJmRgdD43ZiB5K0GZn0aQcur?utm_source=github&utm_medium=security-features">Purchase License</a> · 25% OFF Lifetime with code <strong>MAR25</strong></sub><br>
  <sub>Created by <a href="https://github.com/taazkareem">taazkareem</a></sub>
</div>
