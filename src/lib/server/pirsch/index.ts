import { PirschService } from '$lib/services/pirsch';
import { PIRSCH_API_KEY } from '$env/static/private';
import { dev } from '$app/environment';

export const pirsch = new PirschService(PIRSCH_API_KEY, {
	enabled: dev ? false : true,
	debug: false,
	hit: {
		paramsToRemove: ['x-sveltekit-invalidated']
	}
});
