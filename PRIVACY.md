# Privacy Policy

**Effective Date:** June 1, 2026

This Privacy Policy explains how the ClickUp MCP Server handles data. We are committed to ensuring the privacy and security of your information.

## 1. Deployment Modes & Data Handling
The ClickUp MCP Server operates in two primary environments, which determine how your data is processed:

### Local Execution Mode (STDIO)
When running the server locally via package managers (e.g., `npm` or `npx`) or within your own self-hosted infrastructure:
- **Absolute Privacy:** The server operates entirely within your environment. With the exception of a secure license validation request (see Section 2), we have no visibility into your usage, and we do not collect, intercept, or log your ClickUp workspace data.
- **Direct API Connectivity:** All communication occurs directly between your local machine and the ClickUp API. No intermediate routing through our servers occurs.

### Hosted Cloud Service (HTTP / SSE)
When utilizing the ClickUp MCP Server as a hosted web service via our endpoints:
- **Transit & Processing:** Data transmitted between your MCP client and the ClickUp API routes through our secure infrastructure. This data is processed strictly in transit to facilitate real-time communication.
- **Operational Logging:** As detailed in Section 3, we maintain temporary, redacted operational logs strictly to ensure service reliability and prevent abuse.
- **No Persistent Storage:** We do not retain, archive, or build persistent databases from any of your ClickUp content including, but not limited to tasks, documents, or chat. Our infrastructure acts solely as a secure conduit.

## 2. Credentials and Authentication
- **API Keys:** Your ClickUp API key and Team IDs are handled locally. They are stored in your environment variables and transmitted directly and securely to the ClickUp API.
- **License Keys:** If you are using the Premium version of the ClickUp MCP Server, your license key is securely validated against our licensing provider, Polar.sh. This validation request contains only your license key and organization identifier. No personal data or ClickUp workspace data is included in this request. For more details on how they handle your payment and account information, please refer to [Polar's Privacy Policy](https://polar.sh/legal/privacy-policy).
- **OAuth Sessions (Hosted Mode):** When authenticating via our hosted service, transient secure cookies and signed session states are used exclusively to safely bind your login to your browser session. These do not track cross-site behavior.

## 3. Telemetry and Analytics
We prioritize your privacy and do not collect behavioral tracking, product usage analytics, or telemetry data. 

For the **Hosted Cloud Service**, standard infrastructure monitoring and operational logs are maintained exclusively to ensure system health, prevent abuse, and diagnose technical issues. This data is never used for marketing or user profiling.

## 4. Your Privacy Rights (GDPR, CCPA)
Under global privacy frameworks (such as the GDPR in Europe or the CCPA in California), you have rights regarding your personal data. Because we do not permanently store your personal data in either deployment mode, we hold no records of your personal data to access, rectify, or delete on your behalf. 

Any data subject requests concerning your underlying workspace or task data must be directed to ClickUp, the data controller for your workspace.

## 5. Children's Privacy
The Software is intended for general audiences and business use. It is not directed at or intended for users under the age of 16. We do not knowingly collect personal data from children.

## 6. Contact Us
If you have any questions or concerns about this Privacy Policy, please contact the developer at **info@taazkareem.com**.
