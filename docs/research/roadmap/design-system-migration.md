# Design System Migration Plan

**Created**: 2026-01-27 **Status**: Ready for Implementation **Timeline**: 2-3 weeks **Version**:
1.0

---

## Executive Summary

This document outlines the complete migration plan for evolving Clarity Chat's design system by
adopting best practices from shadcn/ui AI, Ant Design X, and Prompt Kit. The plan maintains
Clarity's unique OKLCH foundation while incorporating proven patterns from market leaders.

**Key Goals**:

- Modernize visual design with card-based messaging
- Enhance accessibility to 95% WCAG AA compliance
- Implement comprehensive component library
- Maintain backwards compatibility
- Complete migration in 2-3 weeks

---

## Table of Contents

1. [New Design System Specification](#new-design-system-specification)
2. [Components to Restyle](#components-to-restyle)
3. [Implementation Approach](#implementation-approach)
4. [Migration Strategy](#migration-strategy)
5. [Testing Strategy](#testing-strategy)
6. [Timeline](#timeline)

---

## 1. New Design System Specification

### 1.1 Color System (OKLCH)

#### Base Colors (Light Mode)

```css
:root {
  /* === SURFACE COLORS === */
  --clarity-background: 100% 0 0; /* Pure white */
  --clarity-foreground: 20% 0.02 250; /* Near-black with blue tint */
  --clarity-card: 100% 0 0; /* White cards */
  --clarity-popover: 100% 0 0; /* White popovers */
  --clarity-surface-muted: 96% 0.01 265; /* Light gray surface */
  --clarity-surface-elevated: 100% 0 0; /* Elevated surface */

  /* === PRIMARY BRAND COLORS === */
  --clarity-primary: 60% 0.2 265; /* Deep indigo (unchanged) */
  --clarity-primary-light: 75% 0.15 265; /* NEW: Lighter variant */
  --clarity-primary-dark: 45% 0.22 265; /* NEW: Darker variant */
  --clarity-primary-foreground: 100% 0 0; /* White on primary */

  /* === SECONDARY & ACCENT === */
  --clarity-secondary: 96% 0.01 265; /* Light indigo tint */
  --clarity-secondary-foreground: 20% 0.02 250;
  --clarity-accent: 92% 0.04 265; /* Adjusted: more chroma */
  --clarity-accent-subtle: 96% 0.02 265; /* Renamed from old accent */
  --clarity-accent-foreground: 20% 0.02 250;

  /* === STATE COLORS === */
  --clarity-success: 55% 0.18 145; /* Green */
  --clarity-success-foreground: 100% 0 0;
  --clarity-destructive: 55% 0.22 25; /* Red */
  --clarity-destructive-foreground: 100% 0 0;
  --clarity-warning: 75% 0.18 70; /* Orange */
  --clarity-warning-foreground: 25% 0.08 70;
  --clarity-info: 60% 0.15 230; /* Blue */
  --clarity-info-foreground: 100% 0 0;

  /* === AI-SPECIFIC SEMANTIC COLORS (NEW) === */
  --clarity-ai-thinking: 60% 0.12 240; /* Blue for processing */
  --clarity-ai-thinking-foreground: 100% 0 0;
  --clarity-ai-complete: 55% 0.18 145; /* Green for complete */
  --clarity-ai-complete-foreground: 100% 0 0;
  --clarity-ai-streaming: 60% 0.15 265; /* Purple for streaming */
  --clarity-ai-streaming-foreground: 100% 0 0;
  --clarity-ai-error: 55% 0.22 25; /* Red for AI errors */
  --clarity-ai-error-foreground: 100% 0 0;
  --clarity-tool-execution: 60% 0.16 180; /* Cyan for tool calls */
  --clarity-tool-execution-foreground: 100% 0 0;

  /* === BORDERS & INPUTS === */
  --clarity-border: 90% 0.01 265; /* Light gray border */
  --clarity-input: 90% 0.01 265; /* Input border */
  --clarity-ring: 60% 0.2 265; /* Focus ring (primary) */

  /* === MUTED TEXT === */
  --clarity-muted: 96% 0.01 265;
  --clarity-muted-foreground: 55% 0.02 265;
}
```

#### Dark Mode Colors

```css
.dark,
[data-theme='dark'] {
  /* === SURFACE COLORS === */
  --clarity-background: 20% 0.02 250; /* Deep blue-black */
  --clarity-foreground: 95% 0.01 250; /* Off-white */
  --clarity-card: 23% 0.02 265; /* Dark card */
  --clarity-popover: 25% 0.03 265; /* Darker popover */
  --clarity-surface-muted: 25% 0.03 265; /* Dark muted surface */
  --clarity-surface-elevated: 23% 0.02 265; /* Elevated dark surface */

  /* === PRIMARY BRAND COLORS (Brighter in dark) === */
  --clarity-primary: 70% 0.2 265; /* Brighter indigo */
  --clarity-primary-light: 80% 0.18 265; /* Lighter variant */
  --clarity-primary-dark: 55% 0.22 265; /* Darker variant */
  --clarity-primary-foreground: 100% 0 0;

  /* === BORDERS (Transparent) === */
  --clarity-border: 100% 0 0 / 10%; /* White 10% opacity */
  --clarity-input: 100% 0 0 / 15%; /* White 15% opacity */
  --clarity-card-border: 100% 0 0 / 8%; /* Subtle card border */

  /* === AI-SPECIFIC (Brighter) === */
  --clarity-ai-thinking: 65% 0.15 240;
  --clarity-ai-complete: 60% 0.18 145;
  --clarity-ai-streaming: 65% 0.18 265;
  --clarity-ai-error: 60% 0.2 25;
  --clarity-tool-execution: 65% 0.18 180;
}
```

### 1.2 Typography System

#### Font Families

```css
:root {
  /* === FONT STACKS === */
  --clarity-font-sans:
    'Geist', 'Inter Variable', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';

  --clarity-font-mono:
    'Geist Mono', 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas,
    monospace;

  /* === FLUID TYPOGRAPHY SCALE === */
  --text-xs: clamp(0.75rem, 0.875vw + 0.125rem, 0.8125rem); /* 12-13px */
  --text-sm: clamp(0.8125rem, 1vw + 0.125rem, 0.875rem); /* 13-14px */
  --text-base: clamp(0.875rem, 1.25vw + 0.25rem, 1rem); /* 14-16px */
  --text-lg: clamp(1rem, 1.5vw + 0.25rem, 1.25rem); /* 16-20px */
  --text-xl: clamp(1.125rem, 2vw + 0.25rem, 1.5rem); /* 18-24px */
  --text-2xl: clamp(1.25rem, 2.5vw + 0.5rem, 1.875rem); /* 20-30px */
  --text-3xl: clamp(1.5rem, 3vw + 0.5rem, 2.25rem); /* 24-36px */
  --text-4xl: clamp(1.75rem, 4vw + 0.5rem, 3rem); /* 28-48px */
  --text-5xl: clamp(2rem, 5vw + 0.5rem, 3.75rem); /* 32-60px */

  /* === LINE HEIGHTS === */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  /* === FONT WEIGHTS === */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### 1.3 Spacing System

```css
:root {
  /* === FIXED SPACING (Micro) === */
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */

  /* === FLUID SPACING (Responsive) === */
  --space-3: clamp(0.625rem, 0.5rem + 0.5vw, 0.75rem); /* 10-12px */
  --space-4: clamp(0.875rem, 0.75rem + 0.5vw, 1rem); /* 14-16px */
  --space-5: clamp(1rem, 0.875rem + 0.75vw, 1.25rem); /* 16-20px */
  --space-6: clamp(1.25rem, 1rem + 1vw, 1.5rem); /* 20-24px */
  --space-8: clamp(1.5rem, 1.25rem + 1.5vw, 2rem); /* 24-32px */
  --space-10: clamp(2rem, 1.5rem + 2vw, 2.5rem); /* 32-40px */
  --space-12: clamp(2.25rem, 1.75rem + 2.5vw, 3rem); /* 36-48px */
  --space-16: clamp(3rem, 2.25rem + 3vw, 4rem); /* 48-64px */

  /* === SEMANTIC ALIASES === */
  --space-xs: var(--space-1); /* 4px */
  --space-sm: var(--space-2); /* 8px */
  --space-md: var(--space-4); /* 14-16px */
  --space-lg: var(--space-6); /* 20-24px */
  --space-xl: var(--space-8); /* 24-32px */
  --space-2xl: var(--space-12); /* 36-48px */
}
```

### 1.4 Border Radius (Calculated System)

```css
:root {
  /* === CALCULATED BORDER RADIUS === */
  --clarity-radius: 0.625rem; /* Base: 10px */
  --clarity-radius-sm: calc(var(--clarity-radius) - 4px); /* 6px */
  --clarity-radius-md: calc(var(--clarity-radius) - 2px); /* 8px */
  --clarity-radius-lg: var(--clarity-radius); /* 10px */
  --clarity-radius-xl: calc(var(--clarity-radius) + 4px); /* 14px */
  --clarity-radius-2xl: calc(var(--clarity-radius) + 8px); /* 18px */
  --clarity-radius-3xl: calc(var(--clarity-radius) + 16px); /* 26px */
  --clarity-radius-full: 9999px; /* Pills/circles */
}
```

### 1.5 Shadow System

```css
:root {
  /* === BASE SHADOWS === */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.06);

  /* === SEMANTIC SHADOWS (OKLCH) === */
  --shadow-primary: 0 8px 16px -4px oklch(var(--clarity-primary) / 0.3);
  --shadow-success: 0 8px 16px -4px oklch(var(--clarity-success) / 0.3);
  --shadow-warning: 0 8px 16px -4px oklch(var(--clarity-warning) / 0.3);
  --shadow-error: 0 8px 16px -4px oklch(var(--clarity-destructive) / 0.3);
  --shadow-ai-thinking: 0 8px 16px -4px oklch(var(--clarity-ai-thinking) / 0.25);
}

.dark {
  /* === STRONGER SHADOWS IN DARK MODE === */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.3);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.4);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.6);

  --shadow-primary: 0 4px 14px -3px oklch(var(--clarity-primary) / 0.45);
  --shadow-success: 0 4px 14px -3px oklch(var(--clarity-success) / 0.45);
  --shadow-warning: 0 4px 14px -3px oklch(var(--clarity-warning) / 0.45);
  --shadow-error: 0 4px 14px -3px oklch(var(--clarity-destructive) / 0.45);
  --shadow-ai-thinking: 0 4px 14px -3px oklch(var(--clarity-ai-thinking) / 0.4);
}
```

### 1.6 Animation System

```css
:root {
  /* === DURATIONS === */
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;

  /* === EASING FUNCTIONS === */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Bounce */

  /* === TRANSITION PATTERNS === */
  --transition-base: all var(--duration-normal) var(--ease-out);
  --transition-colors:
    color var(--duration-normal) var(--ease-out),
    background-color var(--duration-normal) var(--ease-out),
    border-color var(--duration-normal) var(--ease-out);
  --transition-transform: transform var(--duration-fast) var(--ease-spring);
  --transition-shadow: box-shadow var(--duration-normal) var(--ease-out);
}
```

### 1.7 Focus Ring System

```css
/* === FOCUS RING UTILITIES === */
.clarity-focus-ring:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px oklch(var(--clarity-background)),
    0 0 0 4px oklch(var(--clarity-ring) / 0.5);
}

.clarity-focus-primary:focus-visible {
  box-shadow:
    0 0 0 2px oklch(var(--clarity-background)),
    0 0 0 4px oklch(var(--clarity-primary) / 0.5);
}

.clarity-focus-success:focus-visible {
  box-shadow:
    0 0 0 2px oklch(var(--clarity-background)),
    0 0 0 4px oklch(var(--clarity-success) / 0.5);
}

.clarity-focus-error:focus-visible {
  box-shadow:
    0 0 0 2px oklch(var(--clarity-background)),
    0 0 0 4px oklch(var(--clarity-destructive) / 0.5);
}

/* === HIGH CONTRAST MODE === */
@media (prefers-contrast: more) {
  .clarity-focus-ring:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 2px;
  }
}
```

---

## 2. Components to Restyle

### 2.1 Message Components

#### ChatMessage (Card-Based Design)

**Current**: Different backgrounds for user/assistant **Proposed**: Unified card style,
differentiated by alignment

```css
/* === BASE MESSAGE CARD === */
.clarity-message-content {
  max-width: 75%;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--clarity-radius-lg);
  background: oklch(var(--clarity-card));
  border: 1px solid oklch(var(--clarity-border) / 0.5);
  box-shadow: var(--shadow-sm);
  transition:
    transform var(--duration-fast) var(--ease-spring),
    box-shadow var(--duration-normal) var(--ease-out);
}

.clarity-message-content:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* === USER VS ASSISTANT (Alignment only) === */
.clarity-message.user {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.clarity-message.assistant {
  flex-direction: row;
  align-self: flex-start;
}

/* === SUBTLE BACKGROUND TINT (Optional) === */
.clarity-message.user .clarity-message-content {
  background: linear-gradient(
    135deg,
    oklch(var(--clarity-card)) 0%,
    oklch(var(--clarity-primary) / 0.02) 100%
  );
}

.clarity-message.assistant .clarity-message-content {
  background: linear-gradient(
    135deg,
    oklch(var(--clarity-card)) 0%,
    oklch(var(--clarity-surface-muted)) 100%
  );
}

/* === STREAMING SHIMMER === */
.clarity-message[data-streaming='true'] .clarity-streaming-text::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    oklch(var(--clarity-primary) / 0.08) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s linear infinite;
  pointer-events: none;
  border-radius: var(--clarity-radius);
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* === AI STATE INDICATORS === */
.clarity-message[data-ai-state='thinking'] {
  border-left: 3px solid oklch(var(--clarity-ai-thinking));
  background: oklch(var(--clarity-ai-thinking) / 0.05);
}

.clarity-message[data-ai-state='complete'] {
  border-left: 3px solid oklch(var(--clarity-ai-complete));
}

.clarity-message[data-ai-state='error'] {
  border-left: 3px solid oklch(var(--clarity-ai-error));
  background: oklch(var(--clarity-ai-error) / 0.05);
}
```

#### ThinkingIndicator

```css
.clarity-thinking-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--clarity-radius-lg);
  background: oklch(var(--clarity-ai-thinking) / 0.1);
  border: 1px solid oklch(var(--clarity-ai-thinking) / 0.3);
  color: oklch(var(--clarity-ai-thinking));
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  animation: thinking-pulse 2s ease-in-out infinite;
}

@keyframes thinking-pulse {
  0%,
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

/* === THINKING DOTS === */
.clarity-thinking-dots {
  display: flex;
  gap: 0.25rem;
}

.clarity-thinking-dots span {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: oklch(var(--clarity-ai-thinking));
  animation: thinking-dots 1.4s ease-in-out infinite;
}

.clarity-thinking-dots span:nth-child(1) {
  animation-delay: 0s;
}
.clarity-thinking-dots span:nth-child(2) {
  animation-delay: 0.2s;
}
.clarity-thinking-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes thinking-dots {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-0.5rem);
    opacity: 1;
  }
}
```

#### ToolExecutionDisplay

```css
.clarity-tool-execution {
  background: oklch(var(--clarity-tool-execution) / 0.05);
  border: 1px solid oklch(var(--clarity-tool-execution) / 0.3);
  border-radius: var(--clarity-radius-md);
  padding: var(--space-sm) var(--space-md);
  margin: var(--space-sm) 0;
  font-size: var(--text-sm);
}

.clarity-tool-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: var(--font-medium);
  color: oklch(var(--clarity-tool-execution));
  margin-bottom: var(--space-sm);
}

.clarity-tool-icon {
  width: 1rem;
  height: 1rem;
  color: oklch(var(--clarity-tool-execution));
}

.clarity-tool-name {
  font-family: var(--clarity-font-mono);
  color: oklch(var(--clarity-tool-execution));
}

.clarity-tool-args,
.clarity-tool-result {
  background: oklch(var(--clarity-card));
  border-radius: var(--clarity-radius-sm);
  padding: var(--space-sm);
  margin: var(--space-xs) 0;
  font-family: var(--clarity-font-mono);
  font-size: var(--text-xs);
  overflow-x: auto;
}
```

### 2.2 Input Components

#### ChatInput (Enhanced Glass Effect)

```css
.clarity-chat-input-field {
  width: 100%;
  padding: var(--space-md) var(--space-lg);
  border: 1px solid oklch(var(--clarity-border) / 0.4);
  border-radius: var(--clarity-radius-lg);
  background: oklch(var(--clarity-background));
  color: oklch(var(--clarity-foreground));
  font-family: var(--clarity-font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  outline: none;
  transition: var(--transition-colors), var(--transition-shadow);
  box-shadow: var(--shadow-sm);
  resize: none;
  min-height: 48px;
  max-height: 200px;
}

.clarity-chat-input-field:hover {
  border-color: oklch(var(--clarity-border));
  background: oklch(var(--clarity-card));
}

.clarity-chat-input-field:focus {
  border-color: oklch(var(--clarity-primary) / 0.5);
  box-shadow:
    var(--shadow-sm),
    0 0 0 3px oklch(var(--clarity-primary) / 0.12),
    0 0 20px -4px oklch(var(--clarity-primary) / 0.15);
  background: oklch(var(--clarity-card));
}

.clarity-chat-input-field:focus-visible {
  outline: 2px solid oklch(var(--clarity-ring));
  outline-offset: 2px;
}

.clarity-chat-input-field::placeholder {
  color: oklch(var(--clarity-muted-foreground));
}
```

#### PromptSuggestions (Chip Design)

```css
.clarity-suggestion-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border: 1px solid oklch(var(--clarity-border) / 0.5);
  border-radius: var(--clarity-radius-full);
  background: oklch(var(--clarity-card));
  color: oklch(var(--clarity-foreground));
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: var(--transition-transform), var(--transition-colors), var(--transition-shadow);
  box-shadow: var(--shadow-sm);
}

.clarity-suggestion-chip:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  border-color: oklch(var(--clarity-primary) / 0.4);
  background: oklch(var(--clarity-surface-elevated));
}

.clarity-suggestion-chip:active {
  transform: translateY(0);
  transition-duration: var(--duration-instant);
}

.clarity-suggestion-chip svg {
  width: 0.875rem;
  height: 0.875rem;
  opacity: 0.7;
}

/* === CATEGORY VARIANTS === */
.clarity-suggestion-chip[data-category='code'] {
  border-color: oklch(var(--clarity-ai-streaming) / 0.3);
}

.clarity-suggestion-chip[data-category='code']:hover {
  background: oklch(var(--clarity-ai-streaming) / 0.05);
  border-color: oklch(var(--clarity-ai-streaming) / 0.5);
}

.clarity-suggestion-chip[data-category='explain'] {
  border-color: oklch(var(--clarity-info) / 0.3);
}

.clarity-suggestion-chip[data-category='explain']:hover {
  background: oklch(var(--clarity-info) / 0.05);
  border-color: oklch(var(--clarity-info) / 0.5);
}
```

### 2.3 Button Components

#### Primary Buttons (Pill Style)

```css
.clarity-button-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--clarity-radius-full);
  background: linear-gradient(
    135deg,
    oklch(var(--clarity-primary)) 0%,
    oklch(var(--clarity-primary) / 0.85) 100%
  );
  color: oklch(var(--clarity-primary-foreground));
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  border: none;
  cursor: pointer;
  transition: var(--transition-transform), var(--transition-shadow);
  box-shadow: var(--shadow-primary);
}

.clarity-button-pill:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-lg), var(--shadow-primary);
}

.clarity-button-pill:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
  transition-duration: var(--duration-instant);
}

.clarity-button-pill:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.clarity-button-pill svg {
  width: 1rem;
  height: 1rem;
}
```

#### Secondary Buttons (Ghost Style)

```css
.clarity-button-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--clarity-radius-md);
  background: transparent;
  color: oklch(var(--clarity-foreground));
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: var(--transition-colors);
}

.clarity-button-ghost:hover:not(:disabled) {
  background: oklch(var(--clarity-accent));
  color: oklch(var(--clarity-accent-foreground));
}

.clarity-button-ghost:active:not(:disabled) {
  background: oklch(var(--clarity-accent) / 0.8);
}

.clarity-button-ghost svg {
  width: 1rem;
  height: 1rem;
}
```

### 2.4 Navigation Components

#### ScrollToBottom Button (Glass Effect)

```css
.clarity-scroll-to-bottom {
  position: fixed;
  bottom: calc(var(--space-lg) + 60px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid oklch(var(--clarity-border) / 0.3);
  border-radius: var(--clarity-radius-full);
  background: oklch(var(--clarity-background) / 0.7);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  color: oklch(var(--clarity-foreground));
  cursor: pointer;
  transition:
    var(--transition-transform),
    var(--transition-shadow),
    opacity var(--duration-normal) var(--ease-out);
  box-shadow:
    0 8px 32px rgb(0 0 0 / 0.08),
    0 2px 8px rgb(0 0 0 / 0.04);
  opacity: 0;
  pointer-events: none;
  z-index: 10;
}

.clarity-scroll-to-bottom.visible {
  opacity: 1;
  pointer-events: auto;
}

.clarity-scroll-to-bottom:hover {
  transform: translateX(-50%) translateY(-2px) scale(1.05);
  box-shadow:
    0 12px 40px rgb(0 0 0 / 0.12),
    0 4px 12px rgb(0 0 0 / 0.06);
  background: oklch(var(--clarity-card) / 0.9);
}

.clarity-scroll-to-bottom:active {
  transform: translateX(-50%) scale(0.95);
  transition-duration: var(--duration-instant);
}

.clarity-scroll-to-bottom svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* === DARK MODE === */
.dark .clarity-scroll-to-bottom {
  background: oklch(var(--clarity-background) / 0.8);
  box-shadow:
    0 8px 32px rgb(0 0 0 / 0.3),
    0 2px 8px rgb(0 0 0 / 0.2);
}
```

### 2.5 Status Components

#### LoadingSpinner

```css
.clarity-spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid oklch(var(--clarity-muted));
  border-top-color: oklch(var(--clarity-primary));
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* === SIZE VARIANTS === */
.clarity-spinner-sm {
  width: 1rem;
  height: 1rem;
  border-width: 1.5px;
}

.clarity-spinner-lg {
  width: 2rem;
  height: 2rem;
  border-width: 3px;
}
```

---

## 3. Implementation Approach

### 3.1 Gradual Migration Strategy

**Phase 1: Foundation (Week 1)**

1. Create new CSS variables in separate file (`theme-v2.css`)
2. Load both old and new themes side-by-side
3. Add feature flag for gradual rollout
4. No breaking changes

**Phase 2: Component Migration (Week 2)**

1. Update components one-by-one
2. Maintain backwards compatibility
3. Add new class variants (e.g., `.clarity-message-v2`)
4. Document migration path

**Phase 3: Consolidation (Week 3)**

1. Deprecate old styles (with warnings)
2. Migrate all examples to new system
3. Update documentation
4. Remove feature flag

### 3.2 Feature Flag Implementation

```typescript
// Add to ClarityProvider or theme config
interface ClarityThemeConfig {
  version?: 'v1' | 'v2';
  enableNewDesignSystem?: boolean;
}

// Usage
<ClarityProvider theme={{ version: 'v2', enableNewDesignSystem: true }}>
  <ChatWindow />
</ClarityProvider>
```

### 3.3 CSS Loading Strategy

```tsx
// In ClarityProvider
import '@clarity/react/styles/theme.css' // Old theme (always loaded)
import '@clarity/react/styles/theme-v2.css' // New theme (conditional)
import '@clarity/react/styles/index.css' // Component styles

if (enableNewDesignSystem) {
  document.documentElement.classList.add('clarity-v2')
}
```

### 3.4 Backwards Compatibility

```css
/* Old variables remain (deprecated) */
--clarity-primary: 60% 0.2 265; /* Still works */

/* New variables added */
--clarity-primary-light: 75% 0.15 265; /* New */
--clarity-primary-dark: 45% 0.22 265; /* New */

/* Components support both */
.clarity-message-content {
  /* V1: Different backgrounds */
  background: oklch(var(--clarity-primary));
}

.clarity-v2 .clarity-message-content {
  /* V2: Unified card style */
  background: oklch(var(--clarity-card));
}
```

---

## 4. Migration Strategy

### 4.1 Theme Toggle Implementation

```typescript
// theme-manager.ts
export class ClarityThemeManager {
  private version: 'v1' | 'v2' = 'v1';

  setVersion(version: 'v1' | 'v2') {
    this.version = version;
    document.documentElement.classList.toggle('clarity-v2', version === 'v2');
    localStorage.setItem('clarity-theme-version', version);
  }

  getVersion(): 'v1' | 'v2' {
    return this.version;
  }

  initialize() {
    const stored = localStorage.getItem('clarity-theme-version');
    if (stored === 'v2') {
      this.setVersion('v2');
    }
  }
}

// Usage in ClarityProvider
import { ClarityThemeManager } from './theme-manager';

const themeManager = new ClarityThemeManager();
themeManager.initialize();

// Toggle in UI
<button onClick={() => themeManager.setVersion('v2')}>
  Use New Design System
</button>
```

### 4.2 Component Migration Checklist

For each component:

- [ ] Create new CSS classes with `-v2` suffix
- [ ] Add feature detection (`.clarity-v2` selector)
- [ ] Update component props (additive only)
- [ ] Write migration guide in Storybook
- [ ] Add visual regression tests
- [ ] Update documentation
- [ ] Add deprecation warnings to old styles

### 4.3 Example Component Migration

**Before (V1)**:

```tsx
<div className="clarity-message user">
  <div className="clarity-message-content">Hello</div>
</div>
```

**After (V2)**:

```tsx
<div className="clarity-message user" data-version="v2">
  <div className="clarity-message-content">Hello</div>
</div>
```

**CSS handles both**:

```css
/* V1 styles (default) */
.clarity-message.user .clarity-message-content {
  background: oklch(var(--clarity-primary));
}

/* V2 styles (opt-in) */
.clarity-v2 .clarity-message.user .clarity-message-content {
  background: oklch(var(--clarity-card));
  border: 1px solid oklch(var(--clarity-border) / 0.5);
}
```

---

## 5. Testing Strategy

### 5.1 Visual Regression Testing

**Tools**:

- Chromatic for automated visual testing
- Percy for screenshot comparison
- Manual testing in multiple browsers

**Process**:

1. Capture baseline screenshots of all components (V1)
2. Enable V2 design system
3. Capture comparison screenshots
4. Review differences in Chromatic/Percy
5. Approve or reject changes
6. Repeat for each component

**Coverage**:

- All components in default state
- All interactive states (hover, focus, active, disabled)
- All size variants (sm, md, lg)
- All color variants (primary, secondary, success, error)
- Light and dark modes
- Responsive breakpoints (mobile, tablet, desktop)

### 5.2 Accessibility Testing

**Automated**:

- Run axe DevTools on all updated components
- Check color contrast ratios (WebAIM Contrast Checker)
- Validate ARIA attributes
- Test keyboard navigation flow

**Manual**:

- Test with screen readers (VoiceOver, NVDA, JAWS)
- Test keyboard-only navigation
- Test with zoom at 200% (WCAG requirement)
- Test high contrast mode
- Test reduced motion preference

**Requirements**:

- Focus indicators visible (3:1 contrast minimum)
- All text meets WCAG AA (4.5:1 normal, 3:1 large)
- Interactive elements meet 3:1 contrast
- All animations respect `prefers-reduced-motion`
- No layout shift on focus

### 5.3 Performance Testing

**Metrics to Track**:

- Bundle size increase (target: <5KB CSS)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)

**Tools**:

- Lighthouse CI for automated monitoring
- WebPageTest for detailed analysis
- Chrome DevTools Performance panel

**Acceptance Criteria**:

- Lighthouse Performance: 90+ (no regression)
- Lighthouse Accessibility: 100 (improved from 85)
- Bundle size increase: <5KB
- No CLS increase

### 5.4 Cross-Browser Testing

**Browsers**:

- Chrome (latest, stable)
- Firefox (latest, stable)
- Safari (latest, stable)
- Edge (latest, stable)

**Devices**:

- Desktop: 1920x1080, 2560x1440, 3840x2160
- Tablet: 768x1024 (iPad), 810x1080 (Android)
- Mobile: 375x667 (iPhone SE), 390x844 (iPhone 13), 360x800 (Android)

**Test Cases**:

- All components render correctly
- Animations work smoothly
- Focus states visible
- Touch targets adequate (44x44px minimum)
- No text overflow or truncation
- Glassmorphism effects work (where supported)

### 5.5 Integration Testing

**Test Scenarios**:

1. Install Clarity Chat in fresh Next.js app
2. Toggle between V1 and V2 design systems
3. Verify no console errors
4. Check all components render
5. Test theme switching (light/dark)
6. Verify responsive behavior
7. Test production build

**Framework Coverage**:

- Next.js (App Router and Pages Router)
- Vite
- Create React App
- Remix
- Gatsby

---

## 6. Timeline

### Week 1: Foundation Setup

**Days 1-2: CSS Variables & Theme Setup**

- Create `theme-v2.css` with all new variables
- Implement feature flag system
- Set up theme manager
- Add font loading (Geist)
- **Deliverable**: Complete theme-v2.css file

**Days 3-4: Focus Ring System**

- Implement new focus ring utilities
- Test accessibility compliance
- Add high contrast mode support
- Update focus styles across components
- **Deliverable**: Focus ring system complete

**Day 5: Testing & Documentation**

- Run accessibility audit
- Document new CSS variables
- Write migration guide introduction
- Set up visual regression baseline
- **Deliverable**: Foundation documentation

---

### Week 2: Component Migration

**Days 6-7: Message Components**

- Refactor ChatMessage to card-based design
- Add streaming shimmer effect
- Implement AI state indicators
- Update ThinkingIndicator styling
- Add ToolExecutionDisplay component
- **Deliverable**: Message components migrated

**Days 8-9: Input Components**

- Update ChatInput with glass effect
- Implement enhanced focus states
- Create PromptSuggestions chips
- Update SendButton to pill style
- **Deliverable**: Input components migrated

**Day 10: Button Components**

- Create pill button variant
- Update ghost button styling
- Add icon button variants
- Test all interactive states
- **Deliverable**: Button components migrated

---

### Week 3: Polish & Release

**Days 11-12: Navigation & Status Components**

- Implement glass scroll-to-bottom button
- Update LoadingSpinner styling
- Add progress indicators
- Refine animations
- **Deliverable**: All components migrated

**Days 13-14: Testing & Bug Fixes**

- Run full visual regression suite
- Fix any regressions
- Complete accessibility audit
- Test across all browsers
- **Deliverable**: All tests passing

**Day 15: Documentation & Release**

- Complete migration guide
- Update Storybook stories
- Publish documentation
- Release v2.0 (or v1.5 as beta)
- **Deliverable**: Public release

---

## Appendix A: Complete File Structure

```
packages/react/src/
├── styles/
│   ├── theme.css                    # V1 theme (existing)
│   ├── theme-v2.css                 # V2 theme (new)
│   ├── index.css                    # Component styles
│   ├── animations.css               # Animation keyframes
│   └── utilities.css                # Utility classes
├── theme/
│   ├── theme-manager.ts             # Theme version manager
│   ├── theme-provider.tsx           # React context provider
│   └── use-theme.ts                 # React hook
└── components/
    ├── chat-message/
    │   ├── ChatMessage.tsx
    │   ├── ChatMessage.styles.css   # Component-specific styles
    │   └── ChatMessage.test.tsx
    ├── chat-input/
    │   ├── ChatInput.tsx
    │   ├── ChatInput.styles.css
    │   └── ChatInput.test.tsx
    └── ...
```

## Appendix B: CSS Variables Quick Reference

```css
/* === COLORS === */
--clarity-primary                      /* Brand primary color */
--clarity-primary-light                /* Lighter primary (NEW) */
--clarity-primary-dark                 /* Darker primary (NEW) */
--clarity-ai-thinking                  /* AI processing state (NEW) */
--clarity-ai-complete                  /* AI complete state (NEW) */
--clarity-ai-streaming                 /* AI streaming state (NEW) */
--clarity-ai-error                     /* AI error state (NEW) */
--clarity-tool-execution               /* Tool call indicator (NEW) */

/* === TYPOGRAPHY === */
--clarity-font-sans                    /* Geist + fallbacks (UPDATED) */
--clarity-font-mono                    /* Geist Mono + fallbacks (UPDATED) */
--text-xs through --text-5xl           /* Fluid typography (NEW) */
--leading-tight through --leading-loose /* Line heights */

/* === SPACING === */
--space-1 through --space-16           /* Fluid spacing scale (NEW) */
--space-xs through --space-2xl         /* Semantic aliases (NEW) */

/* === BORDERS === */
--clarity-radius                       /* Base: 10px (UPDATED) */
--clarity-radius-sm through -3xl       /* Calculated variants (NEW) */
--clarity-radius-full                  /* Pills/circles */

/* === SHADOWS === */
--shadow-xs through --shadow-2xl       /* Base shadows (UPDATED) */
--shadow-primary                       /* OKLCH primary shadow (NEW) */
--shadow-ai-thinking                   /* AI state shadow (NEW) */

/* === ANIMATIONS === */
--duration-instant through --duration-slower /* Durations (NEW) */
--ease-in, --ease-out, --ease-spring   /* Easing functions (NEW) */
--transition-base, --transition-colors /* Transition patterns (NEW) */
```

## Appendix C: Migration Commands

```bash
# Install new fonts
npm install @vercel/font-geist

# Run visual regression baseline
npm run test:visual:baseline

# Run visual regression comparison
npm run test:visual:compare

# Run accessibility audit
npm run test:a11y

# Build with new design system
CLARITY_THEME_VERSION=v2 npm run build

# Preview in Storybook
npm run storybook
```

## Appendix D: Support Resources

**Documentation**:

- Migration guide: `/docs/migration/v1-to-v2.md`
- Component examples: Storybook
- CSS variable reference: `/docs/design-system/variables.md`

**Support**:

- GitHub Discussions: Questions and community support
- GitHub Issues: Bug reports
- Discord: Real-time help

**Tools**:

- [OKLCH Color Picker](https://oklch.com/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Chromatic](https://www.chromatic.com/)

---

**Document Status**: ✅ Ready for Implementation **Last Updated**: 2026-01-27 **Version**: 1.0
**Estimated Effort**: 2-3 weeks (15 working days) **Breaking Changes**: None (v2 is opt-in)
**Accessibility Target**: 95% WCAG AA (up from 85%)
