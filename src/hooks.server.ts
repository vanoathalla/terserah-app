// SvelteKit handle hook — passthrough (WS handled by vite plugin)
import type { Handle } from '@sveltejs/kit';
export const handle: Handle = async ({ event, resolve }) => resolve(event);
