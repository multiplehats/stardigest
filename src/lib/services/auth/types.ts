import { z } from 'zod';

// Name has a default value just to display something in the form.
const schema = z.object({
	name: z.string().default('Hello world!'),
	email: z.string().email()
});
