<script lang="ts">
	import { page } from '$app/stores';
	import UserNav from '$components/user/user-nav.svelte';
	import { cn } from '$lib/utils';
	import Logo from './logo.svelte';

	let links: {
		name: string;
		href: string;
		show?: boolean;
	}[] = [];

	$: links = [
		{
			name: 'Home',
			href: '/',
			show: true
		},
		{
			name: 'Settings',
			href: '/app',
			show: !!$page?.data?.session?.user
		}
	];
</script>

<nav class="bg-background border-b">
	<div class="container">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<Logo class="w-20 sm:w-24 text-white" />
				</div>

				<div class="block">
					<div class="ml-4 sm:ml-10 flex items-baseline space-x-1 sm:space-x-4">
						{#each links as { href, name, show } (href)}
							{@const isCurrent = $page.url.pathname === href}

							{#if show}
								<a
									{href}
									class={cn(
										'text-background-foreground/70 hover:bg-accent hover:text-accent-foreground rounded-md px-1.5 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium',
										isCurrent && 'bg-accent text-accent-foreground'
									)}
								>
									{name}
								</a>
							{/if}
						{/each}
					</div>
				</div>
			</div>

			<div class="-mr-4 sm:mr-0 flex items-center">
				{#if $page.data?.session?.user}
					<UserNav user={$page.data.session.user} />
				{/if}
			</div>
		</div>
	</div>
</nav>
