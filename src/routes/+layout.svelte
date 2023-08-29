<script>
	import { page } from '$app/stores';
	import { createPirschPageView } from '$lib/services/pirsch';
	import '../app.postcss';

	createPirschPageView();
</script>

<slot />
