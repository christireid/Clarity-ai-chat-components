# NetworkStatus Visual Design Guide

## Component Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    NetworkStatus Component                   │
│                                                              │
│  ┌───────────────────────────────┐  ┌──────────────────┐   │
│  │                               │  │                  │   │
│  │    CONNECTION STATUS CARD     │  │   SYNC BADGE    │   │
│  │                               │  │                  │   │
│  │         ✓  (Icon)            │  │      ☁          │   │
│  │                               │  │                  │   │
│  │       Connected               │  │  All changes    │   │
│  │                               │  │     saved       │   │
│  │  ┌──────┬──────┬──────┐     │  │                  │   │
│  │  │ 45ms │ 8.2  │  4G  │     │  │   2m ago        │   │
│  │  │Latency│ Mbps │ Type │     │  │                  │   │
│  │  └──────┴──────┴──────┘     │  │                  │   │
│  │                               │  │                  │   │
│  └───────────────────────────────┘  └──────────────────┘   │
│                                                              │
│  CONNECTION BADGES                    SYNC INDICATORS       │
│  [● Online] [● Offline] [● Reconnecting] [● Slow]         │
│  [☁ Synced] [↻ Syncing] [⏸ Pending] [✕ Failed]           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  PENDING QUEUE (when offline)                      │    │
│  │  📄 Message 1 - Waiting to sync                   │    │
│  │  📄 Message 2 - Waiting to sync                   │    │
│  │  📄 Message 3 - Waiting to sync                   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  SIMULATION CONTROLS                                        │
│  [✕ Offline] [↻ Reconnect] [⚠ Slow] [+ Add Message]      │
│                                                              │
│  NETWORK STATISTICS                                         │
│  [⚡ Latency] [📶 Download] [🔄 RTT] [📡 Type]            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Connection States Visual Flow

```
┌──────────┐
│          │
│  ONLINE  │ ────┐
│    ✓     │     │ User disconnects
│          │     │ or network drops
└──────────┘     │
      ▲          ▼
      │    ┌──────────┐
      │    │          │
      │    │ OFFLINE  │
      │    │    ✕     │
      │    │          │
      │    └──────────┘
      │          │
      │          │ Connection detected
      │          ▼
      │    ┌──────────┐
      │    │          │
      └────│RECONNECT │
           │    ↻     │
           │          │
           └──────────┘
                │
                │ Poor signal
                ▼
           ┌──────────┐
           │          │
           │   SLOW   │
           │    ⚠     │
           │          │
           └──────────┘
```

## Glassmorphism Effect Anatomy

```
┌─────────────────────────────────────────┐
│                                         │ ← Border: 1px solid rgba(255,255,255,0.2)
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │   Frosted Glass Layer             │ │ ← Background: rgba(255,255,255,0.15)
│  │   backdrop-filter: blur(10px)     │ │
│  │                                   │ │
│  │   ┌─────────────────────────┐    │ │
│  │   │  Content Layer          │    │ │ ← Text/Icons
│  │   │  Fully visible          │    │ │
│  │   └─────────────────────────┘    │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │ ← Shadow: 0 8px 32px rgba(31,38,135,0.37)
└─────────────────────────────────────────┘
```

## Status Color System

```
Online Status Colors:
━━━━━━━━━━━━━━━━━━━━
✓ ONLINE
  Primary:   #10b981 (Emerald 500)
  Secondary: #059669 (Emerald 600)
  Gradient:  135deg, from emerald-500 to emerald-600
  Usage:     Connected, all systems operational

✕ OFFLINE
  Primary:   #ef4444 (Red 500)
  Secondary: #dc2626 (Red 600)
  Gradient:  135deg, from red-500 to red-600
  Usage:     No connection, offline mode

↻ RECONNECTING
  Primary:   #fbbf24 (Amber 400)
  Secondary: #f59e0b (Amber 500)
  Gradient:  135deg, from amber-400 to amber-500
  Usage:     Attempting reconnection

⚠ SLOW
  Primary:   #fb923c (Orange 400)
  Secondary: #f97316 (Orange 500)
  Gradient:  135deg, from orange-400 to orange-500
  Usage:     Poor connection quality
```

## Animation Timeline

```
Recovery Animation Sequence:
━━━━━━━━━━━━━━━━━━━━━━━━━━

0ms:    Overlay appears (fadeIn)
        ░░░░░░░░░░░░░░░░░░░░░░░░░

300ms:  Content scales in (scaleIn)
        ░░░░┌──────────┐░░░░░░░░░
        ░░░░│          │░░░░░░░░░
        ░░░░│    ✓     │░░░░░░░░░
        ░░░░│          │░░░░░░░░░
        ░░░░└──────────┘░░░░░░░░░

800ms:  Checkmark draws (checkmarkDraw)
        ░░░░┌──────────┐░░░░░░░░░
        ░░░░│     ✓    │░░░░░░░░░
        ░░░░└──────────┘░░░░░░░░░

2000ms: Overlay fades out
        ░░░░░░░░░░░░░░░░░░░░░░░░░
```

## Badge State Indicators

```
Connection Badges:
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ ● Online     │ │ ● Offline    │ │ ● Reconnect  │ │ ● Slow       │
│              │ │              │ │              │ │              │
│   Green      │ │     Red      │ │    Yellow    │ │    Orange    │
│   Pulse      │ │   Static     │ │     Pulse    │ │     Pulse    │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

Sync Indicators:
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ ☁ Synced     │ │ ↻ Syncing    │ │ ⏸ Pending    │ │ ✕ Failed     │
│              │ │              │ │              │ │              │
│   Green      │ │     Blue     │ │    Yellow    │ │     Red      │
│   Static     │ │   Spinning   │ │   Static     │ │    Static    │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

## Pending Queue Layout

```
┌─────────────────────────────────────────────────────────┐
│  Pending Changes                                    3   │ ← Header with count
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📄 Message 1                    Waiting to sync       │ ← Queue item
│  📄 Message 2                    Waiting to sync       │
│  📄 Message 3                    Waiting to sync       │
│                                                         │
└─────────────────────────────────────────────────────────┘
     ↑        ↑                           ↑
    Icon    Title                    Status text
```

## Responsive Breakpoints

```
Desktop (> 768px):
┌────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────┐              │
│  │ Status Card  │  │  Badge   │              │
│  └──────────────┘  └──────────┘              │
│                                               │
│  [Badge] [Badge] [Badge] [Badge]             │
│  [Control] [Control] [Control] [Control]     │
└────────────────────────────────────────────────┘

Mobile (< 768px):
┌──────────────────────┐
│  ┌────────────────┐  │
│  │  Status Card   │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │     Badge      │  │
│  └────────────────┘  │
│                      │
│  [Badge]  [Badge]    │
│  [Badge]  [Badge]    │
│                      │
│  [Control]           │
│  [Control]           │
│  [Control]           │
│  [Control]           │
└──────────────────────┘
```

## Interaction States

```
Button Hover State:
┌──────────────┐       ┌──────────────┐
│   Normal     │  ──>  │   Hover      │
│              │       │   ▲ -4px     │
│   opacity: 1 │       │ opacity: 1   │
│   scale: 1   │       │ scale: 1     │
└──────────────┘       └──────────────┘
                        Shadow increases

Button Active State:
┌──────────────┐       ┌──────────────┐
│    Hover     │  ──>  │   Active     │
│   ▲ -4px     │       │   ▲ -2px     │
│              │       │              │
└──────────────┘       └──────────────┘

Button Disabled State:
┌──────────────┐
│   Disabled   │
│              │
│  opacity: 0.5│
│  cursor: no  │
└──────────────┘
```

## Network Stats Dashboard

```
┌─────────────────────────────────────────────────────┐
│            Network Statistics                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌──────┐│
│  │  ⚡       │ │  📶       │ │  🔄       │ │  📡  ││
│  │  Latency  │ │  Download │ │    RTT    │ │ Type ││
│  │   45ms    │ │  8.2 Mbps │ │   52ms    │ │  4G  ││
│  └───────────┘ └───────────┘ └───────────┘ └──────┘│
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Theme Variations

```
Light Theme:
  Background: rgba(255, 255, 255, 0.15)
  Border:     rgba(255, 255, 255, 0.2)
  Text:       #ffffff

Dark Theme:
  Background: rgba(0, 0, 0, 0.15)
  Border:     rgba(0, 0, 0, 0.2)
  Text:       #000000

Gradient Background:
  Light: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
  Dark:  linear-gradient(135deg, #1e293b 0%, #0f172a 100%)
```

## Accessibility Features

```
Focus Indicators:
┌──────────────┐
│   Button     │ ← 2px solid outline
│   (focused)  │   Color: primary
│              │   Offset: 2px
└──────────────┘

Screen Reader Text:
<span aria-label="Connection status: Online">
  <span aria-hidden="true">✓</span>
  Online
</span>

Keyboard Navigation:
Tab       → Next interactive element
Shift+Tab → Previous interactive element
Enter     → Activate button/control
Space     → Activate button/control
```

## Performance Optimization

```
CSS GPU Acceleration:
  transform: translateZ(0);
  will-change: transform;

Animation Performance:
  ✓ transform (GPU)
  ✓ opacity (GPU)
  ✗ width (CPU)
  ✗ height (CPU)

Debouncing:
  Network checks: 1000ms
  Status updates: 500ms
  Stat polling:   5000ms
```
