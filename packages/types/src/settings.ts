/**
 * Settings-related type definitions
 */

export type ThemeMode = 'light' | 'dark' | 'system'

export type ToneStyle = 'professional' | 'casual' | 'technical' | 'friendly' | 'creative'

export type VerbosityLevel = 'concise' | 'balanced' | 'detailed' | 'comprehensive'

export type MessageLayout = 'bubbles' | 'compact' | 'spacious'

export type FontSize = 'small' | 'medium' | 'large' | 'extra-large'

export interface AIPersonality {
  tone: ToneStyle
  verbosity: VerbosityLevel
  customInstructions?: string
  responseLanguage?: string
  formalityLevel?: number
}

export interface UIPreferences {
  theme: ThemeMode
  fontSize: FontSize
  messageLayout: MessageLayout
  showTimestamps: boolean
  showAvatars: boolean
  enableAnimations: boolean
  enableSoundEffects: boolean
  compactMode: boolean
}

export interface PrivacySettings {
  saveHistory: boolean
  enableAnalytics: boolean
  shareUsageData: boolean
  allowTelemetry: boolean
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  desktop: boolean
  sound: boolean
  newMessage: boolean
  systemUpdates: boolean
}

export interface UserSettings {
  aiPersonality: AIPersonality
  uiPreferences: UIPreferences
  privacy: PrivacySettings
  notifications: NotificationSettings
  shortcuts: Record<string, string>
}

export interface SettingsSection {
  id: string
  title: string
  description?: string
  icon?: string
}
