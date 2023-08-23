<script lang="ts">
	import { providers } from '$lib/auth/utils';
	import AuthProviderButton from './auth-provider-button.svelte';
</script>

{#each providers as provider (provider.id)}
	<AuthProviderButton {provider} />
{/each}
