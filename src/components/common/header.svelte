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
					<Logo class="w-24 text-white" />
				</div>
				<div class="hidden md:block">
					<div class="ml-10 flex items-baseline space-x-4">
						{#each links as { href, name, show } (href)}
							{@const isCurrent = $page.url.pathname === href}

							{#if show}
								<a
									{href}
									class={cn(
										'text-background-foreground/70 hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium',
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

			<div class="hidden md:flex items-center">
				{#if $page.data?.session?.user}
					<UserNav user={$page.data.session.user} />
				{/if}
			</div>

			<div class="-mr-2 flex md:hidden">
				<!-- Mobile menu button -->
				<button
					type="button"
					class="relative inline-flex items-center justify-center rounded-md bg-background p-2 bg-background-foreground hover:bg-background/70 hover:bg-background-foregrounde focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
					aria-controls="mobile-menu"
					aria-expanded="false"
				>
					<span class="absolute -inset-0.5" />
					<span class="sr-only">Open main menu</span>
					<!-- Menu open: "hidden", Menu closed: "block" -->
					<svg
						class="block h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path stroke-linecap="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
					<!-- Menu open: "block", Menu closed: "hidden" -->
					<svg
						class="hidden h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile menu, show/hide based on menu state. -->
	<div class="md:hidden" id="mobile-menu">
		<div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
			<!-- Current: "bg-gray-900 text-white", Default: "text-background-foreground/70 hover:bg-background/70 hover:bg-background-foregrounde" -->
			<a
				href="/"
				class="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
				aria-current="page">Dashboard</a
			>
			<a
				href="/"
				class="text-background-foreground/70 hover:bg-background/70 hover:bg-background-foregrounde block rounded-md px-3 py-2 text-base font-medium"
				>Team</a
			>
			<a
				href="/"
				class="text-background-foreground/70 hover:bg-background/70 hover:bg-background-foregrounde block rounded-md px-3 py-2 text-base font-medium"
				>Projects</a
			>
			<a
				href="/"
				class="text-background-foreground/70 hover:bg-background/70 hover:bg-background-foregrounde block rounded-md px-3 py-2 text-base font-medium"
				>Calendar</a
			>
			<a
				href="/"
				class="text-background-foreground/70 hover:bg-background/70 hover:bg-background-foregrounde block rounded-md px-3 py-2 text-base font-medium"
				>Reports</a
			>
		</div>
		<div class="border-t border-gray-700 pb-3 pt-4">
			<div class="flex items-center px-5">
				<div class="flex-shrink-0">
					<img
						class="h-10 w-10 rounded-full"
						src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
						alt=""
					/>
				</div>

				<div class="ml-3">
					<div class="text-base font-medium leading-none text-white">Tom Cook</div>
					<div class="text-sm font-medium leading-none bg-background-foreground">
						tom@example.com
					</div>
				</div>
				<button
					type="button"
					class="relative ml-auto flex-shrink-0 rounded-full bg-background p-1 bg-background-foreground hover:bg-background-foregrounde focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
				>
					<span class="absolute -inset-1.5" />
					<span class="sr-only">View notifications</span>
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
						/>
					</svg>
				</button>
			</div>
			<div class="mt-3 space-y-1 px-2">
				<a
					href="/"
					class="block rounded-md px-3 py-2 text-base font-medium bg-background-foreground hover:bg-background/70 hover:bg-background-foregrounde"
					>Your Profile</a
				>
				<a
					href="/"
					class="block rounded-md px-3 py-2 text-base font-medium bg-background-foreground hover:bg-background/70 hover:bg-background-foregrounde"
					>Settings</a
				>
				<a
					href="/"
					class="block rounded-md px-3 py-2 text-base font-medium bg-background-foreground hover:bg-background/70 hover:bg-background-foregrounde"
					>Sign out</a
				>
			</div>
		</div>
	</div>
</nav>
