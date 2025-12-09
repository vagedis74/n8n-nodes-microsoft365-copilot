# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

n8n community node for Microsoft 365 Copilot chat functionality. Allows n8n workflows to interact with Microsoft 365 Copilot using the Microsoft Graph API (beta endpoints).

## Commands

```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript to dist/ and copy icons
npm run dev          # Build and start n8n at http://localhost:5678
npm run lint         # Check for linting issues
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format with Prettier
```

**Windows Note**: The `copy-icons` script uses Unix commands (`mkdir -p`, `cp`). On Windows, run in Git Bash or WSL, or manually copy `icons/` to `dist/icons/`.

## Architecture

### Credentials (`credentials/Microsoft365CopilotOAuth2Api.credentials.ts`)
- Extends n8n's `oAuth2Api` credential type
- Configures Microsoft Entra ID OAuth2 endpoints using tenant ID
- Required Graph API scopes: Sites.Read.All, Mail.Read, People.Read.All, OnlineMeetingTranscript.Read.All, Chat.Read, ChannelMessage.Read.All, ExternalItem.Read.All

### Node (`nodes/Microsoft365Copilot/Microsoft365Copilot.node.ts`)
- Implements `INodeType` interface from n8n-workflow
- Resources and operations:
  - **Conversation > Create**: `POST /beta/copilot/conversations` - Creates new conversation, returns ID
  - **Chat > Send Message**: `POST /beta/copilot/conversations/{id}/chat` - Sends message to conversation
- Uses `httpRequestWithAuthentication` helper for API calls
- Optional parameters: timezone, additional context, web search toggle

## n8n Community Node Requirements

- Package name must start with `n8n-nodes-`
- Must include `n8n-community-node-package` in package.json keywords
- `n8n` config in package.json must reference compiled JS paths in `dist/`
- Node class name must match filename (e.g., `Microsoft365Copilot.node.ts` exports `Microsoft365Copilot`)
- TypeScript compiles to CommonJS (required by n8n)

## API Constraints

- Uses **beta** Microsoft Graph API (subject to change without notice)
- Requires Microsoft 365 Copilot license per user
- Delegated permissions only (operates in user context)
- Returns text responses only (cannot perform actions like sending email)
