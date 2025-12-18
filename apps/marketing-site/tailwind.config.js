/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/primitives/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/react/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Map shadcn tokens to brand colors
        primary: {
            DEFAULT: '#06b6d4', // clarity-500
            foreground: '#ffffff',
            ...{
                50: '#ecfeff',
                100: '#cffafe',
                200: '#a5f3fc',
                300: '#67e8f9',
                400: '#00d4ff',
                500: '#06b6d4',
                600: '#0891b2',
                700: '#0e7490',
                800: '#155e75',
                900: '#164e63',
            }
        },
        secondary: {
            DEFAULT: '#a855f7', // cosmic-500
            foreground: '#ffffff',
             ...{
                50: '#faf5ff',
                100: '#f3e8ff',
                200: '#e9d5ff',
                300: '#d8b4fe',
                400: '#c084fc',
                500: '#a855f7',
                600: '#9333ea',
                700: '#7e22ce',
                800: '#6b21a8',
                900: '#581c87',
            }
        },
        destructive: {
            DEFAULT: '#ef4444',
            foreground: '#ffffff',
        },
        muted: {
            DEFAULT: '#262626', // surface-700
            foreground: '#a3a3a3',
        },
        accent: {
            DEFAULT: '#262626', // surface-700
            foreground: '#ffffff',
        },
        popover: {
            DEFAULT: '#0a0a0a', // surface-950
            foreground: '#ffffff',
        },
        card: {
            DEFAULT: '#171717', // surface-800
            foreground: '#ffffff',
        },

        // Primary - Clarity Cyan
        clarity: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#00d4ff',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Secondary - Cosmic Purple
        cosmic: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Surface colors for dark theme
        surface: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          700: '#262626',
          800: '#171717',
          900: '#0f0f0f',
          950: '#0a0a0a',
        },
        // Legacy brand colors for backward compatibility
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#00d4ff',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        glow: '0 0 40px -10px var(--clarity-400)',
        'glow-lg': '0 0 60px -10px var(--clarity-400)',
      },
    },
  },
  plugins: [],
}

export default config
