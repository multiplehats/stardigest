import type { RequestHandler } from './$types';
import { dev } from '$app/environment';
import { STATE_COOKIE } from '$lib/auth/types';
import { githubOAuth } from '$lib/server/lucia';

export const GET: RequestHandler = async ({ cookies }) => {
	const [url, state] = await githubOAuth.getAuthorizationUrl();

	cookies.set(STATE_COOKIE.GITHUB_OAUTH_STATE, state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
};
