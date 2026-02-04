# Interactive Playground - Quick Reference

## Location
`/playground` or `/apps/streamlined-docs/app/playground/page.tsx`

## Quick Demo Overview

### 1. Command Palette 🎯
```
┌─────────────────────────────────────┐
│ 🔍 Type a command or search...      │
├─────────────────────────────────────┤
│ 📟 Open Terminal           ⌘T      │
│ 📝 View Source             ⌘U      │
│ ✨ New Component           ⌘N      │
│ ⚡ Run Command             ⌘R      │
│ 💬 Send Message            ⌘Enter  │
├─────────────────────────────────────┤
│ ↑↓ Navigate  Enter Select  Esc Close│
└─────────────────────────────────────┘
```

**Features:**
- Fuzzy search filtering
- Keyboard navigation (↑↓)
- Modal with backdrop
- Command shortcuts display

---

### 2. Audio Recorder 🎤
```
┌─────────────────────────────────────┐
│     ||||||||||||||||||||||||||||    │ ← Waveform
│                                     │
│        🔴 Recording... 0:03         │
│                                     │
│          [⏹ Stop]                   │
└─────────────────────────────────────┘

States: idle → recording → recorded → playing
```

**Features:**
- Animated waveform (32 bars)
- Duration timer (MM:SS)
- State machine (4 states)
- Auto-stop after 5 seconds

---

### 3. OKLCH Color Picker 🎨
```
┌────────────────┬────────────────────┐
│                │ Lightness: 70%     │
│                │ [────●────]         │
│   Color Box    │                    │
│   (Preview)    │ Chroma: 0.15       │
│                │ [────●────]         │
│                │                    │
│                │ Hue: 250°          │
│  oklch(70%     │ [────●────]         │
│   0.15 250)    │                    │
│  [Copy]        │ [Brand][Success]   │
│                │ [Warn] [Error]     │
└────────────────┴────────────────────┘
```

**Features:**
- Live color preview
- Three range sliders
- Quick presets (4 colors)
- Copy to clipboard

---

### 4. Interactive Examples 🎮
```
┌──────────────┬──────────────┐
│   Counter    │  Text Input  │
│              │              │
│      42      │ Type here... │
│              │              │
│ [-] [Reset]  │ Live Preview:│
│     [+]      │ "Hello!"     │
├──────────────┼──────────────┤
│ Radio Group  │Toggle Switch │
│              │              │
│ ○ Option 1   │ Notifications│
│ ● Option 2   │ [───●  ] ON  │
│ ○ Option 3   │              │
│              │ ✓ Enabled!   │
└──────────────┴──────────────┘
```

**Components:**
- Counter (increment/decrement)
- Text Input (live preview)
- Radio Group (3 options)
- Toggle Switch (animated)

---

## Component Hierarchy

```
PlaygroundPage
│
├── Hero Section
│   └── Badge + Title + Description
│
├── Demo Selector (4 tabs)
│   ├── Command Palette
│   ├── Audio Recorder
│   ├── OKLCH Picker
│   └── Interactive Examples
│
├── Demo Content (AnimatePresence)
│   └── Active Demo Component
│
└── Info Banner
    └── Help text + link to docs
```

## State Management

```typescript
// Main page state
const [activeDemo, setActiveDemo] = useState('command-palette')

// Command Palette state
const [isOpen, setIsOpen] = useState(false)
const [query, setQuery] = useState('')
const [selectedIndex, setSelectedIndex] = useState(0)

// Audio Recorder state
type Status = 'idle' | 'recording' | 'recorded' | 'playing'
const [status, setStatus] = useState<Status>('idle')
const [duration, setDuration] = useState(0)

// OKLCH Picker state
const [lightness, setLightness] = useState(70)
const [chroma, setChroma] = useState(0.15)
const [hue, setHue] = useState(250)

// Interactive Examples state
const [count, setCount] = useState(0)
const [inputValue, setInputValue] = useState('')
const [selectedOption, setSelectedOption] = useState('option1')
const [isToggled, setIsToggled] = useState(false)
```

## Animation Patterns

### 1. Page Transitions
```tsx
<AnimatePresence mode="wait">
  {activeDemo === 'command-palette' && <Demo key="..." />}
</AnimatePresence>
```

### 2. Modal Entrance
```tsx
initial={{ opacity: 0, scale: 0.95, y: -20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.95, y: -20 }}
```

### 3. Waveform Bars
```tsx
animate={{
  height: isRecording ? [8, Math.random() * 100 + 20, 8] : 8,
}}
transition={{
  duration: 0.3,
  repeat: isRecording ? Infinity : 0,
  delay: i * 0.05,
}}
```

### 4. Toggle Switch
```tsx
<motion.div
  animate={{ x: isToggled ? 28 : 4 }}
  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
/>
```

### 5. Number Scale
```tsx
<motion.div
  key={count}
  initial={{ scale: 1.2, color: '#6366f1' }}
  animate={{ scale: 1, color: '#000000' }}
/>
```

## Color System

### Brand Colors
- `brand-50` - Light background
- `brand-500` - Primary (buttons, links)
- `brand-600` - Hover state
- `brand-950` - Dark background

### Semantic Colors
- Red: Recording, danger, decrease
- Green: Success, play, increase
- Blue: Info, primary
- Purple: Special features
- Yellow: Warning, highlight

### Gradients
```tsx
// Hero gradient
"bg-gradient-to-br from-neutral-50 to-neutral-100"

// Button gradient
"bg-gradient-to-r from-brand-500 via-purple-500 to-brand-500"

// Color picker backgrounds
"bg-gradient-to-r from-black to-white"        // Lightness
"bg-gradient-to-r from-gray-300 to-red-500"   // Chroma
"bg-gradient-to-r from-red-500 via-green-500 to-blue-500" // Hue
```

## Responsive Breakpoints

```css
/* Mobile First */
default:        /* 320px+ */
sm:  640px+     /* Tablets portrait */
md:  768px+     /* Tablets landscape */
lg:  1024px+    /* Laptops */
xl:  1280px+    /* Desktops */
2xl: 1536px+    /* Large displays */
```

### Layout Changes
- **Mobile:** 1 column grid
- **Tablet:** 2 column grid
- **Desktop:** 4 column grid for demo selector

## Key Files

```
apps/streamlined-docs/
├── app/
│   └── playground/
│       ├── page.tsx          ← Main file (822 lines)
│       ├── metadata.ts       ← SEO
│       └── README.md         ← Documentation
├── components/
│   └── Enhanced/
│       └── ScrollReveal.tsx  ← Scroll animations
└── lib/
    ├── animations.ts         ← Duration constants
    └── toast.ts              ← Toast notifications
```

## Testing Checklist

### Desktop
- [ ] All 4 demos load and switch smoothly
- [ ] Command Palette opens with button click
- [ ] Command Palette closes with Escape
- [ ] Arrow keys navigate commands
- [ ] Audio recorder shows animated waveform
- [ ] Color picker updates in real-time
- [ ] Copy button works in OKLCH picker
- [ ] Counter increment/decrement works
- [ ] Text input shows live preview
- [ ] Radio group selection works
- [ ] Toggle switch animates smoothly
- [ ] Dark mode works correctly

### Mobile
- [ ] Touch targets are at least 44x44px
- [ ] Demos stack vertically
- [ ] Modal is responsive
- [ ] Buttons are easy to tap
- [ ] No horizontal scroll
- [ ] Text is readable at small sizes

### Accessibility
- [ ] Tab navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Keyboard shortcuts work
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA

## Performance Tips

1. **Lazy Loading:** Components load on demand with `AnimatePresence`
2. **GPU Acceleration:** Use `transform` and `opacity` for animations
3. **Debouncing:** Search filters are instant but efficient
4. **Memoization:** Consider `useMemo` for expensive calculations
5. **Keys:** Proper keys on animated elements force re-animation

## Common Pitfalls

### ❌ Don't
```tsx
// Don't animate height directly (causes reflow)
animate={{ height: isOpen ? 200 : 0 }}

// Don't use setInterval without cleanup
setInterval(() => doSomething(), 1000)

// Don't forget keys on animated elements
<motion.div animate={...}>{content}</motion.div>
```

### ✅ Do
```tsx
// Do use auto height with overflow
animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}

// Do cleanup intervals
useEffect(() => {
  const interval = setInterval(() => doSomething(), 1000)
  return () => clearInterval(interval)
}, [])

// Do use keys for re-animation
<motion.div key={count} animate={...}>{content}</motion.div>
```

## Useful Commands

```bash
# Run dev server
cd apps/streamlined-docs
npm run dev

# Open in browser
open http://localhost:3000/playground

# Build for production
npm run build

# Check TypeScript
npx tsc --noEmit

# Lint code
npm run lint
```

## Quick Edits

### Add New Demo
1. Add to `demos` array in `PlaygroundPage`
2. Create new demo function (e.g., `MyNewDemo`)
3. Add to `AnimatePresence` section
4. Test transitions

### Change Colors
Edit Tailwind classes:
- `brand-500` → Your primary color
- `neutral-*` → Background/text colors
- Gradient stops in range sliders

### Adjust Animations
Edit `durations` from `@/lib/animations`:
- `durations.slow` - 0.6s
- `durations.moderate` - 0.4s
- `durations.normal` - 0.3s

---

**Total LOC:** 822 lines
**Created:** 2026-01-28
**Status:** Production Ready ✅
