# OAuth 2.0 Security Hardening

This document outlines the security measures implemented in the ClickUp MCP Server's OAuth 2.1 Proxy Facade to protect against common pitfalls like account takeover and CSRF, specifically addressing vulnerabilities described in modern OAuth security research (e.g., Obsidian Security, 2026).

---

## 🔒 Security Architecture Overview

The ClickUp MCP Server acts as an **OAuth Proxy Facade**. It translates between individual **MCP Clients** (e.g., Cursor, Claude Desktop) and ClickUp's central Authorization Server. Proactive hardening is required because **from ClickUp's perspective**, several different individual clients share the MCP Server's own single identity (`client_id`). Strict isolation is necessary to prevent cross-client data leakage or authorization code theft.

### 🛡️ Implemented Protections

#### 1. HMAC-Signed Proxy State
To prevent **Redirect URI Forgery** (where an attacker modifies the authorization redirect to send the code to their own server), the `state` parameter is cryptographically signed.
- **Implementation:** The `state` object (containing the original `redirect_uri` and PKCE data) is JSON-serialized, Base64URL-encoded, and signed with an HMAC-SHA256 signature using the server's `CLICKUP_PROXY_SECRET`.
- **Verification:** During the callback phase, the server rejects any `state` parameter with a missing or invalid signature.

#### 2. State-Session Cookie Binding (CSRF Protection)
To prevent **One-Click Account Takeover**, the authentication flow is bound to the user's browser session.
- **Mechanism:** When a login flow starts, the server sets a secure, HTTP-only cookie (`mcp_auth_state`) containing the `state` value.
- **Verification:** The callback from ClickUp is only accepted if the `state` returned by ClickUp matches the value in the user's cookie. This ensures that the person who *started* the login is the same person *completing* it.
- **Strict Security:** On HTTPS connections (specifically on Render.com), the cookie uses the **`__Host-` prefix**, which pins it to the exact domain and prevents injection from subdomains.

#### 3. Automatic Credential Expiration (TTL)
To minimize the window of opportunity for stolen or leaked credentials, all stateless tokens have enforced lifespans:
- **Proxy Codes:** (The codes redirected back to MCP clients) expire after **10 minutes**.
- **Client IDs:** (Generated via Dynamic Client Registration) expire after **90 days**.
- **Timestamps:** These are embedded within the signed payloads to remain stateless.

#### 4. Timing-Safe Comparisons
All cryptographic comparisons (HMAC signatures, client secrets, and state tokens) use `crypto.timingSafeEqual()`. This protects against **side-channel attacks** where an attacker could potentially guess valid tokens by measuring slight variations in response times.

---

## 🚀 Deployment Requirements (Render.com)

If you are deploying this server as a public endpoint, you **must** configure the following environment variables to activate these protections:

| Variable | Requirement | Rationale |
|---|---|---|
| `CLICKUP_PROXY_SECRET` | **Required** | Stable random string used for all HMAC signatures. |
| `REDIRECT_URI_ALLOWLIST` | **Strict** | Restrict to schemes like `cursor://*` or `http://localhost:*`. |
| `ENABLE_RATE_LIMIT` | **Recommended** | Prevents brute-forcing of OAuth registration/token endpoints. |
| `ENABLE_SECURITY_FEATURES` | **Recommended** | Enables HSTS and other secure browser headers for the OAuth flow. |

---

## 🔍 Local vs. Remote Security Posture

### STDIO Mode (Local)
When running via STDIO (e.g., for personal Claude Desktop use), these OAuth headers and cookies are bypassed as the server communicates over a local pipe. The security is handled by your operating system's process isolation.

### HTTP/SSE Mode (Remote)
When running as a hosted service, all protections described above are **active by default** on the OAuth routes. Failure to provide a stable `CLICKUP_PROXY_SECRET` will result in the server generating a new one on every restart, which is secure but will force all users to re-authenticate.

---

## 📚 References
- [OAuth 2.1 Security Best Practices](https://datatracker.ietf.org/doc/html/rfc6749)
- [RFC 9728: MCP Authorization and Discovery](https://github.com/modelcontextprotocol/specification)
- Obsidian Security: *When MCP Meets OAuth: Common Pitfalls* (2026)
