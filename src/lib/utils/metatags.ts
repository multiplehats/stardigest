import { APP_HOST, APP_NAME, APP_URL } from '$lib/config/constants';
import type { MetaTagsProps } from 'svelte-meta-tags';

export const defaultMetaTags = ({
	title,
	fullTitle,
	slug,
	canonical,
	description,
	ogImage,
	twitterHandle = 'itschrisjayden',
	ogProps
}: {
	title: string;
	fullTitle?: string;
	slug?: string;
	canonical?: string;
	description: string;
	ogImage?: string;
	twitterHandle?: string | null;
	ogProps?: MetaTagsProps['openGraph'];
}) => {
	let _fullTitle: string;

	if (fullTitle) {
		_fullTitle = fullTitle;
	} else {
		_fullTitle = `${title} • ${APP_NAME}`;
	}

	return {
		title: _fullTitle,
		description,
		canonical: canonical ? canonical : slug ? `${APP_URL}/${slug}` : APP_URL,
		openGraph: {
			url: APP_HOST,
			title: fullTitle,
			description,
			images: [
				{
					url: ogImage ? ogImage : `${APP_URL}/og.png`,
					width: 1200,
					height: 630
				}
			],
			type: 'website',
			siteName: APP_NAME,
			...ogProps
		},
		...(twitterHandle && {
			twitter: {
				cardType: 'summary',
				site: twitterHandle,
				handle: twitterHandle
			}
		})
	} satisfies MetaTagsProps;
};
