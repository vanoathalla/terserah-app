// SvelteKit server hooks — passthrough.
// WebSocket is handled by wsPlugin.ts (dev) and server.js (production).
import type { Handle } from '@sveltejs/kit';
export const handle: Handle = async ({ event, resolve }) => resolve(event);
