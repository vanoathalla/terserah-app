<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { room } from '$lib/realtimeRoom.svelte';
	import { MOCK_PLACES, fetchOverpassPlaces, pickRandom } from '$lib/mockPlaces';
	import SwipeCard from '$lib/components/SwipeCard.svelte';
	import ReceiptResult from '$lib/components/ReceiptResult.svelte';
	import PlayerAvatars from '$lib/components/PlayerAvatars.svelte';
	import QRCode from '$lib/components/QRCode.svelte';

	const code = $page.params.code;
	const shareUrl = typeof window !== 'undefined'
		? `${window.location.origin}/room/${code}`
		: `/room/${code}`;

	// ── Demo / GPS mode ───────────────────────────────────────
	let demoMode = $state(true);
	let loadingPlaces = $state(false);
	let gpsError = $state('');

	// ── Swipe card ref ────────────────────────────────────────
	let topCardRef = $state<{ triggerSwipe: (dir: 'gas' | 'skip') => void } | null>(null);

	// ── Swipe overlay flash ───────────────────────────────────
	let lastSwipeDir = $state<'gas' | 'skip' | 'veto' | null>(null);
	let showOverlay = $state(false);

	function flashOverlay(dir: 'gas' | 'skip' | 'veto') {
		lastSwipeDir = dir; showOverlay = true;
		setTimeout(() => showOverlay = false, 400);
	}

	// ── Swipe actions ─────────────────────────────────────────
	function handleSwipe(dir: 'gas' | 'skip') {
		flashOverlay(dir);
		room.swipe(dir);
	}

	function handleVeto() {
		if (room.vetoUsed) return;
		flashOverlay('veto');
		room.swipe('veto');
	}

	function buttonSwipe(dir: 'gas' | 'skip') {
		topCardRef?.triggerSwipe(dir);
	}

	// ── Host starts game ──────────────────────────────────────
	async function startGame() {
		loadingPlaces = true;
		gpsError = '';
		try {
			let places;
			if (demoMode) {
				places = pickRandom(MOCK_PLACES, 10);
			} else {
				const pos = await new Promise<GeolocationPosition>((res, rej) =>
					navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 })
				);
				try {
					places = await fetchOverpassPlaces(pos.coords.latitude, pos.coords.longitude, 1500);
					if (places.length < 5) places = [...places, ...pickRandom(MOCK_PLACES, 10 - places.length)];
					places = places.slice(0, 10);
				} catch {
					gpsError = 'Overpass API error, pakai data mock.';
					places = pickRandom(MOCK_PLACES, 10);
				}
			}
			room.sendGameStart(places);
		} catch (e) {
			gpsError = 'Gagal ambil lokasi. Aktifkan GPS atau pakai Demo Mode.';
		} finally {
			loadingPlaces = false;
		}
	}

	// ── Copy helpers ──────────────────────────────────────────
	let copied = $state(false);
	async function copyCode() {
		await navigator.clipboard.writeText(code).catch(() => {});
		copied = true; setTimeout(() => copied = false, 2000);
	}
	async function copyLink() {
		await navigator.clipboard.writeText(shareUrl).catch(() => {});
		copied = true; setTimeout(() => copied = false, 2000);
	}

	// ── Play again ────────────────────────────────────────────
	function playAgain() {
		if (room.isHost) {
			room.resetForNewGame();
		} else {
			goto('/');
		}
	}

	// ── Mount: reconnect if refreshed ────────────────────────
	onMount(() => {
		if (!room.connected) {
			const saved = room.loadIdentity();
			if (saved) {
				room.reconnect().catch(() => goto('/'));
			} else {
				goto('/');
			}
		}
	});

	onDestroy(() => room.disconnect());
</script>

<svelte:head><title>Room {code} · Terserah! 🎰</title></svelte:head>

<!-- ══════════════════ LOBBY ══════════════════ -->
{#if room.phase === 'lobby'}
<div class="flex flex-col flex-1 overflow-y-auto no-scrollbar">

	<!-- Header -->
	<div class="bg-brand-yellow border-b-2 border-black px-4 py-3 flex items-center justify-between">
		<button class="text-sm font-mono font-bold" onclick={() => { room.disconnect(); goto('/'); }}>← Exit</button>
		<span class="font-mono font-bold text-lg">🎰 LOBBY</span>
		<span class="text-xs font-mono text-green-700 font-bold">
			{room.connected ? '🟢 Live' : '🔴 ...'}
		</span>
	</div>

	<div class="flex-1 p-4 flex flex-col gap-4">

		<!-- Room code -->
		<div class="bg-white border-2 border-black p-4 shadow-brutal text-center">
			<div class="text-xs font-mono font-bold text-gray-500 tracking-widest mb-1">KODE ROOM</div>
			<button
				class="font-mono font-bold text-4xl tracking-[0.3em] px-4 py-1
					   border-2 border-dashed border-gray-400 hover:bg-brand-yellow transition-colors"
				onclick={copyCode}
			>{code}</button>
			<div class="text-xs text-gray-400 mt-1">{copied ? '✅ Copied!' : 'Tap untuk copy'}</div>
		</div>

		<!-- QR -->
		<div class="flex flex-col items-center gap-2">
			<div class="text-xs font-mono font-bold text-gray-500 tracking-widest">— SCAN BUAT JOIN —</div>
			<div class="bg-white border-2 border-black p-3 shadow-brutal">
				<QRCode value={shareUrl} size={160} />
			</div>
			<button class="text-xs font-mono text-brand-purple underline" onclick={copyLink}>
				{copied ? '✅ Link Copied!' : '🔗 Copy Link'}
			</button>
		</div>

		<!-- Players -->
		<div class="bg-white border-2 border-black p-4 shadow-brutal">
			<div class="font-mono font-bold text-xs tracking-widest text-gray-500 mb-3">
				— PEMAIN ({room.allPlayersCount}) —
			</div>
			{#if room.playerList.length === 0}
				<div class="text-center text-gray-400 font-mono text-sm py-4 animate-pulse">
					Nunggu temen masuk...
				</div>
			{:else}
				<div class="space-y-2">
					{#each room.playerList as player (player.id)}
						<div class="flex items-center gap-3 border-2 border-black px-3 py-2"
							class:bg-brand-yellow={player.id === room.me?.id}
							class:bg-brand-cream={player.id !== room.me?.id}
						>
							<span class="text-2xl">{player.avatar}</span>
							<div class="flex-1">
								<span class="font-mono font-bold text-sm">{player.name}</span>
								{#if player.id === room.me?.id}
									<span class="text-xs font-mono text-gray-500 ml-1">(Kamu)</span>
								{/if}
							</div>
							{#if player.isHost}
								<span class="text-xs bg-black text-white font-mono px-2 py-0.5">HOST</span>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Host controls -->
		{#if room.isHost}
			<div class="bg-white border-2 border-black p-4 shadow-brutal">
				<div class="text-xs font-mono font-bold text-gray-500 tracking-widest mb-3">— PENGATURAN HOST —</div>

				<div class="flex items-center justify-between mb-3">
					<div>
						<div class="font-mono font-bold text-sm">🎭 Demo Mode</div>
						<div class="text-xs text-gray-500">Data mock (cepet, tanpa GPS)</div>
					</div>
					<button
						class="relative w-12 h-6 border-2 border-black transition-colors"
						class:bg-brand-lime={demoMode}
						class:bg-gray-200={!demoMode}
						onclick={() => { demoMode = !demoMode; gpsError = ''; }}
						role="switch"
						aria-checked={demoMode}
						aria-label="Toggle Demo Mode"
					>
						<span class="absolute top-0.5 w-4 h-4 bg-black transition-transform"
							class:translate-x-0.5={!demoMode}
							class:translate-x-6={demoMode}
						></span>
					</button>
				</div>

				{#if !demoMode}
					<div class="text-xs text-gray-500 bg-brand-cream border border-dashed border-gray-300 p-2 mb-2">
						📍 Akan ambil tempat dari OpenStreetMap di sekitar GPS kamu
					</div>
				{/if}

				{#if gpsError}
					<div class="text-xs text-brand-veto font-mono border border-brand-veto bg-red-50 p-2 mb-2">
						⚠️ {gpsError}
					</div>
				{/if}

				{#if room.error}
					<div class="text-xs text-brand-veto font-mono border border-brand-veto bg-red-50 p-2 mb-2">
						⚠️ {room.error}
					</div>
				{/if}

				<button
					class="btn-yellow w-full py-4 text-base font-mono font-bold"
					onclick={startGame}
					disabled={loadingPlaces || room.allPlayersCount < 1}
				>
					{loadingPlaces ? '⏳ Loading tempat...' : `🚀 MULAI! (${room.allPlayersCount} pemain)`}
				</button>

				{#if room.allPlayersCount < 2}
					<div class="text-xs text-center text-gray-400 font-mono mt-2">
						💡 Minta temen join atau main solo buat test
					</div>
				{/if}
			</div>
		{:else}
			<div class="bg-brand-purple/10 border-2 border-brand-purple p-4 text-center">
				<div class="font-mono font-bold text-brand-purple text-sm animate-pulse">
					⏳ Nunggu Host mulai game...
				</div>
				<div class="text-xs text-gray-500 mt-1 font-mono">Santai dulu, bentar lagi.</div>
			</div>
		{/if}
	</div>
</div>

<!-- ══════════════════ PLAYING ══════════════════ -->
{:else if room.phase === 'playing'}
<div class="flex flex-col flex-1 min-h-0">

	<!-- Top bar -->
	<div class="bg-white border-b-2 border-black px-3 py-2 flex items-center justify-between flex-none">
		<PlayerAvatars players={room.playerList} myId={room.me?.id ?? ''} />
		<div class="font-mono font-bold text-lg border-2 border-black px-3 py-1 min-w-[52px] text-center"
			class:bg-brand-lime={room.timeLeft > 20}
			class:bg-brand-yellow={room.timeLeft <= 20 && room.timeLeft > 10}
			class:bg-brand-veto={room.timeLeft <= 10}
			class:text-white={room.timeLeft <= 10}
		>{room.timeLeft}s</div>
	</div>

	<!-- Progress bar -->
	<div class="h-2 bg-gray-200 border-b-2 border-black flex-none">
		<div class="h-full bg-brand-purple transition-all duration-300"
			style="width:{Math.round((room.currentCardIndex / Math.max(room.places.length, 1)) * 100)}%">
		</div>
	</div>

	<div class="text-center font-mono text-xs text-gray-500 py-1 border-b border-dashed border-gray-300 flex-none">
		Kartu {Math.min(room.currentCardIndex + 1, room.places.length)} / {room.places.length}
	</div>

	<!-- Card arena -->
	<div class="relative flex-1 min-h-0">
		{#if showOverlay}
			<div class="absolute inset-0 z-50 pointer-events-none opacity-25 rounded-lg"
				class:bg-brand-lime={lastSwipeDir === 'gas'}
				class:bg-brand-veto={lastSwipeDir === 'skip' || lastSwipeDir === 'veto'}
			></div>
		{/if}

		{#if room.isDone}
			<div class="absolute inset-0 flex items-center justify-center p-6">
				<div class="text-center">
					<div class="text-5xl mb-3">✅</div>
					<div class="font-mono font-bold text-lg">Semua kartu selesai!</div>
					<div class="text-sm text-gray-500 mt-1 font-mono">Nunggu hasil dari server...</div>
				</div>
			</div>
		{:else}
			<div class="absolute inset-4">
				{#each room.places.slice(room.currentCardIndex, room.currentCardIndex + 3).reverse() as place, i (place.id)}
					{@const stackIndex = 2 - i}
					{#if stackIndex === 0}
						<SwipeCard {place} isTop={true} {stackIndex}
							onSwipe={(dir) => handleSwipe(dir)}
							bind:this={topCardRef} />
					{:else}
						<SwipeCard {place} isTop={false} {stackIndex}
							onSwipe={(dir) => handleSwipe(dir)} />
					{/if}
				{/each}
			</div>
		{/if}
	</div>

	<!-- Action buttons -->
	{#if !room.isDone}
		<div class="flex-none border-t-2 border-black bg-white p-3">
			<div class="text-center text-xs font-mono text-gray-400 mb-2">← Geser atau tap tombol →</div>
			<div class="flex gap-2 items-center">
				<button class="btn-veto flex-1 py-3 text-sm font-bold flex flex-col items-center gap-0.5"
					onclick={() => buttonSwipe('skip')}>
					<span class="text-xl">👈</span><span>SKIP</span>
				</button>

				<button
					class="border-2 border-black font-bold py-3 px-3 flex flex-col items-center gap-0.5
						   text-xs transition-all shadow-brutal-sm
						   active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
					class:bg-brand-purple={!room.vetoUsed}
					class:text-white={!room.vetoUsed}
					class:bg-gray-200={room.vetoUsed}
					class:text-gray-400={room.vetoUsed}
					onclick={handleVeto}
					disabled={room.vetoUsed}
					title="Veto 1x — coret tempat ini!"
				>
					<span class="text-lg">🚫</span>
					<span>{room.vetoUsed ? 'USED' : 'VETO'}</span>
				</button>

				<button class="btn-lime flex-1 py-3 text-sm font-bold flex flex-col items-center gap-0.5"
					onclick={() => buttonSwipe('gas')}>
					<span class="text-xl">👉</span><span>⚡ GAS!</span>
				</button>
			</div>
		</div>
	{/if}
</div>

<!-- ══════════════════ RESULT ══════════════════ -->
{:else if room.phase === 'result' && room.gameResult}
<div class="flex flex-col flex-1 overflow-y-auto no-scrollbar">
	<div class="border-b-2 border-black px-4 py-3 text-center"
		class:bg-brand-yellow={room.gameResult.isMatch}
		class:bg-brand-lime={!room.gameResult.isMatch}
	>
		<div class="font-mono font-bold text-lg">
			{room.gameResult.isMatch ? "✨ IT'S A MATCH! ✨" : '🏆 WAKTU HABIS — HASILNYA:'}
		</div>
	</div>
	<ReceiptResult result={room.gameResult} roomCode={code} onPlayAgain={playAgain} />
</div>
{/if}
