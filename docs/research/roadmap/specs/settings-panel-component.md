# Settings Panel Component Specification

**Component Name**: `SettingsPanel` **Created**: 2026-01-27 **Status**: Design Specification
**Priority**: High **Related Components**: ChatInterface, ModelSelector, ThemeProvider

---

## Executive Summary

The Settings Panel component provides a comprehensive, user-friendly interface for configuring chat
behavior, appearance, model selection, and API integrations. Drawing inspiration from Prompt Kit's
organized settings drawer and HuggingChat's progressive disclosure pattern, this component serves
both beginner users (with sensible defaults) and power users (with advanced controls).

### Key Features

- Theme switching (Light/Dark/System)
- Model selection with provider transparency
- API key management with security
- Chat behavior configuration (temperature, tokens, streaming)
- Appearance customization (density, font size)
- Privacy and data controls
- Export/import settings
- Reset to defaults

### Design Philosophy

1. **Progressive Disclosure**: Simple by default, advanced options discoverable
2. **Visual Feedback**: Real-time preview of changes
3. **Validation First**: Prevent invalid configurations
4. **Security Conscious**: Secure handling of API keys and sensitive data
5. **Accessibility**: Keyboard navigation, ARIA labels, screen reader support

---

## Component Architecture

### Display Patterns

#### Drawer/Modal Hybrid

```
┌─────────────────────────────────────────┐
│  Settings                          [×]  │  ← Header with close button
├────────────┬────────────────────────────┤
│  General   │  Theme Settings            │
│  Model     │  ○ Light                   │
│  API Keys  │  ● Dark                    │  ← Section content
│  Behavior  │  ○ System                  │
│  Privacy   │  [Preview changes]         │
│  Advanced  │                            │
│            │  [Save] [Cancel] [Reset]   │  ← Actions
└────────────┴────────────────────────────┘
   ↑
   Navigation tabs/sidebar
```

#### Responsive Behavior

- **Desktop**: Slide-out drawer from right (400-500px width)
- **Tablet**: Full-width modal with scrollable sections
- **Mobile**: Full-screen overlay with section navigation

### Section Organization

```typescript
interface SettingsSections {
  general: GeneralSettings
  model: ModelSettings
  apiKeys: APIKeySettings
  behavior: BehaviorSettings
  appearance: AppearanceSettings
  privacy: PrivacySettings
  advanced: AdvancedSettings
}
```

---

## Section Specifications

### 1. General Settings

**Purpose**: Core application preferences **Visibility**: Always visible

#### Configuration Options

```typescript
interface GeneralSettings {
  language: string // UI language selection
  timezone: string // Timezone for timestamps
  autoSave: boolean // Auto-save conversations
  notifications: boolean // Enable notifications
  keyboardShortcuts: boolean // Enable shortcuts
}
```

#### UI Components

- **Language Selector**: Dropdown with flag icons
- **Timezone Selector**: Searchable dropdown with offset display
- **Toggle Switches**: For boolean settings
- **Help Text**: Brief description under each option

#### Example Layout

```
General Settings
─────────────────────────────────────────
Language
[English (US) ▼]
Interface language for the application

Timezone
[UTC-5 Eastern Time ▼]
Used for displaying message timestamps

Auto-save Conversations         [ON/OFF]
Automatically save chat history

Keyboard Shortcuts Enabled      [ON/OFF]
Enable keyboard shortcuts (Ctrl+K, etc.)
```

---

### 2. Model Settings

**Purpose**: Model selection and provider configuration **Inspiration**: HuggingChat's
multi-provider transparency

#### Configuration Options

```typescript
interface ModelSettings {
  selectedModel: string // Model identifier
  provider: string // Provider name
  autoRouting: boolean // Enable intelligent routing
  fallbackModel?: string // Fallback if primary unavailable
  showModelInfo: boolean // Display model capabilities
}
```

#### Model Selection UI

```typescript
interface ModelOption {
  id: string // "gpt-4", "claude-3-opus"
  name: string // Display name
  provider: string // "openai", "anthropic"
  capabilities: {
    multimodal: boolean
    supportsTools: boolean
    contextLength: number
    streamingSupport: boolean
  }
  pricing: {
    input: number // per 1M tokens
    output: number // per 1M tokens
  }
  description: string
}
```

#### UI Components

- **Model Dropdown**: Grouped by provider with capabilities badges
- **Provider Selector**: Radio buttons or tabs per model
- **Capability Badges**: Visual indicators (vision, tools, long-context)
- **Auto-Routing Toggle**: Enable Omni-style intelligent routing
- **Model Info Card**: Expandable details about selected model

#### Example Layout

```
Model Settings
─────────────────────────────────────────
Selected Model
[GPT-4 Turbo ▼]
Provider: OpenAI

Capabilities: [Vision] [Tools] [128K Context]

Cost: $10.00/1M in • $30.00/1M out
Context Length: 128,000 tokens

Auto-Routing                    [ON/OFF]
Automatically select best model per query

Fallback Model
[GPT-3.5 Turbo ▼]
Used if primary model unavailable
```

---

### 3. API Keys Settings

**Purpose**: Secure API credential management **Security**: Critical - handle with encryption

#### Configuration Options

```typescript
interface APIKeySettings {
  providers: {
    [provider: string]: {
      apiKey: string // Encrypted storage
      baseURL?: string // Custom endpoint
      organization?: string // Org ID if applicable
      verified: boolean // Connection tested
      lastVerified?: Date
    }
  }
  storageLocation: 'local' | 'environment' | 'secure' // Where keys stored
}
```

#### UI Components

- **Provider Tabs**: Switch between OpenAI, Anthropic, etc.
- **Masked Input**: Show/hide API key
- **Test Connection**: Validate API key
- **Storage Notice**: Clear indication of where keys stored
- **Delete Button**: Remove stored keys

#### Example Layout

```
API Keys
─────────────────────────────────────────
[OpenAI] [Anthropic] [HuggingFace] [Custom]

OpenAI API Key
[sk-••••••••••••••••••••••••••] [👁]
[Test Connection] [Remove]

✓ Verified on Jan 27, 2026 at 2:30 PM

Base URL (Optional)
[https://api.openai.com/v1]

Organization ID (Optional)
[org-••••••••••••]

⚠️ Security Notice
Keys are encrypted and stored locally in your
browser. Never commit API keys to version control.

[Import from .env] [Export Configuration]
```

#### Security Features

1. **Encryption**: AES-256 encryption before localStorage
2. **Masking**: Display as `sk-••••••••••`
3. **Show/Hide Toggle**: Explicit user action to reveal
4. **Connection Testing**: Verify before saving
5. **Clear Warnings**: Security best practices
6. **Auto-Clear**: Option to clear on logout

---

### 4. Behavior Settings

**Purpose**: Control chat interaction parameters **Audience**: Power users, developers

#### Configuration Options

```typescript
interface BehaviorSettings {
  temperature: number // 0-2, creativity control
  maxTokens: number // Response length limit
  topP: number // Nucleus sampling
  frequencyPenalty: number // -2 to 2
  presencePenalty: number // -2 to 2
  stopSequences: string[] // Custom stop sequences
  streaming: boolean // Stream responses
  systemPrompt: string // Default system prompt
}
```

#### UI Components

- **Sliders**: For numeric ranges (temperature, penalties)
- **Number Inputs**: For discrete values (maxTokens)
- **Textarea**: For system prompt
- **Tag Input**: For stop sequences
- **Preset Buttons**: Quick presets (Creative, Balanced, Precise)

#### Example Layout

```
Behavior Settings
─────────────────────────────────────────
Presets: [Creative] [Balanced] [Precise] [Custom]

Temperature                     1.0
[────●─────────────] 0.0 ←─────────→ 2.0
Controls randomness (higher = more creative)

Max Response Tokens            2048
[        2048        ]
Maximum length of AI responses

Top P                          0.95
[───────────●──────] 0.0 ←─────────→ 1.0
Nucleus sampling threshold

Frequency Penalty               0.0
[─────●────────────] -2.0 ←────────→ 2.0
Penalize repeated tokens

Presence Penalty                0.0
[─────●────────────] -2.0 ←────────→ 2.0
Encourage topic diversity

Enable Streaming               [ON/OFF]
Display responses as they generate

System Prompt
┌─────────────────────────────────────┐
│ You are a helpful assistant that    │
│ provides clear, accurate answers.   │
│                                     │
└─────────────────────────────────────┘

Stop Sequences (Optional)
[user:] [assistant:] [+ Add]
```

#### Presets System

```typescript
const BehaviorPresets = {
  Creative: {
    temperature: 1.5,
    topP: 0.95,
    frequencyPenalty: 0.5,
    presencePenalty: 0.5,
  },
  Balanced: {
    temperature: 1.0,
    topP: 0.95,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
  },
  Precise: {
    temperature: 0.3,
    topP: 0.9,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
  },
}
```

---

### 5. Appearance Settings

**Purpose**: Visual customization and accessibility **Inspiration**: Prompt Kit's theme system

#### Configuration Options

```typescript
interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system' // Theme preference
  density: 'compact' | 'comfortable' | 'spacious' // UI density
  fontSize: 'small' | 'medium' | 'large' | 'xlarge' // Text size
  fontFamily: string // Font selection
  codeTheme: string // Syntax highlighting theme
  borderRadius: 'none' | 'small' | 'medium' | 'large' // Corner rounding
  showTimestamps: boolean // Display message timestamps
  showAvatars: boolean // Display user/assistant avatars
  messageAlignment: 'left' | 'alternating' // Message layout
}
```

#### UI Components

- **Theme Selector**: Cards with preview for Light/Dark/System
- **Density Radio**: Visual examples of each density
- **Font Size Slider**: With live preview
- **Font Dropdown**: System fonts + custom
- **Code Theme Gallery**: Previews of syntax themes
- **Toggle Switches**: For boolean preferences

#### Example Layout

```
Appearance
─────────────────────────────────────────
Theme
┌─────────┬─────────┬─────────┐
│  Light  │  Dark   │ System  │  ← Preview cards
│    ○    │    ●    │    ○    │
└─────────┴─────────┴─────────┘

UI Density
○ Compact    ● Comfortable    ○ Spacious
More data    Balanced         More space

Font Size                       Medium
[───────●──────────] Small ←──────→ XLarge
Preview: The quick brown fox jumps...

Message Font
[System UI (Default) ▼]

Code Font
[JetBrains Mono ▼]

Code Theme
[Night Owl ▼] [Preview]
┌─────────────────────────────────────┐
│ function hello() {                  │
│   console.log("Hello, world!");     │
│ }                                   │
└─────────────────────────────────────┘

Border Radius
○ None    ○ Small    ● Medium    ○ Large

Show Timestamps                 [ON/OFF]
Display message timestamps

Show Avatars                    [ON/OFF]
Show user and assistant avatars

Message Alignment
● Alternating (User right, AI left)
○ All Left-Aligned
```

#### Theme System Implementation

```typescript
interface ThemeConfig {
  name: string
  colors: {
    background: string
    foreground: string
    card: string
    cardForeground: string
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
  }
}
```

---

### 6. Privacy Settings

**Purpose**: Data control and privacy preferences **Inspiration**: HuggingChat's privacy-first
approach

#### Configuration Options

```typescript
interface PrivacySettings {
  saveHistory: boolean // Store conversation history
  analytics: boolean // Enable usage analytics
  dataSharing: boolean // Share usage with providers
  autoDelete: boolean // Auto-delete old conversations
  autoDeleteDays: number // Days before deletion
  exportFormat: 'json' | 'markdown' | 'txt' // Export format
  anonymizeExports: boolean // Remove identifiable data
}
```

#### UI Components

- **Privacy Toggles**: Clear on/off switches
- **Data Visualization**: Show current storage usage
- **Export Button**: Download all data
- **Delete Button**: Clear all data with confirmation
- **Auto-Delete Slider**: Days to retention

#### Example Layout

```
Privacy & Data
─────────────────────────────────────────
Conversation History

Save Conversations              [ON/OFF]
Store chat history for later access

Current Storage: 15.3 MB (42 conversations)
[View History] [Export All] [Delete All]

Auto-Delete Old Conversations   [ON/OFF]
Delete after:    [30] days

Analytics & Telemetry

Enable Usage Analytics          [ON/OFF]
Help improve the product (no personal data)

⚠️ Provider Analytics: OpenAI, Anthropic may
collect usage data per their privacy policies.

Data Export

Export Format: [JSON ▼]
○ JSON   ○ Markdown   ○ Plain Text

[Export All Conversations]

Anonymize Exports               [ON/OFF]
Remove timestamps and metadata

Data Deletion

[Delete All Data]
Permanently remove all conversations, settings,
and stored API keys from this device.
```

---

### 7. Advanced Settings

**Purpose**: Expert-level configuration **Visibility**: Collapsed by default

#### Configuration Options

```typescript
interface AdvancedSettings {
  customEndpoint: string // Custom API endpoint
  requestTimeout: number // Timeout in milliseconds
  retryAttempts: number // Failed request retries
  caching: boolean // Enable response caching
  cacheTTL: number // Cache time-to-live
  debugMode: boolean // Show debug information
  experimentalFeatures: boolean // Enable beta features
  customHeaders: Record<string, string> // Custom HTTP headers
}
```

#### UI Components

- **Expandable Section**: Hidden unless user clicks "Advanced"
- **Text Inputs**: For endpoints and headers
- **Number Inputs**: For timeouts and retries
- **Warning Badges**: Indicate experimental features

#### Example Layout

```
Advanced Settings
─────────────────────────────────────────
⚠️ Caution: Changing these settings may affect
application stability and performance.

Custom API Endpoint
[https://api.openai.com/v1]
Override default API endpoint

Request Timeout                 30000
[        30000       ] milliseconds
Time before request fails

Retry Attempts                  3
[    3    ]
Number of retries on failure

Response Caching                [ON/OFF]
Cache API responses locally

Cache TTL                       3600
[        3600       ] seconds
Time before cache expires

Debug Mode                      [ON/OFF]
Show detailed logs and errors

Experimental Features           [ON/OFF]
Enable beta and unreleased features

Custom Headers (JSON)
┌─────────────────────────────────────┐
│ {                                   │
│   "X-Custom-Header": "value"        │
│ }                                   │
└─────────────────────────────────────┘

[Validate Configuration]
```

---

## Component Props API

```typescript
interface SettingsPanelProps {
  // Display control
  isOpen: boolean
  onClose: () => void
  displayMode?: 'drawer' | 'modal' | 'fullscreen'

  // Configuration
  settings: Settings
  onSettingsChange: (settings: Settings) => void

  // Section control
  defaultSection?: keyof SettingsSections
  visibleSections?: Array<keyof SettingsSections>

  // Behavior
  autoSave?: boolean // Save on change vs manual save
  showUnsavedWarning?: boolean // Warn on close with unsaved

  // Customization
  customSections?: CustomSection[] // Add custom sections
  sectionOrder?: Array<keyof SettingsSections> // Reorder sections

  // Callbacks
  onSave?: (settings: Settings) => void
  onCancel?: () => void
  onReset?: () => void
  onExport?: (format: string) => void
  onImport?: (data: unknown) => void

  // Validation
  validators?: SettingsValidators

  // Accessibility
  ariaLabel?: string
  closeLabel?: string
}

interface Settings {
  general: GeneralSettings
  model: ModelSettings
  apiKeys: APIKeySettings
  behavior: BehaviorSettings
  appearance: AppearanceSettings
  privacy: PrivacySettings
  advanced: AdvancedSettings
}

interface CustomSection {
  id: string
  label: string
  icon?: React.ReactNode
  component: React.ComponentType<CustomSectionProps>
}

interface SettingsValidators {
  [key: string]: (value: unknown) => boolean | string
}
```

---

## Usage Examples

### Basic Usage

```tsx
import { SettingsPanel } from '@clarity/chat-components'

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  return (
    <>
      <button onClick={() => setSettingsOpen(true)}>Settings</button>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
        autoSave={true}
      />
    </>
  )
}
```

### Advanced Usage with Custom Sections

```tsx
import { SettingsPanel } from '@clarity/chat-components'

function CustomIntegrations(props: CustomSectionProps) {
  return (
    <div>
      <h3>Third-Party Integrations</h3>
      <button>Connect Slack</button>
      <button>Connect Discord</button>
    </div>
  )
}

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  const customSections: CustomSection[] = [
    {
      id: 'integrations',
      label: 'Integrations',
      icon: <PlugIcon />,
      component: CustomIntegrations,
    },
  ]

  return (
    <SettingsPanel
      isOpen={settingsOpen}
      onClose={() => setSettingsOpen(false)}
      settings={settings}
      onSettingsChange={setSettings}
      customSections={customSections}
      sectionOrder={['general', 'model', 'integrations', 'appearance']}
      validators={{
        'apiKeys.providers.openai.apiKey': (value) => {
          if (!value || typeof value !== 'string') return 'API key required'
          if (!value.startsWith('sk-')) return 'Invalid OpenAI key format'
          return true
        },
      }}
      onSave={(settings) => {
        console.log('Settings saved:', settings)
        localStorage.setItem('chat-settings', JSON.stringify(settings))
      }}
    />
  )
}
```

### Preset-Based Configuration

```tsx
import { SettingsPanel, SettingsPresets } from '@clarity/chat-components'

function App() {
  const [settings, setSettings] = useState<Settings>(SettingsPresets.CodeAssistant)

  return (
    <SettingsPanel
      settings={settings}
      onSettingsChange={setSettings}
      // CodeAssistant preset includes:
      // - Precise behavior (low temperature)
      // - Code-optimized appearance
      // - Longer max tokens
      // - Code-focused system prompt
    />
  )
}

// Available presets
export const SettingsPresets = {
  Default: defaultSettings,
  CodeAssistant: codeAssistantSettings,
  CreativeWriter: creativeWriterSettings,
  CustomerSupport: customerSupportSettings,
  ResearchAnalyst: researchAnalystSettings,
}
```

---

## State Management

### Local State Pattern

```typescript
// Component manages settings internally
const [settings, setSettings] = useState<Settings>(defaultSettings)

// Sync to localStorage on change
useEffect(() => {
  localStorage.setItem('clarity-settings', JSON.stringify(settings))
}, [settings])

// Load from localStorage on mount
useEffect(() => {
  const stored = localStorage.getItem('clarity-settings')
  if (stored) {
    setSettings(JSON.parse(stored))
  }
}, [])
```

### Context Pattern

```typescript
// Provide settings globally
import { SettingsProvider, useSettings } from '@clarity/chat-components'

function App() {
  return (
    <SettingsProvider defaultSettings={mySettings}>
      <ChatInterface />
    </SettingsProvider>
  )
}

// Consume anywhere
function ChatMessage() {
  const { settings, updateSettings } = useSettings()

  return (
    <div style={{ fontSize: settings.appearance.fontSize }}>
      {message.content}
    </div>
  )
}
```

### External State Management

```typescript
// Redux/Zustand/etc.
import { useAppSettings, updateSettings } from './store'

function App() {
  const settings = useAppSettings()
  const dispatch = useDispatch()

  return (
    <SettingsPanel
      settings={settings}
      onSettingsChange={(newSettings) => {
        dispatch(updateSettings(newSettings))
      }}
    />
  )
}
```

---

## Validation & Error Handling

### Field Validation

```typescript
interface FieldValidator {
  field: string
  validate: (value: unknown) => boolean | string
  message?: string
}

const validators: FieldValidator[] = [
  {
    field: 'behavior.temperature',
    validate: (value) => {
      if (typeof value !== 'number') return 'Must be a number'
      if (value < 0 || value > 2) return 'Must be between 0 and 2'
      return true
    },
  },
  {
    field: 'behavior.maxTokens',
    validate: (value) => {
      if (typeof value !== 'number') return 'Must be a number'
      if (value < 1 || value > 100000) return 'Must be between 1 and 100,000'
      return true
    },
  },
  {
    field: 'apiKeys.providers.openai.apiKey',
    validate: (value) => {
      if (!value) return true // Optional field
      if (typeof value !== 'string') return 'Must be a string'
      if (!value.startsWith('sk-')) return 'Invalid OpenAI key format'
      return true
    },
  },
]
```

### Real-Time Validation

```typescript
function useSettingsValidation(settings: Settings, validators: FieldValidator[]) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const newErrors: Record<string, string> = {}

    validators.forEach((validator) => {
      const value = getNestedValue(settings, validator.field)
      const result = validator.validate(value)

      if (result !== true) {
        newErrors[validator.field] = result || validator.message || 'Invalid value'
      }
    })

    setErrors(newErrors)
  }, [settings, validators])

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}
```

### Error Display

```tsx
function SettingField({ field, error }: { field: string; error?: string }) {
  return (
    <div className={cn('setting-field', error && 'has-error')}>
      <label htmlFor={field}>{fieldLabel}</label>
      <input
        id={field}
        className={cn('input', error && 'input-error')}
        aria-invalid={!!error}
        aria-describedby={error ? `${field}-error` : undefined}
      />
      {error && (
        <p id={`${field}-error`} className="error-message" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
```

---

## Accessibility Features

### Keyboard Navigation

```typescript
// Keyboard shortcuts
const shortcuts = {
  Escape: () => closeSettings(),
  'Ctrl+S': () => saveSettings(),
  'Ctrl+R': () => resetSettings(),
  Tab: () => focusNextField(),
  'Shift+Tab': () => focusPreviousField(),
}

// Focus trap within modal
useFocusTrap(settingsRef, isOpen)

// Return focus to trigger on close
useReturnFocus(triggerRef, isOpen)
```

### Screen Reader Support

```tsx
<div
  role="dialog"
  aria-labelledby="settings-title"
  aria-describedby="settings-description"
  aria-modal="true"
>
  <h2 id="settings-title">Settings</h2>
  <p id="settings-description">Configure your chat experience</p>

  {/* Section navigation */}
  <nav aria-label="Settings sections">
    <button
      aria-current={currentSection === 'general' ? 'true' : undefined}
      aria-controls="general-panel"
    >
      General
    </button>
  </nav>

  {/* Section content */}
  <div id="general-panel" role="tabpanel" aria-labelledby="general-tab" tabIndex={0}>
    {/* Content */}
  </div>
</div>
```

### ARIA Labels

```tsx
// Toggle switch
<button
  role="switch"
  aria-checked={enabled}
  aria-label="Enable streaming"
  onClick={() => setEnabled(!enabled)}
>
  <span className="sr-only">
    Streaming is currently {enabled ? 'enabled' : 'disabled'}
  </span>
</button>

// Slider
<input
  type="range"
  role="slider"
  aria-valuemin={0}
  aria-valuemax={2}
  aria-valuenow={temperature}
  aria-label="Temperature"
  aria-describedby="temperature-description"
/>
<p id="temperature-description">
  Controls randomness. Higher values are more creative.
</p>
```

---

## Styling & Theming

### CSS Variables

```css
.settings-panel {
  /* Colors */
  --settings-background: var(--color-background);
  --settings-foreground: var(--color-foreground);
  --settings-border: var(--color-border);
  --settings-accent: var(--color-primary);

  /* Spacing */
  --settings-padding: 1.5rem;
  --settings-gap: 1rem;

  /* Sizing */
  --settings-drawer-width: 450px;
  --settings-section-width: 300px;

  /* Animation */
  --settings-transition: 0.2s ease-in-out;
}

/* Dark mode overrides */
.dark .settings-panel {
  --settings-background: #1a1a1a;
  --settings-foreground: #ffffff;
  --settings-border: #333333;
}
```

### Component Styling

```css
/* Drawer animation */
.settings-drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: var(--settings-drawer-width);
  background: var(--settings-background);
  border-left: 1px solid var(--settings-border);
  transform: translateX(100%);
  transition: transform var(--settings-transition);
  z-index: 1000;
}

.settings-drawer.open {
  transform: translateX(0);
}

/* Section navigation */
.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: var(--settings-padding);
  border-right: 1px solid var(--settings-border);
}

.settings-nav-button {
  padding: 0.75rem 1rem;
  text-align: left;
  border-radius: 0.5rem;
  transition: background var(--settings-transition);
}

.settings-nav-button:hover {
  background: var(--color-muted);
}

.settings-nav-button[aria-current='true'] {
  background: var(--settings-accent);
  color: var(--color-primary-foreground);
}

/* Form controls */
.settings-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.settings-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--settings-foreground);
}

.settings-description {
  font-size: 0.75rem;
  color: var(--color-muted-foreground);
}

.settings-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--settings-border);
  border-radius: 0.375rem;
  background: var(--settings-background);
  color: var(--settings-foreground);
  transition: border-color var(--settings-transition);
}

.settings-input:focus {
  outline: none;
  border-color: var(--settings-accent);
  box-shadow: 0 0 0 3px var(--settings-accent-transparent);
}

/* Error states */
.settings-field.has-error .settings-input {
  border-color: var(--color-destructive);
}

.error-message {
  font-size: 0.75rem;
  color: var(--color-destructive);
  margin-top: 0.25rem;
}
```

---

## Performance Considerations

### Lazy Loading Sections

```typescript
// Only load section content when visible
const GeneralSettings = lazy(() => import('./sections/GeneralSettings'))
const ModelSettings = lazy(() => import('./sections/ModelSettings'))
const APIKeySettings = lazy(() => import('./sections/APIKeySettings'))

function SettingsPanel() {
  return (
    <Suspense fallback={<SectionSkeleton />}>
      {currentSection === 'general' && <GeneralSettings />}
      {currentSection === 'model' && <ModelSettings />}
      {currentSection === 'apiKeys' && <APIKeySettings />}
    </Suspense>
  )
}
```

### Debounced Saves

```typescript
// Debounce auto-save to avoid excessive writes
const debouncedSave = useMemo(
  () =>
    debounce((settings: Settings) => {
      localStorage.setItem('clarity-settings', JSON.stringify(settings))
    }, 500),
  []
)

useEffect(() => {
  if (autoSave) {
    debouncedSave(settings)
  }
}, [settings, autoSave])
```

### Optimized Re-renders

```typescript
// Memoize expensive computations
const validationErrors = useMemo(
  () => validateSettings(settings, validators),
  [settings, validators]
)

// Split context to avoid unnecessary re-renders
const SettingsContext = createContext<Settings>()
const SettingsActionsContext = createContext<SettingsActions>()

function useSettings() {
  return useContext(SettingsContext)
}

function useSettingsActions() {
  return useContext(SettingsActionsContext)
}
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('SettingsPanel', () => {
  it('renders all sections', () => {
    render(<SettingsPanel {...defaultProps} />)
    expect(screen.getByText('General')).toBeInTheDocument()
    expect(screen.getByText('Model')).toBeInTheDocument()
    expect(screen.getByText('API Keys')).toBeInTheDocument()
  })

  it('validates temperature range', () => {
    const { rerender } = render(<SettingsPanel settings={defaultSettings} />)

    // Valid value
    fireEvent.change(screen.getByLabelText('Temperature'), {
      target: { value: '1.0' }
    })
    expect(screen.queryByText(/must be between/i)).not.toBeInTheDocument()

    // Invalid value
    fireEvent.change(screen.getByLabelText('Temperature'), {
      target: { value: '3.0' }
    })
    expect(screen.getByText(/must be between 0 and 2/i)).toBeInTheDocument()
  })

  it('masks API keys by default', () => {
    const settings = {
      ...defaultSettings,
      apiKeys: {
        providers: {
          openai: { apiKey: 'sk-1234567890abcdef' }
        }
      }
    }

    render(<SettingsPanel settings={settings} />)
    expect(screen.getByDisplayValue(/sk-••••••/)).toBeInTheDocument()
    expect(screen.queryByDisplayValue('sk-1234567890abcdef')).not.toBeInTheDocument()
  })

  it('saves settings on save button click', () => {
    const onSave = jest.fn()
    render(<SettingsPanel onSave={onSave} />)

    fireEvent.click(screen.getByText('Save'))
    expect(onSave).toHaveBeenCalledWith(expect.any(Object))
  })
})
```

### Integration Tests

```typescript
describe('SettingsPanel Integration', () => {
  it('updates theme and persists to localStorage', async () => {
    render(<SettingsPanel autoSave={true} />)

    // Change theme
    fireEvent.click(screen.getByLabelText('Dark'))

    // Wait for debounced save
    await waitFor(() => {
      const stored = localStorage.getItem('clarity-settings')
      const settings = JSON.parse(stored)
      expect(settings.appearance.theme).toBe('dark')
    })
  })

  it('applies settings to ChatInterface', () => {
    const settings = {
      ...defaultSettings,
      appearance: { theme: 'dark', fontSize: 'large' }
    }

    render(
      <SettingsProvider settings={settings}>
        <ChatInterface />
      </SettingsProvider>
    )

    // Verify theme applied
    expect(document.documentElement).toHaveClass('dark')

    // Verify font size applied
    expect(screen.getByTestId('chat-message')).toHaveStyle({
      fontSize: '1.125rem'
    })
  })
})
```

### Accessibility Tests

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('SettingsPanel Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<SettingsPanel isOpen={true} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('supports keyboard navigation', () => {
    render(<SettingsPanel isOpen={true} />)

    // Tab through fields
    userEvent.tab()
    expect(screen.getByLabelText('Language')).toHaveFocus()

    userEvent.tab()
    expect(screen.getByLabelText('Timezone')).toHaveFocus()
  })

  it('traps focus within modal', () => {
    render(<SettingsPanel isOpen={true} />)

    const closeButton = screen.getByLabelText('Close')
    const firstField = screen.getByLabelText('Language')

    // Tab from last element should cycle to first
    closeButton.focus()
    userEvent.tab()
    expect(firstField).toHaveFocus()
  })
})
```

---

## Migration Path

### From Existing Settings

```typescript
// Provide migration function
function migrateSettings(oldSettings: unknown): Settings {
  // Handle v1 → v2 migration
  if (isV1Settings(oldSettings)) {
    return {
      ...defaultSettings,
      behavior: {
        temperature: oldSettings.temp, // renamed field
        maxTokens: oldSettings.max_tokens, // snake_case → camelCase
        // ... other migrations
      },
    }
  }

  return oldSettings as Settings
}

// Auto-migrate on load
function usePersistedSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('clarity-settings')
    if (!stored) return defaultSettings

    const parsed = JSON.parse(stored)
    return migrateSettings(parsed)
  })

  return [settings, setSettings]
}
```

---

## Future Enhancements

### Phase 2 Features

1. **Profiles**: Multiple setting profiles (Work, Personal, Dev)
2. **Sharing**: Export/import settings as URL or file
3. **Sync**: Cloud sync across devices
4. **Templates**: Community-shared setting templates
5. **Smart Defaults**: AI-suggested settings based on usage
6. **Version Control**: Settings history with rollback
7. **Team Settings**: Shared settings for organizations
8. **Plugin System**: Third-party setting extensions

### Phase 3 Features

1. **A/B Testing**: Built-in settings experiments
2. **Analytics Dashboard**: Visualize setting impact
3. **Natural Language Config**: "Make responses more creative"
4. **Context-Aware Defaults**: Settings adapt to conversation
5. **Guided Setup**: Onboarding wizard for new users
6. **Setting Recommendations**: ML-powered suggestions
7. **Conflict Resolution**: Handle conflicting settings gracefully
8. **Real-Time Collaboration**: Multiple users editing settings

---

## Conclusion

The Settings Panel component provides a comprehensive, user-friendly interface for managing all
aspects of the chat experience. By combining insights from Prompt Kit's organized drawer pattern and
HuggingChat's progressive disclosure approach, this component serves both casual users (with
sensible defaults) and power users (with extensive customization).

### Key Design Decisions

1. **Progressive Disclosure**: Simple by default, complexity available on demand
2. **Security First**: Careful handling of API keys and sensitive data
3. **Validation Everywhere**: Prevent invalid configurations before they cause issues
4. **Accessibility Priority**: WCAG 2.1 AA compliance throughout
5. **Performance Conscious**: Lazy loading and optimized re-renders

### Success Metrics

- Time to first successful configuration < 2 minutes
- Setting discoverability > 80% (users find what they need)
- Error rate < 5% (invalid configurations caught by validation)
- Accessibility score > 95 (Lighthouse/axe)
- User satisfaction > 4.5/5 in feedback

---

**Next Steps**:

1. Review specification with team
2. Create Figma designs for each section
3. Implement base component structure
4. Build individual sections incrementally
5. Add validation and error handling
6. Comprehensive testing (unit, integration, accessibility)
7. Documentation and examples
8. User testing and iteration
