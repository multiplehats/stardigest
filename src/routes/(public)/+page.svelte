<script lang="ts">
	import AuthForm from '$components/auth/auth-form.svelte';
	import LogoFull from '$components/common/logo-full.svelte';
	import { APP_NAME } from '$lib/config/constants';
	import { onMount } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { defaultMetaTags } from '$lib/utils/metatags';
	import { badgeVariants } from '$components/ui/badge';
	import { Github } from 'lucide-svelte';
	let htmlEmail: string;
	let iframeEl: HTMLIFrameElement;

	const title = "Don't let your Github stars go to waste.";
	const description = `${APP_NAME} is a newsletter that sends you a daily or weekly roundup with your starred Github
						repo's (you know, so that you don't forget that they exist). You don't have to lift a finger,
						just star and we'll do the rest.`;

	onMount(async () => {
		const html = await fetch('/api/example').then((res) => res.text());
		htmlEmail = html;

		iframeEl.srcdoc = `${htmlEmail}`;
	});
</script>

<MetaTags
	{...defaultMetaTags({
		title,
		description
	})}
/>

<section class="min-h-screen flex items-center">
	<div class="container">
		<div class="flex flex-col items-center gap-8 xl:gap-16 lg:flex-row">
			<div class="text-center md:max-w-2xl lg:text-left xl:shrink-0">
				<div>
					<div class="flex items-center justify-center lg:justify-start mt-12 sm:mt-0 sm:mb-8">
						<LogoFull />
					</div>

					<a
						href="https://github.com/multiplehats/stardigest"
						class={badgeVariants({
							variant: 'outline'
						})}
						target="_blank"
						rel="noopener noreferrer"
					>
						<div class="flex items-center justify-center gap-1">
							<Github class="h-3 w-3" />
							<span>View on Github</span>
						</div>
					</a>

					<h1 class="mt-10 text-4xl font-bold tracking-tight sm:text-6xl">
						{title}
					</h1>

					<p class="mt-6 text-lg sm:text-xl leading-8">
						{description}
					</p>
				</div>

				<div class="flex items-center justify-center mt-8 lg:justify-start">
					<AuthForm />
				</div>

				<div class="flex items-center justify-center gap-5 mt-8 lg:justify-start sm:gap-4">
					<div class="flex -space-x-3 overflow-hidden">
						<img
							class="inline-block w-8 h-8 border border-white rounded-full dark:border-gray-900"
							src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/neil-sims.png"
							alt=""
						/>
						<img
							class="inline-block w-8 h-8 border border-white rounded-full dark:border-gray-900"
							src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
							alt=""
						/>
						<img
							class="inline-block w-8 h-8 border border-white rounded-full dark:border-gray-900"
							src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png"
							alt=""
						/>
						<img
							class="inline-block w-8 h-8 border border-white rounded-full dark:border-gray-900"
							src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png"
							alt=""
						/>
					</div>

					<p class="mt-1 text-sm font-normal text-muted-foreground">
						Trusted by over 88+ developers
					</p>
				</div>
			</div>

			<div class="max-w-xl w-full">
				<iframe
					title="Email preview"
					bind:this={iframeEl}
					class="w-full email-preview h-[50vh] hide-scrollbar bg-black rounded-xl"
				/>
			</div>
		</div>
	</div>
</section>

<style>
	.email-preview::-webkit-scrollbar {
		display: none;
	}

	.email-preview {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
