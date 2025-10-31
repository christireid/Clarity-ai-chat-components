import React from 'react'
import { ComponentLayout } from '@/components/layouts/component-layout'
import { LiveDemo } from '@/components/live-demo'
import { ApiTable } from '@/components/api-table'
import { Callout } from '@/components/callout'
import { CodeBlock } from '@/components/code-block'

export default function UseThemePage() {
  return (
    <ComponentLayout
      title="useTheme"
      description="A powerful hook for managing theme state, including light/dark mode, custom themes, system preference detection, and persistent storage."
    >
      <section>
        <h2 id="overview">Overview</h2>
        <p>
          The <code>useTheme</code> hook provides comprehensive theme management for your chat
          application. It handles theme switching, system preference detection, localStorage
          persistence, smooth transitions, and custom theme support. Perfect for building
          accessible, user-friendly theming experiences.
        </p>
      </section>

      <section>
        <h2 id="basic-usage">Basic Usage</h2>
        <LiveDemo
          code={`import { useTheme, Button } from '@clarity/chat'

export default function BasicThemeDemo() {
  const { theme, setTheme, toggleTheme } = useTheme()
  
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="font-medium">Current Theme: {theme}</p>
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={() => setTheme('light')}
          variant={theme === 'light' ? 'primary' : 'outline'}
        >
          ☀️ Light
        </Button>
        <Button
          onClick={() => setTheme('dark')}
          variant={theme === 'dark' ? 'primary' : 'outline'}
        >
          🌙 Dark
        </Button>
        <Button
          onClick={() => setTheme('system')}
          variant={theme === 'system' ? 'primary' : 'outline'}
        >
          💻 System
        </Button>
      </div>
      
      <Button onClick={toggleTheme} variant="outline">
        Toggle Theme
      </Button>
    </div>
  )
}`}
        />
      </section>

      <section>
        <h2 id="api">API</h2>
        <ApiTable
          type="props"
          data={[
            {
              property: 'theme',
              type: "'light' | 'dark' | 'system' | string",
              description: 'Current active theme'
            },
            {
              property: 'resolvedTheme',
              type: "'light' | 'dark'",
              description: "Actual theme being applied (resolves 'system' to 'light' or 'dark')"
            },
            {
              property: 'setTheme',
              type: '(theme: string) => void',
              description: 'Function to set the theme'
            },
            {
              property: 'toggleTheme',
              type: '() => void',
              description: "Toggles between 'light' and 'dark' (skips 'system')"
            },
            {
              property: 'systemTheme',
              type: "'light' | 'dark'",
              description: 'Current system preference'
            },
            {
              property: 'themes',
              type: 'string[]',
              description: 'Array of available theme names'
            }
          ]}
        />

        <h3 className="mt-6">Hook Options</h3>
        <ApiTable
          type="props"
          data={[
            {
              property: 'defaultTheme',
              type: 'string',
              default: "'system'",
              description: 'Default theme when no saved preference exists'
            },
            {
              property: 'storageKey',
              type: 'string',
              default: "'clarity-theme'",
              description: 'localStorage key for persisting theme preference'
            },
            {
              property: 'enableSystem',
              type: 'boolean',
              default: 'true',
              description: 'Whether to support system theme preference'
            },
            {
              property: 'enableTransitions',
              type: 'boolean',
              default: 'true',
              description: 'Whether to enable smooth theme transitions'
            },
            {
              property: 'customThemes',
              type: 'Record<string, ThemeConfig>',
              description: 'Custom theme configurations'
            },
            {
              property: 'onChange',
              type: '(theme: string) => void',
              description: 'Callback fired when theme changes'
            }
          ]}
        />
      </section>

      <section>
        <h2 id="resolved-theme">Resolved Theme</h2>
        <p>
          When using <code>system</code> theme, <code>resolvedTheme</code> gives you the actual
          theme being applied based on system preferences.
        </p>

        <LiveDemo
          code={`import { useTheme, Button } from '@clarity/chat'

export default function ResolvedThemeDemo() {
  const { theme, resolvedTheme, systemTheme, setTheme } = useTheme()
  
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">User Preference:</span>
          <span>{theme}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Resolved Theme:</span>
          <span>{resolvedTheme}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">System Preference:</span>
          <span>{systemTheme}</span>
        </div>
      </div>
      
      <div className="p-4 border-2 border-dashed rounded-lg">
        {theme === 'system' ? (
          <p className="text-sm">
            Following system preference: <strong>{systemTheme}</strong> mode
          </p>
        ) : (
          <p className="text-sm">
            Overriding system preference with <strong>{theme}</strong> mode
          </p>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button onClick={() => setTheme('light')} size="sm">
          Light
        </Button>
        <Button onClick={() => setTheme('dark')} size="sm">
          Dark
        </Button>
        <Button onClick={() => setTheme('system')} size="sm">
          System
        </Button>
      </div>
    </div>
  )
}`}
        />

        <Callout type="tip">
          Use <code>resolvedTheme</code> when you need to know the actual theme being displayed,
          especially for analytics, conditional rendering, or theme-specific logic.
        </Callout>
      </section>

      <section>
        <h2 id="theme-toggle">Theme Toggle</h2>
        <p>
          Create simple toggle buttons that switch between light and dark modes.
        </p>

        <LiveDemo
          code={`import { useTheme } from '@clarity/chat'

export default function ThemeToggleDemo() {
  const { resolvedTheme, toggleTheme } = useTheme()
  
  const isDark = resolvedTheme === 'dark'
  
  return (
    <div className="space-y-4">
      <button
        onClick={toggleTheme}
        className="relative w-16 h-8 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Toggle theme"
      >
        <div
          className={\`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center \${
            isDark ? 'translate-x-8' : 'translate-x-0'
          }\`}
        >
          {isDark ? '🌙' : '☀️'}
        </div>
      </button>
      
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {isDark ? 'Dark' : 'Light'} mode active
      </p>
    </div>
  )
}`}
        />
      </section>

      <section>
        <h2 id="custom-themes">Custom Themes</h2>
        <p>
          Define and use custom themes beyond the standard light and dark modes.
        </p>

        <LiveDemo
          code={`import { useTheme, Button } from '@clarity/chat'
import { useEffect } from 'react'

const customThemes = {
  ocean: {
    colors: {
      background: '#0a192f',
      foreground: '#ccd6f6',
      primary: '#64ffda',
      secondary: '#8892b0'
    }
  },
  forest: {
    colors: {
      background: '#1a3a1a',
      foreground: '#e8f5e8',
      primary: '#7cb342',
      secondary: '#558b2f'
    }
  },
  sunset: {
    colors: {
      background: '#2d1b2e',
      foreground: '#f8e1d4',
      primary: '#ff6b6b',
      secondary: '#ffa07a'
    }
  }
}

export default function CustomThemesDemo() {
  const { theme, setTheme, themes } = useTheme({
    customThemes
  })
  
  // Apply custom theme CSS variables
  useEffect(() => {
    if (customThemes[theme]) {
      const root = document.documentElement
      const colors = customThemes[theme].colors
      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(\`--color-\${key}\`, value)
      })
    }
  }, [theme])
  
  const isCustomTheme = ['ocean', 'forest', 'sunset'].includes(theme)
  
  return (
    <div className="space-y-4">
      <div
        className="p-6 rounded-lg transition-colors"
        style={
          isCustomTheme
            ? {
                backgroundColor: customThemes[theme].colors.background,
                color: customThemes[theme].colors.foreground
              }
            : {}
        }
      >
        <h3 className="font-bold text-xl mb-2">
          Current Theme: {theme}
        </h3>
        <p className="mb-4">
          This area demonstrates the custom theme colors.
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setTheme('light')} size="sm">
            Light
          </Button>
          <Button onClick={() => setTheme('dark')} size="sm">
            Dark
          </Button>
          <Button
            onClick={() => setTheme('ocean')}
            size="sm"
            style={
              theme === 'ocean'
                ? {
                    backgroundColor: customThemes.ocean.colors.primary,
                    color: customThemes.ocean.colors.background
                  }
                : {}
            }
          >
            🌊 Ocean
          </Button>
          <Button
            onClick={() => setTheme('forest')}
            size="sm"
            style={
              theme === 'forest'
                ? {
                    backgroundColor: customThemes.forest.colors.primary,
                    color: customThemes.forest.colors.background
                  }
                : {}
            }
          >
            🌲 Forest
          </Button>
          <Button
            onClick={() => setTheme('sunset')}
            size="sm"
            style={
              theme === 'sunset'
                ? {
                    backgroundColor: customThemes.sunset.colors.primary,
                    color: customThemes.sunset.colors.background
                  }
                : {}
            }
          >
            🌅 Sunset
          </Button>
        </div>
      </div>
    </div>
  )
}`}
        />
      </section>

      <section>
        <h2 id="theme-persistence">Theme Persistence</h2>
        <p>
          Themes are automatically persisted to localStorage and restored on page load.
        </p>

        <LiveDemo
          code={`import { useTheme, Button } from '@clarity/chat'

export default function PersistenceDemo() {
  const { theme, setTheme } = useTheme({
    storageKey: 'my-app-theme',
    defaultTheme: 'light'
  })
  
  const clearStorage = () => {
    localStorage.removeItem('my-app-theme')
    alert('Theme preference cleared! Refresh the page to see default theme.')
  }
  
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-sm">
          <strong>Storage Key:</strong> my-app-theme
        </p>
        <p className="text-sm">
          <strong>Stored Value:</strong>{' '}
          {localStorage.getItem('my-app-theme') || 'none'}
        </p>
        <p className="text-sm">
          <strong>Current Theme:</strong> {theme}
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={() => setTheme('light')} size="sm">
          Set Light
        </Button>
        <Button onClick={() => setTheme('dark')} size="sm">
          Set Dark
        </Button>
        <Button onClick={clearStorage} variant="outline" size="sm">
          Clear Storage
        </Button>
      </div>
      
      <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
        <p className="text-sm">
          💡 Try changing the theme, then refresh the page. Your preference
          will be remembered!
        </p>
      </div>
    </div>
  )
}`}
        />
      </section>

      <section>
        <h2 id="theme-transitions">Theme Transitions</h2>
        <p>
          Enable smooth visual transitions when switching themes to prevent jarring changes.
        </p>

        <LiveDemo
          code={`import { useTheme, Button } from '@clarity/chat'

export default function TransitionsDemo() {
  const withTransitions = useTheme({
    enableTransitions: true,
    storageKey: 'theme-with-transitions'
  })
  
  const withoutTransitions = useTheme({
    enableTransitions: false,
    storageKey: 'theme-without-transitions'
  })
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">With Transitions (Smooth)</h3>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors duration-300">
          <p className="mb-4">
            This container transitions smoothly when the theme changes.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => withTransitions.setTheme('light')}
              size="sm"
            >
              Light
            </Button>
            <Button
              onClick={() => withTransitions.setTheme('dark')}
              size="sm"
            >
              Dark
            </Button>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Without Transitions (Instant)</h3>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="mb-4">
            This container changes instantly without transitions.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => withoutTransitions.setTheme('light')}
              size="sm"
            >
              Light
            </Button>
            <Button
              onClick={() => withoutTransitions.setTheme('dark')}
              size="sm"
            >
              Dark
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}`}
        />

        <Callout type="tip">
          Transitions are enabled by default. They're briefly disabled during initial page load
          to prevent a flash of unstyled content, then automatically enabled for smooth subsequent
          theme changes.
        </Callout>
      </section>

      <section>
        <h2 id="system-preference">System Preference Detection</h2>
        <p>
          Automatically detect and respond to system theme preference changes in real-time.
        </p>

        <LiveDemo
          code={`import { useTheme } from '@clarity/chat'

export default function SystemPreferenceDemo() {
  const { theme, systemTheme, resolvedTheme, setTheme } = useTheme({
    enableSystem: true,
    defaultTheme: 'system'
  })
  
  const isFollowingSystem = theme === 'system'
  
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">System Preference:</span>
          <span className="text-sm">{systemTheme}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Following System:</span>
          <span className="text-sm">
            {isFollowingSystem ? '✅ Yes' : '❌ No'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Active Theme:</span>
          <span className="text-sm">{resolvedTheme}</span>
        </div>
      </div>
      
      <div className="p-4 border-2 border-dashed rounded-lg">
        <p className="text-sm mb-3">
          {isFollowingSystem ? (
            <>
              🔄 <strong>Auto mode:</strong> Theme follows system preference.
              Change your system theme to see it update in real-time!
            </>
          ) : (
            <>
              🔒 <strong>Manual mode:</strong> Theme is set manually and won't
              change with system preference.
            </>
          )}
        </p>
        
        <button
          onClick={() => setTheme(isFollowingSystem ? 'light' : 'system')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          {isFollowingSystem ? 'Use Manual Mode' : 'Use Auto Mode'}
        </button>
      </div>
      
      <div className="text-xs text-gray-500">
        <p>
          💡 To test: Open your system settings and toggle between light/dark
          mode while this demo is in auto mode.
        </p>
      </div>
    </div>
  )
}`}
        />
      </section>

      <section>
        <h2 id="theme-change-callback">Theme Change Callback</h2>
        <p>
          React to theme changes for analytics, logging, or triggering side effects.
        </p>

        <LiveDemo
          code={`import { useTheme, Button } from '@clarity/chat'
import { useState } from 'react'

export default function OnChangeDemo() {
  const [history, setHistory] = useState<string[]>([])
  
  const { theme, setTheme } = useTheme({
    onChange: (newTheme) => {
      const timestamp = new Date().toLocaleTimeString()
      setHistory((prev) => [
        ...prev,
        \`[\${timestamp}] Theme changed to: \${newTheme}\`
      ])
      
      // Send to analytics
      console.log('Analytics: Theme changed to', newTheme)
      
      // Update other app state
      // updateUserPreferences({ theme: newTheme })
    }
  })
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={() => setTheme('light')} size="sm">
          Light
        </Button>
        <Button onClick={() => setTheme('dark')} size="sm">
          Dark
        </Button>
        <Button onClick={() => setTheme('system')} size="sm">
          System
        </Button>
      </div>
      
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="font-medium mb-2">Theme Change History:</p>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">
            No changes yet. Try switching themes!
          </p>
        ) : (
          <ul className="space-y-1 text-sm font-mono">
            {history.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        )}
      </div>
      
      <button
        onClick={() => setHistory([])}
        className="text-sm text-blue-500 hover:text-blue-600"
      >
        Clear History
      </button>
    </div>
  )
}`}
        />
      </section>

      <section>
        <h2 id="advanced-patterns">Advanced Patterns</h2>

        <h3 id="theme-picker">Theme Picker Component</h3>
        <p>
          Build a comprehensive theme picker with preview and description.
        </p>

        <LiveDemo
          code={`import { useTheme } from '@clarity/chat'

const themeOptions = [
  {
    value: 'light',
    label: 'Light',
    icon: '☀️',
    description: 'Clean and bright',
    preview: 'bg-white text-gray-900'
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: '🌙',
    description: 'Easy on the eyes',
    preview: 'bg-gray-900 text-white'
  },
  {
    value: 'system',
    label: 'System',
    icon: '💻',
    description: 'Follows your device',
    preview: 'bg-gradient-to-r from-white to-gray-900 text-gray-500'
  }
]

export default function ThemePickerDemo() {
  const { theme, setTheme } = useTheme()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {themeOptions.map((option) => {
        const isSelected = theme === option.value
        
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={\`p-4 rounded-lg border-2 transition-all \${
              isSelected
                ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }\`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{option.icon}</span>
              <div className="text-left">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500">
                  {option.description}
                </div>
              </div>
            </div>
            
            <div
              className={\`h-12 rounded \${option.preview} flex items-center justify-center text-sm\`}
            >
              Preview
            </div>
            
            {isSelected && (
              <div className="mt-2 text-xs text-blue-500 font-medium">
                ✓ Active
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}`}
        />

        <h3 id="theme-sync">Cross-Tab Theme Sync</h3>
        <p>
          Synchronize theme changes across multiple browser tabs automatically.
        </p>

        <LiveDemo
          code={`import { useTheme, Button } from '@clarity/chat'
import { useEffect, useState } from 'react'

export default function CrossTabSyncDemo() {
  const { theme, setTheme } = useTheme()
  const [syncEvents, setSyncEvents] = useState<string[]>([])
  
  useEffect(() => {
    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'clarity-theme' && e.newValue) {
        const timestamp = new Date().toLocaleTimeString()
        setSyncEvents((prev) => [
          ...prev.slice(-4), // Keep last 5 events
          \`[\${timestamp}] Synced from another tab: \${e.newValue}\`
        ])
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])
  
  return (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm mb-2">
          🔄 <strong>Try this:</strong> Open this page in another tab, change
          the theme there, and watch it sync here!
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={() => setTheme('light')} size="sm">
          Light
        </Button>
        <Button onClick={() => setTheme('dark')} size="sm">
          Dark
        </Button>
      </div>
      
      {syncEvents.length > 0 && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="font-medium mb-2">Sync Events:</p>
          <ul className="space-y-1 text-sm font-mono">
            {syncEvents.map((event, index) => (
              <li key={index} className="text-green-600 dark:text-green-400">
                {event}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}`}
        />

        <h3 id="conditional-rendering">Conditional Theme Rendering</h3>
        <p>
          Render different components or content based on the active theme.
        </p>

        <LiveDemo
          code={`import { useTheme, Button } from '@clarity/chat'

export default function ConditionalRenderingDemo() {
  const { resolvedTheme, toggleTheme } = useTheme()
  
  const isDark = resolvedTheme === 'dark'
  
  return (
    <div className="space-y-4">
      <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {isDark ? (
          <div className="space-y-3">
            <h3 className="text-xl font-bold">🌙 Night Mode Active</h3>
            <p className="text-gray-300">
              Perfect for late-night coding sessions. Your eyes will thank you!
            </p>
            <div className="flex gap-2 text-sm">
              <span className="px-2 py-1 bg-gray-700 rounded">Reduced strain</span>
              <span className="px-2 py-1 bg-gray-700 rounded">Better sleep</span>
              <span className="px-2 py-1 bg-gray-700 rounded">Focus mode</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-xl font-bold">☀️ Day Mode Active</h3>
            <p className="text-gray-700">
              Bright and clear for maximum productivity during daylight hours.
            </p>
            <div className="flex gap-2 text-sm">
              <span className="px-2 py-1 bg-white border rounded">High contrast</span>
              <span className="px-2 py-1 bg-white border rounded">Clear text</span>
              <span className="px-2 py-1 bg-white border rounded">Professional</span>
            </div>
          </div>
        )}
      </div>
      
      <Button onClick={toggleTheme} variant="outline">
        Switch to {isDark ? 'Light' : 'Dark'} Mode
      </Button>
      
      <div className="text-sm text-gray-500">
        <p>
          Current theme: <code className="font-mono">{resolvedTheme}</code>
        </p>
      </div>
    </div>
  )
}`}
        />
      </section>

      <section>
        <h2 id="accessibility">Accessibility</h2>
        <p>
          Implementing accessible theme switching is important for user experience:
        </p>

        <ul className="space-y-2">
          <li>
            <strong>Respect User Preferences:</strong> Default to system preference when possible
            using <code>defaultTheme="system"</code>
          </li>
          <li>
            <strong>Provide Clear Labels:</strong> Use descriptive button labels like "Switch to
            Dark Mode" instead of just icons
          </li>
          <li>
            <strong>Keyboard Navigation:</strong> Ensure theme controls are keyboard accessible
          </li>
          <li>
            <strong>Visual Feedback:</strong> Clearly indicate the current theme state
          </li>
          <li>
            <strong>Smooth Transitions:</strong> Enable transitions to prevent jarring changes,
            but keep them brief (200-300ms)
          </li>
          <li>
            <strong>High Contrast Support:</strong> Test themes work with high contrast mode enabled
          </li>
          <li>
            <strong>Color Blindness:</strong> Don't rely solely on color to convey theme state
          </li>
          <li>
            <strong>Prefers Reduced Motion:</strong> Consider disabling transitions for users with
            motion sensitivity
          </li>
        </ul>

        <Callout type="info">
          The <code>useTheme</code> hook automatically respects <code>prefers-color-scheme</code>
          media query and updates in real-time when system preferences change.
        </Callout>
      </section>

      <section>
        <h2 id="best-practices">Best Practices</h2>

        <h3>Theme Management</h3>
        <ul className="space-y-2">
          <li>✅ Default to <code>system</code> theme to respect user preferences</li>
          <li>✅ Persist theme choice to localStorage for consistency</li>
          <li>✅ Provide easy access to theme controls (navbar, settings)</li>
          <li>✅ Use semantic color tokens that work across themes</li>
          <li>✅ Test all UI components in both light and dark modes</li>
          <li>✅ Enable smooth transitions for better UX</li>
        </ul>

        <h3 className="mt-4">Custom Themes</h3>
        <ul className="space-y-2">
          <li>✅ Limit custom themes to 3-5 options to avoid overwhelming users</li>
          <li>✅ Ensure custom themes meet WCAG contrast requirements</li>
          <li>✅ Provide theme preview before selection</li>
          <li>✅ Use CSS variables for easy theme customization</li>
          <li>✅ Document theme tokens for developers</li>
        </ul>

        <h3 className="mt-4">Performance</h3>
        <Callout type="tip">
          <ul className="space-y-2">
            <li>Apply theme class to document root for instant updates</li>
            <li>Use CSS variables for theme colors instead of inline styles</li>
            <li>Minimize theme-specific JavaScript logic</li>
            <li>Cache theme preference to avoid flash of wrong theme on load</li>
            <li>Use <code>data-theme</code> attribute on root element for CSS targeting</li>
          </ul>
        </Callout>

        <h3 className="mt-4">User Experience</h3>
        <ul className="space-y-2">
          <li>Place theme toggle in a consistent, easy-to-find location</li>
          <li>Show current theme state clearly</li>
          <li>Allow quick toggle between light/dark without opening menus</li>
          <li>Sync theme across tabs and devices when possible</li>
          <li>Provide theme preview in settings/preferences</li>
        </ul>
      </section>

      <section>
        <h2 id="typescript">TypeScript</h2>
        <CodeBlock
          language="typescript"
          code={`import { useTheme } from '@clarity/chat'

// Basic usage
const { theme, setTheme, toggleTheme } = useTheme()

// With options
interface UseThemeOptions {
  defaultTheme?: string
  storageKey?: string
  enableSystem?: boolean
  enableTransitions?: boolean
  customThemes?: Record<string, ThemeConfig>
  onChange?: (theme: string) => void
}

interface ThemeConfig {
  colors: {
    background: string
    foreground: string
    primary: string
    secondary: string
    [key: string]: string
  }
  [key: string]: any
}

interface UseThemeReturn {
  theme: string
  resolvedTheme: 'light' | 'dark'
  systemTheme: 'light' | 'dark'
  setTheme: (theme: string) => void
  toggleTheme: () => void
  themes: string[]
}

// Example: Theme provider component
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const themeState = useTheme({
    defaultTheme: 'system',
    enableSystem: true,
    onChange: (theme) => {
      // Analytics
      analytics.track('theme_changed', { theme })
      
      // Update user preferences
      updateUserPreferences({ theme })
    }
  })
  
  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  )
}

// Example: Theme toggle button component
const ThemeToggle: React.FC = () => {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  
  return (
    <button
      onClick={toggleTheme}
      aria-label={\`Switch to \${isDark ? 'light' : 'dark'} mode\`}
      className="theme-toggle"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

// Example: Custom theme configuration
const appThemes: Record<string, ThemeConfig> = {
  ocean: {
    colors: {
      background: '#0a192f',
      foreground: '#ccd6f6',
      primary: '#64ffda',
      secondary: '#8892b0',
      accent: '#f07178'
    }
  },
  forest: {
    colors: {
      background: '#1a3a1a',
      foreground: '#e8f5e8',
      primary: '#7cb342',
      secondary: '#558b2f',
      accent: '#ffeb3b'
    }
  }
}

const { theme, setTheme } = useTheme({
  customThemes: appThemes
})`}
        />
      </section>

      <section>
        <h2 id="related">Related</h2>
        <ul>
          <li><a href="/examples/custom-styling">Custom Styling</a> - Theme styling examples</li>
          <li><a href="/reference/components/theme-provider">ThemeProvider</a> - Theme context provider</li>
          <li><a href="/guides/theming">Theming Guide</a> - Comprehensive theming documentation</li>
          <li><a href="/reference/components/button">Button</a> - Theme-aware component example</li>
        </ul>
      </section>
    </ComponentLayout>
  )
}
