<script lang="ts">
	import { Separator } from '$components/ui/separator';
	import AppScheduleForm from '$components/app/app-general-settings-form.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">General settings</h3>

		<p class="text-sm text-muted-foreground">Configure your newsletter settings.</p>
	</div>

	<Separator />

	{#if $page.data?.session?.user}
		<AppScheduleForm data={data.form} />
	{/if}
</div>
