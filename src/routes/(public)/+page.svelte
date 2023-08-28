<script lang="ts">
	import AuthForm from '$components/auth/auth-form.svelte';
	import LogoFull from '$components/common/logo-full.svelte';
	import { Badge } from '$components/ui/badge';
	import { APP_NAME } from '$lib/config/constants';
	import * as SplitPage from '$components/split-page';
	import { onMount } from 'svelte';

	let htmlEmail: string;
	let iframeEl: HTMLIFrameElement;

	onMount(async () => {
		const html = await fetch('/api/example').then((res) => res.text());
		console.log(html);
		htmlEmail = html;

		iframeEl.srcdoc = `${htmlEmail}`;
	});
</script>

<section class="min-h-screen flex items-center">
	<div class="container">
		<div class="flex flex-col items-center gap-8 xl:gap-16 lg:flex-row">
			<div class="text-center md:max-w-2xl lg:text-left xl:shrink-0">
				<div>
					<div class="flex items-center justify-center lg:justify-start mt-12 sm:mt-0 sm:mb-8">
						<LogoFull />
					</div>

					<h1 class="mt-10 text-4xl font-bold tracking-tight sm:text-6xl">
						Don't let your Github stars go to waste.
					</h1>

					<p class="mt-6 text-lg sm:text-xl leading-8">
						{APP_NAME} is a newsletter that sends you a daily or weekly roundup with your starred Github
						repo's (you know, so you don't forget about they exist). You don't have to lift a finger,
						just star and we'll do the rest.
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
