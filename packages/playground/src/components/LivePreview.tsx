/**
 * Live Preview Component
 *
 * Renders user code in real-time with error handling and console interception.
 * Uses a sandboxed iframe for security.
 *
 * SECURITY NOTE: This component requires 'unsafe-eval' in CSP because Babel
 * needs eval() to transpile JSX code in the browser. The iframe is sandboxed
 * with only 'allow-scripts' permission (no same-origin, forms, popups, etc.).
 *
 * For production code editing, consider:
 * - Server-side compilation with a secure sandbox (e.g., Docker containers)
 * - WebContainer-based sandboxing (StackBlitz approach)
 * - Monaco Editor with TypeScript compilation worker
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import { AlertCircle, Play, Loader2 } from 'lucide-react'
import type { ConsoleLogEntry, PlaygroundError } from '../types'
import type { PreviewStatus } from '../contexts/PlaygroundContext'
import { cn } from '../utils/cn'

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
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
      color: ${theme === 'dark' ? '#ffffff' : '#000000'};
    }
    * {
      box-sizing: border-box;
    }
    .error-display {
      color: #dc2626;
      padding: 16px;
      font-family: ui-monospace, monospace;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 4px;
      margin: 16px 0;
      white-space: pre-wrap;
    }
    .error-display.dark {
      background: rgba(220, 38, 38, 0.1);
      border-color: rgba(220, 38, 38, 0.3);
      color: #fca5a5;
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
        root.render(<Component />);

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
      errorDiv.className = 'error-display${theme === 'dark' ? ' dark' : ''}';

      const strong = document.createElement('strong');
      strong.textContent = 'Error: ';
      errorDiv.appendChild(strong);

      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      errorDiv.appendChild(document.createTextNode(errorMessage));

      if (error?.stack) {
        const stackDiv = document.createElement('div');
        stackDiv.style.marginTop = '8px';
        stackDiv.style.fontSize = '12px';
        stackDiv.style.opacity = '0.8';
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
          message: errorMessage,
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

// Status indicator labels
const STATUS_LABELS: Record<PreviewStatus, string> = {
  idle: '',
  compiling: 'Compiling...',
  rendering: 'Rendering...',
  success: '',
  error: 'Error',
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
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isProcessing =
    previewStatus === 'compiling' || previewStatus === 'rendering'

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Only accept messages from our iframe
      if (event.source !== iframeRef.current?.contentWindow) {
        return
      }

      const { data } = event

      if (data.type === 'playground-console' && onConsoleEntry) {
        onConsoleEntry({
          level: data.level,
          message: data.message,
          args: data.args,
        })
      }

      if (data.type === 'playground-status') {
        setPreviewStatus(data.status)
        onPreviewStatus?.(data.status)
      }

      if (data.type === 'playground-error') {
        const playgroundError: PlaygroundError = {
          message: data.error.message,
          line: data.error.line,
          column: data.error.column,
          stack: data.error.stack,
        }
        setError(data.error.message)
        onError?.(playgroundError)
      }

      if (data.type === 'playground-render-success') {
        setError(null)
        onError?.(null)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onConsoleEntry, onError, onPreviewStatus])

  const runPreview = useCallback(() => {
    setPreviewStatus('compiling')
    onPreviewStatus?.('compiling')
    setError(null)

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
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      setPreviewStatus('error')
      onPreviewStatus?.('error')
      onError?.({ message })
    }
  }, [code, theme, onError, onPreviewStatus])

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

  return (
    <div className="h-full flex flex-col">
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                Error
              </h3>
              <pre className="text-sm text-red-800 dark:text-red-200 whitespace-pre-wrap font-mono">
                {error}
              </pre>
            </div>
            <button
              onClick={runPreview}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 rounded transition-colors"
            >
              <Play className="w-3 h-3" />
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden min-h-[400px]">
        {/* Loading indicator */}
        {isProcessing && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium shadow-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{STATUS_LABELS[previewStatus]}</span>
          </div>
        )}

        <iframe
          ref={iframeRef}
          title="Live code preview"
          sandbox="allow-scripts"
          className={cn(
            'w-full h-full transition-opacity duration-200',
            isProcessing && 'opacity-70'
          )}
          aria-label="Live preview of the code"
        />
      </div>
    </div>
  )
}
