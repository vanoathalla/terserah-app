// ============================================================
// wsPlugin.ts — Vite dev plugin
// Intercepts WebSocket upgrades at /ws/[CODE] during development.
// Production is handled by server.js + build/ws-server.js.
// ============================================================

import type { Plugin } from 'vite';
import type { IncomingMessage } from 'http';
import type { Socket } from 'net';

export function websocketPlugin(): Plugin {
	return {
		name: 'terserah-websocket',
		configureServer(viteServer) {
			viteServer.httpServer?.on('upgrade', async (
				req: IncomingMessage,
				socket: Socket,
				head: Buffer
			) => {
				const url = req.url ?? '';
				const match = url.match(/^\/ws\/([A-Z0-9]{6})$/);

				// Skip Vite HMR websocket
				if (!match || req.headers['sec-websocket-protocol'] === 'vite-hmr') return;

				const roomCode = match[1];
				const [{ WebSocketServer }, { handleConnection }] = await Promise.all([
					import('ws'),
					import('./roomServer.js')
				]);

				const wss = new WebSocketServer({ noServer: true });
				wss.handleUpgrade(req, socket, head, (ws) => {
					handleConnection(ws, roomCode);
				});
			});
		}
	};
}
