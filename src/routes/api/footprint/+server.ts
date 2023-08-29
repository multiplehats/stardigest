import { pirsch } from '$lib/services/pirsch/pirsch.server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = (e) => pirsch.hit(e);
