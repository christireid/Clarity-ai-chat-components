# Design Patterns Guide

> Comprehensive design patterns and UX guidelines for Clarity Chat components
>
> **Version**: 1.0
> **Last Updated**: 2026-01-28
> **Status**: Production Ready

---

## Table of Contents

1. [CommandPalette vs Menus](#commandpalette-vs-menus)
2. [AudioRecorder UX Best Practices](#audiorecorder-ux-best-practices)
3. [OKLCH Color Selection Guidelines](#oklch-color-selection-guidelines)
4. [Accessibility Considerations](#accessibility-considerations)
5. [Mobile Patterns](#mobile-patterns)
6. [Component Composition Patterns](#component-composition-patterns)
7. [Animation Guidelines](#animation-guidelines)
8. [Error Handling Patterns](#error-handling-patterns)

---

## CommandPalette vs Menus

### When to Use CommandPalette

A CommandPalette is ideal for:

**Power User Scenarios:**
- Applications with 10+ actions available
- Users who work primarily with keyboard
- Complex workflows requiring quick access to nested actions
- Developer tools and productivity applications

**Key Benefits:**
- Fast keyboard-driven navigation
- Fuzzy search for discovery
- Global access via keyboard shortcut (Cmd+K / Ctrl+K)
- Visual feedback with icons and descriptions
- Recent actions history

**Example Use Cases:**
```tsx
// Global command palette for power users
<CommandPalette
  placeholder="Search commands..."
  shortcut="⌘K"
  groups={[
    {
      heading: 'Actions',
      items: [
        { id: 'new-chat', label: 'New Chat', icon: MessageSquarePlus, shortcut: '⌘N' },
        { id: 'search', label: 'Search Messages', icon: Search, shortcut: '⌘F' },
        { id: 'export', label: 'Export Conversation', icon: Download },
      ],
    },
    {
      heading: 'Settings',
      items: [
        { id: 'theme', label: 'Change Theme', icon: Palette },
        { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
      ],
    },
  ]}
  onSelect={(item) => handleCommand(item.id)}
/>
```

**Design Considerations:**
- Position centrally, typically full-width modal (max 640px)
- Fuzzy search with instant results
- Show keyboard shortcuts for each action
- Group related actions with clear headings
- Highlight matched text in search results
- Support arrow key navigation
- Close on Escape or clicking backdrop

### When to Use Menus

Traditional menus (dropdown, context) are better for:

**Standard User Scenarios:**
- Simple, linear actions (3-7 options)
- Context-specific actions
- Mobile-first interfaces
- Casual users who prefer pointing devices

**Key Benefits:**
- Discoverable through visual exploration
- Clear hierarchical organization
- Contextual to current selection
- Familiar UI pattern
- Works well on touch devices

**Example Use Cases:**
```tsx
// Dropdown menu for message actions
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onSelect={handleCopy}>
      <Copy className="mr-2 h-4 w-4" />
      Copy
    </DropdownMenuItem>
    <DropdownMenuItem onSelect={handleEdit}>
      <Edit className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onSelect={handleDelete} className="text-destructive">
      <Trash className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Design Considerations:**
- Position near trigger element
- Maximum 7 items before requiring submenu
- Use separators to group related items
- Place destructive actions last with visual distinction
- Support both click and keyboard interaction

### Decision Matrix

| Criteria | CommandPalette | Menu |
|----------|---------------|------|
| **Number of actions** | 10+ | 3-7 |
| **User expertise** | Power users | All users |
| **Primary input** | Keyboard | Mouse/Touch |
| **Search needed** | Yes | No |
| **Global access** | Yes | Contextual |
| **Discoverability** | Low (needs training) | High |
| **Efficiency** | Very high | Moderate |
| **Mobile-friendly** | No | Yes |

### Hybrid Approach

For the best of both worlds, implement both:

```tsx
// CommandPalette for global actions (Cmd+K)
<CommandPalette />

// Context menus for quick actions
<ContextMenu>
  {/* Right-click actions */}
</ContextMenu>

// Dropdown menus for overflow actions
<DropdownMenu>
  {/* Additional options */}
</DropdownMenu>
```

**Implementation Tips:**
- Show command palette shortcut in dropdown menus
- Include "Open Command Palette" as last menu item
- Teach users about Cmd+K through tooltips and onboarding

---

## AudioRecorder UX Best Practices

### Core Principles

1. **Visual Feedback is Critical** - Users must always know recording state
2. **Touch Targets Must Be Large** - Minimum 44x44px for mobile
3. **Error States Must Be Clear** - Explain why recording failed
4. **Preview Before Send** - Allow review of recorded audio
5. **Respect Privacy** - Show mic access indicator

### State Management

#### 1. Idle State (Before Recording)

```tsx
<button
  onClick={handleStartRecording}
  className="
    h-12 w-12 rounded-full
    bg-primary text-primary-foreground
    hover:opacity-90
    transition-all duration-normal
    shadow-md hover:shadow-lg
    focus-visible:ring-2 focus-visible:ring-ring
  "
  aria-label="Start recording"
>
  <Mic className="h-6 w-6" />
</button>
```

**Visual Indicators:**
- Microphone icon
- Primary color button
- Subtle shadow
- Clear call-to-action

#### 2. Recording State (Active)

```tsx
<div className="flex items-center gap-3 animate-pulse-subtle">
  {/* Recording indicator */}
  <div className="flex items-center gap-2">
    <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
    <span className="text-sm font-medium text-destructive">Recording</span>
  </div>

  {/* Waveform visualization */}
  <AudioWaveform levels={audioLevels} className="flex-1" />

  {/* Timer */}
  <span className="text-sm font-mono text-muted-foreground">
    {formatTime(duration)}
  </span>

  {/* Stop button */}
  <button
    onClick={handleStopRecording}
    className="
      h-10 w-10 rounded-full
      bg-destructive text-destructive-foreground
      hover:opacity-90
      transition-all duration-normal
    "
    aria-label="Stop recording"
  >
    <Square className="h-5 w-5" />
  </button>
</div>
```

**Visual Indicators:**
- Red pulsing dot (universal recording indicator)
- Live waveform showing audio levels
- Running timer (MM:SS format)
- Clear stop button
- Overall pulse animation

#### 3. Preview State (After Recording)

```tsx
<div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
  {/* Playback controls */}
  <button
    onClick={togglePlayback}
    className="h-10 w-10 rounded-full bg-primary"
    aria-label={isPlaying ? 'Pause' : 'Play'}
  >
    {isPlaying ? <Pause /> : <Play />}
  </button>

  {/* Waveform with progress */}
  <div className="flex-1 relative">
    <AudioWaveform levels={audioLevels} />
    <div
      className="absolute inset-y-0 left-0 bg-primary/20"
      style={{ width: `${playbackProgress}%` }}
    />
  </div>

  {/* Duration */}
  <span className="text-sm font-mono text-muted-foreground">
    {formatTime(currentTime)} / {formatTime(totalDuration)}
  </span>

  {/* Actions */}
  <div className="flex gap-2">
    <Button variant="ghost" size="icon" onClick={handleReRecord}>
      <RotateCcw className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon" onClick={handleDelete}>
      <Trash className="h-4 w-4" />
    </Button>
    <Button onClick={handleSend}>
      <Send className="h-4 w-4 mr-2" />
      Send
    </Button>
  </div>
</div>
```

**Visual Indicators:**
- Audio waveform with playback progress
- Play/pause button
- Time remaining display
- Re-record and delete options
- Primary "Send" button

### Permission Handling

#### First-Time Permission Request

```tsx
<div className="p-4 bg-card rounded-lg border text-center">
  <Mic className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
  <h3 className="font-semibold mb-2">Microphone Access Required</h3>
  <p className="text-sm text-muted-foreground mb-4">
    We need access to your microphone to record audio messages.
    Your recordings are private and only sent when you choose.
  </p>
  <Button onClick={requestMicrophoneAccess}>
    <Check className="h-4 w-4 mr-2" />
    Allow Microphone
  </Button>
</div>
```

#### Permission Denied

```tsx
<div className="p-4 bg-destructive/10 border-destructive/20 rounded-lg text-center">
  <AlertCircle className="h-12 w-12 mx-auto mb-3 text-destructive" />
  <h3 className="font-semibold mb-2">Microphone Access Denied</h3>
  <p className="text-sm text-muted-foreground mb-4">
    Please enable microphone access in your browser settings to record audio.
  </p>
  <Button variant="outline" onClick={openBrowserSettings}>
    <Settings className="h-4 w-4 mr-2" />
    Open Settings
  </Button>
</div>
```

### Mobile Considerations

#### Touch-Optimized Recording Button

```tsx
// "Hold to Record" pattern for mobile
<button
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
  onTouchCancel={handleTouchCancel}
  className="
    h-16 w-16 rounded-full
    bg-primary text-primary-foreground
    active:scale-95
    transition-transform duration-fast
    touch-none
  "
  aria-label="Hold to record"
>
  <Mic className="h-8 w-8" />
  <span className="sr-only">Hold to record, release to send</span>
</button>
```

#### Cancel Gesture (Slide to Cancel)

```tsx
// Visual indicator for cancel gesture
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  <ChevronLeft className="h-4 w-4 animate-slide-left" />
  <span>Slide left to cancel</span>
</div>
```

### Error Handling

#### No Microphone Detected

```tsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>No Microphone Detected</AlertTitle>
  <AlertDescription>
    Please connect a microphone to record audio messages.
  </AlertDescription>
</Alert>
```

#### Recording Failed

```tsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Recording Failed</AlertTitle>
  <AlertDescription>
    {error.message}. Please try again.
  </AlertDescription>
</Alert>
```

### Accessibility Considerations

1. **Screen Reader Announcements**
```tsx
<div role="status" aria-live="polite" className="sr-only">
  {isRecording ? `Recording in progress. ${duration} seconds elapsed.` : null}
</div>
```

2. **Keyboard Controls**
- Space: Start/stop recording
- Escape: Cancel recording
- Enter: Send recording (when in preview)

3. **ARIA Labels**
```tsx
<button
  aria-label="Record audio message"
  aria-pressed={isRecording}
  aria-describedby="recording-help"
>
  <Mic />
</button>
<div id="recording-help" className="sr-only">
  Press to start recording. Press again to stop. Use Escape to cancel.
</div>
```

### Audio Format Guidelines

**Recommended Settings:**
- Format: WebM with Opus codec (best compression)
- Fallback: MP3 (wider compatibility)
- Sample rate: 16kHz (sufficient for voice)
- Bit rate: 32kbps (good quality, small size)
- Max duration: 2 minutes (configurable)

### Size and Duration Feedback

```tsx
<div className="flex items-center gap-2 text-xs text-muted-foreground">
  <Clock className="h-3 w-3" />
  <span>{formatTime(duration)} / {formatTime(maxDuration)}</span>
  <span>•</span>
  <FileAudio className="h-3 w-3" />
  <span>{formatFileSize(estimatedSize)}</span>
</div>
```

---

## OKLCH Color Selection Guidelines

### Understanding OKLCH

OKLCH (Oklab Lightness Chroma Hue) provides superior color control:

- **L (Lightness)**: 0-100% (perceptually uniform)
- **C (Chroma)**: 0-0.4 (color intensity)
- **H (Hue)**: 0-360° (color angle)

**Key Advantage:** Colors with same lightness value appear equally bright to human eye.

### Color Selection Process

#### 1. Define Color Purpose

**Semantic Colors:**
- Primary: Brand identity, main actions
- Success: Positive feedback, confirmations
- Warning: Caution, potential issues
- Destructive: Errors, dangerous actions
- Info: Neutral information

**AI-Specific Colors:**
- AI Thinking: Processing state
- AI Streaming: Real-time response
- Tool Execution: Function calling
- AI Complete: Finished responses
- AI Error: AI-specific failures

#### 2. Choose Base Lightness

**Light Mode Guidelines:**
```css
/* Surface colors */
--background: 100% 0 0;        /* Pure white */
--card: 100% 0 0;              /* White cards */
--muted: 96% 0.01 265;         /* Subtle gray */

/* Text colors */
--foreground: 20% 0.02 250;    /* Near black */
--muted-foreground: 55% 0.02 265; /* Gray text */

/* Brand colors */
--primary: 60% 0.2 265;        /* Medium brightness */
--success: 55% 0.18 145;       /* Medium green */
--destructive: 55% 0.22 25;    /* Medium red */
```

**Dark Mode Guidelines:**
```css
/* Surface colors */
--background: 20% 0.02 250;    /* Deep blue-black */
--card: 23% 0.02 265;          /* Slightly lighter */
--muted: 25% 0.03 265;         /* Subtle variation */

/* Text colors */
--foreground: 95% 0.01 250;    /* Off-white */
--muted-foreground: 65% 0.02 265; /* Light gray */

/* Brand colors (brighter in dark mode) */
--primary: 70% 0.2 265;        /* Brighter indigo */
--success: 65% 0.18 145;       /* Brighter green */
--destructive: 65% 0.22 25;    /* Brighter red */
```

#### 3. Select Chroma (Saturation)

**Chroma Guidelines:**

| Use Case | Chroma Range | Example |
|----------|-------------|---------|
| Neutrals (gray) | 0-0.02 | `oklch(50% 0.01 265)` |
| Subtle tints | 0.02-0.08 | `oklch(96% 0.04 265)` |
| Standard colors | 0.12-0.18 | `oklch(60% 0.15 240)` |
| Vibrant accents | 0.2-0.25 | `oklch(65% 0.22 340)` |
| Maximum saturation | 0.3-0.4 | Use sparingly |

**Best Practices:**
- Neutrals: C ≤ 0.02
- Primary brand: C = 0.15-0.2
- Success/Error: C = 0.18-0.22 (high urgency)
- Backgrounds: C ≤ 0.05 (avoid eye strain)

#### 4. Choose Hue

**Hue Reference:**
```
0° = Red
30° = Orange
60° = Yellow
90° = Yellow-green
120° = Green
150° = Cyan-green
180° = Cyan
210° = Blue-cyan
240° = Blue
270° = Purple
300° = Magenta
330° = Pink-red
```

**Semantic Hue Conventions:**
- Success: 120-150° (green)
- Warning: 50-70° (yellow-orange)
- Error: 15-35° (red-orange)
- Info: 220-240° (blue)
- Primary: Your brand color

### Color Contrast Requirements

**WCAG 2.1 AA Minimum:**
- Normal text (< 18px): 4.5:1 contrast
- Large text (≥ 18px): 3:1 contrast
- UI components: 3:1 contrast

**WCAG 2.1 AAA (Recommended):**
- Normal text: 7:1 contrast
- Large text: 4.5:1 contrast

#### Calculating Contrast in OKLCH

```typescript
// Helper to ensure accessible contrast
function ensureContrast(
  color: OKLCH,
  background: OKLCH,
  targetRatio: number = 4.5
): OKLCH {
  const contrast = getContrastRatio(color, background)

  if (contrast >= targetRatio) {
    return color
  }

  // Adjust lightness to meet target
  const adjustedLightness = calculateRequiredLightness(
    color,
    background,
    targetRatio
  )

  return { ...color, l: adjustedLightness }
}
```

### Creating Color Scales

**Generate Tint Scale (Lighter Variants):**
```css
/* Base color */
--primary: 60% 0.2 265;

/* Lighter variants (increase lightness, reduce chroma slightly) */
--primary-50: 96% 0.05 265;   /* Very light tint */
--primary-100: 92% 0.08 265;  /* Light tint */
--primary-200: 85% 0.12 265;  /* Medium-light */
--primary-300: 75% 0.16 265;  /* Medium */
--primary-400: 65% 0.18 265;  /* Medium-dark */
--primary-500: 60% 0.2 265;   /* Base */
--primary-600: 55% 0.2 265;   /* Dark */
--primary-700: 45% 0.18 265;  /* Darker */
--primary-800: 35% 0.15 265;  /* Very dark */
--primary-900: 25% 0.1 265;   /* Near black */
```

**Pattern:**
- Lightness changes in ~10% steps
- Chroma reduces gradually at extremes
- Hue stays constant (perceptual uniformity)

### State Color Variations

**Interactive States:**
```css
/* Base state */
.button {
  background: oklch(60% 0.2 265);
}

/* Hover: Increase lightness by 5-10% */
.button:hover {
  background: oklch(65% 0.2 265);
}

/* Active: Decrease lightness by 5-10% */
.button:active {
  background: oklch(55% 0.2 265);
}

/* Disabled: Reduce chroma significantly */
.button:disabled {
  background: oklch(60% 0.05 265);
}

/* Focus: Add colored outline */
.button:focus-visible {
  outline: 2px solid oklch(60% 0.2 265 / 0.5);
}
```

### Color Naming Convention

**Semantic Naming (Recommended):**
```css
/* Good: Purpose-based names */
--color-primary
--color-success
--color-warning
--color-ai-thinking
--color-text-heading
--color-surface-elevated
```

**Avoid:**
```css
/* Bad: Implementation-specific names */
--color-blue-500
--color-indigo
--color-light-gray
```

### Testing Colors

**Tools:**
1. [OKLCH Color Picker](https://oklch.com/) - Interactive picker
2. [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Validate contrast
3. [Who Can Use](https://whocanuse.com/) - Simulate vision conditions

**Browser DevTools:**
- Chrome: Inspect > Color picker > Toggle OKLCH
- Firefox: Inspect > Color picker (native OKLCH support)

### Common Pitfalls

1. **Too Much Chroma on Backgrounds**
   - Problem: Eye strain, readability issues
   - Solution: Keep background C ≤ 0.05

2. **Insufficient Contrast in Dark Mode**
   - Problem: Text hard to read
   - Solution: Increase lightness of text colors

3. **Inconsistent Lightness Across Colors**
   - Problem: Visual hierarchy confusion
   - Solution: Use same lightness for equal importance

4. **Forgetting Alpha Transparency**
   - Format: `oklch(L C H / alpha)`
   - Example: `oklch(60% 0.2 265 / 0.5)` (50% opacity)

### Quick Reference Table

| Purpose | Light Mode | Dark Mode | Chroma | Hue |
|---------|------------|-----------|--------|-----|
| Background | 95-100% L | 15-20% L | 0-0.02 | Any |
| Primary | 55-65% L | 65-75% L | 0.15-0.2 | Brand |
| Success | 50-60% L | 60-70% L | 0.18-0.22 | 120-150° |
| Warning | 70-80% L | 75-85% L | 0.18-0.2 | 50-70° |
| Error | 50-60% L | 60-70% L | 0.2-0.25 | 15-35° |
| Text | 20-30% L | 90-95% L | 0.01-0.02 | Any |

---

## Accessibility Considerations

### WCAG 2.1 AA Compliance Checklist

#### Perceivable

**1.1 Text Alternatives:**
- [ ] All images have alt text
- [ ] Decorative images use `alt=""` or `aria-hidden="true"`
- [ ] Icons have accessible labels
- [ ] Complex graphics have long descriptions

**1.2 Time-based Media:**
- [ ] Audio has captions
- [ ] Video has captions and transcripts
- [ ] Auto-playing media has controls

**1.3 Adaptable:**
- [ ] Content structure is logical in code
- [ ] Meaning doesn't rely on sensory characteristics
- [ ] Orientation is not locked
- [ ] Input purpose is identified

**1.4 Distinguishable:**
- [ ] Color is not the only visual means of conveying information
- [ ] Text contrast meets 4.5:1 (normal) or 3:1 (large)
- [ ] Text can be resized to 200% without loss of content
- [ ] Images of text are avoided when possible
- [ ] Text spacing can be adjusted

#### Operable

**2.1 Keyboard Accessible:**
- [ ] All functionality available via keyboard
- [ ] No keyboard traps
- [ ] Keyboard shortcuts are documented

**2.2 Enough Time:**
- [ ] Timing can be adjusted or extended
- [ ] Moving content can be paused
- [ ] Auto-updating content can be paused

**2.3 Seizures and Physical Reactions:**
- [ ] Nothing flashes more than 3 times per second
- [ ] Animation respects `prefers-reduced-motion`

**2.4 Navigable:**
- [ ] Skip links provided for main content
- [ ] Page titles are descriptive
- [ ] Focus order is logical
- [ ] Link purpose is clear from text or context
- [ ] Multiple ways to find pages
- [ ] Headings and labels are descriptive
- [ ] Focus visible on all interactive elements

**2.5 Input Modalities:**
- [ ] Touch targets are at least 44x44px
- [ ] Gestures work with single pointer
- [ ] Cancel function available for complex gestures
- [ ] Labels match accessible names

#### Understandable

**3.1 Readable:**
- [ ] Language of page is identified
- [ ] Language changes are identified
- [ ] Unusual words have definitions

**3.2 Predictable:**
- [ ] Focus doesn't cause unexpected changes
- [ ] Input doesn't cause unexpected changes
- [ ] Navigation is consistent
- [ ] Components are consistently identified

**3.3 Input Assistance:**
- [ ] Errors are identified and described
- [ ] Labels or instructions provided for inputs
- [ ] Error suggestions provided when possible
- [ ] Error prevention for important actions

#### Robust

**4.1 Compatible:**
- [ ] Valid HTML markup
- [ ] Proper ARIA usage
- [ ] Status messages use ARIA live regions

### Focus Management

#### Visible Focus Indicators

```tsx
// Always show focus for keyboard users
const focusClasses = "
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-ring
  focus-visible:ring-offset-2
  focus-visible:ring-offset-background
"

<button className={cn("base-button", focusClasses)}>
  Action
</button>
```

#### Focus Trapping in Modals

```tsx
import { FocusTrap } from '@/components/ui/focus-trap'

<FocusTrap enabled={isOpen}>
  <Dialog>
    <DialogTitle>Modal Title</DialogTitle>
    <DialogContent>
      {/* Content */}
    </DialogContent>
    <DialogFooter>
      <Button onClick={handleClose}>Close</Button>
    </DialogFooter>
  </Dialog>
</FocusTrap>
```

#### Managing Focus on Route Changes

```tsx
// Focus heading on navigation
useEffect(() => {
  const heading = document.querySelector('h1')
  if (heading) {
    heading.setAttribute('tabindex', '-1')
    heading.focus()
  }
}, [pathname])
```

### Screen Reader Announcements

#### Live Regions for Dynamic Updates

```tsx
// Announce loading states
<div role="status" aria-live="polite" className="sr-only">
  {isLoading ? 'Loading...' : `Loaded ${items.length} items`}
</div>

// Announce errors
<div role="alert" aria-live="assertive" className="sr-only">
  {error ? `Error: ${error.message}` : null}
</div>
```

#### Proper ARIA Labels

```tsx
// Button with icon only
<button aria-label="Delete message">
  <Trash className="h-4 w-4" />
</button>

// Link with non-descriptive text
<a href="/docs" aria-label="Read documentation">
  Learn more
</a>

// Form input with visible label
<label htmlFor="message">
  Message
  <input id="message" type="text" />
</label>

// Form input with hidden label
<input
  type="search"
  aria-label="Search messages"
  placeholder="Search..."
/>
```

### Keyboard Navigation Patterns

#### Common Shortcuts

```tsx
const keyboardShortcuts = {
  // Global navigation
  'Cmd+K': 'Open command palette',
  'Cmd+/': 'Show keyboard shortcuts',
  'Escape': 'Close modal/dialog',

  // Chat actions
  'Cmd+N': 'New chat',
  'Cmd+F': 'Search messages',
  'Cmd+Enter': 'Send message',
  'Shift+Enter': 'New line',

  // Navigation
  'Tab': 'Next element',
  'Shift+Tab': 'Previous element',
  'ArrowUp/Down': 'Navigate list',
  'Enter/Space': 'Activate button',
}
```

#### Implementation

```tsx
function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options?: { metaKey?: boolean; ctrlKey?: boolean }
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (options?.metaKey && !e.metaKey) return
      if (options?.ctrlKey && !e.ctrlKey) return
      if (e.key !== key) return

      e.preventDefault()
      callback()
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [key, callback, options])
}

// Usage
useKeyboardShortcut('k', openCommandPalette, { metaKey: true })
```

### Touch Targets

#### Minimum Size Requirements

```tsx
// Ensure 44x44px minimum for touch
<button className="min-h-[44px] min-w-[44px] p-2">
  <Icon className="h-6 w-6" />
</button>

// Or use spacing around smaller elements
<div className="p-3"> {/* Padding creates 44x44 target */}
  <button className="h-4 w-4">
    <Icon />
  </button>
</div>
```

#### Spacing Between Targets

```tsx
// Ensure 8px minimum between touch targets
<div className="flex gap-2"> {/* 8px gap */}
  <Button size="icon">
    <Copy />
  </Button>
  <Button size="icon">
    <Edit />
  </Button>
  <Button size="icon">
    <Trash />
  </Button>
</div>
```

### Motion and Animation

#### Respecting Reduced Motion

```tsx
// Global CSS
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// React hook
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(query.matches)

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    query.addEventListener('change', handler)
    return () => query.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// Usage
const prefersReducedMotion = useReducedMotion()

<motion.div
  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
>
  {content}
</motion.div>
```

### Color and Contrast

#### Testing Tools

```tsx
// Helper to check contrast ratio
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1)
  const lum2 = getRelativeLuminance(color2)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

// Usage in component
const contrast = getContrastRatio(textColor, backgroundColor)
const meetsAA = contrast >= 4.5 // Normal text
const meetsAAA = contrast >= 7 // Enhanced

if (!meetsAA) {
  console.warn('Insufficient contrast:', { textColor, backgroundColor, contrast })
}
```

#### Non-Color Indicators

```tsx
// Bad: Color only
<span className="text-destructive">Error</span>

// Good: Icon + color
<span className="text-destructive flex items-center gap-1">
  <AlertCircle className="h-4 w-4" />
  Error
</span>

// Good: Pattern + color (for charts/graphs)
<rect fill="oklch(var(--primary))" strokeDasharray="4 2" />
```

---

## Mobile Patterns

### Responsive Breakpoints

```typescript
// Tailwind breakpoints
const breakpoints = {
  sm: '640px',  // Small tablets
  md: '768px',  // Tablets
  lg: '1024px', // Laptops
  xl: '1280px', // Desktops
  '2xl': '1536px', // Large desktops
}

// React hook for breakpoints
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const handler = () => setMatches(media.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [query])

  return matches
}

// Usage
const isMobile = useMediaQuery('(max-width: 768px)')
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
const isDesktop = useMediaQuery('(min-width: 1025px)')
```

### Mobile-First Components

#### Chat Input

```tsx
// Mobile: Full-width, sticky bottom
// Desktop: Max-width container
<div className="
  fixed bottom-0 left-0 right-0
  md:static
  bg-background border-t md:border md:rounded-lg
  p-4
  max-w-full md:max-w-2xl
  mx-auto
">
  <textarea
    className="
      w-full
      min-h-[44px] max-h-[200px]
      resize-none
    "
    placeholder="Type a message..."
  />
  <Button className="w-full md:w-auto mt-2">
    Send
  </Button>
</div>
```

#### Navigation

```tsx
// Mobile: Bottom navigation
// Desktop: Sidebar navigation
<nav className="
  fixed bottom-0 left-0 right-0
  lg:static lg:w-64
  bg-card border-t lg:border-r
  flex lg:flex-col
  justify-around lg:justify-start
  p-2
">
  <NavItem icon={Home} label="Home" />
  <NavItem icon={Search} label="Search" />
  <NavItem icon={User} label="Profile" />
</nav>
```

### Touch Gestures

#### Swipe to Delete

```tsx
function useSwipeGesture(onSwipe: (direction: 'left' | 'right') => void) {
  const [touchStart, setTouchStart] = useState(0)

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    // Swipe threshold: 50px
    if (Math.abs(diff) > 50) {
      onSwipe(diff > 0 ? 'left' : 'right')
    }
  }

  return { handleTouchStart, handleTouchEnd }
}

// Usage
<div
  {...useSwipeGesture((direction) => {
    if (direction === 'left') handleDelete()
  })}
  className="touchable-item"
>
  {content}
</div>
```

#### Pull to Refresh

```tsx
function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const threshold = 80 // Pull 80px to trigger

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      const currentY = e.touches[0].clientY
      const distance = Math.max(0, currentY - startY)
      setPullDistance(distance)
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance > threshold) {
      setIsRefreshing(true)
      await onRefresh()
      setIsRefreshing(false)
    }
    setPullDistance(0)
  }

  return {
    pullDistance,
    isRefreshing,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  }
}
```

### Viewport Considerations

#### Safe Area Insets (iOS Notch)

```css
/* Support for iPhone notch and home indicator */
.mobile-container {
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
}

/* Tailwind plugin */
@layer utilities {
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .pt-safe {
    padding-top: env(safe-area-inset-top);
  }
}
```

#### Dynamic Viewport Height

```tsx
// Fix for mobile viewport height (accounts for browser chrome)
useEffect(() => {
  const setVH = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  setVH()
  window.addEventListener('resize', setVH)
  return () => window.removeEventListener('resize', setVH)
}, [])

// CSS usage
.full-height {
  height: 100vh; /* Fallback */
  height: calc(var(--vh, 1vh) * 100);
}
```

### Mobile Performance

#### Lazy Loading Images

```tsx
<img
  src={thumbnailSrc}
  data-src={fullSizeSrc}
  loading="lazy"
  className="w-full h-auto"
  alt={description}
/>
```

#### Virtual Scrolling for Long Lists

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function MessageList({ messages }: { messages: Message[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5, // Render 5 extra items for smooth scrolling
  })

  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${item.size}px`,
              transform: `translateY(${item.start}px)`,
            }}
          >
            <Message message={messages[item.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Mobile-Specific Components

#### Bottom Sheet

```tsx
function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="
          fixed bottom-0 left-0 right-0 z-50
          bg-card rounded-t-xl
          max-h-[90vh] overflow-auto
          pb-safe
        "
      >
        {/* Drag handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-muted-foreground/20 rounded-full" />
        </div>

        {children}
      </motion.div>
    </>
  )
}
```

#### Floating Action Button (FAB)

```tsx
<button className="
  fixed bottom-20 right-4
  h-14 w-14 rounded-full
  bg-primary text-primary-foreground
  shadow-lg hover:shadow-xl
  transition-all duration-normal
  z-40
  md:hidden
">
  <Plus className="h-6 w-6" />
</button>
```

---

## Component Composition Patterns

### Compound Components

```tsx
// Card compound component
const Card = ({ children }: { children: ReactNode }) => (
  <div className="bg-card border rounded-lg">{children}</div>
)

Card.Header = ({ children }: { children: ReactNode }) => (
  <div className="p-4 border-b">{children}</div>
)

Card.Body = ({ children }: { children: ReactNode }) => (
  <div className="p-4">{children}</div>
)

Card.Footer = ({ children }: { children: ReactNode }) => (
  <div className="p-4 border-t">{children}</div>
)

// Usage
<Card>
  <Card.Header>
    <h2>Title</h2>
  </Card.Header>
  <Card.Body>
    <p>Content</p>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Render Props Pattern

```tsx
function DataList<T>({
  data,
  render,
  loading,
  empty,
}: {
  data: T[]
  render: (item: T) => ReactNode
  loading?: ReactNode
  empty?: ReactNode
}) {
  if (loading) return <>{loading}</>
  if (data.length === 0) return <>{empty}</>

  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>{render(item)}</div>
      ))}
    </div>
  )
}

// Usage
<DataList
  data={messages}
  render={(message) => <Message message={message} />}
  loading={<Skeleton />}
  empty={<EmptyState />}
/>
```

### Headless Components

```tsx
// Headless tabs (logic only)
function useTabs(defaultValue: string) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return {
    activeTab,
    setActiveTab,
    isActive: (tab: string) => activeTab === tab,
  }
}

// Styled implementation
function Tabs({ defaultValue, children }: TabsProps) {
  const tabs = useTabs(defaultValue)

  return (
    <TabsContext.Provider value={tabs}>
      {children}
    </TabsContext.Provider>
  )
}

// Usage
<Tabs defaultValue="chat">
  <TabsList>
    <TabsTrigger value="chat">Chat</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="chat">
    <ChatView />
  </TabsContent>
  <TabsContent value="settings">
    <SettingsView />
  </TabsContent>
</Tabs>
```

---

## Animation Guidelines

### Performance Principles

1. **Use GPU-Accelerated Properties**
   - `transform` (translate, scale, rotate)
   - `opacity`
   - Avoid animating: `height`, `width`, `top`, `left`

2. **Respect Reduced Motion**
   - Always check `prefers-reduced-motion`
   - Provide instant state changes as fallback

3. **Keep Animations Fast**
   - Duration: 150-300ms for most interactions
   - Longer (500ms+) only for dramatic effects
   - Never exceed 1 second for UI feedback

### Common Animation Patterns

#### Entrance Animations

```tsx
// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.2 }}
>
  {content}
</motion.div>

// Slide up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
>
  {content}
</motion.div>

// Scale in (pop)
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
>
  {content}
</motion.div>
```

#### Exit Animations

```tsx
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {content}
    </motion.div>
  )}
</AnimatePresence>
```

#### Loading States

```tsx
// Skeleton pulse
<div className="animate-pulse-subtle bg-muted rounded" />

// Spinner
<div className="animate-spin">
  <Loader className="h-4 w-4" />
</div>

// Thinking dots
<div className="flex gap-1">
  <div className="h-2 w-2 rounded-full bg-current animate-thinking-dot" />
  <div className="h-2 w-2 rounded-full bg-current animate-thinking-dot [animation-delay:0.2s]" />
  <div className="h-2 w-2 rounded-full bg-current animate-thinking-dot [animation-delay:0.4s]" />
</div>
```

---

## Error Handling Patterns

### Error Boundaries

```tsx
class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### Toast Notifications

```tsx
// Success
toast.success('Message sent successfully', {
  icon: <Check className="h-4 w-4" />,
})

// Error
toast.error('Failed to send message', {
  icon: <AlertCircle className="h-4 w-4" />,
  action: {
    label: 'Retry',
    onClick: handleRetry,
  },
})

// Loading
const toastId = toast.loading('Sending message...')
// Later
toast.success('Message sent!', { id: toastId })
```

### Inline Error States

```tsx
<div className="space-y-2">
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    aria-invalid={!!error}
    aria-describedby="email-error"
    className={cn(
      "input",
      error && "border-destructive focus:ring-destructive"
    )}
  />
  {error && (
    <p id="email-error" className="text-sm text-destructive flex items-center gap-1">
      <AlertCircle className="h-4 w-4" />
      {error.message}
    </p>
  )}
</div>
```

---

## Summary

This guide covers the core design patterns for building accessible, user-friendly components in the Clarity Chat design system:

1. **CommandPalette vs Menus**: Choose based on user expertise and use case
2. **AudioRecorder**: Clear visual feedback at every stage
3. **OKLCH Colors**: Perceptually uniform, accessible color system
4. **Accessibility**: WCAG 2.1 AA compliance for all users
5. **Mobile**: Touch-friendly, responsive patterns
6. **Composition**: Flexible, reusable component patterns
7. **Animation**: Fast, purposeful, respectful of user preferences
8. **Errors**: Clear, actionable, helpful error handling

Follow these patterns to maintain consistency and quality across the component library.

---

**File Location:** `/Users/christireid/Dev/Clarity-ai-chat-components/docs/design-system/DESIGN_PATTERNS.md`

**Related Documentation:**
- [Design System Overview](./clarity-chat-current-system.md)
- [Visual Design Enhancements](../research/analysis/visual-design-enhancements.md)
- [Component Development Guide](../../packages/react/CLAUDE.md)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
