# Theming Guide

Learn how to customize Clarity Chat's appearance with our powerful theming system.

---

## 🎨 **Overview**

Clarity Chat includes:
- **11 built-in themes** - Ready to use out of the box
- **Live theme editor** - Customize in real-time
- **Custom themes** - Create your own from scratch
- **Dark mode** - Automatic or manual toggle
- **CSS variables** - Runtime theme switching

---

## 🚀 **Quick Start**

### **Using Built-in Themes**

```tsx
import { ThemeProvider, themes } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider theme={themes.ocean}>
      <YourChatComponent />
    </ThemeProvider>
  )
}
```

### **Available Themes**

| Theme | Description | Best For |
|-------|-------------|----------|
| `default` | Clean, professional | Business apps |
| `dark` | Dark mode | Low-light environments |
| `ocean` | Blue ocean vibes | Calm, professional |
| `sunset` | Warm sunset colors | Friendly, welcoming |
| `forest` | Green nature theme | Eco, wellness apps |
| `corporate` | Professional business | Enterprise |
| `glassmorphism` | Modern glass effect | Modern, trendy apps |
| `neon` | Cyberpunk neon | Gaming, tech |
| `minimal` | Ultra minimal | Distraction-free |
| `warm` | Cozy warm tones | Personal, friendly |
| `cool` | Cool blue/gray | Professional, calm |

---

## 🎭 **Theme Showcase**

### **Ocean Theme**

```tsx
<ThemeProvider theme={themes.ocean}>
  <ChatWindow {...props} />
</ThemeProvider>
```

**Preview:**
- Primary: `#0066CC` (Deep Blue)
- Background: `#F0F8FF` (Light Blue)
- Accent: `#00A8E8` (Bright Blue)

### **Glassmorphism Theme**

```tsx
<ThemeProvider theme={themes.glassmorphism}>
  <ChatWindow {...props} />
</ThemeProvider>
```

**Preview:**
- Modern blur effects
- Semi-transparent surfaces
- Depth and layering
- Glass-like appearance

### **Dark Theme**

```tsx
<ThemeProvider theme={themes.dark}>
  <ChatWindow {...props} />
</ThemeProvider>
```

**Preview:**
- Background: `#1A1A1A` (Almost Black)
- Surface: `#2A2A2A` (Dark Gray)
- Text: `#FFFFFF` (White)
- High contrast for readability

---

## 🛠️ **Creating Custom Themes**

### **Method 1: Extend Existing Theme**

```tsx
import { themes, createTheme } from '@clarity-chat/react'

const myTheme = createTheme({
  ...themes.ocean,
  colors: {
    ...themes.ocean.colors,
    primary: '#FF6B6B',  // Override primary color
    accent: '#4ECDC4',   // Override accent color
  },
})

<ThemeProvider theme={myTheme}>
  <ChatWindow {...props} />
</ThemeProvider>
```

### **Method 2: Create from Scratch**

```tsx
import { createTheme } from '@clarity-chat/react'

const customTheme = createTheme({
  name: 'My Custom Theme',
  colors: {
    // Core colors
    primary: '#6366F1',      // Main brand color
    secondary: '#8B5CF6',    // Secondary actions
    background: '#FFFFFF',   // Page background
    surface: '#F9FAFB',      // Card/surface background
    text: '#111827',         // Main text color
    textSecondary: '#6B7280', // Secondary text
    accent: '#10B981',       // Accent/highlight
    
    // Semantic colors
    success: '#10B981',      // Success states
    warning: '#F59E0B',      // Warning states
    error: '#EF4444',        // Error states
    info: '#3B82F6',         // Info states
    
    // UI element colors
    border: '#E5E7EB',       // Borders
    divider: '#F3F4F6',      // Dividers
    hover: '#F3F4F6',        // Hover states
    active: '#E5E7EB',       // Active states
    disabled: '#D1D5DB',     // Disabled states
    
    // Message colors
    userMessage: '#6366F1',  // User message background
    aiMessage: '#F3F4F6',    // AI message background
    userMessageText: '#FFFFFF', // User message text
    aiMessageText: '#111827',   // AI message text
  },
  
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
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
    full: '9999px',  // Fully rounded
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
})

<ThemeProvider theme={customTheme}>
  <ChatWindow {...props} />
</ThemeProvider>
```

---

## 🎨 **Live Theme Editor**

Use the built-in theme editor to customize themes visually:

```tsx
import { ThemeEditor } from '@clarity-chat/react'

function ThemeCustomizer() {
  const [theme, setTheme] = useState(themes.ocean)
  
  return (
    <div>
      <ThemeEditor
        theme={theme}
        onChange={setTheme}
        showPreview
      />
      
      <ThemeProvider theme={theme}>
        <ChatWindow {...props} />
      </ThemeProvider>
    </div>
  )
}
```

**Features:**
- Color picker for all theme colors
- Live preview of changes
- Export theme as JSON
- Copy theme code
- Reset to defaults

---

## 🌓 **Dark Mode**

### **Method 1: Manual Toggle**

```tsx
import { ThemeProvider, themes } from '@clarity-chat/react'
import { useState } from 'react'

function App() {
  const [isDark, setIsDark] = useState(false)
  
  return (
    <div>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle Dark Mode
      </button>
      
      <ThemeProvider theme={isDark ? themes.dark : themes.default}>
        <ChatWindow {...props} />
      </ThemeProvider>
    </div>
  )
}
```

### **Method 2: Auto-detect System Preference**

```tsx
import { useMediaQuery } from '@clarity-chat/react'

function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  
  return (
    <ThemeProvider theme={prefersDark ? themes.dark : themes.default}>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}
```

### **Method 3: Persist User Preference**

```tsx
import { useLocalStorage } from '@clarity-chat/react'

function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = useLocalStorage('theme-mode', 'auto')
  
  const isDark = mode === 'dark' || (mode === 'auto' && prefersDark)
  
  return (
    <div>
      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="auto">Auto</option>
      </select>
      
      <ThemeProvider theme={isDark ? themes.dark : themes.default}>
        <ChatWindow {...props} />
      </ThemeProvider>
    </div>
  )
}
```

---

## 🎯 **Theme Selector Component**

Use the built-in theme selector for user choice:

```tsx
import { ThemeSelector, themes } from '@clarity-chat/react'

function App() {
  const [selectedTheme, setSelectedTheme] = useState(themes.ocean)
  
  return (
    <div>
      <ThemeSelector
        themes={Object.values(themes)}
        selected={selectedTheme}
        onChange={setSelectedTheme}
      />
      
      <ThemeProvider theme={selectedTheme}>
        <ChatWindow {...props} />
      </ThemeProvider>
    </div>
  )
}
```

---

## 🔧 **Advanced Customization**

### **CSS Variables**

Clarity Chat uses CSS variables for runtime theme switching:

```css
:root {
  --chat-primary: #6366F1;
  --chat-background: #FFFFFF;
  --chat-surface: #F9FAFB;
  --chat-text: #111827;
  /* ... and many more */
}
```

**Override in your CSS:**

```css
.my-custom-chat {
  --chat-primary: #FF6B6B;
  --chat-accent: #4ECDC4;
  --chat-border-radius: 12px;
}
```

### **Tailwind Integration**

If using Tailwind CSS, extend your config:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'chat-primary': 'var(--chat-primary)',
        'chat-background': 'var(--chat-background)',
        'chat-surface': 'var(--chat-surface)',
      },
    },
  },
}
```

### **Component-Level Overrides**

Override theme for specific components:

```tsx
<ChatWindow
  theme={{
    colors: {
      userMessage: '#FF6B6B',
      aiMessage: '#4ECDC4',
    },
  }}
  {...props}
/>
```

---

## 🎨 **Design Tokens**

Export design tokens for design tools:

```tsx
import { exportThemeTokens } from '@clarity-chat/react'

const tokens = exportThemeTokens(themes.ocean)

// Output formats
const css = tokens.toCSS()      // CSS variables
const scss = tokens.toSCSS()    // SCSS variables
const json = tokens.toJSON()    // JSON format
const figma = tokens.toFigma()  // Figma tokens
```

---

## 📱 **Responsive Theming**

Adjust theme based on screen size:

```tsx
import { useMediaQuery } from '@clarity-chat/react'

function App() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  const theme = createTheme({
    ...themes.ocean,
    spacing: {
      ...themes.ocean.spacing,
      md: isMobile ? '0.75rem' : '1rem',
    },
  })
  
  return (
    <ThemeProvider theme={theme}>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}
```

---

## 🎯 **Best Practices**

### **1. Accessibility**
- Maintain AAA contrast ratios (7:1 minimum)
- Test with color blindness simulators
- Support dark mode

### **2. Performance**
- Use CSS variables for dynamic theming
- Avoid inline styles
- Leverage memoization for theme objects

### **3. Consistency**
- Use theme values instead of hardcoded colors
- Follow your design system
- Document custom themes

### **4. Testing**
- Test all themes in Storybook
- Verify dark mode compatibility
- Check mobile responsiveness

---

## 🐛 **Troubleshooting**

### **Theme not applying**

Make sure `ThemeProvider` wraps your components:

```tsx
// ✅ Correct
<ThemeProvider theme={themes.ocean}>
  <ChatWindow {...props} />
</ThemeProvider>

// ❌ Wrong
<ChatWindow {...props} theme={themes.ocean} />
```

### **Colors not changing**

Check CSS specificity and ensure no inline styles override theme:

```tsx
// ❌ Inline styles override theme
<ChatWindow style={{ backgroundColor: 'red' }} />

// ✅ Use theme colors
<ChatWindow className="custom-chat" />
```

### **Dark mode flickering**

Use CSS to set initial theme before JS loads:

```html
<script>
  // In <head> before app loads
  const theme = localStorage.getItem('theme-mode')
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  }
</script>
```

---

## 📚 **Examples**

See complete examples in:
- [Theme Showcase Example](../../examples/theme-showcase)
- [Dark Mode Example](../../examples/dark-mode)
- [Custom Theme Example](../../examples/custom-theme)

---

## 🔗 **Related**

- [Accessibility Guide](./accessibility.md) - Contrast and color requirements
- [Components API](../api/components.md) - Component theming props
- [Design System](./design-system.md) - Design tokens and guidelines

---

**Next:** [Accessibility Guide →](./accessibility.md)
