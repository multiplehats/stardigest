import { validateQstashSignature } from '$lib/server/upstash/qstash';
import { ZQstashNewsletterCbSchema } from '$lib/services/newsletter/types';
import type { RequestHandler } from './$types';
import { NewsletterService } from '$lib/services/newsletter';

export const POST: RequestHandler = async ({ request, locals }) => {
	const isValid = await validateQstashSignature(request);

	if (!isValid) {
		console.error('Invalid signature');

		return new Response('Invalid signature', { status: 401 });
	}

	const body = await request.json();
	const data = ZQstashNewsletterCbSchema.safeParse(body);

	if (!data.success) {
		console.error('Invalid body', data.error);

		// return new Response('Missing or incorrect URL in body', { status: 400 });
		return new Response();
	}

	const { userId, email } = data.data;

	try {
		const newsletterService = new NewsletterService({ request, locals });

		await newsletterService.send({ userId, email });

		return new Response();
	} catch (error) {
		const e = error as { message: string } | undefined;

		return new Response(e?.message ?? 'Internal server error', { status: 200 });
	}
};
