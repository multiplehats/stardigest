import type { Client as QStashClient } from '@upstash/qstash';
import type { Redis } from '@upstash/redis';
import { redis } from '$lib/server/upstash';
import { qstash } from '$lib/server/upstash/qstash';
import { APP_URL } from '$lib/config/constants';
import { API_PATH } from '$lib/config/routes';
import type { TIMEZONE, WEEKDAY } from '$lib/types';
import type { ZQstashNewsletterCallback } from './types';
import { ZonedDateTime, ZoneId } from '@js-joda/core';
import '@js-joda/timezone';

export class NewsletterService {
	private qstash: QStashClient;
	private redis: Redis;
	private userId: string;
	private callback: string;

	constructor(userId: string) {
		this.qstash = qstash;
		this.redis = redis;
		this.userId = userId;
		this.callback = `${APP_URL}${API_PATH}/newsletter`;
	}

	/**
	 * The schedule ID from Qstash is stored in Redis.
	 */
	private key() {
		return `newsletter:${this.userId}`;
	}

	private async setKey(userId: string, messageId: string) {
		return await this.redis.set(this.key(), messageId);
	}

	private async hasKey() {
		const exists = await this.redis.exists(this.key());

		return exists === 1;
	}

	private async deleteKey() {
		return await this.redis.del(this.key());
	}

	private async getKey() {
		return await this.redis.get<string>(this.key());
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

	public async isSubscribed() {
		return await this.hasKey();
	}

	public async unsubscribe() {
		const messageId = await this.getKey();

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
				await this.deleteKey();

				return;
			}

			console.error('Failed to delete QStash message', e);

			throw e;
		}

		await this.deleteKey();
	}

	public async subscribe({
		email,
		timezone,
		day
	}: {
		email: string;
		timezone: TIMEZONE;
		day: WEEKDAY;
	}) {
		const cron = await this.getSchedule(timezone, day);

		try {
			const { scheduleId } = await this.qstash.publishJSON({
				url: this.callback,
				cron: cron,
				body: {
					email: email,
					userId: this.userId
				} satisfies ZQstashNewsletterCallback
			});

			await this.setKey(this.userId, scheduleId);
		} catch (error) {
			console.error('Failed to schedule QStash job', error);
		}
	}
}
