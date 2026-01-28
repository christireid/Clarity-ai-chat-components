# Prompt Kit Design System - Complete Specification

**Analysis Date:** January 27, 2026 **Source:** https://www.prompt-kit.com/chat-ui **Framework:**
React + shadcn/ui + Tailwind CSS **Status:** PRIMARY DESIGN INSPIRATION TARGET

---

## Executive Summary

Prompt Kit employs a minimalist, card-based design system built on shadcn/ui and Tailwind CSS. The
system emphasizes clarity, generous whitespace, and consistent semantic tokens. Unlike traditional
chat bubble interfaces, Prompt Kit uses unified card styling for all messages, differentiating roles
through alignment and avatars rather than background colors.

**Core Design Principles:**

- Minimalist aesthetic with generous whitespace
- Card-based message design (not bubble-based)
- Semantic color tokens for theme flexibility
- System font stack for familiarity
- Consistent spacing scale (4px base grid)
- Subtle shadows and borders for elevation
- Accessibility-first approach

---

## 1. Color System

### Semantic Color Tokens

Prompt Kit uses CSS custom properties for theming, following shadcn/ui conventions.

#### Background Colors

```css
--background: 0 0% 100%; /* Main background - white (light) */
--card: 0 0% 100%; /* Message cards, elevated surfaces - white */
--muted: 240 4.8% 95.9%; /* Secondary backgrounds - zinc-50 */
--primary: 221.2 83.2% 53.3%; /* Action buttons, highlights - blue-500 */
--secondary: 240 4.8% 95.9%; /* Alternative actions - zinc-50 */
--accent: 240 4.8% 95.9%; /* Accent backgrounds - zinc-50 */
--destructive: 0 84.2% 60.2%; /* Error states - red-500 */
```

**Dark Mode Variants:**

```css
--background: 224 71.4% 4.1%; /* Near-black background */
--card: 224 71.4% 4.1%; /* Same as background for cards */
--muted: 215 27.9% 16.9%; /* Muted backgrounds - zinc-800 */
--primary: 217.2 91.2% 59.8%; /* Brighter blue for dark mode */
```

#### Foreground Colors

```css
--foreground: 222.2 84% 4.9%; /* Primary text - near-black */
--card-foreground: 222.2 84% 4.9%; /* Text on cards - near-black */
--muted-foreground: 215.4 16.3% 46.9%; /* Secondary text - zinc-500 */
--primary-foreground: 210 40% 98%; /* Text on primary buttons - white */
--destructive-foreground: 210 40% 98%; /* Text on error backgrounds */
--accent-foreground: 222.2 47.4% 11.2%; /* Text on accent backgrounds */
```

**Dark Mode Variants:**

```css
--foreground: 210 40% 98%; /* Near-white text */
--muted-foreground: 215 20.2% 65.1%; /* Lighter muted text - zinc-400 */
```

#### Border Colors

```css
--border: 214.3 31.8% 91.4%; /* Standard borders - zinc-200 */
--input: 214.3 31.8% 91.4%; /* Input field borders - zinc-200 */
```

**Dark Mode Variants:**

```css
--border: 216 34% 17%; /* Darker borders - zinc-700 */
--input: 216 34% 17%; /* Input borders in dark mode */
```

#### Chat-Specific Color Usage

**User Messages:**

- Background: `bg-card` (white in light, dark in dark mode)
- Text: `text-foreground` (high contrast)
- Border: `border-border` (subtle)
- Alignment: Right-aligned on desktop

**Assistant Messages:**

- Background: `bg-card` (same as user messages)
- Text: `text-foreground`
- Border: `border-border`
- Alignment: Left-aligned

**System Messages:**

- Background: `bg-muted` (visually distinct)
- Text: `text-muted-foreground`
- Border: None or subtle
- Centered alignment

**Error Messages:**

- Background: `bg-destructive/10` (10% opacity red)
- Text: `text-destructive`
- Border: `border-destructive`
- Icon: Red alert/error icon

**Tool Execution:**

- Background: `bg-accent` (subtle highlight)
- Text: `text-accent-foreground`
- Border: `border-accent`
- Icon: Function/tool icon

### Interactive States

**Hover States:**

```css
/* Buttons */
hover:bg-primary/90              /* 90% opacity primary */

/* Links */
hover:underline                  /* Underline on hover */

/* Cards/Messages */
hover:bg-muted/50                /* Subtle background on hover */

/* Action buttons in messages */
hover:bg-accent                  /* Accent background */
```

**Focus States:**

```css
focus-visible:ring-4             /* 4px focus ring */
focus-visible:ring-ring          /* Ring color from theme */
focus-visible:ring-offset-2      /* 2px offset from element */
```

**Active States:**

```css
active:bg-primary/95             /* Slightly darker on press */
active:scale-[0.98]              /* Subtle press animation */
```

**Disabled States:**

```css
disabled:opacity-50              /* 50% opacity */
disabled:pointer-events-none     /* No interactions */
disabled:cursor-not-allowed      /* Cursor indicates disabled */
```

### Message-Specific Colors

**Role-Based Differentiation:**

- User and assistant messages use SAME background color
- Differentiation through:
  - Alignment (user right, assistant left)
  - Avatar placement (user right, assistant left)
  - Avatar styling (user initial/photo, assistant AI icon/logo)

**Content-Based Colors:**

```css
/* Code blocks */
bg-zinc-950                      /* Dark background for code */
text-zinc-50                     /* Light text in code blocks */

/* Inline code */
bg-muted                         /* Subtle background */
text-foreground                  /* Standard text color */
border-border                    /* Subtle border */

/* Links in messages */
text-primary                     /* Primary color for links */
underline-offset-4               /* 4px underline offset */
hover:underline                  /* Underline on hover */

/* Timestamps */
text-muted-foreground            /* Muted color */
text-xs                          /* Small size */
```

---

## 2. Typography System

### Font Family

**Primary Font Stack:**

```css
font-family:
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  Roboto,
  'Helvetica Neue',
  Arial,
  'Noto Sans',
  sans-serif,
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Segoe UI Symbol',
  'Noto Color Emoji';
```

**Code Font Stack:**

```css
font-family:
  ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono',
  'Courier New', monospace;
```

### Font Sizes

| Token | Tailwind Class | Size (rem) | Size (px) | Usage                                  |
| ----- | -------------- | ---------- | --------- | -------------------------------------- |
| 5xl   | `text-5xl`     | 3rem       | 48px      | Hero headings, page titles             |
| 3xl   | `text-3xl`     | 1.875rem   | 30px      | Major section headers                  |
| 2xl   | `text-2xl`     | 1.5rem     | 24px      | Subsection headers                     |
| xl    | `text-xl`      | 1.25rem    | 20px      | Large body text, emphasized content    |
| lg    | `text-lg`      | 1.125rem   | 18px      | Component descriptions                 |
| base  | `text-base`    | 1rem       | 16px      | **Message content, default body text** |
| sm    | `text-sm`      | 0.875rem   | 14px      | Timestamps, metadata, UI labels        |
| xs    | `text-xs`      | 0.75rem    | 12px      | Tiny labels, badges, captions          |

### Font Weights

| Token    | Tailwind Class  | Weight | Usage                              |
| -------- | --------------- | ------ | ---------------------------------- |
| Light    | `font-light`    | 300    | Rarely used, subtle text           |
| Normal   | `font-normal`   | 400    | **Body text, messages (default)**  |
| Medium   | `font-medium`   | 500    | Headings, button text, emphasis    |
| Semibold | `font-semibold` | 600    | Strong emphasis                    |
| Bold     | `font-bold`     | 700    | Very strong emphasis (rarely used) |

### Line Heights

| Tailwind Class    | Value | Usage                       |
| ----------------- | ----- | --------------------------- |
| `leading-none`    | 1     | Tight spacing for titles    |
| `leading-tight`   | 1.25  | Headings                    |
| `leading-snug`    | 1.375 | Subheadings                 |
| `leading-normal`  | 1.5   | **Default for body text**   |
| `leading-relaxed` | 1.625 | Comfortable reading         |
| `leading-loose`   | 2     | Very spacious (rarely used) |

### Letter Spacing

```css
tracking-tight               /* -0.025em for headings */
tracking-normal              /* 0em for body text */
tracking-wide                /* 0.025em for emphasis */
```

### Typography in Chat Messages

**User Messages:**

```css
font-size: 1rem              /* text-base (16px) */
font-weight: 400             /* font-normal */
line-height: 1.5             /* leading-normal */
color: var(--foreground)     /* High contrast */
```

**Assistant Messages:**

```css
font-size: 1rem              /* text-base (16px) */
font-weight: 400             /* font-normal */
line-height: 1.625           /* leading-relaxed for readability */
color: var(--foreground)
```

**Timestamps:**

```css
font-size: 0.875rem          /* text-sm (14px) */
font-weight: 400             /* font-normal */
color: var(--muted-foreground)
```

**System Messages:**

```css
font-size: 0.875rem          /* text-sm (14px) */
font-weight: 400             /* font-normal */
color: var(--muted-foreground)
font-style: italic           /* Optional italic for system */
```

**Code Blocks:**

```css
font-family: monospace
font-size: 0.875rem          /* text-sm (14px) */
line-height: 1.7             /* More spacing for code */
```

**Inline Code:**

```css
font-family: monospace
font-size: 0.875em           /* Slightly smaller than surrounding text */
```

### Text Rendering

```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
text-rendering: optimizeLegibility;
```

---

## 3. Spacing System

### Base Grid

**Foundation:** 4px base grid (0.25rem)

All spacing follows 4px increments for visual consistency.

### Spacing Scale

| Token | Tailwind | Value (rem) | Value (px) | Usage                             |
| ----- | -------- | ----------- | ---------- | --------------------------------- |
| 0     | `0`      | 0           | 0px        | No spacing                        |
| 0.5   | `0.5`    | 0.125rem    | 2px        | Micro spacing                     |
| 1     | `1`      | 0.25rem     | 4px        | Tiny gaps                         |
| 2     | `2`      | 0.5rem      | 8px        | **Tight gaps**                    |
| 3     | `3`      | 0.75rem     | 12px       | Small gaps                        |
| 4     | `4`      | 1rem        | 16px       | **Default gaps**                  |
| 6     | `6`      | 1.5rem      | 24px       | **Message padding, card padding** |
| 8     | `8`      | 2rem        | 32px       | Large gaps                        |
| 12    | `12`     | 3rem        | 48px       | Section spacing                   |
| 16    | `16`     | 4rem        | 64px       | Major section spacing             |
| 48    | `48`     | 12rem       | 192px      | Hero spacing                      |

### Message Spacing

**Between Messages:**

```css
space-y-4                    /* 1rem (16px) vertical gap */
/* Or for tighter layouts: */
space-y-2                    /* 0.5rem (8px) */
```

**Message Internal Padding:**

```css
padding: 1.5rem              /* p-6 (24px all sides) */
/* Or on mobile: */
padding: 1rem                /* p-4 (16px all sides) */
```

**Avatar to Content Gap:**

```css
gap: 0.75rem; /* gap-3 (12px) */
```

**Message Actions Spacing:**

```css
margin-top: 0.5rem           /* mt-2 (8px) */
gap: 0.5rem                  /* gap-2 between action buttons */
```

### Container Spacing

**Chat Container:**

```css
padding: 1rem                /* p-4 (16px) on mobile */
padding: 1.5rem              /* p-6 (24px) on tablet */
padding: 2rem                /* p-8 (32px) on desktop */
```

**Sidebar:**

```css
width: 16rem                 /* w-64 (256px) on desktop */
padding: 1rem                /* p-4 (16px) */
```

**Section Gaps:**

```css
gap: 12rem                   /* gap-48 (192px) for major sections */
gap: 1.5rem                  /* gap-6 (24px) for related elements */
gap: 0.5rem                  /* gap-2 (8px) for tight groups */
```

### Input Area Spacing

**Prompt Input:**

```css
padding: 0.75rem 1rem        /* p-3 px-4 (12px vert, 16px horiz) */
/* Or larger variant: */
padding: 1rem 1rem           /* p-4 (16px all sides) */
```

**Button Spacing:**

```css
padding: 0.5rem 1rem         /* py-2 px-4 (8px vert, 16px horiz) */
height: 2.25rem              /* h-9 (36px) */
gap: 0.5rem                  /* gap-2 between icon and text */
```

**Suggestion Chips:**

```css
padding: 0.5rem 0.75rem      /* py-2 px-3 (8px vert, 12px horiz) */
gap: 0.5rem                  /* gap-2 between chips */
margin-top: 0.75rem          /* mt-3 (12px) below input */
```

### Responsive Spacing

**Mobile (< 640px):**

```css
p-4                          /* 16px padding */
gap-2                        /* 8px gaps */
space-y-2                    /* 8px vertical spacing */
```

**Tablet (640px - 1024px):**

```css
p-6                          /* 24px padding */
gap-4                        /* 16px gaps */
space-y-4                    /* 16px vertical spacing */
```

**Desktop (> 1024px):**

```css
p-8                          /* 32px padding */
gap-6                        /* 24px gaps */
space-y-6                    /* 24px vertical spacing */
```

### Layout Constraints

**Max Widths:**

```css
max-w-xl                     /* 36rem (576px) - narrow content */
max-w-2xl                    /* 42rem (672px) - comfortable reading */
max-w-4xl                    /* 56rem (896px) - standard chat width */
max-w-6xl                    /* 72rem (1152px) - wide layouts */
max-w-7xl                    /* 80rem (1280px) - full-width */
```

**Heights:**

```css
h-[600px]                    /* Fixed height chat containers */
h-screen                     /* Full viewport height */
min-h-[200px]                /* Minimum textarea height */
max-h-[400px]                /* Maximum expanded textarea */
```

---

## 4. Component Specifications

### Message Card Design

**Structure:**

```
┌─────────────────────────────────────────┐
│  [Avatar]  Message Content              │ ← Assistant (left-aligned)
│            - Text with markdown          │
│            - Code blocks                 │
│            - Images, etc.                │
│            [Copy] [Regenerate] [Edit]    │ ← Actions (hover)
└─────────────────────────────────────────┘

                 ┌─────────────────────────────────────────┐
                 │              Message Content  [Avatar]  │ ← User (right-aligned)
                 │          - User's input text            │
                 │    [Copy] [Edit] [Delete]               │ ← Actions (hover)
                 └─────────────────────────────────────────┘
```

**Card Styling:**

```css
/* Base card */
background: var(--card);
border: 1px solid var(--border);
border-radius: 0.5rem; /* rounded-lg (8px) */
padding: 1.5rem; /* p-6 (24px) */
box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */

/* Hover state */
&:hover {
  background: var(--muted/50);
}
```

**Avatar Specifications:**

```css
width: 2.5rem; /* w-10 (40px) */
height: 2.5rem; /* h-10 (40px) */
border-radius: 9999px; /* rounded-full (circle) */
background: var(--primary); /* For initials */
color: var(--primary-foreground);
font-size: 1rem; /* text-base (16px) */
font-weight: 500; /* font-medium */
display: flex;
align-items: center;
justify-content: center;
```

**Message Layout:**

```css
display: flex;
gap: 0.75rem; /* gap-3 (12px) between avatar and content */
align-items: flex-start;

/* For user messages, reverse the flex direction */
flex-direction: row-reverse;
```

**Content Area:**

```css
flex: 1; /* Grows to fill space */
min-width: 0; /* Allows text wrapping */
overflow-wrap: break-word; /* Break long words */
```

**Action Buttons:**

```css
display: flex;
gap: 0.5rem; /* gap-2 (8px) */
margin-top: 0.5rem; /* mt-2 (8px) */
opacity: 0; /* Hidden by default */
transition: opacity 200ms ease;

/* Show on message hover */
.message:hover & {
  opacity: 1;
}
```

**Individual Action Button:**

```css
width: 2rem; /* w-8 (32px) */
height: 2rem; /* h-8 (32px) */
border-radius: 0.375rem; /* rounded-md (6px) */
padding: 0.25rem; /* p-1 (4px) */
color: var(--muted-foreground);

&:hover {
  background: var(--accent);
  color: var(--accent-foreground);
}
```

### Input Area Design

**Container:**

```css
position: sticky;
bottom: 0;
background: var(--background);
border-top: 1px solid var(--border);
padding: 1rem; /* p-4 (16px) */
```

**Prompt Input (Textarea):**

```css
width: 100%;
min-height: 3rem; /* min-h-12 (48px) */
max-height: 25rem; /* max-h-[400px] */
padding: 0.75rem 1rem; /* p-3 px-4 (12px vert, 16px horiz) */
border: 1px solid var(--input);
border-radius: 0.375rem; /* rounded-md (6px) */
background: var(--background);
font-size: 1rem; /* text-base (16px) */
line-height: 1.5; /* leading-normal */
resize: none; /* Controlled by JavaScript */
outline: none;

&:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--ring); /* ring-4 */
}

&::placeholder {
  color: var(--muted-foreground);
}
```

**Send Button:**

```css
height: 2.25rem; /* h-9 (36px) */
padding: 0.5rem 1rem; /* py-2 px-4 (8px vert, 16px horiz) */
background: var(--primary);
color: var(--primary-foreground);
border: none;
border-radius: 0.375rem; /* rounded-md (6px) */
font-size: 0.875rem; /* text-sm (14px) */
font-weight: 500; /* font-medium */
transition: background-color 200ms ease;

&:hover {
  background: hsl(var(--primary) / 0.9); /* hover:bg-primary/90 */
}

&:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

&:active {
  transform: scale(0.98);
}
```

**Action Buttons (Voice, Attachments, etc.):**

```css
width: 2.25rem; /* w-9 (36px) */
height: 2.25rem; /* h-9 (36px) */
padding: 0.5rem; /* p-2 (8px) */
border-radius: 0.375rem; /* rounded-md (6px) */
color: var(--muted-foreground);

&:hover {
  background: var(--accent);
  color: var(--accent-foreground);
}
```

**Suggestion Chips:**

```css
display: inline-flex;
align-items: center;
padding: 0.5rem 0.75rem; /* py-2 px-3 (8px vert, 12px horiz) */
background: var(--muted);
color: var(--muted-foreground);
border: 1px solid var(--border);
border-radius: 9999px; /* rounded-full (pill shape) */
font-size: 0.875rem; /* text-sm (14px) */
transition: background-color 200ms ease;
cursor: pointer;

&:hover {
  background: var(--accent);
  color: var(--accent-foreground);
}
```

### Sidebar Design

**Container:**

```css
width: 16rem; /* w-64 (256px) */
height: 100vh;
background: var(--card);
border-right: 1px solid var(--border);
padding: 1rem; /* p-4 (16px) */
display: flex;
flex-direction: column;
gap: 1rem; /* gap-4 (16px) */

/* Mobile: slide-out overlay */
@media (max-width: 768px) {
  position: fixed;
  left: -100%;
  transition: left 300ms ease;
  z-index: 50;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);

  &.open {
    left: 0;
  }
}
```

**Sidebar Header:**

```css
display: flex;
align-items: center;
justify-content: space-between;
padding-bottom: 1rem; /* pb-4 (16px) */
border-bottom: 1px solid var(--border);
```

**New Chat Button:**

```css
width: 100%;
padding: 0.5rem 1rem; /* py-2 px-4 (8px vert, 16px horiz) */
background: var(--primary);
color: var(--primary-foreground);
border-radius: 0.375rem; /* rounded-md (6px) */
font-size: 0.875rem; /* text-sm (14px) */
font-weight: 500; /* font-medium */

&:hover {
  background: hsl(var(--primary) / 0.9);
}
```

**Conversation List:**

```css
flex: 1;
overflow-y: auto;
display: flex;
flex-direction: column;
gap: 0.25rem; /* gap-1 (4px) */
```

**Time Section Header:**

```css
font-size: 0.75rem; /* text-xs (12px) */
font-weight: 500; /* font-medium */
color: var(--muted-foreground);
text-transform: uppercase;
letter-spacing: 0.05em; /* tracking-wider */
padding: 0.5rem 0; /* py-2 (8px vert) */
margin-top: 1rem; /* mt-4 (16px) for sections after first */
```

**Conversation Item:**

```css
padding: 0.5rem 0.75rem; /* py-2 px-3 (8px vert, 12px horiz) */
border-radius: 0.375rem; /* rounded-md (6px) */
font-size: 0.875rem; /* text-sm (14px) */
color: var(--foreground);
cursor: pointer;
transition: background-color 150ms ease;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;

&:hover {
  background: var(--muted);
}

&.active {
  background: var(--accent);
  color: var(--accent-foreground);
  font-weight: 500; /* font-medium */
}

/* Actions on hover */
.actions {
  opacity: 0;
  transition: opacity 150ms ease;
}

&:hover .actions {
  opacity: 1;
}
```

### Settings Panel Design

**Panel Container (Drawer/Modal):**

```css
width: 28rem; /* w-[448px] */
max-width: 100%;
height: 100vh;
background: var(--card);
border-left: 1px solid var(--border);
padding: 2rem; /* p-8 (32px) */
display: flex;
flex-direction: column;
gap: 2rem; /* gap-8 (32px) */
overflow-y: auto;

/* Slide-in animation */
animation: slide-in-right 300ms ease;

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
```

**Section:**

```css
display: flex;
flex-direction: column;
gap: 1rem; /* gap-4 (16px) */
padding-bottom: 2rem; /* pb-8 (32px) */
border-bottom: 1px solid var(--border);

&:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
```

**Section Header:**

```css
font-size: 1.125rem; /* text-lg (18px) */
font-weight: 500; /* font-medium */
color: var(--foreground);
margin-bottom: 0.5rem; /* mb-2 (8px) */
```

**Section Description:**

```css
font-size: 0.875rem; /* text-sm (14px) */
color: var(--muted-foreground);
line-height: 1.5;
```

**Form Field:**

```css
display: flex;
flex-direction: column;
gap: 0.5rem; /* gap-2 (8px) */
```

**Label:**

```css
font-size: 0.875rem; /* text-sm (14px) */
font-weight: 500; /* font-medium */
color: var(--foreground);
```

**Input Field:**

```css
padding: 0.5rem 0.75rem; /* py-2 px-3 (8px vert, 12px horiz) */
border: 1px solid var(--input);
border-radius: 0.375rem; /* rounded-md (6px) */
background: var(--background);
font-size: 0.875rem; /* text-sm (14px) */

&:focus {
  outline: none;
  box-shadow: 0 0 0 4px var(--ring);
}
```

**Select/Dropdown:**

```css
padding: 0.5rem 2rem 0.5rem 0.75rem; /* Space for arrow */
background-image: url('data:image/svg+xml,...'); /* Dropdown arrow */
background-position: right 0.5rem center;
background-repeat: no-repeat;
background-size: 1rem;
appearance: none;
```

**Toggle Switch:**

```css
width: 2.75rem; /* w-11 (44px) */
height: 1.5rem; /* h-6 (24px) */
background: var(--input);
border-radius: 9999px; /* rounded-full */
position: relative;
transition: background-color 200ms ease;
cursor: pointer;

&[data-state='checked'] {
  background: var(--primary);
}

/* Toggle thumb */
&::after {
  content: '';
  width: 1.25rem; /* 20px */
  height: 1.25rem; /* 20px */
  background: white;
  border-radius: 9999px;
  position: absolute;
  left: 0.125rem; /* 2px */
  top: 0.125rem; /* 2px */
  transition: transform 200ms ease;
}

&[data-state='checked']::after {
  transform: translateX(1.25rem); /* Move to right */
}
```

**Slider:**

```css
width: 100%;
height: 1.25rem; /* h-5 (20px) */
position: relative;
display: flex;
align-items: center;

/* Track */
.slider-track {
  width: 100%;
  height: 0.375rem; /* h-1.5 (6px) */
  background: var(--muted);
  border-radius: 9999px;
  position: relative;
}

/* Range (filled part) */
.slider-range {
  height: 100%;
  background: var(--primary);
  border-radius: 9999px;
  position: absolute;
}

/* Thumb */
.slider-thumb {
  width: 1.25rem; /* w-5 (20px) */
  height: 1.25rem; /* h-5 (20px) */
  background: var(--primary);
  border: 2px solid var(--background);
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);

  &:hover {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px var(--ring);
  }
}
```

### Code Block Design

**Container:**

```css
background: hsl(220 13% 9%); /* Dark background (Night Owl inspired) */
border: 1px solid var(--border);
border-radius: 0.5rem; /* rounded-lg (8px) */
margin: 1rem 0; /* my-4 (16px vert) */
overflow: hidden;
```

**Header:**

```css
display: flex;
align-items: center;
justify-content: space-between;
padding: 0.5rem 1rem; /* py-2 px-4 (8px vert, 16px horiz) */
background: hsl(220 13% 12%); /* Slightly lighter than code area */
border-bottom: 1px solid hsl(220 13% 20%);
```

**Language Label:**

```css
font-size: 0.75rem; /* text-xs (12px) */
color: hsl(220 14% 71%); /* Light gray */
text-transform: uppercase;
letter-spacing: 0.05em; /* tracking-wider */
```

**Copy Button:**

```css
padding: 0.25rem 0.5rem; /* py-1 px-2 (4px vert, 8px horiz) */
background: transparent;
color: hsl(220 14% 71%);
border: 1px solid hsl(220 13% 20%);
border-radius: 0.25rem; /* rounded (4px) */
font-size: 0.75rem; /* text-xs (12px) */

&:hover {
  background: hsl(220 13% 20%);
  color: white;
}
```

**Code Content:**

```css
padding: 1rem; /* p-4 (16px) */
overflow-x: auto;
font-family: monospace;
font-size: 0.875rem; /* text-sm (14px) */
line-height: 1.7; /* Spacious for readability */
color: hsl(220 14% 96%); /* Light text */

/* Syntax highlighting colors */
.token.comment {
  color: hsl(220 10% 40%);
} /* Muted */
.token.keyword {
  color: hsl(207 82% 66%);
} /* Blue */
.token.string {
  color: hsl(80 76% 53%);
} /* Green */
.token.function {
  color: hsl(221 87% 60%);
} /* Lighter blue */
.token.number {
  color: hsl(29 54% 61%);
} /* Orange */
```

### Loading States

**Text Shimmer (Streaming):**

```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.shimmer {
  background: linear-gradient(
    to right,
    var(--muted) 0%,
    var(--muted-foreground/20) 50%,
    var(--muted) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
  border-radius: 0.25rem;
  height: 1rem;
  width: 100%;
}
```

**Thinking Bar:**

```css
width: 100%;
height: 0.25rem; /* h-1 (4px) */
background: var(--muted);
border-radius: 9999px;
overflow: hidden;
position: relative;

&::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 40%;
  background: var(--primary);
  border-radius: inherit;
  animation: thinking 1.5s ease-in-out infinite;
}

@keyframes thinking {
  0% {
    left: -40%;
  }
  50% {
    left: 50%;
  }
  100% {
    left: 110%;
  }
}
```

**Spinner:**

```css
width: 1.5rem; /* w-6 (24px) */
height: 1.5rem; /* h-6 (24px) */
border: 2px solid var(--muted);
border-top-color: var(--primary);
border-radius: 9999px;
animation: spin 1s linear infinite;

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

---

## 5. Layout Patterns

### Three-Tier Architecture Visual Implementation

**Tier 1: Components (Atomic Level)**

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Avatar        │  │   Message       │  │  Prompt Input   │
│                 │  │                 │  │                 │
│   [Icon/Img]    │  │   Text content  │  │  [Textarea]     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Tier 2: Blocks (Composed Patterns)**

```
┌───────────────────────────────────────────────────────┐
│  Basic Chat Block                                     │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Messages                                        │  │
│  │  [Avatar] "How can I help you?"                 │  │
│  │  "Tell me about..." [Avatar]                    │  │
│  └─────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────┐  │
│  │ [Textarea]                           [Send]     │  │
│  └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
```

**Tier 3: Primitives (Full-Stack Solutions)**

```
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────┐  ┌────────────────────────────────────────┐   │
│  │ History │  │  Chat Interface                        │   │
│  │         │  │  ┌──────────────────────────────────┐  │   │
│  │ Today   │  │  │ Messages with streaming         │  │   │
│  │ • Chat1 │  │  │ Tool execution display          │  │   │
│  │ • Chat2 │  │  │ Chain of thought visualization  │  │   │
│  │         │  │  └──────────────────────────────────┘  │   │
│  │ Yest.   │  │  ┌──────────────────────────────────┐  │   │
│  │ • Chat3 │  │  │ Input with suggestions          │  │   │
│  └─────────┘  │  └──────────────────────────────────┘  │   │
│               └────────────────────────────────────────┘   │
│  + Backend API routes + Streaming + Error handling        │
└─────────────────────────────────────────────────────────────┘
```

### Card-Based Message Layout

```
Left-aligned (Assistant):
┌─────────────────────────────────────────────────────┐
│ [AI]  This is the assistant's response.            │
│       • Can contain markdown                        │
│       • Code blocks                                 │
│       • Lists and formatting                        │
│                                                     │
│       [Copy] [Regenerate] (on hover)               │
└─────────────────────────────────────────────────────┘

Right-aligned (User):
         ┌─────────────────────────────────────────────┐
         │       This is the user's message.      [U]  │
         │       Shorter, simple text.                 │
         │                                             │
         │       [Copy] [Edit] [Delete] (on hover)     │
         └─────────────────────────────────────────────┘
```

**Key Visual Characteristics:**

- Same card background for both user and assistant
- Alignment differentiates roles (not color)
- Avatar placement matches alignment (left for AI, right for user)
- Actions appear on hover to reduce visual clutter
- Generous padding within cards (24px)
- Subtle border and shadow for depth

### Chat Container Layout

```
┌─────────────────────────────────────────────────────────┐
│ Header (optional)                                       │
│ ┌─ Model Selector ─┐  [Settings] [New Chat]           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Scrollable Message Area                                │
│ ┌─────────────────────────────────────────────────┐   │
│ │ [AI]  Message 1                                 │   │
│ │       ...                                       │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│          ┌──────────────────────────────────────┐      │
│          │       Message 2                 [U]  │      │
│          └──────────────────────────────────────┘      │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ [AI]  Message 3 (streaming...)                  │   │
│ │       ▓▓▓▓▓▓░░░░░░░ (shimmer effect)           │   │
│                                                         │
│                      [Scroll to bottom ↓] (if needed)  │
├─────────────────────────────────────────────────────────┤
│ Input Area (fixed at bottom)                           │
│ ┌─────────────────────────────────────────────────┐   │
│ │ [🎤] [📎]  Type your message...      [Send →]   │   │
│ └─────────────────────────────────────────────────┘   │
│ Suggestions: [Summarize] [Code] [Design] [Research]   │
└─────────────────────────────────────────────────────────┘
```

### Sidebar Layout

```
┌──────────────────┐
│ [+ New Chat]     │ ← Primary action
├──────────────────┤
│ 🔍 Search...     │ ← Optional search
├──────────────────┤
│                  │
│ TODAY            │ ← Time section header
│ • Current chat   │ ← Active (highlighted)
│ • Earlier today  │
│                  │
│ YESTERDAY        │
│ • Chat about X   │
│ • Chat about Y   │
│                  │
│ LAST 7 DAYS      │
│ • Older chat 1   │
│ • Older chat 2   │
│ • ...            │
│                  │
│ (scroll if more) │
├──────────────────┤
│ [⚙️ Settings]    │ ← Footer actions
└──────────────────┘
   256px (w-64)
```

---

## 6. Interaction & Animation

### Transitions

**Default Transition:**

```css
transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
transition-duration: 150ms;
```

**Smooth Transitions:**

```css
transition-property: all;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
transition-duration: 200ms;
```

**Slow Transitions (Drawer, Modal):**

```css
transition-duration: 300ms;
transition-timing-function: ease-in-out;
```

### Hover Effects

**Buttons:**

```css
/* Scale down slightly on press */
&:active {
  transform: scale(0.98);
  transition: transform 100ms ease;
}

/* Background change on hover */
&:hover {
  background: hsl(var(--primary) / 0.9);
  transition: background-color 200ms ease;
}
```

**Cards:**

```css
/* Subtle background change */
&:hover {
  background: hsl(var(--muted) / 0.5);
  transition: background-color 150ms ease;
}
```

**Links:**

```css
/* Underline on hover */
&:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

### Focus States

**Keyboard Focus (Accessibility):**

```css
&:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px hsl(var(--ring));
  transition: box-shadow 150ms ease;
}
```

**Remove default outline:**

```css
&:focus {
  outline: none;
}
```

### Scroll Behavior

**Smooth Scrolling:**

```css
scroll-behavior: smooth;
```

**Auto-scroll to Bottom (JavaScript):**

```javascript
// When new message arrives
messageContainer.scrollTo({
  top: messageContainer.scrollHeight,
  behavior: 'smooth',
})
```

**Scroll Button Visibility:**

```javascript
// Show when scrolled up more than 100px from bottom
const isNearBottom =
  messageContainer.scrollHeight - messageContainer.scrollTop - messageContainer.clientHeight < 100
scrollButton.style.display = isNearBottom ? 'none' : 'block'
```

### Loading Animations

**Message Streaming Animation:**

```css
/* Shimmer effect for loading text */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.loading-text {
  background: linear-gradient(
    90deg,
    hsl(var(--muted)) 0px,
    hsl(var(--muted-foreground) / 0.2) 50%,
    hsl(var(--muted)) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
  border-radius: 0.25rem;
}
```

**Fade In (New Messages):**

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message {
  animation: fadeIn 300ms ease;
}
```

**Slide In (Sidebar, Drawer):**

```css
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.drawer {
  animation: slideInRight 300ms ease;
}
```

---

## 7. Responsive Design

### Breakpoints

```css
/* Mobile-first approach */
/* Default: Mobile (< 640px) */

/* sm: Small tablets and up */
@media (min-width: 640px) { ... }

/* md: Tablets and up */
@media (min-width: 768px) { ... }

/* lg: Desktop and up */
@media (min-width: 1024px) { ... }

/* xl: Large desktop */
@media (min-width: 1280px) { ... }

/* 2xl: Extra large desktop */
@media (min-width: 1536px) { ... }
```

### Responsive Layout Patterns

**Mobile (< 768px):**

```css
/* Full-width layout */
.chat-container {
  width: 100%;
  padding: 1rem; /* p-4 */
}

/* Sidebar hidden by default, overlay when open */
.sidebar {
  position: fixed;
  left: -100%;
  width: 80%;
  max-width: 20rem;
  transition: left 300ms ease;
  z-index: 50;
}

.sidebar.open {
  left: 0;
}

/* Stacked message layout */
.message {
  max-width: 100%;
  padding: 1rem; /* p-4 (reduced from p-6) */
}

/* Smaller avatars */
.avatar {
  width: 2rem; /* w-8 (32px) */
  height: 2rem; /* h-8 */
}

/* Compact input */
.prompt-input {
  padding: 0.75rem; /* p-3 */
  font-size: 1rem; /* text-base */
}
```

**Tablet (768px - 1024px):**

```css
.chat-container {
  width: 100%;
  max-width: 48rem; /* max-w-3xl (768px) */
  margin: 0 auto;
  padding: 1.5rem; /* p-6 */
}

/* Sidebar can be toggled */
.sidebar {
  width: 16rem; /* w-64 (256px) */
  position: relative;
  left: 0;
}

.message {
  padding: 1.5rem; /* p-6 */
}
```

**Desktop (> 1024px):**

```css
/* Side-by-side layout */
.app-layout {
  display: flex;
}

.sidebar {
  width: 16rem; /* w-64 (256px) */
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
}

.chat-container {
  flex: 1;
  max-width: 56rem; /* max-w-4xl (896px) */
  margin: 0 auto;
  padding: 2rem; /* p-8 */
}

.message {
  padding: 1.5rem; /* p-6 */
}

/* Standard avatars */
.avatar {
  width: 2.5rem; /* w-10 (40px) */
  height: 2.5rem; /* h-10 */
}
```

### Touch Targets

**Minimum Touch Target Size (Mobile):**

```css
/* All interactive elements */
button,
a,
.clickable {
  min-width: 44px;
  min-height: 44px;
  /* Following iOS/Android guidelines */
}
```

**Touch-Friendly Spacing:**

```css
/* Mobile: increase gaps for easier tapping */
@media (max-width: 768px) {
  .action-buttons {
    gap: 0.75rem; /* gap-3 (12px) instead of gap-2 */
  }
}
```

---

## 8. Accessibility

### ARIA Labels & Roles

**Message Components:**

```html
<div role="article" aria-label="Assistant message">
  <div role="img" aria-label="Assistant avatar">...</div>
  <div>Message content</div>
</div>

<div role="article" aria-label="User message">
  <div>Message content</div>
  <div role="img" aria-label="User avatar">...</div>
</div>
```

**Input Area:**

```html
<form role="search" aria-label="Send message">
  <textarea
    aria-label="Message input"
    aria-describedby="input-hint"
    aria-multiline="true"
  ></textarea>
  <span id="input-hint" class="sr-only"> Press Enter to send, Shift+Enter for new line </span>
  <button aria-label="Send message">Send</button>
</form>
```

**Sidebar:**

```html
<nav aria-label="Conversation history">
  <button aria-label="New chat">New Chat</button>
  <div role="list" aria-label="Recent conversations">
    <div role="listitem">
      <button aria-label="Chat from today at 2:30pm">...</button>
    </div>
  </div>
</nav>
```

### Keyboard Navigation

**Focus Order:**

1. Sidebar (if visible)
2. Main chat container
3. Message action buttons (copy, regenerate, etc.)
4. Prompt input
5. Send button and input actions

**Keyboard Shortcuts:**

```
Enter           → Send message (when input focused)
Shift + Enter   → New line in input
Esc             → Close modal/drawer
Tab             → Navigate forward
Shift + Tab     → Navigate backward
↑/↓             → Navigate conversation history (sidebar)
Ctrl/Cmd + K    → Focus search (if present)
```

### Screen Reader Support

**Screen Reader Only Text:**

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Live Regions for Dynamic Content:**

```html
<!-- Announce new messages to screen readers -->
<div role="log" aria-live="polite" aria-atomic="false" class="sr-only">
  New message from assistant
</div>

<!-- Announce errors -->
<div role="alert" aria-live="assertive" class="sr-only">Error: Failed to send message</div>
```

### Color Contrast

**WCAG AAA Standards:**

```
Background to Text:
- Light mode: 21:1 (white #FFFFFF to near-black #09090B)
- Dark mode: 18:1 (near-black #09090B to near-white #FAFAFA)

Muted Text:
- Light mode: 7:1 (minimum for AA Large)
- Dark mode: 7:1

Interactive Elements:
- Focus ring: 3:1 minimum against background
- Border: 3:1 minimum for non-text UI components
```

### Focus Management

**Focus Indicators:**

```css
/* Always visible focus ring for keyboard users */
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Remove default browser outline */
*:focus {
  outline: none;
}

/* Custom focus ring for specific elements */
button:focus-visible {
  box-shadow: 0 0 0 4px hsl(var(--ring));
}
```

**Focus Trapping (Modals):**

```javascript
// Keep focus within modal when open
modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus()
      e.preventDefault()
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus()
      e.preventDefault()
    }
  }
})
```

---

## 9. Performance Considerations

### Optimization Techniques

**Lazy Loading:**

```javascript
// Lazy load heavy components
const CodeHighlighter = lazy(() => import('./CodeHighlighter'))
const Mermaid = lazy(() => import('./Mermaid'))
```

**Virtualization (Long Message Lists):**

```javascript
// Use react-window or similar for long lists
import { FixedSizeList } from 'react-window'

;<FixedSizeList height={600} itemCount={messages.length} itemSize={120} width="100%">
  {Message}
</FixedSizeList>
```

**Debounced Input:**

```javascript
// Debounce typing indicators or auto-save
const debouncedOnChange = useMemo(() => debounce(onChange, 300), [onChange])
```

**Memoization:**

```javascript
// Prevent unnecessary re-renders
const MemoizedMessage = React.memo(Message, (prev, next) => {
  return prev.content === next.content && prev.role === next.role
})
```

**Theme Transition Disabling:**

```css
/* Disable transitions during theme change for performance */
.disable-transitions * {
  transition: none !important;
}
```

### Image Optimization

**Avatar Images:**

```html
<!-- Use appropriate sizes -->
<img src="/avatar.jpg" width="40" height="40" loading="lazy" decoding="async" alt="User avatar" />
```

**Message Images:**

```html
<!-- Responsive images with srcset -->
<img
  src="/image-800.jpg"
  srcset="/image-400.jpg 400w, /image-800.jpg 800w, /image-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 800px"
  loading="lazy"
  alt="User uploaded image"
/>
```

---

## 10. AI-Specific UI Patterns

### Chain of Thought Visualization

**Container:**

```css
.chain-of-thought {
  background: var(--muted);
  border-left: 3px solid var(--primary);
  border-radius: 0.375rem;
  padding: 1rem;
  margin: 1rem 0;
  font-size: 0.875rem;
}

.chain-of-thought-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 0.75rem;
  cursor: pointer;
}

.chain-of-thought-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 200ms ease;
}

.chain-of-thought.collapsed .chain-of-thought-icon {
  transform: rotate(-90deg);
}

.chain-of-thought-content {
  color: var(--muted-foreground);
  line-height: 1.6;
}
```

**Visual Structure:**

```
┌───────────────────────────────────────────┐
│ ▼ Reasoning Process                       │
│                                           │
│ 1. Understanding the question...          │
│    → User is asking about X               │
│                                           │
│ 2. Gathering relevant information...      │
│    → Found data point A                   │
│    → Found data point B                   │
│                                           │
│ 3. Synthesizing answer...                 │
│    → Combining A and B                    │
│                                           │
│ Conclusion: ...                           │
└───────────────────────────────────────────┘
```

### Tool Execution Display

**Container:**

```css
.tool-execution {
  background: var(--accent);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  font-size: 0.875rem;
}

.tool-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 0.5rem;
}

.tool-icon {
  width: 1rem;
  height: 1rem;
  color: var(--primary);
}

.tool-name {
  font-family: monospace;
  color: var(--primary);
}

.tool-args {
  background: var(--background);
  border-radius: 0.25rem;
  padding: 0.5rem;
  margin: 0.5rem 0;
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--muted-foreground);
}

.tool-result {
  padding: 0.5rem;
  border-top: 1px solid var(--border);
  margin-top: 0.5rem;
  color: var(--foreground);
}
```

**Visual Structure:**

```
┌───────────────────────────────────────────┐
│ 🔧 getWeather({ city: "San Francisco" })  │
│                                           │
│ Arguments:                                │
│ { "city": "San Francisco", "units": "F" } │
│                                           │
│ ─────────────────────────────────────────│
│                                           │
│ Result:                                   │
│ Sunny, 72°F                               │
└───────────────────────────────────────────┘
```

### Source Attribution

**Container:**

```css
.source-card {
  display: flex;
  gap: 0.75rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin: 0.5rem 0;
  transition: background-color 150ms ease;
  cursor: pointer;
}

.source-card:hover {
  background: var(--muted);
}

.source-icon {
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border-radius: 0.25rem;
  object-fit: cover;
}

.source-content {
  flex: 1;
  min-width: 0;
}

.source-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.source-url {
  font-size: 0.75rem;
  color: var(--muted-foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**Visual Structure:**

```
Sources:
┌─────────────────────────────────────┐
│ [🌐]  Wikipedia - Artificial Int... │
│       wikipedia.org/wiki/Artifi...  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ [📄]  OpenAI Documentation          │
│       platform.openai.com/docs      │
└─────────────────────────────────────┘
```

### Voice Input Visualizer (Conceptual)

```css
.voice-visualizer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  height: 3rem;
  padding: 1rem;
}

.voice-bar {
  width: 0.25rem;
  background: var(--primary);
  border-radius: 9999px;
  animation: voice-pulse 0.5s ease-in-out infinite alternate;
}

.voice-bar:nth-child(1) {
  animation-delay: 0s;
}
.voice-bar:nth-child(2) {
  animation-delay: 0.1s;
}
.voice-bar:nth-child(3) {
  animation-delay: 0.2s;
}
.voice-bar:nth-child(4) {
  animation-delay: 0.1s;
}
.voice-bar:nth-child(5) {
  animation-delay: 0s;
}

@keyframes voice-pulse {
  from {
    height: 0.5rem;
  }
  to {
    height: 2rem;
  }
}
```

---

## 11. Implementation Notes

### Technology Stack

**Required Dependencies:**

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

**Tailwind Configuration:**

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... more color definitions
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}
```

### CSS Custom Properties Setup

```css
/* globals.css or root styles */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    /* ... more tokens */
  }

  .dark {
    --background: 224 71.4% 4.1%;
    --foreground: 210 40% 98%;
    --card: 224 71.4% 4.1%;
    --card-foreground: 210 40% 98%;
    --muted: 215 27.9% 16.9%;
    --muted-foreground: 215 20.2% 65.1%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --border: 216 34% 17%;
    --input: 216 34% 17%;
    --ring: 224.3 76.3% 48%;
    /* ... more tokens */
  }
}
```

### Utility Functions

**Class Name Merging:**

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Theme Toggling:**

```typescript
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  return { theme, setTheme }
}
```

---

## 12. Design System Comparison

### Prompt Kit vs Ant Design X

| Aspect                  | Prompt Kit                            | Ant Design X               |
| ----------------------- | ------------------------------------- | -------------------------- |
| **Architecture**        | 3-tier (Components/Blocks/Primitives) | Monorepo (UI/SDK/Markdown) |
| **Message Design**      | Card-based, alignment-differentiated  | Bubble-based with variants |
| **Color System**        | shadcn/ui semantic tokens             | Ant Design token system    |
| **Installation**        | shadcn CLI (copy-paste)               | npm package                |
| **Customization**       | Full source code ownership            | Theme tokens + API props   |
| **Complexity**          | Simpler, more minimal                 | More comprehensive         |
| **Backend Integration** | Optional primitives                   | SDK with providers         |

### Key Differentiators

**Prompt Kit Strengths:**

1. **Minimalist aesthetic** - Clean, modern, less visual noise
2. **Copy-paste model** - No version lock-in
3. **Card-based messages** - Professional appearance
4. **Unified styling** - Same background for user/assistant
5. **Simple architecture** - Easy to understand and extend

**What to Adopt for Clarity:**

- Card-based message design over bubble design
- Semantic color token system
- 4px base grid spacing
- System font stack
- Generous whitespace philosophy
- Hover-based action visibility
- Three-tier architecture concept

---

## 13. Recommendations for Clarity Chat

### High Priority Adoptions

1. **Card-Based Message Design**
   - Replace bubble design with unified cards
   - Use alignment (not color) to differentiate roles
   - Implement hover-based action buttons

2. **Spacing Scale**
   - Adopt 4px base grid
   - Use generous padding (24px in cards)
   - Implement consistent gap system

3. **Color System**
   - Migrate to semantic tokens
   - Implement proper dark mode
   - Ensure WCAG AAA contrast ratios

4. **Typography**
   - System font stack for familiarity
   - Clear hierarchy (text-5xl to text-xs)
   - Proper line-height for readability

5. **AI-Specific Components**
   - Chain of Thought visualization
   - Tool execution display
   - Source attribution cards
   - Streaming shimmer effect

### Medium Priority Considerations

6. **Three-Tier Architecture**
   - Components (base atoms)
   - Compositions (prebuilt patterns)
   - Templates (full-stack solutions)

7. **Interaction Patterns**
   - Smooth transitions (200ms default)
   - Focus management
   - Keyboard navigation
   - Touch-friendly targets

8. **Performance**
   - Message list virtualization
   - Lazy loading for heavy components
   - Debounced inputs
   - Memoized components

### Low Priority (Future)\*\*

9. **CLI Installation Tool** (like shadcn)
10. **Full-Stack Primitives** (backend templates)
11. **Component Marketplace**

---

## Conclusion

Prompt Kit's design system exemplifies modern AI chat UI best practices with its minimalist
aesthetic, card-based message design, and semantic token system. The 4px base grid, generous
whitespace, and focus on accessibility create a professional, user-friendly interface.

**Key Takeaways:**

- **Visual simplicity**: Card-based design is cleaner than bubbles
- **Semantic tokens**: Enable easy theming and maintenance
- **Consistent spacing**: 4px grid creates visual harmony
- **Accessibility first**: WCAG AAA compliance from the start
- **AI-specific patterns**: Chain of thought, tools, sources are essential

Clarity Chat should adopt these core design principles while differentiating through advanced prompt
engineering features, token visualization, and multi-framework support.

---

**Document Version:** 1.0 **Last Updated:** January 27, 2026 **Maintained by:** Clarity AI
Development Team
