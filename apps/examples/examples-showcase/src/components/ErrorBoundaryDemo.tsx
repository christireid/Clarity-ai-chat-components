/**
 * ErrorBoundary Demo Component
 *
 * Demonstrates the ErrorBoundary with various error scenarios
 */

import React, { useState } from 'react'
import ErrorBoundary from './ErrorBoundary'

// Component that throws an error
function ThrowError({ message }: { message?: string }) {
  throw new Error(message || 'This is a test error!')
}

// Component that throws async error
function AsyncErrorComponent() {
  const [shouldError, setShouldError] = useState(false)

  const triggerAsyncError = () => {
    setTimeout(() => {
      setShouldError(true)
    }, 1000)
  }

  if (shouldError) {
    throw new Error('Async error occurred!')
  }

  return (
    <button onClick={triggerAsyncError} className="demo-button demo-button-async">
      Trigger Async Error
    </button>
  )
}

export function ErrorBoundaryDemo() {
  const [errorType, setErrorType] = useState<string | null>(null)
  const [showBrokenComponent, setShowBrokenComponent] = useState(false)

  return (
    <div className="error-demo-container">
      <div className="error-demo-header">
        <h2>ErrorBoundary Demo</h2>
        <p>Test the error boundary with different error scenarios</p>
      </div>

      <div className="error-demo-grid">
        {/* Immediate Error */}
        <div className="error-demo-card">
          <h3>Immediate Error</h3>
          <p>Throws an error during render</p>
          <ErrorBoundary>
            {showBrokenComponent && errorType === 'immediate' ? (
              <ThrowError message="Immediate render error!" />
            ) : (
              <button
                onClick={() => {
                  setErrorType('immediate')
                  setShowBrokenComponent(true)
                }}
                className="demo-button demo-button-danger"
              >
                Trigger Immediate Error
              </button>
            )}
          </ErrorBoundary>
        </div>

        {/* Async Error */}
        <div className="error-demo-card">
          <h3>Async Error</h3>
          <p>Triggers an error after a delay</p>
          <ErrorBoundary>
            {errorType === 'async' ? (
              <AsyncErrorComponent />
            ) : (
              <button
                onClick={() => setErrorType('async')}
                className="demo-button demo-button-warning"
              >
                Setup Async Error
              </button>
            )}
          </ErrorBoundary>
        </div>

        {/* Network Error Simulation */}
        <div className="error-demo-card">
          <h3>Network Error</h3>
          <p>Simulates a network request failure</p>
          <ErrorBoundary>
            {errorType === 'network' ? (
              <ThrowError message="Failed to fetch data: Network error" />
            ) : (
              <button
                onClick={() => setErrorType('network')}
                className="demo-button demo-button-info"
              >
                Trigger Network Error
              </button>
            )}
          </ErrorBoundary>
        </div>

        {/* Component Tree Error */}
        <div className="error-demo-card">
          <h3>Component Tree Error</h3>
          <p>Error deep in component tree</p>
          <ErrorBoundary>
            {errorType === 'tree' ? (
              <div>
                <div>
                  <div>
                    <ThrowError message="Error in nested component!" />
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setErrorType('tree')}
                className="demo-button demo-button-success"
              >
                Trigger Nested Error
              </button>
            )}
          </ErrorBoundary>
        </div>
      </div>

      <div className="error-demo-info">
        <h3>How It Works</h3>
        <ul>
          <li>Click any button to trigger different types of errors</li>
          <li>Each demo is wrapped in its own ErrorBoundary</li>
          <li>Errors are caught and displayed with recovery options</li>
          <li>Try the "Try Again" button to recover from errors</li>
          <li>Error details are automatically logged to console</li>
        </ul>
      </div>

      <style>{`
        .error-demo-container {
          padding: 2rem;
        }

        .error-demo-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .error-demo-header h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: hsl(var(--foreground));
        }

        .error-demo-header p {
          color: hsl(var(--muted-foreground));
        }

        .error-demo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .error-demo-card {
          padding: 1.5rem;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          text-align: center;
        }

        .error-demo-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: hsl(var(--foreground));
        }

        .error-demo-card p {
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
          margin-bottom: 1rem;
        }

        .demo-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          color: white;
        }

        .demo-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .demo-button-danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .demo-button-warning {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .demo-button-info {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .demo-button-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .demo-button-async {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .error-demo-info {
          padding: 1.5rem;
          background: hsl(var(--muted));
          border-radius: 12px;
        }

        .error-demo-info h3 {
          font-size: 1.125rem;
          margin-bottom: 1rem;
          color: hsl(var(--foreground));
        }

        .error-demo-info ul {
          list-style: disc;
          padding-left: 1.5rem;
          color: hsl(var(--muted-foreground));
        }

        .error-demo-info li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  )
}

export default ErrorBoundaryDemo
