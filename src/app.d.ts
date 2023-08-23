/// <reference types="@sveltejs/kit" />

import type { AuthRequest, Session as LuciaSession } from 'lucia';
import type { User, Session } from '$lib/server/drizzle';
import type { Auth as LuciaAuth, User as LuciaUser } from '$lib/server/lucia';

declare global {
	/**
	 * @see https://kit.svelte.dev/docs/types#app
	 */
	namespace App {
		interface Locals {
			auth: AuthRequest;
			session: LuciaSession | null;
			user: LuciaUser | null;
		}
		interface PageData {
			session: LuciaSession | null;
		}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type DatabaseUser = User;
		type Auth = LuciaAuth;
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		type DatabaseUserAttributes = Omit<User, 'id'>;

		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		type DatabaseSessionAttributes = Record<string | keyof Session, never>;
	}
}

export {};
