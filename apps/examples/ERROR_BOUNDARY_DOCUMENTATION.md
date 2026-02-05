# ErrorBoundary Components Documentation

## Overview

Comprehensive ErrorBoundary components have been added to both showcase applications with glassmorphism styling, recovery options, and error reporting capabilities.

## Location

### Examples Showcase
- **Component**: `/apps/examples/examples-showcase/src/components/ErrorBoundary.tsx`
- **Styles**: `/apps/examples/examples-showcase/src/components/ErrorBoundary.css`
- **Demo**: `/apps/examples/examples-showcase/src/components/ErrorBoundaryDemo.tsx`
- **Existing Demo**: `/apps/examples/examples-showcase/src/demos/ErrorHandlingDemo.tsx`

### Enhanced UI/UX Showcase
- **Component**: `/apps/examples/enhanced-ui-ux-showcase/src/components/ErrorBoundary.tsx`
- **Demo**: `/apps/examples/enhanced-ui-ux-showcase/src/components/ErrorBoundaryDemo.tsx`

## Features

### 1. Error Catching
- Catches React component tree errors
- Captures error details and component stack
- Tracks error count for repeated failures
- Prevents app crashes

### 2. Glassmorphism Design
- **Examples Showcase**: CSS-based glassmorphism with backdrop blur
- **Enhanced UI/UX**: Tailwind + Framer Motion with aurora backgrounds
- Frosted glass effects with transparency
- Smooth animations and transitions
- Responsive design for all screen sizes

### 3. Recovery Options

#### Try Again
- Resets error state without page reload
- Allows component to remount
- Icon: Circular refresh arrow

#### Reload Page
- Full page refresh
- Clears all error state
- Icon: Reload symbol

#### Copy Error Details
- Copies error message, stack, and component stack to clipboard
- Useful for bug reports
- Icon: Copy/duplicate symbol

### 4. Error Reporting
- Optional error reporting integration
- Captures comprehensive error context:
  - Error message and stack trace
  - Component stack trace
  - Timestamp
  - User agent
  - Current URL
- Ready for integration with services like:
  - Sentry
  - LogRocket
  - Rollbar
  - Custom logging endpoints

### 5. Development Mode Features
- Expandable error stack viewer
- Component stack trace display
- Detailed debugging information
- Only visible in development environment

## Integration

### Root Level (App-wide)

Both apps are wrapped with ErrorBoundary at the root level in `main.tsx`:

```typescript
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      enableReporting={true}
      onError={(error, errorInfo) => {
        console.error('Application Error:', error)
        console.error('Error Info:', errorInfo)
      }}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
```

### Component Level

You can wrap individual components for isolated error boundaries:

```typescript
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Custom error handling
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### Custom Fallback

```typescript
<ErrorBoundary
  fallback={(error, resetError) => (
    <div>
      <h1>Custom Error UI</h1>
      <p>{error.message}</p>
      <button onClick={resetError}>Retry</button>
    </div>
  )}
>
  <YourComponent />
</ErrorBoundary>
```

## Props API

```typescript
interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, resetError: () => void) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  enableReporting?: boolean
}
```

### Props Description

- **children**: React components to wrap
- **fallback**: Optional custom error UI renderer
- **onError**: Optional error callback for custom handling
- **enableReporting**: Enable automatic error reporting (default: false)

## Error Demo Components

### ErrorBoundaryDemo (New)
Interactive demonstration with test scenarios:
- **Immediate Error**: Throws during render
- **Async Error**: Triggers after delay
- **Network Error**: Simulates API failure
- **Component Tree Error**: Error in nested components

Features:
- Live error triggering
- Visual error state display
- Recovery demonstration
- Multiple isolated error boundaries

### ErrorHandlingDemo (Existing)
Comprehensive error handling patterns:
- **Error Recovery Patterns**: Retry, fallback, graceful degradation
- **Retry Logic**: Exponential backoff with configurable parameters
- **Fallback Strategies**: Cache, default values, alternative APIs
- **Error Monitoring**: Real-time logging and metrics

## Styling

### Examples Showcase (CSS)
- Standalone CSS file with CSS variables
- Glassmorphism effects with backdrop-filter
- Responsive breakpoints
- Light/dark mode support via prefers-color-scheme
- Custom animations: fadeIn, slideUp, pulse

Key Classes:
- `.error-boundary-container`: Fixed overlay
- `.error-boundary-content`: Main glass card
- `.error-button-*`: Action button variants
- `.error-stack`: Collapsible stack viewer

### Enhanced UI/UX (Tailwind)
- Tailwind utility classes
- Framer Motion animations
- Aurora gradient backgrounds
- Dynamic component transitions
- Inline style tag for keyframes

Key Features:
- AnimatePresence for enter/exit
- Motion.div with spring animations
- Glassmorphic cards with bg-white/10
- Responsive grid layouts

## Error Reporting Integration

### Current Implementation
```typescript
reportError = async (error: Error, errorInfo: ErrorInfo) => {
  try {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    console.log('Error report:', errorReport)

    // TODO: Send to error tracking service
    // await fetch('/api/error-report', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport),
    // })
  } catch (reportingError) {
    console.error('Failed to report error:', reportingError)
  }
}
```

### Integration Examples

#### Sentry
```typescript
import * as Sentry from '@sentry/react'

<ErrorBoundary
  onError={(error, errorInfo) => {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      }
    })
  }}
>
  <App />
</ErrorBoundary>
```

#### LogRocket
```typescript
import LogRocket from 'logrocket'

<ErrorBoundary
  onError={(error, errorInfo) => {
    LogRocket.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack
      }
    })
  }}
>
  <App />
</ErrorBoundary>
```

## Best Practices

### 1. Granular Boundaries
- Wrap major feature sections individually
- Prevent entire app crashes
- Isolate critical vs non-critical features

### 2. Error Recovery
- Always provide "Try Again" option
- Clear error state before retry
- Consider exponential backoff for repeated failures

### 3. User Communication
- Clear, non-technical error messages
- Actionable recovery steps
- Links to support/documentation

### 4. Development vs Production
- Show detailed stacks in development
- Hide implementation details in production
- Log comprehensively for debugging

### 5. Error Reporting
- Enable in production environments
- Include user context (session ID, user ID)
- Implement rate limiting to prevent spam
- Sanitize sensitive information

## Testing

### Manual Testing
1. Navigate to "Error Demo" in the showcase
2. Click each error trigger button
3. Verify glassmorphism styling displays correctly
4. Test recovery options (Try Again, Reload, Copy)
5. Check console for error logs
6. In development, verify stack traces are visible

### Automated Testing
```typescript
import { render, screen } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

function ThrowError() {
  throw new Error('Test error')
}

test('catches and displays errors', () => {
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  )

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  expect(screen.getByText(/test error/i)).toBeInTheDocument()
})

test('resets error state on retry', () => {
  const { rerender } = render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  )

  const retryButton = screen.getByText(/try again/i)
  fireEvent.click(retryButton)

  // Error should be cleared
  expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
})
```

## Browser Support

### Glassmorphism Effects
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with -webkit- prefix)
- Fallback: Solid background for unsupported browsers

### Error Boundary
- All modern browsers supporting React 16.8+
- Class component required (no hooks version)
- componentDidCatch lifecycle required

## Accessibility

### WCAG Compliance
- Proper heading hierarchy
- Keyboard navigation support
- Focus management on error display
- ARIA labels for buttons
- Color contrast ratio > 4.5:1

### Screen Reader Support
- Error messages announced
- Action buttons labeled clearly
- Status indicators with text alternatives

## Performance

### Optimization
- Lazy load error tracking libraries
- Debounce error reporting
- Limit error log size
- Implement error deduplication

### Impact
- Minimal render overhead when no errors
- Glassmorphism backdrop-filter is GPU-accelerated
- Animations use transform/opacity for 60fps
- Error state stored in component (no Redux/Context needed)

## Future Enhancements

1. **Error Analytics Dashboard**
   - Aggregate error metrics
   - Visualize error trends
   - Track recovery success rates

2. **Automatic Recovery Strategies**
   - Circuit breaker pattern
   - Exponential backoff retry
   - Fallback component rendering

3. **Enhanced Reporting**
   - Screenshot capture on error
   - User session replay
   - Network request history

4. **Smart Error Messages**
   - Context-aware suggestions
   - Related documentation links
   - Common fix recommendations

## Navigation

Both showcase apps now include an "Error Demo" navigation button to access the interactive error boundary demonstrations. The demos are fully integrated with the existing design system and theme providers.

## Support

For issues or questions:
- GitHub Issues: https://github.com/christireid/Clarity-ai-chat-components/issues
- Documentation: Check inline code comments
- Examples: See ErrorBoundaryDemo components
