<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<!-- Mobile-first phone frame wrapper -->
<div class="min-h-dvh flex justify-center bg-black">
	<div class="relative w-full max-w-md min-h-dvh border-x-2 border-black bg-brand-cream overflow-hidden flex flex-col">
		{@render children()}
	</div>
</div>
