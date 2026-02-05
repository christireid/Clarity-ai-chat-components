# Component Comparison Mode

## Overview

The Component Comparison Mode is a powerful feature that allows developers to compare different component configurations, themes, and performance characteristics side-by-side. This tool is essential for making informed decisions about component selection and optimization.

## Features

### 1. Side-by-Side View
- **Split-pane layout** with adjustable divider
- **Live component previews** for both selections
- **Real-time updates** when changing configurations
- **Responsive design** that works on all screen sizes

### 2. Compare Props
- **Property comparison table** showing all available props
- **Type information** with TypeScript signatures
- **Default values** clearly displayed
- **Current values** highlighted with color coding
- **Value differences** automatically detected
- **Copy-to-clipboard** functionality for prop signatures

### 3. Compare Themes
- **Visual theme comparison** with overlay mode
- **Opacity slider** for overlay adjustment
- **Theme property highlighting**
- **CSS variable differences** shown in diff view

### 4. Compare Performance
- **Render time** measurements (ms)
- **Memory usage** tracking (MB)
- **Bundle size** comparison (KB)
- **Re-render count** monitoring
- **Performance summary** with percentage improvements
- **Visual indicators** for better/worse performance

### 5. Diff Highlighting
- **Property-level diffs** with color coding
  - 🟢 Green: Added properties
  - 🔴 Red: Removed properties
  - 🟡 Yellow: Changed properties
  - ⚪ Gray: Unchanged properties
- **Visual diff view** showing component changes
- **Detailed diff table** with before/after values

### 6. Screenshot Comparison
- **Capture screenshots** of both components
- **Overlay comparison** mode
- **Visual difference detection**
- **Export screenshots** for documentation

### 7. Export Comparison
- **JSON export** with full comparison data
- **Timestamp tracking** for comparison history
- **Configuration export** for reproduction
- **Shareable format** for team collaboration

### 8. Share Comparison URL
- **URL-based state** for easy sharing
- **Deep linking** to specific comparisons
- **Query parameter encoding** for component selections
- **Shareable links** that work across devices

## Usage

### Basic Comparison

1. Navigate to `/compare` in the showcase
2. Select Component A from the left dropdown
3. Select Component B from the right dropdown
4. View the comparison in your preferred mode

### Comparison Modes

#### Split View
```tsx
// Adjustable split-pane with draggable divider
<SplitView
  leftComponent="chat-basic"
  rightComponent="chat-streaming"
/>
```

#### Overlay View
```tsx
// Overlay components with opacity control
<OverlayView
  leftComponent="button-primary"
  rightComponent="button-secondary"
  opacity={50}
/>
```

#### Diff View
```tsx
// Show property differences
<DiffView
  leftComponent="message-bubble"
  rightComponent="message-streaming"
/>
```

### Performance Metrics

Performance metrics are automatically measured and displayed when enabled:

```tsx
const metrics = {
  renderTime: 15.3,    // milliseconds
  memoryUsage: 2.4,    // megabytes
  bundleSize: 23.5,    // kilobytes
  reRenders: 2         // count
}
```

### Props Comparison

The props comparison table shows:

- Property name
- Type signature
- Required/Optional status
- Default value
- Current value for Component A
- Current value for Component B
- Differences highlighted

### Exporting Data

#### Export as JSON
```typescript
const comparisonData = {
  comparison: {
    left: "component-a-id",
    right: "component-b-id",
    mode: "side-by-side",
    timestamp: "2026-02-04T18:00:00.000Z"
  },
  metrics: { /* performance data */ },
  props: { /* property comparison */ }
}
```

#### Share URL
```
https://showcase.clarity-chat.com/compare?
  left=chat-basic&
  right=chat-streaming&
  mode=side-by-side
```

## Component Architecture

### File Structure
```
components/comparison/
├── ComparisonView.tsx           # Main comparison container
├── ComponentSelector.tsx        # Component selection dropdown
├── ComparisonToolbar.tsx        # Mode switcher and actions
├── SplitView.tsx                # Side-by-side layout
├── OverlayView.tsx              # Overlay comparison
├── DiffView.tsx                 # Difference analysis
├── PerformanceMetrics.tsx       # Performance comparison
├── PropsComparison.tsx          # Props table and analysis
└── ComponentPreview.tsx         # Component renderer
```

### Key Components

#### ComparisonView
Main container that orchestrates all comparison features.

**Props:**
- `leftComponent: string` - ID of left component
- `rightComponent: string` - ID of right component
- `mode: 'side-by-side' | 'overlay' | 'diff'` - Comparison mode
- `showPerformance: boolean` - Show performance metrics
- `showProps: boolean` - Show props comparison

#### ComponentSelector
Searchable dropdown for selecting components to compare.

**Features:**
- Category-based grouping
- Search functionality
- Keyboard navigation
- Prevents selecting same component twice

#### ComparisonToolbar
Action bar for controlling the comparison view.

**Actions:**
- Switch comparison modes
- Toggle performance metrics
- Toggle props comparison
- Take screenshot
- Share URL
- Export data

### Performance Measurement

The comparison mode measures real performance metrics:

```typescript
interface PerformanceMetrics {
  renderTime: number      // Time to render component
  memoryUsage: number     // RAM consumption
  bundleSize: number      // JavaScript bundle size
  reRenders: number       // Number of re-renders
}
```

### Theme Comparison

Theme differences are detected and highlighted:

```typescript
interface ThemeDiff {
  property: string
  leftValue: string
  rightValue: string
  isDifferent: boolean
}
```

## Implementation Details

### State Management

The comparison mode uses React hooks for state management:

```tsx
const [leftComponent, setLeftComponent] = useState<string | null>(null)
const [rightComponent, setRightComponent] = useState<string | null>(null)
const [comparisonMode, setComparisonMode] = useState<'side-by-side' | 'overlay' | 'diff'>('side-by-side')
```

### URL Synchronization

Comparison state is synchronized with URL parameters for sharing:

```typescript
const shareUrl = `${window.location.origin}/compare?` +
  `left=${leftComponent}&` +
  `right=${rightComponent}&` +
  `mode=${comparisonMode}`
```

### Screenshot Capture

Screenshots can be captured programmatically:

```typescript
const captureScreenshot = async () => {
  // Implementation uses html2canvas or similar
  const canvas = await html2canvas(viewRef.current)
  const dataUrl = canvas.toDataURL('image/png')
  return dataUrl
}
```

## Accessibility

- **Keyboard navigation** fully supported
- **Screen reader announcements** for state changes
- **ARIA labels** on all interactive elements
- **Focus management** for dropdowns and modals
- **Color contrast** meets WCAG AA standards

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Best Practices

1. **Compare similar components** for meaningful insights
2. **Use performance metrics** to guide optimization decisions
3. **Share comparisons** with team members via URL
4. **Export data** for documentation and reporting
5. **Test different themes** to ensure consistent appearance

## Future Enhancements

- Visual regression testing
- Historical comparison tracking
- Automated performance benchmarking
- A/B test result integration
- Custom metric definitions
- Batch comparison mode
- Component variant comparison
- Accessibility audit comparison

## Related Documentation

- [Component Gallery](/gallery)
- [Performance Monitoring](/performance)
- [Theme Customization](/theme)
- [Component Props Reference](/docs/api-reference)

## Contributing

To add new comparison features:

1. Create a new view component in `components/comparison/`
2. Add the mode to `ComparisonToolbar`
3. Integrate with `ComparisonView`
4. Update this documentation
5. Add tests for the new feature

## License

Part of the Clarity Chat Components showcase application.
