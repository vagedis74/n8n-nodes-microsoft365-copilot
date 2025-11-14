# n8n-nodes-microsoft365-copilot

This is an n8n community node that allows you to use Microsoft 365 Copilot's chat functionality in your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Microsoft 365 Copilot](https://www.microsoft.com/en-us/microsoft-365/copilot) is an AI-powered assistant that works across your Microsoft 365 applications and data.

## Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Azure App Registration Setup](#azure-app-registration-setup)
- [Credentials Configuration](#credentials-configuration)
- [Operations](#operations)
- [Usage Examples](#usage-examples)
- [Important Limitations](#important-limitations)
- [Compatibility](#compatibility)
- [Resources](#resources)
- [License](#license)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Node Installation

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-microsoft365-copilot` in **Enter npm package name**
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes
5. Select **Install**

### Manual Installation

To install manually for development:

```bash
npm install n8n-nodes-microsoft365-copilot
```

For development:

```bash
git clone https://github.com/yourusername/n8n-nodes-microsoft365-copilot.git
cd n8n-nodes-microsoft365-copilot
npm install
npm run build
npm link
```

## Prerequisites

### License Requirements

- **Microsoft 365 Copilot License**: Each user accessing the Copilot API must have a Microsoft 365 Copilot add-on license
- **Organizational Account**: Only work or school accounts are supported (personal Microsoft accounts are NOT supported)

### API Status

⚠️ **Important**: This node uses the Microsoft Graph API Beta endpoints. The API is currently in preview and subject to change. It is NOT recommended for production applications.

## Azure App Registration Setup

Before using this node, you need to register an application in Azure:

### 1. Create App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Microsoft Entra ID** (formerly Azure Active Directory)
3. Select **App registrations** > **New registration**
4. Enter a name (e.g., "n8n Microsoft 365 Copilot")
5. Select **Accounts in this organizational directory only** (Single tenant)
6. Under **Redirect URI**, select **Web** and enter your n8n OAuth callback URL:
   ```
   https://your-n8n-instance.com/rest/oauth2-credential/callback
   ```
   For local development:
   ```
   http://localhost:5678/rest/oauth2-credential/callback
   ```
7. Click **Register**

### 2. Configure API Permissions

After registration, add the required delegated permissions:

1. Go to **API permissions** > **Add a permission**
2. Select **Microsoft Graph** > **Delegated permissions**
3. Add the following permissions:
   - `Sites.Read.All` - Read items in all site collections
   - `Mail.Read` - Read user mail
   - `People.Read.All` - Read all users' relevant people lists
   - `OnlineMeetingTranscript.Read.All` - Read all transcripts of online meetings
   - `Chat.Read` - Read user chat messages
   - `ChannelMessage.Read.All` - Read all channel messages
   - `ExternalItem.Read.All` - Read all external items
4. Click **Add permissions**
5. Click **Grant admin consent for [Your Organization]** (requires admin)

### 3. Create Client Secret

1. Go to **Certificates & secrets** > **Client secrets**
2. Click **New client secret**
3. Enter a description (e.g., "n8n integration")
4. Select an expiration period
5. Click **Add**
6. **Copy the secret value immediately** (you won't be able to see it again)

### 4. Get Required Information

You'll need these values for n8n credentials:

- **Application (client) ID**: Found on the app's **Overview** page
- **Tenant ID**: Found on the app's **Overview** page
- **Client Secret**: The value you copied in step 3

## Credentials Configuration

### Setting Up OAuth2 Credentials in n8n

1. In n8n, go to **Credentials** > **New**
2. Search for **Microsoft 365 Copilot OAuth2 API**
3. Fill in the following fields:
   - **Tenant ID**: Your Microsoft Entra ID tenant ID
   - **Client ID**: Your application (client) ID from Azure
   - **Client Secret**: The secret value you created
4. Click **Connect my account**
5. Authenticate with your Microsoft 365 account
6. Grant the requested permissions
7. Click **Save**

## Operations

### Conversation

- **Create**: Create a new Copilot conversation
  - Returns a conversation ID that can be used for subsequent chat messages
  - No additional parameters required

### Chat

- **Send Message**: Send a message to an existing conversation and receive Copilot's response
  - **Required Parameters**:
    - **Conversation ID**: ID of an existing conversation
    - **Message**: The text message/prompt to send to Copilot
  - **Optional Parameters**:
    - **Timezone**: Location timezone for context (e.g., "America/New_York", default: "UTC")
    - **Additional Context**: Extra grounding context to help Copilot provide more relevant responses
    - **Enable Web Search**: Whether to enable web search for this message (default: true)

## Usage Examples

### Example 1: Simple Chat Workflow

1. **Create Conversation** node
   - Resource: Conversation
   - Operation: Create

2. **Send Message** node
   - Resource: Chat
   - Operation: Send Message
   - Conversation ID: `{{$json.id}}` (from previous node)
   - Message: "What meetings do I have tomorrow?"
   - Timezone: "America/New_York"

### Example 2: Multi-Turn Conversation

You can store the conversation ID and reuse it for multiple messages:

1. Create conversation once
2. Save conversation ID to a variable or database
3. Send multiple messages using the same conversation ID
4. Each message maintains context from previous messages in the conversation

### Example 3: With Additional Context

```
Resource: Chat
Operation: Send Message
Conversation ID: [your-conversation-id]
Message: "Summarize this information"
Additional Context: "Focus on Q4 financial results and compare to Q3"
Enable Web Search: true
Timezone: Europe/London
```

## Important Limitations

### API Limitations

- **Beta API**: Subject to change without notice
- **Text Only**: Only returns text responses (no file creation, email sending, or meeting scheduling)
- **No Actions**: Cannot perform actions, only provides information and insights
- **Single-Turn Web Search**: Web search context applies per message, not across conversation
- **Timeouts**: Not suitable for long-running tasks due to gateway timeout risks

### Authentication Limitations

- **Delegated Permissions Only**: Application permissions are NOT supported
- **User Context Required**: Always operates in the context of the authenticated user
- **No Personal Accounts**: Only organizational (work/school) accounts are supported

### License Requirements

- Users without Microsoft 365 Copilot licenses cannot use this API
- All API calls are subject to Microsoft's usage quotas and throttling

### Security and Compliance

- All organizational security policies are enforced
- Data access respects user permissions and sensitivity labels
- Audit logs and compliance controls are maintained

## Compatibility

- n8n version 1.0.0 or later
- Node.js version 22.0.0 or later

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Microsoft 365 Copilot API Overview](https://learn.microsoft.com/en-us/graph/api/resources/copilot-api-overview)
- [Microsoft Graph API Reference](https://learn.microsoft.com/en-us/graph/api/overview)
- [Microsoft Entra ID OAuth 2.0](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)

## Development

### Build the Node

```bash
npm install
npm run build
```

### Run Locally for Testing

```bash
npm run dev
```

This will start n8n with your node loaded. Access it at `http://localhost:5678`.

### Lint

```bash
npm run lint
npm run lint:fix
```

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/yourusername/n8n-nodes-microsoft365-copilot).

## License

[MIT](LICENSE)

---

## Future Enhancements

### MCP Protocol Support

The Model Context Protocol (MCP) is not currently supported by the Microsoft 365 Copilot API. If Microsoft adds MCP support in the future, this node could be extended to:

- Connect to MCP servers for additional tool capabilities
- Expose custom tools and data sources to Copilot
- Enable more advanced agentic workflows

For now, complex tool orchestration can be achieved by using n8n's workflow capabilities alongside the Copilot node.

---

**Note**: This is a community-maintained node and is not officially supported by Microsoft or n8n. Use at your own risk and always test thoroughly before using in production workflows.
