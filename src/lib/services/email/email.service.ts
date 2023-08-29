import { APP_NAME, SENDGRID_SENDER } from '$lib/config/constants';
import { Client } from '@sendgrid/client';
import type { ClientRequest } from '@sendgrid/client/src/request';
import type { ResponseError } from '@sendgrid/helpers/classes';
import { AppService } from '$lib/services/app/app.service';
import { SENDGRID_API_KEY } from '$env/static/private';
import { dev } from '$app/environment';
import { renderAsync } from '@react-email/components/dist/index';
import React from 'react';

// @ts-expect-error - jsx is not set in sveltekit apps
import Email from '../../../../emails/index.tsx';
import type { UserStar } from '../github/types.js';

export class EmailServiceError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'EmailServiceError';
	}
}

export class EmailService extends AppService {
	private clientService: Client;
	private apiKey: string;
	private defaultFrom: string;
	private defaultSender: string;
	private debug: boolean;

	constructor({ request, locals }: { request: Request; locals: App.Locals }) {
		super(request, locals);

		this.debug = dev;
		this.apiKey = SENDGRID_API_KEY;
		this.defaultFrom = APP_NAME;
		this.defaultSender = SENDGRID_SENDER;
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

	private async send({
		to,
		name,
		from,
		subject,
		html,
		plainText
	}: {
		to: string;
		name?: string;
		from?: string;
		subject: string;
		html: string;
		plainText?: string;
	}) {
		const request = this.createRequest('POST', '/v3/mail/send', {
			personalizations: [
				{
					to: [
						{
							name: name,
							email: to
						}
					],
					subject: subject
				}
			],
			from: {
				name: this.defaultFrom,
				email: from ?? this.defaultSender
			},
			content: [
				{
					type: 'text/plain',
					value: plainText
				},
				{
					type: 'text/html',
					value: html
				}
			]
		});

		try {
			if (this.debug) {
				return;
			}
			3;
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
			throw new EmailServiceError(err.message);
		}
	}

	public async sendNewsletter({
		email,
		username,
		starredRepos
	}: {
		email: string;
		username: string;
		starredRepos: UserStar[];
	}) {
		const props = {
			username,
			starredRepos
		} satisfies {
			username: string;
			starredRepos: UserStar[];
		};

		const [html, plainText] = await Promise.all([
			renderAsync(React.createElement(Email, props)),
			renderAsync(React.createElement(Email, props), { plainText: true })
		]);

		const mail = await this.send({
			to: email,
			subject: 'Your daily dose of stars',
			html: html,
			plainText
		});
	}
}
