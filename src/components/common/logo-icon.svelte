<script lang="ts">
	import type { IconProps } from 'lucide-svelte';

	type $$Props = IconProps;
	let className: string | undefined = undefined;
	export { className as class };
</script>

<svg
	viewBox="0 0 164 164"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={className}
	{...$$restProps}
>
	<rect width="164" height="164" rx="52" fill="#DAAA4B" />
	<path
		d="M86.2286 42.574C84.4541 39.142 79.5459 39.142 77.7714 42.574L66.4713 64.429C66.0186 65.3048 65.305 66.0184 64.4289 66.4713L42.5742 77.7714C39.1419 79.5459 39.1419 84.4541 42.5742 86.2286L64.4289 97.5287C65.305 97.9814 66.0186 98.695 66.4713 99.5711L77.7714 121.426C79.5459 124.858 84.4541 124.858 86.2286 121.426L97.5287 99.5711C97.9816 98.695 98.6952 97.9814 99.571 97.5287L121.426 86.2286C124.858 84.4541 124.858 79.5459 121.426 77.7714L99.571 66.4713C98.6952 66.0184 97.9816 65.3048 97.5287 64.429L86.2286 42.574Z"
		fill="white"
	/>
</svg>
