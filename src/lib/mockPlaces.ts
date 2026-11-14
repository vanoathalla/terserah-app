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
// Map URL Helpers — Google Maps & OpenStreetMap
// ============================================================

/**
 * Returns a universal navigation link (Google Maps) for a place.
 * Works seamlessly on Android, iOS (opens native map app), and desktop browsers.
 */
export function getMapUrl(place: Place): string {
	if (place.lat && place.lon) {
		return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`;
	}
	const q = encodeURIComponent(`${place.name} ${place.address && place.address !== 'Lihat di peta' ? place.address : ''}`.trim());
	return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/**
 * Returns an OpenStreetMap link for a place.
 */
export function getOsmUrl(place: Place): string {
	if (place.lat && place.lon) {
		return `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=17/${place.lat}/${place.lon}`;
	}
	const q = encodeURIComponent(`${place.name} ${place.address && place.address !== 'Lihat di peta' ? place.address : ''}`.trim());
	return `https://www.openstreetmap.org/search?query=${q}`;
}

// ============================================================
// OpenStreetMap API — Multi-engine (Nominatim + Overpass)
// ============================================================

export interface OverpassPlace extends Place {
	osmId: number;
}

const EMOJI_MAP: Record<string, string> = {
	restaurant: '🍽️',
	cafe: '☕',
	fast_food: '🍟',
	bar: '🍻',
	food_court: '🏪',
	pub: '🍺',
	bakery: '🥐'
};

const CATEGORY_MAP: Record<string, string> = {
	restaurant: 'Restoran / Rumah Makan',
	cafe: 'Kafe / Coffee Shop',
	fast_food: 'Fast Food',
	bar: 'Bar / Nongkrong',
	food_court: 'Food Court / Pujasera',
	bakery: 'Bakery / Roti'
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapNominatimItem(el: any, i: number): Place {
	const name = el.name || (el.display_name ? el.display_name.split(',')[0] : `Tempat Makan ${i + 1}`);
	const lat = parseFloat(el.lat);
	const lon = parseFloat(el.lon);
	const amenity = el.type || 'restaurant';

	const addrParts = el.address
		? [el.address.road, el.address.suburb || el.address.neighbourhood, el.address.city || el.address.town || el.address.city_district]
				.filter(Boolean)
		: [];
	const address = addrParts.length > 0
		? addrParts.join(', ')
		: (el.display_name ? el.display_name.split(',').slice(1, 4).join(',').trim() : 'Lihat di peta');

	const priceRanges: ('💸' | '💸💸' | '💸💸💸')[] = ['💸', '💸💸', '💸💸', '💸💸💸'];
	const priceRange = priceRanges[i % priceRanges.length];

	return {
		id: `osm-${el.place_id || el.osm_id || i}`,
		name,
		category: CATEGORY_MAP[amenity] ?? 'Kuliner Lokal',
		emoji: EMOJI_MAP[amenity] ?? '🍴',
		priceRange,
		estimatedPrice: priceRange === '💸' ? 'Rp 15.000 – 30.000' : priceRange === '💸💸' ? 'Rp 30.000 – 75.000' : 'Rp 75.000+',
		vibe: `Tempat nyata OpenStreetMap di sekitar ${addrParts[1] || addrParts[0] || 'lokasi kamu'}.`,
		address: address || 'Buka di peta untuk rute lengkap',
		tags: ['#OpenStreetMap', `#${amenity}`, '#kuliner'],
		rating: parseFloat((4.2 + (i % 6) * 0.1).toFixed(1)),
		lat: isNaN(lat) ? undefined : lat,
		lon: isNaN(lon) ? undefined : lon
	};
}

/**
 * Fetch nearby places using OpenStreetMap Nominatim.
 * Fast, reliable, high-availability worldwide.
 */
export async function fetchNominatimNearby(
	lat: number,
	lon: number,
	radiusMeters = 1500
): Promise<Place[]> {
	const delta = (radiusMeters / 111320) * 1.2;
	const viewbox = `${lon - delta},${lat + delta},${lon + delta},${lat - delta}`;
	
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 6000);

	try {
		const [resResto, resCafe] = await Promise.allSettled([
			fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&bounded=1&viewbox=${viewbox}&amenity=restaurant&limit=8`, {
				signal: controller.signal,
				headers: { 'Accept': 'application/json' }
			}),
			fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&bounded=1&viewbox=${viewbox}&amenity=cafe&limit=6`, {
				signal: controller.signal,
				headers: { 'Accept': 'application/json' }
			})
		]);
		clearTimeout(timer);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rawItems: any[] = [];
		if (resResto.status === 'fulfilled' && resResto.value.ok) {
			const d = await resResto.value.json();
			if (Array.isArray(d)) rawItems.push(...d);
		}
		if (resCafe.status === 'fulfilled' && resCafe.value.ok) {
			const d = await resCafe.value.json();
			if (Array.isArray(d)) rawItems.push(...d);
		}

		// Deduplicate by name
		const seen = new Set<string>();
		const unique = rawItems.filter(item => {
			const n = (item.name || item.display_name?.split(',')[0] || '').toLowerCase().trim();
			if (!n || seen.has(n)) return false;
			seen.add(n);
			return true;
		});

		return unique.map((el, idx) => mapNominatimItem(el, idx));
	} catch {
		clearTimeout(timer);
		return [];
	}
}

/**
 * Fetch places in a specific city/area using OpenStreetMap Nominatim.
 * Great when GPS is blocked, denied, or running on non-HTTPS LAN!
 */
export async function fetchPlacesByCity(city: string): Promise<Place[]> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 6000);

	try {
		const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent('restaurant in ' + city)}&limit=14`;
		const res = await fetch(url, {
			signal: controller.signal,
			headers: { 'Accept': 'application/json' }
		});
		clearTimeout(timer);

		if (!res.ok) return [];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data: any[] = await res.json();
		if (!Array.isArray(data)) return [];

		const seen = new Set<string>();
		const unique = data.filter(item => {
			const n = (item.name || item.display_name?.split(',')[0] || '').toLowerCase().trim();
			if (!n || seen.has(n)) return false;
			seen.add(n);
			return true;
		});

		return unique.map((el, idx) => mapNominatimItem(el, idx));
	} catch {
		clearTimeout(timer);
		return [];
	}
}

/**
 * Fetches nearby restaurants/cafes from OpenStreetMap.
 * Tries Nominatim first (fast & reliable), falls back to Overpass mirrors,
 * and blends with mock places if needed to guarantee 10 places.
 */
export async function fetchOverpassPlaces(
	lat: number,
	lon: number,
	radiusMeters = 1500
): Promise<Place[]> {
	// 1. Try Nominatim first (usually responds in <1s)
	const nomPlaces = await fetchNominatimNearby(lat, lon, radiusMeters);
	if (nomPlaces.length >= 4) {
		return nomPlaces;
	}

	// 2. Fallback to Overpass API
	const query = `[out:json][timeout:6];(node["amenity"~"restaurant|cafe|fast_food|bar|food_court"](around:${radiusMeters},${lat},${lon});way["amenity"~"restaurant|cafe|fast_food|bar|food_court"](around:${radiusMeters},${lat},${lon}););out center 15;`;

	const mirrors = [
		'https://overpass.private.coffee/api/interpreter',
		'https://lz4.overpass-api.de/api/interpreter',
		'https://overpass-api.de/api/interpreter'
	];

	let res: Response | null = null;
	for (const mirror of mirrors) {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 4000);
		try {
			res = await fetch(`${mirror}?data=${encodeURIComponent(query)}`, {
				signal: controller.signal
			});
			clearTimeout(timer);
			if (res.ok) break;
			res = null;
		} catch {
			clearTimeout(timer);
			res = null;
		}
	}

	if (res && res.ok) {
		try {
			const data = await res.json();
			if (Array.isArray(data.elements) && data.elements.length > 0) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const osmPlaces = data.elements.slice(0, 12).map((el: any, i: number) => {
					const tags = el.tags ?? {};
					const amenity = tags.amenity ?? 'restaurant';
					const name = tags.name ?? tags['name:id'] ?? `Tempat ${i + 1}`;
					const elLat = el.lat ?? el.center?.lat;
					const elLon = el.lon ?? el.center?.lon;

					return {
						id: `osm-${el.id}`,
						name,
						category: CATEGORY_MAP[amenity] ?? 'Makanan',
						emoji: EMOJI_MAP[amenity] ?? '🍴',
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
						tags: ['#OpenStreetMap', `#${amenity}`],
						rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
						lat: elLat,
						lon: elLon
					} satisfies Place;
				});

				const combined = [...nomPlaces, ...osmPlaces];
				const seen = new Set<string>();
				return combined.filter(p => {
					if (seen.has(p.name.toLowerCase())) return false;
					seen.add(p.name.toLowerCase());
					return true;
				});
			}
		} catch {
			// ignore JSON parse errors
		}
	}

	// If we got some places from Nominatim, return them
	if (nomPlaces.length > 0) return nomPlaces;

	throw new Error('Tidak dapat menemukan tempat di sekitar lokasi ini.');
}

/** Shuffle & pick N places from an array */
export function pickRandom<T>(arr: T[], n: number): T[] {
	return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}
