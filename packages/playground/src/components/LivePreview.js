import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Live Preview Component
 * Renders user code in real-time with error handling
 */
import { useEffect, useState, useRef, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
const renderPreview = (code, theme, iframeRef, setError) => {
    try {
        setError(null);
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
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'color: red; padding: 16px; font-family: monospace; background: #fee; border: 1px solid #fcc; border-radius: 4px; margin: 16px; white-space: pre-wrap;';
      const strong = document.createElement('strong');
      strong.textContent = 'Error: ';
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      const errorText = errorMessage + (error?.stack ? '\\n\\n' + error.stack : '');
      const message = document.createTextNode(errorText);
      
      errorDiv.appendChild(strong);
      errorDiv.appendChild(message);
      
      // Clear body and add error
      const root = document.getElementById('root');
      if (root) {
        root.innerHTML = '';
        root.appendChild(errorDiv);
      } else {
        document.body.innerHTML = '';
        document.body.appendChild(errorDiv);
      }
    }
  </script>
</body>
</html>
      `;
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                doc.open();
                doc.write(html);
                doc.close();
            }
        }
    }
    catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
    }
};
export function LivePreview({ code, theme, autoRun, onRunRef }) {
    const [error, setError] = useState(null);
    const iframeRef = useRef(null);
    const timeoutRef = useRef(null);
    const runPreview = useCallback(() => {
        renderPreview(code, theme, iframeRef, setError);
    }, [code, theme]);
    useEffect(() => {
        if (onRunRef) {
            onRunRef.current = runPreview;
        }
    }, [onRunRef, runPreview]);
    useEffect(() => {
        if (!autoRun) {
            // Clear any pending timeout when auto-run is disabled
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            return;
        }
        // Debounce auto-run to avoid excessive re-renders
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            runPreview();
        }, 300); // 300ms debounce delay
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [autoRun, runPreview]);
    return (_jsxs("div", { className: "h-full", children: [error && (_jsx("div", { className: "mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-red-900 dark:text-red-100 mb-1", children: "Error" }), _jsx("pre", { className: "text-sm text-red-800 dark:text-red-200 whitespace-pre-wrap font-mono", children: error })] })] }) })), _jsx("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-[600px]", children: _jsx("iframe", { ref: iframeRef, title: "Live code preview", sandbox: "allow-scripts allow-same-origin", className: "w-full h-full", "aria-label": "Live preview of the code" }) })] }));
}
//# sourceMappingURL=LivePreview.js.map