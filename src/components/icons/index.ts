import type { Icon as LucideIcon } from 'lucide-svelte';
import GitHub from './github.svelte';
import { Loader2, XOctagon } from 'lucide-svelte';
export type Icon = LucideIcon;

export const Icons = {
	github: GitHub,
	spinner: Loader2,
	error: XOctagon
};
