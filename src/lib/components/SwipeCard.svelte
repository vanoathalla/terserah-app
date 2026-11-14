<script lang="ts">
	import { spring } from 'svelte/motion';
	import { getMapUrl, type Place } from '$lib/mockPlaces';

	interface Props {
		place: Place;
		onSwipe: (direction: 'gas' | 'skip') => void;
		isTop: boolean;
		stackIndex: number; // 0 = top, 1 = second, 2 = third
	}

	let { place, onSwipe, isTop, stackIndex }: Props = $props();

	// ── Spring physics ────────────────────────────────────────
	const pos = spring(
		{ x: 0, y: 0 },
		{ stiffness: 0.15, damping: 0.85 }
	);

	// ── Drag state ────────────────────────────────────────────
	let dragging = $state(false);
	let startX = $state(0);
	let startY = $state(0);
	let currentX = $state(0);

	// ── Derived visual states ─────────────────────────────────
	let rotation = $derived($pos.x * 0.08);
	let gasOpacity = $derived(Math.max(0, Math.min(1, $pos.x / 80)));
	let skipOpacity = $derived(Math.max(0, Math.min(1, -$pos.x / 80)));
	let isDraggingRight = $derived($pos.x > 30);
	let isDraggingLeft = $derived($pos.x < -30);

	// Stack visual offset
	let stackOffsetY = $derived(stackIndex * 8);
	let stackScale = $derived(1 - stackIndex * 0.04);

	// ── Pointer Events ────────────────────────────────────────
	function onPointerDown(e: PointerEvent) {
		if (!isTop) return;
		dragging = true;
		startX = e.clientX - $pos.x;
		startY = e.clientY - $pos.y;
		currentX = 0;
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging || !isTop) return;
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;
		currentX = dx;
		pos.set({ x: dx, y: dy * 0.3 });
	}

	function onPointerUp() {
		if (!dragging) return;
		dragging = false;

		const threshold = 90;

		if ($pos.x > threshold) {
			// Fling right — GAS!
			flingOut('gas');
		} else if ($pos.x < -threshold) {
			// Fling left — SKIP
			flingOut('skip');
		} else {
			// Snap back
			pos.set({ x: 0, y: 0 });
		}
	}

	function flingOut(direction: 'gas' | 'skip') {
		const targetX = direction === 'gas' ? 600 : -600;
		pos.set({ x: targetX, y: $pos.y - 50 }, { hard: false });
		setTimeout(() => {
			onSwipe(direction);
			pos.set({ x: 0, y: 0 }, { hard: true });
		}, 350);
	}

	/** Button-triggered swipe */
	export function triggerSwipe(direction: 'gas' | 'skip') {
		flingOut(direction);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="swipe-card absolute inset-0 select-none cursor-grab active:cursor-grabbing"
	style="
		transform: translate({$pos.x}px, {$pos.y + stackOffsetY}px) rotate({rotation}deg) scale({stackScale});
		z-index: {10 - stackIndex};
		transition: {dragging ? 'none' : ''};
	"
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerUp}
>
	<!-- Card -->
	<div
		class="relative w-full h-full bg-brand-cream border-2 border-black rounded-2xl overflow-hidden
			   shadow-brutal-lg flex flex-col"
		class:border-brand-lime={isDraggingRight && isTop}
		class:border-brand-veto={isDraggingLeft && isTop}
	>
		<!-- GAS label -->
		{#if isTop}
			<div
				class="swipe-label-gas"
				style="opacity: {gasOpacity};"
			>
				⚡ GAS!
			</div>

			<!-- SKIP label -->
			<div
				class="swipe-label-skip"
				style="opacity: {skipOpacity};"
			>
				SKIP 🚫
			</div>
		{/if}

		<!-- Emoji hero -->
		<div
			class="flex-none flex items-center justify-center text-8xl pt-10 pb-4
				   border-b-2 border-black"
			style="background: {isDraggingRight && isTop ? '#dcfce7' : isDraggingLeft && isTop ? '#fee2e2' : '#fff9db'};"
		>
			{place.emoji}
		</div>

		<!-- Content -->
		<div class="flex-1 p-4 flex flex-col gap-2 overflow-hidden">
			<!-- Name + category -->
			<div>
				<div class="flex items-start justify-between gap-2">
					<h2 class="font-mono font-bold text-xl leading-tight">{place.name}</h2>
					<span class="text-lg flex-none">{place.priceRange}</span>
				</div>
				<span class="inline-block bg-brand-yellow border border-black px-2 py-0.5 text-xs font-mono font-bold mt-1">
					{place.category}
				</span>
			</div>

			<!-- Rating -->
			<div class="flex items-center gap-1">
				<span class="text-yellow-500">★</span>
				<span class="font-mono font-bold text-sm">{place.rating}</span>
				<span class="text-xs text-gray-500 ml-1">{place.estimatedPrice}</span>
			</div>

			<!-- Vibe -->
			<p class="text-sm text-gray-700 leading-relaxed line-clamp-3">{place.vibe}</p>

			<!-- Address / Open Map -->
			<div class="flex items-center gap-1 text-xs text-gray-600 mt-auto">
				<span>📍</span>
				<a
					href={getMapUrl(place)}
					target="_blank"
					rel="noopener noreferrer"
					class="truncate hover:text-black hover:underline font-mono"
					onclick={(e) => e.stopPropagation()}
					title="Buka lokasi di Google Maps"
				>
					{place.address} <span class="text-[10px] text-brand-purple font-bold">↗ Maps</span>
				</a>
			</div>

			<!-- Tags -->
			<div class="flex flex-wrap gap-1">
				{#each place.tags as tag}
					<span class="bg-black text-white text-xs font-mono px-2 py-0.5 rounded-full">
						{tag}
					</span>
				{/each}
			</div>
		</div>
	</div>
</div>
