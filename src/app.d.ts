/// <reference types="@sveltejs/kit" />

import type { AuthRequest } from 'lucia';
import type { User, Session } from '$lib/server/drizzle';
import type { Auth as LuciaAuth } from '$lib/server/lucia';

declare global {
	/**
	 * @see https://kit.svelte.dev/docs/types#app
	 */
	namespace App {
		interface Locals {
			auth: AuthRequest;
			session: Session | null;
		}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = LuciaAuth;
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		// type DatabaseUserAttributes = {
		// 	github_username: string;
		// };
		type DatabaseUserAttributes = Omit<User, 'id'>;

		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		type DatabaseSessionAttributes = Record<string | keyof Session, never>;
		// type DatabaseSessionAttributes = {};
	}
}

export {};
