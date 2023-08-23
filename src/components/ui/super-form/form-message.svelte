<script lang="ts">
	import { getContext } from 'svelte';
	import type { FormFieldContext } from './types';
	import { cn } from '$lib/utils';
	let className: string | undefined | null = undefined;
	export { className as class };

	const { formMessageId, errors } = getContext<FormFieldContext>('FormField');
</script>

{#if $errors}
	<p class={cn('text-[0.8rem] font-medium text-destructive', className)} id={formMessageId}>
		{$errors}
	</p>
{/if}
