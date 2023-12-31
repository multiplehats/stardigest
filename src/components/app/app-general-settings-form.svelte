<script lang="ts" context="module">
	import { z } from 'zod';
	export const ZGeneralSettingsFormSchema = z.object({
		email: z.string({ required_error: 'Please select an email to display' }).email(),
		day: z.nativeEnum(WEEKDAY).optional(),
		enabled: z.boolean()
	});
	export type ZGeneralSettingsFormSchema = typeof ZGeneralSettingsFormSchema;
	export type ProfileFormValues = z.infer<typeof ZGeneralSettingsFormSchema>;
</script>

<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$components/ui/super-form';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';
	import * as Select from '$components/ui/select';
	import { Switch } from '$components/ui/switch';
	import { WEEKDAY, WEEKDAYS_FORMATTED } from '$lib/types';

	export let data: SuperValidated<ZGeneralSettingsFormSchema>;
</script>

<Form.Root
	{data}
	schema={ZGeneralSettingsFormSchema}
	let:form
	let:formValues
	method="POST"
	class="space-y-8"
>
	<Form.Field
		{form}
		name="enabled"
		class="flex flex-row items-center justify-between rounded-lg border p-4"
		let:field
	>
		<div class="space-y-0.5">
			<Form.Label class="text-base">Receive emails</Form.Label>
			<Form.Description>Receive emails about your GitHub stars.</Form.Description>
		</div>
		{@const { value, name, ...rest } = field.attrs}
		<Switch {...rest} checked={value} onCheckedChange={field.updateValue} />
		<input hidden {name} {value} />
	</Form.Field>

	<Form.Field {form} name="email" let:field>
		<Form.Label>Email</Form.Label>
		<Input placeholder="shadcn" {...field.attrs} on:input={field.handleInput} />

		<Form.Description>
			This is where you will receive reminders about your GitHub stars.
		</Form.Description>
		<Form.Message />
	</Form.Field>

	<Form.Field {form} name="day" let:field>
		<Form.Label>On what day of the week do you want to receive star reminders?</Form.Label>

		<Select.Root value={formValues.day} onValueChange={field.updateValue}>
			<Select.Trigger {...field.attrs}>
				<Select.Value placeholder="Select a day" />
				<Select.Input name={field.attrs.name} />
			</Select.Trigger>

			<Select.Content>
				{#each WEEKDAYS_FORMATTED as weekday (weekday.id)}
					<Select.Item value={weekday.id} label={weekday.label}>{weekday.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		<Form.Description>
			{#if formValues.day}
				You will receive a star reminder on {WEEKDAYS_FORMATTED[formValues.day].label}.
			{:else}
				You will receive a star reminder every Friday.
			{/if}
		</Form.Description>
		<Form.Message />
	</Form.Field>

	<Button type="submit">Update settings</Button>
</Form.Root>
