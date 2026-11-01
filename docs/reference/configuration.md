[← Back to Documentation Index](../DOCUMENTATION.md)  
[← Back to README](../../README.md)

# Configuration

## Environment Variables

| Variable                      | Description                                                           | Default                |
| ----------------------------- | --------------------------------------------------------------------- | ---------------------- |
| `CLICKUP_MCP_LICENSE_KEY`     | Your Polar.sh license key                                             | Required               |
| `CLICKUP_API_KEY`             | ClickUp API token (primary)                                           | Required (STDIO mode)  |
| `CLICKUP_TEAM_ID`             | Default workspace/team ID (primary)                                   | Required               |
| `CLICKUP_ADDITIONAL_API_KEYS` | Comma-separated list of additional API keys for Multi-Account support | `""`                   |
| `CLICKUP_MCP_PERSONA`         | Comma-separated list of tool personas                                 | `""`                   |
| `ENABLED_TOOLS`               | Comma-separated list of tool names to enable (all others disabled)    | All tools enabled      |
| `DISABLED_TOOLS`              | Comma-separated list of tool names to disable (all others enabled)    | None disabled          |
| `ENABLED_CATEGORIES`          | Comma-separated list of categories to enable (all others disabled)    | All categories enabled |
| `DISABLED_CATEGORIES`         | Comma-separated list of categories to disable (all others enabled)    | None disabled          |

## Tool Filtering

You can control which tools are exposed to the AI agent using the following environment variables (which can also be passed as HTTP headers like `X-Enabled-Categories`):

- `CLICKUP_MCP_PERSONA`: Filter tools based on pre-defined job roles (e.g., `developer`, `project_manager`). See [Personas](personas.md) for more details on available personas.
- `ENABLED_TOOLS` / `DISABLED_TOOLS`: Filter by specific tool names (e.g., `create_task`).
- `ENABLED_CATEGORIES` / `DISABLED_CATEGORIES`: Filter by tool categories (e.g., `workspace`, `task`, `time_tracking`).

**Note on Categories:**
Categories follow the groupings in the "Available Tools" section (using lower `snake_case`). Available categories: `workspace`, `task`, `attachment`, `checklist`, `sprint`, `list`, `custom_field`, `space`, `goal`, `view`, `folder`, `tag`, `time_tracking`, `document`, `chat`, `webhook`, `user_group`, `guest`, `task_template`, `feedback`.

**Allow only specific categories:**

```json
{
  "env": {
    "ENABLED_CATEGORIES": "task,workspace,time_tracking"
  }
}
```

**Disable specific tools:**

```json
{
  "env": {
    "DISABLED_TOOLS": "delete_task,delete_bulk_tasks,delete_task_link,delete_task_dependency"
  }
}
```

## Multi-Account & Cross-Workspace Support

The server supports managing multiple accounts (OAuth + multiple API keys) in a single session. This enables cross-workspace coordination (e.g. moving a task from an account you authenticated via OAuth to a separate admin or client account configured via API Key).

Below are different configurations that illustrate this feature:

### Configuration A: OAuth Flow (No explicit API Keys)

The server initializes in unauthenticated mode and prompts the MCP client to start the OAuth flow.

```json
{
  "mcpServers": {
    "ClickUp": {
      "url": "https://clickup-mcp.taazkareem.com/mcp",
      "headers": {
        "X-License-Key": "your-license-key"
      }
    }
  }
}
```

### Configuration B: Standard Single-Account (Personal Access Token)

Bypasses OAuth entirely. The AI agent uses this key for all requests.

```json
{
  "mcpServers": {
    "ClickUp": {
      "url": "https://clickup-mcp.taazkareem.com/mcp",
      "headers": {
        "X-License-Key": "your-license-key",
        "X-ClickUp-Key": "your-api-key",
        "X-ClickUp-Team-Id": "your-team-id"
      }
    }
  }
}
```

### Configuration C: Multi-Account Federated Mode

Simultaneously federates multiple API keys with autonomous routing to ensure the AI can discover and manage tasks across all authorized accounts automatically. Also Bypasses OAuth entirely.

```json
{
  "mcpServers": {
    "ClickUp": {
      "url": "https://clickup-mcp.taazkareem.com/mcp",
      "headers": {
        "X-License-Key": "your-license-key",
        "X-ClickUp-Key": "your-api-key",
        "X-ClickUp-Team-Id": "your-team-id",
        "X-ClickUp-Additional-Keys": "apiKey2,apiKey3"
      }
    }
  }
}
```

### Configuration D: Hybrid Mode (OAuth Primary + Explicit Secondary Keys)

Triggers user OAuth while federating background API keys to enable seamless, zero-config task bridging between all connected workspaces.

```json
{
  "mcpServers": {
    "ClickUp": {
      "url": "https://clickup-mcp.taazkareem.com/mcp",
      "headers": {
        "X-License-Key": "your-license-key",
        "X-ClickUp-Additional-Keys": "key2,key3"
      }
    }
  }
}
```

## HTTP session memory

Streamable and legacy SSE sessions keep a ClickUp service stack in memory until the client disconnects cleanly. Abandoned sessions are closed automatically.

| Variable | Description | Default |
| --- | --- | --- |
| `MCP_SESSION_IDLE_TTL_MS` | Close a session after this many milliseconds without a request | `1800000` (30 min) |
| `MCP_MAX_SESSIONS` | Maximum retained streamable + SSE sessions | `48` |
| `MCP_SESSION_SWEEP_INTERVAL_MS` | How often idle sessions are swept | `60000` |

`/health` includes `sessions.streamable` and `sessions.sse`. The periodic `Heap usage` log includes `streamableSessions` and `sseSessions`.

## Polar → Brevo welcome webhook

The `/webhooks/polar` endpoint receives webhooks from Polar.sh and synchronizes paying customers and their subscription lifecycle statuses into Brevo.

For new customers (`order.paid` with billing reason `purchase` or `subscription_create`), it adds the contact to the configured Brevo list (`BREVO_LIST_ID`), triggering the onboarding/welcome automation. Subsequent events (renewal cycles and subscription lifecycle transitions) perform attribute-only updates without modifying contact list memberships or re-triggering list welcome automations.

If any of these environment variables are missing or empty, the route is disabled and returns `503 { "error": "disabled" }` (a warning is logged once per process).

| Variable | Description | Default |
| --- | --- | --- |
| `POLAR_WEBHOOK_SECRET` | Secret key used to verify Standard Webhooks HMAC-SHA256 signatures (`whsec_...`) from the Polar Dashboard (Settings → Webhooks) | Unset (route disabled) |
| `BREVO_API_KEY` | Brevo API v3 key (`xkeysib-...`) used to look up and upsert contacts from Brevo (SMTP & API → API Keys) | Unset (route disabled) |
| `BREVO_LIST_ID` | Numeric Brevo contact list ID where newly paying customers will be enrolled from Brevo (Contacts → Lists) | Unset (route disabled) |
| `CLICKUP_PRODUCT_IDS` | Comma-separated list of Polar product IDs eligible for welcome onboarding emails from Polar Dashboard (Products) | Unset (route disabled) |

### Webhook Events to Enable in Polar

Configure your Polar webhook endpoint to send the following exact events:
- `order.paid`: Initial purchase, new subscription creation, and renewal cycles (`subscription_cycle`).
- `subscription.active`: Subscription activated or payment recovered.
- `subscription.canceled`: Subscription set to cancel at period end (no Brevo write is performed; customer remains active until access is revoked).
- `subscription.uncanceled`: Customer undoes pending cancellation before period end.
- `subscription.revoked`: Subscription canceled immediately or expired at end of period.
- `subscription.past_due`: Subscription payment is past due.
- `subscription.updated`: Subscription status changed (e.g. active, trialing, past_due, unpaid, canceled, incomplete_expired).

### Brevo Contact Attributes

The following Brevo contact attributes are synchronized:
- `PLAN`: Human-readable product name and billing interval (e.g., `ClickUp MCP Pro (one-time)`, `ClickUp Unlimited Subscription (monthly)`).
- `POLAR_CUSTOMER_ID`: Polar customer ID (`cust_...`).
- `POLAR_ORDER_ID`: Polar order ID used for durable deduplication (`ord_...`).
- `PURCHASED_AT`: Purchase date (`YYYY-MM-DD`).
- `CUSTOMER_STATUS`: Customer account/subscription lifecycle state (see below).
- `FIRSTNAME`: First name token extracted from Polar customer name.
- `LASTNAME`: Remaining name tokens extracted from Polar customer name (only set if non-empty).
- `EXT_ID`: Polar customer ID stored as a Brevo contact attribute.
- `ANNUAL_OFFER_URL`: Signed personal `/annual-offer` link written when a Monthly subscription is created or activated (only when the Annual-switch offer is enabled; see below).
- `ANNUAL_OFFER_REDEEMED_AT`: Date (`YYYY-MM-DD`) when the customer switched from Monthly to Annual via `/annual-offer`.
- `ANNUAL_OFFER_PRICE`: Discounted first-year annual price recorded on switch (`47.20`).

### `CUSTOMER_STATUS` Values and Behavior

| Status | Value | Description & Lifecycle Behavior |
| --- | --- | --- |
| **Lifetime** | `lifetime` | Assigned on one-time purchase (`order.paid` with `billing_reason: purchase`). **Lifetime protection**: Contacts with `CUSTOMER_STATUS` set to `lifetime` are never downgraded by subscription events, renewal cycles, or subsequent `subscription_create` orders. |
| **Active** | `active` | Assigned on new subscriptions (`subscription_create`), recurring subscription renewal cycles (`order.paid` with `subscription_cycle`), and active subscription events (`subscription.active`, `subscription.uncanceled`, `subscription.updated` with `active` or `trialing`). |
| **Past Due** | `past_due` | Assigned when a subscription payment is overdue (`subscription.past_due` or `subscription.updated` with `past_due` or `unpaid`). |
| **Canceled** | `canceled` | Assigned when subscription access is terminated (`subscription.revoked` or `subscription.updated` with `canceled` or `incomplete_expired`). |

**Notes on status updates:**
- When `subscription.canceled` is received, Polar indicates cancel-at-period-end; Brevo is not updated so the customer stays active until revocation.
- For attribute-only updates (`subscription_cycle` and subscription lifecycle events), contacts that do not exist in Brevo return `202 { "status": "skipped", "reason": "not_in_brevo" }` and are never created.
- Attribute-only updates send `{ attributes: { CUSTOMER_STATUS: <status> } }` only (plus `ANNUAL_OFFER_URL` on `subscription.active` for the Monthly product when the annual-switch offer is enabled); they never contain `listIds` or `updateEnabled`.

## Annual-switch offer (`/annual-offer`)

The public `/annual-offer` endpoints allow active Monthly subscribers to switch to the Annual plan in one click with a 20% first-year discount (`$47.20` for year one, renewing at `$59/yr`, with unused time on the current month automatically credited via Polar's `proration_behavior: 'invoice'`).

Each subscriber receives a personal HMAC-SHA256-signed link:

```text
${ANNUAL_OFFER_BASE_URL}/annual-offer?sub=<subscription_id>&exp=<unix_seconds>&sig=<hex_hmac_sha256>
```

- `GET /annual-offer` verifies the signature and expiration, checks the subscription via the Polar API, and renders a dark branded confirmation page (or a friendly status page if already on annual, expired, or ineligible).
- `POST /annual-offer` re-verifies the signed form fields, re-checks the subscription (idempotent if already switched), executes a single `PATCH /v1/subscriptions/{id}` request to Polar with `{ product_id, discount_id, proration_behavior: "invoice" }`, logs a structured `annual_offer` redemption event, and records `ANNUAL_OFFER_REDEEMED_AT` and `ANNUAL_OFFER_PRICE` on the Brevo contact.

### Environment Variables

If `ANNUAL_OFFER_SECRET`, `ANNUAL_OFFER_DISCOUNT_ID`, or `POLAR_ACCESS_TOKEN` is missing or empty, both `GET /annual-offer` and `POST /annual-offer` are disabled and return `404`. Webhook `ANNUAL_OFFER_URL` provisioning in `/webhooks/polar` is enabled whenever `ANNUAL_OFFER_SECRET` and `ANNUAL_OFFER_DISCOUNT_ID` are set.

| Variable | Description | Default |
| --- | --- | --- |
| `ANNUAL_OFFER_SECRET` | HMAC-SHA256 signing secret used to sign and verify `${sub}.${exp}` offer links | Unset (feature disabled) |
| `ANNUAL_OFFER_DISCOUNT_ID` | Polar discount ID (20% first-year discount) applied when switching a Monthly subscription to Annual | Unset (feature disabled) |
| `POLAR_ACCESS_TOKEN` | Polar organization access token (`Bearer`) required by `/annual-offer` routes and `scripts/annual-offer-links.js` to read/update subscriptions | Unset (routes disabled) |
| `POLAR_MONTHLY_PRODUCT_ID` | Polar product UUID for the Monthly subscription plan | `e33f10cf-8178-4609-8897-cbde652fe46b` |
| `POLAR_ANNUAL_PRODUCT_ID` | Polar product UUID for the Annual subscription plan | `82676a2c-d3ed-469c-8ff3-d1845810dd3f` |
| `POLAR_API_BASE` | Polar API base URL (e.g. `https://api.polar.sh` or `https://sandbox-api.polar.sh`; accepts with or without trailing `/v1` and normalizes) | `https://api.polar.sh` |
| `ANNUAL_OFFER_BASE_URL` | Public base URL used when building signed `/annual-offer` links | `https://clickup-mcp.taazkareem.com` |
| `BREVO_API_KEY` | Brevo API v3 key used to record `ANNUAL_OFFER_REDEEMED_AT` and `ANNUAL_OFFER_PRICE` on switch (optional on `/annual-offer` — logged and skipped if unset; required for `scripts/annual-offer-links.js --write`) | Unset |

### Annual-Offer Brevo Contact Attributes

| Attribute | Format / Value | When Written |
| --- | --- | --- |
| `ANNUAL_OFFER_URL` | Full signed HTTPS URL | Written by `/webhooks/polar` on Monthly `order.paid` (`subscription_create`) and `subscription.active` with `exp = start + 42 days` (day-35 email + 7-day window), or by `scripts/annual-offer-links.js --write` with `exp = now + 7 days`. Contacts with `CUSTOMER_STATUS = lifetime` are never modified. |
| `ANNUAL_OFFER_REDEEMED_AT` | `YYYY-MM-DD` | Written on successful `POST /annual-offer` switch (source of truth alongside structured server logs, since Polar's proration invoice folds the discount into the line price and reports `discount_amount = 0`). |
| `ANNUAL_OFFER_PRICE` | `'47.20'` | Written alongside `ANNUAL_OFFER_REDEEMED_AT` on successful `POST /annual-offer` switch. |

### Backfill / One-Time Campaign Script (`scripts/annual-offer-links.js`)

To generate 7-day signed links for existing active Monthly subscribers (e.g., one-time campaign):

```bash
# 1. Build compiled helpers in build/ first
npm run build

# 2. Dry-run (default): fetches active Monthly subscriptions from Polar and prints masked preview table
node scripts/annual-offer-links.js

# 3. Write ANNUAL_OFFER_URL to Brevo contacts (skips lifetime contacts and reports 404s)
node scripts/annual-offer-links.js --write
```


