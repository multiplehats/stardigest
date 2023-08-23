import type { GithubOAuthTokens } from '$lib/auth/types';
import { newId } from '$lib/utils/id';
import { Policy, type GRID } from '$lib/auth/policies';
import type { User } from '$lib/server/drizzle';
import type { LuciaDatabaseUserAttributes, LuciaUser } from '@lucia-auth/oauth/dist/lucia';
import { auth } from '$lib/server/lucia';

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
		policy: defaultUserPolicy(userId)
	} satisfies Omit<User, 'id' | 'email'>);

export const getUserForOAuth = async ({
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
	console.log('github tokens', github_tokens);

	if (existingUser) {
		// If no policy exists, create one.

		// @ts-expect-error - TODO: Fix this type in the global namespace
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
			github_access_token: github_tokens.accessToken,
			github_token_expires_at: github_tokens?.accessTokenExpiresIn
				? new Date(Date.now() + github_tokens.accessTokenExpiresIn * 1000)
				: null,
			github_token_updated_at: new Date(),
			// @ts-expect-error - github_refresh_token is not in the type
			github_refresh_token: github_tokens.refreshToken
		}
	});

	return user;
};
