/**
 * Live Preview Component
 *
 * A beautifully designed live preview with:
 * - Skeleton loading states
 * - Smooth transitions and animations
 * - Better status indicators
 * - Enhanced error display
 * - Professional visual design
 *
 * SECURITY NOTE: This component requires 'unsafe-eval' in CSP because Babel
 * needs eval() to transpile JSX code in the browser. The iframe is sandboxed
 * with only 'allow-scripts' permission (no same-origin, forms, popups, etc.).
 */

import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  AlertCircle,
  Loader2,
  Check,
  RefreshCw,
  Code2,
  Zap,
  CircleDot,
  Square,
} from 'lucide-react'
import type { ConsoleLogEntry, PlaygroundError } from '../types'
import { isIframeMessage } from '../types'
import type { PreviewStatus } from '../contexts/PlaygroundContext'
import { cn } from '../utils/cn'

// Compilation timeout duration (10 seconds)
const COMPILATION_TIMEOUT_MS = 10000

interface LivePreviewProps {
  code: string
  theme: 'light' | 'dark'
  autoRun: boolean
  onRunRef?: React.MutableRefObject<(() => void) | null>
  onConsoleEntry?: (entry: Omit<ConsoleLogEntry, 'id' | 'timestamp'>) => void
  onError?: (error: PlaygroundError | null) => void
  onPreviewStatus?: (status: PreviewStatus) => void
}

// Generate iframe HTML with console interception and status reporting
function generatePreviewHTML(code: string, theme: 'light' | 'dark'): string {
  const isDark = theme === 'dark'
  const bgColor = isDark ? '#0f172a' : '#ffffff'
  const textColor = isDark ? '#f8fafc' : '#0f172a'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; style-src 'self' 'unsafe-inline';">
  <script src="https://unpkg.com/react@19/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@19/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 20px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${bgColor};
      color: ${textColor};
      line-height: 1.5;
      min-height: 100vh;
    }
    #root {
      width: 100%;
    }
    .error-container {
      padding: 16px;
      background: ${isDark ? 'rgba(220, 38, 38, 0.1)' : '#fef2f2'};
      border: 1px solid ${isDark ? 'rgba(220, 38, 38, 0.3)' : '#fecaca'};
      border-radius: 12px;
      margin: 8px 0;
    }
    .error-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: ${isDark ? '#fca5a5' : '#dc2626'};
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 8px;
    }
    .error-message {
      color: ${isDark ? '#fca5a5' : '#b91c1c'};
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 13px;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .error-stack {
      margin-top: 12px;
      padding: 12px;
      background: ${isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'};
      border-radius: 8px;
      font-size: 11px;
      opacity: 0.8;
      overflow-x: auto;
    }
    /* Animation keyframes */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-in {
      animation: fadeIn 0.3s ease-out;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    // Notify parent that we're starting to compile
    window.parent.postMessage({ type: 'playground-status', status: 'compiling' }, '*');

    // Console interception - must be before any other scripts
    (function() {
      const originalConsole = {
        log: console.log.bind(console),
        info: console.info.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),
      };

      function serializeArg(arg) {
        if (arg === null) return 'null';
        if (arg === undefined) return 'undefined';
        if (typeof arg === 'function') return '[Function]';
        if (typeof arg === 'symbol') return arg.toString();
        if (arg instanceof Error) {
          return arg.message + (arg.stack ? '\\n' + arg.stack : '');
        }
        if (typeof arg === 'object') {
          try {
            const seen = new WeakSet();
            return JSON.stringify(arg, (key, value) => {
              if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) return '[Circular]';
                seen.add(value);
              }
              return value;
            }, 2);
          } catch (e) {
            return '[Object - cannot stringify]';
          }
        }
        return String(arg);
      }

      function interceptConsole(level) {
        return function(...args) {
          // Call original console method
          originalConsole[level](...args);

          // Send to parent
          try {
            window.parent.postMessage({
              type: 'playground-console',
              level: level,
              message: args.map(serializeArg).join(' '),
              args: args.slice(1).map(serializeArg),
            }, '*');
          } catch (e) {
            // Silently fail if postMessage fails
          }
        };
      }

      console.log = interceptConsole('log');
      console.info = interceptConsole('info');
      console.warn = interceptConsole('warn');
      console.error = interceptConsole('error');

      // Global error handler
      window.onerror = function(message, source, lineno, colno, error) {
        window.parent.postMessage({
          type: 'playground-error',
          error: {
            message: String(message),
            line: lineno,
            column: colno,
            stack: error ? error.stack : null,
          }
        }, '*');
        window.parent.postMessage({ type: 'playground-status', status: 'error' }, '*');
        return false;
      };

      // Unhandled promise rejection handler
      window.onunhandledrejection = function(event) {
        const error = event.reason;
        window.parent.postMessage({
          type: 'playground-error',
          error: {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : null,
          }
        }, '*');
        window.parent.postMessage({ type: 'playground-status', status: 'error' }, '*');
      };
    })();
  </script>
  <script type="text/babel" data-presets="react">
    // Notify parent that we're rendering
    window.parent.postMessage({ type: 'playground-status', status: 'rendering' }, '*');

    try {
      ${code}

      // If the code defines a Component, render it
      if (typeof Component !== 'undefined') {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
          <div className="animate-in">
            <Component />
          </div>
        );

        // Notify parent that render was successful
        window.parent.postMessage({ type: 'playground-render-success' }, '*');
        window.parent.postMessage({ type: 'playground-status', status: 'success' }, '*');
      } else {
        // No component defined - still success
        window.parent.postMessage({ type: 'playground-status', status: 'success' }, '*');
      }
    } catch (error) {
      // Display error in preview
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-container';

      const titleDiv = document.createElement('div');
      titleDiv.className = 'error-title';
      titleDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Runtime Error';
      errorDiv.appendChild(titleDiv);

      const messageDiv = document.createElement('div');
      messageDiv.className = 'error-message';
      messageDiv.textContent = error?.message || error?.toString() || 'Unknown error';
      errorDiv.appendChild(messageDiv);

      if (error?.stack) {
        const stackDiv = document.createElement('pre');
        stackDiv.className = 'error-stack';
        stackDiv.textContent = error.stack;
        errorDiv.appendChild(stackDiv);
      }

      const root = document.getElementById('root');
      if (root) {
        root.innerHTML = '';
        root.appendChild(errorDiv);
      }

      // Send error to parent
      window.parent.postMessage({
        type: 'playground-error',
        error: {
          message: error?.message || String(error),
          stack: error?.stack || null,
        }
      }, '*');
      window.parent.postMessage({ type: 'playground-status', status: 'error' }, '*');
    }
  </script>
</body>
</html>
  `.trim()
}

// Status configuration
const statusConfig: Record<
  PreviewStatus,
  {
    label: string
    icon: React.ElementType
    color: string
    bgColor: string
    animate?: boolean
  }
> = {
  idle: {
    label: 'Ready',
    icon: CircleDot,
    color: 'text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    animate: false,
  },
  compiling: {
    label: 'Compiling...',
    icon: Loader2,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/50',
    animate: true,
  },
  rendering: {
    label: 'Rendering...',
    icon: Zap,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/50',
    animate: true,
  },
  success: {
    label: 'Running',
    icon: Check,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/50',
    animate: false,
  },
  error: {
    label: 'Error',
    icon: AlertCircle,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-100 dark:bg-rose-900/50',
    animate: false,
  },
}

// Skeleton loader component
function PreviewSkeleton() {
  return (
    <div className="h-full flex flex-col gap-4 p-4 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg skeleton" />
        <div className="flex-1">
          <div className="h-4 w-32 rounded skeleton mb-2" />
          <div className="h-3 w-48 rounded skeleton" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 space-y-3">
        <div className="h-12 rounded-lg skeleton" />
        <div className="h-32 rounded-lg skeleton" />
        <div className="h-8 rounded-lg skeleton w-1/2" />
      </div>

      {/* Footer skeleton */}
      <div className="flex gap-2">
        <div className="h-10 flex-1 rounded-lg skeleton" />
        <div className="h-10 w-24 rounded-lg skeleton" />
      </div>
    </div>
  )
}

// Format elapsed time in seconds
function formatElapsedTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const tenths = Math.floor((ms % 1000) / 100)
  return `${seconds}.${tenths}s`
}

// Status indicator component with elapsed time
function StatusIndicator({
  status,
  elapsedMs,
  onForceStop,
}: {
  status: PreviewStatus
  elapsedMs?: number
  onForceStop?: () => void
}) {
  const config = statusConfig[status]
  const Icon = config.icon

  if (status === 'idle' || status === 'success') {
    return null
  }

  const isCompiling = status === 'compiling' || status === 'rendering'

  return (
    <div
      className={cn(
        'absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg animate-fade-in-down',
        config.bgColor,
        config.color
      )}
    >
      <Icon className={cn('w-3.5 h-3.5', config.animate && 'animate-spin')} />
      <span>{config.label}</span>
      {isCompiling && elapsedMs !== undefined && elapsedMs > 0 && (
        <span className="opacity-75 tabular-nums">
          {formatElapsedTime(elapsedMs)}
        </span>
      )}
      {isCompiling && onForceStop && (
        <button
          onClick={onForceStop}
          className="ml-1 p-0.5 hover:bg-white/20 rounded transition-colors"
          title="Stop compilation"
          aria-label="Stop compilation"
        >
          <Square className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

export function LivePreview({
  code,
  theme,
  autoRun,
  onRunRef,
  onConsoleEntry,
  onError,
  onPreviewStatus,
}: LivePreviewProps) {
  const [error, setError] = useState<string | null>(null)
  const [previewStatus, setPreviewStatus] = useState<PreviewStatus>('idle')
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [elapsedMs, setElapsedMs] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const compilationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const elapsedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const compilationStartRef = useRef<number>(0)

  const isProcessing =
    previewStatus === 'compiling' || previewStatus === 'rendering'

  // Terminate the iframe to stop all execution
  const terminateIframe = useCallback(() => {
    if (iframeRef.current) {
      // Clear the iframe content to stop any running code
      iframeRef.current.srcdoc = ''
      iframeRef.current.src = 'about:blank'
    }
  }, [])

  // Stop elapsed timer
  const stopElapsedTimer = useCallback(() => {
    if (elapsedIntervalRef.current) {
      clearInterval(elapsedIntervalRef.current)
      elapsedIntervalRef.current = null
    }
    setElapsedMs(0)
  }, [])

  // Start elapsed timer
  const startElapsedTimer = useCallback(() => {
    stopElapsedTimer()
    compilationStartRef.current = Date.now()
    elapsedIntervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - compilationStartRef.current)
    }, 100)
  }, [stopElapsedTimer])

  // Force stop compilation
  const forceStop = useCallback(() => {
    // Clear timeouts
    if (compilationTimeoutRef.current) {
      clearTimeout(compilationTimeoutRef.current)
      compilationTimeoutRef.current = null
    }
    stopElapsedTimer()

    // Terminate iframe
    terminateIframe()

    // Update state
    setPreviewStatus('idle')
    onPreviewStatus?.('idle')
    setError('Compilation stopped by user')
  }, [terminateIframe, stopElapsedTimer, onPreviewStatus])

  // Handle messages from iframe with type-safe validation
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Only accept messages from our iframe
      if (event.source !== iframeRef.current?.contentWindow) {
        return
      }

      const { data } = event

      // Validate message structure using type guard
      if (!isIframeMessage(data)) {
        return
      }

      switch (data.type) {
        case 'playground-console':
          onConsoleEntry?.({
            level: data.level,
            message: data.message,
            args: data.args,
          })
          break

        case 'playground-status':
          setPreviewStatus(data.status)
          onPreviewStatus?.(data.status)

          if (data.status === 'success' || data.status === 'error') {
            setIsInitialLoad(false)
            stopElapsedTimer()
            // Clear compilation timeout on completion
            if (compilationTimeoutRef.current) {
              clearTimeout(compilationTimeoutRef.current)
              compilationTimeoutRef.current = null
            }
          }
          break

        case 'playground-error': {
          const playgroundError: PlaygroundError = {
            message: data.error.message,
            line: data.error.line,
            column: data.error.column,
            stack: data.error.stack ?? undefined,
          }
          setError(data.error.message)
          onError?.(playgroundError)
          break
        }

        case 'playground-render-success':
          setError(null)
          onError?.(null)
          break
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onConsoleEntry, onError, onPreviewStatus, stopElapsedTimer])

  const runPreview = useCallback(() => {
    // Clear any existing compilation timeout
    if (compilationTimeoutRef.current) {
      clearTimeout(compilationTimeoutRef.current)
    }

    setPreviewStatus('compiling')
    onPreviewStatus?.('compiling')
    setError(null)

    // Start elapsed timer
    startElapsedTimer()

    // Set compilation timeout to prevent hanging - terminates iframe on timeout
    compilationTimeoutRef.current = setTimeout(() => {
      // Terminate the iframe to actually stop execution
      terminateIframe()
      stopElapsedTimer()

      setError(
        'Compilation timed out after 10 seconds. The code may contain an infinite loop or heavy computation.'
      )
      setPreviewStatus('error')
      onPreviewStatus?.('error')
      onError?.({ message: 'Compilation timed out' })
    }, COMPILATION_TIMEOUT_MS)

    try {
      const html = generatePreviewHTML(code, theme)

      if (iframeRef.current) {
        const doc = iframeRef.current.contentDocument
        if (doc) {
          doc.open()
          doc.write(html)
          doc.close()
        }
      }
    } catch (err) {
      // Clear timeout on error
      if (compilationTimeoutRef.current) {
        clearTimeout(compilationTimeoutRef.current)
        compilationTimeoutRef.current = null
      }
      stopElapsedTimer()
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      setPreviewStatus('error')
      onPreviewStatus?.('error')
      onError?.({ message })
    }
  }, [
    code,
    theme,
    onError,
    onPreviewStatus,
    startElapsedTimer,
    stopElapsedTimer,
    terminateIframe,
  ])

  // Expose run function to parent via ref
  useEffect(() => {
    if (onRunRef) {
      onRunRef.current = runPreview
    }
  }, [onRunRef, runPreview])

  // Auto-run with debouncing
  useEffect(() => {
    if (!autoRun) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      runPreview()
    }, 500) // 500ms debounce for better UX

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [autoRun, runPreview])

  // Cleanup timeouts and intervals on unmount
  useEffect(() => {
    return () => {
      if (compilationTimeoutRef.current) {
        clearTimeout(compilationTimeoutRef.current)
      }
      if (elapsedIntervalRef.current) {
        clearInterval(elapsedIntervalRef.current)
      }
    }
  }, [])

  return (
    <div className="h-full flex flex-col">
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-rose-900 dark:text-rose-100 text-sm mb-1">
                Runtime Error
              </h3>
              <pre className="text-sm text-rose-700 dark:text-rose-300 whitespace-pre-wrap font-mono break-words">
                {error}
              </pre>
            </div>
            <button
              onClick={runPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-100 dark:bg-rose-900/40 hover:bg-rose-200 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Preview Container */}
      <div className="flex-1 relative preview-container min-h-[400px]">
        {/* Status Indicator with elapsed time and stop button */}
        <StatusIndicator
          status={previewStatus}
          elapsedMs={elapsedMs}
          onForceStop={isProcessing ? forceStop : undefined}
        />

        {/* Initial Loading Skeleton */}
        {isInitialLoad && previewStatus === 'idle' && (
          <div className="absolute inset-0 z-20 bg-white dark:bg-gray-900">
            <PreviewSkeleton />
          </div>
        )}

        {/* Processing Overlay */}
        {isProcessing && !isInitialLoad && (
          <div className="absolute inset-0 z-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-[1px] transition-opacity duration-200" />
        )}

        {/* Iframe */}
        <iframe
          ref={iframeRef}
          title="Live code preview"
          sandbox="allow-scripts"
          className={cn(
            'w-full h-full transition-opacity duration-300 rounded-xl',
            isProcessing && 'opacity-80',
            isInitialLoad && 'opacity-0'
          )}
          aria-label="Live preview of the code"
        />

        {/* Empty state */}
        {!code.trim() && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-900">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4">
              <Code2 className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Code to Preview
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Start typing in the editor or select a template from the sidebar
              to see your component here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
