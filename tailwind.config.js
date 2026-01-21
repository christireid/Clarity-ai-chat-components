/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './packages/*/src/**/*.{ts,tsx}',
    './apps/*/src/**/*.{ts,tsx}',
    './apps/*/*.{ts,tsx}',
    './apps/*/app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
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
      boxShadow: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        md: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.03)',
        lg: '0 12px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.04)',
        xl: '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.06)',
        '2xl':
          '0 24px 48px rgba(0, 0, 0, 0.18), 0 12px 24px rgba(0, 0, 0, 0.08)',
      },
      // =========================================================================
      // GLASSMORPHISM SYSTEM
      // Premium glass effects with OKLCH-based pastel gradients
      // =========================================================================
      // Backdrop blur utilities for glass effects
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
      // OKLCH-based pastel gradient system
      backgroundImage: {
        // Light mode pastel gradients (subtle, sophisticated)
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
        // Dark mode pastel gradients (deeper tones)
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
        // Subtle mesh backgrounds for layered effects
        'glass-mesh':
          'radial-gradient(at 0% 0%, oklch(95% 0.03 240) 0%, transparent 50%), radial-gradient(at 100% 100%, oklch(96% 0.025 280) 0%, transparent 50%)',
        'glass-mesh-dark':
          'radial-gradient(at 0% 0%, oklch(18% 0.05 240) 0%, transparent 50%), radial-gradient(at 100% 100%, oklch(19% 0.045 280) 0%, transparent 50%)',
      },
      // Semantic ring colors for focus states
      ringColor: {
        success: 'var(--ring-success)',
        warning: 'var(--ring-warning)',
        info: 'var(--ring-info)',
        destructive: 'var(--ring-destructive)',
      },
      // Glass border system (OKLCH with alpha transparency)
      borderColor: {
        'glass-light': 'oklch(92% 0.01 240 / 0.2)',
        'glass-medium': 'oklch(88% 0.015 240 / 0.3)',
        'glass-strong': 'oklch(85% 0.02 240 / 0.4)',
        'glass-dark-light': 'oklch(30% 0.02 240 / 0.2)',
        'glass-dark-medium': 'oklch(35% 0.025 240 / 0.3)',
        'glass-dark-strong': 'oklch(40% 0.03 240 / 0.4)',
      },
      // =========================================================================
      // ANIMATION SYSTEM
      // Consistent, accessible animations across all components
      // =========================================================================
      transitionDuration: {
        faster: '75ms',
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
        slower: '400ms',
        slowest: '500ms',
      },
      transitionTimingFunction: {
        // Standard easings
        smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        snappy: 'cubic-bezier(0.4, 0, 0.2, 1)',
        natural: 'cubic-bezier(0.4, 0, 0.1, 1)',
        // Entrance/Exit
        'ease-in-smooth': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out-smooth': 'cubic-bezier(0, 0, 0.2, 1)',
        // Spring-like (for playful interactions)
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        // Accordion animations (Radix UI)
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        // Fade animations
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        // Slide animations
        'slide-up': {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          from: { transform: 'translateY(-16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-left': {
          from: { transform: 'translateX(16px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-right': {
          from: { transform: 'translateX(-16px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        // Scale animations
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'scale-out': {
          from: { transform: 'scale(1)', opacity: '1' },
          to: { transform: 'scale(0.95)', opacity: '0' },
        },
        // Pop animation (for notifications/badges)
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // Feedback animations
        ripple: {
          from: { transform: 'translate(-50%, -50%) scale(0)', opacity: '0.3' },
          to: { transform: 'translate(-50%, -50%) scale(2)', opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        'shake-x': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 50%, 90%': { transform: 'translateX(-3px)' },
          '30%, 70%': { transform: 'translateX(3px)' },
        },
        // Loading animations
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        spinner: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'thinking-dots': {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.5' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        // Cursor blink
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        // Success feedback (uses CSS variable for theme consistency)
        'success-pulse': {
          '0%': { boxShadow: '0 0 0 0 hsl(var(--success) / 0.7)' },
          '50%': { boxShadow: '0 0 0 8px hsl(var(--success) / 0)' },
          '100%': { boxShadow: '0 0 0 0 hsl(var(--success) / 0)' },
        },
        // Badge animations
        'badge-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 2px 1px currentColor' },
          '50%': { boxShadow: '0 0 8px 2px currentColor' },
        },
        // Glassmorphism animations
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
        // Accordion
        'accordion-down':
          'accordion-down 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'accordion-up': 'accordion-up 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
        // Fade
        'fade-in': 'fade-in 0.2s cubic-bezier(0, 0, 0.2, 1)',
        'fade-out': 'fade-out 0.15s cubic-bezier(0.4, 0, 1, 1)',
        // Slide
        'slide-up': 'slide-up 0.3s cubic-bezier(0, 0, 0.2, 1)',
        'slide-down': 'slide-down 0.3s cubic-bezier(0, 0, 0.2, 1)',
        'slide-left': 'slide-left 0.3s cubic-bezier(0, 0, 0.2, 1)',
        'slide-right': 'slide-right 0.3s cubic-bezier(0, 0, 0.2, 1)',
        // Scale
        'scale-in': 'scale-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'scale-out': 'scale-out 0.15s cubic-bezier(0.4, 0, 1, 1)',
        pop: 'pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        // Feedback
        ripple: 'ripple 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
        shake: 'shake 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'shake-x': 'shake-x 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
        // Loading
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        spinner: 'spinner 1s linear infinite',
        'thinking-dots': 'thinking-dots 1.4s ease-in-out infinite',
        'cursor-blink': 'cursor-blink 0.8s ease-in-out infinite',
        // Success
        'success-pulse': 'success-pulse 0.8s ease-out 2',
        // Badge
        'badge-pulse': 'badge-pulse 2s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        // Glassmorphism
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Add reduced motion plugin
    function ({ addBase }) {
      addBase({
        // Disable animations for users who prefer reduced motion
        '@media (prefers-reduced-motion: reduce)': {
          '*': {
            'animation-duration': '0.01ms !important',
            'animation-iteration-count': '1 !important',
            'transition-duration': '0.01ms !important',
          },
          // Allow essential animations with minimal movement
          '.motion-reduce\\:animate-none': {
            animation: 'none !important',
          },
        },
      })
    },
  ],
}
