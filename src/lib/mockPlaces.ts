// ============================================================
// mockPlaces.ts — 12 Tempat Nongkrong/Kuliner Hits (Demo Mode)
// ============================================================

export interface Place {
	id: string;
	name: string;
	category: string;
	emoji: string;
	priceRange: '💸' | '💸💸' | '💸💸💸';
	estimatedPrice: string;
	vibe: string;
	address: string;
	tags: string[];
	rating: number;
	lat?: number;
	lon?: number;
}

export const MOCK_PLACES: Place[] = [
	{
		id: 'mock-1',
		name: 'Warung Cobek Pak Joko',
		category: 'Warteg / Nasi Campur',
		emoji: '🍛',
		priceRange: '💸',
		estimatedPrice: 'Rp 15.000 – 25.000',
		vibe: 'Warung vibes, nasi panas, lauk pilihan. Klasik ga ada matinya.',
		address: 'Gang Belakang Kampus No. 7',
		tags: ['#murah', '#mengenyangkan', '#casual'],
		rating: 4.7
	},
	{
		id: 'mock-2',
		name: 'Kopi Klotok Instagramable',
		category: 'Kafe / Coffee Shop',
		emoji: '☕',
		priceRange: '💸💸',
		estimatedPrice: 'Rp 25.000 – 60.000',
		vibe: 'Aesthetic outdoor, WiFi kenceng, cocok buat nongkrong lama atau nugas.',
		address: 'Jl. Seniman No. 42',
		tags: ['#aesthetic', '#wifi', '#kopi', '#instagramable'],
		rating: 4.5
	},
	{
		id: 'mock-3',
		name: 'Pecel Lele Bu Darmi',
		category: 'Lesehan / Seafood',
		emoji: '🐟',
		priceRange: '💸',
		estimatedPrice: 'Rp 18.000 – 30.000',
		vibe: 'Lesehan pinggir jalan, lele crispy sambal ijo, nongkrong ampe malem.',
		address: 'Jl. Pahlawan Ruko C-12',
		tags: ['#lesehan', '#sambalijo', '#lele'],
		rating: 4.6
	},
	{
		id: 'mock-4',
		name: 'Burger Brewok Underground',
		category: 'Burger / Western',
		emoji: '🍔',
		priceRange: '💸💸',
		estimatedPrice: 'Rp 35.000 – 75.000',
		vibe: 'Burger smash patty gedhe banget. Industrial vibes, music keras, buat yang mau kenyang maksimal.',
		address: 'Food Hall Lantai B1',
		tags: ['#burger', '#smashpatty', '#industrial'],
		rating: 4.8
	},
	{
		id: 'mock-5',
		name: 'Mie Ayam Mas Bro',
		category: 'Mie / Bakso',
		emoji: '🍜',
		priceRange: '💸',
		estimatedPrice: 'Rp 15.000 – 20.000',
		vibe: 'Mie ayam jamur pangsit, kuah encer, porsi besar. Queue panjang tapi worth it.',
		address: 'Pasar Lama Blok D No. 5',
		tags: ['#mieayam', '#pangsit', '#murahmeriah'],
		rating: 4.9
	},
	{
		id: 'mock-6',
		name: 'Sate Kambing H. Yanto',
		category: 'Sate / Grill',
		emoji: '🍢',
		priceRange: '💸💸',
		estimatedPrice: 'Rp 40.000 – 80.000',
		vibe: 'Sate kambing muda empuk, lontong kupat, bumbu kacang homemade. Legend sejak 1987.',
		address: 'Jl. Merdeka Barat No. 88',
		tags: ['#sate', '#kambing', '#legend'],
		rating: 4.7
	},
	{
		id: 'mock-7',
		name: 'Hotpot & BBQ Bareng',
		category: 'Hotpot / BBQ',
		emoji: '🫕',
		priceRange: '💸💸💸',
		estimatedPrice: 'Rp 80.000 – 150.000 / pax',
		vibe: 'All you can eat hotpot + BBQ. Cocok buat rame-rame, ada minuman unlimited.',
		address: 'Mall Sudirman Lt. 3',
		tags: ['#ayce', '#hotpot', '#bbq', '#rame'],
		rating: 4.3
	},
	{
		id: 'mock-8',
		name: 'Pisang Goreng Crispy Viral',
		category: 'Jajanan / Snack',
		emoji: '🍌',
		priceRange: '💸',
		estimatedPrice: 'Rp 10.000 – 25.000',
		vibe: 'Jajanan viral TikTok. Pisang goreng salted caramel, cheese, oreo. Queue 30 menit tapi pada rela.',
		address: 'Jl. Gajahmada No. 15',
		tags: ['#viral', '#jajanan', '#saltedcaramel'],
		rating: 4.4
	},
	{
		id: 'mock-9',
		name: 'Nasi Goreng Kambing Kebon Sirih',
		category: 'Nasi Goreng',
		emoji: '🍳',
		priceRange: '💸💸',
		estimatedPrice: 'Rp 35.000 – 55.000',
		vibe: 'Nasi goreng kambing otentik, arang beneran, buka dari jam 9 malem. Must-try legend Jakpus.',
		address: 'Jl. Kebon Sirih Raya No. 31',
		tags: ['#nasgor', '#kambing', '#latenight', '#arang'],
		rating: 4.8
	},
	{
		id: 'mock-10',
		name: 'Ramen Jepang Authentik',
		category: 'Japanese / Ramen',
		emoji: '🍥',
		priceRange: '💸💸💸',
		estimatedPrice: 'Rp 70.000 – 130.000',
		vibe: 'Tonkotsu 18 jam, chashu meleleh, telur ajitsuke. Dark aesthetic, cocok buat date.',
		address: 'Jl. Senopati No. 22B',
		tags: ['#ramen', '#tonkotsu', '#japanese', '#date'],
		rating: 4.6
	},
	{
		id: 'mock-11',
		name: 'Martabak Manis Spesial',
		category: 'Martabak / Terang Bulan',
		emoji: '🥞',
		priceRange: '💸',
		estimatedPrice: 'Rp 25.000 – 50.000',
		vibe: 'Martabak tebal, topping overload: nutella, keju, greentea, red velvet. Buat yang demen manis.',
		address: 'Depan Alfamart Jl. Pemuda',
		tags: ['#martabak', '#manis', '#topping', '#malam'],
		rating: 4.5
	},
	{
		id: 'mock-12',
		name: 'Warung Aceh Ceu Icih',
		category: 'Masakan Aceh',
		emoji: '🌶️',
		priceRange: '💸',
		estimatedPrice: 'Rp 20.000 – 45.000',
		vibe: 'Mie Aceh asli, kuah gulai pedas nendang, es teh tawar segelas gratis. Autentik abis.',
		address: 'Komplek Ruko Blok B No. 9',
		tags: ['#mieaceh', '#pedas', '#autentik', '#gulai'],
		rating: 4.7
	}
];

// ============================================================
// Overpass API — Fetch real places from OpenStreetMap
// ============================================================

export interface OverpassPlace extends Place {
	osmId: number;
}

/**
 * Fetches nearby restaurants/cafes from OpenStreetMap via Overpass API.
 * @param lat - Latitude of center point
 * @param lon - Longitude of center point  
 * @param radiusMeters - Search radius in meters (default 1000m)
 */
export async function fetchOverpassPlaces(
	lat: number,
	lon: number,
	radiusMeters = 1000
): Promise<Place[]> {
	const query = `
		[out:json][timeout:10];
		(
			node["amenity"~"restaurant|cafe|fast_food|bar|food_court"](around:${radiusMeters},${lat},${lon});
			way["amenity"~"restaurant|cafe|fast_food|bar|food_court"](around:${radiusMeters},${lat},${lon});
		);
		out center 20;
	`;

	const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

	const res = await fetch(url);
	if (!res.ok) throw new Error('Overpass API gagal: ' + res.status);

	const data = await res.json();

	// Map OSM elements to Place interface
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return data.elements.slice(0, 12).map((el: any, i: number) => {
		const tags = el.tags ?? {};
		const amenity = tags.amenity ?? 'restaurant';
		const name = tags.name ?? tags['name:id'] ?? `Tempat ${i + 1}`;
		const lat = el.lat ?? el.center?.lat;
		const lon = el.lon ?? el.center?.lon;

		const emojiMap: Record<string, string> = {
			restaurant: '🍽️',
			cafe: '☕',
			fast_food: '🍟',
			bar: '🍻',
			food_court: '🏪'
		};

		const categoryMap: Record<string, string> = {
			restaurant: 'Restoran',
			cafe: 'Kafe',
			fast_food: 'Fast Food',
			bar: 'Bar / Warung Kopi',
			food_court: 'Food Court'
		};

		return {
			id: `osm-${el.id}`,
			name,
			category: categoryMap[amenity] ?? 'Makanan',
			emoji: emojiMap[amenity] ?? '🍴',
			priceRange: '💸💸' as const,
			estimatedPrice: tags['price_range'] ?? 'Harga bervariasi',
			vibe: [
				tags.cuisine ? `Masakan: ${tags.cuisine}` : '',
				tags.opening_hours ? `Jam buka: ${tags.opening_hours}` : '',
				tags.phone ? `Tel: ${tags.phone}` : ''
			]
				.filter(Boolean)
				.join(' · ') || 'Ditemukan di sekitar lokasi kamu.',
			address: [tags['addr:street'], tags['addr:housenumber'], tags['addr:city']]
				.filter(Boolean)
				.join(' ') || 'Lihat di peta',
			tags: ['#osm', `#${amenity}`],
			rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
			lat,
			lon
		} satisfies Place;
	});
}

/** Shuffle & pick N places from an array */
export function pickRandom<T>(arr: T[], n: number): T[] {
	return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}
