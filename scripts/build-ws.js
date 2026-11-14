// scripts/build-ws.js
// Compiles roomServer.ts into build/ws-server.js after main build.
// This keeps the WS logic outside SvelteKit's SSR bundle.

import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

await build({
	entryPoints: [join(root, 'src/lib/server/roomServer.ts')],
	outfile: join(root, 'build/ws-server.js'),
	bundle: true,
	platform: 'node',
	format: 'esm',
	external: ['ws'],
	minify: false,
	sourcemap: false,
});

console.log('✅ WebSocket server compiled to build/ws-server.js');
