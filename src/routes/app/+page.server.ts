import { ZGeneralSettingsFormSchema } from '$components/app/app-general-settings-form.svelte';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { db } from '$lib/server/drizzle/db';

export const load = (async ({ locals }) => {
	return {
		form: await superValidate(
			{
				email: undefined
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

		console.log(form.data);

		return { form };
	}
};
