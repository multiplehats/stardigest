import { decryptAccessToken } from '$lib/server/lucia/utils';
import { GithubService } from '$lib/services/github';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { NewsletterService } from '$lib/services/newsletter/newsletter.service';

export const GET: RequestHandler = async ({ locals }) => {
	const newsletter = new NewsletterService(locals.user);

	await newsletter.subscribe('test');

	return new Response();
};
