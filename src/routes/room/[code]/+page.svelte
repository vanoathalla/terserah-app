<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { room } from '$lib/realtimeRoom.svelte';
	import { MOCK_PLACES, fetchOverpassPlaces, fetchPlacesByCity, pickRandom, type Place } from '$lib/mockPlaces';
	import SwipeCard from '$lib/components/SwipeCard.svelte';
	import ReceiptResult from '$lib/components/ReceiptResult.svelte';
	import PlayerAvatars from '$lib/components/PlayerAvatars.svelte';
	import QRCode from '$lib/components/QRCode.svelte';

	const code = $page.params.code ?? '';
	const shareUrl = typeof window !== 'undefined'
		? `${window.location.origin}/room/${code}`
		: `/room/${code}`;

	// ── Data Source Mode: 'mock' | 'osm' ─────────────────────
	let dataSource = $state<'mock' | 'osm'>('mock');
	let osmMode = $state<'gps' | 'city'>('city');
	let selectedCity = $state('Jakarta');
	let customCity = $state('');
	let gpsCoords = $state<{ lat: number; lon: number } | null>(null);
	let detectingGps = $state(false);
	let loadingPlaces = $state(false);
	let gpsStatus = $state('');

	const PRESET_CITIES = ['Jakarta', 'Bandung', 'Jogja', 'Surabaya', 'Bali'];

	// ── GPS Helper ───────────────────────────────────────────
	async function detectGps() {
		if (typeof window === 'undefined' || !navigator.geolocation) {
			gpsStatus = '⚠️ Browser membatasi GPS di HTTP / IP LAN. Pakai pilihan kota di bawah ya!';
			osmMode = 'city';
			return;
		}

		detectingGps = true;
		gpsStatus = '🛰️ Meminta izin GPS browser...';

		try {
			const pos = await new Promise<GeolocationPosition>((res, rej) =>
				navigator.geolocation.getCurrentPosition(res, rej, {
					timeout: 8000,
					maximumAge: 60000,
					enableHighAccuracy: false
				})
			);
			gpsCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
			osmMode = 'gps';
			gpsStatus = `✅ GPS aktif! (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`;
		} catch (e) {
			const msg = e instanceof GeolocationPositionError
				? ['Izin GPS ditolak di browser', 'GPS tidak tersedia', 'Waktu deteksi GPS habis'][e.code - 1]
				: 'Gagal deteksi GPS';
			gpsStatus = `⚠️ ${msg}. Otomatis pakai mode kota: ${selectedCity}.`;
			osmMode = 'city';
		} finally {
			detectingGps = false;
		}
	}

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
		gpsStatus = '';
		try {
			let places: Place[] = [];
			if (dataSource === 'mock') {
				places = pickRandom(MOCK_PLACES, 10);
			} else {
				// OpenStreetMap Mode
				gpsStatus = '📡 Mengambil tempat dari OpenStreetMap...';

				if (osmMode === 'gps' && gpsCoords) {
					try {
						places = await fetchOverpassPlaces(gpsCoords.lat, gpsCoords.lon, 1500);
					} catch {
						const city = selectedCity || 'Jakarta';
						gpsStatus = `GPS OSM sedikit lambat, mengambil tempat di ${city}...`;
						places = await fetchPlacesByCity(city);
					}
				} else if (osmMode === 'gps') {
					// User selected GPS but hasn't run detect yet
					if (typeof navigator !== 'undefined' && navigator.geolocation) {
						try {
							const pos = await new Promise<GeolocationPosition>((res, rej) =>
								navigator.geolocation.getCurrentPosition(res, rej, {
									timeout: 6000,
									maximumAge: 60000,
									enableHighAccuracy: false
								})
							);
							gpsCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
							places = await fetchOverpassPlaces(gpsCoords.lat, gpsCoords.lon, 1500);
						} catch {
							const city = selectedCity || 'Jakarta';
							gpsStatus = `GPS tidak diizinkan, mencari di ${city}...`;
							places = await fetchPlacesByCity(city);
						}
					} else {
						const city = selectedCity || 'Jakarta';
						gpsStatus = `GPS butuh HTTPS, mencari di ${city}...`;
						places = await fetchPlacesByCity(city);
					}
				} else {
					// City Mode
					const targetCity = customCity.trim() || selectedCity || 'Jakarta';
					places = await fetchPlacesByCity(targetCity);
				}

				// If OSM returned fewer than 10 places, blend with mock places to guarantee 10
				if (places.length < 10) {
					const needed = 10 - places.length;
					places = [...places, ...pickRandom(MOCK_PLACES, needed)];
				}
				places = places.slice(0, 10);
			}

			gpsStatus = '';
			room.sendGameStart(places);
		} catch (e) {
			console.error(e);
			gpsStatus = 'Gagal ambil OSM, otomatis pakai mock data.';
			const places = pickRandom(MOCK_PLACES, 10);
			room.sendGameStart(places);
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
				room.reconnect(code).catch(() => goto(`/?join=${code}`));
			} else {
				goto(`/?join=${code}`);
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
				<div class="text-xs font-mono font-bold text-gray-500 tracking-widest mb-3">— PENGATURAN TEMPAT —</div>

				<!-- Source selector -->
				<div class="grid grid-cols-2 gap-2 mb-3">
					<button
						class="py-2.5 px-2 border-2 border-black font-mono text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
						class:bg-brand-yellow={dataSource === 'mock'}
						class:shadow-brutal-sm={dataSource === 'mock'}
						class:bg-gray-100={dataSource !== 'mock'}
						class:text-gray-500={dataSource !== 'mock'}
						onclick={() => { dataSource = 'mock'; gpsStatus = ''; }}
					>
						<span class="text-lg">🎭</span>
						<span>Mock Demo</span>
						<span class="text-[10px] font-normal opacity-75">12 Tempat Hits</span>
					</button>

					<button
						class="py-2.5 px-2 border-2 border-black font-mono text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
						class:bg-brand-lime={dataSource === 'osm'}
						class:shadow-brutal-sm={dataSource === 'osm'}
						class:bg-gray-100={dataSource !== 'osm'}
						class:text-gray-500={dataSource !== 'osm'}
						onclick={() => { dataSource = 'osm'; gpsStatus = ''; }}
					>
						<span class="text-lg">🗺️</span>
						<span>Open Maps</span>
						<span class="text-[10px] font-normal opacity-75">OpenStreetMap</span>
					</button>
				</div>

				{#if dataSource === 'osm'}
					<div class="bg-brand-cream border-2 border-black p-3 mb-3 flex flex-col gap-2.5 text-xs font-mono">
						<div class="font-bold flex items-center justify-between">
							<span>📍 PILIH LOKASI PETA:</span>
							{#if gpsCoords}
								<span class="text-[10px] text-green-700 bg-green-100 px-1.5 py-0.5 border border-green-700">GPS Terdeteksi</span>
							{/if}
						</div>

						<!-- GPS Button -->
						<button
							class="w-full py-2 px-3 border-2 border-black font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
							class:bg-white={osmMode !== 'gps'}
							class:bg-brand-lime={osmMode === 'gps'}
							class:shadow-brutal-sm={osmMode === 'gps'}
							onclick={detectGps}
							disabled={detectingGps}
						>
							{#if detectingGps}
								<span>⏳</span><span>Mendeteksi GPS...</span>
							{:else}
								<span>🛰️</span><span>Pakai GPS Saya</span>
							{/if}
						</button>

						<!-- Preset cities -->
						<div>
							<div class="text-[10px] text-gray-500 mb-1.5 font-bold">ATAU PILIH KOTA TERDEKAT:</div>
							<div class="flex flex-wrap gap-1">
								{#each PRESET_CITIES as city}
									<button
										class="px-2.5 py-1 border border-black font-bold text-xs transition-all cursor-pointer"
										class:bg-black={selectedCity === city && osmMode === 'city' && !customCity}
										class:text-white={selectedCity === city && osmMode === 'city' && !customCity}
										class:bg-white={!(selectedCity === city && osmMode === 'city' && !customCity)}
										onclick={() => { selectedCity = city; customCity = ''; osmMode = 'city'; gpsStatus = `Kota dipilih: ${city}`; }}
									>
										{city}
									</button>
								{/each}
							</div>
						</div>

						<!-- Custom city input -->
						<div class="flex items-center gap-1.5 border border-black bg-white px-2 py-1">
							<span class="text-gray-400">🔍</span>
							<input
								type="text"
								bind:value={customCity}
								placeholder="Atau ketik kota (Malang, Medan...)"
								class="w-full bg-transparent text-xs font-bold outline-none font-mono"
								oninput={() => { if (customCity) { osmMode = 'city'; } }}
							/>
						</div>
					</div>
				{/if}

				{#if gpsStatus}
					<div class="text-xs font-mono border-2 border-black p-2.5 mb-3 bg-brand-cream shadow-brutal-sm">
						{gpsStatus}
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
					{loadingPlaces ? '⏳ Loading tempat Open Maps...' : `🚀 MULAI! (${room.allPlayersCount} pemain)`}
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
