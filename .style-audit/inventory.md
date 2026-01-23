# Theme System Inventory

## Theme Sources Identified

### 1. Modern Presets Directory
**Location:** `packages/react/src/theme/modern-presets/`

**Files:**
- `index.ts` - Main export (30 themes)
- `default.ts` - Default theme
- `neutral.ts` - Neutral/minimal theme
- `vibrant.ts` - Bold purple/pink
- `high-contrast.ts` - WCAG AAA accessible
- `ocean.ts` - Blue-teal theme
- `sunset.ts` - Warm orange/amber
- `forest.ts` - Natural green
- `rose.ts` - Elegant pink
- `midnight.ts` - Deep purple night
- `slate.ts` - Professional gray
- `emerald.ts` - Luxurious green
- `amber.ts` - Golden honey
- `glassmorphism.ts` - Glass effects
- `aurora.ts` - Flowing gradients
- `neumorphism.ts` - Soft extruded UI
- `base.ts` - Base utilities

**Themes Exported (30 total):**
| Light | Dark |
|-------|------|
| default | default-dark |
| neutral | neutral-dark |
| vibrant | vibrant-dark |
| high-contrast | high-contrast-dark |
| ocean | ocean-dark |
| sunset | sunset-dark |
| forest | forest-dark |
| rose | rose-dark |
| midnight | midnight-dark |
| slate | slate-dark |
| emerald | emerald-dark |
| amber | amber-dark |
| glassmorphism | glassmorphism-dark |
| aurora | aurora-dark |
| neumorphism | neumorphism-dark |

### 2. Theme CSS File
**Location:** `packages/react/src/theme/theme.css`

**Themes Defined:**
- `:root` - Light mode defaults (OKLCH format)
- `.dark, [data-theme='dark']` - Dark mode
- `[data-theme='zen']` - Zen theme (calm green-teal)
- `[data-theme='zen'].dark` - Zen dark variant
- `[data-theme='vivid']` - Vivid theme (bold pink-magenta)
- `[data-theme='vivid'].dark` - Vivid dark variant
- `[data-contrast='reduced']` - Reduced contrast accessibility mode

### 3. Examples Custom Themes
**Location:** `examples/custom-theming/lib/themes.ts`

**Themes (8):**
- default-light
- ocean-light
- forest-light
- rose-light
- default-dark
- midnight
- emerald-dark
- purple-haze

### 4. Root Globals CSS
**Location:** `styles/globals.css`

**Defines:**
- `:root` - Light mode CSS variables (HSL format)
- `.dark` - Dark mode CSS variables
- Glass effect variables
- Pastel gradient colors (OKLCH)

---

## Tailwind Configuration Files (42 found)

### Root Config
- `tailwind.config.js` - Main config with glassmorphism system

### Package Configs
- `packages/playground/tailwind.config.js`
- `packages/token-optimization/tailwind.config.js`

### App Configs
- `apps/storybook/tailwind.config.js`
- `apps/marketing-site/tailwind.config.js`
- `apps/streamlined-docs/tailwind.config.js`
- `apps/examples/*` (11 configs)

### Example Configs
- `examples/*` (15 configs)

---

## Global CSS Files (29 found)

### Root
- `styles/globals.css`

### Apps
- `apps/docs/styles/globals.css`
- `apps/storybook/.storybook/globals.css`
- `apps/marketing-site/app/globals.css`
- `apps/streamlined-docs/styles/globals.css`
- `apps/examples/**/globals.css` (11 files)

### Examples
- `examples/**/globals.css` (12 files)

### Packages
- `packages/token-optimization/src/styles/globals.css`

---

## Theme Application Mechanisms (Duplicates!)

### 1. Class-based (Tailwind)
```css
.dark { ... }
```
Used in: `tailwind.config.js` (`darkMode: ['class']`)

### 2. Data-attribute based
```css
[data-theme='dark'] { ... }
[data-theme='zen'] { ... }
```
Used in: `theme.css`

### 3. Both combined
```css
.dark, [data-theme='dark'] { ... }
```

**CONFLICT:** Multiple mechanisms coexist. Need to standardize on ONE.

---

## Token Systems (Duplicates!)

### 1. OKLCH Format (theme.css)
```css
--clarity-primary: 60% 0.2 265;
```

### 2. HSL Format (globals.css, shadcn convention)
```css
--primary: 221.2 83.2% 53.3%;
```

### 3. Hex Colors (storybook globals.css)
```css
--sb-brand-primary: #2563eb;
```

**CONFLICT:** Three different color formats. Need to standardize.

---

## Component-Level Theme Awareness

Files with theme-specific code:
- `packages/react/src/components/code/CodeBlock.tsx`
- `packages/react/src/components/code/StreamingCodeBlock.tsx`
- `packages/react/src/components/tool-approval/ToolApprovalDialog.tsx`
- `apps/examples/enhanced-ui-ux-showcase/src/App.tsx`
- `apps/storybook/.storybook/blocks/ThemeShowcase.tsx`
- Multiple test files

---

## Summary: What Needs Removal

| Category | Count | Action |
|----------|-------|--------|
| Modern Preset Themes | 30 | Remove 28, keep light/dark concepts |
| CSS Theme Variants | 4 | Remove zen, vivid, reduced-contrast as themes |
| Example Themes | 8 | Remove all, replace with customization docs |
| Duplicate Token Systems | 3 | Consolidate to 1 |
| Theme Mechanisms | 2 | Standardize to data-theme |

**Total Themes to Remove: ~40+ theme definitions across all sources**
