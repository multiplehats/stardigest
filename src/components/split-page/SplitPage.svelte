<script lang="ts">
	import Left from './SplitPageLeft.svelte';
	import Right from './SplitPageRight.svelte';
	import Image from './SplitPageImage.svelte';

	import { cn } from '$lib/utils/cn';

	let className: string | undefined = undefined;
	export { className as class };
</script>

<div
	class={cn(
		'container relative h-full min-h-screen flex-col items-center justify-center sm:grid lg:max-w-none lg:grid-cols-2 lg:px-0',
		className
	)}
	{...$$restProps}
>
	<slot />
</div>
