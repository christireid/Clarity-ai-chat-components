import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Custom Theming - Cookbook - Clarity Chat',
    description: 'Create custom themes and implement dark mode for your chat interface.',
};
export default function CustomThemingPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Cookbook" }), _jsx("h1", { children: "Custom Theming" }), _jsx("p", { className: "docs-lead", children: "Make the chat match your brand. Change colors, add your logo, implement dark mode. Make it yours." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Quick Start: Use Built-in Themes" }), _jsx(CodeBlock, { language: "typescript", code: `import { ThemeProvider, defaultLightTheme, defaultDarkTheme } from '@clarity-chat/react'
import { useState } from 'react'

function App() {
  const [isDark, setIsDark] = useState(false)

  return (
    <ThemeProvider theme={isDark ? defaultDarkTheme : defaultLightTheme}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle Theme
      </button>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Create Custom Theme" }), _jsx(CodeBlock, { language: "typescript", code: `// themes/brand-theme.ts
import { Theme } from '@clarity-chat/react'

export const brandTheme: Theme = {
  name: 'Brand Theme',
  colors: {
    // Primary brand color
    primary: {
      DEFAULT: '#6366f1',    // Your brand purple
      foreground: '#ffffff'
    },
    
    // Background colors
    background: '#ffffff',
    foreground: '#0f172a',
    
    // UI elements
    muted: {
      DEFAULT: '#f1f5f9',
      foreground: '#64748b'
    },
    
    // Messages
    user: {
      bg: '#6366f1',
      text: '#ffffff'
    },
    assistant: {
      bg: '#f1f5f9',
      text: '#0f172a'
    },
    
    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    destructive: '#ef4444',
    
    // Borders and accents
    border: '#e2e8f0',
    ring: '#6366f1',
  },
  
  // Fonts
  fonts: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace'
  },
  
  // Border radius
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
  }
}

// Usage
import { ThemeProvider } from '@clarity-chat/react'
import { brandTheme } from './themes/brand-theme'

<ThemeProvider theme={brandTheme}>
  <App />
</ThemeProvider>` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Dark Mode with Next.js" }), _jsx(CodeBlock, { language: "typescript", code: `// Install next-themes
npm install next-themes

// app/providers.tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProvider } from '@clarity-chat/react'
import { brandTheme, brandDarkTheme } from '@/themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      <ThemeWrapper>
        {children}
      </ThemeWrapper>
    </NextThemesProvider>
  )
}

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const chatTheme = theme === 'dark' ? brandDarkTheme : brandTheme
  
  return (
    <ThemeProvider theme={chatTheme}>
      {children}
    </ThemeProvider>
  )
}

// Add theme toggle
import { ThemeSwitcher } from '@clarity-chat/react'

<ThemeSwitcher />` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Tailwind Configuration" }), _jsx(CodeBlock, { language: "javascript", code: `// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/@clarity-chat/react/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Your brand colors
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        // Map to Clarity Chat tokens
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      }
    }
  },
  plugins: []
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "CSS Variables Approach" }), _jsx(CodeBlock, { language: "css", code: `/* globals.css */
@layer base {
  :root {
    --primary: 263 70% 50%;        /* Purple */
    --primary-foreground: 0 0% 100%;
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --muted: 210 40% 96%;
    --border: 214 32% 91%;
    --radius: 0.75rem;
  }

  .dark {
    --primary: 263 70% 50%;
    --primary-foreground: 0 0% 100%;
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
    --muted: 217 33% 17%;
    --border: 217 33% 17%;
  }
}

/* Custom brand styles */
.chat-message-user {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.chat-button-primary {
  background: var(--primary);
  box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.39);
}

.chat-button-primary:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Dynamic Theme Switching" }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react'

const themes = {
  ocean: {
    name: 'Ocean',
    colors: {
      primary: { DEFAULT: '#0ea5e9', foreground: '#fff' },
      background: '#f0f9ff',
      foreground: '#0c4a6e'
    }
  },
  forest: {
    name: 'Forest',
    colors: {
      primary: { DEFAULT: '#10b981', foreground: '#fff' },
      background: '#f0fdf4',
      foreground: '#064e3b'
    }
  },
  sunset: {
    name: 'Sunset',
    colors: {
      primary: { DEFAULT: '#f59e0b', foreground: '#fff' },
      background: '#fffbeb',
      foreground: '#78350f'
    }
  }
}

function ThemeDemo() {
  const [currentTheme, setCurrentTheme] = useState('ocean')

  return (
    <ThemeProvider theme={themes[currentTheme]}>
      <div className="space-y-4">
        <div className="flex gap-2">
          {Object.keys(themes).map(theme => (
            <button
              key={theme}
              onClick={() => setCurrentTheme(theme)}
              className={\`px-3 py-1 rounded \${
                currentTheme === theme ? 'bg-primary text-white' : 'bg-muted'
              }\`}
            >
              {themes[theme].name}
            </button>
          ))}
        </div>
        
        <ChatWindow
          messages={[
            { id: '1', role: 'assistant', content: 'Theme updated!', createdAt: new Date() }
          ]}
          onSendMessage={() => {}}
        />
      </div>
    </ThemeProvider>
  )
}

render(<ThemeDemo />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Test themes in both light and dark mode" }), _jsx("li", { children: "Ensure WCAG AA color contrast (4.5:1 minimum)" }), _jsx("li", { children: "Use CSS variables for runtime theme switching" }), _jsx("li", { children: "Provide theme preview before applying" }), _jsx("li", { children: "Save user's theme preference (localStorage or DB)" }), _jsx("li", { children: "Respect system preference (prefers-color-scheme)" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related Recipes" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/theme-switcher", className: "docs-card", children: [_jsx("h3", { children: "Theme Switcher" }), _jsx("p", { children: "Component reference" })] }), _jsxs("a", { href: "/reference/components/theme-preview", className: "docs-card", children: [_jsx("h3", { children: "Theme Preview" }), _jsx("p", { children: "Preview before applying" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map