import type { GithubOAuthTokens } from '$lib/auth/types';
import { newId } from '$lib/utils/id';
import { Policy, type GRID } from '$lib/auth/policies';
import type { User } from '$lib/server/drizzle';
import type { LuciaDatabaseUserAttributes, LuciaUser } from '@lucia-auth/oauth/dist/lucia';
import { auth } from '$lib/server/lucia';
import { ACCESS_TOKEN_SECRET } from '$env/static/private';
import * as crypto from 'crypto';
import { TIMEZONE, WEEKDAY } from '$lib/types';
import { discordNotify } from '../discord';

export const encryptAccessToken = (token: string): string => {
	const ENCRYPTION_KEY = Buffer.from(ACCESS_TOKEN_SECRET, 'hex'); // use Buffer to convert hex string to Uint8Array
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv('aes-256-ctr', ENCRYPTION_KEY, iv);
	const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);

	return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decryptAccessToken = (encryptedToken: string): string => {
	const encryptedArray = encryptedToken.split(':');
	const iv = Buffer.from(encryptedArray[0], 'hex');
	const encrypted = encryptedArray[1];

	const decipher = crypto.createDecipheriv(
		'aes-256-ctr',
		Buffer.from(ACCESS_TOKEN_SECRET, 'hex'),
		iv
	);
	let decrypted = decipher.update(encrypted, 'hex', 'utf8');
	decrypted += decipher.final('utf8');

	return decrypted;
};

/**
 * Generate a default policy for the user.
 */
export const defaultUserPolicy = (userId: string) =>
	new Policy({
		resources: {
			user: {
				// User can only CRUD their own user
				[`${userId}::user::${userId}` satisfies GRID]: ['create', 'read', 'update', 'delete']
			}
		}
	}).toString();

/**
 * Sets the default attributes for a user. As this is not supported by PlanetScale yet.
 */
export const defaultUserCreateAttributes = (userId: string) =>
	({
		name: null,
		emailVerified: null,
		github_username: null,
		updatedAt: new Date(),
		createdAt: new Date(),
		github_access_token: null,
		github_refresh_token: null,
		github_token_expires_at: null,
		github_token_updated_at: null,
		policy: defaultUserPolicy(userId),
		day: WEEKDAY.FRIDAY.toString(),
		timezone: TIMEZONE['America/New_York'],
		emailNewsletter: null
	} satisfies Omit<User, 'id' | 'email'>);

export const maybeCreateUser = async ({
	existingUser,
	createUser,
	name,
	email,
	emailVerified,
	github_username,
	github_tokens
}: {
	existingUser: LuciaUser<typeof auth> | null;
	createUser: (options: {
		userId?: string;
		attributes: LuciaDatabaseUserAttributes<typeof auth>;
	}) => Promise<LuciaUser<typeof auth>>;
	name: string | null;
	email: string;
	emailVerified: Date | null;
	github_username: string;
	github_tokens: GithubOAuthTokens;
}) => {
	if (existingUser) {
		if (!existingUser?.policy) {
			const policy = defaultUserPolicy(existingUser.userId);

			await auth.updateUserAttributes(existingUser.userId, {
				policy
			});
		}

		return existingUser;
	}

	const newUserId = newId('user');

	const user = await createUser({
		userId: newUserId,
		attributes: {
			...defaultUserCreateAttributes(newUserId),
			name: name,
			email: email,
			emailVerified: emailVerified,
			emailNewsletter: email,
			github_username: github_username,
			github_access_token: encryptAccessToken(github_tokens.accessToken),
			github_token_expires_at: github_tokens?.accessTokenExpiresIn
				? new Date(Date.now() + github_tokens.accessTokenExpiresIn * 1000)
				: null,
			github_token_updated_at: new Date(),
			// @ts-expect-error - github_refresh_token is not in the type
			github_refresh_token: github_tokens.refreshToken
		}
	});

	await discordNotify
		.send('New user', {
			description: `A new user has signed up: ${user.name} [${user.id}]`,
			type: 'success',
			fields: [
				{
					name: 'User: ID',
					value: user.id,
					inline: true
				},
				{
					name: 'Github',
					value: `${user.githubUsername ?? 'N/A'}`,
					inline: true
				},
				{
					name: '↴',
					value: discordNotify.markdownLink({
						url: `https://github.com/${user.githubUsername}`,
						text: 'View Github profile'
					}),
					inline: true
				}
			]
		})
		.catch((error) => {
			console.error('Failed to send Discord notification', error);
		});

	return user;
};
