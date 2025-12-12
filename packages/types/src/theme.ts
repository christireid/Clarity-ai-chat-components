/**
 * Theme-related type definitions
 *
 * This module contains types for theming and visual customization,
 * including color scales, typography, spacing, and complete theme objects.
 *
 * @packageDocumentation
 */

/**
 * A Tailwind-style color scale with shades from 50 to 950.
 *
 * @example
 * ```typescript
 * const blue: ColorScale = {
 *   50: '#eff6ff',
 *   100: '#dbeafe',
 *   200: '#bfdbfe',
 *   300: '#93c5fd',
 *   400: '#60a5fa',
 *   500: '#3b82f6',
 *   600: '#2563eb',
 *   700: '#1d4ed8',
 *   800: '#1e40af',
 *   900: '#1e3a8a',
 *   950: '#172554',
 * }
 * ```
 */
export interface ColorScale {
  /** Lightest shade */
  50: string
  100: string
  200: string
  300: string
  400: string
  /** Base shade */
  500: string
  600: string
  700: string
  800: string
  900: string
  /** Darkest shade */
  950: string
}

/**
 * Theme color tokens following shadcn/ui conventions.
 *
 * @remarks
 * Colors are defined as CSS custom property values (HSL components)
 * for easy manipulation in CSS variables.
 *
 * @example
 * ```typescript
 * const colors: ThemeColors = {
 *   background: '0 0% 100%',
 *   foreground: '222.2 84% 4.9%',
 *   primary: '221.2 83.2% 53.3%',
 *   primaryForeground: '210 40% 98%',
 *   // ... other colors
 * }
 * ```
 */
export interface ThemeColors {
  /** Main background color */
  background: string
  /** Main foreground/text color */
  foreground: string
  /** Card background color */
  card: string
  /** Card text color */
  cardForeground: string
  /** Popover/dropdown background */
  popover: string
  /** Popover text color */
  popoverForeground: string
  /** Primary brand color */
  primary: string
  /** Text on primary color */
  primaryForeground: string
  /** Secondary brand color */
  secondary: string
  /** Text on secondary color */
  secondaryForeground: string
  /** Muted/subtle background */
  muted: string
  /** Muted text color */
  mutedForeground: string
  /** Accent/highlight color */
  accent: string
  /** Text on accent color */
  accentForeground: string
  /** Destructive/danger color */
  destructive: string
  /** Text on destructive color */
  destructiveForeground: string
  /** Border color */
  border: string
  /** Input border color */
  input: string
  /** Focus ring color */
  ring: string
  /** Success state color */
  success: string
  /** Warning state color */
  warning: string
  /** Info state color */
  info: string
}

/**
 * Theme spacing scale.
 *
 * @example
 * ```typescript
 * const spacing: ThemeSpacing = {
 *   xs: '0.25rem',
 *   sm: '0.5rem',
 *   md: '1rem',
 *   lg: '1.5rem',
 *   xl: '2rem',
 *   '2xl': '3rem',
 * }
 * ```
 */
export interface ThemeSpacing {
  /** Extra small spacing */
  xs: string
  /** Small spacing */
  sm: string
  /** Medium spacing */
  md: string
  /** Large spacing */
  lg: string
  /** Extra large spacing */
  xl: string
  /** 2x extra large spacing */
  '2xl': string
}

/**
 * Theme border radius scale.
 *
 * @example
 * ```typescript
 * const radius: ThemeRadius = {
 *   none: '0',
 *   sm: '0.125rem',
 *   md: '0.375rem',
 *   lg: '0.5rem',
 *   xl: '0.75rem',
 *   full: '9999px',
 * }
 * ```
 */
export interface ThemeRadius {
  /** No rounding */
  none: string
  /** Small radius */
  sm: string
  /** Medium radius (default) */
  md: string
  /** Large radius */
  lg: string
  /** Extra large radius */
  xl: string
  /** Fully rounded (pill shape) */
  full: string
}

/**
 * Theme typography configuration.
 *
 * @example
 * ```typescript
 * const typography: ThemeTypography = {
 *   fontFamily: {
 *     sans: 'Inter, system-ui, sans-serif',
 *     mono: 'JetBrains Mono, monospace',
 *   },
 *   fontSize: {
 *     sm: ['0.875rem', { lineHeight: '1.25rem' }],
 *     base: ['1rem', { lineHeight: '1.5rem' }],
 *   },
 *   fontWeight: {
 *     normal: '400',
 *     medium: '500',
 *     bold: '700',
 *   },
 * }
 * ```
 */
export interface ThemeTypography {
  /** Font family definitions */
  fontFamily: {
    /** Sans-serif font stack */
    sans: string
    /** Monospace font stack */
    mono: string
  }
  /** Font size with line height and optional letter spacing */
  fontSize: Record<
    string,
    [string, { lineHeight: string; letterSpacing?: string }]
  >
  /** Font weight definitions */
  fontWeight: Record<string, string>
}

/**
 * Theme animation configuration.
 *
 * @example
 * ```typescript
 * const animation: ThemeAnimation = {
 *   duration: {
 *     fast: '150ms',
 *     normal: '200ms',
 *     slow: '300ms',
 *   },
 *   timingFunction: {
 *     ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
 *     easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
 *     easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
 *   },
 * }
 * ```
 */
export interface ThemeAnimation {
  /** Animation duration values */
  duration: Record<string, string>
  /** Animation timing functions */
  timingFunction: Record<string, string>
}

/**
 * Complete theme configuration.
 *
 * @remarks
 * Themes define all visual aspects of the UI including colors,
 * typography, spacing, border radius, animations, and shadows.
 *
 * @example
 * ```typescript
 * const theme: Theme = {
 *   name: 'Light',
 *   colors: { ... },
 *   spacing: { ... },
 *   radius: { ... },
 *   typography: { ... },
 *   animation: { ... },
 *   shadows: {
 *     sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
 *     md: '0 4px 6px rgba(0, 0, 0, 0.1)',
 *   },
 * }
 * ```
 */
export interface Theme {
  /** Theme display name */
  name: string
  /** Color tokens */
  colors: ThemeColors
  /** Spacing scale */
  spacing: ThemeSpacing
  /** Border radius scale */
  radius: ThemeRadius
  /** Typography configuration */
  typography: ThemeTypography
  /** Animation configuration */
  animation: ThemeAnimation
  /** Shadow definitions */
  shadows: Record<string, string>
}

/**
 * User-created custom theme with partial overrides.
 *
 * @remarks
 * Custom themes extend the base theme with user-specific overrides.
 * Only the properties that differ from the base need to be specified.
 *
 * @example
 * ```typescript
 * const customTheme: CustomTheme = {
 *   id: 'theme-1',
 *   userId: 'user-1',
 *   name: 'My Dark Theme',
 *   colors: {
 *     primary: '221.2 83.2% 53.3%',
 *   },
 *   isPublic: false,
 *   createdAt: new Date(),
 * }
 * ```
 */
export interface CustomTheme extends Partial<Theme> {
  /** Unique theme identifier */
  id: string
  /** ID of the user who created this theme */
  userId: string
  /** Whether this theme is publicly available */
  isPublic: boolean
  /** When the theme was created */
  createdAt: Date
}
