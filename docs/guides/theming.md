# Theming Guide

Complete guide to customizing and creating themes in Clarity Chat.

---

## 🎨 Built-in Themes

Clarity Chat includes 11 professionally designed themes out of the box.

### Theme Selection Journey

```mermaid
graph TD
    A[Start: Choose Your Theme] --> B{What's Your Use Case?}
    B -->|General Purpose| C[themes.default]
    B -->|Low-light Environment| D[themes.dark]
    B -->|Professional & Calming| E[themes.ocean]
    B -->|Modern & Trendy| F[themes.glassmorphism]
    B -->|Creative & Friendly| G[themes.sunset]
    B -->|Eco/Health Apps| H[themes.forest]
    B -->|Enterprise| I[themes.corporate]
    B -->|Gaming/Tech| J[themes.neon]
    B -->|Focus-driven| K[themes.minimal]
    B -->|Personal/Friendly| L[themes.warm]
    B -->|Professional Tech| M[themes.cool]
    
    C --> N[Apply Theme]
    D --> N
    E --> N
    F --> N
    G --> N
    H --> N
    I --> N
    J --> N
    K --> N
    L --> N
    M --> N
    
    N --> O[Customize if Needed]
    O --> P[Deploy]
    
    style A fill:#4A90E2,color:#fff
    style B fill:#F5A623,color:#fff
    style N fill:#50E3C2,color:#fff
    style P fill:#7ED321,color:#fff
```

### Using Built-in Themes

```tsx
import { ThemeProvider, themes } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider theme={themes.ocean}>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}
```

### Available Themes

| Theme | Description | Best For |
|-------|-------------|----------|
| `themes.default` | Clean, professional | General purpose |
| `themes.dark` | Dark mode | Low-light environments |
| `themes.ocean` | Blue ocean vibes | Calming, professional |
| `themes.glassmorphism` | Modern glass effect | Modern, trendy UIs |
| `themes.sunset` | Warm sunset colors | Creative, friendly apps |
| `themes.forest` | Green nature theme | Eco, health apps |
| `themes.corporate` | Professional business | Enterprise applications |
| `themes.neon` | Cyberpunk neon | Gaming, tech apps |
| `themes.minimal` | Ultra minimal | Focus-driven interfaces |
| `themes.warm` | Cozy warm tones | Personal, friendly apps |
| `themes.cool` | Cool blue/gray | Professional, tech apps |

### Theme Color Palettes Visualization

```mermaid
graph LR
    subgraph "Default Theme"
        D1[Primary: #4A90E2]
        D2[Secondary: #50E3C2]
        D3[Accent: #F5A623]
    end
    
    subgraph "Dark Theme"
        DK1[Primary: #60A5FA]
        DK2[Background: #1F2937]
        DK3[Text: #F9FAFB]
    end
    
    subgraph "Ocean Theme"
        O1[Primary: #0EA5E9]
        O2[Secondary: #06B6D4]
        O3[Accent: #3B82F6]
    end
    
    subgraph "Neon Theme"
        N1[Primary: #FF00FF]
        N2[Secondary: #00FFFF]
        N3[Accent: #FFFF00]
    end
    
    style D1 fill:#4A90E2,color:#fff
    style D2 fill:#50E3C2,color:#fff
    style D3 fill:#F5A623,color:#fff
    style DK1 fill:#60A5FA,color:#fff
    style DK2 fill:#1F2937,color:#fff
    style DK3 fill:#F9FAFB,color:#000
    style O1 fill:#0EA5E9,color:#fff
    style O2 fill:#06B6D4,color:#fff
    style O3 fill:#3B82F6,color:#fff
    style N1 fill:#FF00FF,color:#fff
    style N2 fill:#00FFFF,color:#000
    style N3 fill:#FFFF00,color:#000
```

---

## 🛠️ Custom Themes

### Theme Architecture

```mermaid
graph TB
    subgraph "Theme Object Structure"
        A[Theme] --> B[Colors]
        A --> C[Typography]
        A --> D[Spacing]
        A --> E[Border Radius]
        A --> F[Shadows]
        A --> G[Animations]
        
        B --> B1[Primary Colors]
        B --> B2[Semantic Colors]
        B --> B3[Status Colors]
        
        C --> C1[Font Family]
        C --> C2[Font Sizes]
        C --> C3[Font Weights]
        C --> C4[Line Heights]
        
        D --> D1[xs - 2xl]
        E --> E1[none - full]
        F --> F1[sm - xl]
        G --> G1[Duration]
        G --> G2[Easing]
    end
    
    style A fill:#4A90E2,color:#fff
    style B fill:#50E3C2,color:#fff
    style C fill:#50E3C2,color:#fff
    style D fill:#50E3C2,color:#fff
    style E fill:#50E3C2,color:#fff
    style F fill:#50E3C2,color:#fff
    style G fill:#50E3C2,color:#fff
```

### Creating a Custom Theme

```tsx
import { createTheme, ThemeProvider } from '@clarity-chat/react'

const myTheme = createTheme({
  name: 'My Custom Theme',
  colors: {
    primary: '#6366f1',        // Main brand color
    secondary: '#8b5cf6',      // Secondary actions
    background: '#ffffff',     // Page background
    surface: '#f3f4f6',        // Card backgrounds
    text: '#111827',           // Primary text
    textSecondary: '#6b7280', // Secondary text
    accent: '#ec4899',         // Highlights
    success: '#10b981',        // Success states
    warning: '#f59e0b',        // Warning states
    error: '#ef4444',          // Error states
    border: '#e5e7eb',         // Borders
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
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
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}
```

### Theme Creation Workflow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant CT as createTheme()
    participant TP as ThemeProvider
    participant CSS as CSS Variables
    participant UI as UI Components
    
    Dev->>CT: Define theme config
    CT->>CT: Validate structure
    CT->>CT: Apply defaults
    CT->>CT: Generate theme object
    CT-->>Dev: Return theme
    
    Dev->>TP: Pass theme prop
    TP->>CSS: Inject CSS variables
    CSS->>CSS: Set --clarity-* vars
    TP->>UI: Provide theme context
    
    UI->>CSS: Read CSS variables
    CSS-->>UI: Return styled values
    UI->>UI: Render with theme
    UI-->>Dev: Display themed UI
    
    Note over Dev,UI: Hot reload on theme change
```

---

## 🎭 Dynamic Theme Switching

### Theme Switching Architecture

```mermaid
stateDiagram-v2
    [*] --> DefaultTheme: App Load
    
    DefaultTheme --> UserSelection: User clicks theme selector
    UserSelection --> ValidateTheme: Theme selected
    ValidateTheme --> ApplyTheme: Theme valid
    ValidateTheme --> DefaultTheme: Theme invalid (fallback)
    
    ApplyTheme --> UpdateContext: Update ThemeProvider
    UpdateContext --> InjectCSS: Inject CSS variables
    InjectCSS --> ReRender: Trigger re-render
    ReRender --> Persist: Save to localStorage
    Persist --> ThemeActive: Theme applied
    
    ThemeActive --> UserSelection: Change theme again
    ThemeActive --> [*]: App unmount
    
    note right of Persist
        Theme preference stored
        for future sessions
    end note
```

### Runtime Theme Switching

```tsx
import { useState } from 'react'
import { ThemeProvider, themes, ThemeSelector } from '@clarity-chat/react'

function App() {
  const [currentTheme, setCurrentTheme] = useState(themes.ocean)

  return (
    <ThemeProvider theme={currentTheme}>
      <div>
        {/* Theme selector component */}
        <ThemeSelector
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          themes={Object.values(themes)}
        />
        
        <ChatWindow {...props} />
      </div>
    </ThemeProvider>
  )
}
```

### Persisting Theme Preference

```tsx
import { useLocalStorage } from '@clarity-chat/react'

function App() {
  const [themeName, setThemeName] = useLocalStorage('theme', 'ocean')
  const currentTheme = themes[themeName] || themes.ocean

  return (
    <ThemeProvider theme={currentTheme}>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}
```

### Theme Persistence Flow

```mermaid
graph LR
    A[User Selects Theme] --> B[Update State]
    B --> C[useLocalStorage Hook]
    C --> D{Storage Available?}
    D -->|Yes| E[Save to localStorage]
    D -->|No| F[Use Memory Only]
    E --> G[Apply Theme]
    F --> G
    G --> H[Render UI]
    
    I[Page Reload] --> J[Read localStorage]
    J --> K{Theme Found?}
    K -->|Yes| L[Restore Theme]
    K -->|No| M[Use Default]
    L --> G
    M --> G
    
    style A fill:#4A90E2,color:#fff
    style E fill:#7ED321,color:#fff
    style G fill:#50E3C2,color:#fff
    style H fill:#F5A623,color:#fff
```

---

## 🌙 Dark Mode

### Dark Mode Detection Flow

```mermaid
graph TB
    A[App Initialization] --> B{Check User Preference}
    B -->|Stored| C[Use Stored Theme]
    B -->|Not Stored| D[Check System Preference]
    
    D --> E{System Dark Mode?}
    E -->|Yes| F[Apply Dark Theme]
    E -->|No| G[Apply Light Theme]
    
    C --> H[Apply Theme]
    F --> H
    G --> H
    
    H --> I[Listen for Changes]
    I --> J{System Theme Changed?}
    J -->|Yes| K{Auto-sync Enabled?}
    J -->|No| I
    K -->|Yes| D
    K -->|No| I
    
    style A fill:#4A90E2,color:#fff
    style D fill:#F5A623,color:#fff
    style F fill:#1F2937,color:#fff
    style G fill:#F9FAFB,color:#000
    style H fill:#50E3C2,color:#fff
```

### Auto-detect System Preference

```tsx
import { useMediaQuery } from '@clarity-chat/react'

function App() {
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = isDarkMode ? themes.dark : themes.default

  return (
    <ThemeProvider theme={theme}>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}
```

### Manual Dark Mode Toggle

```tsx
function App() {
  const [isDark, setIsDark] = useState(false)

  return (
    <>
      <button onClick={() => setIsDark(!isDark)}>
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </button>
      
      <ThemeProvider theme={isDark ? themes.dark : themes.default}>
        <ChatWindow {...props} />
      </ThemeProvider>
    </>
  )
}
```

---

## 🎨 Theme Editor

### Live Theme Customization

```tsx
import { ThemeEditor } from '@clarity-chat/react'

function ThemeCustomizer() {
  const [theme, setTheme] = useState(themes.ocean)

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Live preview */}
      <ThemeProvider theme={theme}>
        <ChatWindow {...props} />
      </ThemeProvider>
      
      {/* Theme editor */}
      <ThemeEditor
        theme={theme}
        onChange={setTheme}
        onSave={(theme) => {
          localStorage.setItem('custom-theme', JSON.stringify(theme))
        }}
      />
    </div>
  )
}
```

### Theme Editor Workflow

```mermaid
sequenceDiagram
    participant User
    participant Editor as ThemeEditor
    participant Preview as Live Preview
    participant Storage as localStorage
    
    User->>Editor: Open theme editor
    Editor->>Preview: Display current theme
    
    loop Theme Customization
        User->>Editor: Adjust color
        Editor->>Editor: Validate color value
        Editor->>Preview: Update CSS variables
        Preview->>Preview: Re-render with new theme
        Preview-->>User: Show instant preview
    end
    
    User->>Editor: Click "Save Theme"
    Editor->>Editor: Validate entire theme
    Editor->>Storage: Save theme JSON
    Storage-->>Editor: Confirm saved
    Editor-->>User: Show success message
    
    Note over User,Storage: Theme persists across sessions
```

---

## 🎯 Theme Customization Patterns

### Theme Inheritance Hierarchy

```mermaid
graph TB
    A[Base Theme] --> B[Extended Theme]
    B --> C[Custom Overrides]
    
    subgraph "Base Theme: themes.ocean"
        D[All default values<br/>11 colors<br/>Typography<br/>Spacing<br/>etc.]
    end
    
    subgraph "Extended Theme"
        E[Inherit all base values<br/>Override: primary color<br/>Override: accent color<br/>Keep: everything else]
    end
    
    subgraph "Final Theme"
        F[Base + Overrides<br/>= Complete custom theme]
    end
    
    A --- D
    B --- E
    C --- F
    
    style A fill:#0EA5E9,color:#fff
    style B fill:#6366f1,color:#fff
    style C fill:#ec4899,color:#fff
```

### Extending an Existing Theme

```tsx
import { themes, createTheme } from '@clarity-chat/react'

const myTheme = createTheme({
  ...themes.ocean,
  colors: {
    ...themes.ocean.colors,
    primary: '#your-brand-color',
    accent: '#your-accent-color',
  },
})
```

### Brand-Specific Theme

```tsx
const brandTheme = createTheme({
  name: 'Acme Corp',
  colors: {
    primary: '#FF6B35',      // Acme orange
    secondary: '#004E89',    // Acme blue
    background: '#FFFFFF',
    surface: '#F7F9FC',
    text: '#1A1A1A',
    accent: '#FF6B35',
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    // ... rest of config
  },
})
```

### Brand Theme Integration Flow

```mermaid
graph LR
    A[Brand Guidelines] --> B[Extract Colors]
    A --> C[Extract Typography]
    A --> D[Extract Spacing]
    
    B --> E[Map to Theme Colors]
    C --> F[Map to Theme Fonts]
    D --> G[Map to Theme Spacing]
    
    E --> H[Create Theme Object]
    F --> H
    G --> H
    
    H --> I[Validate Accessibility]
    I --> J{WCAG AA Compliant?}
    J -->|Yes| K[Apply Theme]
    J -->|No| L[Adjust Colors]
    L --> I
    
    K --> M[Deploy]
    
    style A fill:#FF6B35,color:#fff
    style I fill:#F5A623,color:#fff
    style J fill:#F8E71C,color:#000
    style K fill:#7ED321,color:#fff
    style M fill:#50E3C2,color:#fff
```

### Accessibility-Focused Theme

```tsx
const accessibleTheme = createTheme({
  name: 'High Contrast',
  colors: {
    // AAA contrast ratios (7:1)
    primary: '#0066CC',
    background: '#FFFFFF',
    text: '#000000',
    surface: '#F5F5F5',
    border: '#333333',
  },
  typography: {
    fontSize: {
      // Larger base size for readability
      base: '1.125rem',
      lg: '1.25rem',
      xl: '1.5rem',
    },
    lineHeight: {
      // Generous line height
      normal: 1.6,
      relaxed: 1.8,
    },
  },
})
```

### Accessibility Compliance Check

```mermaid
graph TD
    A[Theme Colors] --> B{Check Contrast Ratio}
    B -->|Text on Background| C[Calculate Ratio]
    B -->|Button Colors| D[Calculate Ratio]
    B -->|Border Colors| E[Calculate Ratio]
    
    C --> F{Ratio >= 4.5:1?}
    D --> G{Ratio >= 3:1?}
    E --> H{Ratio >= 3:1?}
    
    F -->|Yes| I[WCAG AA: Pass ✓]
    F -->|No| J[Fail: Adjust]
    G -->|Yes| I
    G -->|No| J
    H -->|Yes| I
    H -->|No| J
    
    I --> K{Ratio >= 7:1?}
    K -->|Yes| L[WCAG AAA: Pass ✓✓]
    K -->|No| M[AA Only]
    
    J --> N[Lighten/Darken Colors]
    N --> B
    
    style I fill:#7ED321,color:#fff
    style L fill:#10b981,color:#fff
    style J fill:#ef4444,color:#fff
    style N fill:#F5A623,color:#fff
```

---

## 🔧 Advanced Customization

### CSS Variable Cascade

```mermaid
graph TB
    subgraph "Layer 1: Global CSS Variables"
        A[document.documentElement<br/>--clarity-primary<br/>--clarity-secondary<br/>etc.]
    end
    
    subgraph "Layer 2: ThemeProvider Context"
        B[React Context<br/>theme object<br/>colors, typography, etc.]
    end
    
    subgraph "Layer 3: Component-Level Overrides"
        C[Inline styles<br/>--message-bg<br/>--message-text]
    end
    
    subgraph "Layer 4: Tailwind/Custom CSS"
        D[External styles<br/>CSS classes<br/>Utility classes]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E[Final Rendered Styles]
    
    style A fill:#4A90E2,color:#fff
    style B fill:#50E3C2,color:#fff
    style C fill:#F5A623,color:#fff
    style D fill:#ec4899,color:#fff
    style E fill:#7ED321,color:#fff
    
    Note1[Most Global] --> A
    Note2[Most Specific] --> D
```

### CSS Variables

Clarity Chat themes are implemented using CSS variables, allowing runtime customization:

```tsx
function App() {
  useEffect(() => {
    // Dynamically change theme colors
    document.documentElement.style.setProperty('--clarity-primary', '#6366f1')
    document.documentElement.style.setProperty('--clarity-accent', '#ec4899')
  }, [])

  return <ChatWindow {...props} />
}
```

### Component-Level Overrides

```tsx
<ChatWindow
  className="chat-window"
  style={{
    '--message-bg': '#f0f0f0',
    '--message-text': '#333',
  } as React.CSSProperties}
  {...props}
/>
```

### Tailwind CSS Integration

If you're using Tailwind, extend your theme to match Clarity Chat:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        clarity: {
          primary: '#4A90E2',
          secondary: '#7ED321',
          accent: '#F5A623',
        },
      },
    },
  },
}
```

### Integration Architecture

```mermaid
graph LR
    subgraph "Clarity Chat Theme"
        A[colors.primary]
        B[colors.secondary]
        C[colors.accent]
    end
    
    subgraph "Tailwind Config"
        D[extend.colors.clarity]
    end
    
    subgraph "Application CSS"
        E[Utility Classes]
        F[Custom Styles]
    end
    
    A --> D
    B --> D
    C --> D
    
    D --> E
    D --> F
    
    E --> G[Consistent Styling]
    F --> G
    
    style A fill:#4A90E2,color:#fff
    style B fill:#7ED321,color:#fff
    style C fill:#F5A623,color:#fff
    style G fill:#50E3C2,color:#fff
```

---

## 📚 Theme Type Reference

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
    success: string
    warning: string
    error: string
    border: string
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
    }
    fontWeight: {
      normal: number
      medium: number
      semibold: number
      bold: number
    }
    lineHeight: {
      tight: number
      normal: number
      relaxed: number
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
    full: string
  }
  
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  
  animations: {
    duration: {
      fast: string
      normal: string
      slow: string
    }
    easing: {
      default: string
      in: string
      out: string
      inOut: string
    }
  }
}
```

### Theme Type Hierarchy

```mermaid
classDiagram
    class Theme {
        +string name
        +Colors colors
        +Typography typography
        +Spacing spacing
        +BorderRadius borderRadius
        +Shadows shadows
        +Animations animations
    }
    
    class Colors {
        +string primary
        +string secondary
        +string background
        +string surface
        +string text
        +string textSecondary
        +string accent
        +string success
        +string warning
        +string error
        +string border
    }
    
    class Typography {
        +string fontFamily
        +FontSize fontSize
        +FontWeight fontWeight
        +LineHeight lineHeight
    }
    
    class FontSize {
        +string xs
        +string sm
        +string base
        +string lg
        +string xl
        +string 2xl
    }
    
    class Spacing {
        +string xs
        +string sm
        +string md
        +string lg
        +string xl
        +string 2xl
    }
    
    class Animations {
        +Duration duration
        +Easing easing
    }
    
    Theme --> Colors
    Theme --> Typography
    Theme --> Spacing
    Theme --> Animations
    Typography --> FontSize
```

---

## 🎓 Best Practices

### Theme Development Checklist

```mermaid
graph TD
    A[Start Theme Development] --> B[Define Color Palette]
    B --> C{Check Accessibility}
    C -->|Pass| D[Define Typography]
    C -->|Fail| E[Adjust Colors]
    E --> B
    
    D --> F[Define Spacing System]
    F --> G[Define Border Radius]
    G --> H[Define Shadows]
    H --> I[Define Animations]
    
    I --> J[Test on Light Background]
    J --> K[Test on Dark Background]
    K --> L[Test on Mobile]
    L --> M[Test with Screen Reader]
    
    M --> N{All Tests Pass?}
    N -->|Yes| O[Document Theme]
    N -->|No| P[Fix Issues]
    P --> J
    
    O --> Q[Create Examples]
    Q --> R[Deploy Theme]
    
    style A fill:#4A90E2,color:#fff
    style C fill:#F5A623,color:#fff
    style N fill:#F8E71C,color:#000
    style R fill:#7ED321,color:#fff
```

### ✅ Do's

- Use semantic color names (primary, accent, etc.)
- Maintain AAA contrast ratios for accessibility
- Test themes in both light and dark environments
- Provide fallback values for custom properties
- Keep theme configs in separate files
- Use TypeScript for type safety

### ❌ Don'ts

- Hard-code colors in components
- Mix theme systems (CSS vars + inline styles)
- Ignore color-blind accessibility
- Use too many color variations
- Forget to test on mobile devices

---

## 🔍 Examples

### E-commerce Theme

```tsx
const ecommerceTheme = createTheme({
  name: 'E-commerce',
  colors: {
    primary: '#FF6347',      // Tomato red for CTAs
    secondary: '#4CAF50',    // Success green
    accent: '#FFD700',       // Gold for highlights
    // ... rest of colors
  },
})
```

### Healthcare Theme

```tsx
const healthcareTheme = createTheme({
  name: 'Healthcare',
  colors: {
    primary: '#0077B6',      // Medical blue
    secondary: '#90E0EF',    // Light blue
    accent: '#00B4D8',       // Cyan
    // ... rest of colors
  },
})
```

### Industry-Specific Theme Comparison

```mermaid
graph TB
    subgraph "E-commerce Theme"
        E1[Bold CTAs<br/>Primary: Red/Orange]
        E2[Trust Colors<br/>Green for success]
        E3[Urgency<br/>Gold for highlights]
    end
    
    subgraph "Healthcare Theme"
        H1[Calming<br/>Blue tones]
        H2[Trust & Safety<br/>Light blues]
        H3[Professional<br/>Cyan accents]
    end
    
    subgraph "Gaming Theme"
        G1[High Energy<br/>Neon colors]
        G2[Dark Backgrounds<br/>Reduce eye strain]
        G3[Vibrant Accents<br/>Purple/Cyan]
    end
    
    subgraph "Corporate Theme"
        C1[Professional<br/>Navy/Gray]
        C2[Minimal<br/>White space]
        C3[Subtle<br/>Gray accents]
    end
    
    style E1 fill:#FF6347,color:#fff
    style E2 fill:#4CAF50,color:#fff
    style E3 fill:#FFD700,color:#000
    style H1 fill:#0077B6,color:#fff
    style H2 fill:#90E0EF,color:#000
    style H3 fill:#00B4D8,color:#fff
    style G1 fill:#FF00FF,color:#fff
    style G2 fill:#1F2937,color:#fff
    style G3 fill:#00FFFF,color:#000
    style C1 fill:#1E40AF,color:#fff
    style C2 fill:#F9FAFB,color:#000
    style C3 fill:#6B7280,color:#fff
```

---

## 📖 Related Documentation

- [Components API](../api/components.md)
- [Accessibility Guide](./accessibility.md)
- [Examples](../examples/README.md)

---

**Need help with theming?** [Join our Discord](https://discord.gg/clarity-chat)
