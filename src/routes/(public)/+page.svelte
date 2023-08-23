<script lang="ts">
	async function handleSignOut() {
		const response = await fetch('/auth/signout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<a href="/auth">Login</a>
<button on:click={handleSignOut}>Sign Out</button>
