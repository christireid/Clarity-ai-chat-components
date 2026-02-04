/**
 * Code Assistant Example
 *
 * A complete code assistant implementation showing:
 * - Code explanation and documentation generation
 * - Refactoring suggestions with before/after
 * - Bug detection and fix recommendations
 * - Test generation for existing code
 * - Real-time code analysis
 *
 * Use Cases:
 * - Software Development: Help developers understand and improve code
 * - Code Review: Automated code quality checks
 * - Learning: Educational tool for understanding code patterns
 */

'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { ClarityChatApp } from '@clarity-chat/react'
import { motion, AnimatePresence } from 'framer-motion'

// ============================================================================
// Types
// ============================================================================

type AssistantMode =
  | 'explain'
  | 'refactor'
  | 'debug'
  | 'test'
  | 'document'
  | 'analyze'

interface CodeSample {
  id: string
  title: string
  language: string
  code: string
  description: string
}

interface AnalysisResult {
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
  line?: number
  suggestion?: string
}

interface RefactoringSuggestion {
  title: string
  description: string
  before: string
  after: string
  benefit: string
}

// ============================================================================
// Sample Code
// ============================================================================

const CODE_SAMPLES: CodeSample[] = [
  {
    id: 'react-component',
    title: 'React Component',
    language: 'typescript',
    description: 'A simple React counter component',
    code: `function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  )
}`,
  },
  {
    id: 'api-handler',
    title: 'API Handler',
    language: 'typescript',
    description: 'A Next.js API route handler',
    code: `export async function POST(request: Request) {
  const body = await request.json()

  const result = await db.users.create({
    data: {
      name: body.name,
      email: body.email
    }
  })

  return Response.json(result)
}`,
  },
  {
    id: 'utility-function',
    title: 'Utility Function',
    language: 'typescript',
    description: 'A function to format dates',
    code: `function formatDate(date) {
  const d = new Date(date)
  return d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear()
}`,
  },
]

// ============================================================================
// Mock Analysis Engine
// ============================================================================

function analyzeCode(code: string, mode: AssistantMode): AnalysisResult[] {
  const results: AnalysisResult[] = []

  // Simulate code analysis
  if (mode === 'debug') {
    if (code.includes('setCount(count + 1)')) {
      results.push({
        type: 'warning',
        message: 'Potential stale closure bug in state update',
        line: 4,
        suggestion: 'Use functional setState: setCount(prev => prev + 1)',
      })
    }
    if (code.includes('await') && !code.includes('try')) {
      results.push({
        type: 'error',
        message: 'Unhandled promise rejection',
        line: 2,
        suggestion: 'Wrap async operations in try-catch block',
      })
    }
    if (!code.includes('validation')) {
      results.push({
        type: 'warning',
        message: 'Missing input validation',
        suggestion: 'Add validation for user inputs',
      })
    }
  }

  if (mode === 'analyze') {
    results.push({
      type: 'info',
      message: `Code complexity: ${code.split('\n').length} lines`,
    })
    results.push({
      type: 'info',
      message: `Functions detected: ${(code.match(/function|const.*=.*\(/g) || []).length}`,
    })
    if (code.includes('useState')) {
      results.push({
        type: 'info',
        message: 'React hooks detected',
      })
    }
  }

  return results
}

function generateRefactoringSuggestions(code: string): RefactoringSuggestion[] {
  const suggestions: RefactoringSuggestion[] = []

  if (code.includes('setCount(count + 1)')) {
    suggestions.push({
      title: 'Use Functional State Update',
      description: 'Avoid stale closure by using functional setState',
      before: 'setCount(count + 1)',
      after: 'setCount(prev => prev + 1)',
      benefit: 'Prevents bugs when multiple updates happen quickly',
    })
  }

  if (code.includes('new Date(date)') && !code.includes('try')) {
    suggestions.push({
      title: 'Add Error Handling',
      description: 'Handle invalid date inputs gracefully',
      before: `function formatDate(date) {
  const d = new Date(date)
  return d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear()
}`,
      after: `function formatDate(date: string | Date): string | null {
  try {
    const d = date instanceof Date ? date : new Date(date)
    if (isNaN(d.getTime())) return null
    return \`\${d.getMonth() + 1}/\${d.getDate()}/\${d.getFullYear()}\`
  } catch {
    return null
  }
}`,
      benefit: 'Prevents runtime errors from invalid dates',
    })
  }

  if (code.includes('await') && !code.includes('validate')) {
    suggestions.push({
      title: 'Add Input Validation',
      description: 'Validate request body before database operation',
      before: `const body = await request.json()

const result = await db.users.create({
  data: { name: body.name, email: body.email }
})`,
      after: `const body = await request.json()

// Validate input
if (!body.name || !body.email) {
  return Response.json(
    { error: 'Name and email are required' },
    { status: 400 }
  )
}

const result = await db.users.create({
  data: { name: body.name, email: body.email }
})`,
      benefit: 'Prevents invalid data from reaching database',
    })
  }

  return suggestions
}

// ============================================================================
// Components
// ============================================================================

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  readOnly?: boolean
}

function CodeEditor({ value, onChange, language, readOnly }: CodeEditorProps) {
  return (
    <div className="relative rounded-lg border border-border bg-muted/30">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-sm font-medium text-muted-foreground">
          {language}
        </span>
        {!readOnly && (
          <button
            onClick={() => navigator.clipboard.writeText(value)}
            className="text-sm text-primary hover:underline"
          >
            Copy
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className="w-full resize-none bg-transparent p-4 font-mono text-sm text-foreground focus:outline-none"
        rows={12}
        spellCheck={false}
      />
    </div>
  )
}

interface AnalysisResultsProps {
  results: AnalysisResult[]
}

function AnalysisResults({ results }: AnalysisResultsProps) {
  if (results.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-2"
    >
      {results.map((result, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          className={`rounded-lg border p-3 ${
            result.type === 'error'
              ? 'border-red-500/50 bg-red-500/10'
              : result.type === 'warning'
                ? 'border-yellow-500/50 bg-yellow-500/10'
                : result.type === 'success'
                  ? 'border-green-500/50 bg-green-500/10'
                  : 'border-blue-500/50 bg-blue-500/10'
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="text-lg">
              {result.type === 'error'
                ? '❌'
                : result.type === 'warning'
                  ? '⚠️'
                  : result.type === 'success'
                    ? '✅'
                    : 'ℹ️'}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {result.line && `Line ${result.line}: `}
                {result.message}
              </p>
              {result.suggestion && (
                <p className="mt-1 text-sm text-muted-foreground">
                  💡 {result.suggestion}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

interface RefactoringSuggestionsProps {
  suggestions: RefactoringSuggestion[]
}

function RefactoringSuggestions({ suggestions }: RefactoringSuggestionsProps) {
  if (suggestions.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold">Refactoring Suggestions</h3>
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="rounded-lg border border-border bg-card p-4"
        >
          <h4 className="mb-2 font-medium">{suggestion.title}</h4>
          <p className="mb-3 text-sm text-muted-foreground">
            {suggestion.description}
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <div className="mb-1 text-xs font-medium text-red-500">
                Before
              </div>
              <pre className="overflow-x-auto rounded border border-red-500/30 bg-red-500/5 p-2 text-xs">
                <code>{suggestion.before}</code>
              </pre>
            </div>
            <div>
              <div className="mb-1 text-xs font-medium text-green-500">
                After
              </div>
              <pre className="overflow-x-auto rounded border border-green-500/30 bg-green-500/5 p-2 text-xs">
                <code>{suggestion.after}</code>
              </pre>
            </div>
          </div>

          <div className="mt-3 rounded bg-blue-500/10 px-3 py-2 text-sm">
            <span className="font-medium">Benefit: </span>
            {suggestion.benefit}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function CodeAssistantExample() {
  const [selectedSample, setSelectedSample] = useState(CODE_SAMPLES[0])
  const [currentCode, setCurrentCode] = useState(CODE_SAMPLES[0].code)
  const [mode, setMode] = useState<AssistantMode>('explain')
  const [showAnalysis, setShowAnalysis] = useState(false)

  // Analyze code when mode changes
  const analysisResults = useMemo(
    () => analyzeCode(currentCode, mode),
    [currentCode, mode]
  )

  const refactoringSuggestions = useMemo(
    () => generateRefactoringSuggestions(currentCode),
    [currentCode]
  )

  const handleSampleChange = useCallback((sample: CodeSample) => {
    setSelectedSample(sample)
    setCurrentCode(sample.code)
    setShowAnalysis(false)
  }, [])

  const handleAnalyze = useCallback(() => {
    setShowAnalysis(true)
  }, [])

  const systemPrompt = `You are an expert code assistant helping developers understand, improve, and debug their code.

Current mode: ${mode}

Based on the mode, provide:
- explain: Clear explanations of how the code works
- refactor: Suggestions for improving code quality and structure
- debug: Identify potential bugs and issues
- test: Generate test cases for the code
- document: Create documentation and JSDoc comments
- analyze: Provide detailed code analysis

Always be specific, actionable, and educational. Include code examples when helpful.`

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <h1 className="mb-2 text-3xl font-bold">Code Assistant</h1>
          <p className="text-muted-foreground">
            AI-powered code explanation, refactoring, debugging, and test
            generation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Code Editor & Controls */}
          <div className="space-y-6 lg:col-span-2">
            {/* Sample Selector */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Code Sample
              </label>
              <select
                value={selectedSample.id}
                onChange={(e) => {
                  const sample = CODE_SAMPLES.find(
                    (s) => s.id === e.target.value
                  )
                  if (sample) handleSampleChange(sample)
                }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                {CODE_SAMPLES.map((sample) => (
                  <option key={sample.id} value={sample.id}>
                    {sample.title} - {sample.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Selector */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Assistant Mode
              </label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {(
                  [
                    'explain',
                    'refactor',
                    'debug',
                    'test',
                    'document',
                    'analyze',
                  ] as AssistantMode[]
                ).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m)
                      setShowAnalysis(false)
                    }}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      mode === m
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background hover:bg-muted'
                    }`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Editor */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium">Your Code</label>
                <button
                  onClick={handleAnalyze}
                  className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Analyze Code
                </button>
              </div>
              <CodeEditor
                value={currentCode}
                onChange={setCurrentCode}
                language={selectedSample.language}
              />
            </div>

            {/* Analysis Results */}
            <AnimatePresence>
              {showAnalysis && mode === 'debug' && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Analysis Results
                  </h3>
                  <AnalysisResults results={analysisResults} />
                </div>
              )}

              {showAnalysis && mode === 'refactor' && (
                <RefactoringSuggestions suggestions={refactoringSuggestions} />
              )}

              {showAnalysis && mode === 'analyze' && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Code Metrics</h3>
                  <AnalysisResults results={analysisResults} />
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Chat Interface */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <h3 className="mb-3 text-lg font-semibold">Ask the Assistant</h3>
              <div className="rounded-lg border border-border bg-card">
                <ClarityChatApp
                  api="/api/code-assistant"
                  features={{
                    memory: true,
                    streaming: true,
                  }}
                  systemPrompt={systemPrompt}
                  placeholder={`Ask about this ${mode === 'explain' ? 'code...' : mode === 'refactor' ? 'refactoring...' : mode === 'debug' ? 'bug...' : mode === 'test' ? 'test case...' : mode === 'document' ? 'documentation...' : 'analysis...'}`}
                  className="h-[600px]"
                  initialMessages={[
                    {
                      role: 'assistant',
                      content: `I'm ready to help you ${mode === 'explain' ? 'understand this code' : mode === 'refactor' ? 'improve this code' : mode === 'debug' ? 'find and fix bugs' : mode === 'test' ? 'write tests' : mode === 'document' ? 'document this code' : 'analyze this code'}. What would you like to know?`,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold">Use Cases</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Software Development',
                description:
                  'Help developers understand unfamiliar code, suggest improvements, and catch bugs early',
                icon: '💻',
              },
              {
                title: 'Code Review',
                description:
                  'Automated code quality checks, security analysis, and best practice recommendations',
                icon: '🔍',
              },
              {
                title: 'Learning & Education',
                description:
                  'Educational tool for understanding code patterns, algorithms, and best practices',
                icon: '📚',
              },
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border border-border bg-card p-6"
              >
                <div className="mb-3 text-3xl">{useCase.icon}</div>
                <h3 className="mb-2 font-semibold">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold">Features</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: 'Code Explanation',
                description:
                  'Get clear, line-by-line explanations of how code works',
              },
              {
                title: 'Refactoring Suggestions',
                description:
                  'Identify opportunities to improve code structure and quality',
              },
              {
                title: 'Bug Detection',
                description:
                  'Find potential bugs, edge cases, and logic errors automatically',
              },
              {
                title: 'Test Generation',
                description: 'Generate comprehensive test cases for your code',
              },
              {
                title: 'Documentation',
                description:
                  'Create JSDoc comments and documentation automatically',
              },
              {
                title: 'Code Analysis',
                description:
                  'Get insights into complexity, performance, and maintainability',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 rounded-lg border border-border bg-card p-4"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  ✓
                </div>
                <div>
                  <h4 className="mb-1 font-medium">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
