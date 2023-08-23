import { ZGeneralSettingsFormSchema } from '$components/app/app-general-settings-form.svelte';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { db } from '$lib/server/drizzle/db';
import type { WEEKDAY } from '$lib/types';
import { schema } from '$lib/server/drizzle';
import { eq } from 'drizzle-orm';
import { UserService } from '$lib/services/users';
import { ErrorCode } from '$lib/utils/error-class';

export const load = (async ({ locals }) => {
	const { user } = locals;
	const { email, emailNewsletter, day } = user || {};

	const defaultEmail = email || emailNewsletter || undefined;
	const defaultDay = day ? (Number(day) as unknown as WEEKDAY) : undefined;

	return {
		form: await superValidate(
			{
				day: defaultDay,
				email: defaultEmail
			},
			ZGeneralSettingsFormSchema
		)
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const { request } = event;

		const form = await superValidate(request, ZGeneralSettingsFormSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { user } = event.locals;

		if (!user) {
			return fail(401, { form });
		}

		const { email, day } = form.data;

		const userService = new UserService(user);

		try {
			await userService.updateUser({
				email,
				day: day ? day.toString() : undefined
			});
		} catch (error) {
			if (error instanceof ErrorCode) {
				return fail(error.status, { form });
			}

			return fail(500, { form });
		}

		return { form };
	}
} satisfies Actions;
