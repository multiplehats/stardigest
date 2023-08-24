<!--
    This callback page uses a onMount which executes when the page loads.
    We fetch the URL parameters which will include the auth token and
    send them to the opening window (the parent) using Window.postMessage().
-->
<script lang="ts">
	import { Icons } from '$components/icons';
	import * as Card from '$components/ui/card';
	import * as Alert from '$components/ui/alert';

	import { PROVIDER_POST_MESSAGE_SOURCE } from '$lib/auth/constants';
	import { onMount } from 'svelte';

	let hasError = false;
	let errorParams: string | null = null;

	onMount(() => {
		const params = window.location.search;
		errorParams = new URLSearchParams(params).get('error');

		try {
			window.opener.postMessage(
				{ source: PROVIDER_POST_MESSAGE_SOURCE, payload: { params } },
				window.location.origin
			);
			window.close();
		} catch (error) {
			hasError = true;
			console.error('Error posting message to parent:', error);
		}
	});
</script>

<div class="min-h-screen flex flex-col items-center justify-center">
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-lg">
				{#if !hasError}
					Redirecting...
				{:else}
					An error occurred
				{/if}
			</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-row items-center">
			{#if !hasError}
				<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
				<span class="text-sm"> This page will close automatically. </span>
			{:else}
				<Alert.Root>
					<Icons.error class="h-4 w-4" />

					<Alert.Title>Unable to redirect</Alert.Title>

					<Alert.Description>
						<p class="mb-1">
							Please ensure you don't have any pop-up blockers enabled or have disabled JavaScript.
						</p>
						<p class="text-destructive">Error: {errorParams}</p>
					</Alert.Description>
				</Alert.Root>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
