import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { env } from '$env/dynamic/private';
import { connect } from '@planetscale/database';
import { schema } from '.';

export const db = drizzle(
	connect({
		host: env.DATABASE_HOST,
		username: env.DATABASE_USERNAME,
		password: env.DATABASE_PASSWORD,
		// rome-ignore lint/suspicious/noExplicitAny: TODO
		fetch: (url: string, init: any) => {
			// rome-ignore lint/suspicious/noExplicitAny: TODO
			(init as any)['cache'] = undefined; // Remove cache header
			return fetch(url, init);
		}
	}),
	{
		schema
	}
);
