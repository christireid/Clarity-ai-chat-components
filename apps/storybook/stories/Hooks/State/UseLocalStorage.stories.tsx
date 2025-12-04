import type { Meta, StoryObj } from '@storybook/react-vite'
import { useLocalStorage } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'
import { useState } from 'react'

/**
 * **useLocalStorage Hook**
 * 
 * Hook for persisting state in localStorage with automatic serialization
 * and cross-tab synchronization.
 * 
 * **Key Features:**
 * - Persist state in localStorage
 * - Automatic serialization/deserialization
 * - Cross-tab synchronization
 * - SSR-safe
 * - Custom serializers
 * - Remove functionality
 * 
 * **Use Cases:**
 * - Theme preferences
 * - User settings
 * - Form data persistence
 * - Cache management
 */
const meta = {
  title: 'Hooks/State/UseLocalStorage',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`useLocalStorage\` hook persists state in localStorage with automatic
serialization and cross-tab synchronization.

## Features

- ✅ Persist state in localStorage
- ✅ Automatic serialization/deserialization
- ✅ Cross-tab synchronization
- ✅ SSR-safe
- ✅ Custom serializers
- ✅ Remove functionality
- ✅ Type-safe with TypeScript

## Basic Usage

\`\`\`tsx
const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')

// Syncs across tabs automatically
<button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
  Toggle theme
</button>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function ThemeDemo() {
  const [theme, setTheme, removeTheme] = useLocalStorage('demo-theme', 'light')

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="space-y-2 text-sm">
          <div>
            <strong>Current Theme:</strong> {theme}
          </div>
          <div>
            <strong>Stored in localStorage:</strong> {localStorage.getItem('demo-theme') || 'None'}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Toggle Theme
        </Button>
        <Button onClick={() => setTheme('light')} variant="outline">
          Set Light
        </Button>
        <Button onClick={() => setTheme('dark')} variant="outline">
          Set Dark
        </Button>
        <Button onClick={removeTheme} variant="outline">
          Remove
        </Button>
      </div>

      <p className="text-xs text-gray-500">
        Open another tab and change the theme to see cross-tab synchronization.
        The value persists even after page refresh.
      </p>
    </div>
  )
}

export const ThemeStorage: Story = {
  render: () => <ThemeDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Storing theme preference in localStorage with cross-tab synchronization.',
      },
    },
  },
}

function UserPreferencesDemo() {
  const [preferences, setPreferences, removePreferences] = useLocalStorage('user-preferences', {
    language: 'en',
    notifications: true,
    fontSize: 14,
  })

  const updatePreference = (key: string, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="space-y-2 text-sm">
          <div>
            <strong>Language:</strong> {preferences.language}
          </div>
          <div>
            <strong>Notifications:</strong> {preferences.notifications ? 'Enabled' : 'Disabled'}
          </div>
          <div>
            <strong>Font Size:</strong> {preferences.fontSize}px
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Language:</label>
        <select
          value={preferences.language}
          onChange={(e) => updatePreference('language', e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="notifications"
          checked={preferences.notifications}
          onChange={(e) => updatePreference('notifications', e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="notifications" className="text-sm">
          Enable Notifications
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Font Size: {preferences.fontSize}px</label>
        <input
          type="range"
          min="12"
          max="24"
          value={preferences.fontSize}
          onChange={(e) => updatePreference('fontSize', Number(e.target.value))}
          className="w-full"
        />
      </div>

      <Button onClick={removePreferences} variant="outline">
        Reset Preferences
      </Button>
    </div>
  )
}

export const UserPreferences: Story = {
  render: () => <UserPreferencesDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Storing complex user preferences object in localStorage.',
      },
    },
  },
}

function FormPersistenceDemo() {
  const [formData, setFormData, removeFormData] = useLocalStorage('form-data', {
    name: '',
    email: '',
    message: '',
  })

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full p-2 border rounded-lg"
          placeholder="Enter your name"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          className="w-full p-2 border rounded-lg"
          placeholder="Enter your email"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Message:</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          className="w-full p-2 border rounded-lg resize-none"
          rows={4}
          placeholder="Enter your message"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={removeFormData} variant="outline">
          Clear Form
        </Button>
      </div>

      <p className="text-xs text-gray-500">
        Form data is automatically saved to localStorage. Try refreshing the page to see persistence.
      </p>
    </div>
  )
}

export const FormPersistence: Story = {
  render: () => <FormPersistenceDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Persisting form data in localStorage to prevent data loss on page refresh.',
      },
    },
  },
}
