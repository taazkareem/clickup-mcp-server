# Security Features

The ClickUp MCP Server includes optional security enhancements that can be enabled without breaking existing functionality. All security features are **opt-in** to maintain backwards compatibility with existing clients.

## 🔒 Security Features Overview

| Feature | Environment Variable | Default | Description |
|---------|---------------------|---------|-------------|
| **Security Features** | `ENABLE_SECURITY_FEATURES` | `false` | Master switch for security headers and logging |
| **HTTPS Support** | `ENABLE_HTTPS` | `false` | Enables HTTPS/TLS encryption |
| **Origin Validation** | `ENABLE_ORIGIN_VALIDATION` | `false` | Validates Origin header against whitelist |
| **Rate Limiting** | `ENABLE_RATE_LIMIT` | `false` | Protects against DoS attacks |
| **CORS Configuration** | `ENABLE_CORS` | `false` | Configures cross-origin resource sharing |

## 🚀 Quick Security Setup

### Basic Security (Recommended for Production)

```bash
# Enable basic security features
ENABLE_SECURITY_FEATURES=true \
ENABLE_HTTPS=true \
ENABLE_ORIGIN_VALIDATION=true \
ENABLE_RATE_LIMIT=true \
SSL_KEY_PATH=./ssl/server.key \
SSL_CERT_PATH=./ssl/server.crt \
npx @taazkareem/clickup-mcp-server@latest \
  --env CLICKUP_API_KEY=your-api-key \
  --env CLICKUP_TEAM_ID=your-team-id \
  --env ENABLE_SSE=true
```

### Full Security Configuration

```json
{
  "mcpServers": {
    "ClickUp": {
      "command": "npx",
      "args": ["-y", "@taazkareem/clickup-mcp-server@latest"],
      "env": {
        "CLICKUP_API_KEY": "your-api-key",
        "CLICKUP_TEAM_ID": "your-team-id",
        "ENABLE_SSE": "true",
        "PORT": "3231",
        "ENABLE_SECURITY_FEATURES": "true",
        "ENABLE_ORIGIN_VALIDATION": "true",
        "ENABLE_RATE_LIMIT": "true",
        "ENABLE_CORS": "true",
        "ALLOWED_ORIGINS": "http://127.0.0.1:3231,http://localhost:3231",
        "RATE_LIMIT_MAX": "100",
        "RATE_LIMIT_WINDOW_MS": "60000",
        "MAX_REQUEST_SIZE": "10mb"
      }
    }
  }
}
```

## 📋 Detailed Configuration

### HTTPS/TLS Support

Enables encrypted communication using HTTPS instead of plain HTTP.

```bash
ENABLE_HTTPS=true
SSL_KEY_PATH=./ssl/server.key
SSL_CERT_PATH=./ssl/server.crt
SSL_CA_PATH=./ssl/ca.crt          # Optional: Certificate Authority
HTTPS_PORT=3443                   # Optional: HTTPS port (default: 3443)
```

**Certificate Generation:**

⚠️ **IMPORTANT:** SSL certificates are machine-specific and should NEVER be committed to git.

For development, generate self-signed certificates:
```bash
# Run the included certificate generation script
./scripts/generate-ssl-cert.sh

# Or manually with OpenSSL
openssl genrsa -out ssl/server.key 2048
openssl req -new -x509 -key ssl/server.key -out ssl/server.crt -days 365 \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

🔒 **Security Note:** The `ssl/` directory is in `.gitignore` to prevent accidental commits.

**Production Certificates:**
- Use certificates from a trusted Certificate Authority (Let's Encrypt, etc.)
- Ensure certificates include appropriate Subject Alternative Names
- Set up automatic certificate renewal

**Behavior:**
- ✅ Runs both HTTP and HTTPS servers simultaneously
- ✅ HTTPS endpoints available on port 3443 (configurable)
- ✅ HTTP endpoints remain on port 3231 for backwards compatibility
- ⚠️ Self-signed certificates will trigger browser warnings
- 🔒 All data encrypted in transit with TLS

**HTTPS Endpoints:**
- `https://127.0.0.1:3443/mcp` (Streamable HTTPS)
- `https://127.0.0.1:3443/sse` (Legacy SSE HTTPS)
- `https://127.0.0.1:3443/health` (Health check HTTPS)

### Origin Validation

Validates the `Origin` header against a whitelist to prevent cross-site attacks.

```bash
ENABLE_ORIGIN_VALIDATION=true
ALLOWED_ORIGINS="http://127.0.0.1:3231,http://localhost:3231,http://127.0.0.1:3000"
```

**Default Allowed Origins:**
- `http://127.0.0.1:3231` (MCP Inspector)
- `http://localhost:3231` (n8n, web clients)
- `http://127.0.0.1:3000` (Legacy SSE port)
- `http://localhost:3000` (Legacy SSE port)

**Behavior:**
- ✅ Allows requests without Origin header (non-browser clients like n8n)
- ✅ Validates Origin header when present
- ❌ Blocks unauthorized origins with 403 Forbidden
- 📝 Logs all validation attempts for monitoring

### Rate Limiting

Protects against denial-of-service attacks by limiting request frequency.

```bash
ENABLE_RATE_LIMIT=true
RATE_LIMIT_MAX=100              # Max requests per window
RATE_LIMIT_WINDOW_MS=60000      # Window size in milliseconds (1 minute)
```

**Default Configuration:**
- **100 requests per minute** per IP address
- Returns `429 Too Many Requests` when exceeded
- Includes standard rate limit headers

### CORS Configuration

Configures Cross-Origin Resource Sharing for web applications.

```bash
ENABLE_CORS=true
```

**CORS Settings:**
- **Origins:** Uses `ALLOWED_ORIGINS` configuration
- **Methods:** `GET`, `POST`, `DELETE`, `OPTIONS`
- **Headers:** `Content-Type`, `mcp-session-id`, `Authorization`
- **Credentials:** Enabled for authenticated requests

### Security Headers

Adds security-related HTTP headers when `ENABLE_SECURITY_FEATURES=true`.

**Headers Added:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security` (HTTPS only)

### Request Size Limits

Controls maximum request payload size to prevent memory exhaustion.

```bash
MAX_REQUEST_SIZE=10mb           # Default: 10MB
```

**Limits:**
- **Configurable limit:** Via `MAX_REQUEST_SIZE` (default: 10MB)
- **Hard limit:** 50MB (cannot be exceeded)
- **Error response:** `413 Request Entity Too Large`

## 🔍 Security Monitoring

### Health Check Endpoint

Monitor server security status:

```bash
curl http://127.0.0.1:3231/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-09T10:30:00.000Z",
  "version": "0.8.3",
  "security": {
    "featuresEnabled": true,
    "originValidation": true,
    "rateLimit": true,
    "cors": true
  }
}
```

### Security Logging

When security features are enabled, the server logs:
- ✅ Successful origin validations
- ❌ Blocked unauthorized origins
- ⚠️ Rate limit violations
- 📊 Request metrics and timing
- 🔍 Session management events

**Log Levels:**
- `DEBUG`: Detailed security events
- `INFO`: Normal security operations
- `WARN`: Security violations and blocks
- `ERROR`: Security-related errors

## 🔧 Backwards Compatibility

### Zero Breaking Changes

All security features are **opt-in** and **disabled by default**:

- ✅ Existing clients continue to work unchanged
- ✅ No configuration changes required for current users
- ✅ All endpoints remain functional
- ✅ Session management unchanged
- ✅ Transport protocols unaffected

### Client Compatibility

**Tested with:**
- ✅ Claude Desktop (STDIO transport)
- ✅ n8n MCP AI Tool (HTTP/SSE transport)
- ✅ MCP Inspector (HTTP Streamable transport)
- ✅ Custom web clients
- ✅ Browser-based applications

### Migration Path

1. **Current users:** No action required - server works as before
2. **Security-conscious users:** Enable features gradually
3. **Production deployments:** Enable all security features

## 🚨 Security Best Practices

### For Development
```bash
# Minimal security for local development
ENABLE_SECURITY_FEATURES=true
```

### For Production
```bash
# Full security for production deployment
ENABLE_SECURITY_FEATURES=true
ENABLE_ORIGIN_VALIDATION=true
ENABLE_RATE_LIMIT=true
ENABLE_CORS=true
```

### For High-Security Environments
```bash
# Maximum security configuration
ENABLE_SECURITY_FEATURES=true
ENABLE_ORIGIN_VALIDATION=true
ENABLE_RATE_LIMIT=true
ENABLE_CORS=true
RATE_LIMIT_MAX=50
RATE_LIMIT_WINDOW_MS=60000
MAX_REQUEST_SIZE=5mb
ALLOWED_ORIGINS="http://127.0.0.1:3231"  # Restrict to specific origins
```

## 🔍 Troubleshooting

### Common Issues

**403 Forbidden Errors:**
- Check `ALLOWED_ORIGINS` includes your client's origin
- Verify `ENABLE_ORIGIN_VALIDATION` is appropriate for your setup

**429 Rate Limit Errors:**
- Increase `RATE_LIMIT_MAX` if needed
- Check if client is making excessive requests

**CORS Errors:**
- Enable `ENABLE_CORS=true`
- Verify origin is in `ALLOWED_ORIGINS`

### Debug Mode

Enable detailed security logging:
```bash
LOG_LEVEL=debug
```

This will show all security decisions and validations in the log file.
