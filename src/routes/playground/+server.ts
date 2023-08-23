import { decryptAccessToken } from '$lib/server/lucia/utils';
import { GithubService } from '$lib/services/github';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const githubService = new GithubService('', 'user_rhlw4c0czhh0');

	const stars = await githubService.getUniqueRandomStars();

	return json(stars);
};
