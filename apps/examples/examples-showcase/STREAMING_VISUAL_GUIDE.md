# Streaming Showcase - Visual Guide

This guide provides ASCII art representations and descriptions of the visual layout and design of the streaming demonstrations.

## StreamingShowcase Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│        Streaming Message Showcase                              │
│        Real-time message streaming with multiple scenarios     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Choose a Scenario                                              │
│                                                                 │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  │
│  │ Fast   │  │ Normal │  │ Slow   │  │  Code  │  │Multi-  │  │
│  │ 20ms   │  │ 50ms   │  │ 100ms  │  │  30ms  │  │line    │  │
│  │ [Blue] │  │[Purple]│  │[Green] │  │[Orange]│  │[Indigo]│  │
│  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────────┐
│  Normal Streaming              • │  Progress                    │
│                                  │  ═════════════░░░  150/250   │
│  ┌────────────────────────────┐ │                              │
│  │                            │ │  52.3 chars/sec              │
│  │  This is a normal         │ │  50ms delay                  │
│  │  streaming speed          │ │  3.2s elapsed                │
│  │  demonstration...▋         │ │                              │
│  │                            │ │  ┌──────────────────────┐   │
│  └────────────────────────────┘ │  │ Streaming Features   │   │
│                                  │  │ ✓ Token-by-token    │   │
│  [ Start Streaming ] [ Stop ]   │  │ ✓ Smooth cursor     │   │
│                                  │  │ ✓ Real-time stats   │   │
└──────────────────────────────────┴──────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Multi-Stream Comparison                                        │
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                │
│  │  Fast    │    │  Normal  │    │  Slow    │                │
│  │  (20ms)  │    │  (50ms)  │    │  (100ms) │                │
│  │          │    │          │    │          │                │
│  │  The... │    │  This... │    │  Slow... │                │
│  └──────────┘    └──────────┘    └──────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

## SimpleStreamingDemo Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    Streaming Demo                               │
│              Token-by-token message rendering                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  [ Fast (20ms) ] [ Normal (50ms) ] [ Slow (100ms) ]            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  This demonstrates a comfortable reading pace for              │
│  AI chat applications...▋                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│         [ Start Streaming ]  [ Stop ]                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────────────────────┐
│  Features                │  Use Cases                           │
│  ✓ Token-by-token       │  → AI chat responses                 │
│  ✓ Animated cursor      │  → Code generation                   │
│  ✓ Multiple speeds      │  → Real-time updates                 │
│  ✓ Simple implementation│  → Improved UX perception            │
└──────────────────────────┴──────────────────────────────────────┘
```

## Visual Elements

### Glassmorphism Effects

```
┌─────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← Backdrop blur
│ ░░                             ░░ │
│ ░░  Content with glass effect  ░░ │
│ ░░  Semi-transparent bg        ░░ │
│ ░░                             ░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────────┘
     ↑                           ↑
   Border                    Shadow
```

### Gradient Backgrounds

```
Page Background:
╔═══════════════════════════════════════╗
║ [Blue]                                ║
║        [Purple]                       ║
║               [Pink]                  ║
╚═══════════════════════════════════════╝

Button Gradient:
┌───────────────────────┐
│ [Cyan] ────→ [Blue]   │
└───────────────────────┘

Text Gradient:
Streaming Message Showcase
[Blue]→[Purple]→[Pink]
```

### Streaming Cursor Animation

```
Frame 1:  text▋
Frame 2:  text
Frame 3:  text▋
Frame 4:  text
(Repeats with fade effect)
```

### Streaming Indicator

```
Frame 1:  ● ○ ○  Streaming...
Frame 2:  ○ ● ○  Streaming...
Frame 3:  ○ ○ ●  Streaming...
Frame 4:  ○ ● ○  Streaming...
(Bouncing animation)
```

### Progress Bar

```
Empty:     ░░░░░░░░░░░░░░░░░░░░  0/250

Progress:  ██████████░░░░░░░░░░  150/250

Complete:  ████████████████████  250/250
```

## Color Schemes

### Scenario Colors

```
Fast:      Blue (#3B82F6) → Cyan (#06B6D4)
           ████████████████████████████████

Normal:    Purple (#A855F7) → Pink (#EC4899)
           ████████████████████████████████

Slow:      Green (#10B981) → Emerald (#059669)
           ████████████████████████████████

Code:      Orange (#F97316) → Red (#EF4444)
           ████████████████████████████████

Multiline: Indigo (#6366F1) → Purple (#A855F7)
           ████████████████████████████████
```

### Glass Effect Colors

```
Base:      White/10% opacity + Blur
           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒

Light:     White/70% opacity + Blur
           ████░░░░░░░░░░░░████

Dark:      Black/30% opacity + Blur
           ░░░░████████████░░░░
```

## Component States

### Idle State
```
┌─────────────────────────────────┐
│                                 │
│  Click "Start Streaming"       │
│  to begin                       │
│                                 │
└─────────────────────────────────┘
    [ Start Streaming ]
```

### Streaming State
```
┌─────────────────────────────────┐
│                                 │
│  This is streaming text...▋     │
│                                 │
└─────────────────────────────────┘
●●● Streaming...
    [ Streaming... ]  [ Stop ]
```

### Complete State
```
┌─────────────────────────────────┐
│                                 │
│  This is the complete text.     │
│                                 │
└─────────────────────────────────┘
    [ Start Streaming ]
```

## Responsive Layouts

### Desktop (1200px+)
```
┌────────────────────────────────────────────────────┐
│  Scenario Buttons (5 columns)                     │
├───────────────────────────┬────────────────────────┤
│  Streaming Area           │  Stats Panel           │
│  (2/3 width)              │  (1/3 width)           │
└───────────────────────────┴────────────────────────┘
```

### Tablet (768px - 1199px)
```
┌───────────────────────────────────┐
│  Scenario Buttons (3 columns)    │
├───────────────────────────────────┤
│  Streaming Area (Full width)     │
├───────────────────────────────────┤
│  Stats Panel (Full width)        │
└───────────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────────────┐
│  Scenario Buttons    │
│  (1 column, scroll)  │
├──────────────────────┤
│  Streaming Area      │
│  (Full width)        │
├──────────────────────┤
│  Stats               │
│  (Collapsed)         │
└──────────────────────┘
```

## Animation Timings

### Entrance Animations
```
Header:    0ms    ────────●
Controls:  100ms           ●
Main:      200ms                ●
Stats:     300ms                     ●
Footer:    400ms                          ●
```

### Streaming Animation
```
Character appears every Xms:

Fast:    |...|...|...|...  (20ms intervals)
Normal:  |.....|.....|.....  (50ms intervals)
Slow:    |.........|.........|  (100ms intervals)
```

### Cursor Pulse
```
Opacity: 1.0 ───▼──── 0.3 ───▼──── 1.0
Time:    0ms    400ms    800ms
         ◆       ◇       ◆
```

## Interactive Elements

### Button Hover States
```
Default:   ┌──────────────┐
          │    Button    │
          └──────────────┘

Hover:     ┌──────────────┐  ↑ (scale 1.05)
          │    Button    │
          └──────────────┘

Active:    ┌──────────────┐  ↓ (scale 0.95)
          │    Button    │
          └──────────────┘
```

### Scenario Selection
```
Inactive:  ┌──────────────┐
          │   Scenario   │
          │     50ms     │
          └──────────────┘
          (Gray background)

Active:    ┌──────────────┐  ← Gradient + Scale
          │ ✓ Scenario   │
          │     50ms     │
          └──────────────┘
          (Colored gradient)
```

## Data Visualization

### Stats Dashboard
```
┌───────────────────────────────┐
│ Progress                      │
│ ████████████░░░░░░░░ 150/250 │
├───────────────────────────────┤
│  52.3        50ms      3.2s   │
│ chars/sec    delay    elapsed │
└───────────────────────────────┘
```

### Multi-Stream Comparison
```
Speed Comparison:

Fast:    ████████████████████ (100%)
Normal:  ██████████░░░░░░░░░░ (50%)
Slow:    █████░░░░░░░░░░░░░░░ (25%)
```

## Typography

### Heading Styles
```
H1: Streaming Message Showcase
    (5xl, bold, gradient)

H2: Choose a Scenario
    (2xl, semibold, dark)

H3: Streaming Features
    (lg, semibold)

Body: Regular paragraph text
      (base, normal)

Code: Monospace for stats
      (mono, tabular-nums)
```

## Spacing System

```
Container:  8 units padding
Sections:   8 units gap
Cards:      6 units padding
Elements:   4 units gap
Tight:      2 units gap
```

## Icon Elements

### Streaming Indicator
```
●●● (Bouncing dots)
```

### Feature Checkmarks
```
✓ Enabled feature
```

### Navigation Arrows
```
→ Use case items
```

### Status Icons
```
◆ Active
◇ Inactive
● Streaming
○ Idle
```

## Accessibility Indicators

### Focus States
```
┌─────────────────┐
│ ┌─────────────┐ │  ← 2px ring
│ │   Button    │ │
│ └─────────────┘ │
└─────────────────┘
```

### ARIA Labels
```
<button aria-label="Start streaming">
<div role="status" aria-live="polite">
<div aria-hidden="true"> (decorative icons)
```

---

This visual guide provides a comprehensive overview of the layout, styling, and interactive elements in the streaming demonstrations. Use this as a reference when implementing or customizing the showcase.
