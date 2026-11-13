<script lang="ts">
	import type { PlayerPresence } from '$lib/realtimeRoom.svelte';

	interface Props {
		players: PlayerPresence[];
		myId: string;
	}

	let { players, myId }: Props = $props();
</script>

<div class="flex gap-1.5 flex-wrap">
	{#each players as player (player.id)}
		<div
			class="relative flex flex-col items-center"
			title="{player.name}{player.isHost ? ' (Host)' : ''}"
		>
			<!-- Avatar -->
			<div
				class="text-2xl w-10 h-10 flex items-center justify-center rounded-full border-2
					   transition-all duration-200"
				class:border-black={!player.justSwiped}
				class:border-brand-lime={player.justSwiped}
				class:bg-brand-yellow={player.id === myId}
				class:bg-white={player.id !== myId}
				class:scale-110={player.justSwiped}
				class:shadow-brutal-sm={player.justSwiped}
				class:opacity-50={!player.online}
			>
				{player.avatar}
			</div>

			<!-- Ping ring animation when swiped -->
			{#if player.justSwiped}
				<span class="absolute top-0 left-0 w-10 h-10 rounded-full border-2 border-brand-lime animate-ping"></span>
			{/if}

			<!-- Swipe count badge -->
			{#if player.swipedCount > 0}
				<span
					class="absolute -top-1 -right-1 bg-brand-veto text-white text-[9px] font-bold
						   w-4 h-4 rounded-full flex items-center justify-center border border-black"
				>
					{player.swipedCount > 9 ? '9+' : player.swipedCount}
				</span>
			{/if}

			<!-- Host crown -->
			{#if player.isHost}
				<span class="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs">👑</span>
			{/if}

			<!-- Name label -->
			<span class="text-[9px] font-mono font-bold mt-0.5 max-w-[40px] truncate text-center">
				{player.id === myId ? 'Kamu' : player.name.split(' ')[0]}
			</span>
		</div>
	{/each}
</div>
