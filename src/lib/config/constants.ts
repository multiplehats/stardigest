export const APP_NAME = 'StarDigest';
// Hardcoded Cloudflare tunnel.
export const APP_HOST = import.meta.env.DEV ? 'dev.stardigest.app' : 'stardigest.app';
export const APP_URL = import.meta.env.DEV ? `http://${APP_HOST}` : `https://www.${APP_HOST}`;
export const SENDGRID_SENDER = 'hi@stardigest.app';
