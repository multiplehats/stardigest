import { decryptAccessToken } from '$lib/server/lucia/utils';
import { GithubService } from '$lib/services/github';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const accessToken = decryptAccessToken(
		'f0449e7dda419860f9755593a07319ce:f0b219b74fd3db994b6969d796cbbd471450c7521a0fc941fd5ec40ab7eaba0e348f385e6668728f'
	);

	const githubService = new GithubService(accessToken, 'user_rhlw4c0czhh0');

	const stars = await githubService.getUniqueRandomStars();

	return json(stars);
};
