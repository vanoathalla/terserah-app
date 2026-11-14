# 🎰 TERSERAH! — Tongkrongan Decision Roulette

> *"Ga tau mau makan dimana? Swipe aja bareng!"*

Real-time multiplayer web app buat nentuin makan/nongkrong dimana bareng temen tongkrongan. Swipe kartu ala Tinder, semua orang vote bareng secara live, hasilnya jadi struk kasir estetik lengkap dengan drama statistik dan rute Google Maps.

🌐 **Live Demo:** [terserah-app-production.up.railway.app](https://terserah-app-production.up.railway.app/)

**Zero database. Zero external services. Pure WebSocket.**

---

## ✨ Fitur Utama

- ⚡ **Realtime Multiplayer Sync**: Bikin room instan, scan QR code atau share link 6-karakter untuk join dari HP masing-masing.
- 🃏 **Tinder-Style Swipe Mechanics**: Geser kanan (⚡ GAS!) atau kiri (🚫 SKIP) dengan animasi spring physics yang halus.
- 🚫 **1x Veto Card**: Setiap pemain punya hak veto 1 kali untuk langsung mencoret tempat yang paling dihindari.
- 🗺️ **Open Maps & GPS Mode**: Ambil rekomendasi kuliner/kafe riil di sekitar lokasi kamu via OpenStreetMap (Nominatim & Overpass) atau pilih kota terdekat (Jakarta, Bandung, Jogja, Surabaya, Bali, dll).
- 📍 **Direct Navigation**: Tombol instan langsung menuju rute Google Maps & OpenStreetMap untuk tempat pemenang dan top choices.
- 🧾 **Struk Kasir Estetik (Thermal Receipt)**: Hasil voting direkap dalam format struk kasir retro yang bisa langsung di-download jadi gambar PNG kualitas HD untuk share ke Instagram Story.
- 🎭 **Drama Statistik**: Menampilkan badge unik setelah game selesai:
  - 😤 *Si Paling Rewel* (terbanyak skip)
  - 🫡 *Si Paling Pasrah* (terbanyak gas)
  - ⚡ *Swiper Terkenceng* (swipe tercepat)
  - 🚫 *Pelaku Veto* (siapa yang mencoret tempat)
- 🔄 **Room Reset Sync**: Host bisa klik *Main Lagi* dan semua pemain di room otomatis kembali ke lobby bersama-sama.

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Jalankan dev server (local only)
npm run dev
```

Buka `http://localhost:5173`

**Multiplayer di satu WiFi (LAN):**
```bash
npm run dev -- --host
# Bagikan URL Network ke teman, misal: http://192.168.1.x:5173
```

---

## 🏗️ Build & Production

```bash
# Build SvelteKit bundle + compile WebSocket server
npm run build

# Start production server
node server.js
```

---

## 🚂 Deploy ke Railway

1. Push repo ke GitHub: `https://github.com/vanoathalla/terserah-app`
2. Buka [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
3. Pilih repository `terserah-app`
4. Railway otomatis mendeteksi `nixpacks.toml` → build & start server
5. Generate domain publik (misal: `https://terserah-app-production.up.railway.app/`)
6. Setiap commit baru yang di-push ke branch `main` akan otomatis memicu deploy ulang (CI/CD) 🎉

---

## 🏗️ Arsitektur

```
terserah-app/
├── src/
│   ├── lib/
│   │   ├── realtimeRoom.svelte.ts   # Client WS state (Svelte 5 Runes)
│   │   ├── mockPlaces.ts            # Curated mock places + OpenStreetMap engines + Map URLs
│   │   ├── components/
│   │   │   ├── SwipeCard.svelte     # Interactive Tinder-like swipe card
│   │   │   ├── ReceiptResult.svelte # Aesthetic thermal receipt with Google Maps link
│   │   │   ├── PlayerAvatars.svelte # Real-time player indicators & animations
│   │   │   └── QRCode.svelte        # Dynamic QR generator for quick room joining
│   │   └── server/
│   │       ├── roomServer.ts        # In-memory game logic & WS handling (server-only)
│   │       └── wsPlugin.ts          # Vite dev WebSocket plugin
│   └── routes/
│       ├── +page.svelte             # Home / Identity & Join lobby
│       └── room/[code]/+page.svelte # Main Arena (Lobby, Playing, Result)
├── server.js                        # Production entry point (Node HTTP + WebSocket)
├── scripts/build-ws.js              # Compiles roomServer.ts → build/ws-server.js
└── nixpacks.toml                    # Railway production build configuration
```

## 🛠️ Tech Stack

| Komponen | Teknologi |
|---|---|
| **Framework** | SvelteKit + Svelte 5 (Runes) |
| **Styling** | Tailwind CSS (Neo-Brutalism Design) |
| **Realtime Engine** | Native WebSocket (`ws`) — zero database, 100% in-memory ephemeral |
| **Animasi** | `svelte/motion` spring physics |
| **Peta & Lokasi** | OpenStreetMap (Nominatim API & Overpass) + Google Maps Navigation |
| **Export Struk** | `html-to-image` → PNG HD |
| **Deployment** | Railway + Nixpacks (Node.js 22) |
