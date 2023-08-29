/**
 * Scalar type
 */
type Scalar = string | number | boolean;

export type PirschServiceConfig = {
	enabled?: boolean;
	debug?: boolean;
	hit?: {
		paramsToRemove?: string[];
	};
};

export interface PirschHit {
	url: string;
	ip: string | null;
	user_agent: string;
	dnt: string | null;
	accept_language: string | null;
	sec_ch_ua: string | null;
	sec_ch_ua_mobile: string | null;
	sec_ch_ua_platform: string | null;
	sec_ch_ua_platform_version: string | null;
	sec_ch_width: string | null;
	sec_ch_viewport_width: string | null;
	referrer: string | null;
	title: string | null;
	screen_width: number | null;
	screen_height: number | null;
}

export interface PirschEvent extends PirschHit {
	event_name: string;
	event_duration?: number;
	event_meta?: Record<string, Scalar>;
}

export type PirschHitBuilder = {
	request: Request;
	url: PirschHit['url'];
	ip: PirschHit['ip'];
	referrer: PirschHit['referrer'];
	title: PirschHit['title'];
	screen_width: PirschHit['screen_width'];
	screen_height: PirschHit['screen_height'];
};

export type PirschHitClient = Pick<
	PirschHit,
	'url' | 'referrer' | 'title' | 'screen_width' | 'screen_height'
> & {
	routeId: string | null;
};

export type PirschEventClient = PirschHitClient & {
	name: string;
	duration?: number;
	meta?: Record<string, string>;
};

export type PirschEventProps = {
	name: string;
};
