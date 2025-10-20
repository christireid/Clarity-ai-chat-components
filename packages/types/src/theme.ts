/**
 * Theme-related type definitions
 */

export interface ColorScale {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

export interface ThemeColors {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
  success: string
  warning: string
  info: string
}

export interface ThemeSpacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
}

export interface ThemeRadius {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  full: string
}

export interface ThemeTypography {
  fontFamily: {
    sans: string
    mono: string
  }
  fontSize: Record<string, [string, { lineHeight: string; letterSpacing?: string }]>
  fontWeight: Record<string, string>
}

export interface ThemeAnimation {
  duration: Record<string, string>
  timingFunction: Record<string, string>
}

export interface Theme {
  name: string
  colors: ThemeColors
  spacing: ThemeSpacing
  radius: ThemeRadius
  typography: ThemeTypography
  animation: ThemeAnimation
  shadows: Record<string, string>
}

export interface CustomTheme extends Partial<Theme> {
  id: string
  userId: string
  isPublic: boolean
  createdAt: Date
}
