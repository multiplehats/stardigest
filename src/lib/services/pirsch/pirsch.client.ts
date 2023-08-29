import { browser } from '$app/environment';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import type { PirschEventClient, PirschHitClient } from './types';

const APP_EVENTS = {
	Click: 'Click',
	Submit: 'Submit',
	Open: 'Open',
	View: 'View',
	VirtualPageView: 'VirtualPageView',
	Close: 'Close',
	Copy: 'Copy',
	Scroll: 'Scroll',
	Toggle: 'Toggle',
	Load: 'Load',
	Change: 'Change',
	Select: 'Select',
	Filter: 'Filter',
	Search: 'Search',
	Resize: 'Resize'
} as const;

const pageHitPath = '/api/footprint';
const pageEventPath = '/api/footprint/event';

export const createPirschPageView = () => {
	if (!browser) return;

	page.subscribe((page) => {
		if (!page || Object.keys(page).length === 0) return;

		const payload = {
			url: page.url.href,
			referrer: document.referrer,
			screen_width: window.screen.width,
			screen_height: window.screen.height,
			title: document.title,
			routeId: page.route.id
		} satisfies PirschHitClient;

		fetch(pageHitPath, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});
	});
};

export const trackPirschEvent = async (
	appEvent: (typeof APP_EVENTS)[keyof typeof APP_EVENTS],
	name: PirschEventClient['name'],
	appSection: string,
	meta?: PirschEventClient['meta'],
	duration?: PirschEventClient['duration']
) => {
	if (!browser) return;

	const $page = get(page);

	const payload = {
		url: $page.url.href,
		referrer: document.referrer,
		screen_width: window.screen.width,
		screen_height: window.screen.height,
		title: document.title,
		routeId: $page.route.id,
		name: `${appSection}: ${appEvent} - ${name}`,
		meta,
		duration
	} satisfies PirschEventClient;

	fetch(pageEventPath, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});
};
