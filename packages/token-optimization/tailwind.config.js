/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './.storybook/**/*.{js,ts,jsx,tsx}',
    '../primitives/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Backdrop blur utilities for glassmorphism
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        DEFAULT: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      backdropSaturate: {
        0: '0',
        50: '.5',
        100: '1',
        150: '1.5',
        200: '2',
      },

      // OKLCH-based pastel gradient system with opacity variants
      backgroundImage: {
        // Light mode gradients - full opacity
        'glass-pastel-blue':
          'linear-gradient(135deg, oklch(95% 0.02 240) 0%, oklch(97% 0.015 260) 100%)',
        'glass-pastel-purple':
          'linear-gradient(135deg, oklch(95% 0.025 280) 0%, oklch(97% 0.02 300) 100%)',
        'glass-pastel-pink':
          'linear-gradient(135deg, oklch(96% 0.03 350) 0%, oklch(98% 0.02 340) 100%)',
        'glass-pastel-green':
          'linear-gradient(135deg, oklch(95% 0.03 160) 0%, oklch(97% 0.02 140) 100%)',
        'glass-pastel-amber':
          'linear-gradient(135deg, oklch(96% 0.04 80) 0%, oklch(98% 0.025 70) 100%)',

        // Light mode gradients - 40% opacity (subtle)
        'glass-pastel-blue-subtle':
          'linear-gradient(135deg, oklch(95% 0.02 240 / 0.4) 0%, oklch(97% 0.015 260 / 0.4) 100%)',
        'glass-pastel-purple-subtle':
          'linear-gradient(135deg, oklch(95% 0.025 280 / 0.4) 0%, oklch(97% 0.02 300 / 0.4) 100%)',
        'glass-pastel-pink-subtle':
          'linear-gradient(135deg, oklch(96% 0.03 350 / 0.4) 0%, oklch(98% 0.02 340 / 0.4) 100%)',
        'glass-pastel-green-subtle':
          'linear-gradient(135deg, oklch(95% 0.03 160 / 0.4) 0%, oklch(97% 0.02 140 / 0.4) 100%)',
        'glass-pastel-amber-subtle':
          'linear-gradient(135deg, oklch(96% 0.04 80 / 0.4) 0%, oklch(98% 0.025 70 / 0.4) 100%)',

        // Light mode gradients - 60% opacity (medium)
        'glass-pastel-blue-medium':
          'linear-gradient(135deg, oklch(95% 0.02 240 / 0.6) 0%, oklch(97% 0.015 260 / 0.6) 100%)',
        'glass-pastel-purple-medium':
          'linear-gradient(135deg, oklch(95% 0.025 280 / 0.6) 0%, oklch(97% 0.02 300 / 0.6) 100%)',
        'glass-pastel-pink-medium':
          'linear-gradient(135deg, oklch(96% 0.03 350 / 0.6) 0%, oklch(98% 0.02 340 / 0.6) 100%)',
        'glass-pastel-green-medium':
          'linear-gradient(135deg, oklch(95% 0.03 160 / 0.6) 0%, oklch(97% 0.02 140 / 0.6) 100%)',
        'glass-pastel-amber-medium':
          'linear-gradient(135deg, oklch(96% 0.04 80 / 0.6) 0%, oklch(98% 0.025 70 / 0.6) 100%)',

        // Light mode gradients - 80% opacity (strong)
        'glass-pastel-blue-strong':
          'linear-gradient(135deg, oklch(95% 0.02 240 / 0.8) 0%, oklch(97% 0.015 260 / 0.8) 100%)',
        'glass-pastel-purple-strong':
          'linear-gradient(135deg, oklch(95% 0.025 280 / 0.8) 0%, oklch(97% 0.02 300 / 0.8) 100%)',
        'glass-pastel-pink-strong':
          'linear-gradient(135deg, oklch(96% 0.03 350 / 0.8) 0%, oklch(98% 0.02 340 / 0.8) 100%)',
        'glass-pastel-green-strong':
          'linear-gradient(135deg, oklch(95% 0.03 160 / 0.8) 0%, oklch(97% 0.02 140 / 0.8) 100%)',
        'glass-pastel-amber-strong':
          'linear-gradient(135deg, oklch(96% 0.04 80 / 0.8) 0%, oklch(98% 0.025 70 / 0.8) 100%)',

        // Dark mode gradients - full opacity
        'glass-pastel-blue-dark':
          'linear-gradient(135deg, oklch(18% 0.04 240) 0%, oklch(20% 0.035 260) 100%)',
        'glass-pastel-purple-dark':
          'linear-gradient(135deg, oklch(18% 0.045 280) 0%, oklch(20% 0.04 300) 100%)',
        'glass-pastel-pink-dark':
          'linear-gradient(135deg, oklch(19% 0.05 350) 0%, oklch(21% 0.04 340) 100%)',
        'glass-pastel-green-dark':
          'linear-gradient(135deg, oklch(18% 0.05 160) 0%, oklch(20% 0.04 140) 100%)',
        'glass-pastel-amber-dark':
          'linear-gradient(135deg, oklch(19% 0.06 80) 0%, oklch(21% 0.045 70) 100%)',

        // Dark mode gradients - 40% opacity (subtle)
        'glass-pastel-blue-dark-subtle':
          'linear-gradient(135deg, oklch(18% 0.04 240 / 0.4) 0%, oklch(20% 0.035 260 / 0.4) 100%)',
        'glass-pastel-purple-dark-subtle':
          'linear-gradient(135deg, oklch(18% 0.045 280 / 0.4) 0%, oklch(20% 0.04 300 / 0.4) 100%)',
        'glass-pastel-pink-dark-subtle':
          'linear-gradient(135deg, oklch(19% 0.05 350 / 0.4) 0%, oklch(21% 0.04 340 / 0.4) 100%)',
        'glass-pastel-green-dark-subtle':
          'linear-gradient(135deg, oklch(18% 0.05 160 / 0.4) 0%, oklch(20% 0.04 140 / 0.4) 100%)',
        'glass-pastel-amber-dark-subtle':
          'linear-gradient(135deg, oklch(19% 0.06 80 / 0.4) 0%, oklch(21% 0.045 70 / 0.4) 100%)',

        // Dark mode gradients - 60% opacity (medium)
        'glass-pastel-blue-dark-medium':
          'linear-gradient(135deg, oklch(18% 0.04 240 / 0.6) 0%, oklch(20% 0.035 260 / 0.6) 100%)',
        'glass-pastel-purple-dark-medium':
          'linear-gradient(135deg, oklch(18% 0.045 280 / 0.6) 0%, oklch(20% 0.04 300 / 0.6) 100%)',
        'glass-pastel-pink-dark-medium':
          'linear-gradient(135deg, oklch(19% 0.05 350 / 0.6) 0%, oklch(21% 0.04 340 / 0.6) 100%)',
        'glass-pastel-green-dark-medium':
          'linear-gradient(135deg, oklch(18% 0.05 160 / 0.6) 0%, oklch(20% 0.04 140 / 0.6) 100%)',
        'glass-pastel-amber-dark-medium':
          'linear-gradient(135deg, oklch(19% 0.06 80 / 0.6) 0%, oklch(21% 0.045 70 / 0.6) 100%)',

        // Dark mode gradients - 80% opacity (strong)
        'glass-pastel-blue-dark-strong':
          'linear-gradient(135deg, oklch(18% 0.04 240 / 0.8) 0%, oklch(20% 0.035 260 / 0.8) 100%)',
        'glass-pastel-purple-dark-strong':
          'linear-gradient(135deg, oklch(18% 0.045 280 / 0.8) 0%, oklch(20% 0.04 300 / 0.8) 100%)',
        'glass-pastel-pink-dark-strong':
          'linear-gradient(135deg, oklch(19% 0.05 350 / 0.8) 0%, oklch(21% 0.04 340 / 0.8) 100%)',
        'glass-pastel-green-dark-strong':
          'linear-gradient(135deg, oklch(18% 0.05 160 / 0.8) 0%, oklch(20% 0.04 140 / 0.8) 100%)',
        'glass-pastel-amber-dark-strong':
          'linear-gradient(135deg, oklch(19% 0.06 80 / 0.8) 0%, oklch(21% 0.045 70 / 0.8) 100%)',

        // Subtle mesh backgrounds
        'glass-mesh':
          'radial-gradient(at 0% 0%, oklch(95% 0.03 240) 0%, transparent 50%), radial-gradient(at 100% 100%, oklch(96% 0.025 280) 0%, transparent 50%)',
        'glass-mesh-dark':
          'radial-gradient(at 0% 0%, oklch(18% 0.05 240) 0%, transparent 50%), radial-gradient(at 100% 100%, oklch(19% 0.045 280) 0%, transparent 50%)',
      },

      // Glass border system
      borderColor: {
        'glass-light': 'oklch(92% 0.01 240 / 0.2)',
        'glass-medium': 'oklch(88% 0.015 240 / 0.3)',
        'glass-strong': 'oklch(85% 0.02 240 / 0.4)',
        'glass-dark-light': 'oklch(30% 0.02 240 / 0.2)',
        'glass-dark-medium': 'oklch(35% 0.025 240 / 0.3)',
        'glass-dark-strong': 'oklch(40% 0.03 240 / 0.4)',
      },

      // Animated gradient keyframes
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px oklch(70% 0.15 265 / 0.3)',
          },
          '50%': {
            boxShadow:
              '0 0 40px oklch(70% 0.15 265 / 0.5), 0 0 60px oklch(70% 0.15 265 / 0.2)',
          },
        },
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },

      // Design system colors
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
