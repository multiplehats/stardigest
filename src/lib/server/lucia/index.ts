import { lucia } from 'lucia';
import { dev } from '$app/environment';
import { sveltekit } from 'lucia/middleware';
import { planetscale } from '@lucia-auth/adapter-mysql';
import { ps } from '$lib/server/planetscale';
import { github } from '@lucia-auth/oauth/providers';
import { createClientRedirectUri } from '$lib/auth/utils';
import { PROVIDER_ID } from '$lib/auth/types';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { defaultUserPolicy } from './utils';

export const auth = lucia({
	adapter: planetscale(ps, {
		user: 'users',
		key: 'keys',
		session: 'sessions'
	}),
	middleware: sveltekit(),
	env: dev ? 'DEV' : 'PROD',
	getUserAttributes: (data) => {
		return {
			id: data.id,
			policy: data?.policy ?? defaultUserPolicy(data.id),
			timezone: data.timezone,
			day: data.day,
			emailNewsletter: data.emailNewsletter,
			githubUsername: data.github_username,
			userId: data.id,
			name: data.name,
			email: data.email
		};
	}
});

export const githubOAuth = github(auth, {
	clientId: GITHUB_CLIENT_ID,
	clientSecret: GITHUB_CLIENT_SECRET,
	redirectUri: createClientRedirectUri(PROVIDER_ID.GITHUB),
	scope: ['user:email']
});

export type Auth = typeof auth;
