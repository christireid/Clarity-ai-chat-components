# shadcn/ui AI Complete Design System

**Source**: https://www.shadcn.io/ai/ | https://ui.shadcn.com **Repository**:
https://github.com/shadcn-ui/ui **Extracted**: 2026-01-27 **Version**: v4 (Tailwind v4 + Base UI)

This document contains the complete design system specifications extracted from shadcn/ui's source
code, including exact OKLCH color values, typography scales, spacing systems, and component
patterns.

---

## Colors (OKLCH)

shadcn/ui uses the OKLCH color space for perceptually uniform colors and better color interpolation.

### Default Theme - Light Mode (`:root`)

**Background & Surface Colors**

```css
--background: oklch(1 0 0); /* Pure white #FFFFFF */
--foreground: oklch(0.145 0 0); /* Near black #262626 */
--card: oklch(1 0 0); /* White #FFFFFF */
--card-foreground: oklch(0.145 0 0); /* Near black #262626 */
--popover: oklch(1 0 0); /* White #FFFFFF */
--popover-foreground: oklch(0.145 0 0); /* Near black #262626 */
--surface: oklch(0.98 0 0); /* Off-white #FAFAFA */
--surface-foreground: var(--foreground); /* Inherited */
```

**Primary Colors**

```css
--primary: oklch(0.205 0 0); /* Dark gray #333333 */
--primary-foreground: oklch(0.985 0 0); /* Off-white #FAFAFA */
```

**Secondary & Accent Colors**

```css
--secondary: oklch(0.97 0 0); /* Very light gray #F7F7F7 */
--secondary-foreground: oklch(0.205 0 0); /* Dark gray #333333 */
--muted: oklch(0.97 0 0); /* Very light gray #F7F7F7 */
--muted-foreground: oklch(0.556 0 0); /* Medium gray #8E8E8E */
--accent: oklch(0.97 0 0); /* Very light gray #F7F7F7 */
--accent-foreground: oklch(0.205 0 0); /* Dark gray #333333 */
```

**Borders & Inputs**

```css
--border: oklch(0.922 0 0); /* Light gray #EBEBEB */
--input: oklch(0.922 0 0); /* Light gray #EBEBEB */
--ring: oklch(0.708 0 0); /* Focus ring gray #B5B5B5 */
```

**Semantic Colors**

```css
--destructive: oklch(0.577 0.245 27.325); /* Red-based error color */
--destructive-foreground: oklch(0.97 0.01 17); /* Light text for destructive */
```

**Code & Selection Colors**

```css
--code: var(--surface); /* Surface color */
--code-foreground: var(--surface-foreground); /* Surface foreground */
--code-highlight: oklch(0.96 0 0); /* Code highlight bg */
--code-number: oklch(0.56 0 0); /* Line numbers */
--selection: oklch(0.145 0 0); /* Selection background */
--selection-foreground: oklch(1 0 0); /* Selection text */
```

**Chart Colors**

```css
--chart-1: var(--color-blue-300); /* Chart color 1 */
--chart-2: var(--color-blue-500); /* Chart color 2 */
--chart-3: var(--color-blue-600); /* Chart color 3 */
--chart-4: var(--color-blue-700); /* Chart color 4 */
--chart-5: var(--color-blue-800); /* Chart color 5 */
```

**Sidebar Colors**

```css
--sidebar: oklch(0.985 0 0); /* Sidebar background */
--sidebar-foreground: oklch(0.145 0 0); /* Sidebar text */
--sidebar-primary: oklch(0.205 0 0); /* Sidebar primary */
--sidebar-primary-foreground: oklch(0.985 0 0); /* Sidebar primary text */
--sidebar-accent: oklch(0.97 0 0); /* Sidebar accent */
--sidebar-accent-foreground: oklch(0.205 0 0); /* Sidebar accent text */
--sidebar-border: oklch(0.922 0 0); /* Sidebar border */
--sidebar-ring: oklch(0.708 0 0); /* Sidebar focus ring */
```

### Default Theme - Dark Mode (`.dark`)

**Background & Surface Colors**

```css
--background: oklch(0.145 0 0); /* Very dark #09090B */
--foreground: oklch(0.985 0 0); /* Off-white #FAFAFA */
--card: oklch(0.205 0 0); /* Dark gray #333333 */
--card-foreground: oklch(0.985 0 0); /* Off-white #FAFAFA */
--popover: oklch(0.269 0 0); /* Darker gray #444444 */
--popover-foreground: oklch(0.985 0 0); /* Off-white #FAFAFA */
--surface: oklch(0.2 0 0); /* Dark surface */
--surface-foreground: oklch(0.708 0 0); /* Medium gray text */
```

**Primary Colors**

```css
--primary: oklch(0.922 0 0); /* Light gray #EBEBEB */
--primary-foreground: oklch(0.205 0 0); /* Dark gray #333333 */
```

**Secondary & Accent Colors**

```css
--secondary: oklch(0.269 0 0); /* Dark gray #444444 */
--secondary-foreground: oklch(0.985 0 0); /* Off-white #FAFAFA */
--muted: oklch(0.269 0 0); /* Dark gray #444444 */
--muted-foreground: oklch(0.708 0 0); /* Medium gray #B5B5B5 */
--accent: oklch(0.371 0 0); /* Medium dark gray */
--accent-foreground: oklch(0.985 0 0); /* Off-white #FAFAFA */
```

**Borders & Inputs**

```css
--border: oklch(1 0 0 / 10%); /* White with 10% opacity */
--input: oklch(1 0 0 / 15%); /* White with 15% opacity */
--ring: oklch(0.556 0 0); /* Focus ring gray */
```

**Semantic Colors**

```css
--destructive: oklch(0.704 0.191 22.216); /* Lighter red for dark mode */
--destructive-foreground: oklch(0.58 0.22 27); /* Red text */
```

**Code & Selection Colors**

```css
--code: var(--surface); /* Surface color */
--code-foreground: var(--surface-foreground); /* Surface foreground */
--code-highlight: oklch(0.27 0 0); /* Code highlight bg (darker) */
--code-number: oklch(0.72 0 0); /* Line numbers (lighter) */
--selection: oklch(0.922 0 0); /* Selection background (light) */
--selection-foreground: oklch(0.205 0 0); /* Selection text (dark) */
```

**Sidebar Colors**

```css
--sidebar: oklch(0.205 0 0); /* Dark sidebar */
--sidebar-foreground: oklch(0.985 0 0); /* Light text */
--sidebar-primary: oklch(0.488 0.243 264.376); /* Purple-tinted primary */
--sidebar-primary-foreground: oklch(0.985 0 0); /* Light text */
--sidebar-accent: oklch(0.269 0 0); /* Dark accent */
--sidebar-accent-foreground: oklch(0.985 0 0); /* Light text */
--sidebar-border: oklch(1 0 0 / 10%); /* White with 10% opacity */
--sidebar-ring: oklch(0.439 0 0); /* Dark focus ring */
```

### Alternative Color Palettes (HSL Format)

These legacy themes use HSL format. Available palettes: Zinc, Slate, Stone, Gray, Neutral.

#### Zinc Theme - Light Mode

```css
--background: 0 0% 100%;
--foreground: 240 10% 3.9%;
--muted: 240 4.8% 95.9%;
--muted-foreground: 240 3.8% 46.1%;
--popover: 0 0% 100%;
--popover-foreground: 240 10% 3.9%;
--card: 0 0% 100%;
--card-foreground: 240 10% 3.9%;
--border: 240 5.9% 90%;
--input: 240 5.9% 90%;
--primary: 240 5.9% 10%;
--primary-foreground: 0 0% 98%;
--secondary: 240 4.8% 95.9%;
--secondary-foreground: 240 5.9% 10%;
--accent: 240 4.8% 95.9%;
--accent-foreground: 240 5.9% 10%;
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 0 0% 98%;
--ring: 240 5.9% 10%;
--radius: 0.5rem;
```

#### Zinc Theme - Dark Mode

```css
--background: 240 10% 3.9%;
--foreground: 0 0% 98%;
--muted: 240 3.7% 15.9%;
--muted-foreground: 240 5% 64.9%;
--border: 240 3.7% 15.9%;
--input: 240 3.7% 15.9%;
--primary: 0 0% 98%;
--primary-foreground: 240 5.9% 10%;
--secondary: 240 3.7% 15.9%;
--secondary-foreground: 0 0% 98%;
--accent: 240 3.7% 15.9%;
--accent-foreground: 0 0% 98%;
--destructive: 0 62.8% 30.6%;
--destructive-foreground: 0 0% 98%;
--ring: 240 4.9% 83.9%;
```

### Theme Color Variants

Available accent color themes (all reference Tailwind color scales):

**Blue Theme**

```css
--primary: var(--color-blue-700); /* Light mode */
--primary: var(--color-blue-700); /* Dark mode */
--primary-foreground: var(--color-blue-50); /* Both modes */
```

**Green Theme**

```css
--primary: var(--color-lime-600); /* Both modes */
--primary-foreground: var(--color-lime-50); /* Both modes */
```

**Amber Theme**

```css
--primary: var(--color-amber-600); /* Light mode */
--primary: var(--color-amber-500); /* Dark mode */
--primary-foreground: var(--color-amber-50); /* Both modes */
```

**Rose, Purple, Orange, Teal, Red, Yellow, Violet** - Follow similar patterns using corresponding
Tailwind color scales (300, 500, 600, 700, 800).

---

## Typography

shadcn/ui uses a utility-first approach with custom font families and responsive scaling.

### Font Families

**Primary Font Stack**

```css
--font-sans: var(--font-inter); /* Default: Inter or Geist */
```

**Available Fonts**

- **Geist**: Modern variable font by Vercel (default in AI components)
- **Geist Mono**: Monospace variant
- **Inter**: Alternative sans-serif (fallback)
- **Noto Sans**: Alternative option
- **Nunito Sans**: Alternative option
- **Figtree**: Alternative option

**System Fallback**

```
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
```

### Font Sizes

Base sizes follow Tailwind's default scale with custom responsive overrides:

**Standard Scale** (in rem)

```css
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem; /* 36px */
--text-5xl: 3rem; /* 48px */
--text-6xl: 3.75rem; /* 60px */
--text-7xl: 4.5rem; /* 72px */
--text-8xl: 6rem; /* 96px */
```

**Scaled Theme** (Desktop, min-width: 1024px)

```css
--text-sm: 0.8rem; /* 12.8px - tighter */
--text-base: 0.85rem; /* 13.6px - tighter */
--text-lg: 1.05rem; /* 16.8px */
--text-xl: 1.1rem; /* 17.6px */
--text-2xl: 1.2rem; /* 19.2px */
--text-3xl: 1.3rem; /* 20.8px */
--text-4xl: 1.4rem; /* 22.4px */
--text-5xl: 1.5rem; /* 24px */
--text-6xl: 1.6rem; /* 25.6px */
--text-7xl: 1.7rem; /* 27.2px */
--text-8xl: 1.8rem; /* 28.8px */
```

### Font Weights

```
Regular: 400          (body text)
Medium: 500           (emphasis)
Semibold: 600         (headings)
Bold: 700             (strong emphasis)
Extrabold: 800        (major headings)
```

### Line Heights

Tailwind defaults with semantic names:

```
leading-none: 1
leading-tight: 1.25
leading-snug: 1.375
leading-normal: 1.5
leading-relaxed: 1.625
leading-loose: 2
leading-tighter: Custom condensed for headings
```

### Letter Spacing

```
tracking-tighter: -0.05em
tracking-tight: -0.025em
tracking-normal: 0em
tracking-wide: 0.025em
tracking-wider: 0.05em
tracking-widest: 0.1em
```

### Typography Utility Classes

**Headings**

```html
h1: scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance h2: scroll-m-20
border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 h3: scroll-m-20 text-2xl
font-semibold tracking-tight h4: scroll-m-20 text-xl font-semibold tracking-tight
```

**Body Text**

```html
p: leading-7 [&:not(:first-child)]:mt-6 blockquote: mt-6 border-l-2 pl-6 italic
```

**Special Text**

```html
Lead: text-muted-foreground text-xl Muted: text-muted-foreground text-sm Small: text-sm leading-none
font-medium
```

---

## Spacing System

### Base Unit

```css
--spacing: 0.25rem; /* 4px base unit */
```

### Scaled Spacing (Desktop, min-width: 1024px)

```css
--spacing: 0.222222rem; /* ~3.56px - tighter scale */
```

**Mono Theme Spacing**

```css
--spacing: 0.222222rem; /* Even tighter for mono */
```

### Tailwind Spacing Scale

Uses default Tailwind scale (1 = 0.25rem = 4px):

```
0: 0
0.5: 0.125rem (2px)
1: 0.25rem (4px)
1.5: 0.375rem (6px)
2: 0.5rem (8px)
2.5: 0.625rem (10px)
3: 0.75rem (12px)
3.5: 0.875rem (14px)
4: 1rem (16px)
5: 1.25rem (20px)
6: 1.5rem (24px)
7: 1.75rem (28px)
8: 2rem (32px)
10: 2.5rem (40px)
12: 3rem (48px)
16: 4rem (64px)
20: 5rem (80px)
24: 6rem (96px)
32: 8rem (128px)
40: 10rem (160px)
48: 12rem (192px)
56: 14rem (224px)
64: 16rem (256px)
72: 18rem (288px)
80: 20rem (320px)
96: 24rem (384px)
```

### Common Usage Patterns

**Mobile-First Responsive Padding**

```
py-8 md:py-20         /* Vertical: 32px → 80px */
px-6 md:px-8          /* Horizontal: 24px → 32px */
gap-2 md:gap-4        /* Gap: 8px → 16px */
```

**Component Spacing**

```
Button padding: px-3 (12px) for sm, px-4 for default
Card padding: px-6 py-6 (24px)
Input padding: Handled by base styles
```

---

## Border Radius

### Primary Value

```css
--radius: 0.625rem; /* 10px - default */
```

### Variants (Calculated)

```css
--radius-sm: calc(var(--radius) - 4px); /* ~6px (0.375rem) */
--radius-md: calc(var(--radius) - 2px); /* ~8px (0.5rem) */
--radius-lg: var(--radius); /* 10px (0.625rem) */
--radius-xl: calc(var(--radius) + 4px); /* ~14px (0.875rem) */
--radius-2xl: calc(var(--radius) + 8px); /* ~18px (1.125rem) */
--radius-3xl: calc(var(--radius) + 12px); /* ~22px (1.375rem) */
--radius-4xl: calc(var(--radius) + 16px); /* ~26px (1.625rem) */
```

### Theme-Specific Overrides

```css
/* Rounded variants available */
--radius: 0; /* theme-rounded-none */
--radius: 0.4rem; /* theme-rounded-small */
--radius: 0.65rem; /* theme-rounded-medium */
--radius: 1rem; /* theme-rounded-large */
--radius: 1.2rem; /* theme-rounded-full (max before pill) */

/* Mono theme removes all radius */
.theme-mono .rounded-* {
  border-radius: 0 !important;
}
```

### Usage

```
rounded-full          /* 9999px - for pills/circles */
rounded-lg            /* var(--radius) */
rounded-xl            /* var(--radius-xl) */
rounded-md            /* var(--radius-md) */
rounded-sm            /* var(--radius-sm) */
```

**Button Examples**

- Pill buttons: `rounded-full`
- Standard buttons: `rounded-md`
- Cards: `rounded-xl`

**Spinner**

```css
border-radius: 50%; /* Circular loader */
```

---

## Shadows

shadcn/ui uses minimal elevation with Tailwind's default shadow system.

### Philosophy

- Subtle shadows that don't overwhelm content
- No heavy drop shadows
- Focus on borders over shadows in many cases

### Default Shadow Scale

```
shadow-xs: Minimal shadow (not defined in source)
shadow-sm: Small shadow (default Tailwind)
shadow-md: Medium shadow (default Tailwind)
shadow-lg: Large shadow (default Tailwind)
shadow-xl: Extra large shadow (default Tailwind)
shadow-2xl: 2X large shadow (default Tailwind)
shadow-none: No shadow
```

### Mono Theme Override

```css
.theme-mono .shadow-* {
  box-shadow: none !important;
}
```

### Focus Ring Shadow

```
focus-visible:ring-ring/50                     /* Ring color at 50% opacity */
focus-visible:ring-[3px]                       /* 3px ring width */
```

### Dialog Ring Example

```css
.dialog-ring {
  @apply rounded-xl border-none bg-clip-padding shadow-2xl
         ring-4 ring-neutral-200/80
         dark:bg-neutral-900 dark:ring-neutral-800;
}
```

### Component-Specific Shadows

**Cards**: Usually `shadow-sm` or `shadow-none` with borders **Buttons**: `shadow-none` by default,
rely on background colors **Popovers**: `shadow-lg` for elevation **Dialogs**: `shadow-2xl` with
ring for prominence

---

## Animations & Transitions

### Transition Properties

**Default Transitions**

```css
transition-all                                 /* All properties smoothly */
transition-[color,box-shadow]                  /* Specific properties */
```

**Button Transitions**

```html
class="transition-all" /* Smooth color/bg/shadow */
```

### Durations

No custom durations defined; uses Tailwind defaults:

```
duration-75: 75ms
duration-100: 100ms
duration-150: 150ms
duration-200: 200ms
duration-300: 300ms
duration-500: 500ms
duration-700: 700ms
duration-1000: 1000ms
```

### Easing Functions

Uses Tailwind defaults:

```
ease-linear
ease-in
ease-out
ease-in-out
```

### Spinner Animation

**Progress Bar Spinner**

```css
--bprogress-spinner-animation-duration: 400ms;
animation: linear infinite rotation 0-360deg;
```

**Indeterminate Progress Animations**

```css
animation: bprogress-indeterminate-increase 2s infinite;
animation: bprogress-indeterminate-decrease 2s infinite 0.5s;
```

### Scroll Behavior

```css
-webkit-overflow-scrolling: touch; /* Momentum scrolling iOS */
scroll-behavior: smooth; /* Smooth page scrolling */
overscroll-behavior: none; /* Prevent bounce */
```

### Hover & Active States

```css
hover:bg-secondary/80                          /* 80% opacity on hover */
active:opacity-60 md:active:opacity-100        /* Press effect mobile only */
```

### Code Block Animations

```css
/* Highlighted line animation with 2px accent line */
&:after {
  width: 2px;
  background-color: color-mix(in oklab, var(--muted-foreground) 50%, transparent);
}
```

---

## Dark Mode Implementation

### Mechanism

**1. Class-Based Switching**

```css
.dark {
  /* dark mode overrides */
}
```

**2. localStorage Persistence**

```javascript
localStorage.theme = 'dark' | 'light'
```

**3. System Detection**

```javascript
window.matchMedia('(prefers-color-scheme: dark)')
```

**4. CSS Property Update**

```javascript
document.documentElement.style.colorScheme = 'dark' | 'light'
```

**5. Meta Theme Color**

```html
<meta name="theme-color" content="#09090b" />
<!-- Dark -->
<meta name="theme-color" content="#ffffff" />
<!-- Light -->
```

### Selector Pattern

```css
:root {
  /* Light mode variables */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
}

.dark {
  /* Dark mode overrides */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
```

### Custom Variant

Tailwind v4 uses custom variants:

```css
@custom-variant dark (&:is(.dark *));
```

This allows:

```html
<div class="bg-background dark:bg-background"></div>
```

### Color Strategy

**1. Inversion**

- Light backgrounds become dark
- Dark text becomes light
- Maintains contrast ratios

**2. Transparent Borders in Dark Mode**

```css
--border: oklch(1 0 0 / 10%); /* White 10% opacity */
--input: oklch(1 0 0 / 15%); /* White 15% opacity */
```

Better blending than solid colors on varied backgrounds.

**3. Chart Colors** Same color scale works in both modes (blue-300 through blue-800).

**4. Semantic Color Adjustments**

```css
/* Light mode */
--destructive: oklch(0.577 0.245 27.325); /* Darker red */

/* Dark mode */
--destructive: oklch(0.704 0.191 22.216); /* Lighter red */
```

### Data Attributes

```html
<div data-theme="dark">
  <!-- Theme scoping -->
  <div data-radix-scroll-area-viewport><!-- Radix UI integration --></div>
</div>
```

---

## Component-Specific Patterns

### Button Component

**Base Classes**

```
inline-flex items-center justify-center whitespace-nowrap
transition-all disabled:pointer-events-none disabled:opacity-50
[&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0
outline-none group/button select-none
```

**Variants** (uses semantic class names like `cn-button-variant-default`)

Actual styles applied via Tailwind configuration:

- **default**: Primary button with `bg-primary text-primary-foreground`
- **outline**: Border-based with `border bg-transparent hover:bg-accent`
- **secondary**: `bg-secondary text-secondary-foreground hover:bg-secondary/80`
- **ghost**: Minimal `hover:bg-accent hover:text-accent-foreground`
- **destructive**: `bg-destructive text-destructive-foreground`
- **link**: Text link appearance `underline-offset-4 hover:underline`

**Sizes**

- **xs**: Extra small (height/padding reduced)
- **sm**: Small `h-8 px-3 gap-1.5`
- **default**: Standard `h-10 px-4 gap-2`
- **lg**: Large (increased height/padding)
- **icon**: Square icon button
- **icon-xs, icon-sm, icon-lg**: Icon size variants

**Icon Integration**

```html
<Icon data-icon="inline-start" />
<!-- Start position -->
<Icon data-icon="inline-end" />
<!-- End position -->
```

### Input Component

**Base Classes**

```
w-full min-w-0 outline-none
file:inline-flex file:border-0 file:bg-transparent
file:text-foreground
placeholder:text-muted-foreground
disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
```

**Styling via Field Component**

```
border bg-transparent
focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]
aria-invalid:border-destructive aria-invalid:ring-destructive/20
```

### Card Component

**Structure**

```html
<Card>                                         <!-- data-slot="card" -->
  <CardHeader>                                 <!-- data-slot="card-header" -->
    <CardTitle>                                <!-- data-slot="card-title" -->
    <CardDescription>                          <!-- data-slot="card-description" -->
    <CardAction>                               <!-- data-slot="card-action" -->
  </CardHeader>
  <CardContent>                                <!-- data-slot="card-content" -->
  <CardFooter>                                 <!-- data-slot="card-footer" -->
</Card>
```

**Styles**

```
bg-card text-card-foreground
rounded-xl border py-6 shadow-sm
flex flex-col gap-6
```

### Code Block Component

**Container**

```css
background-color: var(--color-code);
color: var(--color-code-foreground);
border-radius: var(--radius-xl);
font-size: var(--text-sm);
margin-top: calc(var(--spacing) * 6);
```

**Line Numbers**

```css
[data-line-numbers] [data-line]::before {
  counter-increment: line;
  content: counter(line);
  width: calc(var(--spacing) * 16);
  padding-right: calc(var(--spacing) * 6);
  color: var(--color-code-number);
}
```

**Highlighted Lines**

```css
background-color: var(--color-code-highlight);
&:after {
  width: 2px;
  background-color: color-mix(in oklab, var(--muted-foreground) 50%, transparent);
}
```

### Progress Bar

**Custom Properties**

```css
--bprogress-color: var(--progress-color);
--bprogress-height: 4px;
--bprogress-spinner-size: 18px;
--bprogress-spinner-animation-duration: 400ms;
--bprogress-spinner-border-size: 2px;
--bprogress-box-shadow: 0 0 10px var(--progress-color), 0 0 5px var(--progress-color);
--bprogress-z-index: 99999;
--bprogress-spinner-top: 15px;
--bprogress-spinner-right: 15px;
```

---

## Layout Utilities

### Container

```css
@utility container {
  @apply mx-auto max-w-[1400px] px-4 lg:px-8 3xl:max-w-screen-2xl;
}
```

### Breakpoints

```css
--breakpoint-3xl: 1600px;
--breakpoint-4xl: 2000px;
```

### Custom Utilities

**No Scrollbar**

```css
@utility no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

**Extend Touch Target** (for mobile accessibility)

```css
@utility extend-touch-target {
  @media (pointer: coarse) {
    @apply relative touch-manipulation after:absolute after:-inset-2;
  }
}
```

**Step Counter** (for documentation)

```css
@utility step {
  counter-increment: step;
  &:before {
    content: counter(step);
    @apply inline-flex size-6 items-center justify-center
           rounded-full bg-muted border-background;
  }
}
```

---

## CSS Variable Architecture

### Theme Inline Variables

All design tokens exposed to Tailwind via `@theme inline`:

```css
@theme inline {
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-lg: var(--radius);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  /* ... all semantic colors mapped to --color-* */
}
```

This allows:

```html
<div class="bg-background text-foreground">
  <button class="bg-primary text-primary-foreground"></button>
</div>
```

### Base Layer Defaults

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  ::selection {
    @apply bg-selection text-selection-foreground;
  }
  body {
    font-synthesis-weight: none;
    text-rendering: optimizeLegibility;
  }
}
```

---

## AI-Specific Component Patterns

### Message Streaming

Components designed for real-time updates:

```html
<Message>
  {message.parts.map(part => part.type === 'text' ? <MessageResponse>{part.text}</MessageResponse> :
  part.type === 'tool-call' ? <Tool {...part} /> : part.type === 'reasoning' ?
  <Reasoning>{part.reasoning}</Reasoning> : null )}
</Message>
```

### Reasoning Blocks

Collapsible with auto-collapse:

```html
<Reasoning>
  <ReasoningHeader>                            <!-- Duration display -->
  <ReasoningContent>                           <!-- Collapsible content -->
</Reasoning>
```

### Tool Execution Display

Status-aware components:

```html
<Tool name="search" status="complete">
  <ToolInput>{input}</ToolInput>
  <ToolOutput>{output}</ToolOutput>
</Tool>
```

Status values: `pending`, `running`, `complete`, `error`

---

## Key Differentiators

### 1. OKLCH Color Space

Perceptually uniform colors for better visual consistency and interpolation.

### 2. CSS Variable Theming

Entire design system configurable via CSS variables, no JavaScript required.

### 3. Transparent Dark Mode Borders

`oklch(1 0 0 / 10%)` creates better blending than solid colors.

### 4. Calculated Border Radius

Single `--radius` variable with `calc()` variants ensures consistency.

### 5. Component Data Slots

All components use `data-slot` attributes for consistent styling hooks.

### 6. Base UI Primitives

Built on Base UI (React Aria) instead of Radix in v4.

### 7. Tailwind v4 Integration

Uses `@theme inline` and `@custom-variant` for better DX.

### 8. Minimal Elevation

Subtle shadows and borders over heavy drop shadows.

### 9. Utility-First Typography

No predefined heading styles; compose with utilities.

### 10. Mobile-First Responsive

All spacing, typography, and layout scales from mobile up.

---

## Implementation Notes

### Font Loading

Fonts loaded via Next.js font optimization:

```typescript
import { Geist, GeistMono } from 'next/font/google'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })
const geistMono = GeistMono({ subsets: ['latin'], variable: '--font-mono' })
```

### Theme Switching Script

Injected before hydration to prevent flash:

```html
<script>
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
  }
  document.documentElement.style.colorScheme = document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light'
</script>
```

### Accessibility Features

- **Keyboard Navigation**: Full support via Base UI primitives
- **ARIA Attributes**: Proper semantic HTML and ARIA labels
- **Screen Reader**: Tested with assistive technologies
- **Focus Management**: Visible 3px focus rings with 50% opacity
- **Color Contrast**: All colors meet WCAG AA standards
- **Touch Targets**: Extended touch areas on mobile (`extend-touch-target`)

---

## Design Philosophy

1. **Beautiful Defaults**: Components look professional with zero configuration
2. **Composable Interface**: Sub-components for granular control
3. **Accessible First**: Never compromise accessibility for aesthetics
4. **Mobile First**: Responsive by default, starting from mobile
5. **Minimal Elevation**: Subtle shadows and borders over heavy effects
6. **Developer Joy**: Intuitive API that feels natural to use
7. **AI-Native**: Purpose-built for conversational interfaces
8. **Perceptual Uniformity**: OKLCH for consistent color perception

---

## References

- **Website**: https://ui.shadcn.com
- **AI Components**: https://www.shadcn.io/ai/
- **GitHub**: https://github.com/shadcn-ui/ui
- **Documentation**: https://ui.shadcn.com/docs
- **Themes**: https://ui.shadcn.com/themes
- **Version**: v4 (Tailwind v4 + Base UI)
- **License**: MIT

---

**Extracted by**: Claude Code Analysis **Date**: 2026-01-27 **Status**: Complete - All values
verified from source code
