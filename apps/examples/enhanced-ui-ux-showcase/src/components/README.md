# ErrorBoundary Component (Enhanced UI/UX)

## Overview

A beautiful, animated ErrorBoundary component with glassmorphism styling, aurora gradients, and Framer Motion animations.

## Quick Start

```tsx
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary enableReporting={true}>
      <YourApp />
    </ErrorBoundary>
  )
}
```

## Features

✨ Glassmorphism with aurora gradients
🎭 Framer Motion animations
🔄 Multiple recovery options
📊 Error reporting integration
🎨 Tailwind CSS styling
📱 Fully responsive
🌙 Beautiful UI in all lighting conditions
♿ Accessible design

## Tech Stack

- **React**: Class component (required for error boundaries)
- **Framer Motion**: Smooth animations and transitions
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Full type safety

## Props

```typescript
interface Props {
  children: ReactNode
  fallback?: (error: Error, resetError: () => void) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  enableReporting?: boolean
}
```

## Visual Features

### Aurora Background
```tsx
<div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
  <div
    className="absolute inset-0 opacity-30"
    style={{
      background: 'linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c)',
      backgroundSize: '400% 400%',
      animation: 'aurora 15s ease infinite',
    }}
  />
</div>
```

### Glassmorphic Card
```tsx
<div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl">
  {/* Error content */}
</div>
```

### Animated Error Icon
```tsx
<motion.div
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
>
  {/* Icon */}
</motion.div>
```

## Usage Examples

### Basic Usage
```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### With Error Tracking
```tsx
<ErrorBoundary
  enableReporting={true}
  onError={(error, errorInfo) => {
    // Send to Sentry
    Sentry.captureException(error, {
      contexts: { react: errorInfo }
    })
  }}
>
  <App />
</ErrorBoundary>
```

### Custom Fallback
```tsx
<ErrorBoundary
  fallback={(error, resetError) => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1>Oops!</h1>
        <p>{error.message}</p>
        <button onClick={resetError}>Try Again</button>
      </div>
    </div>
  )}
>
  <App />
</ErrorBoundary>
```

### Multiple Boundaries
```tsx
function App() {
  return (
    <ErrorBoundary> {/* App-level */}
      <Header />
      <ErrorBoundary> {/* Feature-level */}
        <CriticalFeature />
      </ErrorBoundary>
      <ErrorBoundary>
        <OptionalFeature />
      </ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  )
}
```

## Animation Variants

### Entry Animation
```typescript
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
```

### Card Animation
```typescript
initial={{ scale: 0.9, y: 20 }}
animate={{ scale: 1, y: 0 }}
transition={{ type: 'spring', duration: 0.5 }}
```

### Icon Animation
```typescript
initial={{ scale: 0, rotate: -180 }}
animate={{ scale: 1, rotate: 0 }}
transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
```

### Pulse Effect
```typescript
animate={{ scale: [1, 1.2, 1] }}
transition={{ duration: 2, repeat: Infinity }}
```

## Styling Guide

### Color Palette
```css
/* Primary Error */
from-red-500 to-orange-500

/* Aurora Gradients */
from-purple-500 to-pink-500
from-blue-500 to-cyan-500
from-green-500 to-emerald-500

/* Glass Effects */
bg-white/10 backdrop-blur-2xl
border border-white/20
```

### Key Tailwind Classes

#### Glass Cards
```tsx
className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl"
```

#### Gradient Buttons
```tsx
className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
```

#### Aurora Background
```tsx
className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
```

## Recovery Actions

### 1. Try Again
```tsx
<button onClick={resetError}>
  <RefreshIcon />
  Try Again
</button>
```
Resets error state, allowing component to remount.

### 2. Reload Page
```tsx
<button onClick={() => window.location.reload()}>
  <ReloadIcon />
  Reload
</button>
```
Performs full page refresh.

### 3. Copy Details
```tsx
<button onClick={copyErrorDetails}>
  <CopyIcon />
  Copy Details
</button>
```
Copies error info to clipboard.

## Error Reporting

### Setup
```typescript
// config/errorReporting.ts
export const reportError = async (
  error: Error,
  errorInfo: ErrorInfo
) => {
  const errorReport = {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  }

  // Send to service
  await fetch('/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(errorReport),
  })
}
```

### Integration
```tsx
import { reportError } from './config/errorReporting'

<ErrorBoundary
  enableReporting={true}
  onError={reportError}
>
  <App />
</ErrorBoundary>
```

## Demo Component

The `ErrorBoundaryDemo.tsx` showcases:

1. **Immediate Error**: Throws during render
2. **Async Error**: Triggers after delay
3. **Network Error**: Simulates API failure
4. **Component Tree Error**: Deep nested error

```tsx
<ErrorBoundaryDemo />
```

## Testing

### Component Test
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

const ThrowError = () => {
  throw new Error('Test error')
}

test('displays error UI', () => {
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  )

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  expect(screen.getByText(/test error/i)).toBeInTheDocument()
})

test('resets on retry', () => {
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  )

  const retryButton = screen.getByText(/try again/i)
  fireEvent.click(retryButton)

  // Should clear error
  expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
})
```

### Animation Test
```typescript
test('animates error display', async () => {
  const { container } = render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  )

  const errorCard = container.querySelector('.bg-white\\/10')
  expect(errorCard).toHaveClass('rounded-3xl')

  // Wait for animation
  await waitFor(() => {
    expect(errorCard).toHaveStyle({
      opacity: '1',
    })
  })
})
```

## Performance

### Optimization Tips

1. **Lazy Load Error Tracking**
```typescript
const [errorTracking, setErrorTracking] = useState(null)

useEffect(() => {
  import('./errorTracking').then(module => {
    setErrorTracking(module.default)
  })
}, [])
```

2. **Debounce Error Reporting**
```typescript
const debouncedReport = debounce(reportError, 1000)
```

3. **Limit Animation Complexity**
```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

const animationDuration = prefersReducedMotion ? 0 : 0.5
```

## Accessibility

### WCAG Compliance
- ✅ Color contrast ratio > 4.5:1
- ✅ Keyboard navigation
- ✅ Screen reader friendly
- ✅ Focus management
- ✅ ARIA labels

### Implementation
```tsx
<button
  aria-label="Try again to recover from error"
  onClick={resetError}
>
  Try Again
</button>
```

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Error Boundary | ✅ | ✅ | ✅ | ✅ |
| Glassmorphism | ✅ | ✅ | ✅ | ✅ |
| Framer Motion | ✅ | ✅ | ✅ | ✅ |
| Backdrop Filter | ✅ | ✅ | ✅ | ✅ |

## Best Practices

### 1. Placement
```tsx
// ✅ Good: Root level
<ErrorBoundary>
  <App />
</ErrorBoundary>

// ✅ Better: Multiple levels
<ErrorBoundary>
  <ErrorBoundary>
    <CriticalFeature />
  </ErrorBoundary>
  <ErrorBoundary>
    <NonCriticalFeature />
  </ErrorBoundary>
</ErrorBoundary>
```

### 2. Error Messages
```tsx
// ❌ Bad: Technical jargon
"TypeError: Cannot read property 'map' of undefined"

// ✅ Good: User-friendly
"We encountered an unexpected error. Your data is safe."
```

### 3. Recovery Options
```tsx
// ✅ Always provide multiple options
<button onClick={resetError}>Try Again</button>
<button onClick={reload}>Reload Page</button>
<button onClick={copyDetails}>Copy Error</button>
```

### 4. Error Context
```tsx
// ✅ Capture context for debugging
onError={(error, errorInfo) => {
  reportError({
    error,
    errorInfo,
    user: getCurrentUser(),
    route: window.location.pathname,
    timestamp: Date.now(),
  })
}}
```

## Troubleshooting

### Animations Not Working
Check Framer Motion installation:
```bash
npm install framer-motion
```

### Tailwind Classes Not Applied
Ensure Tailwind is configured:
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // ...
}
```

### Backdrop Blur Not Visible
Check browser support and add fallback:
```tsx
className="backdrop-blur-2xl bg-white/10 supports-[backdrop-filter]:bg-white/10"
```

## Future Enhancements

- [ ] Screenshot capture on error
- [ ] Session replay integration
- [ ] Smart error suggestions
- [ ] Automatic recovery strategies
- [ ] Error analytics dashboard
- [ ] A/B testing recovery methods

## License

MIT - See LICENSE file for details.
