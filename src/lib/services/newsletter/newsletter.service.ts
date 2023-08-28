import type { Client as QStashClient } from '@upstash/qstash';
import type { Redis } from '@upstash/redis';
import { redis } from '$lib/server/upstash';
import { qstash } from '$lib/server/upstash/qstash';
import { APP_URL } from '$lib/config/constants';
import { API_PATH } from '$lib/config/routes';
import type { TIMEZONE, WEEKDAY } from '$lib/types';
import type { ZQstashNewsletterCallback } from './types';
import { ZonedDateTime, ZoneId } from '@js-joda/core';
import { AppService } from '$lib/services/app/app.service';
import { EmailService } from '$lib/services/email/email.service';
import { decryptAccessToken } from '$lib/server/lucia/utils';
import { db } from '$lib/server/drizzle/db';
import { eq } from 'drizzle-orm';
import { schema } from '$lib/server/drizzle';
import { GithubService } from '../github';
import '@js-joda/timezone';

export class NewsletterService extends AppService {
	private qstash: QStashClient;
	private redis: Redis;
	private callbackUrl: string;
	private email: EmailService;

	constructor({ request, locals }: { request: Request; locals: App.Locals }) {
		super(request, locals);
		this.email = new EmailService({ request, locals });
		this.qstash = qstash;
		this.redis = redis;
		this.callbackUrl = `${APP_URL}${API_PATH}/newsletter`;
	}

	/**
	 * The schedule ID from Qstash is stored in Redis.
	 */
	private key(userId: string) {
		return `newsletter:${userId}`;
	}

	private async setKey(userId: string, messageId: string) {
		return await this.redis.set(this.key(userId), messageId);
	}

	private async hasKey(userId: string) {
		const exists = await this.redis.exists(this.key(userId));

		return exists === 1;
	}

	private async deleteKey(userId: string) {
		return await this.redis.del(this.key(userId));
	}

	private async getKey(userId: string) {
		return await this.redis.get<string>(this.key(userId));
	}

	private async getSchedule(timezone: TIMEZONE, day: WEEKDAY) {
		const now = ZonedDateTime.now(ZoneId.of(timezone));
		const sendHour = now.hour();

		// Convert the hour to UTC
		const utcTime = ZonedDateTime.now(ZoneId.of('UTC'));
		const utcHour = (sendHour + utcTime.offset().totalSeconds() / 3600) % 24;

		// The cron will appear as 'minute hour * * day'
		const cron = `0 ${utcHour} * * ${day}`;

		return cron;
	}

	public async isSubscribed(userId: string) {
		return await this.hasKey(userId);
	}

	public async unsubscribe(userId: string) {
		const messageId = await this.getKey(userId);

		if (!messageId) {
			return;
		}

		try {
			await this.qstash.schedules.delete({ id: messageId });
		} catch (e) {
			const err = e as { error: string };

			if (err.error.endsWith('not found')) {
				// The message was already deleted
				console.log('Message not found');
				await this.deleteKey(userId);

				return;
			}

			console.error('Failed to delete QStash message', e);

			throw e;
		}

		await this.deleteKey(userId);
	}

	public async subscribe({
		userId,
		email,
		timezone,
		day
	}: {
		userId: string;
		email: string;
		timezone: TIMEZONE;
		day: WEEKDAY;
	}) {
		const cron = await this.getSchedule(timezone, day);

		try {
			const { scheduleId } = await this.qstash.publishJSON({
				url: this.callbackUrl,
				cron: cron,
				body: {
					email: email,
					userId: userId
				} satisfies ZQstashNewsletterCallback
			});

			await this.setKey(userId, scheduleId);
		} catch (error) {
			console.error('Failed to schedule QStash job', error);
		}
	}

	public async send({ userId, email }: ZQstashNewsletterCallback) {
		const user = await db.query.users.findFirst({
			where: eq(schema.users.id, userId)
		});

		if (!user) {
			console.error('User not found');

			return new Response('User not found', { status: 200 });
		}

		if (!user.github_access_token) {
			console.error('User has no github access token');

			return new Response('User has no github access token', { status: 200 });
		}

		const accessToken = decryptAccessToken(user.github_access_token);
		const githubService = new GithubService(accessToken, user.id);
		const starredRepos = await githubService.getUniqueRandomStars();
		const username = user.github_username ?? user.name ?? 'you';

		if (!starredRepos || starredRepos.length === 0) {
			this.log('User has no starred repos');

			return new Response('User has no starred repos', { status: 200 });
		}

		return await this.email.sendNewsletter({ email, username, starredRepos });
	}
}
