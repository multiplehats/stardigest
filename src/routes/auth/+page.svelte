<script lang="ts">
	import * as SplitPage from '$components/split-page';
	import Logo from '$components/common/logo.svelte';
	import AuthForm from '$components/auth/auth-form.svelte';
	import * as Card from '$components/ui/card';
</script>

<SplitPage.Root>
	<SplitPage.Left>
		<a href="/">
			<Logo class="w-24 mx-auto" />
		</a>

		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<Card.Root>
				<Card.Header class="space-y-1 text-center">
					<Card.Title class="text-2xl">Welcome back</Card.Title>
					<Card.Description>
						<p class="text-sm">
							Use your Github account to login or sign up for an account. Don't worry, we'll only
							access your public information and email address.
						</p>
					</Card.Description>
				</Card.Header>
				<Card.Content class="grid gap-4">
					<AuthForm />
				</Card.Content>
			</Card.Root>
		</div>
	</SplitPage.Left>

	<SplitPage.Right>
		<SplitPage.Image class="bg-bottom" />
	</SplitPage.Right>
</SplitPage.Root>
