import type { ComponentDoc } from '@/components/doc-panel'

export const feedbackStatusDocs: Record<string, ComponentDoc | ComponentDoc[]> =
  {
    'Toast Notifications': [
      {
        name: 'ClarityToaster',
        description:
          'Sonner-powered toast notification container. Add once at the root of your app to enable the toast API. Provides rich color themes, swipe-to-dismiss, configurable positioning, and auto-dismiss with customizable duration.',
        importPath: '@clarity-chat/react',
        usageCode: `// In your root layout
import { ClarityToaster } from '@clarity-chat/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ClarityToaster position="bottom-right" richColors />
      </body>
    </html>
  )
}`,
        props: [
          {
            name: 'position',
            type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
            default: '"bottom-right"',
            description: 'Position of the toasts on screen.',
            commonlyUsed: true,
          },
          {
            name: 'expand',
            type: 'boolean',
            default: 'false',
            description:
              'Whether to expand toasts by default, showing all visible toasts at full height.',
          },
          {
            name: 'richColors',
            type: 'boolean',
            default: 'true',
            description:
              'Whether toasts use rich, vibrant colors for each toast type (success, error, etc.).',
            commonlyUsed: true,
          },
          {
            name: 'closeButton',
            type: 'boolean',
            default: 'true',
            description: 'Whether to show a close button on each toast.',
            commonlyUsed: true,
          },
          {
            name: 'theme',
            type: "'light' | 'dark' | 'system'",
            default: '"system"',
            description:
              'Color theme for toasts. "system" follows the OS/browser preference.',
            commonlyUsed: true,
          },
          {
            name: 'className',
            type: 'string',
            description:
              'Custom CSS class name applied to the toaster container.',
          },
          {
            name: 'duration',
            type: 'number',
            default: '5000',
            description:
              'Default auto-dismiss duration in milliseconds for all toasts.',
            commonlyUsed: true,
          },
          {
            name: 'gap',
            type: 'number',
            default: '8',
            description: 'Gap between stacked toasts in pixels.',
          },
          {
            name: 'offset',
            type: 'number | string',
            default: '16',
            description: 'Offset from the edge of the viewport in pixels.',
          },
          {
            name: 'swipeToDismiss',
            type: 'boolean',
            default: 'true',
            description:
              'Whether toasts can be swiped/dragged to dismiss on touch devices.',
          },
          {
            name: 'toasterProps',
            type: 'Omit<ToasterProps, "position" | "expand" | "richColors" | "closeButton" | "theme">',
            description:
              'Additional Sonner ToasterProps for advanced customization beyond the wrapped props.',
          },
        ],
        notes: [
          'Only one ClarityToaster should be rendered in the application, typically in the root layout.',
          'Use the toast API (toast.success, toast.error, etc.) to trigger notifications from anywhere in your app.',
          'Powered by the Sonner library for production-grade animations and accessibility.',
        ],
      },
      {
        name: 'toast',
        description:
          'Imperative toast API for triggering notifications from anywhere in your application. Supports success, error, info, warning, loading, promise-based, and custom JSX toasts.',
        importPath: '@clarity-chat/react',
        importName: 'toast',
        usageCode: `import { toast } from '@clarity-chat/react'

// Simple usage
toast.success('File uploaded successfully')
toast.error('Failed to save changes')
toast.info('Processing your request...')
toast.warning('Your session will expire soon')

// With title and options
toast.success('File uploaded', { title: 'Success' })

// With action button
toast.error('Failed to save', {
  action: {
    label: 'Retry',
    onClick: () => saveAgain(),
  },
})

// Promise toast (loading -> success/error)
toast.promise(saveData(), {
  loading: 'Saving...',
  success: 'Data saved!',
  error: 'Failed to save',
})

// Dismiss
toast.dismiss()       // dismiss all
toast.dismiss(toastId) // dismiss specific`,
        props: [
          {
            name: 'toast.success',
            type: '(message: string, options?: ToastOptions) => string | number',
            description: 'Show a success toast with a green checkmark icon.',
            commonlyUsed: true,
          },
          {
            name: 'toast.error',
            type: '(message: string, options?: ToastOptions) => string | number',
            description: 'Show an error toast with a red X icon.',
            commonlyUsed: true,
          },
          {
            name: 'toast.info',
            type: '(message: string, options?: ToastOptions) => string | number',
            description: 'Show an informational toast with a blue info icon.',
            commonlyUsed: true,
          },
          {
            name: 'toast.warning',
            type: '(message: string, options?: ToastOptions) => string | number',
            description: 'Show a warning toast with a yellow warning icon.',
            commonlyUsed: true,
          },
          {
            name: 'toast.loading',
            type: '(message: string, options?: Omit<ToastOptions, "duration">) => string | number',
            description:
              'Show a persistent loading toast with a spinner. Must be manually dismissed.',
          },
          {
            name: 'toast.promise',
            type: '<T>(promise: Promise<T>, options: PromiseToastOptions<T>) => string | number',
            description:
              'Show a toast that automatically transitions from loading to success or error based on the promise result.',
            commonlyUsed: true,
          },
          {
            name: 'toast.custom',
            type: '(content: ReactElement, options?: Omit<ToastOptions, "title">) => string | number',
            description:
              'Show a toast with custom JSX content for fully custom layouts.',
          },
          {
            name: 'toast.message',
            type: '(message: string, options?: ToastOptions) => string | number',
            description: 'Show a neutral toast without any type icon.',
          },
          {
            name: 'toast.dismiss',
            type: '(id?: string | number) => void',
            description:
              'Dismiss a specific toast by ID or all toasts when called without arguments.',
          },
        ],
        notes: [
          'Requires a ClarityToaster component to be mounted in the component tree.',
          'ToastOptions supports: title, duration (0 = persistent), action ({ label, onClick }), cancel ({ label, onClick? }), id (for deduplication), onDismiss, and onAutoClose callbacks.',
          'PromiseToastOptions requires loading, success, and error strings (success and error can also be functions receiving the result/error).',
          'Returns a toast ID that can be passed to toast.dismiss() for programmatic dismissal.',
        ],
      },
    ],

    'Network Status': [
      {
        name: 'NetworkStatus',
        description:
          'Fixed-position network connectivity indicator with auto-detection. Monitors connection quality via periodic ping checks, reports latency and downlink speed, and uses the Network Information API when available. Displays a colored dot with label in a floating card.',
        importPath: '@clarity-chat/react',
        usageCode: `import { NetworkStatus } from '@clarity-chat/react'

// Basic auto-detection
<NetworkStatus />

// Custom position with details
<NetworkStatus
  position="bottom-right"
  showDetails
  onStatusChange={(status) => {
    if (status === 'offline') pauseStreaming()
  }}
/>

// Custom ping configuration
<NetworkStatus
  pingEndpoint="/api/health"
  pingInterval={10000}
  slowThreshold={500}
/>

// Controlled status
<NetworkStatus
  status={status}
  show={status !== 'online'}
/>`,
        props: [
          {
            name: 'status',
            type: "'online' | 'offline' | 'slow' | 'unstable'",
            description:
              'Externally controlled connection status. When omitted, status is auto-detected via ping checks and browser APIs.',
            commonlyUsed: true,
          },
          {
            name: 'show',
            type: 'boolean',
            default: 'true',
            description: 'Whether to show the status indicator.',
            commonlyUsed: true,
          },
          {
            name: 'position',
            type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
            default: '"top-right"',
            description: 'Fixed position of the indicator on the viewport.',
            commonlyUsed: true,
          },
          {
            name: 'showDetails',
            type: 'boolean',
            default: 'false',
            description:
              'Show detailed connection info including latency (ms) and downlink speed (Mbps).',
            commonlyUsed: true,
          },
          {
            name: 'onStatusChange',
            type: '(status: NetworkConnectionStatus) => void',
            description:
              'Callback fired whenever the detected network status changes.',
            commonlyUsed: true,
          },
          {
            name: 'pingEndpoint',
            type: 'string',
            default: '"/api/ping"',
            description:
              'Custom endpoint URL for periodic connectivity checks via HEAD requests.',
          },
          {
            name: 'pingInterval',
            type: 'number',
            default: '30000',
            description:
              'Interval in milliseconds between automatic ping checks.',
          },
          {
            name: 'slowThreshold',
            type: 'number',
            default: '1000',
            description:
              'Latency threshold in milliseconds above which the connection is classified as "slow".',
          },
          {
            name: 'className',
            type: 'string',
            description: 'Custom CSS class applied to the root container.',
          },
        ],
        notes: [
          'Uses ARIA live regions (role="status", aria-live="polite") for screen reader announcements.',
          'Auto-detection listens to browser online/offline events and the Network Information API for effective connection type.',
          'The ping indicator dot animates with a ping effect when the status is "online".',
          'Status colors use design tokens: success for online, destructive for offline, warning for slow, and amber for unstable.',
        ],
      },
      {
        name: 'NetworkStatusBanner',
        description:
          'Animated top banner that displays network connectivity status with retry and dismiss actions. Auto-hides for non-critical states (reconnecting, slow) and persists for offline. Includes a companion useNetworkStatus hook for auto-detection.',
        importPath: '@clarity-chat/react',
        usageCode: `import { NetworkStatusBanner, useNetworkStatus } from '@clarity-chat/react'

// With auto-detection hook
function App() {
  const status = useNetworkStatus()
  return (
    <NetworkStatusBanner
      status={status}
      onRetry={() => refetchData()}
      onDismiss={() => setDismissed(true)}
    />
  )
}

// Manual control
<NetworkStatusBanner
  status="offline"
  message="Connection lost. Messages will queue."
  onRetry={() => reconnect()}
/>`,
        props: [
          {
            name: 'status',
            type: "'online' | 'offline' | 'reconnecting' | 'slow'",
            default: '"online"',
            description:
              'Current network status determining the banner appearance and message.',
            commonlyUsed: true,
          },
          {
            name: 'message',
            type: 'string',
            description:
              'Custom message text that overrides the default message for the current status.',
            commonlyUsed: true,
          },
          {
            name: 'onRetry',
            type: '() => void',
            description:
              'Callback when the retry button is clicked. The retry button is only shown when status is "offline".',
            commonlyUsed: true,
          },
          {
            name: 'onDismiss',
            type: '() => void',
            description:
              'Callback when the dismiss button is clicked. The dismiss button appears when this prop is provided.',
            commonlyUsed: true,
          },
          {
            name: 'show',
            type: 'boolean',
            default: 'true when status is not "online"',
            description:
              'Override automatic show/hide behavior. When not provided, the banner shows for non-online statuses.',
          },
          {
            name: 'autoHideMs',
            type: 'number',
            default: '0 for offline, 5000 for reconnecting/slow',
            description:
              'Auto-hide delay in milliseconds. Set to 0 to disable auto-hide.',
          },
          {
            name: 'className',
            type: 'string',
            description:
              'Additional CSS classes applied to the banner container.',
          },
        ],
        notes: [
          'The companion useNetworkStatus() hook auto-detects connectivity using browser events and the Network Information API.',
          'Banner animates in/out with height and opacity transitions. Respects prefers-reduced-motion.',
          'Default messages: "Connected" (online), "No internet connection" (offline), "Reconnecting..." (reconnecting), "Slow connection detected" (slow).',
          'Banner visibility resets automatically when the status changes to a new value.',
        ],
      },
    ],

    'Error States': [
      {
        name: 'ErrorMessage',
        description:
          'Rich error display component with severity-based styling, suggested resolution actions, optional technical details, and integrated retry with exponential backoff. Supports compact inline mode and full block mode with animated entrance.',
        importPath: '@clarity-chat/react',
        usageCode: `import { ErrorMessage } from '@clarity-chat/react'

// Structured error with suggestions
<ErrorMessage
  error={{
    type: 'network',
    title: 'Connection Lost',
    message: 'Unable to send message',
  }}
  onRetry={() => retrySendMessage()}
  onDismiss={() => clearError()}
/>

// Simple string error
<ErrorMessage
  error="Failed to load conversation"
  onRetry={fetchConversation}
  compact
/>

// With technical details
<ErrorMessage
  error={{
    type: 'server',
    title: 'Server Error',
    message: 'Request failed with status 500',
    technicalDetails: 'POST /api/chat 500 Internal Server Error\\nRequest ID: abc-123',
    severity: 'error',
  }}
  showTechnicalDetails
  maxRetryAttempts={5}
  onRetry={handleRetry}
/>`,
        props: [
          {
            name: 'error',
            type: 'ErrorDetails | string',
            required: true,
            description:
              'Error information. Pass a string for simple errors or an ErrorDetails object with type, title, message, severity, suggestions, technicalDetails, canRetry, and retryButtonText.',
            commonlyUsed: true,
          },
          {
            name: 'onRetry',
            type: '() => void | Promise<void>',
            description:
              'Callback invoked when the retry button is clicked. Shown only when the error has canRetry set to true (default for most error types).',
            commonlyUsed: true,
          },
          {
            name: 'onDismiss',
            type: '() => void',
            description:
              'Callback invoked when the dismiss button is clicked. The dismiss button only appears when this prop is provided.',
            commonlyUsed: true,
          },
          {
            name: 'showTechnicalDetails',
            type: 'boolean',
            default: 'false',
            description:
              'Show a collapsible section with technical error details for debugging.',
          },
          {
            name: 'maxRetryAttempts',
            type: 'number',
            default: '3',
            description:
              'Maximum number of retry attempts passed to the integrated RetryButton.',
          },
          {
            name: 'className',
            type: 'string',
            description: 'Custom CSS class applied to the root container.',
          },
          {
            name: 'compact',
            type: 'boolean',
            default: 'false',
            description:
              'Compact inline mode with smaller padding. Shows only the message and a small retry icon button.',
            commonlyUsed: true,
          },
        ],
        notes: [
          'ErrorDetails.type determines default titles, messages, and suggestions. Supported types: "network", "ratelimit", "server", "auth", "unknown".',
          'ErrorDetails.severity controls the color scheme: "error" (red/destructive), "warning" (yellow/amber), "info" (blue).',
          'String errors are automatically parsed into ErrorDetails with type "unknown" and severity "error".',
          'Integrates the RetryButton component with exponential backoff when canRetry is true.',
          'Uses role="alert" and aria-live="assertive" for screen reader announcements.',
        ],
      },
      {
        name: 'ErrorBoundary',
        description:
          'React class component error boundary that catches JavaScript errors in child components and displays a fallback UI. Supports custom fallback renderers, automatic reset via key changes, and error logging callbacks.',
        importPath: '@clarity-chat/react',
        usageCode: `import { ErrorBoundary } from '@clarity-chat/react'

// Basic usage with default fallback
<ErrorBoundary>
  <ChatWindow />
</ErrorBoundary>

// Custom fallback with reset
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <h2>Chat Error: {error.message}</h2>
      <button onClick={reset}>Retry</button>
    </div>
  )}
  onError={(error, errorInfo) => {
    Sentry.captureException(error)
  }}
>
  <ChatWindow />
</ErrorBoundary>

// Auto-reset on conversation change
<ErrorBoundary resetKeys={[conversationId]}>
  <ChatWindow conversationId={conversationId} />
</ErrorBoundary>`,
        props: [
          {
            name: 'children',
            type: 'React.ReactNode',
            required: true,
            description:
              'Child components to render. Errors thrown in this subtree are caught by the boundary.',
            commonlyUsed: true,
          },
          {
            name: 'fallback',
            type: 'ReactNode | ((error: Error, resetError: () => void) => ReactNode)',
            description:
              'Custom fallback UI. Can be a static ReactNode or a render function receiving the error and a reset callback.',
            commonlyUsed: true,
          },
          {
            name: 'onError',
            type: '(error: Error, errorInfo: React.ErrorInfo) => void',
            description:
              'Callback invoked when an error is caught. Use for analytics or external error reporting.',
            commonlyUsed: true,
          },
          {
            name: 'onReset',
            type: '() => void',
            description:
              'Callback invoked when the error boundary is reset, either manually or via resetKeys change.',
          },
          {
            name: 'resetKeys',
            type: 'Array<string | number>',
            description:
              'Array of keys that trigger an automatic error boundary reset when any value changes.',
            commonlyUsed: true,
          },
          {
            name: 'logError',
            type: '(error: Error, errorInfo: React.ErrorInfo) => void',
            description:
              'Custom error logging function called in addition to console.error. Use for Sentry, LogRocket, etc.',
          },
        ],
        notes: [
          'The default fallback shows the error message, a "Try Again" button, and development-only stack trace details.',
          'Error boundaries only catch errors during rendering, lifecycle methods, and constructors of the subtree -- not in event handlers or async code.',
          'The resetKeys comparison is shallow: it checks array length and individual values with strict equality.',
          'Calling the reset function (from fallback render prop) clears the error state and re-renders children.',
        ],
      },
      {
        name: 'ErrorBanner',
        description:
          'Lightweight animated banner for displaying error messages at the top of a container. Shows a destructive-themed alert with optional retry and dismiss buttons. Animates in/out based on the error prop.',
        importPath: '@clarity-chat/react',
        usageCode: `import { ErrorBanner } from '@clarity-chat/react'

<ErrorBanner
  error={errorMessage}
  onRetry={() => retryLastAction()}
  onDismissError={() => clearError()}
/>`,
        props: [
          {
            name: 'error',
            type: 'string | null',
            required: true,
            description:
              'Error message string to display. When null or empty, the banner is hidden with an exit animation.',
            commonlyUsed: true,
          },
          {
            name: 'onRetry',
            type: '() => void',
            description:
              'Callback when the retry button is clicked. The retry button only appears when this prop is provided.',
            commonlyUsed: true,
          },
          {
            name: 'onDismissError',
            type: '() => void',
            description:
              'Callback when the dismiss button is clicked. The dismiss button only appears when this prop is provided.',
            commonlyUsed: true,
          },
        ],
        notes: [
          'Uses AnimatePresence for smooth height and opacity enter/exit animations.',
          'Styled with destructive theme colors (red) and a border-bottom separator.',
          'The banner uses role="alert" for immediate screen reader announcements.',
          'Compact design suitable for embedding at the top of chat windows or panels.',
        ],
      },
    ],

    'Feedback Components': [
      {
        name: 'FeedbackAnimation',
        description:
          'Animated feedback overlay that displays success, error, warning, or info states with an icon and optional message. Features scale and rotation entrance animations with auto-hide support. Respects prefers-reduced-motion.',
        importPath: '@clarity-chat/react',
        usageCode: `import { FeedbackAnimation } from '@clarity-chat/react'

<FeedbackAnimation
  type="success"
  show={showFeedback}
  message="Message sent!"
  duration={2000}
  onComplete={() => setShowFeedback(false)}
/>

// Persistent feedback (no auto-hide)
<FeedbackAnimation
  type="error"
  show={hasError}
  message="Failed to send"
  duration={0}
/>`,
        props: [
          {
            name: 'type',
            type: "'success' | 'error' | 'warning' | 'info'",
            required: true,
            description:
              'Type of feedback determining the icon and color scheme.',
            commonlyUsed: true,
          },
          {
            name: 'show',
            type: 'boolean',
            required: true,
            description: 'Whether to show the feedback animation.',
            commonlyUsed: true,
          },
          {
            name: 'message',
            type: 'string',
            description: 'Optional text message displayed below the icon.',
            commonlyUsed: true,
          },
          {
            name: 'duration',
            type: 'number',
            default: '2000',
            description:
              'Duration in milliseconds before auto-hide triggers onComplete. Set to 0 to disable auto-hide.',
            commonlyUsed: true,
          },
          {
            name: 'onComplete',
            type: '() => void',
            description:
              'Callback fired when the auto-hide timer expires. Use to reset the show state.',
            commonlyUsed: true,
          },
          {
            name: 'className',
            type: 'string',
            description:
              'Additional CSS classes applied to the feedback container.',
          },
        ],
        notes: [
          'The icon animates with a scale + rotation entrance for visual delight.',
          'Color schemes use design tokens: success (green), destructive (red), warning (yellow), info (blue).',
          'Respects prefers-reduced-motion: falls back to simple opacity fade when motion is reduced.',
          'The same module also exports SuccessCheckmark, ErrorShake, PulseAttention, RippleEffect, ConfettiEffect, GlowEffect, BounceIn, and SlideNotification helper components.',
        ],
      },
      {
        name: 'RetryButton',
        description:
          'Production-ready retry button with exponential backoff, visual countdown timer, attempt tracking, and type-specific error messages. Provides callbacks for retry lifecycle events (start, success, fail, max reached) for analytics integration.',
        importPath: '@clarity-chat/react',
        usageCode: `import { RetryButton } from '@clarity-chat/react'

// Basic network retry
<RetryButton
  onRetry={handleRetry}
  errorType="network"
  maxAttempts={3}
/>

// Custom backoff delays
<RetryButton
  onRetry={async () => await sendMessage()}
  backoffMs={[2000, 5000, 15000]}
  errorType="ratelimit"
/>

// With analytics
<RetryButton
  onRetry={handleRetry}
  onRetryStart={(attempt) => track('retry_started', { attempt })}
  onRetrySuccess={(attempt) => track('retry_success', { attempt })}
  onRetryFail={(attempt, error) => track('retry_failed', { attempt })}
  onMaxAttemptsReached={() => showSupportDialog()}
/>`,
        props: [
          {
            name: 'onRetry',
            type: '() => void | Promise<void>',
            required: true,
            description:
              'Function to call when the retry button is clicked. Can be async -- the button shows a loading state until it resolves.',
            commonlyUsed: true,
          },
          {
            name: 'maxAttempts',
            type: 'number',
            default: '3',
            description:
              'Maximum number of retry attempts before the button is disabled.',
            commonlyUsed: true,
          },
          {
            name: 'backoffMs',
            type: 'number[]',
            default: '[1000, 3000, 10000]',
            description:
              'Array of backoff delays in milliseconds for each attempt. The last value is reused for additional attempts.',
          },
          {
            name: 'errorType',
            type: "'network' | 'ratelimit' | 'server' | 'auth' | 'unknown'",
            default: '"unknown"',
            description:
              'Error type determining the contextual message shown below the button.',
            commonlyUsed: true,
          },
          {
            name: 'attemptNumber',
            type: 'number',
            description:
              'Externally controlled attempt number for syncing with parent state.',
          },
          {
            name: 'disabled',
            type: 'boolean',
            default: 'false',
            description:
              'Whether the button is disabled regardless of remaining attempts.',
          },
          {
            name: 'buttonText',
            type: 'string',
            description:
              'Custom button text. Defaults to "Try Again" (idle) or "Retrying..." (loading).',
          },
          {
            name: 'showAttemptsRemaining',
            type: 'boolean',
            default: 'true',
            description:
              'Show a "(X left)" badge indicating remaining retry attempts.',
          },
          {
            name: 'onMaxAttemptsReached',
            type: '() => void',
            description:
              'Callback fired when all retry attempts have been exhausted.',
          },
          {
            name: 'onRetryStart',
            type: '(attempt: number) => void',
            description:
              'Callback fired when a retry attempt begins, receiving the attempt number.',
          },
          {
            name: 'onRetrySuccess',
            type: '(attempt: number) => void',
            description: 'Callback fired when a retry attempt succeeds.',
          },
          {
            name: 'onRetryFail',
            type: '(attempt: number, error: Error) => void',
            description:
              'Callback fired when a retry attempt fails, receiving the attempt number and error.',
          },
          {
            name: 'className',
            type: 'string',
            description: 'Custom CSS class applied to the button element.',
          },
          {
            name: 'size',
            type: "'sm' | 'md' | 'lg'",
            default: '"md"',
            description: 'Size variant controlling button dimensions.',
          },
          {
            name: 'variant',
            type: "'default' | 'ghost' | 'outline'",
            default: '"default"',
            description:
              'Visual variant. "default" maps to destructive styling, "ghost" and "outline" map to their respective Button variants.',
          },
        ],
        notes: [
          'Displays a visual countdown timer (e.g., "Retrying... (2.5s)") when the backoff delay exceeds 500ms.',
          'The button resets to attempt 0 on a successful retry, allowing future retries if errors recur.',
          'Error type messages: "network" = connection lost, "ratelimit" = too many requests, "server" = server error, "auth" = authentication failed, "unknown" = generic error.',
          'When max attempts are exhausted, a destructive message appears suggesting the user refresh the page or contact support.',
          'The button includes an ARIA label with the current attempts remaining count for accessibility.',
        ],
      },
    ],

    'Notification Center': {
      name: 'SlideNotification',
      description:
        'Animated slide-in notification bar for displaying temporary feedback messages. Supports top or bottom positioning, multiple feedback types (success, error, warning, info), and smooth enter/exit transitions. Useful for building notification center patterns and inline alerts.',
      importPath: '@clarity-chat/react',
      importName: 'SlideNotification',
      usageCode: `import { SlideNotification } from '@clarity-chat/react'

// Top notification
<SlideNotification
  show={showNotification}
  message="New response available"
  type="info"
  position="top"
/>

// Bottom success notification
<SlideNotification
  show={saved}
  message="Settings saved successfully"
  type="success"
  position="bottom"
/>

// Building a notification list
{notifications.map((n) => (
  <SlideNotification
    key={n.id}
    show={!n.dismissed}
    message={n.title}
    type={n.type}
  />
))}`,
      props: [
        {
          name: 'show',
          type: 'boolean',
          required: true,
          description:
            'Whether to show the notification. Triggers enter/exit animations.',
          commonlyUsed: true,
        },
        {
          name: 'message',
          type: 'string',
          required: true,
          description: 'The notification message text to display.',
          commonlyUsed: true,
        },
        {
          name: 'type',
          type: "'success' | 'error' | 'warning' | 'info'",
          default: '"info"',
          description: 'Feedback type determining the icon and color scheme.',
          commonlyUsed: true,
        },
        {
          name: 'position',
          type: "'top' | 'bottom'",
          default: '"top"',
          description:
            'Slide direction -- "top" slides down from above, "bottom" slides up from below.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Additional CSS classes applied to the notification container.',
        },
      ],
      notes: [
        'Uses AnimatePresence for smooth slide + fade enter/exit animations.',
        'Respects prefers-reduced-motion: disables the slide offset and uses opacity-only transitions.',
        'Color schemes match the FeedbackAnimation component: success (green), error (red), warning (yellow), info (blue).',
        'Pair with setTimeout or a state manager to auto-dismiss notifications after a delay.',
        'Part of the feedback-animation module which also exports FeedbackAnimation, SuccessCheckmark, ErrorShake, PulseAttention, RippleEffect, ConfettiEffect, GlowEffect, and BounceIn.',
      ],
    },
  }
