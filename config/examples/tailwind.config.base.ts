import type { Config } from 'tailwindcss'

/**
 * Base Tailwind Configuration for Clarity Chat Examples
 *
 * This is the shared base configuration that all examples extend.
 * Individual examples can override or extend these settings.
 *
 * @example
 * ```ts
 * // In your example's tailwind.config.ts:
 * import { baseConfig } from '../../../config/examples/tailwind.config.base'
 *
 * export default {
 *   ...baseConfig,
 *   theme: {
 *     ...baseConfig.theme,
 *     extend: {
 *       ...baseConfig.theme?.extend,
 *       colors: {
 *         brand: '#your-color',
 *       },
 *     },
 *   },
 * } satisfies Config
 * ```
 */
export const baseConfig: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Clarity Chat brand colors
      colors: {
        clarity: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      // Animation presets
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default baseConfig
