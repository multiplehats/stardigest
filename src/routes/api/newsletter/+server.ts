import { validateQstashSignature } from '$lib/server/upstash/qstash';
import { ZQstashNewsletterCbSchema } from '$lib/services/newsletter/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
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

	console.log('body', body);

	return new Response();
};
