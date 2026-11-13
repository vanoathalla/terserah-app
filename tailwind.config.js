/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				brand: {
					yellow: '#FFE600',
					purple: '#A855F7',
					lime: '#84CC16',
					veto: '#FF3B30',
					cream: '#FFFDF7'
				}
			},
			fontFamily: {
				mono: ['Space Mono', 'Courier New', 'monospace'],
				sans: ['Space Grotesk', 'sans-serif']
			},
			boxShadow: {
				brutal: '4px 4px 0px 0px #000000',
				'brutal-sm': '2px 2px 0px 0px #000000',
				'brutal-lg': '6px 6px 0px 0px #000000',
				'brutal-yellow': '4px 4px 0px 0px #FFE600',
				'brutal-purple': '4px 4px 0px 0px #A855F7'
			},
			animation: {
				bounce: 'bounce 0.3s ease-out',
				wiggle: 'wiggle 0.4s ease-in-out',
				ping: 'ping 0.6s cubic-bezier(0, 0, 0.2, 1) forwards',
				'slide-up': 'slide-up 0.3s ease-out'
			},
			keyframes: {
				wiggle: {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			}
		}
	},
	plugins: []
};
