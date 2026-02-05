# Responsive Design Testing Tools

Comprehensive testing tools for validating component behavior across devices, viewports, and accessibility standards.

## Features

### 1. Device Preview Frames
- **iPhone Models**: SE, 12/13, 14 Pro Max
- **iPad Models**: Mini, Air, Pro 11", Pro 12.9"
- **Desktop**: Various resolutions from 1366px to 3440px ultra-wide
- **Custom Viewports**: Define any width/height combination
- **Device Frames**: Realistic device bezels and notches

### 2. Viewport Controls
- **Orientation Toggle**: Switch between portrait and landscape
- **Scale Control**: Zoom from 25% to 100%
- **Custom Dimensions**: Set precise pixel dimensions
- **Breakpoint Indicators**: Visual markers at Tailwind breakpoints

### 3. Touch Mode Simulation
- **Touch Events**: Convert mouse events to touch events
- **Visual Feedback**: Show touch points on interaction
- **Gesture Support**: Simulates mobile touch interactions
- **Hover State Testing**: Test touch-first interactions

### 4. Visual Aids
- **Rulers**: Pixel measurements on X and Y axes
- **Grid Overlay**: 50px grid for alignment checking
- **Breakpoint Lines**: Visual indicators at responsive breakpoints
- **Dimension Display**: Real-time viewport size display

### 5. Screenshot Capture
- **Multiple Formats**: PNG, JPEG, WebP support
- **Quality Control**: Adjustable compression quality
- **Device-Specific**: Captures with device context in filename
- **Timestamp**: Automatic timestamping

### 6. Side-by-Side Comparison
- **Multi-Device View**: Compare up to 3 devices simultaneously
- **Synchronized Scrolling**: Optional scroll synchronization
- **Easy Management**: Add/remove devices from comparison
- **Responsive Grid**: Adapts to screen size

### 7. Accessibility Testing
- **Color Contrast**: Checks WCAG AA/AAA compliance
- **ARIA Validation**: Validates ARIA attributes and labels
- **Keyboard Navigation**: Verifies tab order and focus
- **Semantic HTML**: Checks proper heading hierarchy
- **Focus Indicators**: Ensures visible focus states
- **Screen Reader**: Tests screen reader compatibility

### 8. Performance Metrics
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)
- **Additional Metrics**:
  - FCP (First Contentful Paint)
  - TTFB (Time to First Byte)
  - TTI (Time to Interactive)
- **Real-time Monitoring**:
  - FPS (Frames Per Second)
  - Memory Usage
  - Network Latency
- **Lighthouse Integration**: Simulated Lighthouse audit

## Usage

### Basic Testing

```tsx
import ResponsiveTestingPage from './responsive-testing/page'

// Renders the full testing interface
<ResponsiveTestingPage />
```

### Using Individual Components

```tsx
import {
  DeviceFrame,
  ViewportResizer,
  ScreenshotCapture,
  PerformanceMonitor
} from '@/components/responsive-testing'

// Device frame with iPhone
<DeviceFrame device="iphone" width={390} height={844}>
  <YourComponent />
</DeviceFrame>

// Resizable viewport
<ViewportResizer
  initialWidth={1920}
  initialHeight={1080}
  onResize={(width, height) => console.log(width, height)}
>
  <YourComponent />
</ViewportResizer>

// Screenshot capture
<ScreenshotCapture
  targetRef={componentRef}
  fileName="my-component"
  format="png"
/>

// Performance monitor
<PerformanceMonitor showDetailed />
```

### Using Hooks

```tsx
import {
  useViewportSize,
  useAccessibilityCheck,
  useTouchSimulation,
  usePerformanceMetrics
} from '@/components/responsive-testing'

function MyComponent() {
  // Get current viewport info
  const { width, breakpoint, deviceType } = useViewportSize()

  // Run accessibility checks
  const { issues, runCheck } = useAccessibilityCheck()

  // Enable touch simulation
  const { touchPoints } = useTouchSimulation({ enabled: true })

  // Monitor performance
  const { metrics, startMonitoring } = usePerformanceMetrics()

  return (
    <div>
      <p>Current breakpoint: {breakpoint}</p>
      <button onClick={() => runCheck()}>Check Accessibility</button>
      <p>Issues found: {issues.length}</p>
    </div>
  )
}
```

## Component API

### DeviceFrame

Props:
- `device`: 'iphone' | 'ipad' | 'macbook' | 'imac' | 'none'
- `width`: number - Content width in pixels
- `height`: number - Content height in pixels
- `children`: ReactNode - Content to display
- `className?`: string - Additional CSS classes

### ViewportResizer

Props:
- `initialWidth`: number - Starting width
- `initialHeight`: number - Starting height
- `minWidth?`: number - Minimum width (default: 320)
- `minHeight?`: number - Minimum height (default: 568)
- `maxWidth?`: number - Maximum width (default: 3840)
- `maxHeight?`: number - Maximum height (default: 2160)
- `onResize?`: (width: number, height: number) => void
- `children`: ReactNode
- `className?`: string

### ScreenshotCapture

Props:
- `targetRef`: RefObject<HTMLElement> - Element to capture
- `fileName?`: string - Output filename (default: 'screenshot')
- `format?`: 'png' | 'jpeg' | 'webp' (default: 'png')
- `quality?`: number - 0-1 for JPEG/WebP (default: 0.95)
- `className?`: string

### PerformanceMonitor

Props:
- `className?`: string
- `showDetailed?`: boolean - Show full metrics panel

## Hook APIs

### useViewportSize()

Returns:
```typescript
{
  width: number
  height: number
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  orientation: 'portrait' | 'landscape'
  deviceType: 'mobile' | 'tablet' | 'desktop'
}
```

### useAccessibilityCheck()

Returns:
```typescript
{
  issues: AccessibilityIssue[]
  isChecking: boolean
  runCheck: (container?: HTMLElement) => AccessibilityIssue[]
  clearIssues: () => void
}
```

### useTouchSimulation(options)

Options:
- `enabled`: boolean - Enable touch simulation
- `feedbackDuration?`: number - Visual feedback duration (ms)
- `showVisualFeedback?`: boolean - Show touch points

Returns:
```typescript
{
  touchPoints: Array<{ id: string; x: number; y: number }>
}
```

### usePerformanceMetrics()

Returns:
```typescript
{
  metrics: Partial<PerformanceMetrics>
  isMonitoring: boolean
  startMonitoring: () => void
  stopMonitoring: () => void
  getScore: (metric: keyof WebVitals, value: number) => number
}
```

## Keyboard Shortcuts

- `Ctrl/Cmd + R`: Toggle rulers
- `Ctrl/Cmd + G`: Toggle grid
- `Ctrl/Cmd + B`: Toggle breakpoints
- `Ctrl/Cmd + S`: Capture screenshot
- `Ctrl/Cmd + O`: Toggle orientation
- `Ctrl/Cmd + T`: Toggle touch mode

## Performance Thresholds

### Core Web Vitals

**LCP (Largest Contentful Paint)**
- Good: ≤ 2.5s
- Needs Improvement: ≤ 4.0s
- Poor: > 4.0s

**FID (First Input Delay)**
- Good: ≤ 100ms
- Needs Improvement: ≤ 300ms
- Poor: > 300ms

**CLS (Cumulative Layout Shift)**
- Good: ≤ 0.1
- Needs Improvement: ≤ 0.25
- Poor: > 0.25

## Accessibility Checks

### Categories

1. **Color Contrast**: WCAG AA (4.5:1) and AAA (7:1) ratios
2. **ARIA**: Valid attributes, required labels
3. **Keyboard**: Tab order, focus management
4. **Semantics**: Proper HTML structure, heading hierarchy
5. **Focus**: Visible focus indicators

### Issue Severity

- **Critical**: Blocks users completely
- **Serious**: Major barriers to access
- **Moderate**: Some users affected
- **Minor**: Edge case issues

## Best Practices

### Testing Workflow

1. **Start with Mobile**: Test mobile-first designs
2. **Check Breakpoints**: Verify behavior at each breakpoint
3. **Test Interactions**: Enable touch mode for mobile testing
4. **Run Accessibility**: Check for A11y issues early
5. **Monitor Performance**: Keep eye on Web Vitals
6. **Compare Devices**: Use side-by-side for layout issues

### Performance Testing

1. **Baseline**: Establish performance baseline
2. **Monitor**: Track metrics during development
3. **Optimize**: Address issues as they appear
4. **Validate**: Verify improvements with Lighthouse

### Accessibility Testing

1. **Automated**: Run automated checks regularly
2. **Manual**: Test keyboard navigation manually
3. **Screen Reader**: Test with actual screen readers
4. **Color**: Check contrast in both themes
5. **Focus**: Verify all interactive elements

## Browser Support

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support (some Web Vitals limitations)
- **Edge**: Full support

## Implementation Notes

### Real Screenshot Capture

For production use, integrate a proper screenshot library:

```bash
npm install html2canvas
```

```tsx
import html2canvas from 'html2canvas'

const captureScreenshot = async () => {
  const canvas = await html2canvas(element)
  const blob = await canvas.toBlob()
  // Download blob
}
```

### Real Lighthouse Integration

For actual Lighthouse audits:

```bash
npm install lighthouse
```

```tsx
import lighthouse from 'lighthouse'

const runAudit = async () => {
  const result = await lighthouse(url, options)
  // Process results
}
```

## Future Enhancements

- [ ] Network throttling simulation
- [ ] CPU throttling controls
- [ ] Browser DevTools integration
- [ ] Test recording and playback
- [ ] Automated screenshot comparison
- [ ] CI/CD integration
- [ ] Visual regression testing
- [ ] Multi-browser testing
- [ ] Real device testing API

## Related Documentation

- [Tailwind Breakpoints](../docs/tailwind-breakpoints.md)
- [Accessibility Guidelines](../docs/accessibility.md)
- [Performance Optimization](../docs/performance.md)
- [Testing Best Practices](../docs/testing.md)
