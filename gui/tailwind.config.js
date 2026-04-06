/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b0e14',
        primary: '#00f2ff',
        secondary: '#bc13fe',
        accent: '#ffb700',
        terminal: '#161a21',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(0, 242, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
