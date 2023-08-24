import { db } from '$lib/server/drizzle/db';
import { validateQstashSignature } from '$lib/server/upstash/qstash';
import { ZQstashNewsletterCbSchema } from '$lib/services/newsletter/types';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { schema } from '$lib/server/drizzle';
import { GithubService, type UserStar } from '$lib/services/github';
import { decryptAccessToken } from '$lib/server/lucia/utils';
import { renderAsync } from '@react-email/components';
// @ts-expect-error - jsx is not set in sveltekit apps
import Email from '../../../../emails/index.tsx';
import React from 'react';
import { sendgrid } from '$lib/server/sendgrid';

export const POST: RequestHandler = async ({ request }) => {
	const isValid = await validateQstashSignature(request);

	if (!isValid) {
		console.error('Invalid signature');

		return new Response('Invalid signature', { status: 401 });
	}

	const body = await request.json();
	const data = ZQstashNewsletterCbSchema.safeParse(body);

	if (!data.success) {
		console.error('Invalid body', data.error);

		// return new Response('Missing or incorrect URL in body', { status: 400 });
		return new Response();
	}

	const user = await db.query.users.findFirst({
		where: eq(schema.users.id, data.data.userId)
	});

	if (!user) {
		console.error('User not found');

		return new Response('User not found', { status: 404 });
	}

	if (!user.github_access_token) {
		console.error('User has no github access token');

		return new Response('User has no github access token', { status: 404 });
	}

	const accessToken = decryptAccessToken(user.github_access_token);
	const githubService = new GithubService(accessToken, user.id);
	const stars = await githubService.getUniqueRandomStars();

	if (!stars || stars.length === 0) {
		console.error('User has no stars');

		return new Response('User has no stars', { status: 404 });
	}

	const html = await renderAsync(
		React.createElement(Email, {
			username: user.github_username ?? user.name ?? 'you',
			starredRepos: stars
		} satisfies {
			username: string;
			starredRepos: UserStar[];
		})
	);

	await sendgrid.sendMail({
		to: user.email,
		subject: 'Your daily dose of stars',
		html: html,
		text: 'Your daily dose of stars'
	});

	return new Response();
};
