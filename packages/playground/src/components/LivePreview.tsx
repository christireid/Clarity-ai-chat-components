/**
 * Live Preview Component
 * Renders user code in real-time with error handling
 */

import { useEffect, useState, useRef } from 'react'
import { AlertCircle } from 'lucide-react'

interface LivePreviewProps {
  code: string
  theme: 'light' | 'dark'
  autoRun: boolean
}

export function LivePreview({ code, theme, autoRun }: LivePreviewProps) {
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!autoRun) return

    try {
      setError(null)

      // Create the HTML content for the iframe
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
      document.body.innerHTML = '<div style="color: red; padding: 16px; font-family: monospace;">' + 
        '<strong>Error:</strong><br>' + error.message + '</div>';
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
  }, [code, theme, autoRun])

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
          title="preview"
          sandbox="allow-scripts"
          className="w-full h-full"
        />
      </div>

      
    </div>
  )
}
