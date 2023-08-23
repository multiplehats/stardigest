import { z } from 'zod';

export const ZQstashNewsletterCbSchema = z.object({
	email: z.string().email(),
	userId: z.string()
});
export type ZQstashNewsletterCallback = z.infer<typeof ZQstashNewsletterCbSchema>;
