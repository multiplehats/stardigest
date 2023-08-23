import { schema } from '$lib/server/drizzle';
import { db } from '$lib/server/drizzle/db';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

async function getUser(userId: string) {
	const user = await db.query.users.findFirst({
		where: eq(schema.users.id, userId),
		with: {
			newsletter: true
		}
	});

	return user;
}

export const load = (async ({ locals }) => {
	return {
		user: locals?.session ? await getUser(locals.session.user.userId) : null
	};
}) satisfies LayoutServerLoad;
