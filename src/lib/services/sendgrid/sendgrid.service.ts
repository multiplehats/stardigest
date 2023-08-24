import { APP_NAME, SENDGRID_SENDER } from '$lib/config/constants';
import { Client } from '@sendgrid/client';
import type { ClientRequest } from '@sendgrid/client/src/request';
import type { ResponseError } from '@sendgrid/helpers/classes';

class SendgridService {
	private clientService: Client;
	private apiKey: string;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
		this.clientService = new Client();
		this.clientService.setApiKey(this.apiKey);
	}

	private createRequest(method: ClientRequest['method'], url: string, body: object): ClientRequest {
		return {
			method: method,
			url: url,
			body: body
		} satisfies ClientRequest;
	}

	async addContact(email: string, name: string) {
		const request = this.createRequest('PUT', '/v3/marketing/contacts', {
			contacts: [
				{
					email: email,
					custom_fields: {}
				}
			]
		});

		try {
			const [response] = await this.clientService.request(request);
			const body = response.body as { job_id: string };

			let queued = false;

			if (response.statusCode === 202) {
				queued = true;
			}

			return {
				jobId: body.job_id,
				queued: queued
			};
		} catch (error) {
			const err = error as ResponseError;

			console.log(`Failed to add user: ${err.message}`);
		}
	}

	async sendMail({
		to,
		subject,
		text,
		html
	}: {
		to: string;
		subject: string;
		html: string;
		text?: string;
	}) {
		const request = this.createRequest('POST', '/v3/mail/send', {
			personalizations: [
				{
					to: [
						{
							email: to
						}
					],
					subject: subject
				}
			],
			from: {
				name: APP_NAME,
				email: SENDGRID_SENDER
			},
			content: [
				{
					type: 'text/plain',
					value: text
				},
				{
					type: 'text/html',
					value: html
				}
			]
		});

		try {
			const [response] = await this.clientService.request(request);
			const body = response.body as { job_id: string };
			let queued = false;

			if (response.statusCode === 202) {
				queued = true;
			}

			console.log(`Mail sent to ${to}`);

			return {
				jobId: body.job_id,
				queued: queued
			};
		} catch (error) {
			const err = error as ResponseError;

			console.log(`Failed to send mail: ${err.message}`);
		}
	}
}

export default SendgridService;
