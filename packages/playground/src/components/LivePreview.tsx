/**
 * Live Preview Component
 * Renders user code in real-time with error handling
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import { AlertCircle } from 'lucide-react'

interface LivePreviewProps {
  code: string
  theme: 'light' | 'dark'
  autoRun: boolean
  onRunRef?: React.MutableRefObject<(() => void) | null>
}

const renderPreview = (
  code: string,
  theme: 'light' | 'dark',
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  setError: (error: string | null) => void
) => {
  try {
    setError(null)

    // Create the HTML content for the iframe
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
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
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    try {
      ${code}
      
      // If the code defines a default export component, render it
      if (typeof Component !== 'undefined') {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<Component />);
      }
    } catch (error) {
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'color: red; padding: 16px; font-family: monospace;';
      const strong = document.createElement('strong');
      strong.textContent = 'Error:';
      const br = document.createElement('br');
      const message = document.createTextNode(error.message || 'Unknown error');
      errorDiv.appendChild(strong);
      errorDiv.appendChild(br);
      errorDiv.appendChild(message);
      document.body.innerHTML = '';
      document.body.appendChild(errorDiv);
    }
  </script>
</body>
</html>
      `

    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument
      if (doc) {
        doc.open()
        doc.write(html)
        doc.close()
      }
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error')
  }
}

export function LivePreview({ code, theme, autoRun, onRunRef }: LivePreviewProps) {
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const runPreview = useCallback(() => {
    renderPreview(code, theme, iframeRef, setError)
  }, [code, theme])

  useEffect(() => {
    if (onRunRef) {
      onRunRef.current = runPreview
    }
  }, [onRunRef, runPreview])

  useEffect(() => {
    if (!autoRun) return
    runPreview()
  }, [autoRun, runPreview])

  return (
    <div className="h-full">
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                Error
              </h3>
              <pre className="text-sm text-red-800 dark:text-red-200 whitespace-pre-wrap font-mono">
                {error}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-[600px]">
        <iframe
          ref={iframeRef}
          title="Live code preview"
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full"
          aria-label="Live preview of the code"
        />
      </div>
    </div>
  )
}
