import { ZGeneralSettingsFormSchema } from '$components/app/app-general-settings-form.svelte';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import type { WEEKDAY } from '$lib/types';
import { schema } from '$lib/server/drizzle';
import { UserService } from '$lib/services/users';
import { ErrorCode } from '$lib/utils/error-class';
import { NewsletterService } from '$lib/services/newsletter';

export const load = (async ({ request, locals }) => {
	const { user } = locals;
	const { email, emailNewsletter, day } = user || {};
	const newsletterService = new NewsletterService({ request, locals });
	const defaultEmail = email || emailNewsletter || undefined;
	const defaultDay = day ? (Number(day) as unknown as WEEKDAY) : undefined;
	const isSubscribed = await newsletterService.isSubscribed(user.id);

	return {
		form: await superValidate(
			{
				day: defaultDay,
				email: defaultEmail,
				enabled: isSubscribed
			},
			ZGeneralSettingsFormSchema
		)
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const { request, locals } = event;

		const form = await superValidate(request, ZGeneralSettingsFormSchema);

		if (!form.valid) {
			console.error('invalid form', form);

			return fail(400, { form });
		}

		const user = event.locals.user;

		if (!user) {
			return fail(401, { form });
		}

		const { email, day, enabled } = form.data;

		const userService = new UserService(user);

		try {
			await userService.updateUser({
				email,
				day: day ? day.toString() : undefined
			});

			const newsletterService = new NewsletterService(user.id);

			if (enabled) {
				console.log('subscribing', { email });
				await newsletterService.subscribe({
					userId: user.id,
					email,
					// TODO: Implement timezone
					timezone: user.timezone,
					day: day as WEEKDAY
				});
			} else {
				console.log('unsubscribing', { email });
				await newsletterService.unsubscribe(user.id);
			}
		} catch (error) {
			if (error instanceof ErrorCode) {
				return fail(error.status, { form });
			}

			return fail(500, { form });
		}

		return { form };
	}
} satisfies Actions;
