import type { InferSelectModel } from 'drizzle-orm';
import type { schema } from '.';

export type User = InferSelectModel<typeof schema.users>;
export type Session = InferSelectModel<typeof schema.sessions>;
