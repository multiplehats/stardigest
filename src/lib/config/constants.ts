export const APP_NAME = 'Stardrip';
// Hardcoded Cloudflare tunnel.
export const APP_HOST = import.meta.env.DEV ? 'dev.stardrip.app' : 'stardrip.app';
export const APP_URL = import.meta.env.DEV ? `http://${APP_HOST}` : `https://www.${APP_HOST}`;
