// ============================================================
// wsPlugin.ts — Vite plugin to handle WebSocket upgrades
// Intercepts HTTP upgrade requests before Vite handles them.
// ============================================================

import type { Plugin } from 'vite';
import type { IncomingMessage } from 'http';
import type { Server } from 'net';

export function websocketPlugin(): Plugin {
	return {
		name: 'terserah-websocket',
		configureServer(server) {
			server.httpServer?.on('upgrade', async (req: IncomingMessage, socket: Server, head: Buffer) => {
				const url = req.url ?? '';
				const match = url.match(/^\/ws\/([A-Z0-9]{6})$/);
				if (!match) return; // Not our WS route, let Vite handle it

				const roomCode = match[1];
				const { WebSocketServer } = await import('ws');
				const { handleConnection } = await import('./roomServer.js');

				const wss = new WebSocketServer({ noServer: true });
				wss.handleUpgrade(req, socket as unknown as import('net').Socket, head as unknown as Buffer, (ws) => {
					handleConnection(ws, roomCode);
				});
			});
		}
	};
}
