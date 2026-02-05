# Responsive Testing Tools - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Responsive Testing Page                      │
│                      /responsive-testing                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐     ┌──────────────┐
│  Components  │    │    Hooks     │     │  Utilities   │
└──────────────┘    └──────────────┘     └──────────────┘
```

## Component Hierarchy

```
ResponsiveTestingPage (page.tsx)
│
├── Header
│   ├── Title & Description
│   ├── Action Buttons (Lighthouse, A11y)
│   └── Device Type Tabs
│
├── Device Selection
│   ├── Mobile Devices (5)
│   ├── Tablet Devices (5)
│   ├── Desktop Devices (5)
│   └── Custom Viewport Input
│
├── Toolbar
│   ├── Orientation Toggle
│   ├── Scale Slider
│   ├── Touch Mode Toggle
│   ├── Visual Aid Toggles
│   │   ├── Rulers
│   │   ├── Grid
│   │   └── Breakpoints
│   └── Screenshot Button
│
├── Main Preview Section
│   ├── Device Frame
│   │   ├── Rulers (optional)
│   │   ├── Grid Overlay (optional)
│   │   ├── Breakpoint Lines (optional)
│   │   └── Content iFrame
│   └── Side-by-Side Comparison
│       └── Multiple Device Previews
│
└── Sidebar
    ├── Performance Metrics Panel
    │   ├── Web Vitals
    │   ├── System Metrics
    │   └── Trend Indicators
    │
    ├── Accessibility Panel
    │   ├── Issues List
    │   ├── Severity Indicators
    │   └── WCAG Levels
    │
    ├── Quick Actions Panel
    │   ├── Screenshot
    │   └── Open in New Tab
    │
    └── Breakpoints Reference
        └── Tailwind Sizes
```

## Component Architecture

```
┌────────────────────────────────────────────────────────┐
│                     Main Page                          │
│                    (page.tsx)                          │
│                                                        │
│  State Management:                                     │
│  • deviceType, selectedDevice                         │
│  • orientation, scale                                 │
│  • touchMode, showRulers, showGrid                    │
│  • comparisonMode, comparisonDevices                  │
│  • performanceMetrics, a11yIssues                     │
└────────────────────────────────────────────────────────┘
                         │
                         │ uses
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ DeviceFrame  │  │ViewportResizer│  │ Screenshot   │
│              │  │               │  │  Capture     │
│ • iPhone     │  │ • Drag Handle │  │              │
│ • iPad       │  │ • Min/Max Size│  │ • Format     │
│ • MacBook    │  │ • Dimension   │  │ • Quality    │
│ • iMac       │  │   Display     │  │ • Download   │
└──────────────┘  └──────────────┘  └──────────────┘
        │                                   │
        │ renders                           │
        ▼                                   ▼
┌──────────────────────────────┐  ┌─────────────────┐
│      Content iFrame          │  │   Canvas API    │
│                              │  │  (placeholder)  │
│  • Loads /chat or any route  │  └─────────────────┘
│  • Touch event simulation    │
│  • Visual feedback overlay   │
└──────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│                  PerformanceMonitor                    │
│                                                        │
│  • Real-time FPS measurement                          │
│  • Memory usage tracking                              │
│  • Web Vitals observation                             │
│  • Trend calculation                                  │
└────────────────────────────────────────────────────────┘
```

## Hook Architecture

```
┌────────────────────────────────────────────────────────┐
│                  Custom Hooks                          │
└────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┬──────────────┐
        │                │                │              │
        ▼                ▼                ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────┐
│useViewport   │  │useAccessibility│  │useTouch  │  │usePerf   │
│Size          │  │Check          │  │Simulation│  │Metrics   │
│              │  │               │  │          │  │          │
│• Width       │  │• Color        │  │• Touch   │  │• Web     │
│• Height      │  │  Contrast     │  │  Events  │  │  Vitals  │
│• Breakpoint  │  │• ARIA         │  │• Visual  │  │• FPS     │
│• Orientation │  │• Keyboard     │  │  Feedback│  │• Memory  │
│• Device Type │  │• Semantics    │  │• Toggle  │  │• Latency │
└──────────────┘  └──────────────┘  └──────────┘  └──────────┘
        │                  │               │              │
        │                  │               │              │
        ▼                  ▼               ▼              ▼
┌────────────────────────────────────────────────────────┐
│               Browser APIs                             │
│                                                        │
│ • ResizeObserver       • Performance API              │
│ • MediaQuery          • PerformanceObserver           │
│ • TouchEvent          • Canvas API                    │
│ • DOM APIs            • RequestAnimationFrame         │
└────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Interaction
        │
        ▼
┌────────────────────┐
│  Event Handler     │
│                    │
│ • onClick          │
│ • onChange         │
│ • onMouseDown      │
└────────────────────┘
        │
        ▼
┌────────────────────┐
│  State Update      │
│                    │
│ • useState         │
│ • useCallback      │
│ • useEffect        │
└────────────────────┘
        │
        ▼
┌────────────────────┐
│  Component         │
│  Re-render         │
└────────────────────┘
        │
        ├─────────────┬─────────────┬─────────────┐
        ▼             ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Preview  │  │ Toolbar  │  │ Sidebar  │  │ Visual   │
│ Update   │  │ Update   │  │ Update   │  │ Feedback │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

## Performance Monitoring Flow

```
┌────────────────────────────────────────────────────────┐
│              Performance Observation                   │
└────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Performance  │  │ Performance  │  │   RAF Loop   │
│   Observer   │  │     API      │  │              │
│              │  │              │  │              │
│ • LCP        │  │ • Navigation │  │ • FPS Count  │
│ • FID        │  │   Timing     │  │ • Frame Time │
│ • CLS        │  │ • Paint      │  │ • Smoothness │
│              │  │   Timing     │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │ Metrics State  │
                │                │
                │ • Current      │
                │ • History (20) │
                │ • Trends       │
                └────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │ Visual Display │
                │                │
                │ • Color Coded  │
                │ • Progress Bar │
                │ • Trend Icon   │
                └────────────────┘
```

## Accessibility Check Flow

```
┌────────────────────────────────────────────────────────┐
│              Accessibility Audit                       │
└────────────────────────────────────────────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │  DOM Traversal │
                │  querySelectorAll│
                └────────────────┘
                         │
        ┌────────────────┼────────────────┬──────────────┐
        │                │                │              │
        ▼                ▼                ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────┐
│   Contrast   │  │     ARIA     │  │Keyboard  │  │Semantics │
│    Check     │  │   Validation │  │ Access   │  │  Check   │
│              │  │              │  │          │  │          │
│• Foreground  │  │• Labels      │  │• tabIndex│  │• Headings│
│• Background  │  │• Attributes  │  │• Focus   │  │• Alt Text│
│• Ratio Calc  │  │• Empty Check │  │• Handlers│  │• Labels  │
└──────────────┘  └──────────────┘  └──────────┘  └──────────┘
        │                │                │              │
        └────────────────┼────────────────┼──────────────┘
                         │                │
                         ▼                ▼
                ┌────────────────┐  ┌─────────────┐
                │  Issue Array   │  │ Deduplication│
                │                │  │             │
                │ • Type         │  │ • By message│
                │ • Category     │  │ • By element│
                │ • Message      │  │             │
                │ • Element      │  └─────────────┘
                │ • WCAG Level   │
                │ • Impact       │
                └────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │ Display Panel  │
                │                │
                │ • Grouped      │
                │ • Sortable     │
                │ • Filterable   │
                └────────────────┘
```

## Touch Simulation Flow

```
┌────────────────────────────────────────────────────────┐
│              Touch Mode Enabled                        │
└────────────────────────────────────────────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │  Mouse Event   │
                │   Listener     │
                └────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  mousedown   │  │  mousemove   │  │   mouseup    │
└──────────────┘  └──────────────┘  └──────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │ TouchEvent     │
                │ Constructor    │
                │                │
                │ • identifier   │
                │ • clientX/Y    │
                │ • pageX/Y      │
                │ • force        │
                └────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │ dispatchEvent  │
                └────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │ Visual Feedback│
                │                │
                │ • Touch Point  │
                │ • Ripple Effect│
                │ • Fade Out     │
                └────────────────┘
```

## Screenshot Capture Flow

```
┌────────────────────────────────────────────────────────┐
│              Capture Screenshot                        │
└────────────────────────────────────────────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │  Get Element   │
                │   Reference    │
                └────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │ Create Canvas  │
                │                │
                │ • Width        │
                │ • Height       │
                │ • Context      │
                └────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │ Draw Content   │
                │ (html2canvas)  │
                │                │
                │ Currently:     │
                │ Placeholder    │
                └────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │ Convert Format │
                │                │
                │ • PNG          │
                │ • JPEG         │
                │ • WebP         │
                └────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │  Create Blob   │
                └────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │ Download File  │
                │                │
                │ • Filename     │
                │ • Timestamp    │
                │ • Device Name  │
                └────────────────┘
```

## State Management

```
┌────────────────────────────────────────────────────────┐
│                   Global State                         │
│                   (page.tsx)                           │
│                                                        │
│  Device Selection:                                     │
│  • deviceType: 'mobile' | 'tablet' | 'desktop'        │
│  • selectedDevice: { name, width, height, dpr }       │
│  • orientation: 'portrait' | 'landscape'              │
│                                                        │
│  Viewport:                                            │
│  • customViewport: { width, height }                  │
│  • scale: 0.25 - 1.0                                  │
│                                                        │
│  Visual Aids:                                         │
│  • showRulers: boolean                                │
│  • showGrid: boolean                                  │
│  • showBreakpoints: boolean                           │
│  • touchMode: boolean                                 │
│                                                        │
│  Comparison:                                          │
│  • comparisonMode: boolean                            │
│  • comparisonDevices: Device[]                        │
│                                                        │
│  Metrics:                                             │
│  • performanceMetrics: PerformanceMetric[]            │
│  • a11yIssues: AccessibilityIssue[]                   │
│  • showMetrics: boolean                               │
└────────────────────────────────────────────────────────┘
```

## Integration Points

```
┌────────────────────────────────────────────────────────┐
│                  Component Showcase                    │
└────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Homepage   │  │  Navigation  │  │Global Styles │
│              │  │              │  │              │
│ • Category   │  │ • Route      │  │ • Theme      │
│   Card       │  │   /responsive│  │ • Colors     │
│ • Count: 12  │  │   -testing   │  │ • Animations │
└──────────────┘  └──────────────┘  └──────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │ Responsive Testing Page│
            └────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │   Test Any Route       │
            │                        │
            │ • /chat (default)      │
            │ • /core-chat           │
            │ • /messages            │
            │ • /tools               │
            │ • ... any showcase page│
            └────────────────────────┘
```

## File Dependencies

```
page.tsx
├── React (useState, useEffect, useCallback, useRef)
├── lucide-react (Icons)
├── @clarity-chat/primitives (cn utility)
└── Components (local)

DeviceFrame.tsx
├── React (ReactNode)
└── @clarity-chat/primitives (cn)

ViewportResizer.tsx
├── React (useState, useCallback, useRef, useEffect)
└── @clarity-chat/primitives (cn)

ScreenshotCapture.tsx
├── React (useCallback, useRef, useState)
├── lucide-react (Icons)
└── @clarity-chat/primitives (cn)

PerformanceMonitor.tsx
├── React (useEffect, useState, useCallback)
├── lucide-react (Icons)
└── @clarity-chat/primitives (cn)

useViewportSize.ts
└── React (useState, useEffect)

useAccessibilityCheck.ts
└── React (useState, useCallback)

useTouchSimulation.ts
└── React (useEffect, useCallback, useState)

usePerformanceMetrics.ts
└── React (useState, useEffect, useCallback)
```

## Performance Considerations

```
┌────────────────────────────────────────────────────────┐
│                  Optimization Strategy                 │
└────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┬──────────────┐
        │                │                │              │
        ▼                ▼                ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────┐
│  Memoization │  │ Conditional  │  │Debouncing│  │   RAF    │
│              │  │  Rendering   │  │          │  │          │
│• useCallback │  │              │  │• Resize  │  │• FPS     │
│• useMemo     │  │• Visual Aids │  │• Input   │  │• Smooth  │
│• React.memo  │  │• Metrics     │  │• Events  │  │  Scroll  │
└──────────────┘  └──────────────┘  └──────────┘  └──────────┘
```

## Security Considerations

```
┌────────────────────────────────────────────────────────┐
│                  Security Measures                     │
└────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   iframe     │  │  Validation  │  │   CORS       │
│ Sandboxing   │  │              │  │  Handling    │
│              │  │• Viewport    │  │              │
│• Same-origin │  │  Limits      │  │• Cross-origin│
│• Restricted  │  │• Input       │  │  Restrictions│
│  Permissions │  │  Sanitization│  │• Fallbacks   │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

This architecture supports:
- ✅ Modular component design
- ✅ Separation of concerns
- ✅ Reusable hooks
- ✅ Efficient state management
- ✅ Performance optimization
- ✅ Security best practices
- ✅ Extensibility
- ✅ Maintainability
