<script lang="ts">
	import { cn } from '$lib/utils';
	import LogoIcon from './logo-icon.svelte';
	import Logo from './logo.svelte';

	let className: string | undefined = undefined;
	export { className as class };
</script>

<div class={cn('flex flex-row space-x-2 items-center', className)}>
	<LogoIcon class="w-8 h-8" />
	<Logo class="w-32" />
</div>
