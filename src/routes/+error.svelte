<script lang="ts">
	import { page } from '$app/stores';
	import Logo from '$components/common/logo.svelte';
	import { buttonVariants } from '$components/ui/button';
	import { cn } from '$lib/utils';

	$: ({ error, status } = $page);
</script>

<main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
	<div class="text-center">
		<a href="/" class="inline-flex mb-8">
			<span class="sr-only">jobseeqr</span>

			<Logo class="h-18" />
		</a>

		<h1 class="mt-2 text-5xl lowercase sm:text-6xl">
			{#if error && status !== 404}
				{error.message}
			{:else}
				{status}
			{/if}
		</h1>

		<p class="mt-2 text-base max-w-md mx-auto">
			{#if status === 404}
				<p class="text-lg font-medium mb-1">Oops, we can't find that page</p>
				<p>
					The page you are looking for might have been removed, had its name changed or is
					temporarily unavailable.
				</p>
			{:else if status === 401}
				<p class="text-lg font-medium mb-1">Oops, you are not authorized to view this page</p>
				<p>
					Please make sure you are logged in and have the correct permissions to view this page.
				</p>
			{:else}
				<p class="text-lg font-medium mb-1">Oops, something went wrong</p>
				<p>We're are on the case and will fix this as soon as possible. Please try again later.</p>
			{/if}
		</p>

		<div class="mt-10 flex items-center justify-center gap-x-6">
			<a href="/" class={cn(buttonVariants())}>Go back home</a>
		</div>
	</div>
</main>
