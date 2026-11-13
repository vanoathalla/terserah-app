<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';

	interface Props {
		value: string;
		size?: number;
	}

	let { value, size = 160 }: Props = $props();

	let canvas = $state<HTMLCanvasElement | null>(null);

	onMount(async () => {
		if (canvas && value) {
			await QRCode.toCanvas(canvas, value, {
				width: size,
				margin: 1,
				color: {
					dark: '#000000',
					light: '#FFFDF7'
				}
			});
		}
	});

	$effect(() => {
		if (canvas && value) {
			QRCode.toCanvas(canvas, value, {
				width: size,
				margin: 1,
				color: {
					dark: '#000000',
					light: '#FFFDF7'
				}
			});
		}
	});
</script>

<canvas
	bind:this={canvas}
	width={size}
	height={size}
	class="border-2 border-black"
	style="image-rendering: pixelated;"
></canvas>
