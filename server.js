// ============================================================
// server.js — Production entry point
//
// Usage after `npm run build`:
//   node server.js
//   PORT=3000 node server.js
// ============================================================

import { createServer } from 'http';
import { handler } from './build/handler.js';
import { WebSocketServer } from 'ws';
import { handleConnection } from './build/ws-server.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Create Node HTTP server — SvelteKit handles all HTTP requests
const server = createServer(handler);

// WebSocket upgrade — route /ws/[ROOM_CODE] to our game server
server.on('upgrade', (req, socket, head) => {
	const url = req.url ?? '';
	const match = url.match(/^\/ws\/([A-Z0-9]{6})$/);

	if (!match) {
		// Not our WS route — close cleanly
		socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
		socket.destroy();
		return;
	}

	const roomCode = match[1];
	const wss = new WebSocketServer({ noServer: true });
	wss.handleUpgrade(req, socket, head, (ws) => {
		handleConnection(ws, roomCode);
	});
});

server.listen(PORT, HOST, () => {
	const addr = HOST === '0.0.0.0' ? 'localhost' : HOST;
	console.log(`\n🎰  TERSERAH! is running`);
	console.log(`    Local:   http://localhost:${PORT}`);
	console.log(`    Network: http://${addr}:${PORT}`);
	console.log(`    WS:      ws://localhost:${PORT}/ws/[ROOM_CODE]\n`);
});
