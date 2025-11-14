# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n community node for Microsoft 365 Copilot chat functionality. It allows n8n workflows to interact with Microsoft 365 Copilot using the Microsoft Graph API.

## Technology Stack

- **Language**: TypeScript
- **Platform**: n8n (workflow automation)
- **API**: Microsoft Graph API (Beta)
- **Authentication**: OAuth 2.0 via Microsoft Entra ID
- **Build Tools**: TypeScript Compiler, ESLint, Prettier

## Project Structure

```
n8n-nodes-microsoft365-copilot/
├── credentials/                    # OAuth2 credential implementations
│   └── Microsoft365CopilotOAuth2Api.credentials.ts
├── nodes/                          # n8n node implementations
│   └── Microsoft365Copilot/
│       └── Microsoft365Copilot.node.ts
├── icons/                          # SVG icons for the node
│   └── microsoft365copilot.svg
├── dist/                           # Compiled JavaScript output (gitignored)
├── package.json                    # npm package configuration with n8n metadata
├── tsconfig.json                   # TypeScript compiler configuration
├── eslint.config.mjs              # ESLint rules for code quality
└── README.md                       # User documentation
```

## Build and Development Commands

### Install Dependencies
```bash
npm install
```

### Build the Project
```bash
npm run build
```
This compiles TypeScript to JavaScript in the `dist/` folder and copies icon files.

### Local Development with n8n
```bash
npm run dev
```
Builds the node and starts n8n on http://localhost:5678 with the node loaded.

### Linting
```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

### Code Formatting
```bash
npm run format      # Format with Prettier
```

## Architecture

### n8n Node Structure

**Credentials** (`credentials/Microsoft365CopilotOAuth2Api.credentials.ts`):
- Extends n8n's built-in `oAuth2Api` credential type
- Configures Microsoft Entra ID OAuth2 endpoints
- Requires tenant ID from user
- Automatically requests all required Microsoft Graph API scopes

**Node** (`nodes/Microsoft365Copilot/Microsoft365Copilot.node.ts`):
- Implements `INodeType` interface from n8n-workflow
- Two resources: Conversation and Chat
- Operations:
  - Conversation > Create: Creates new Copilot conversation
  - Chat > Send Message: Sends message to existing conversation
- Uses `httpRequestWithAuthentication` helper for authenticated API calls
- Supports optional parameters: timezone, additional context, web search toggle

### API Integration

- **Base URL**: `https://graph.microsoft.com/beta/copilot/`
- **Endpoints**:
  - `POST /conversations` - Create conversation
  - `POST /conversations/{id}/chat` - Send message
- **Authentication**: OAuth 2.0 bearer token (managed by n8n)
- **Required Scopes**: Sites.Read.All, Mail.Read, People.Read.All, OnlineMeetingTranscript.Read.All, Chat.Read, ChannelMessage.Read.All, ExternalItem.Read.All

## Important Notes

### API Limitations
- Uses **beta** Microsoft Graph API endpoints (subject to change)
- Requires Microsoft 365 Copilot licenses for users
- Only supports delegated permissions (user context)
- Returns text responses only (no actions like email sending or file creation)

### n8n Community Node Requirements
- Package name must start with `n8n-nodes-`
- Must include `n8n-community-node-package` in package.json keywords
- Must define `n8n` configuration in package.json with nodes and credentials paths
- Node class name must match filename (e.g., `Microsoft365Copilot.node.ts` exports `Microsoft365Copilot` class)

### TypeScript Configuration
- Target: ES2022
- Module: CommonJS (required for n8n)
- Strict mode enabled
- Output to `dist/` directory

## Testing

To test the node:
1. Run `npm run dev`
2. Access n8n at http://localhost:5678
3. Create Microsoft 365 Copilot OAuth2 credentials (requires Azure app registration)
4. Add the Microsoft 365 Copilot node to a workflow
5. Test both operations: Create Conversation and Send Message

## Future Enhancements

- **MCP Protocol Support**: Not currently available in Microsoft 365 Copilot API, but could be added if Microsoft enables it
- **Streaming Responses**: API supports streaming but not implemented in this version
- **Additional Operations**: Could add conversation management (list, delete, etc.) if API adds these endpoints
- **Error Handling**: Could add more granular error messages for specific API error codes

## Contributing

This project follows Microsoft's open source contribution guidelines. Contributors must sign a CLA (Contributor License Agreement). See README.md for details.
