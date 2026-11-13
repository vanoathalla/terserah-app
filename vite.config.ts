import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { websocketPlugin } from './src/lib/server/wsPlugin.js';

export default defineConfig({
	plugins: [
		sveltekit(),
		websocketPlugin()
	]
});
