<script lang="ts">
	import { goto } from '$app/navigation';
	import { APP_URL } from '$lib/config/constants';
	import type { ProviderItem } from '$lib/auth/types';
	import { createAuthUrl, createServerRedirectUri } from '$lib/auth/utils';
	import { PROVIDER_POST_MESSAGE_SOURCE } from '$lib/auth/constants';
	import Button from '$components/ui/button/button.svelte';
	import { Icons } from '$components/icons';

	export let provider: ProviderItem;

	let isLoading = false;
	let windowObjectReference: Window | null = null;
	let previousUrl: string | null = null;

	function receiveMessage(event: MessageEvent) {
		// Do we trust the sender of this message? (might be
		// different from what we originally opened, for example).
		if (event.origin !== APP_URL) {
			return;
		}

		const { data } = event;

		// if we trust the sender and the source is our popup
		if (data.source === PROVIDER_POST_MESSAGE_SOURCE) {
			// get the URL params and redirect to our server to auth.
			const { payload } = data as { source: string; payload: { params: string } };

			const params = new URLSearchParams(payload.params);
			const redirectUrl = createServerRedirectUri(provider.id, params);

			goto(redirectUrl, { replaceState: true });
		}
	}

	function signinWindow(url: string, name: string) {
		// remove any existing event listeners
		window.removeEventListener('message', receiveMessage);

		// window features
		const strWindowFeatures = 'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';

		if (windowObjectReference === null || windowObjectReference.closed) {
			/* if the pointer to the window object in memory does not exist
        or if such pointer exists but the window was closed */
			windowObjectReference = window.open(url, name, strWindowFeatures);
		} else if (previousUrl !== url) {
			/* if the resource to load is different,
        then we load it in the already opened secondary window and then
        we bring such window back on top/in front of its parent window. */
			windowObjectReference = window.open(url, name, strWindowFeatures);

			if (windowObjectReference) {
				windowObjectReference.focus();
			} else {
				console.error('windowObjectReference is null');
			}
		} else {
			/* else the window reference must exist and the window
        is not closed; therefore, we can bring it back on top of any other
        window with the focus() method. There would be no need to re-create
        the window or to reload the referenced resource. */
			windowObjectReference.focus();
		}

		// add the listener for receiving a message from the popup
		window.addEventListener('message', (event) => receiveMessage(event), false);
		// assign the previous URL
		previousUrl = url;
	}

	function handleSignin() {
		isLoading = true;
		// do something
		const authUrl = createAuthUrl(provider.id);
		signinWindow(authUrl, provider.id);
		isLoading = false;
	}
</script>

<Button variant="outline" type="button" disabled={isLoading} on:click={() => handleSignin()}>
	{#if isLoading}
		<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
	{:else}
		<svelte:component this={provider.icon} class="mr-2 h-4 w-4" />
	{/if}

	{provider.label}
</Button>
