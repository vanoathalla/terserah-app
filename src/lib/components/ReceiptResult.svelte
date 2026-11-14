<script lang="ts">
	import { toPng } from 'html-to-image';
	import type { GameResult, PlaceScore } from '$lib/realtimeRoom.svelte';
	import { getMapUrl, getOsmUrl } from '$lib/mockPlaces';

	interface Props {
		result: GameResult;
		roomCode: string;
		onPlayAgain: () => void;
	}

	let { result, roomCode, onPlayAgain }: Props = $props();

	let receiptEl = $state<HTMLDivElement | null>(null);
	let downloading = $state(false);

	let dateStr = $derived(
		new Date(result.timestamp).toLocaleDateString('id-ID', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);

	let timeStr = $derived(
		new Date(result.timestamp).toLocaleTimeString('id-ID', {
			hour: '2-digit',
			minute: '2-digit'
		})
	);

	/** Format rank medal */
	function rankMedal(i: number): string {
		return ['🥇', '🥈', '🥉'][i] ?? `#${i + 1}`;
	}

	/** Score bar percentage */
	function barWidth(score: PlaceScore): string {
		return `${Math.max(5, score.gasPercentage)}%`;
	}

	async function downloadPNG() {
		if (!receiptEl) return;
		downloading = true;
		try {
			const dataUrl = await toPng(receiptEl, {
				quality: 1,
				pixelRatio: 2,
				backgroundColor: '#ffffff'
			});
			const link = document.createElement('a');
			link.download = `terserah-${roomCode}-${Date.now()}.png`;
			link.href = dataUrl;
			link.click();
		} catch (err) {
			console.error('Download gagal:', err);
		} finally {
			downloading = false;
		}
	}
</script>

<div class="animate-slide-up flex flex-col items-center gap-4 p-4 pb-8">

	<!-- Receipt container -->
	<div bind:this={receiptEl} class="w-full max-w-sm">
		<!-- Top jagged edge -->
		<div class="receipt-top"></div>

		<!-- Receipt body -->
		<div class="bg-white border-x-2 border-black px-5 py-4 font-mono">

			<!-- Header -->
			<div class="text-center border-b-2 border-dashed border-gray-400 pb-3 mb-3">
				<div class="text-3xl mb-1">🎰</div>
				<div class="font-bold text-xl tracking-widest">TERSERAH!</div>
				<div class="text-xs text-gray-500">Tongkrongan Decision Roulette</div>
				<div class="text-xs mt-1">
					Room: <span class="font-bold">{roomCode}</span>
					· {result.totalPlayers} pemain
				</div>
				<div class="text-xs text-gray-400">{dateStr}</div>
				<div class="text-xs text-gray-400">{timeStr}</div>
			</div>

			<!-- Winner banner -->
			{#if result.isMatch && result.winner}
				<div class="text-center bg-brand-yellow border-2 border-black p-3 mb-3 shadow-brutal-sm">
					<div class="text-xs font-bold tracking-widest text-black mb-1">✨ IT'S A MATCH! ✨</div>
					<div class="text-2xl">{result.winner.place.emoji}</div>
					<div class="font-bold text-base mt-1">{result.winner.place.name}</div>
					<div class="text-xs text-gray-700 mt-0.5">{result.winner.place.vibe}</div>
					<div class="text-xs text-gray-600 mt-1 font-mono truncate">📍 {result.winner.place.address}</div>
					<div class="mt-2.5 flex gap-1.5 justify-center">
						<a
							href={getMapUrl(result.winner.place)}
							target="_blank"
							rel="noopener noreferrer"
							class="flex-1 bg-black text-white py-1.5 px-3 text-xs font-bold font-mono text-center
								   hover:bg-neutral-800 transition-colors border-2 border-black flex items-center justify-center gap-1 shadow-brutal-sm"
						>
							🗺️ Google Maps
						</a>
						<a
							href={getOsmUrl(result.winner.place)}
							target="_blank"
							rel="noopener noreferrer"
							class="bg-brand-cream text-black py-1.5 px-2 text-xs font-bold font-mono text-center
								   hover:bg-white transition-colors border-2 border-black flex items-center justify-center gap-1 shadow-brutal-sm"
							title="Buka di OpenStreetMap"
						>
							🌐 OSM
						</a>
					</div>
				</div>
			{:else if result.winner}
				<div class="text-center bg-brand-lime border-2 border-black p-3 mb-3 shadow-brutal-sm">
					<div class="text-xs font-bold tracking-widest mb-1">🏆 PILIHAN TERBAIK</div>
					<div class="text-2xl">{result.winner.place.emoji}</div>
					<div class="font-bold text-base mt-1">{result.winner.place.name}</div>
					<div class="text-xs text-gray-700 mt-0.5">{result.winner.place.vibe}</div>
					<div class="text-xs text-gray-600 mt-1 font-mono truncate">📍 {result.winner.place.address}</div>
					<div class="mt-2.5 flex gap-1.5 justify-center">
						<a
							href={getMapUrl(result.winner.place)}
							target="_blank"
							rel="noopener noreferrer"
							class="flex-1 bg-black text-white py-1.5 px-3 text-xs font-bold font-mono text-center
								   hover:bg-neutral-800 transition-colors border-2 border-black flex items-center justify-center gap-1 shadow-brutal-sm"
						>
							🗺️ Google Maps
						</a>
						<a
							href={getOsmUrl(result.winner.place)}
							target="_blank"
							rel="noopener noreferrer"
							class="bg-brand-cream text-black py-1.5 px-2 text-xs font-bold font-mono text-center
								   hover:bg-white transition-colors border-2 border-black flex items-center justify-center gap-1 shadow-brutal-sm"
							title="Buka di OpenStreetMap"
						>
							🌐 OSM
						</a>
					</div>
				</div>
			{:else}
				<div class="text-center bg-brand-veto text-white border-2 border-black p-3 mb-3 shadow-brutal-sm">
					<div class="text-xs font-bold tracking-widest mb-1">💀 GA ADA TEMPAT LOLOS</div>
					<div class="text-2xl">💨</div>
					<div class="font-bold text-base mt-1">Semua Tempat Kena Veto!</div>
					<div class="text-xs opacity-90 mt-0.5">Kalian mau makan angin atau gimana nih? 😂</div>
				</div>
			{/if}

			<!-- Top 3 Scores -->
			<div class="border-b-2 border-dashed border-gray-400 pb-3 mb-3">
				<div class="text-xs font-bold tracking-widest text-center mb-2 text-gray-500">— REKAP SKOR —</div>
				{#each result.topPlaces as score, i}
					<div class="flex items-center gap-2 mb-2" class:opacity-50={score.isVetoed}>
						<span class="text-lg w-6">{rankMedal(i)}</span>
						<div class="flex-1 min-w-0">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-1.5 truncate">
									<span class="font-bold text-sm truncate">{score.place.name}</span>
									<a
										href={getMapUrl(score.place)}
										target="_blank"
										rel="noopener noreferrer"
										class="text-xs text-gray-400 hover:text-black flex-none"
										title="Buka di Maps"
									>🗺️</a>
								</div>
								{#if score.isVetoed}
									<span class="text-brand-veto text-xs font-bold ml-1">VETO</span>
								{:else}
									<span class="text-brand-lime text-xs font-bold">{score.gasCount}x ⚡</span>
								{/if}
							</div>
							<!-- Progress bar -->
							<div class="h-2 bg-gray-100 border border-gray-300 rounded-sm mt-1 overflow-hidden">
								<div
									class="h-full rounded-sm transition-all"
									class:bg-brand-lime={!score.isVetoed}
									class:bg-brand-veto={score.isVetoed}
									style="width: {barWidth(score)}"
								></div>
							</div>
							<div class="flex gap-2 text-xs text-gray-500 mt-0.5">
								<span>⚡ {score.gasCount}</span>
								<span>⏭️ {score.skipCount}</span>
								{#if score.vetoCount > 0}<span class="text-brand-veto">🚫 {score.vetoCount}</span>{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Drama Statistik -->
			<div class="border-b-2 border-dashed border-gray-400 pb-3 mb-3">
				<div class="text-xs font-bold tracking-widest text-center mb-2 text-gray-500">— DRAMA STATISTIK —</div>

				{#if result.dramaStats.siPalingRewel}
					<div class="flex items-center gap-2 mb-1.5 bg-brand-veto/10 border border-brand-veto/30 p-1.5 rounded">
						<span class="text-xl">{result.dramaStats.siPalingRewel.player.avatar}</span>
						<div class="flex-1 min-w-0">
							<div class="text-xs font-bold text-brand-veto">😤 SI PALING REWEL</div>
							<div class="text-xs font-bold truncate">{result.dramaStats.siPalingRewel.player.name}</div>
							<div class="text-xs text-gray-500">Skip {result.dramaStats.siPalingRewel.skipCount}x</div>
						</div>
					</div>
				{/if}

				{#if result.dramaStats.siPalingPasrah}
					<div class="flex items-center gap-2 mb-1.5 bg-brand-lime/10 border border-brand-lime/30 p-1.5 rounded">
						<span class="text-xl">{result.dramaStats.siPalingPasrah.player.avatar}</span>
						<div class="flex-1 min-w-0">
							<div class="text-xs font-bold text-green-700">🫡 SI PALING PASRAH</div>
							<div class="text-xs font-bold truncate">{result.dramaStats.siPalingPasrah.player.name}</div>
							<div class="text-xs text-gray-500">Gas! {result.dramaStats.siPalingPasrah.gasCount}x</div>
						</div>
					</div>
				{/if}

				{#if result.dramaStats.pelakuVeto.length > 0}
					<div class="flex items-center gap-2 mb-1.5 bg-brand-purple/10 border border-brand-purple/30 p-1.5 rounded">
						<span class="text-xl">🚫</span>
						<div class="flex-1 min-w-0">
							<div class="text-xs font-bold text-brand-purple">PELAKU VETO</div>
							<div class="text-xs font-bold">
								{result.dramaStats.pelakuVeto.map(p => `${p.avatar} ${p.name}`).join(', ')}
							</div>
						</div>
					</div>
				{/if}

				{#if result.dramaStats.topSwiper}
					<div class="flex items-center gap-2 bg-brand-yellow/30 border border-brand-yellow p-1.5 rounded">
						<span class="text-xl">{result.dramaStats.topSwiper.player.avatar}</span>
						<div class="flex-1 min-w-0">
							<div class="text-xs font-bold text-yellow-700">⚡ SWIPER TERKENCENG</div>
							<div class="text-xs font-bold truncate">{result.dramaStats.topSwiper.player.name}</div>
							<div class="text-xs text-gray-500">{result.dramaStats.topSwiper.swipeCount} aksi</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div class="text-center text-xs text-gray-400">
				<div class="mb-1">— terima kasih sudah makan! —</div>
				<div class="font-bold text-black tracking-wider">TERSERAH! 🎰</div>
				<div class="text-[10px] mt-0.5">terserah-app-production.up.railway.app</div>
			</div>
		</div>

		<!-- Bottom jagged edge -->
		<div class="receipt-bottom"></div>
	</div>

	<!-- Action buttons -->
	<div class="flex gap-3 w-full max-w-sm mt-2">
		<button
			class="btn-yellow flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2"
			onclick={downloadPNG}
			disabled={downloading}
		>
			{#if downloading}
				⏳ Proses...
			{:else}
				📸 Simpan ke IG Story
			{/if}
		</button>

		<button
			class="btn-purple flex-none px-4 py-3 text-sm font-bold flex items-center justify-center gap-2"
			onclick={onPlayAgain}
		>
			🔄 Main Lagi
		</button>
	</div>
</div>
