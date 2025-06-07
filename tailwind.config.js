/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // dark mode toggle via class
  theme: {
    extend: {
      fontFamily: {
        title: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        smoky: '#1A1A1A',           // Cinematic deep charcoal
        vintageMaroon: '#7B2D26',
        fadedGold: '#C9B458',
        filmGray: '#2D2D2D',
        softIvory: '#F5F3E7',
        dustyTaupe: '#A89F91',
        pinkGlow: '#F9D2DC',
        sepiaAccent: '#8B6A4F',
        blushPink: '#FADADD',
        // Dreamy Light Mode (Pinterest-inspired girly pastel pinks)
        dreamyPink: '#FDE8F0',      // creamy dreamy pink background
        blushPink: '#F4C1D1',       // soft blush for accents, buttons
        dustyRose: '#D99CA6',       // muted pink for text/secondary
        cream: '#FFF5F7',           // soft creamy off-white backgrounds
        warmGold: '#E9C46A',        // soft golden highlight for light mode
      },
      boxShadow: {
        subtle: '0 4px 10px rgba(0, 0, 0, 0.3)',
        goldGlow: '0 0 15px rgba(201,180,88,0.8)',
        pinkGlow: '0 0 15px rgba(244,193,209,0.7)', // pink glow for light mode
      },
      backgroundImage: {
        'dreamy-grad-dark': 'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
        'dreamy-grad-light': 'linear-gradient(135deg, #FDE8F0, #FFF5F7)',
      },
      transitionTimingFunction: {
        'soft-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
      },
      letterSpacing: {
        widest: '.2em',
      },
      animation: {
        glowPulse: 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
