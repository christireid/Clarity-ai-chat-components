/**
 * Clarity Chat - Enhanced Design Tokens for 2025
 * 
 * Advanced design tokens implementing 2025 UI/UX trends:
 * - Glassmorphism 2.0 with refined transparency
 * - Aurora gradients with dynamic flows
 * - Neumorphism with tactile realism
 * - AI-powered adaptive colors
 * - Quantum-inspired animations
 */

import type { HSLValue } from './colors'

/**
 * Glassmorphism design tokens
 * Creates frosted glass effects with depth
 */
export interface GlassmorphismTokens {
  // Base glass effects
  glassOverlay: string
  glassBorder: string
  glassBlur: string
  glassShadow: string
  
  // Transparency levels
  glassLight: string
  glassMedium: string
  glassDark: string
  
  // Advanced glass effects
  glassMorphism: string
  glassBackdrop: string
  glassHighlight: string
}

/**
 * Aurora gradient tokens
 * Dynamic flowing gradients inspired by natural phenomena
 */
export interface AuroraTokens {
  // Primary aurora flows
  auroraPrimary: string
  auroraSecondary: string
  auroraTertiary: string
  
  // Time-based aurora variations
  auroraDawn: string
  auroraDusk: string
  auroraMidnight: string
  auroraNoon: string
  
  // Animated aurora gradients
  auroraFlow: string
  auroraWave: string
  auroraPulse: string
  
  // Aurora backgrounds
  auroraBackground: string
  auroraOverlay: string
  auroraGlow: string
}

/**
 * Neumorphism design tokens
 * Soft, extruded UI elements with tactile feel
 */
export interface NeumorphismTokens {
  // Base neumorphic colors
  neumorphicLight: string
  neumorphicDark: string
  
  // Neumorphic shadows
  neumorphicConcave: string
  neumorphicConvex: string
  neumorphicFlat: string
  
  // Advanced neumorphism
  neumorphicPressed: string
  neumorphicRaised: string
  neumorphicInset: string
  
  // Neumorphic highlights
  neumorphicHighlight: string
  neumorphicLowlight: string
}

/**
 * AI-powered adaptive tokens
 * Colors that change based on context and user behavior
 */
export interface AdaptiveTokens {
  // Context-adaptive colors
  adaptivePrimary: string
  adaptiveSecondary: string
  adaptiveAccent: string
  
  // Time-based adaptation
  adaptiveMorning: string
  adaptiveAfternoon: string
  adaptiveEvening: string
  adaptiveNight: string
  
  // Mood-based colors
  adaptiveCalm: string
  adaptiveEnergetic: string
  adaptiveFocus: string
  adaptiveCreative: string
}

/**
 * Quantum-inspired animation tokens
 * Advanced animation curves and durations
 */
export interface QuantumAnimationTokens {
  // Quantum timing functions
  quantumEase: string
  quantumBounce: string
  quantumSpring: string
  quantumMagnetic: string
  
  // Particle animation durations
  particleFast: string
  particleMedium: string
  particleSlow: string
  
  // Wave animation properties
  waveDuration: string
  waveAmplitude: string
  waveFrequency: string
  
  // Entanglement effects
  entangleDuration: string
  entangleDelay: string
  entangleStagger: string
}

/**
 * Enhanced color palette with 2025 trends
 */
export interface EnhancedColorTokens {
  // Base colors (enhanced for 2025)
  background: HSLValue
  backgroundElevated: HSLValue
  backgroundFloating: HSLValue
  foreground: HSLValue
  foregroundMuted: HSLValue
  foregroundSubtle: HSLValue
  
  // Surface colors with depth
  surface: HSLValue
  surfaceElevated: HSLValue
  surfaceFloating: HSLValue
  surfaceOverlay: HSLValue
  surfaceGlass: HSLValue
  
  // Brand colors with gradients
  primary: HSLValue
  primaryGradient: string
  secondary: HSLValue
  secondaryGradient: string
  accent: HSLValue
  accentGradient: string
  
  // AI-specific colors
  aiThinking: HSLValue
  aiProcessing: HSLValue
  aiComplete: HSLValue
  aiError: HSLValue
  
  // Enhanced state colors
  success: HSLValue
  successSubtle: HSLValue
  warning: HSLValue
  warningSubtle: HSLValue
  error: HSLValue
  errorSubtle: HSLValue
  info: HSLValue
  infoSubtle: HSLValue
  
  // Contextual colors
  contextUser: HSLValue
  contextAssistant: HSLValue
  contextSystem: HSLValue
  contextError: HSLValue
}

/**
 * Semantic color tokens for AI chat interfaces
 */
export interface SemanticTokens {
  // Message-specific colors
  messageUser: HSLValue
  messageAssistant: HSLValue
  messageSystem: HSLValue
  messageError: HSLValue
  
  // Chat state colors
  chatActive: HSLValue
  chatInactive: HSLValue
  chatWaiting: HSLValue
  chatProcessing: HSLValue
  
  // Input field colors
  inputActive: HSLValue
  inputInactive: HSLValue
  inputError: HSLValue
  inputSuccess: HSLValue
  
  // Button state colors
  buttonPrimary: HSLValue
  buttonSecondary: HSLValue
  buttonTertiary: HSLValue
  buttonDanger: HSLValue
}

/**
 * Complete enhanced design tokens for 2025
 */
export interface EnhancedDesignTokens extends 
  EnhancedColorTokens,
  GlassmorphismTokens,
  AuroraTokens,
  NeumorphismTokens,
  AdaptiveTokens,
  SemanticTokens {
  // Animation tokens
  animation: QuantumAnimationTokens
  
  // Spacing tokens with golden ratio
  spacing: {
    golden: string
    phi: string
    fibonacci: string[]
  }
  
  // Typography with variable fonts
  typography: {
    fontVariable: string
    fontMono: string
    fontDisplay: string
    fontWeight: {
      light: number
      regular: number
      medium: number
      semibold: number
      bold: number
    }
  }
}

/**
 * Glassmorphism tokens implementation
 */
export const glassmorphismTokens: GlassmorphismTokens = {
  glassOverlay: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  glassBlur: 'blur(20px)',
  glassShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  
  glassLight: 'rgba(255, 255, 255, 0.15)',
  glassMedium: 'rgba(255, 255, 255, 0.25)',
  glassDark: 'rgba(255, 255, 255, 0.35)',
  
  glassMorphism: 'background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2)',
  glassBackdrop: 'backdrop-filter: blur(20px)',
  glassHighlight: 'rgba(255, 255, 255, 0.4)',
}

/**
 * Aurora gradient tokens implementation
 */
export const auroraTokens: AuroraTokens = {
  // Primary aurora flows
  auroraPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  auroraSecondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  auroraTertiary: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  
  // Time-based aurora variations
  auroraDawn: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
  auroraDusk: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  auroraMidnight: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
  auroraNoon: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
  
  // Animated aurora gradients
  auroraFlow: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)',
  auroraWave: 'linear-gradient(60deg, #667eea, #764ba2, #f093fb, #f5576c)',
  auroraPulse: 'linear-gradient(90deg, #e74c3c, #f39c12, #2ecc71, #3498db, #9b59b6)',
  
  // Aurora backgrounds
  auroraBackground: 'radial-gradient(ellipse at top, #667eea 0%, #764ba2 100%)',
  auroraOverlay: 'radial-gradient(circle at 20% 80%, #667eea 0%, transparent 50%)',
  auroraGlow: 'radial-gradient(circle at center, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
}

/**
 * Neumorphism tokens implementation
 */
export const neumorphismTokens: NeumorphismTokens = {
  neumorphicLight: 'rgba(255, 255, 255, 0.7)',
  neumorphicDark: 'rgba(0, 0, 0, 0.1)',
  
  neumorphicConcave: 'inset 5px 5px 10px rgba(0,0,0,0.1), inset -5px -5px 10px rgba(255,255,255,0.7)',
  neumorphicConvex: '5px 5px 10px rgba(0,0,0,0.1), -5px -5px 10px rgba(255,255,255,0.7)',
  neumorphicFlat: '2px 2px 5px rgba(0,0,0,0.05), -2px -2px 5px rgba(255,255,255,0.7)',
  
  neumorphicPressed: 'inset 2px 2px 5px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,0.7)',
  neumorphicRaised: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)',
  neumorphicInset: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
  
  neumorphicHighlight: 'rgba(255, 255, 255, 0.8)',
  neumorphicLowlight: 'rgba(0, 0, 0, 0.15)',
}

/**
 * Enhanced color tokens implementation
 */
export const enhancedLightColors: Partial<EnhancedColorTokens> = {
  // Base colors with elevation
  background: '0 0% 100%',
  backgroundElevated: '0 0% 98%',
  backgroundFloating: '0 0% 96%',
  foreground: '222 47% 11%',
  foregroundMuted: '222 20% 40%',
  foregroundSubtle: '222 10% 60%',
  
  // Surface colors with depth
  surface: '0 0% 100%',
  surfaceElevated: '0 0% 98%',
  surfaceFloating: '0 0% 96%',
  surfaceOverlay: '0 0% 94%',
  surfaceGlass: '0 0% 100%',
  
  // Brand colors with gradients
  primary: '239 84% 56%',
  primaryGradient: 'linear-gradient(135deg, hsl(239, 84%, 56%) 0%, hsl(221, 83%, 53%) 100%)',
  secondary: '240 5% 96%',
  secondaryGradient: 'linear-gradient(135deg, hsl(240, 5%, 96%) 0%, hsl(240, 5%, 92%) 100%)',
  accent: '343 84% 61%',
  accentGradient: 'linear-gradient(135deg, hsl(343, 84%, 61%) 0%, hsl(323, 84%, 58%) 100%)',
  
  // AI-specific colors
  aiThinking: '221 83% 53%',
  aiProcessing: '142 76% 36%',
  aiComplete: '142 71% 45%',
  aiError: '0 84% 60%',
}

/**
 * Complete enhanced design tokens for light mode
 */
export const enhancedLightTokens: EnhancedDesignTokens = {
  // Enhanced colors
  ...enhancedLightColors,
  
  // Glassmorphism
  ...glassmorphismTokens,
  
  // Aurora gradients
  ...auroraTokens,
  
  // Neumorphism
  ...neumorphismTokens,
  
  // Adaptive colors
  adaptivePrimary: '239 84% 56%',
  adaptiveSecondary: '240 5% 96%',
  adaptiveAccent: '343 84% 61%',
  
  // Time-based adaptation
  adaptiveMorning: '35 91% 65%',
  adaptiveAfternoon: '221 83% 53%',
  adaptiveEvening: '343 84% 61%',
  adaptiveNight: '262 84% 58%',
  
  // Mood-based colors
  adaptiveCalm: '194 84% 65%',
  adaptiveEnergetic: '35 91% 65%',
  adaptiveFocus: '221 83% 53%',
  adaptiveCreative: '282 84% 58%',
  
  // Semantic colors
  messageUser: '221 83% 53%',
  messageAssistant: '239 84% 56%',
  messageSystem: '142 76% 36%',
  messageError: '0 84% 60%',
  
  chatActive: '142 71% 45%',
  chatInactive: '220 9% 46%',
  chatWaiting: '35 91% 65%',
  chatProcessing: '221 83% 53%',
  
  inputActive: '239 84% 56%',
  inputInactive: '220 9% 46%',
  inputError: '0 84% 60%',
  inputSuccess: '142 71% 45%',
  
  buttonPrimary: '239 84% 56%',
  buttonSecondary: '240 5% 96%',
  buttonTertiary: '0 0% 100%',
  buttonDanger: '0 84% 60%',
  
  // Animation tokens
  animation: {
    quantumEase: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    quantumBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    quantumSpring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    quantumMagnetic: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    particleFast: '150ms',
    particleMedium: '300ms',
    particleSlow: '600ms',
    
    waveDuration: '2s',
    waveAmplitude: '10px',
    waveFrequency: '0.5Hz',
    
    entangleDuration: '400ms',
    entangleDelay: '100ms',
    entangleStagger: '50ms',
  },
  
  // Spacing tokens
  spacing: {
    golden: '1.618',
    phi: '0.618',
    fibonacci: ['2px', '3px', '5px', '8px', '13px', '21px', '34px', '55px', '89px'],
  },
  
  // Typography
  typography: {
    fontVariable: '"Inter var", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontMono: '"Fira Code", "Monaco", "Cascadia Code", "Roboto Mono", monospace',
    fontDisplay: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
}

/**
 * Dark mode enhanced tokens
 */
export const enhancedDarkColors: Partial<EnhancedColorTokens> = {
  background: '222 47% 11%',
  backgroundElevated: '222 35% 15%',
  backgroundFloating: '222 25% 20%',
  foreground: '0 0% 95%',
  foregroundMuted: '0 0% 80%',
  foregroundSubtle: '0 0% 65%',
  
  surface: '222 47% 11%',
  surfaceElevated: '222 35% 15%',
  surfaceFloating: '222 25% 20%',
  surfaceOverlay: '222 15% 25%',
  surfaceGlass: '222 47% 11%',
  
  primary: '239 84% 67%',
  primaryGradient: 'linear-gradient(135deg, hsl(239, 84%, 67%) 0%, hsl(221, 83%, 64%) 100%)',
  secondary: '240 5% 20%',
  secondaryGradient: 'linear-gradient(135deg, hsl(240, 5%, 20%) 0%, hsl(240, 5%, 24%) 100%)',
  accent: '343 84% 66%',
  accentGradient: 'linear-gradient(135deg, hsl(343, 84%, 66%) 0%, hsl(323, 84%, 63%) 100%)',
  
  aiThinking: '221 83% 64%',
  aiProcessing: '142 76% 46%',
  aiComplete: '142 71% 55%',
  aiError: '0 84% 70%',
}

/**
 * Export enhanced tokens
 */
export const enhancedDesignTokens = {
  light: enhancedLightTokens,
  dark: {
    ...enhancedLightTokens,
    ...enhancedDarkColors,
  },
}