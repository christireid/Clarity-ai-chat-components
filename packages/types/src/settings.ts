/**
 * Settings-related type definitions
 *
 * This module contains types for user preferences including
 * AI personality, UI preferences, privacy settings, and notifications.
 *
 * @packageDocumentation
 */

/**
 * Theme mode preference.
 *
 * @remarks
 * - `light`: Always use light theme
 * - `dark`: Always use dark theme
 * - `system`: Follow system preference
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * AI response tone style.
 *
 * @remarks
 * Controls how the AI communicates:
 * - `professional`: Formal, business-appropriate
 * - `casual`: Relaxed, conversational
 * - `technical`: Detailed, precise technical language
 * - `friendly`: Warm, approachable
 * - `creative`: Expressive, imaginative
 */
export type ToneStyle =
  | 'professional'
  | 'casual'
  | 'technical'
  | 'friendly'
  | 'creative'

/**
 * AI response verbosity level.
 *
 * @remarks
 * - `concise`: Brief, to-the-point responses
 * - `balanced`: Moderate detail level
 * - `detailed`: Thorough explanations
 * - `comprehensive`: Exhaustive coverage
 */
export type VerbosityLevel =
  | 'concise'
  | 'balanced'
  | 'detailed'
  | 'comprehensive'

/**
 * Message display layout style.
 *
 * @remarks
 * - `bubbles`: Chat bubble style (default)
 * - `compact`: Minimal spacing, dense layout
 * - `spacious`: Extra padding, breathing room
 */
export type MessageLayout = 'bubbles' | 'compact' | 'spacious'

/**
 * UI font size preference.
 */
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large'

/**
 * AI personality and response configuration.
 *
 * @example
 * ```typescript
 * const personality: AIPersonality = {
 *   tone: 'professional',
 *   verbosity: 'balanced',
 *   customInstructions: 'Focus on TypeScript and React topics',
 *   responseLanguage: 'en-US',
 *   formalityLevel: 0.7,
 * }
 * ```
 */
export interface AIPersonality {
  /** Response tone style */
  tone: ToneStyle
  /** Response verbosity level */
  verbosity: VerbosityLevel
  /** Custom instructions for the AI */
  customInstructions?: string
  /** Preferred response language (BCP 47 code) */
  responseLanguage?: string
  /** Formality level (0-1, 0=casual, 1=formal) */
  formalityLevel?: number
}

/**
 * User interface preferences.
 *
 * @example
 * ```typescript
 * const uiPrefs: UIPreferences = {
 *   theme: 'system',
 *   fontSize: 'medium',
 *   messageLayout: 'bubbles',
 *   showTimestamps: true,
 *   showAvatars: true,
 *   enableAnimations: true,
 *   enableSoundEffects: false,
 *   compactMode: false,
 * }
 * ```
 */
export interface UIPreferences {
  /** Theme mode */
  theme: ThemeMode
  /** Font size preference */
  fontSize: FontSize
  /** Message layout style */
  messageLayout: MessageLayout
  /** Show message timestamps */
  showTimestamps: boolean
  /** Show user/AI avatars */
  showAvatars: boolean
  /** Enable UI animations */
  enableAnimations: boolean
  /** Enable sound effects */
  enableSoundEffects: boolean
  /** Enable compact mode (reduced spacing) */
  compactMode: boolean
}

/**
 * Privacy-related settings.
 *
 * @example
 * ```typescript
 * const privacy: PrivacySettings = {
 *   saveHistory: true,
 *   enableAnalytics: false,
 *   shareUsageData: false,
 *   allowTelemetry: false,
 * }
 * ```
 */
export interface PrivacySettings {
  /** Save conversation history */
  saveHistory: boolean
  /** Enable analytics tracking */
  enableAnalytics: boolean
  /** Share anonymized usage data */
  shareUsageData: boolean
  /** Allow telemetry collection */
  allowTelemetry: boolean
}

/**
 * Notification preferences.
 *
 * @example
 * ```typescript
 * const notifications: NotificationSettings = {
 *   email: true,
 *   push: false,
 *   desktop: true,
 *   sound: true,
 *   newMessage: true,
 *   systemUpdates: true,
 * }
 * ```
 */
export interface NotificationSettings {
  /** Email notifications */
  email: boolean
  /** Push notifications */
  push: boolean
  /** Desktop notifications */
  desktop: boolean
  /** Sound alerts */
  sound: boolean
  /** Notify on new messages */
  newMessage: boolean
  /** Notify on system updates */
  systemUpdates: boolean
}

/**
 * Complete user settings configuration.
 *
 * @example
 * ```typescript
 * const settings: UserSettings = {
 *   aiPersonality: { tone: 'professional', verbosity: 'balanced' },
 *   uiPreferences: { theme: 'system', fontSize: 'medium', ... },
 *   privacy: { saveHistory: true, ... },
 *   notifications: { email: true, ... },
 *   shortcuts: { send: 'Enter', newChat: 'Ctrl+N' },
 * }
 * ```
 */
export interface UserSettings {
  /** AI personality configuration */
  aiPersonality: AIPersonality
  /** UI preferences */
  uiPreferences: UIPreferences
  /** Privacy settings */
  privacy: PrivacySettings
  /** Notification preferences */
  notifications: NotificationSettings
  /** Keyboard shortcuts (action -> key combo) */
  shortcuts: Record<string, string>
}

/**
 * Settings section metadata for UI organization.
 *
 * @example
 * ```typescript
 * const section: SettingsSection = {
 *   id: 'ai-personality',
 *   title: 'AI Personality',
 *   description: 'Configure how the AI responds',
 *   icon: 'robot',
 * }
 * ```
 */
export interface SettingsSection {
  /** Unique section identifier */
  id: string
  /** Section display title */
  title: string
  /** Section description */
  description?: string
  /** Section icon identifier */
  icon?: string
}
