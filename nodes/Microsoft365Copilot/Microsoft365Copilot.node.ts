import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class Microsoft365Copilot implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Microsoft 365 Copilot',
		name: 'microsoft365Copilot',
		icon: 'file:microsoft365copilot.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Microsoft 365 Copilot chat API',
		defaults: {
			name: 'Microsoft 365 Copilot',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'microsoft365CopilotOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Chat',
						value: 'chat',
					},
					{
						name: 'Conversation',
						value: 'conversation',
					},
				],
				default: 'chat',
			},
			// Conversation Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['conversation'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new Copilot conversation',
						action: 'Create a conversation',
					},
				],
				default: 'create',
			},
			// Chat Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['chat'],
					},
				},
				options: [
					{
						name: 'Send Message',
						value: 'sendMessage',
						description: 'Send a message to Copilot and get a response',
						action: 'Send a message',
					},
				],
				default: 'sendMessage',
			},
			// Fields for Send Message
			{
				displayName: 'Conversation ID',
				name: 'conversationId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['sendMessage'],
					},
				},
				default: '',
				description:
					'The ID of the conversation to send the message to. Create a conversation first or use an existing conversation ID.',
				placeholder: '0d110e7e-2b7e-4270-a899-fd2af6fde333',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['sendMessage'],
					},
				},
				default: '',
				description: 'The message to send to Microsoft 365 Copilot',
				placeholder: 'What meetings do I have tomorrow?',
				typeOptions: {
					rows: 4,
				},
			},
			// Additional Options
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['sendMessage'],
					},
				},
				options: [
					{
						displayName: 'Timezone',
						name: 'timezone',
						type: 'string',
						default: 'UTC',
						description: 'The timezone for location context (e.g., America/New_York, Europe/London)',
						placeholder: 'America/New_York',
					},
					{
						displayName: 'Additional Context',
						name: 'additionalContext',
						type: 'string',
						default: '',
						description:
							'Additional grounding context to provide to Copilot. This can help provide more specific or relevant responses.',
						typeOptions: {
							rows: 3,
						},
					},
					{
						displayName: 'Enable Web Search',
						name: 'enableWebSearch',
						type: 'boolean',
						default: true,
						description: 'Whether to enable web search context for this message',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'conversation') {
					if (operation === 'create') {
						// Create a new conversation
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'microsoft365CopilotOAuth2Api',
							{
								method: 'POST',
								url: 'https://graph.microsoft.com/beta/copilot/conversations',
								headers: {
									'Content-Type': 'application/json',
								},
								body: {},
								json: true,
							},
						);

						returnData.push({
							json: response as any,
							pairedItem: { item: i },
						});
					}
				} else if (resource === 'chat') {
					if (operation === 'sendMessage') {
						const conversationId = this.getNodeParameter('conversationId', i) as string;
						const message = this.getNodeParameter('message', i) as string;
						const additionalOptions = this.getNodeParameter(
							'additionalOptions',
							i,
							{},
						) as {
							timezone?: string;
							additionalContext?: string;
							enableWebSearch?: boolean;
						};

						if (!conversationId) {
							throw new NodeOperationError(
								this.getNode(),
								'Conversation ID is required. Create a conversation first.',
								{ itemIndex: i },
							);
						}

						if (!message) {
							throw new NodeOperationError(
								this.getNode(),
								'Message is required',
								{ itemIndex: i },
							);
						}

						// Build request body
						const requestBody: any = {
							message: {
								text: message,
							},
							locationHint: {
								timeZone: additionalOptions.timezone || 'UTC',
							},
						};

						// Add web search context if enabled (default true)
						const enableWebSearch =
							additionalOptions.enableWebSearch !== undefined
								? additionalOptions.enableWebSearch
								: true;
						if (enableWebSearch) {
							requestBody.contextualResources = {
								webContext: {
									isWebEnabled: true,
								},
							};
						}

						// Add additional context if provided
						if (additionalOptions.additionalContext) {
							requestBody.additionalContext = [
								{
									text: additionalOptions.additionalContext,
								},
							];
						}

						// Send the message
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'microsoft365CopilotOAuth2Api',
							{
								method: 'POST',
								url: `https://graph.microsoft.com/beta/copilot/conversations/${conversationId}/chat`,
								headers: {
									'Content-Type': 'application/json',
								},
								body: requestBody,
								json: true,
							},
						);

						returnData.push({
							json: response as any,
							pairedItem: { item: i },
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					returnData.push({
						json: {
							error: errorMessage,
							conversationId:
								resource === 'chat' ? this.getNodeParameter('conversationId', i) : undefined,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
