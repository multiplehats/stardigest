<script lang="ts">
	import { getContext } from 'svelte';
	import type { FormFieldContext } from './types';
	import { cn } from '$lib/utils';
	let className: string | undefined | null = undefined;
	export { className as class };

	const { formDescriptionId } = getContext<FormFieldContext>('FormField');
</script>

<p
	class={cn('text-[0.8rem] text-muted-foreground', className)}
	{...$$restProps}
	id={formDescriptionId}
>
	<slot />
</p>
