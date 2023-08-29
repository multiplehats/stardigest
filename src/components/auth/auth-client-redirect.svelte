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

	const errors = [
		'access_denied',
		'invalid_request',
		'invalid_scope',
		'server_error',
		'temporarily_unavailable',
		'unauthorized_client',
		'unsupported_response_type'
	] as const;
	type Error = (typeof errors)[number];

	const errorsDescriptions = {
		access_denied: 'The user has denied your application access.',
		invalid_request: 'Invalid request.',
		invalid_scope: 'Invalid scope.',
		server_error: 'Server error.',
		temporarily_unavailable: 'Temporarily unavailable.',
		unauthorized_client: 'Unauthorized client.',
		unsupported_response_type: 'Unsupported response type.'
	} satisfies Record<(typeof errors)[number], string>;

	let hasError = false;
	let errorParam: Error | null = null;
	let errorDescParam: string | null = null;

	function getErrorMessage(error: Error): string {
		return errorsDescriptions[error];
	}

	// http://localhost:5173/auth/oauth/github/client-callback?error=access_denied&error_description=The+user+has+denied+your+application+access.&error_uri=https%3A%2F%2Fdocs.github.com%2Fapps%2Fmanaging-oauth-apps%2Ftroubleshooting-authorization-request-errors%2F%23access-denied&state=rb9dzu9le8hylbmc3y669se24x0ahj8m5zs4tq2qujw
	onMount(() => {
		const params = window.location.search;
		errorParam = new URLSearchParams(params).get('error') as Error | null;
		errorDescParam = new URLSearchParams(params).get('error_description');

		try {
			if (errorParam) {
				hasError = true;
				return;
			}

			window.opener.postMessage(
				{ source: PROVIDER_POST_MESSAGE_SOURCE, payload: { params } },
				window.location.origin
			);
			window.close();
		} catch (error) {
			console.error('Error posting message to parent:', error);
		}
	});

	$: hasError = errorParam !== null;
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

					<Alert.Title>
						{errorParam}
					</Alert.Title>

					<Alert.Description>
						<p>
							{errorParam ? getErrorMessage(errorParam) : errorDescParam}
						</p>
					</Alert.Description>
				</Alert.Root>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
