// ============================================================
// realtimeRoom.svelte.ts
// Client-side WebSocket state manager — Svelte 5 Runes
// Connects to /ws/[CODE] on the same server. No external deps.
// ============================================================

import type { Place } from './mockPlaces';

// Re-export server types for use in components
export type { Player as PlayerPresence, GameResult, PlaceScore, DramaStats, PlayerAction } from './server/roomServer';
import type { Player as PlayerPresence, GameResult, PlaceScore, ServerMsg } from './server/roomServer';

export type SwipeAction = 'gas' | 'skip' | 'veto';
export type GamePhase = 'lobby' | 'playing' | 'result';

// ── Room State (Svelte 5 Runes) ───────────────────────────────

export class RoomState {
	// Identity
	roomCode = $state('');
	me = $state<PlayerPresence | null>(null);
	isHost = $state(false);

	// Connection
	ws = $state<WebSocket | null>(null);
	connected = $state(false);
	error = $state<string | null>(null);

	// Lobby
	players = $state<Map<string, PlayerPresence>>(new Map());

	// Game
	phase = $state<GamePhase>('lobby');
	places = $state<Place[]>([]);
	currentCardIndex = $state(0);
	actions = $state<import('./server/roomServer').PlayerAction[]>([]);
	timeLeft = $state(45);
	vetoUsed = $state(false);
	myActions = $state<Map<string, SwipeAction>>(new Map());

	// Result
	gameResult = $state<GameResult | null>(null);

	// ── Derived ───────────────────────────────────────────────

	playerList = $derived(Array.from(this.players.values()));
	currentPlace = $derived(this.places[this.currentCardIndex] ?? null);
	isDone = $derived(this.currentCardIndex >= this.places.length && this.places.length > 0);
	allPlayersCount = $derived(this.players.size);

	placeScores = $derived((): PlaceScore[] => {
		const total = this.players.size || 1;
		return this.places.map((place) => {
			const pa = this.actions.filter((a) => a.placeId === place.id);
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
	});

	// ── Identity helpers ──────────────────────────────────────

	loadIdentity(): { id: string; name: string; avatar: string } | null {
		if (typeof window === 'undefined') return null;
		try {
			const raw = localStorage.getItem('terserah_identity');
			return raw ? JSON.parse(raw) : null;
		} catch { return null; }
	}

	saveIdentity(id: string, name: string, avatar: string) {
		if (typeof window === 'undefined') return;
		localStorage.setItem('terserah_identity', JSON.stringify({ id, name, avatar }));
	}

	generateRoomCode(): string {
		const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
		return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
	}

	getOrCreatePlayerId(): string {
		if (typeof window === 'undefined') return '';
		let pid = localStorage.getItem('terserah_pid');
		if (!pid) { pid = crypto.randomUUID(); localStorage.setItem('terserah_pid', pid); }
		return pid;
	}

	// ── Connect to WebSocket server ───────────────────────────

	connect(roomCode: string, name: string, avatar: string, isHost: boolean): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.ws) { this.ws.close(); this.ws = null; }

			const pid = this.getOrCreatePlayerId();
			this.saveIdentity(pid, name, avatar);
			this.roomCode = roomCode.toUpperCase();
			this.isHost = isHost;
			this.error = null;

			// Build WS URL — same host, /ws/[CODE]
			const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
			const wsUrl = `${protocol}//${location.host}/ws/${this.roomCode}`;
			const socket = new WebSocket(wsUrl);

			const timeout = setTimeout(() => {
				socket.close();
				reject(new Error('Koneksi timeout. Pastikan server jalan dan kode room benar.'));
			}, 8000);

			socket.onopen = () => {
				clearTimeout(timeout);
				// Send JOIN immediately
				socket.send(JSON.stringify({
					type: 'JOIN',
					playerId: pid,
					name,
					avatar,
					isHost
				}));
			};

			socket.onmessage = (event) => {
				let msg: ServerMsg;
				try { msg = JSON.parse(event.data); }
				catch { return; }

				this.handleMessage(msg);

				// Resolve the connect promise on first ROOM_STATE
				if (msg.type === 'ROOM_STATE') resolve();
			};

			socket.onclose = () => {
				this.connected = false;
				this.ws = null;
			};

			socket.onerror = () => {
				clearTimeout(timeout);
				this.connected = false;
				reject(new Error('WebSocket error. Server tidak bisa diakses.'));
			};

			this.ws = socket;
		});
	}

	// ── Handle incoming server messages ──────────────────────

	private handleMessage(msg: ServerMsg) {
		switch (msg.type) {
			case 'ROOM_STATE': {
				const newMap = new Map<string, PlayerPresence>();
				for (const p of msg.players) newMap.set(p.id, { ...p, justSwiped: false });
				this.players = newMap;
				this.phase = msg.phase as GamePhase;
				this.connected = true;
				// Set self
				const pid = this.getOrCreatePlayerId();
				this.me = this.players.get(pid) ?? null;
				break;
			}

			case 'PLAYER_JOIN': {
				const updated = new Map(this.players);
				updated.set(msg.player.id, { ...msg.player, justSwiped: false });
				this.players = updated;
				break;
			}

			case 'PLAYER_LEAVE': {
				const updated = new Map(this.players);
				updated.delete(msg.playerId);
				this.players = updated;
				break;
			}

			case 'GAME_START': {
				this.places = msg.places;
				this.phase = 'playing';
				this.currentCardIndex = 0;
				this.actions = [];
				this.timeLeft = 45;
				this.vetoUsed = false;
				this.myActions = new Map();
				break;
			}

			case 'PLAYER_ACTION': {
				const a = msg.action;
				const exists = this.actions.find(
					x => x.playerId === a.playerId && x.placeId === a.placeId
				);
				if (!exists) this.actions = [...this.actions, a];

				// Bounce animation for the player
				const updated = new Map(this.players);
				const p = updated.get(a.playerId);
				if (p) {
					updated.set(a.playerId, { ...p, justSwiped: true, swipedCount: p.swipedCount + 1 });
					this.players = updated;
					setTimeout(() => {
						const p2 = new Map(this.players);
						const pl = p2.get(a.playerId);
						if (pl) p2.set(a.playerId, { ...pl, justSwiped: false });
						this.players = p2;
					}, 600);
				}
				break;
			}

			case 'TIMER_TICK': {
				this.timeLeft = msg.timeLeft;
				break;
			}

			case 'GAME_OVER': {
				this.gameResult = msg.result;
				this.phase = 'result';
				break;
			}

			case 'ERROR': {
				this.error = msg.message;
				break;
			}
		}
	}

	// ── Create room (host) ────────────────────────────────────

	async createRoom(name: string, avatar: string): Promise<string> {
		const code = this.generateRoomCode();
		await this.connect(code, name, avatar, true);
		return code;
	}

	// ── Join room (guest) ─────────────────────────────────────

	async joinRoom(code: string, name: string, avatar: string): Promise<void> {
		await this.connect(code.toUpperCase(), name, avatar, false);
	}

	// ── Send game start (host) ────────────────────────────────

	sendGameStart(places: Place[]) {
		this.send({ type: 'GAME_START', places });
	}

	// ── Swipe action ──────────────────────────────────────────

	swipe(action: SwipeAction) {
		if (!this.me || !this.currentPlace) return;
		if (this.myActions.has(this.currentPlace.id)) return;
		if (action === 'veto' && this.vetoUsed) return;
		if (action === 'veto') this.vetoUsed = true;

		const pid = this.me.id;
		const event = {
			playerId: pid,
			playerName: this.me.name,
			playerAvatar: this.me.avatar,
			placeId: this.currentPlace.id,
			action,
			timestamp: Date.now()
		};

		// Optimistic local update
		this.actions = [...this.actions, event];
		const newMyActions = new Map(this.myActions);
		newMyActions.set(this.currentPlace.id, action);
		this.myActions = newMyActions;

		// Advance card
		this.currentCardIndex++;

		// Send to server
		this.send({ type: 'PLAYER_ACTION', action: event });

		// If done all cards, tell server
		if (this.currentCardIndex >= this.places.length) {
			this.send({ type: 'ALL_DONE' } as unknown as Parameters<typeof this.send>[0]);
		}
	}

	// ── Send raw message ──────────────────────────────────────

	private send(msg: object) {
		if (this.ws?.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(msg));
		}
	}

	// ── Reconnect ─────────────────────────────────────────────

	async reconnect() {
		const saved = this.loadIdentity();
		if (!saved || !this.roomCode) return;
		try {
			await this.connect(this.roomCode, saved.name, saved.avatar, this.isHost);
		} catch {
			// ignore reconnect errors silently
		}
	}

	// ── Cleanup ───────────────────────────────────────────────

	disconnect() {
		if (this.ws) { this.ws.close(); this.ws = null; }
		this.connected = false;
	}

	resetForNewGame() {
		this.phase = 'lobby';
		this.gameResult = null;
		this.places = [];
		this.actions = [];
		this.currentCardIndex = 0;
		this.timeLeft = 45;
		this.vetoUsed = false;
		this.myActions = new Map();
	}
}

export const room = new RoomState();
