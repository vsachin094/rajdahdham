/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Divine Temple Color Palette
        temple: {
          ivory: '#FFFDF9',
          cream: '#FFF8EC',
          sandalwood: '#F5E6D3',
          warmBrown: '#2C1810',
          mediumBrown: '#4A3728',
          lightBrown: '#8B7355',
          antiqueGold: '#C5A059',
          goldLight: '#E8D4A8',
          goldDark: '#A8893E',
          saffron: '#FF7700',
          saffronLight: '#FF9933',
          saffronDark: '#CC5F00',
          vermilion: '#E63900',
          turmeric: '#FFB300',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'Noto Sans Devanagari', 'sans-serif'],
        serif: ['Georgia', 'Noto Serif Devanagari', 'serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
      },
      boxShadow: {
        'divine': '0 4px 20px rgba(204, 160, 89, 0.15), 0 2px 8px rgba(255, 119, 0, 0.1)',
        'divine-lg': '0 10px 40px rgba(204, 160, 89, 0.2), 0 4px 16px rgba(255, 119, 0, 0.15)',
        'gold-glow': '0 0 30px rgba(204, 160, 89, 0.4)',
        'saffron-glow': '0 0 30px rgba(255, 119, 0, 0.3)',
      },
      backgroundImage: {
        'temple-gradient': 'linear-gradient(135deg, #FFFDF9 0%, #FFF8EC 50%, #F5E6D3 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C5A059 0%, #E8D4A8 50%, #C5A059 100%)',
        'saffron-gradient': 'linear-gradient(135deg, #FF7700 0%, #FF9933 100%)',
        'hero-pattern': 'radial-gradient(circle at 20% 50%, rgba(255,119,0,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(204,160,89,0.1) 0%, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(204, 160, 89, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(204, 160, 89, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}