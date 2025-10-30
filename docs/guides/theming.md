# Theming Guide

Complete guide to using and customizing themes in Clarity Chat.

---

## 📑 Table of Contents

- [Built-in Themes](#built-in-themes)
- [Using Themes](#using-themes)
- [Custom Themes](#custom-themes)
- [Theme Editor](#theme-editor)
- [Dark Mode](#dark-mode)
- [Dynamic Theme Switching](#dynamic-theme-switching)
- [Advanced Customization](#advanced-customization)

---

## Built-in Themes

Clarity Chat includes **11 professionally designed themes**:

### 1. **Default Theme**
```tsx
themes.default
```
- Clean, professional design
- High contrast for readability
- Perfect for business applications
- **Colors:** Blue primary, white background

### 2. **Dark Theme**
```tsx
themes.dark
```
- Full dark mode
- Reduced eye strain
- OLED-friendly
- **Colors:** Dark gray background, light text

### 3. **Ocean Theme**
```tsx
themes.ocean
```
- Calming blue tones
- Inspired by the sea
- Great for productivity apps
- **Colors:** Deep blue, cyan accents

### 4. **Sunset Theme**
```tsx
themes.sunset
```
- Warm, inviting colors
- Orange and pink gradients
- Perfect for creative applications
- **Colors:** Orange primary, warm tones

### 5. **Forest Theme**
```tsx
themes.forest
```
- Natural green palette
- Earthy and organic
- Relaxing for long sessions
- **Colors:** Forest green, earth tones

### 6. **Corporate Theme**
```tsx
themes.corporate
```
- Professional and formal
- Suitable for enterprise
- Conservative color scheme
- **Colors:** Navy blue, gray accents

### 7. **Glassmorphism Theme** ✨ *New*
```tsx
themes.glassmorphism
```
- Modern glass effect with blur
- Semi-transparent surfaces
- Depth and layering
- **Colors:** Frosted glass, vibrant accents

### 8. **Neon Theme**
```tsx
themes.neon
```
- Cyberpunk aesthetic
- High energy colors
- Dark background with bright accents
- **Colors:** Neon pink, electric blue

### 9. **Minimal Theme**
```tsx
themes.minimal
```
- Ultra-clean design
- Maximum whitespace
- Subtle accents
- **Colors:** White, light gray

### 10. **Warm Theme**
```tsx
themes.warm
```
- Cozy and comfortable
- Warm color temperature
- Perfect for evening use
- **Colors:** Warm orange, beige

### 11. **Cool Theme**
```tsx
themes.cool
```
- Cool color temperature
- Blue and gray tones
- Professional and modern
- **Colors:** Cool blue, slate gray

---

## Using Themes

### Basic Usage

```tsx
import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider theme={themes.ocean}>
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </ThemeProvider>
  )
}
```

### Theme Preview

Try all themes quickly:

```tsx
import { ThemeSelector } from '@clarity-chat/react'

function App() {
  const [selectedTheme, setSelectedTheme] = useState(themes.default)

  return (
    <div>
      <ThemeSelector
        currentTheme={selectedTheme}
        onThemeChange={setSelectedTheme}
      />
      <ThemeProvider theme={selectedTheme}>
        <ChatWindow {...props} />
      </ThemeProvider>
    </div>
  )
}
```

---

## Custom Themes

### Creating a Custom Theme

```tsx
import { createTheme } from '@clarity-chat/react'

const myCustomTheme = createTheme({
  name: 'My Custom Theme',
  colors: {
    primary: '#6366f1',      // Indigo
    secondary: '#8b5cf6',    // Purple
    background: '#ffffff',    // White
    surface: '#f3f4f6',      // Light gray
    text: '#111827',         // Near black
    textSecondary: '#6b7280', // Gray
    accent: '#ec4899',       // Pink
    border: '#e5e7eb',       // Light border
    error: '#ef4444',        // Red
    success: '#10b981',      // Green
    warning: '#f59e0b',      // Amber
    info: '#3b82f6',         // Blue
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
})

// Use your custom theme
<ThemeProvider theme={myCustomTheme}>
  <ChatWindow {...props} />
</ThemeProvider>
```

### Extending Existing Themes

```tsx
import { themes, createTheme } from '@clarity-chat/react'

const extendedOcean = createTheme({
  ...themes.ocean,
  colors: {
    ...themes.ocean.colors,
    primary: '#0ea5e9', // Sky blue instead of ocean blue
  },
  typography: {
    ...themes.ocean.typography,
    fontFamily: 'Roboto, sans-serif',
  },
})
```

---

## Theme Editor

Use the built-in theme editor to customize themes visually:

```tsx
import { ThemeEditor, useTheme } from '@clarity-chat/react'

function ThemeCustomizer() {
  const { theme, setTheme } = useTheme()

  return (
    <div>
      <ThemeEditor
        theme={theme}
        onChange={setTheme}
        showPreview
        liveUpdate
      />
      <ChatWindow {...props} />
    </div>
  )
}
```

**Features:**
- ✅ Live color picker for all theme colors
- ✅ Real-time preview
- ✅ Export theme as JSON
- ✅ Import custom themes
- ✅ Contrast checker (WCAG compliance)
- ✅ Copy theme code

---

## Dark Mode

### Auto-detect System Preference

```tsx
import { ThemeProvider, themes, useMediaQuery } from '@clarity-chat/react'

function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = prefersDark ? themes.dark : themes.default

  return (
    <ThemeProvider theme={theme}>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}
```

### Manual Toggle

```tsx
function App() {
  const [isDark, setIsDark] = useState(false)
  const theme = isDark ? themes.dark : themes.default

  return (
    <div>
      <button onClick={() => setIsDark(!isDark)}>
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </button>
      <ThemeProvider theme={theme}>
        <ChatWindow {...props} />
      </ThemeProvider>
    </div>
  )
}
```

### Persistent Dark Mode

```tsx
import { useLocalStorage } from '@clarity-chat/react'

function App() {
  const [isDark, setIsDark] = useLocalStorage('dark-mode', false)
  const theme = isDark ? themes.dark : themes.default

  return (
    <div>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle Dark Mode
      </button>
      <ThemeProvider theme={theme}>
        <ChatWindow {...props} />
      </ThemeProvider>
    </div>
  )
}
```

---

## Dynamic Theme Switching

### Smooth Transitions

```tsx
import { ThemeProvider } from '@clarity-chat/react'

function App() {
  const [theme, setTheme] = useState(themes.default)

  return (
    <ThemeProvider
      theme={theme}
      transition={{
        duration: 300,
        easing: 'ease-in-out',
      }}
    >
      <select onChange={(e) => setTheme(themes[e.target.value])}>
        <option value="default">Default</option>
        <option value="dark">Dark</option>
        <option value="ocean">Ocean</option>
        <option value="sunset">Sunset</option>
      </select>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}
```

### Theme Presets with User Selection

```tsx
import { ThemeSelector, useLocalStorage } from '@clarity-chat/react'

function App() {
  const [selectedTheme, setSelectedTheme] = useLocalStorage(
    'user-theme',
    themes.default
  )

  return (
    <div>
      <ThemeSelector
        currentTheme={selectedTheme}
        onThemeChange={(newTheme) => {
          setSelectedTheme(newTheme)
          // Optional: Track with analytics
          trackEvent('theme_changed', { theme: newTheme.name })
        }}
        showPreview
        columns={3}
      />
      <ThemeProvider theme={selectedTheme}>
        <ChatWindow {...props} />
      </ThemeProvider>
    </div>
  )
}
```

---

## Advanced Customization

### CSS Variables

Themes are applied using CSS custom properties (variables). You can override them:

```css
/* styles.css */
:root {
  --chat-primary: #6366f1;
  --chat-background: #ffffff;
  --chat-text: #111827;
  /* ... more variables */
}

[data-theme='dark'] {
  --chat-primary: #818cf8;
  --chat-background: #111827;
  --chat-text: #f3f4f6;
}
```

### Component-Level Overrides

```tsx
import { ChatWindow } from '@clarity-chat/react'

<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
  className="custom-chat"
  style={{
    '--chat-primary': '#6366f1',
    '--chat-border-radius': '16px',
  } as React.CSSProperties}
/>
```

### Per-Component Theming

```tsx
import { Message, ThemeProvider } from '@clarity-chat/react'

function CustomMessage({ message }) {
  return (
    <ThemeProvider theme={message.role === 'assistant' ? themes.ocean : themes.default}>
      <Message message={message} />
    </ThemeProvider>
  )
}
```

---

## Theme TypeScript Types

```typescript
interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    accent: string
    border: string
    error: string
    success: string
    warning: string
    info: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
    }
    fontWeight: {
      normal: string
      medium: string
      semibold: string
      bold: string
    }
    lineHeight: {
      tight: string
      normal: string
      relaxed: string
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
  }
  borderRadius: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    full: string
  }
  shadows: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    inner: string
  }
  animation: {
    duration: {
      fast: string
      normal: string
      slow: string
    }
    easing: {
      easeIn: string
      easeOut: string
      easeInOut: string
    }
  }
}
```

---

## Best Practices

### 1. **Accessibility First**
- Ensure AAA contrast ratios (7:1 minimum)
- Test with color-blind simulation
- Provide high-contrast alternatives

```tsx
import { checkContrast } from '@clarity-chat/react/utils'

const isAccessible = checkContrast('#6366f1', '#ffffff')
// Returns: { ratio: 8.59, level: 'AAA' }
```

### 2. **Performance**
- Use CSS variables for runtime changes
- Avoid inline styles when possible
- Minimize theme object size

### 3. **Consistency**
- Define a design system
- Use semantic color names
- Maintain visual hierarchy

### 4. **User Experience**
- Respect system preferences
- Provide theme picker
- Smooth transitions
- Persist user choice

---

## Examples

### Example 1: Brand-Matched Theme

```tsx
const brandTheme = createTheme({
  name: 'Company Brand',
  colors: {
    primary: '#FF6B35',    // Company orange
    secondary: '#004E89',  // Company blue
    // ... match your brand colors
  },
})
```

### Example 2: Time-Based Theme

```tsx
function TimeBasedTheme() {
  const hour = new Date().getHours()
  const theme = hour >= 18 || hour < 6
    ? themes.dark    // Night time
    : themes.default // Day time

  return (
    <ThemeProvider theme={theme}>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}
```

### Example 3: Context-Aware Theme

```tsx
function ContextTheme() {
  const { user } = useAuth()
  const theme = user.preferences.theme || themes.default

  return (
    <ThemeProvider theme={theme}>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}
```

---

## 📚 Related Documentation

- [Accessibility Guide](./accessibility.md)
- [Components API](../api/components.md)
- [Design System](../architecture/design-system.md)

---

## 🤝 Need Help?

- 💬 [Discord Community](https://discord.gg/clarity-chat)
- 🎨 [Storybook Theme Explorer](https://storybook.clarity-chat.dev/?path=/story/theming)
- 🐛 [Report Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)

---

**Next:** [Accessibility Guide →](./accessibility.md)
