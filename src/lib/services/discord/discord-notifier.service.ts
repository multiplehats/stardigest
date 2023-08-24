import { WebhookClient } from 'discord.js';

export class DiscordNotifierService {
	private webhookId: string;
	private webhookToken: string;
	private name: string;
	private iconUrl: string | null;

	constructor({
		name,
		iconUrl,
		webhookId,
		webhookToken
	}: {
		name: string;
		iconUrl: string | null;
		webhookId: string;
		webhookToken: string;
	}) {
		this.name = name;
		this.iconUrl = iconUrl;
		this.webhookId = webhookId;
		this.webhookToken = webhookToken;
	}

	public codeblock(language: 'bash' | 'css' | 'json' | 'md' | '', code: string): string {
		return `\`\`\`${language}\n${code}\`\`\``;
	}

	public markdownLink({ url, text }: { url: string; text: string }): string {
		return `[${text}](${url})`;
	}

	public async send(
		title: string,
		{
			description,
			url,
			fields = [],
			type,
			error
		}: {
			description?: string;
			url?: string;
			type: 'success' | 'error' | 'info';
			fields?: {
				/**
				 * Name of the field
				 *
				 * Length limit: 256 characters
				 */
				name: string;
				/**
				 * Value of the field
				 *
				 * Length limit: 1024 characters
				 */
				value: string;
				/**
				 * Whether or not this field should display inline
				 */
				inline?: boolean;
			}[];
			error?: object | object[] | string | Error;
		}
	) {
		const webhook = new WebhookClient({
			id: this.webhookId,
			token: this.webhookToken
		});

		const color = type === 'success' ? 5763719 : type === 'error' ? 15548997 : 3447003;
		const timestamp = new Date().toISOString();
		const titlePrefix = type === 'error' ? '🚨' : type === 'success' ? '🔥' : 'ℹ️';

		if (error) {
			description =
				description +
				'\n\n **Server logs**' +
				this.codeblock('json', JSON.stringify(error, null, 2));
		}

		return await webhook.send({
			username: this.name,
			avatarURL: this.iconUrl ?? undefined,
			embeds: [
				{
					timestamp,
					color,
					title: `${titlePrefix} ${title}`,
					url,
					description,
					fields: fields.length > 0 ? [...fields] : []
					// footer: {
					// 	text: 'HEATE: Serverless',
					// 	icon_url: img
					// }
				}
			]
		});
	}
}
