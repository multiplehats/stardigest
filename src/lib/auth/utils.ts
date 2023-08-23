import { APP_URL } from '$lib/config/constants';
import { PROVIDER_ID, type ProviderItem } from './types';
import { Icons } from '$components/icons';
import { AUTH_PATH } from '$lib/config/routes';

export const providers = Object.values(PROVIDER_ID).map((provider) => {
	switch (provider) {
		case PROVIDER_ID.GITHUB:
			return {
				id: provider,
				icon: Icons.github,
				label: 'Continue with Github'
			};
	}
}) satisfies ProviderItem[];

export const createAuthUrl = (provider: PROVIDER_ID) => {
	if (!providers.find((p) => p.id === provider)) {
		throw new Error(`Provider ${provider} does not exist.`);
	}

	const url = new URL(`${APP_URL}${AUTH_PATH}/oauth/${provider}`);

	return url.toString();
};

/**
 * See this as the "real" redirect uri.
 * This is the route on the server where the session is created.
 * This is mostly called from the client.
 */
export const createServerRedirectUri = (provider: PROVIDER_ID, params?: URLSearchParams) => {
	const path = `${APP_URL}${AUTH_PATH}/oauth/${provider}/callback`;

	if (params) {
		return `${path}?${params.toString()}`;
	}

	return path;
};

/**
 * See this ias a "fake" redirect uri.
 * This redirects the provider to a route on the client.
 * This route catches the params then sends a message to the parent window.
 * The parent window then redirects to the server callback route.
 */
export const createClientRedirectUri = (provider: PROVIDER_ID, params?: URLSearchParams) => {
	const url = new URL(`${APP_URL}${AUTH_PATH}/oauth/${provider}/client-callback`);

	if (params) url.search = params.toString();
	return url.toString();
};
