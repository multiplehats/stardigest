import { auth, githubOAuth } from '$lib/server/lucia';
import type { RequestHandler } from './$types';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { STATE_COOKIE } from '$lib/auth/types';
import { getUserForOAuth } from '$lib/server/lucia/utils';

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
	const storedState = cookies.get(STATE_COOKIE.GITHUB_OAUTH_STATE);
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');

	if (error) {
		const error_description = url.searchParams.get('error_description');
		const error_uri = url.searchParams.get('error_uri');
		console.error('Github Oauth Error', error, error_description, error_uri);

		return new Response(null, {
			status: 400
		});
	}

	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		console.error('Invalid state or code');
		return new Response(null, {
			status: 400
		});
	}

	try {
		const { existingUser, githubUser, createUser, githubTokens } =
			await githubOAuth.validateCallback(code);

		const user = await getUserForOAuth({
			createUser,
			existingUser,
			name: githubUser.name,
			email: githubUser.email as string,
			emailVerified: new Date(),
			github_username: githubUser.login,
			github_tokens: githubTokens
		});

		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});

		locals.auth.setSession(session);

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (e) {
		if (e instanceof OAuthRequestError) {
			// invalid code
			console.error(`[${e.response.status}]: Github callback error`);

			return new Response(null, {
				status: 400
			});
		}

		console.error('Github callback error', e);

		return new Response(null, {
			status: 500
		});
	}
};
