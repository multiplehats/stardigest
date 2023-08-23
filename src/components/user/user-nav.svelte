<script lang="ts">
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import * as Avatar from '$components/ui/avatar';
	import { Button } from '$components/ui/button';
	import { goto } from '$app/navigation';
	import { SETTINGS_PATH, SIGNIN_PATH } from '$lib/config/routes';
	import type { User } from 'lucia';

	export let user: User;

	async function handleSignOut() {
		const response = await fetch('/auth/signout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			goto(SIGNIN_PATH);
		}
	}

	// 2 letters
	$: avatarFallback = user.name
		? user.name.slice(0, 2)
		: user.githubUsername
		? user.githubUsername.slice(0, 2)
		: user.email.slice(0, 2);
</script>

<DropdownMenu.Root positioning={{ placement: 'bottom-end' }}>
	<DropdownMenu.Trigger asChild let:builder>
		<Button
			variant="ghost"
			builders={[builder]}
			class="relativew-7 h-7  sm:h-8 sm:w-8 rounded-full"
		>
			<Avatar.Root class="w-7 h-7 sm:h-8 sm:w-8">
				<Avatar.Image
					src="https://github.com/{user.githubUsername}.png?size=64"
					alt={user.githubUsername ? user.githubUsername : 'avatar'}
				/>
				<Avatar.Fallback>
					{avatarFallback}
				</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">{user.name ?? user.githubUsername}</p>
				<p class="text-xs leading-none text-muted-foreground">
					{user.email}
				</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item on:m-click={() => goto(SETTINGS_PATH)}>Settings</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:m-click={handleSignOut}>Log out</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
