# 🎰 TERSERAH! — Tongkrongan Decision Roulette

> *"Ga tau mau makan dimana? Swipe aja bareng!"*

Aplikasi web real-time **database-less** buat nentuin makan/nongkrong dimana bareng temen, pake mekanisme swipe kartu ala Tinder.

---

## 🚀 Setup & Jalanin

### 1. Clone & Install
```bash
cd terserah-app
npm install
```

### 2. Setup Supabase (WAJIB untuk multiplayer)
1. Buat project gratis di [supabase.com](https://supabase.com)
2. Di dashboard project → **Settings → API**
3. Copy `Project URL` dan `anon public key`
4. Copy `.env.example` jadi `.env` dan isi:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Note:** Anon key aman di-expose ke client — ini memang design Supabase untuk public access.

### 3. Aktifkan Realtime di Supabase
Di Supabase Dashboard → **Database → Replication** → Aktifkan **Realtime** (atau di **Settings → Realtime**).

### 4. Run Dev Server
```bash
npm run dev
```

Buka `http://localhost:5173`

---

## 🏗️ Arsitektur

```
terserah-app/
├── src/
│   ├── lib/
│   │   ├── realtimeRoom.svelte.ts   # 🧠 Core state (Svelte 5 Runes + Supabase Realtime)
│   │   ├── mockPlaces.ts            # 🍜 12 mock places + Overpass API helper
│   │   └── components/
│   │       ├── SwipeCard.svelte     # 🃏 Swipe kartu (spring physics)
│   │       ├── ReceiptResult.svelte # 🧾 Struk kasir estetik + download PNG
│   │       ├── PlayerAvatars.svelte # 👥 Live player avatars
│   │       └── QRCode.svelte        # 📱 QR Code generator
│   └── routes/
│       ├── +page.svelte             # 🏠 Home (Identity + Create/Join room)
│       └── room/[code]/
│           └── +page.svelte         # 🎮 Game arena (Lobby + Playing + Result)
```

## 🎯 Tech Stack

| Layer | Tech |
|---|---|
| Framework | SvelteKit + Svelte 5 Runes |
| Styling | Tailwind CSS (Neo-Brutalism) |
| Realtime | Supabase Realtime (Presence + Broadcast) |
| Animasi | `svelte/motion` spring |
| Data | Mock JSON (Demo) / Overpass API (GPS) |
| Export | `html-to-image` → PNG |
| QR Code | `qrcode` library |
| Database | ❌ NONE — 100% ephemeral in-memory |

## 🎮 Alur Game

1. **Host** buat room → dapat 6-char code + QR code
2. **Temen** scan QR atau ketik kode untuk join
3. Host pilih mode (**Demo** atau **GPS**) lalu tekan **Mulai!**
4. Semua dapat 10 kartu tempat makan yang sama
5. **Swipe kanan** = ⚡ GAS!, **Swipe kiri** = ⏭️ Skip, **Tombol VETO** = 🚫 coret (1x/pemain)
6. Kalau semua setuju → **IT'S A MATCH!** langsung muncul
7. Waktu habis → Top 3 ditampilkan sebagai **Struk Kasir Estetik**
8. Download PNG untuk di-share ke grup IG / WA!

## 🌐 Deploy ke Vercel

```bash
npm run build
npx vercel --prod
```

Atau connect repo ke [vercel.com](https://vercel.com), set env vars di dashboard, auto-deploy.

---

Made with ❤️ · No database needed · Just vibes
