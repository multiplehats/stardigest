import { ApiService } from '$lib/services/app/api.service';
import { PIRSCH_REFERRER_QUERY_PARAMETERS } from './constants';
import type {
	PirschEvent,
	PirschEventClient,
	PirschHit,
	PirschHitBuilder,
	PirschHitClient,
	PirschServiceConfig
} from './types';
import type * as Kit from '@sveltejs/kit';

export class PirschService extends ApiService {
	protected options: PirschServiceConfig = {};

	constructor(apiKey: string, opts?: PirschServiceConfig) {
		super(apiKey, 'https://api.pirsch.io/api/v1', 'PirschService');
		this.options = opts ?? {
			enabled: true,
			debug: false
		};
	}

	private getReferrer(request: Request, url: URL) {
		const referrer = request.headers.get('referer');

		if (referrer === '') {
			for (const parameterName of PIRSCH_REFERRER_QUERY_PARAMETERS) {
				const parameter = url.searchParams?.get(parameterName);

				if (parameter && parameter !== '') {
					return parameter;
				}
			}
		}

		return referrer;
	}

	private getHit(props: PirschHitBuilder) {
		const { request, url, ip, referrer, title, screen_width, screen_height } = props;
		const urlObj = new URL(url);
		const headers = request.headers;

		/**
		 * Remove parameters from the URL that we don't want to track.
		 */
		if (this.options.hit?.paramsToRemove) {
			this.options.hit.paramsToRemove.forEach((parameter) => {
				urlObj.searchParams.delete(parameter);
			});
		}

		const ref = referrer || this.getReferrer(request, urlObj);

		const payload = {
			url,
			ip: ip ?? '',
			referrer: ref ?? '',
			title,
			screen_width,
			screen_height,
			dnt: headers.get('dnt'),
			user_agent: headers.get('user-agent') ?? '',
			accept_language: headers.get('accept-language'),
			sec_ch_ua: headers.get('sec-ch-ua'),
			sec_ch_ua_mobile: headers.get('sec-ch-ua-mobile'),
			sec_ch_ua_platform: headers.get('sec-ch-ua-platform'),
			sec_ch_ua_platform_version: headers.get('sec-ch-ua-platform-version'),
			sec_ch_width: headers.get('sec-ch-width'),
			sec_ch_viewport_width: headers.get('sec-ch-viewport-width')
		} satisfies PirschHit;

		return payload;
	}

	/**
	 * Send a hit to Pirsch in a SvelteKit +server route.
	 */
	public async hit({ request, getClientAddress }: Kit.RequestEvent): Promise<Response> {
		const body: PirschHitClient = await request.json();
		const hit = this.getHit({
			request,
			url: body.url,
			ip: request.headers.get('x-forwarded-for') ?? getClientAddress(),
			referrer: body.referrer,
			title: body.title,
			screen_width: body.screen_width,
			screen_height: body.screen_height
		});

		try {
			const payload: PirschHit = hit;

			/**
			 * Remove all properties that are null or undefined.
			 */
			const filteredPayload = Object.fromEntries(
				Object.entries(payload).filter(([, value]) => value !== null && value !== undefined)
			);

			if (this.options?.debug) {
				this.log(filteredPayload);
			}

			if (this.options.enabled) {
				await this.sendRequest<void>('hit', 'POST', filteredPayload);
			}

			return new Response('oki doki');
		} catch (error) {
			this.log('Error:', error);
			return new Response('oki doki');
		}
	}

	public async event({ request, getClientAddress }: Kit.RequestEvent): Promise<Response> {
		const body: PirschEventClient = await request.json();
		const hit = this.getHit({
			request,
			url: body.url,
			ip: request.headers.get('x-forwarded-for') ?? getClientAddress(),
			referrer: body.referrer,
			title: body.title,
			screen_width: body.screen_width,
			screen_height: body.screen_height
		});

		try {
			const payload: PirschEvent = {
				...hit,
				event_name: body.name,
				event_duration: body.duration,
				event_meta: body.meta
			};

			/**
			 * Remove all properties that are null or undefined.
			 */
			const filteredPayload = Object.fromEntries(
				Object.entries(payload).filter(([, value]) => value !== null && value !== undefined)
			);

			if (this.options?.debug) {
				this.log('PirschService.event', filteredPayload);
			}

			if (this.options.enabled) {
				await this.sendRequest<void>('event', 'POST', filteredPayload);
			}

			return new Response('oki doki');
		} catch (error) {
			this.log('Error:', error);
			return new Response('oki doki');
		}
	}
}
