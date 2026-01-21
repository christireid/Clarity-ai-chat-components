import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Theme Helpers',
  description: 'Easy theming and customization utilities for Clarity Chat.',
}

export default function Page() {
  return (
    <div className="docs-content">
      <div className="docs-section">
        <h1>Theme Helpers</h1>
        <p className="lead">
          Easy theming and customization utilities for creating beautiful,
          consistent themes across Clarity Chat components.
        </p>
      </div>

      <div className="docs-section">
        <h2>🎨 Theme Presets</h2>
        <p>Pre-built themes for common design systems.</p>

        <div className="code-block">
          <pre><code>{`import { ThemePresets, ThemeProvider } from '@clarity-chat/react'

export function ThemedApp() {
  return (
    <ThemeProvider theme={ThemePresets.Dark}>
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}`}</code></pre>
        </div>

        <h3>Available Presets</h3>
        <div className="theme-grid">
          <div className="theme-card">
            <h4>ThemePresets.Light</h4>
            <div className="theme-preview light">
              <div className="preview-chat">
                <div className="preview-header">Header</div>
                <div className="preview-messages">
                  <div className="preview-message">Message</div>
                </div>
                <div className="preview-input">Input</div>
              </div>
            </div>
          </div>
          <div className="theme-card">
            <h4>ThemePresets.Dark</h4>
            <div className="theme-preview dark">
              <div className="preview-chat">
                <div className="preview-header">Header</div>
                <div className="preview-messages">
                  <div className="preview-message">Message</div>
                </div>
                <div className="preview-input">Input</div>
              </div>
            </div>
          </div>
          <div className="theme-card">
            <h4>ThemePresets.Minimal</h4>
            <div className="theme-preview minimal">
              <div className="preview-chat">
                <div className="preview-header">Header</div>
                <div className="preview-messages">
                  <div className="preview-message">Message</div>
                </div>
                <div className="preview-input">Input</div>
              </div>
            </div>
          </div>
          <div className="theme-card">
            <h4>ThemePresets.Warm</h4>
            <div className="theme-preview warm">
              <div className="preview-chat">
                <div className="preview-header">Header</div>
                <div className="preview-messages">
                  <div className="preview-message">Message</div>
                </div>
                <div className="preview-input">Input</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎯 Custom Themes</h2>
        <p>Create custom themes from color palettes or CSS variables.</p>

        <h3>From Color Palette</h3>
        <div className="code-block">
          <pre><code>{`import { createThemeFromPalette } from '@clarity-chat/react'

const customTheme = createThemeFromPalette({
  primary: '#6366f1',    // Indigo
  secondary: '#64748b',  // Slate
  background: '#ffffff', // White
  foreground: '#0f172a'  // Slate-900
})

export function CustomApp() {
  return (
    <ThemeProvider theme={customTheme}>
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}`}</code></pre>
        </div>

        <h3>From CSS Variables</h3>
        <div className="code-block">
          <pre><code>{`:root {
  --chat-primary: #6366f1;
  --chat-secondary: #64748b;
  --chat-background: #ffffff;
  --chat-foreground: #0f172a;
}

.dark {
  --chat-background: #0f172a;
  --chat-foreground: #f1f5f9;
}`}</code></pre>
        </div>

        <div className="code-block">
          <pre><code>{`import { createThemeFromCSSVariables } from '@clarity-chat/react'

const cssTheme = createThemeFromCSSVariables('--chat')

export function CSSThemedApp() {
  return (
    <ThemeProvider theme={cssTheme}>
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔄 Theme Management</h2>
        <p>Hooks and utilities for managing themes dynamically.</p>

        <h3>Basic Theme Hook</h3>
        <div className="code-block">
          <pre><code>{`import { useTheme } from '@clarity-chat/react'

function ThemedComponent() {
  const { theme, setTheme, applyTheme } = useTheme()

  return (
    <div>
      <button onClick={() => setTheme(ThemePresets.Dark)}>
        Switch to Dark
      </button>
      <ClarityChat api="/api/chat" />
    </div>
  )
}`}</code></pre>
        </div>

        <h3>Persistent Theme</h3>
        <div className="code-block">
          <pre><code>{`import { usePersistentTheme } from '@clarity-chat/react'

function PersistentThemedApp() {
  const { theme, setTheme } = usePersistentTheme(ThemePresets.Light)

  return (
    <ThemeProvider theme={theme}>
      <div>
        <ThemeSelector onThemeChange={setTheme} />
        <ClarityChat api="/api/chat" />
      </div>
    </ThemeProvider>
  )
}`}</code></pre>
        </div>

        <h3>Responsive Theme</h3>
        <div className="code-block">
          <pre><code>{`import { useResponsiveTheme } from '@clarity-chat/react'

function ResponsiveApp() {
  const { theme, setTheme } = useResponsiveTheme()
  // Automatically uses dark theme if user prefers dark mode

  return (
    <ThemeProvider theme={theme}>
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎛️ Theme Components</h2>
        <p>Ready-to-use components for theme management.</p>

        <h3>Theme Toggle</h3>
        <div className="code-block">
          <pre><code>{`import { ThemeToggle } from '@clarity-chat/react'

function App() {
  return (
    <div>
      <ThemeToggle />
      <ClarityChat api="/api/chat" />
    </div>
  )
}`}</code></pre>
        </div>

        <h3>Theme Selector</h3>
        <div className="code-block">
          <pre><code>{`import { ThemeSelector } from '@clarity-chat/react'

function App() {
  return (
    <div>
      <ThemeSelector
        themes={ThemePresets}
        onThemeChange={(theme) => console.log('Theme changed:', theme)}
      />
      <ClarityChat api="/api/chat" />
    </div>
  )
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🛠️ Theme Utilities</h2>
        <p>Advanced theme manipulation and generation.</p>

        <h3>Merge Themes</h3>
        <div className="code-block">
          <pre><code>{`import { mergeThemes } from '@clarity-chat/react'

const baseTheme = ThemePresets.Light
const customColors = {
  colors: {
    primary: '#ff6b6b',
    accent: '#4ecdc4'
  }
}

const mergedTheme = mergeThemes(baseTheme, customColors)`}</code></pre>
        </div>

        <h3>Theme Variants</h3>
        <div className="code-block">
          <pre><code>{`import { createThemeVariant } from '@clarity-chat/react'

const lightVariant = createThemeVariant(
  ThemePresets.Minimal,
  'light'
)

const darkVariant = createThemeVariant(
  ThemePresets.Minimal,
  'dark',
  { colors: { primary: '#60a5fa' } }
)`}</code></pre>
        </div>

        <h3>CSS Class Generation</h3>
        <div className="code-block">
          <pre><code>{`import { createThemeClasses, applyThemeToCSS } from '@clarity-chat/react'

const theme = ThemePresets.Dark
const classes = createThemeClasses(theme)

// Apply to CSS custom properties
applyThemeToCSS(theme)

// Use generated classes
<div className={classes['chat-bg-primary']}>
  <ClarityChat api="/api/chat" />
</div>`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🖼️ Theme Examples</h2>

        <h3>Brand Theme</h3>
        <div className="code-block">
          <pre><code>{`import { createThemeFromPalette } from '@clarity-chat/react'

const brandTheme = createThemeFromPalette({
  primary: '#your-brand-color',
  secondary: '#your-secondary-color',
  background: '#your-background',
  foreground: '#your-text-color'
})

export function BrandedApp() {
  return (
    <ThemeProvider theme={brandTheme}>
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}`}</code></pre>
        </div>

        <h3>Multi-Theme App</h3>
        <div className="code-block">
          <pre><code>{`import { ThemeSelector, usePersistentTheme } from '@clarity-chat/react'

const themes = {
  Light: ThemePresets.Light,
  Dark: ThemePresets.Dark,
  Warm: ThemePresets.Warm,
  Cool: ThemePresets.Cool,
  Minimal: ThemePresets.Minimal
}

function MultiThemeApp() {
  const { theme, setTheme } = usePersistentTheme(themes.Light)

  return (
    <ThemeProvider theme={theme}>
      <div>
        <ThemeSelector
          themes={themes}
          onThemeChange={setTheme}
        />
        <ClarityChat api="/api/chat" />
      </div>
    </ThemeProvider>
  )
}`}</code></pre>
        </div>

        <h3>Dynamic Theme Switching</h3>
        <div className="code-block">
          <pre><code>{`import { useTheme, ThemeToggle } from '@clarity-chat/react'

function DynamicThemeApp() {
  const { theme, setTheme } = useTheme(ThemePresets.Light)

  const switchToSeasonal = () => {
    const month = new Date().getMonth()
    const seasonalTheme = month >= 10 || month <= 2
      ? ThemePresets.Warm  // Winter
      : ThemePresets.Cool  // Summer

    setTheme(seasonalTheme)
  }

  return (
    <ThemeProvider theme={theme}>
      <div>
        <ThemeToggle />
        <button onClick={switchToSeasonal}>
          Seasonal Theme
        </button>
        <ClarityChat api="/api/chat" />
      </div>
    </ThemeProvider>
  )
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>📚 API Reference</h2>

        <h3>ThemePresets</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>ThemePresets.Light, Dark, Minimal, Warm, Cool</code>
            <p>Pre-built theme objects for common design systems.</p>
          </div>
        </div>

        <h3>createThemeFromPalette()</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>createThemeFromPalette(palette): Theme</code>
            <p>Create theme from color palette object.</p>
          </div>
        </div>

        <h3>createThemeFromCSSVariables()</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>createThemeFromCSSVariables(prefix?): Theme</code>
            <p>Create theme from CSS custom properties.</p>
          </div>
        </div>

        <h3>mergeThemes()</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>mergeThemes(...themes): Theme</code>
            <p>Merge multiple themes together.</p>
          </div>
        </div>

        <h3>createThemeVariant()</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>createThemeVariant(baseTheme, variant, adjustments?): Theme</code>
            <p>Create light/dark variant of a theme.</p>
          </div>
        </div>

        <h3>useTheme()</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>useTheme(initialTheme?): { theme, setTheme, applyTheme, resetTheme }</code>
            <p>React hook for theme management.</p>
          </div>
        </div>

        <h3>usePersistentTheme()</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>usePersistentTheme(defaultTheme?): { theme, setTheme }</code>
            <p>Theme hook with localStorage persistence.</p>
          </div>
        </div>

        <h3>useResponsiveTheme()</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>useResponsiveTheme(): { theme, setTheme }</code>
            <p>Theme hook that respects user's color scheme preference.</p>
          </div>
        </div>

        <h3>ThemeProvider</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>ThemeProvider: React.FC&lt;{ theme?, children }&gt;</code>
            <p>Context provider for theme state.</p>
          </div>
        </div>

        <h3>ThemeToggle</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>ThemeToggle: React.FC&lt;{ themes?, className?, onThemeChange? }&gt;</code>
            <p>Button component for switching between light/dark themes.</p>
          </div>
        </div>

        <h3>ThemeSelector</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>ThemeSelector: React.FC&lt;{ themes?, onThemeChange?, className? }&gt;</code>
            <p>Dropdown component for selecting from multiple themes.</p>
          </div>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎯 Best Practices</h2>

        <h3>Theme Creation</h3>
        <ul>
          <li>Start with <code>ThemePresets</code> and customize as needed</li>
          <li>Use <code>createThemeFromPalette</code> for brand colors</li>
          <li>Consider accessibility contrast ratios</li>
          <li>Test themes across different components</li>
        </ul>

        <h3>Theme Management</h3>
        <ul>
          <li>Use <code>usePersistentTheme</code> for user preferences</li>
          <li>Provide theme toggle in app header/settings</li>
          <li>Respect system color scheme preferences</li>
          <li>Allow theme customization in advanced settings</li>
        </ul>

        <h3>Performance</h3>
        <ul>
          <li>Apply themes at the app level with <code>ThemeProvider</code></li>
          <li>Use CSS custom properties for dynamic theming</li>
          <li>Avoid recreating theme objects on every render</li>
          <li>Lazy load theme-specific components</li>
        </ul>

        <h3>Accessibility</h3>
        <ul>
          <li>Ensure sufficient color contrast ratios</li>
          <li>Test with high contrast mode</li>
          <li>Provide clear visual feedback for theme changes</li>
          <li>Consider color-blind friendly palettes</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>🔧 Integration Examples</h2>

        <h3>With Tailwind CSS</h3>
        <div className="code-block">
          <pre><code>{`import { createThemeFromCSSVariables } from '@clarity-chat/react'

// In tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        chat: {
          primary: 'var(--chat-primary)',
          secondary: 'var(--chat-secondary)',
          background: 'var(--chat-background)',
          foreground: 'var(--chat-foreground)'
        }
      }
    }
  }
}

// In component
const theme = createThemeFromCSSVariables('--chat')
return <ThemeProvider theme={theme}>...</ThemeProvider>`}</code></pre>
        </div>

        <h3>With CSS-in-JS</h3>
        <div className="code-block">
          <pre><code>{`import styled from 'styled-components'
import { useTheme } from '@clarity-chat/react'

const StyledChat = styled.div\`
  background: \${props => props.theme.colors.background};
  color: \${props => props.theme.colors.foreground};
  border: 1px solid \${props => props.theme.colors.border};
\`

function ThemedChat() {
  const { theme } = useTheme()
  return <StyledChat theme={theme}>...</StyledChat>
}`}</code></pre>
        </div>

        <h3>With Design Systems</h3>
        <div className="code-block">
          <pre><code>{`import { mergeThemes } from '@clarity-chat/react'
import { designSystemTheme } from './design-system'

const clarityTheme = mergeThemes(
  ThemePresets.Light,
  designSystemTheme,
  {
    colors: {
      primary: designSystemTheme.brand.primary,
      secondary: designSystemTheme.brand.secondary
    }
  }
)

export function DesignSystemApp() {
  return (
    <ThemeProvider theme={clarityTheme}>
      <ClarityChat api="/api/chat" />
    </ThemeProvider>
  )
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔍 Troubleshooting</h2>

        <h3>Common Issues</h3>
        <div className="issue-list">
          <div className="issue">
            <h4>Theme not applying</h4>
            <p>Ensure ThemeProvider wraps the components and CSS custom properties are set.</p>
          </div>
          <div className="issue">
            <h4>Theme not persisting</h4>
            <p>Use usePersistentTheme hook and ensure localStorage is available.</p>
          </div>
          <div className="issue">
            <h4>CSS variables not working</h4>
            <p>Check that CSS custom properties are defined and prefixed correctly.</p>
          </div>
          <div className="issue">
            <h4>Theme toggle not working</h4>
            <p>Ensure ThemeProvider is properly set up and theme objects are valid.</p>
          </div>
        </div>
      </div>
    </div>
  )
}