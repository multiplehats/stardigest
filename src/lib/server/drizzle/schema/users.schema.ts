import { relations } from 'drizzle-orm';
import {
	mysqlTable,
	index,
	unique,
	varchar,
	datetime,
	bigint,
	timestamp,
	mysqlEnum,
	boolean
} from 'drizzle-orm/mysql-core';
import { POLICY_LENGTH, USER_ID_LENGTH } from '../constants';
import { TIMEZONE, WEEKDAY } from '../../../types';

const timezones = Object.values(TIMEZONE) as [string, ...string[]];
const weekdays = Object.values(WEEKDAY) as [string, ...string[]];

export const users = mysqlTable(
	'users',
	{
		id: varchar('id', { length: USER_ID_LENGTH }).primaryKey(),
		createdAt: timestamp('createdAt').defaultNow().onUpdateNow(),
		updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
		name: varchar('name', { length: 191 }),
		email: varchar('email', { length: 320 }).notNull(),
		emailVerified: datetime('emailVerified', { fsp: 3 }),
		policy: varchar('policy', { length: POLICY_LENGTH }),
		github_username: varchar('github_username', { length: 100 }),
		github_access_token: varchar('github_access_token', { length: 255 }),
		github_refresh_token: varchar('github_refresh_token', { length: 255 }),
		github_token_expires_at: timestamp('github_token_expires_at'),
		github_token_updated_at: timestamp('github_token_updated_at'),
		// Settings
		timezone: mysqlEnum('timezone', timezones).notNull(),
		day: mysqlEnum('day', weekdays).notNull(),
		emailNewsletter: varchar('emailNewsletter', { length: 320 })
	},
	(table) => {
		return {
			idIdx: index('users_id_idx').on(table.id),
			userEmailKey: unique('users_email_key').on(table.email),
			userIdKey: unique('users_id_key').on(table.id)
		};
	}
);

export const sessions = mysqlTable(
	'sessions',
	{
		id: varchar('id', { length: 127 }).primaryKey(),
		activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
		idleExpires: bigint('idle_expires', { mode: 'number' }).notNull(),
		userId: varchar('user_id', { length: USER_ID_LENGTH }).notNull()
	},
	(table) => {
		return {
			userIdIdx: index('sessions_user_id_idx').on(table.userId),
			sessionIdKey: unique('sessions_id_key').on(table.id)
		};
	}
);

export const keys = mysqlTable(
	'keys',
	{
		id: varchar('id', { length: 255 }).primaryKey(),
		hashedPassword: varchar('hashed_password', { length: 255 }),
		userId: varchar('user_id', { length: USER_ID_LENGTH }).notNull()
	},
	(table) => {
		return {
			userIdIdx: index('keys_user_id_idx').on(table.userId),
			keyIdKey: unique('keys_id_key').on(table.id)
		};
	}
);
