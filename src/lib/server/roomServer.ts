// ============================================================
// roomServer.ts — In-memory room state + WebSocket management
// Runs ONLY on server (Node.js). Imported by the Vite WS plugin.
// ============================================================

import type { WebSocket } from 'ws';
import type { Place } from '../mockPlaces.js';

// ── Types ─────────────────────────────────────────────────────

export interface Player {
	id: string;
	name: string;
	avatar: string;
	isHost: boolean;
	joinedAt: number;
	swipedCount: number;
}

export interface PlayerAction {
	playerId: string;
	playerName: string;
	playerAvatar: string;
	placeId: string;
	action: 'gas' | 'skip' | 'veto';
	timestamp: number;
}

export interface PlaceScore {
	place: Place;
	gasCount: number;
	skipCount: number;
	vetoCount: number;
	totalScore: number;
	isVetoed: boolean;
	gasPercentage: number;
}

export interface DramaStats {
	siPalingRewel: { player: Player; skipCount: number } | null;
	siPalingPasrah: { player: Player; gasCount: number } | null;
	pelakuVeto: Player[];
	topSwiper: { player: Player; swipeCount: number } | null;
}

export interface GameResult {
	topPlaces: PlaceScore[];
	winner: PlaceScore | null;
	isMatch: boolean;
	dramaStats: DramaStats;
	totalPlayers: number;
	timestamp: number;
}

export type ServerMsg =
	| { type: 'ROOM_STATE'; players: Player[]; phase: string; roomCode: string }
	| { type: 'PLAYER_JOIN'; player: Player }
	| { type: 'PLAYER_LEAVE'; playerId: string }
	| { type: 'GAME_START'; places: Place[] }
	| { type: 'PLAYER_ACTION'; action: PlayerAction }
	| { type: 'TIMER_TICK'; timeLeft: number }
	| { type: 'GAME_OVER'; result: GameResult }
	| { type: 'ERROR'; message: string };

interface Room {
	code: string;
	hostId: string;
	phase: 'lobby' | 'playing' | 'result';
	players: Map<string, Player>;
	sockets: Map<string, WebSocket>;
	places: Place[];
	actions: PlayerAction[];
	timerHandle: ReturnType<typeof setInterval> | null;
	timeLeft: number;
}

// ── Global room store ─────────────────────────────────────────
const rooms = new Map<string, Room>();

// ── Broadcast helpers ─────────────────────────────────────────

function send(ws: WebSocket, msg: ServerMsg) {
	if (ws.readyState === 1) ws.send(JSON.stringify(msg));
}

function broadcast(room: Room, msg: ServerMsg, excludeId?: string) {
	for (const [id, ws] of room.sockets) {
		if (id !== excludeId) send(ws, msg);
	}
}

function broadcastAll(room: Room, msg: ServerMsg) {
	broadcast(room, msg);
}

// ── Game logic ────────────────────────────────────────────────

function calcScores(room: Room): PlaceScore[] {
	const total = room.players.size || 1;
	return room.places.map((place) => {
		const pa = room.actions.filter((a) => a.placeId === place.id);
		const gasCount = pa.filter((a) => a.action === 'gas').length;
		const skipCount = pa.filter((a) => a.action === 'skip').length;
		const vetoCount = pa.filter((a) => a.action === 'veto').length;
		const isVetoed = vetoCount > 0;
		const gasPercentage = Math.round((gasCount / total) * 100);
		return {
			place, gasCount, skipCount, vetoCount,
			totalScore: isVetoed ? -999 : gasCount * 2 - skipCount,
			isVetoed, gasPercentage
		};
	});
}

function calcDrama(room: Room): DramaStats {
	const skipC = new Map<string, number>();
	const gasC = new Map<string, number>();
	const vetoers = new Set<string>();
	const swipeC = new Map<string, number>();

	for (const a of room.actions) {
		swipeC.set(a.playerId, (swipeC.get(a.playerId) ?? 0) + 1);
		if (a.action === 'skip') skipC.set(a.playerId, (skipC.get(a.playerId) ?? 0) + 1);
		if (a.action === 'gas') gasC.set(a.playerId, (gasC.get(a.playerId) ?? 0) + 1);
		if (a.action === 'veto') vetoers.add(a.playerId);
	}

	let rewelId = '', maxSkips = 0;
	for (const [id, n] of skipC) if (n > maxSkips) { maxSkips = n; rewelId = id; }

	let pasrahId = '', maxGas = 0;
	for (const [id, n] of gasC) if (n > maxGas) { maxGas = n; pasrahId = id; }

	let topId = '', maxSwipes = 0;
	for (const [id, n] of swipeC) if (n > maxSwipes) { maxSwipes = n; topId = id; }

	return {
		siPalingRewel: rewelId ? { player: room.players.get(rewelId)!, skipCount: maxSkips } : null,
		siPalingPasrah: pasrahId ? { player: room.players.get(pasrahId)!, gasCount: maxGas } : null,
		pelakuVeto: [...vetoers].map(id => room.players.get(id)).filter((p): p is Player => !!p),
		topSwiper: topId ? { player: room.players.get(topId)!, swipeCount: maxSwipes } : null
	};
}

function resolveGame(room: Room, isMatch = false) {
	if (room.phase === 'result') return;
	stopTimer(room);
	room.phase = 'result';

	const scores = calcScores(room).sort((a, b) => b.totalScore - a.totalScore);
	const top3 = scores.filter(s => !s.isVetoed).slice(0, 3);
	const winner = isMatch
		? (scores.find(s => !s.isVetoed && s.gasPercentage === 100) ?? top3[0] ?? null)
		: (top3[0] ?? null);

	const result: GameResult = {
		topPlaces: top3,
		winner,
		isMatch,
		dramaStats: calcDrama(room),
		totalPlayers: room.players.size,
		timestamp: Date.now()
	};

	broadcastAll(room, { type: 'GAME_OVER', result });
}

function checkMatch(room: Room) {
	const total = room.players.size;
	for (const place of room.places) {
		const pa = room.actions.filter(a => a.placeId === place.id);
		if (pa.some(a => a.action === 'veto')) continue;
		if (pa.filter(a => a.action === 'gas').length >= total) {
			resolveGame(room, true);
			return;
		}
	}
}

function startTimer(room: Room) {
	stopTimer(room);
	room.timerHandle = setInterval(() => {
		room.timeLeft--;
		broadcastAll(room, { type: 'TIMER_TICK', timeLeft: room.timeLeft });
		if (room.timeLeft <= 0) resolveGame(room, false);
	}, 1000);
}

function stopTimer(room: Room) {
	if (room.timerHandle) { clearInterval(room.timerHandle); room.timerHandle = null; }
}

// ── Main connection handler (called by Vite WS plugin) ────────

export function handleConnection(ws: WebSocket, roomCode: string) {
	let myPlayerId = '';
	let myRoom: Room | null = null;

	ws.on('message', (raw: Buffer) => {
		let msg: Record<string, unknown>;
		try { msg = JSON.parse(raw.toString()); }
		catch { return; }

		const type = msg.type as string;

		// ── JOIN ─────────────────────────────────────────────
		if (type === 'JOIN') {
			const { playerId, name, avatar, isHost } = msg as {
				playerId: string; name: string; avatar: string; isHost: boolean;
			};
			myPlayerId = playerId;

			let room = rooms.get(roomCode);
			if (!room) {
				if (!isHost) {
					send(ws, { type: 'ERROR', message: 'Room tidak ditemukan. Minta host bikin room dulu.' });
					return;
				}
				room = {
					code: roomCode, hostId: playerId, phase: 'lobby',
					players: new Map(), sockets: new Map(),
					places: [], actions: [], timerHandle: null, timeLeft: 45
				};
				rooms.set(roomCode, room);
			}

			myRoom = room;
			const player: Player = {
				id: playerId, name, avatar,
				isHost: room.hostId === playerId,
				joinedAt: Date.now(), swipedCount: 0
			};
			room.players.set(playerId, player);
			room.sockets.set(playerId, ws);

			// Send full state to newcomer
			send(ws, {
				type: 'ROOM_STATE',
				players: [...room.players.values()],
				phase: room.phase,
				roomCode
			});

			// If game already running, send current places
			if (room.phase === 'playing' && room.places.length > 0) {
				send(ws, { type: 'GAME_START', places: room.places });
			}

			// Notify existing players
			broadcast(room, { type: 'PLAYER_JOIN', player }, playerId);
			return;
		}

		if (!myRoom || !myPlayerId) return;
		const room = myRoom;

		// ── GAME_START ────────────────────────────────────────
		if (type === 'GAME_START') {
			if (room.hostId !== myPlayerId) return;
			const places = msg.places as Place[];
			room.places = places;
			room.actions = [];
			room.phase = 'playing';
			room.timeLeft = 45;
			broadcastAll(room, { type: 'GAME_START', places });
			startTimer(room);
			return;
		}

		// ── PLAYER_ACTION ─────────────────────────────────────
		if (type === 'PLAYER_ACTION') {
			const action = msg.action as PlayerAction;
			const exists = room.actions.find(
				a => a.playerId === action.playerId && a.placeId === action.placeId
			);
			if (exists) return;

			const p = room.players.get(action.playerId);
			if (p) { p.swipedCount++; room.players.set(action.playerId, p); }

			room.actions.push(action);
			broadcastAll(room, { type: 'PLAYER_ACTION', action });
			checkMatch(room);

			// Check if all players done all cards
			const allDone = room.places.length > 0 && [...room.players.keys()].every(pid => {
				return room.actions.filter(a => a.playerId === pid).length >= room.places.length;
			});
			if (allDone) setTimeout(() => resolveGame(room, false), 1500);
			return;
		}
	});

	ws.on('close', () => {
		if (!myRoom || !myPlayerId) return;
		const room = myRoom;
		room.sockets.delete(myPlayerId);
		room.players.delete(myPlayerId);
		broadcast(room, { type: 'PLAYER_LEAVE', playerId: myPlayerId });

		// Clean up empty rooms
		if (room.sockets.size === 0) {
			setTimeout(() => {
				if (rooms.get(room.code)?.sockets.size === 0) {
					stopTimer(room);
					rooms.delete(room.code);
				}
			}, 60000); // keep room for 1 min in case everyone's reconnecting
		}
	});

	ws.on('error', () => ws.close());
}
