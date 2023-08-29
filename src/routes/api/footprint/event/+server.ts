import { pirsch } from '$lib/server/pirsch';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = (e) => pirsch.event(e);
