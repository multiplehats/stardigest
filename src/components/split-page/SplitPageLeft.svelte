<script lang="ts">
	import { cn } from '$lib/utils/cn';

	let className: string | undefined = undefined;
	export { className as class };
	export let containerClass: string | undefined = undefined;
</script>

<section class={cn('py-32 lg:py-0', className)}>
	<div
		class={cn(
			'mx-auto  p-4 md:p-8 flex w-full flex-col justify-center space-y-6 sm:w-[350px]',
			containerClass
		)}
	>
		<slot />
	</div>
</section>
