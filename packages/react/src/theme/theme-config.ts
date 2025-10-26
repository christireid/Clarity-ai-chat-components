/**
 * Theme Configuration Types
 * 
 * Complete theme customization API with support for:
 * - Full color palette customization
 * - Typography customization
 * - Spacing and sizing
 * - Border radius and shadows
 * - Animation timing
 * - Component-level overrides
 */

/**
 * HSL color value (e.g., "222.2 84% 4.9%")
 */
export type HSLColor = string

/**
 * Color configuration for a complete theme
 */
export interface ColorConfig {
  // Base colors
  background: HSLColor
  foreground: HSLColor
  
  // Component colors
  card: HSLColor
  cardForeground: HSLColor
  popover: HSLColor
  popoverForeground: HSLColor
  
  // Brand colors
  primary: HSLColor
  primaryForeground: HSLColor
  secondary: HSLColor
  secondaryForeground: HSLColor
  
  // State colors
  muted: HSLColor
  mutedForeground: HSLColor
  accent: HSLColor
  accentForeground: HSLColor
  destructive: HSLColor
  destructiveForeground: HSLColor
  success: HSLColor
  successForeground: HSLColor
  warning: HSLColor
  warningForeground: HSLColor
  info: HSLColor
  infoForeground: HSLColor
  
  // Borders & inputs
  border: HSLColor
  input: HSLColor
  ring: HSLColor
}

/**
 * Typography configuration
 */
export interface TypographyConfig {
  fontFamily: {
    sans: string
    mono: string
  }
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
  }
  fontWeight: {
    normal: number
    medium: number
    semibold: number
    bold: number
  }
  lineHeight: {
    tight: number
    normal: number
    relaxed: number
  }
  letterSpacing: {
    tight: string
    normal: string
    wide: string
  }
}

/**
 * Spacing configuration
 */
export interface SpacingConfig {
  0: string
  1: string
  2: string
  3: string
  4: string
  5: string
  6: string
  8: string
  10: string
  12: string
  16: string
  20: string
  24: string
}

/**
 * Border configuration
 */
export interface BorderConfig {
  width: {
    thin: string
    normal: string
    thick: string
  }
  radius: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    full: string
  }
}

/**
 * Shadow configuration
 */
export interface ShadowConfig {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  inner: string
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  duration: {
    fast: string
    normal: string
    slow: string
    slower: string
  }
  easing: {
    default: string
    in: string
    out: string
    inOut: string
    spring: string
  }
}

/**
 * Component-level theme overrides
 */
export interface ComponentOverrides {
  button?: {
    borderRadius?: string
    fontSize?: string
    padding?: string
  }
  input?: {
    borderRadius?: string
    fontSize?: string
    padding?: string
  }
  card?: {
    borderRadius?: string
    padding?: string
    shadow?: string
  }
  message?: {
    borderRadius?: string
    padding?: string
    fontSize?: string
  }
  toast?: {
    borderRadius?: string
    padding?: string
    shadow?: string
  }
}

/**
 * Complete theme configuration
 */
export interface CompleteThemeConfig {
  name: string
  mode: 'light' | 'dark'
  colors: ColorConfig
  typography: TypographyConfig
  spacing: SpacingConfig
  borders: BorderConfig
  shadows: ShadowConfig
  animations: AnimationConfig
  components?: ComponentOverrides
}

/**
 * Partial theme for customization
 */
export type PartialThemeConfig = {
  name?: string
  mode?: 'light' | 'dark'
  colors?: Partial<ColorConfig>
  typography?: Partial<TypographyConfig>
  spacing?: Partial<SpacingConfig>
  borders?: Partial<BorderConfig>
  shadows?: Partial<ShadowConfig>
  animations?: Partial<AnimationConfig>
  components?: ComponentOverrides
}

/**
 * Theme metadata
 */
export interface ThemeMetadata {
  name: string
  displayName: string
  description: string
  author?: string
  version?: string
  preview?: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
  }
}

/**
 * Exportable theme format
 */
export interface ExportableTheme {
  metadata: ThemeMetadata
  config: CompleteThemeConfig
}
