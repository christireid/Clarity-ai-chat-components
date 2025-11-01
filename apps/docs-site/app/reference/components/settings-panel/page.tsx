import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings Panel',
  description: 'A comprehensive settings panel for AI personality, UI preferences, privacy, and notifications.',
}

# Settings Panel

A comprehensive settings panel component for managing AI behavior, appearance, privacy, and notifications. Features tabbed navigation and real-time updates.

## Overview

The Settings Panel provides a unified interface for user preferences across four key areas:
- **AI Behavior** - Tone, verbosity, custom instructions, language
- **Appearance** - Theme, font size, layout, display options
- **Privacy** - Data collection, analytics, telemetry
- **Notifications** - Email, push, desktop, sound alerts

### Key Features

- **4 Setting Categories** - AI, UI, Privacy, Notifications
- **Tabbed Navigation** - Easy switching between categories
- **Real-time Updates** - Immediate feedback on changes
- **Unsaved Changes Indicator** - Animated badge when modified
- **Reset to Defaults** - Restore original settings
- **Animated Transitions** - Smooth tab switching
- **Responsive Design** - Adapts to container size
- **Accessibility** - Full keyboard navigation

## Installation

```bash
npm install @clarity-chat/react @clarity-chat/primitives @clarity-chat/types framer-motion
```

## Basic Usage

```tsx
'use client'

import { useState } from 'react'
import { SettingsPanel } from '@clarity-chat/react'
import type { UserSettings } from '@clarity-chat/types'

const defaultSettings: UserSettings = {
  aiPersonality: {
    tone: 'professional',
    verbosity: 'balanced',
    responseLanguage: 'en',
  },
  uiPreferences: {
    theme: 'system',
    fontSize: 'medium',
    messageLayout: 'bubbles',
    showTimestamps: true,
    showAvatars: true,
    enableAnimations: true,
    enableSoundEffects: false,
    compactMode: false,
  },
  privacy: {
    saveHistory: true,
    enableAnalytics: false,
    shareUsageData: false,
    allowTelemetry: false,
  },
  notifications: {
    email: true,
    push: true,
    desktop: false,
    sound: false,
    newMessage: true,
    systemUpdates: true,
  },
  shortcuts: {},
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)

  const handleUpdate = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
    
    // Save to backend
    fetch('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  const handleReset = () => {
    setSettings(defaultSettings)
  }

  return (
    <div className="container max-w-4xl py-8">
      <SettingsPanel
        settings={settings}
        onUpdate={handleUpdate}
        onReset={handleReset}
      />
    </div>
  )
}
```

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `settings` | `UserSettings` | **Required** | Current settings object |
| `onUpdate` | `(settings: Partial<UserSettings>) => void` | **Required** | Callback when settings change |
| `onReset` | `() => void` | `undefined` | Callback to reset to defaults |
| `className` | `string` | `undefined` | Additional CSS classes |

## UserSettings Type

```typescript
interface UserSettings {
  aiPersonality: AIPersonality
  uiPreferences: UIPreferences
  privacy: PrivacySettings
  notifications: NotificationSettings
  shortcuts: Record<string, string>
}
```

## AI Personality Settings

Configure how the AI responds to you.

### AIPersonality Interface

```typescript
interface AIPersonality {
  tone: 'professional' | 'casual' | 'technical' | 'friendly' | 'creative'
  verbosity: 'concise' | 'balanced' | 'detailed' | 'comprehensive'
  customInstructions?: string
  responseLanguage?: string
  formalityLevel?: number
}
```

### Tone Options

- **Professional** - Business-appropriate, formal responses
- **Casual** - Relaxed, conversational style
- **Technical** - Detailed technical explanations
- **Friendly** - Warm, personable interactions
- **Creative** - Imaginative, expressive responses

### Verbosity Levels

- **Concise** - Brief, to-the-point answers
- **Balanced** - Moderate detail (default)
- **Detailed** - Comprehensive explanations
- **Comprehensive** - Exhaustive information

### Custom Instructions

Personalize AI behavior with custom instructions:

```tsx
const settings = {
  aiPersonality: {
    tone: 'professional',
    verbosity: 'balanced',
    customInstructions: 'Always explain concepts using analogies. Assume I have a background in software engineering.',
  },
}
```

## UI Preferences

Customize the appearance and behavior of the interface.

### UIPreferences Interface

```typescript
interface UIPreferences {
  theme: 'light' | 'dark' | 'system'
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  messageLayout: 'bubbles' | 'compact' | 'spacious'
  showTimestamps: boolean
  showAvatars: boolean
  enableAnimations: boolean
  enableSoundEffects: boolean
  compactMode: boolean
}
```

### Theme Options

- **Light** - ☀️ Light color scheme
- **Dark** - 🌙 Dark color scheme
- **System** - 💻 Follow system preference

### Font Sizes

- **Small** - S - Compact text
- **Medium** - M - Standard size (default)
- **Large** - L - Larger text
- **Extra Large** - XL - Maximum readability

### Message Layouts

- **Bubbles** - Traditional chat bubbles
- **Compact** - Dense, minimal spacing
- **Spacious** - Maximum breathing room

## Privacy Settings

Control data collection and sharing.

### PrivacySettings Interface

```typescript
interface PrivacySettings {
  saveHistory: boolean
  enableAnalytics: boolean
  shareUsageData: boolean
  allowTelemetry: boolean
}
```

### Privacy Options

- **Save History** - Store conversations for future reference
- **Enable Analytics** - Help improve the product with usage data
- **Share Usage Data** - Contribute to AI training
- **Allow Telemetry** - Send crash reports and performance data

## Notification Settings

Configure notification preferences.

### NotificationSettings Interface

```typescript
interface NotificationSettings {
  email: boolean
  push: boolean
  desktop: boolean
  sound: boolean
  newMessage: boolean
  systemUpdates: boolean
}
```

### Notification Channels

- **Email** - 📧 Email notifications
- **Push** - 🔔 Mobile push notifications
- **Desktop** - 💻 Desktop notifications
- **Sound** - 🔊 Sound alerts

### Notification Types

- **New Messages** - Notify when new messages arrive
- **System Updates** - Notify about system changes

## Complete Example: Settings Page with Persistence

```tsx
'use client'

import { useState, useEffect } from 'react'
import { SettingsPanel } from '@clarity-chat/react'
import type { UserSettings } from '@clarity-chat/types'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (updates: Partial<UserSettings>) => {
    // Optimistic update
    setSettings(prev => ({ ...prev, ...updates } as UserSettings))

    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      toast.success('Settings updated')
    } catch (error) {
      // Revert on error
      loadSettings()
      toast.error('Failed to update settings')
    }
  }

  const handleReset = async () => {
    try {
      await fetch('/api/settings/reset', { method: 'POST' })
      await loadSettings()
      toast.success('Settings reset to defaults')
    } catch (error) {
      toast.error('Failed to reset settings')
    }
  }

  if (loading) {
    return <div>Loading settings...</div>
  }

  if (!settings) {
    return <div>Failed to load settings</div>
  }

  return (
    <div className="container max-w-4xl py-8">
      <SettingsPanel
        settings={settings}
        onUpdate={handleUpdate}
        onReset={handleReset}
      />
    </div>
  )
}
```

## Complete Example: Backend API Routes

### Next.js App Router API

```typescript
// app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import type { UserSettings } from '@clarity-chat/types'

// GET /api/settings - Load user settings
export async function GET(request: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await db.userSettings.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json(settings || getDefaultSettings())
}

// PATCH /api/settings - Update settings
export async function PATCH(request: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const updates = await request.json()

  const settings = await db.userSettings.update({
    where: { userId: session.user.id },
    data: updates,
  })

  return NextResponse.json(settings)
}

// app/api/settings/reset/route.ts
export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await db.userSettings.update({
    where: { userId: session.user.id },
    data: getDefaultSettings(),
  })

  return NextResponse.json(settings)
}

function getDefaultSettings(): UserSettings {
  return {
    aiPersonality: {
      tone: 'professional',
      verbosity: 'balanced',
      responseLanguage: 'en',
    },
    uiPreferences: {
      theme: 'system',
      fontSize: 'medium',
      messageLayout: 'bubbles',
      showTimestamps: true,
      showAvatars: true,
      enableAnimations: true,
      enableSoundEffects: false,
      compactMode: false,
    },
    privacy: {
      saveHistory: true,
      enableAnalytics: false,
      shareUsageData: false,
      allowTelemetry: false,
    },
    notifications: {
      email: true,
      push: true,
      desktop: false,
      sound: false,
      newMessage: true,
      systemUpdates: true,
    },
    shortcuts: {},
  }
}
```

## Animation Details

### Tab Switching

```typescript
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.2 }}
```

**Effect:** Content slides in from the right when switching tabs

### Unsaved Changes Badge

```typescript
<Badge variant="default" className="animate-pulse">
  Unsaved Changes
</Badge>
```

**Effect:** Pulsing animation to draw attention

## TypeScript Support

Full TypeScript support with comprehensive types:

```typescript
import type {
  SettingsPanelProps,
  UserSettings,
  AIPersonality,
  UIPreferences,
  PrivacySettings,
  NotificationSettings,
  ThemeMode,
  ToneStyle,
  VerbosityLevel,
  MessageLayout,
  FontSize,
} from '@clarity-chat/react'

// All types fully documented
```

## Accessibility

The Settings Panel follows accessibility best practices:

- **Keyboard Navigation** - All controls keyboard accessible
- **Tab Order** - Logical tab flow through settings
- **Labels** - Descriptive labels for all inputs
- **ARIA Attributes** - Proper ARIA roles and states
- **Focus Management** - Visible focus indicators
- **Screen Reader** - All settings announced properly
- **Checkboxes** - Native checkbox inputs

## Styling

### Custom Styles

```tsx
<SettingsPanel
  settings={settings}
  onUpdate={handleUpdate}
  className="max-w-2xl mx-auto shadow-lg"
/>
```

### Theme Integration

The panel automatically adapts to your theme:

```tsx
// Light mode
<SettingsPanel settings={settings} onUpdate={handleUpdate} />

// Dark mode
<div className="dark">
  <SettingsPanel settings={settings} onUpdate={handleUpdate} />
</div>
```

## Related Components

- **[Dialog](../dialog)** - Modal dialogs
- **[Card](../card)** - Card component
- **[Button](../button)** - Action buttons
- **[Collapsible Section](../collapsible-section)** - Expandable sections

## Best Practices

### 1. Save Settings Immediately

Don't require explicit save button:

```tsx
// ✅ Good - auto-save
const handleUpdate = (updates) => {
  setSettings(prev => ({ ...prev, ...updates }))
  saveToBackend(updates)  // Immediate save
}

// ❌ Bad - requires manual save
const handleUpdate = (updates) => {
  setPendingChanges(updates)  // User must click save
}
```

### 2. Provide Default Settings

Always have sensible defaults:

```tsx
// ✅ Good - complete defaults
const defaultSettings: UserSettings = {
  aiPersonality: { tone: 'professional', verbosity: 'balanced', responseLanguage: 'en' },
  uiPreferences: { theme: 'system', fontSize: 'medium', /* ... */ },
  privacy: { saveHistory: true, /* ... */ },
  notifications: { email: true, /* ... */ },
  shortcuts: {},
}

// ❌ Bad - incomplete
const defaultSettings = { aiPersonality: {} }
```

### 3. Validate Settings

Validate before saving:

```tsx
const handleUpdate = (updates) => {
  // Validate
  if (updates.aiPersonality?.customInstructions) {
    if (updates.aiPersonality.customInstructions.length > 1000) {
      toast.error('Custom instructions too long')
      return
    }
  }
  
  // Save
  setSettings(prev => ({ ...prev, ...updates }))
}
```

### 4. Handle Errors Gracefully

Show clear error messages:

```tsx
const handleUpdate = async (updates) => {
  try {
    await saveSettings(updates)
    toast.success('Settings saved')
  } catch (error) {
    toast.error('Failed to save settings. Please try again.')
    // Revert changes
    loadSettings()
  }
}
```

### 5. Confirm Destructive Actions

Confirm before resetting:

```tsx
const handleReset = () => {
  if (confirm('Reset all settings to defaults?')) {
    resetSettings()
  }
}
```

### 6. Apply Theme Changes Immediately

Update theme instantly:

```tsx
const handleThemeChange = (theme: ThemeMode) => {
  handleUpdate({ uiPreferences: { ...settings.uiPreferences, theme } })
  
  // Apply immediately
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark')
  }
}
```

### 7. Persist Settings

Save to localStorage or backend:

```tsx
// Save to localStorage for offline access
useEffect(() => {
  localStorage.setItem('settings', JSON.stringify(settings))
}, [settings])

// Sync to backend
useEffect(() => {
  const sync = async () => {
    await fetch('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    })
  }
  
  const timeout = setTimeout(sync, 1000) // Debounce
  return () => clearTimeout(timeout)
}, [settings])
```

## Use Cases

### 1. User Preferences

Personal customization:

```tsx
<SettingsPanel
  settings={userSettings}
  onUpdate={updateUserPreferences}
/>
```

### 2. Admin Dashboard

System-wide settings:

```tsx
<SettingsPanel
  settings={systemSettings}
  onUpdate={updateSystemSettings}
  onReset={restoreDefaults}
/>
```

### 3. Chat Customization

AI behavior tuning:

```tsx
<SettingsPanel
  settings={chatSettings}
  onUpdate={(updates) => {
    updateSettings(updates)
    // Reload chat with new settings
    reloadChat()
  }}
/>
```

### 4. Onboarding

First-time setup:

```tsx
<WizardStep title="Customize Your Experience">
  <SettingsPanel
    settings={initialSettings}
    onUpdate={updateOnboardingSettings}
  />
</WizardStep>
```

## Performance Tips

### 1. Debounce Backend Saves

Avoid excessive API calls:

```tsx
const debouncedSave = useMemo(
  () => debounce((settings) => saveToBackend(settings), 1000),
  []
)

const handleUpdate = (updates) => {
  setSettings(prev => ({ ...prev, ...updates }))
  debouncedSave({ ...settings, ...updates })
}
```

### 2. Lazy Load Tabs

Only render active tab content:

```tsx
{activeTab === 'ai' && <AISettings />}
{activeTab === 'ui' && <UISettings />}
// vs rendering all tabs and hiding with CSS
```

### 3. Memoize Complex Calculations

```tsx
const computedTheme = useMemo(() => {
  if (settings.uiPreferences.theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return settings.uiPreferences.theme
}, [settings.uiPreferences.theme])
```

---

**Related Documentation:**
- [Dialog](../dialog)
- [Card](../card)
- [Button](../button)
- [Collapsible Section](../collapsible-section)
