<!--
    This callback page uses a onMount which executes when the page loads.
    We fetch the URL parameters which will include the auth token and
    send them to the opening window (the parent) using Window.postMessage().
-->
<script lang="ts">
	import { Icons } from '$components/icons';
	import * as Card from '$components/ui/card';

	import { PROVIDER_POST_MESSAGE_SOURCE } from '$lib/auth/constants';
	import { onMount } from 'svelte';

	onMount(() => {
	    const params = window.location.search

	    window.opener.postMessage({ source: PROVIDER_POST_MESSAGE_SOURCE, payload: { params } }, window.location.origin);
	    window.close();
	})
</script>

<div class="min-h-screen flex flex-col items-center justify-center">
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-lg">
                Please wait while we redirect you...
            </Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-row items-center"
        >
            <Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
            <span class="text-sm">
                This page will close automatically.
            </span>
		</Card.Content>
	</Card.Root>
</div>
