import {
	mysqlTable,
	index,
	unique,
	varchar,
	datetime,
	mysqlEnum,
	bigint,
	timestamp,
	int,
	boolean
} from 'drizzle-orm/mysql-core';
import { ID_LENGTH, USER_ID_LENGTH } from '../constants';
import { TIMEZONE, WEEKDAY } from '../../../types';

const timezones = Object.values(TIMEZONE) as [string, ...string[]];
const weekdays = Object.values(WEEKDAY) as [string, ...string[]];

export const newsletter = mysqlTable(
	'newsletter',
	{
		id: varchar('id', { length: ID_LENGTH }).primaryKey(),
		userId: varchar('userId', { length: USER_ID_LENGTH }).notNull(),
		createdAt: timestamp('createdAt').defaultNow().onUpdateNow(),
		updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),

		// Settings
		timezone: mysqlEnum('timezone', timezones).notNull(),
		day: mysqlEnum('day', weekdays).notNull()
	},
	(table) => {
		return {
			userIdIdx: index('newsletter_userId_idx').on(table.userId),
			newsletterUserIdKey: unique('newsletter_userId_key').on(table.userId)
		};
	}
);
