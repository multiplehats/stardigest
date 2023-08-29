import type { RequestHandler } from './$types';
// @ts-expect-error - jsx is not set in sveltekit apps
import Email from '../../../../emails/index.tsx';
import React from 'react';
import { renderAsync } from '@react-email/components';

export const GET: RequestHandler = async () => {
	const emailHtml = await renderAsync(React.createElement(Email));

	return new Response(emailHtml, {
		headers: {
			'content-type': 'text/html'
		}
	});
};
