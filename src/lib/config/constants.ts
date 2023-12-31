export const APP_NAME = 'StarDigest';

export const APP_HOST = import.meta.env.DEV ? 'localhost:5173' : 'stardigest.app';
export const APP_URL = import.meta.env.DEV ? `http://${APP_HOST}` : `https://www.${APP_HOST}`;
export const SENDGRID_SENDER = 'hi@stardigest.app';
