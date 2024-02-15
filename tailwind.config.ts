import type {Config} from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dforest-green': '#1E4620',
      },
      keyframes: {
        'up-fade': {
          from: {transform: 'translateY(0)', opacity: '1'},
          to: {transform: 'translateY(-100px)', opacity: '0'},
        },
        'slide-up': {
          from: {transform: 'translateY(0)'},
          to: {transform: 'translateY(-100%)'},
        },
        'fade-out': {
          from: {opacity: '1'},
          to: {opacity: '0'},
        },
        'fade-in': {
          from: {opacity: '0'},
          to: {opacity: '1'},
        },
        'tree-right': {
          from: {opacity: '0', transform: 'translateX(-20%)'},
          to: {opacity: '1', transform: 'translateX(0)'},
        },
        'tree-left': {
          from: {opacity: '0', transform: 'translateX(20%)'},
          to: {opacity: '1', transform: 'translateX(0)'},
        },
        'fade-up-in': {
          from: {opacity: '0', transform: 'translateY(20%)'},
          to: {opacity: '1', transform: 'translateY(0)'},
        },
      },
      animation: {
        'up-fade': 'up-fade 0.5s ease-out both',
        'slide-up': 'slide-up 0.5s ease-out both',
        'fade-out': 'fade-out 0.5s ease-out both',
        'fade-in': 'fade-in 1s ease-out both',
        'tree-right': 'tree-right 1s ease-out both',
        'tree-left': 'tree-left 1s ease-out both',
        'fade-up-in': 'fade-up-in 1s ease-out both',
      },
      transitionDelay: {
        '1500': '1500ms',
        '2000': '2000ms',
        '2500': '2500ms',
        '3000': '3000ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
} satisfies Config
