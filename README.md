# 🎰 TERSERAH! — Tongkrongan Decision Roulette

> *"Ga tau mau makan dimana? Swipe aja bareng!"*

Real-time multiplayer web app buat nentuin makan/nongkrong dimana bareng temen. Swipe kartu ala Tinder, semua orang vote bareng, hasilnya jadi struk kasir estetik.

**Zero database. Zero external services. Pure WebSocket.**

---

## 🚀 Local Development

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`

**Multiplayer di satu WiFi:**
```bash
npm run dev -- --host
# Share alamat Network: ke temen, e.g. http://192.168.1.x:5173
```

---

## 🏗️ Build & Production

```bash
npm run build   # builds SvelteKit + compiles ws-server
node server.js  # start production server
```

---

## 🚂 Deploy ke Railway (Recommended)

1. Push repo ke GitHub
2. Buka [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
3. Pilih `terserah-app`
4. Railway otomatis deteksi `nixpacks.toml` → build & start
5. Klik **Generate Domain** → dapat URL public
6. Share ke temen, langsung bisa join dari HP masing-masing 🎉

---

## 🏗️ Arsitektur

```
terserah-app/
├── src/
│   ├── lib/
│   │   ├── realtimeRoom.svelte.ts   # Client WS state (Svelte 5 Runes)
│   │   ├── mockPlaces.ts            # 12 mock places + Overpass API
│   │   └── server/
│   │       ├── roomServer.ts        # In-memory game logic (server-only)
│   │       └── wsPlugin.ts          # Vite dev WS plugin
│   └── routes/
│       ├── +page.svelte             # Home
│       └── room/[code]/+page.svelte # Game arena
├── server.js                        # Production entry (Node HTTP + WS)
├── scripts/build-ws.js              # Compiles roomServer.ts → build/ws-server.js
└── nixpacks.toml                    # Railway build config
```

## Tech Stack

| | |
|---|---|
| Framework | SvelteKit + Svelte 5 Runes |
| Styling | Tailwind CSS (Neo-Brutalism) |
| Realtime | Native WebSocket (`ws`) — no Supabase |
| Animasi | `svelte/motion` spring physics |
| Data | Mock JSON (Demo) / Overpass API (GPS) |
| Export | `html-to-image` → PNG |
| Database | ❌ None — 100% ephemeral in-memory |
