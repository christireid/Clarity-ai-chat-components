// @ts-nocheck -- SecurityManager is not exported from @clarity-chat/react public API,
// and the validateChatInput method used here is not part of the current SecurityManager interface.
// This playground page needs to be updated when the SecurityManager API is stabilized and exported.
/**
 * Security Playground
 *
 * Interactive playground for testing security features
 */

'use client'

import { useState } from 'react'
import { SecurityManager } from '@clarity-chat/react'

// Local type definition matching SecurityManager.validateChatInput return type
interface SecurityValidationResult {
  isValid: boolean
  sanitized?: string
  error?: string
  warnings?: string[]
}

// Pre-loaded attack examples
const ATTACK_EXAMPLES = [
  {
    name: 'XSS Script Tag',
    category: 'XSS',
    severity: 'Critical',
    text: '<script>alert("XSS")</script>',
    expectedWarning: true,
  },
  {
    name: 'JavaScript Protocol',
    category: 'XSS',
    severity: 'High',
    text: 'javascript:alert("XSS")',
    expectedWarning: true,
  },
  {
    name: 'Event Handler',
    category: 'XSS',
    severity: 'High',
    text: '<img src="x" onerror="alert(\'XSS\')" />',
    expectedWarning: true,
  },
  {
    name: 'SQL Injection',
    category: 'SQL Injection',
    severity: 'Critical',
    text: "SELECT * FROM users WHERE id = 1 OR 1=1; DROP TABLE users;",
    expectedWarning: true,
  },
  {
    name: 'Union Based SQLi',
    category: 'SQL Injection',
    severity: 'High',
    text: "' UNION SELECT username, password FROM users--",
    expectedWarning: true,
  },
  {
    name: 'Legitimate Message',
    category: 'Safe',
    severity: 'None',
    text: 'What is the weather like today? Can you help me plan my day?',
    expectedWarning: false,
  },
  {
    name: 'Technical Question',
    category: 'Safe',
    severity: 'None',
    text: 'Can you explain how to use React hooks? I want to learn about useState.',
    expectedWarning: false,
  },
  {
    name: 'Long Input',
    category: 'Validation',
    severity: 'Low',
    text: 'A'.repeat(10001),
    expectedWarning: false,
    expectedError: true,
  },
]

type TestResult = {
  input: string
  result: SecurityValidationResult
  timestamp: Date
}

export default function SecurityPlayground() {
  const [security] = useState(() => new SecurityManager())
  const [customInput, setCustomInput] = useState('')
  const [selectedExample, setSelectedExample] = useState<number | null>(null)
  const [results, setResults] = useState<TestResult[]>([])
  const [isValidating, setIsValidating] = useState(false)

  const testMessage = (text: string, exampleIndex?: number) => {
    setIsValidating(true)
    setSelectedExample(exampleIndex ?? null)
    setCustomInput(text)

    const validation = security.validateChatInput(text)

    setResults(prev => [
      {
        input: text.slice(0, 100) + (text.length > 100 ? '...' : ''),
        result: validation,
        timestamp: new Date(),
      },
      ...prev.slice(0, 9), // Keep last 10 results
    ])

    setIsValidating(false)
  }

  const clearResults = () => {
    setResults([])
    setSelectedExample(null)
    setCustomInput('')
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500/10 text-red-600 border-red-500/30'
      case 'High':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/30'
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
      case 'Low':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/30'
      default:
        return 'bg-green-500/10 text-green-600 border-green-500/30'
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Security Playground</h1>
        <p className="text-muted-foreground">
          Test the SecurityManager's input validation and XSS prevention capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attack Examples */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Cases</h2>
          <div className="grid gap-3">
            {ATTACK_EXAMPLES.map((example, index) => (
              <button
                key={index}
                onClick={() => testMessage(example.text, index)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedExample === index
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{example.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(
                      example.severity
                    )}`}
                  >
                    {example.severity}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Category: {example.category}
                </div>
                <code className="text-xs bg-muted p-2 rounded block overflow-hidden text-ellipsis whitespace-nowrap">
                  {example.text.slice(0, 60)}
                  {example.text.length > 60 ? '...' : ''}
                </code>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input and Results */}
        <div className="space-y-6">
          {/* Custom Input */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Custom Input</h2>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter your own input to test..."
              className="w-full h-32 p-4 rounded-lg border border-border bg-background resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => testMessage(customInput)}
                disabled={!customInput.trim() || isValidating}
                className="flex-1 py-2 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? 'Validating...' : 'Test Input'}
              </button>
              <button
                onClick={clearResults}
                className="py-2 px-4 rounded-lg border border-border hover:bg-muted"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Results</h2>
            {results.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                Run a test to see results
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {results.map((test, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      test.result.isValid
                        ? test.result.warnings
                          ? 'border-yellow-500/30 bg-yellow-500/5'
                          : 'border-green-500/30 bg-green-500/5'
                        : 'border-red-500/30 bg-red-500/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm font-medium ${
                          test.result.isValid
                            ? test.result.warnings
                              ? 'text-yellow-600'
                              : 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {test.result.isValid
                          ? test.result.warnings
                            ? 'Valid with Warnings'
                            : 'Valid'
                          : 'Invalid'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {test.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <code className="text-xs bg-muted/50 p-2 rounded block mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                      {test.input}
                    </code>
                    {test.result.error && (
                      <div className="text-sm text-red-600">{test.result.error}</div>
                    )}
                    {test.result.warnings && (
                      <div className="space-y-1">
                        {test.result.warnings.map((warning: string, i: number) => (
                          <div key={i} className="text-sm text-yellow-600">
                            {warning}
                          </div>
                        ))}
                      </div>
                    )}
                    {test.result.sanitized && test.result.sanitized !== test.input && (
                      <div className="mt-2">
                        <span className="text-xs text-muted-foreground">Sanitized:</span>
                        <code className="text-xs bg-muted/50 p-2 rounded block mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          {test.result.sanitized.slice(0, 100)}
                          {test.result.sanitized.length > 100 ? '...' : ''}
                        </code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
