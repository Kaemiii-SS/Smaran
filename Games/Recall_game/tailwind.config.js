export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            perspective: {
                '1000': '1000px',
            }, keyframes: {
                flip: {
                    '0%': { transform: 'rotateY(0)' },
                    '100%': { transform: 'rotateY(180deg)' }
                }
            },
            animation: {
                flip: 'flip 2s ease-in-out'
            }
        }
    }
}