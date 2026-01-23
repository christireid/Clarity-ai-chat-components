# Research Notes: Premium Theme System Design

## shadcn/ui Token Conventions

### Token Hierarchy
shadcn/ui uses a flat semantic token structure:
```css
--background, --foreground
--card, --card-foreground
--popover, --popover-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground
--border, --input, --ring
--radius
```

### CVA Variant Strategy
Class Variance Authority (CVA) enables:
- Composable variant combinations
- Type-safe variant props
- Compile-time variant validation

**Best Practice:** Keep variants semantic (intent-based) not visual:
```typescript
// Good: semantic
variant: "default" | "destructive" | "outline" | "ghost"

// Avoid: visual
variant: "blue" | "red" | "transparent"
```

---

## Premium Minimal Aesthetics

### Design Principles
1. **Restraint** - Use space, not decoration
2. **Hierarchy** - Clear visual weight distribution
3. **Consistency** - Same spacing/radius everywhere
4. **Subtlety** - Micro-interactions, not flashy effects

### Typography
- System font stack for performance
- Limited scale: xs, sm, base, lg, xl, 2xl
- Generous line-height (1.5-1.7)
- Tight letter-spacing for headings

### Spacing
- 4px base unit
- Scale: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16
- Consistent padding/gap ratios

### Borders & Shadows
- Subtle borders: 1px, low contrast
- Soft shadows: 0.05-0.15 alpha
- Radius scale: sm (0.25rem), md (0.375rem), lg (0.5rem)

---

## Glassmorphism Best Practices

### Production-Ready Parameters

#### Light Mode
```css
background: rgba(255, 255, 255, 0.7-0.85);
backdrop-filter: blur(12-16px) saturate(120-150%);
border: 1px solid rgba(255, 255, 255, 0.2-0.3);
```

#### Dark Mode
```css
background: rgba(17, 17, 17, 0.7-0.85);
backdrop-filter: blur(12-16px) saturate(150-180%);
border: 1px solid rgba(255, 255, 255, 0.08-0.15);
```

### Safe Bounds for Customer Customization
| Property | Min | Default | Max |
|----------|-----|---------|-----|
| Opacity | 0.5 | 0.7 | 0.95 |
| Blur | 4px | 12px | 24px |
| Saturate | 100% | 150% | 200% |
| Border opacity | 0.05 | 0.2 | 0.4 |

### Performance Constraints
1. **No blur animation** - Causes repaint storms
2. **Limit nested glass** - Max 2 layers
3. **Mobile consideration** - Reduce blur on mobile
4. **GPU acceleration** - Use `will-change: transform`

### Accessibility Requirements
```css
/* Reduced transparency preference */
@media (prefers-reduced-transparency: reduce) {
  .glass {
    backdrop-filter: none;
    background: var(--card); /* Solid fallback */
  }
}

/* No backdrop-filter support */
@supports not (backdrop-filter: blur(1px)) {
  .glass {
    background: var(--card);
  }
}
```

---

## White-Label Safe Overrides

### CSS Variable Override Method
**Primary approach** - customers import override CSS:
```css
/* customer-theme.css */
:root {
  --clarity-primary: 60% 0.25 200; /* Custom blue */
  --clarity-radius: 1rem; /* More rounded */
}

[data-theme="dark"] {
  --clarity-primary: 70% 0.2 200;
}
```

### Runtime API Method
```typescript
interface ThemeOverrides {
  colors?: Partial<ColorTokens>;
  radius?: string;
  glass?: GlassParameters;
}

function applyThemeOverrides(
  overrides: ThemeOverrides,
  options?: {
    scope?: HTMLElement;
    mode?: 'light' | 'dark';
    persist?: boolean;
  }
): void;
```

### Sanitization Rules

#### Dangerous Patterns to Block
```typescript
const DANGEROUS_PATTERNS = [
  /url\s*\(/i,           // url()
  /expression\s*\(/i,    // expression() - IE
  /javascript:/i,        // javascript: protocol
  /behavior:/i,          // behavior: - IE
  /-moz-binding/i,       // -moz-binding
  /@import/i,            // @import
  /data:/i,              // data: URI (in some contexts)
];
```

#### Safe Value Patterns
```typescript
const SAFE_PATTERNS = {
  color: /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,
  oklch: /^\d+%?\s+[\d.]+\s+[\d.]+(\s*\/\s*[\d.]+%?)?$/,
  hsl: /^hsla?\(\s*[\d.]+\s*,?\s*[\d.]+%?\s*,?\s*[\d.]+%?(\s*[,\/]\s*[\d.]+%?)?\s*\)$/i,
  rgb: /^rgba?\(\s*[\d.]+\s*,?\s*[\d.]+\s*,?\s*[\d.]+(\s*[,\/]\s*[\d.]+%?)?\s*\)$/i,
  length: /^[\d.]+(px|rem|em|%|vw|vh)$/,
  number: /^[\d.]+$/,
};
```

### Allowlisted Token Keys
Only these tokens can be overridden:
```typescript
const CUSTOMIZABLE_TOKENS = [
  // Colors
  'primary', 'primary-foreground',
  'secondary', 'secondary-foreground',
  'accent', 'accent-foreground',
  'muted', 'muted-foreground',
  'background', 'foreground',
  'card', 'card-foreground',
  'border', 'ring',
  // Layout
  'radius',
  // Glass (within bounds)
  'glass-opacity', 'glass-blur', 'glass-saturate',
] as const;
```

---

## Flash of Wrong Theme Prevention

### SSR/RSC Pre-hydration Script
```html
<script>
  (function() {
    var theme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var resolved = theme === 'dark' || (theme === 'system' && prefersDark) ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', resolved);
    if (resolved === 'dark') document.documentElement.classList.add('dark');
  })();
</script>
```

### Key Points
- Script must be inline in `<head>` before any CSS
- Must be synchronous (no async/defer)
- Sets both `data-theme` and `.dark` class for compatibility
- Respects system preference when theme is 'system'

---

## Recommended Token Set (Minimal)

### Core Semantic Tokens
```css
:root {
  /* Base surfaces */
  --clarity-background: <oklch>;
  --clarity-foreground: <oklch>;

  /* Card/elevated surfaces */
  --clarity-card: <oklch>;
  --clarity-card-foreground: <oklch>;

  /* Primary brand */
  --clarity-primary: <oklch>;
  --clarity-primary-foreground: <oklch>;

  /* Secondary/muted */
  --clarity-muted: <oklch>;
  --clarity-muted-foreground: <oklch>;

  /* Accent/highlight */
  --clarity-accent: <oklch>;
  --clarity-accent-foreground: <oklch>;

  /* State colors */
  --clarity-destructive: <oklch>;
  --clarity-success: <oklch>;
  --clarity-warning: <oklch>;

  /* UI chrome */
  --clarity-border: <oklch>;
  --clarity-ring: <oklch>;

  /* Layout */
  --clarity-radius: 0.5rem;

  /* Glass parameters */
  --clarity-glass-opacity: 0.7;
  --clarity-glass-blur: 12px;
  --clarity-glass-saturate: 150%;
}
```

### Backward Compatibility Layer
```css
:root {
  /* Map new to legacy for gradual migration */
  --background: oklch(var(--clarity-background));
  --foreground: oklch(var(--clarity-foreground));
  /* ... etc */
}
```

This maintains compatibility with existing Tailwind/shadcn usage while allowing modern OKLCH internally.
