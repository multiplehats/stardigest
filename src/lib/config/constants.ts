export const APP_NAME = 'Stardrip';

export const APP_HOST = import.meta.env.DEV ? 'localhost:5173' : 'stardrip.app';
export const APP_URL = import.meta.env.DEV ? `http://${APP_HOST}` : `https://www.${APP_HOST}`;
