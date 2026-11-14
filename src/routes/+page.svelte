<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { room } from '$lib/realtimeRoom.svelte';

	const AVATARS = ['😎', '🤙', '🔥', '👾', '🦋', '🐸', '🌙', '⚡', '🍜', '🍔', '🌶️', '🤤'];

	let name = $state('');
	let selectedAvatar = $state(AVATARS[0]);
	let joinCode = $state('');
	let mode = $state<'home' | 'create' | 'join'>('home');
	let loading = $state(false);
	let error = $state('');

	// Load saved identity
	const saved = room.loadIdentity();
	if (saved) { name = saved.name; }

	onMount(() => {
		const paramJoin = $page.url.searchParams.get('join');
		if (paramJoin) {
			joinCode = paramJoin.trim().toUpperCase().slice(0, 6);
			mode = 'join';
		}
	});

	async function createRoom() {
		if (!name.trim()) { error = 'Isi nama dulu dong!'; return; }
		error = '';
		loading = true;
		try {
			const code = await room.createRoom(name.trim(), selectedAvatar);
			goto(`/room/${code}`);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Gagal bikin room.';
		} finally {
			loading = false;
		}
	}

	async function joinRoom() {
		if (!name.trim()) { error = 'Isi nama dulu dong!'; return; }
		if (joinCode.trim().length !== 6) { error = 'Kode room 6 karakter ya.'; return; }
		error = '';
		loading = true;
		try {
			await room.joinRoom(joinCode.trim(), name.trim(), selectedAvatar);
			goto(`/room/${joinCode.trim().toUpperCase()}`);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Gagal masuk room.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>Terserah! 🎰</title></svelte:head>

<div class="flex flex-col flex-1 overflow-y-auto no-scrollbar">

	<!-- Hero -->
	<div class="bg-brand-yellow border-b-2 border-black px-6 pt-10 pb-6 text-center">
		<div class="text-6xl mb-2 inline-block" style="display:inline-block; animation: wiggle 1s infinite">🎰</div>
		<h1 class="font-mono font-bold text-4xl tracking-tight">TERSERAH!</h1>
		<p class="font-sans text-sm text-black/70 mt-1">
			Tongkrongan Decision Roulette<br/>
			<span class="font-bold">Swipe kanan buat nentuin makan dimana</span>
		</p>
	</div>

	<div class="flex-1 p-5 flex flex-col gap-4">

		{#if mode === 'home'}
			<!-- Identity -->
			<div class="bg-white border-2 border-black p-4 shadow-brutal">
				<h2 class="font-mono font-bold text-xs mb-3 tracking-widest text-gray-500">— IDENTITAS LO —</h2>
				<div class="mb-3">
					<label class="font-mono text-xs font-bold mb-1 block" for="name-input">NAMA PANGGILAN</label>
					<input
						id="name-input"
						type="text"
						bind:value={name}
						placeholder="e.g. Bro Joko..."
						maxlength={20}
						class="w-full border-2 border-black px-3 py-2 font-mono font-bold text-base
							   bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-yellow"
					/>
				</div>
				<div>
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label class="font-mono text-xs font-bold mb-2 block">PILIH AVATAR</label>
					<div class="grid grid-cols-6 gap-2">
						{#each AVATARS as avatar}
							<button
								class="text-2xl w-10 h-10 border-2 flex items-center justify-center transition-all"
								class:border-black={selectedAvatar !== avatar}
								class:border-brand-purple={selectedAvatar === avatar}
								class:bg-brand-purple={selectedAvatar === avatar}
								class:shadow-brutal-sm={selectedAvatar === avatar}
								onclick={() => selectedAvatar = avatar}
							>{avatar}</button>
						{/each}
					</div>
				</div>
			</div>

			{#if error}
				<div class="bg-brand-veto text-white font-mono font-bold text-sm border-2 border-black px-3 py-2">
					⚠️ {error}
				</div>
			{/if}

			<button class="btn-yellow w-full py-4 text-lg font-mono font-bold"
				onclick={() => { mode = 'create'; error = ''; }}>
				🏠 Buat Room Baru
			</button>
			<button class="btn-purple w-full py-4 text-lg font-mono font-bold text-white"
				onclick={() => { mode = 'join'; error = ''; }}>
				🚪 Masuk Room
			</button>

			<div class="bg-white border-2 border-black p-4 shadow-brutal-sm">
				<h3 class="font-mono font-bold text-xs tracking-widest text-gray-500 mb-3">— CARA MAIN —</h3>
				<div class="space-y-2">
					{#each [
						['1️⃣','Host bikin room, share kode ke temen'],
						['2️⃣','Semua masuk dan tunggu di lobby'],
						['3️⃣','Swipe kanan (Gas!) atau kiri (Skip)'],
						['4️⃣','Punya 1x Veto buat langsung coret tempat'],
						['5️⃣','Semua setuju = IT\'S A MATCH! langsung muncul'],
						['6️⃣','Download struk estetik buat di-share!'],
					] as [icon, text]}
						<div class="flex gap-2 text-sm">
							<span class="flex-none">{icon}</span>
							<span>{text}</span>
						</div>
					{/each}
				</div>
			</div>

		{:else if mode === 'create'}
			<div class="bg-white border-2 border-black p-4 shadow-brutal">
				<h2 class="font-mono font-bold text-sm mb-4 tracking-widest">— BUAT ROOM BARU —</h2>
				<div class="flex items-center gap-3 bg-brand-cream border-2 border-black p-3 mb-4">
					<span class="text-3xl">{selectedAvatar}</span>
					<div>
						<div class="font-mono font-bold">{name || '(belum isi nama)'}</div>
						<div class="text-xs text-gray-500">Host · Room baru</div>
					</div>
				</div>
				{#if error}
					<div class="bg-brand-veto text-white font-mono font-bold text-sm border-2 border-black px-3 py-2 mb-3">
						⚠️ {error}
					</div>
				{/if}
				<button class="btn-yellow w-full py-4 text-base font-mono font-bold mb-2"
					onclick={createRoom} disabled={loading}>
					{loading ? '⏳ Connecting...' : '🚀 Gas Bikin Room!'}
				</button>
				<button class="btn-white w-full py-3 text-sm font-mono"
					onclick={() => { mode = 'home'; error = ''; }}>← Balik</button>
			</div>

		{:else if mode === 'join'}
			<div class="bg-white border-2 border-black p-4 shadow-brutal">
				<h2 class="font-mono font-bold text-sm mb-4 tracking-widest">— MASUK ROOM —</h2>
				<div class="mb-4">
					<label class="font-mono text-xs font-bold mb-1 block" for="code-input">KODE ROOM (6 HURUF)</label>
					<input
						id="code-input"
						type="text"
						bind:value={joinCode}
						placeholder="e.g. ABC123"
						maxlength={6}
						class="w-full border-2 border-black px-3 py-3 font-mono font-bold text-2xl text-center
							   tracking-[0.5em] uppercase bg-brand-cream
							   focus:outline-none focus:ring-2 focus:ring-brand-yellow"
					/>
				</div>
				{#if error}
					<div class="bg-brand-veto text-white font-mono font-bold text-sm border-2 border-black px-3 py-2 mb-3">
						⚠️ {error}
					</div>
				{/if}
				<button class="btn-purple w-full py-4 text-base font-mono font-bold text-white mb-2"
					onclick={joinRoom} disabled={loading}>
					{loading ? '⏳ Connecting...' : '🚪 Masuk!'}
				</button>
				<button class="btn-white w-full py-3 text-sm font-mono"
					onclick={() => { mode = 'home'; error = ''; }}>← Balik</button>
			</div>
		{/if}
	</div>

	<div class="text-center py-4 font-mono text-xs text-gray-400 border-t-2 border-black">
		No database · Pure WebSocket · 100% Ephemeral
	</div>
</div>
