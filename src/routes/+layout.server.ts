import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	return {
		session: locals.session
	};
}) satisfies LayoutServerLoad;
