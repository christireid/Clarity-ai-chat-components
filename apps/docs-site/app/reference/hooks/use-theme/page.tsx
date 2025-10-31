import React from 'react';
import { Metadata } from 'next';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';
import Callout from '@/components/Callout';

export const metadata: Metadata = {
  title: 'useTheme Hook - Clarity Chat Components',
  description: 'A powerful React hook for managing theme state, system preferences, and custom theme configurations.',
};

export default function UseThemePage() {
  return (
    <div className="docs-content">
      <header className="docs-header">
        <div>
          <h1>useTheme</h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">
            A powerful React hook for managing theme state, system preferences, and custom theme configurations.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The <code>useTheme</code> hook provides a complete theming solution with support for light/dark modes,
          system preference detection, custom themes, persistent storage, and smooth transitions. Perfect for
          building theme-aware applications with minimal setup.
        </p>

        <Callout type="info" title="Built on next-themes">
          Internally uses next-themes for SSR-safe theme management with no flash of unstyled content.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          code={`import { useTheme } from '@clarity/chat-components';

export default function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-900 dark:text-white">
          Current theme: <strong>{theme}</strong>
        </p>
      </div>

      <div className="flex gap-2">
        {themes.map(t => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={\`px-4 py-2 rounded \${
              theme === t
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
            }\`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Return Values</h2>
        <ApiTable
          title="useTheme Return Object"
          data={[
            {
              prop: 'theme',
              type: 'string',
              default: 'undefined',
              description: 'Current active theme name'
            },
            {
              prop: 'setTheme',
              type: '(theme: string) => void',
              default: 'undefined',
              description: 'Function to change the theme'
            },
            {
              prop: 'themes',
              type: 'string[]',
              default: "['light', 'dark']",
              description: 'Array of available theme names'
            },
            {
              prop: 'systemTheme',
              type: "'light' | 'dark'",
              default: 'undefined',
              description: 'Current system theme preference (from OS)'
            },
            {
              prop: 'resolvedTheme',
              type: 'string',
              default: 'undefined',
              description: "Actual theme being used (resolves 'system' to 'light' or 'dark')"
            },
            {
              prop: 'forcedTheme',
              type: 'string',
              default: 'undefined',
              description: 'Theme that is forced and cannot be changed (useful for specific pages)'
            }
          ]}
        />
      </section>

      <section className="docs-section">
        <h2>System Theme Detection</h2>
        <p>
          Automatically detect and respect the user's system theme preference with the <code>system</code> option.
        </p>
        <LiveDemo
          code={`import { useTheme } from '@clarity/chat-components';

export default function SystemTheme() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Selected theme:</span>
            <strong className="text-gray-900 dark:text-white">{theme}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">System theme:</span>
            <strong className="text-gray-900 dark:text-white">{systemTheme}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Resolved theme:</span>
            <strong className="text-gray-900 dark:text-white">{resolvedTheme}</strong>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTheme('light')}
          className="px-4 py-2 bg-white border border-gray-300 rounded"
        >
          ☀️ Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className="px-4 py-2 bg-gray-900 text-white rounded"
        >
          🌙 Dark
        </button>
        <button
          onClick={() => setTheme('system')}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
        >
          💻 System
        </button>
      </div>

      {theme === 'system' && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm text-blue-900 dark:text-blue-100">
          ℹ️ Using system preference: {systemTheme}
        </div>
      )}
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Themes</h2>
        <p>
          Define and use custom themes beyond light and dark modes.
        </p>
        <LiveDemo
          code={`import { useTheme } from '@clarity/chat-components';

export default function CustomThemes() {
  const { theme, setTheme } = useTheme();

  const themeConfig = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      border: 'border-gray-300',
      description: 'Clean and bright'
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-white',
      border: 'border-gray-700',
      description: 'Easy on the eyes'
    },
    ocean: {
      bg: 'bg-blue-900',
      text: 'text-blue-50',
      border: 'border-blue-700',
      description: 'Deep blue vibes'
    },
    forest: {
      bg: 'bg-green-900',
      text: 'text-green-50',
      border: 'border-green-700',
      description: 'Natural and calm'
    },
    sunset: {
      bg: 'bg-orange-900',
      text: 'text-orange-50',
      border: 'border-orange-700',
      description: 'Warm and cozy'
    }
  };

  const currentTheme = themeConfig[theme] || themeConfig.light;

  return (
    <div className="space-y-4">
      <div className={\`p-6 rounded-lg border \${currentTheme.bg} \${currentTheme.text} \${currentTheme.border}\`}>
        <h3 className="text-xl font-bold mb-2">
          {theme?.charAt(0).toUpperCase() + theme?.slice(1)} Theme
        </h3>
        <p className="opacity-80">{currentTheme.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.keys(themeConfig).map(themeName => (
          <button
            key={themeName}
            onClick={() => setTheme(themeName)}
            className={\`px-4 py-2 rounded border transition-all \${
              theme === themeName
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : ''
            } \${themeConfig[themeName].bg} \${themeConfig[themeName].text} \${themeConfig[themeName].border}\`}
          >
            {themeName}
          </button>
        ))}
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Theme Toggle Button</h2>
        <p>
          Create a simple toggle button that cycles between light and dark modes.
        </p>
        <LiveDemo
          code={`import { useTheme } from '@clarity/chat-components';

export default function ThemeToggleButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleTheme}
        className="relative inline-flex items-center h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label="Toggle theme"
      >
        {resolvedTheme === 'dark' ? (
          <span className="absolute inset-0 flex items-center justify-center text-2xl">
            🌙
          </span>
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-2xl">
            ☀️
          </span>
        )}
      </button>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Current mode: <strong className="text-gray-900 dark:text-white">{resolvedTheme}</strong>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Theme Switcher with Dropdown</h2>
        <p>
          A more sophisticated theme switcher with descriptions and icons.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { useTheme } from '@clarity/chat-components';

export default function ThemeDropdown() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: 'light', label: 'Light', icon: '☀️', description: 'Bright theme' },
    { value: 'dark', label: 'Dark', icon: '🌙', description: 'Dark theme' },
    { value: 'system', label: 'System', icon: '💻', description: \`Use \${systemTheme} mode\` }
  ];

  const currentOption = options.find(o => o.value === theme) || options[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-xl">{currentOption.icon}</span>
        <span className="text-gray-900 dark:text-white">{currentOption.label}</span>
        <span className="text-gray-500 dark:text-gray-400">▼</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 left-0 z-20 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className={\`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors \${
                  theme === option.value ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }\`}
              >
                <span className="text-2xl">{option.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </div>
                </div>
                {theme === option.value && (
                  <span className="text-blue-600 dark:text-blue-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Persisting Theme Preference</h2>
        <p>
          The theme preference is automatically persisted to localStorage and restored on page load.
        </p>
        <LiveDemo
          code={`import { useTheme } from '@clarity/chat-components';

export default function PersistentTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          💾 Your theme preference is automatically saved and will be
          restored when you return to this page.
        </p>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Theme: <strong>{theme}</strong>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
            >
              Dark
            </button>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400">
            Try changing the theme, then refresh this page.
            Your preference will be remembered!
          </p>
        </div>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Theme-Aware Components</h3>
        <p>
          Create components that adapt their appearance based on the current theme.
        </p>
        <LiveDemo
          code={`import { useTheme } from '@clarity/chat-components';

function ThemedCard({ children }) {
  const { resolvedTheme } = useTheme();

  const cardStyles = {
    light: 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200',
    dark: 'bg-gradient-to-br from-blue-900 to-purple-900 border-blue-700'
  };

  return (
    <div className={\`p-6 rounded-xl border shadow-lg \${cardStyles[resolvedTheme]}\`}>
      {children}
    </div>
  );
}

export default function ThemeAwareComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="space-y-4">
      <ThemedCard>
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          Theme-Aware Card
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          This card automatically adapts its gradient and colors based on
          the current theme: <strong>{resolvedTheme}</strong>
        </p>
      </ThemedCard>

      <div className="flex gap-2">
        <button
          onClick={() => setTheme('light')}
          className="px-3 py-1 text-sm bg-white border rounded"
        >
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className="px-3 py-1 text-sm bg-gray-900 text-white rounded"
        >
          Dark
        </button>
      </div>
    </div>
  );
}`}
        />

        <h3>Conditional Rendering by Theme</h3>
        <p>
          Render different content based on the active theme.
        </p>
        <LiveDemo
          code={`import { useTheme } from '@clarity/chat-components';

export default function ConditionalThemeContent() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {resolvedTheme === 'light' ? (
          <div className="text-center">
            <div className="text-6xl mb-4">☀️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Good Morning!
            </h3>
            <p className="text-gray-600">
              Enjoying the bright theme? Try dark mode for nighttime use.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">🌙</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Good Evening!
            </h3>
            <p className="text-gray-300">
              Dark mode is perfect for reducing eye strain at night.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Switch to {resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
}`}
        />

        <h3>Theme Preview Grid</h3>
        <p>
          Display a visual preview of all available themes for easy selection.
        </p>
        <LiveDemo
          code={`import { useTheme } from '@clarity/chat-components';

export default function ThemePreviewGrid() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      name: 'light',
      label: 'Light',
      preview: 'bg-gradient-to-br from-gray-50 to-gray-100',
      text: 'text-gray-900',
      icon: '☀️'
    },
    {
      name: 'dark',
      label: 'Dark',
      preview: 'bg-gradient-to-br from-gray-800 to-gray-900',
      text: 'text-white',
      icon: '🌙'
    },
    {
      name: 'system',
      label: 'System',
      preview: 'bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900',
      text: 'text-gray-900 dark:text-white',
      icon: '💻'
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {themes.map(t => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          className={\`relative group \${
            theme === t.name ? 'ring-2 ring-blue-500 ring-offset-2' : ''
          }\`}
        >
          <div className={\`h-32 rounded-lg \${t.preview} flex flex-col items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform\`}>
            <span className="text-4xl">{t.icon}</span>
            <span className={\`text-sm font-medium \${t.text}\`}>
              {t.label}
            </span>
          </div>
          {theme === t.name && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
              ✓
            </div>
          )}
        </button>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Configuration</h2>
        <p>
          Configure the theme system using the <code>ThemeProvider</code> wrapper:
        </p>

        <pre><code>{`// app/layout.tsx or _app.tsx
import { ThemeProvider } from '@clarity/chat-components';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          themes={['light', 'dark', 'ocean', 'forest']}
          storageKey="clarity-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}`}</code></pre>

        <ApiTable
          title="ThemeProvider Props"
          data={[
            {
              prop: 'attribute',
              type: "'class' | 'data-theme'",
              default: "'class'",
              description: 'HTML attribute to use for theme switching'
            },
            {
              prop: 'defaultTheme',
              type: 'string',
              default: "'system'",
              description: 'Default theme when no preference is saved'
            },
            {
              prop: 'enableSystem',
              type: 'boolean',
              default: 'true',
              description: 'Whether to enable system theme detection'
            },
            {
              prop: 'themes',
              type: 'string[]',
              default: "['light', 'dark']",
              description: 'Array of available theme names'
            },
            {
              prop: 'storageKey',
              type: 'string',
              default: "'theme'",
              description: 'localStorage key for persisting theme'
            },
            {
              prop: 'forcedTheme',
              type: 'string',
              default: 'undefined',
              description: 'Force a specific theme (overrides user selection)'
            },
            {
              prop: 'enableColorScheme',
              type: 'boolean',
              default: 'true',
              description: 'Whether to set color-scheme CSS property'
            },
            {
              prop: 'disableTransitionOnChange',
              type: 'boolean',
              default: 'false',
              description: 'Disable CSS transitions when theme changes'
            }
          ]}
        />
      </section>

      <section className="docs-section">
        <h2>SSR Considerations</h2>
        <p>
          The useTheme hook is SSR-safe and prevents flash of unstyled content:
        </p>

        <ul>
          <li>Add <code>suppressHydrationWarning</code> to <code>&lt;html&gt;</code> tag</li>
          <li>Theme is applied before first paint using a blocking script</li>
          <li>No flash when switching between pages</li>
          <li>Works with Next.js, Remix, and other SSR frameworks</li>
        </ul>

        <Callout type="warning" title="Next.js App Router">
          When using Next.js 13+ App Router, make sure to wrap your app in ThemeProvider
          in the root layout.tsx file, not in individual page components.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>
        <p>
          Theme switching should be accessible to all users:
        </p>

        <h3>Best Practices</h3>
        <ul>
          <li>Provide clear labels on theme toggle buttons</li>
          <li>Use <code>aria-label</code> for icon-only theme switchers</li>
          <li>Ensure sufficient contrast in all themes (WCAG AA minimum)</li>
          <li>Test with screen readers to verify theme announcements</li>
          <li>Don't auto-switch themes without user interaction</li>
          <li>Respect <code>prefers-reduced-motion</code> when theme changes</li>
        </ul>

        <h3>ARIA Attributes</h3>
        <pre><code>{`<button
  onClick={() => setTheme('dark')}
  aria-label="Switch to dark theme"
  aria-pressed={theme === 'dark'}
>
  🌙 Dark Mode
</button>`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <h3>Design Guidelines</h3>
        <ul>
          <li>Test all UI components in every theme you provide</li>
          <li>Maintain consistent contrast ratios across themes</li>
          <li>Use semantic color names (e.g., <code>primary</code>, <code>error</code>) instead of specific colors</li>
          <li>Provide a clear, easy-to-find theme switcher in your UI</li>
          <li>Default to <code>system</code> theme to respect user preferences</li>
          <li>Keep custom theme names simple and descriptive</li>
        </ul>

        <h3>Performance</h3>
        <ul>
          <li>Theme values are memoized and don't cause unnecessary re-renders</li>
          <li>Use CSS variables for theme colors to avoid re-rendering components</li>
          <li>Avoid checking theme in render-heavy components (use CSS instead)</li>
          <li>Theme changes are instant with no flashing</li>
        </ul>

        <h3>CSS Variables Approach</h3>
        <p>
          For maximum performance, define themes using CSS variables:
        </p>
        <pre><code>{`/* globals.css */
:root {
  --color-background: #ffffff;
  --color-text: #000000;
  --color-primary: #3b82f6;
}

.dark {
  --color-background: #000000;
  --color-text: #ffffff;
  --color-primary: #60a5fa;
}

/* Use in components */
.my-component {
  background-color: var(--color-background);
  color: var(--color-text);
}`}</code></pre>

        <Callout type="info" title="Tailwind Dark Mode">
          When using Tailwind CSS, the <code>dark:</code> variant automatically works
          with useTheme when you set <code>darkMode: 'class'</code> in your Tailwind config.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <p>
          The useTheme hook is fully typed with TypeScript:
        </p>
        <pre><code>{`interface UseThemeReturn {
  // Current Values
  theme: string;
  themes: string[];
  systemTheme: 'light' | 'dark';
  resolvedTheme: string;
  forcedTheme?: string;
  
  // Actions
  setTheme: (theme: string) => void;
}

export function useTheme(): UseThemeReturn;

// Provider Props
interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: 'class' | 'data-theme';
  defaultTheme?: string;
  enableSystem?: boolean;
  themes?: string[];
  storageKey?: string;
  forcedTheme?: string;
  enableColorScheme?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider(props: ThemeProviderProps): JSX.Element;`}</code></pre>

        <h3>Type-Safe Theme Names</h3>
        <pre><code>{`// Define your theme names as a type
type AppTheme = 'light' | 'dark' | 'ocean' | 'forest';

// Create a type-safe wrapper
function useAppTheme() {
  const { theme, setTheme, ...rest } = useTheme();
  
  return {
    ...rest,
    theme: theme as AppTheme,
    setTheme: (newTheme: AppTheme) => setTheme(newTheme)
  };
}

// Usage with autocomplete
const { theme, setTheme } = useAppTheme();
setTheme('ocean'); // ✅ Autocomplete works
setTheme('invalid'); // ❌ TypeScript error`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related Hooks</h2>
        <ul>
          <li><a href="/reference/hooks/use-local-storage">useLocalStorage</a> - Persist other preferences</li>
          <li><a href="/reference/hooks/use-media-query">useMediaQuery</a> - Detect media queries</li>
          <li><a href="/reference/hooks/use-color-mode">useColorMode</a> - Advanced color mode management</li>
        </ul>
      </section>
    </div>
  );
}
