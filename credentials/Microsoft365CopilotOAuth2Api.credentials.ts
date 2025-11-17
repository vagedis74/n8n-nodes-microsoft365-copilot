import type { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';

export class Microsoft365CopilotOAuth2Api implements ICredentialType {
	name = 'microsoft365CopilotOAuth2Api';
	extends = ['oAuth2Api'];
	displayName = 'Microsoft 365 Copilot OAuth2 API';
	documentationUrl = 'https://learn.microsoft.com/en-us/graph/api/resources/copilot-api-overview';
	icon: Icon = 'file:microsoft365copilot.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'Tenant ID',
			name: 'tenantId',
			type: 'string',
			default: '',
			required: true,
			description:
				'Your Microsoft Entra ID (Azure AD) tenant ID. Find this in Azure Portal > Microsoft Entra ID > Overview.',
			placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
		},
		{
			displayName: 'OAuth Redirect URL',
			name: 'oauthTokenUrl',
			type: 'string',
			default: '',
			description:
				'The OAuth callback URL to use. Leave empty to use the default n8n OAuth callback URL. Only change this if you are using a custom domain or reverse proxy.',
			placeholder: 'https://your-n8n-instance.com/rest/oauth2-credential/callback',
		},
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: '=https://login.microsoftonline.com/{{$self["tenantId"]}}/oauth2/v2.0/authorize',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: '=https://login.microsoftonline.com/{{$self["tenantId"]}}/oauth2/v2.0/token',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default:
				'https://graph.microsoft.com/Sites.Read.All https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/People.Read.All https://graph.microsoft.com/OnlineMeetingTranscript.Read.All https://graph.microsoft.com/Chat.Read https://graph.microsoft.com/ChannelMessage.Read.All https://graph.microsoft.com/ExternalItem.Read.All offline_access',
			description:
				'All required permissions for Microsoft 365 Copilot API (Sites.Read.All, Mail.Read, People.Read.All, OnlineMeetingTranscript.Read.All, Chat.Read, ChannelMessage.Read.All, ExternalItem.Read.All)',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];
}
