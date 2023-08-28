<script>
	import Sidenav from '$components/app/app-main-settings-sidenav.svelte';
	import Header from '$components/common/header.svelte';
	import { Separator } from '$components/ui/separator';

	const sidebarNavItems = [
		{
			title: 'General',
			href: '/app'
		}
	];
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<Header />

<section class="pt-8 pb-16">
	<div class="container">
		<div class="space-y-0.5">
			<h2 class="text-2xl font-bold tracking-tight">Settings</h2>
			<p class="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
		</div>

		<Separator class="my-6" />

		<div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
			<aside class="-mx-4 lg:w-1/5">
				<Sidenav items={sidebarNavItems} />
			</aside>
			<div class="flex-1 lg:max-w-2xl">
				<slot />
			</div>
		</div>
	</div>
</section>
