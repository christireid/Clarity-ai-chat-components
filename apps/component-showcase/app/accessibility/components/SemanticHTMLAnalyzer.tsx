'use client'

import { useState } from 'react'
import { Code2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface SemanticIssue {
  element: string
  issue: string
  suggestion: string
  severity: 'error' | 'warning' | 'info'
  code: {
    bad: string
    good: string
  }
}

export function SemanticHTMLAnalyzer() {
  const [htmlInput, setHtmlInput] = useState('')

  const demoIssues: SemanticIssue[] = [
    {
      element: '<div onclick="...">',
      issue: 'Non-semantic clickable element',
      suggestion: 'Use <button> element for interactive actions',
      severity: 'error',
      code: {
        bad: '<div onclick="handleClick()">Click me</div>',
        good: '<button onClick="handleClick()">Click me</button>',
      },
    },
    {
      element: '<div class="header">',
      issue: 'Generic container used for header',
      suggestion: 'Use <header> element for page header',
      severity: 'warning',
      code: {
        bad: '<div class="header">...</div>',
        good: '<header>...</header>',
      },
    },
    {
      element: '<div class="nav">',
      issue: 'Generic container used for navigation',
      suggestion: 'Use <nav> element for navigation',
      severity: 'warning',
      code: {
        bad: '<div class="nav">...</div>',
        good: '<nav>...</nav>',
      },
    },
    {
      element: '<div role="button">',
      issue: 'ARIA role used instead of semantic element',
      suggestion: 'Use native <button> instead of div with role',
      severity: 'error',
      code: {
        bad: '<div role="button" tabindex="0">Click</div>',
        good: '<button>Click</button>',
      },
    },
    {
      element: '<b>Important</b>',
      issue: 'Presentational element used for emphasis',
      suggestion: 'Use <strong> for importance, <em> for emphasis',
      severity: 'info',
      code: {
        bad: '<b>Important text</b>',
        good: '<strong>Important text</strong>',
      },
    },
    {
      element: '<div class="article">',
      issue: 'Generic container used for article',
      suggestion: 'Use <article> element for self-contained content',
      severity: 'warning',
      code: {
        bad: '<div class="article">...</div>',
        good: '<article>...</article>',
      },
    },
  ]

  const landmarkElements = [
    {
      element: '<header>',
      purpose: 'Site or page header',
      aria: 'role="banner"',
      required: true,
    },
    {
      element: '<nav>',
      purpose: 'Navigation links',
      aria: 'role="navigation"',
      required: true,
    },
    {
      element: '<main>',
      purpose: 'Main content',
      aria: 'role="main"',
      required: true,
    },
    {
      element: '<aside>',
      purpose: 'Complementary content',
      aria: 'role="complementary"',
      required: false,
    },
    {
      element: '<footer>',
      purpose: 'Site or page footer',
      aria: 'role="contentinfo"',
      required: true,
    },
    {
      element: '<section>',
      purpose: 'Thematic grouping',
      aria: 'role="region"',
      required: false,
    },
    {
      element: '<article>',
      purpose: 'Self-contained content',
      aria: 'role="article"',
      required: false,
    },
    {
      element: '<form>',
      purpose: 'Form content',
      aria: 'role="form"',
      required: false,
    },
  ]

  const semanticElements = [
    { category: 'Document Structure', elements: ['<header>', '<nav>', '<main>', '<aside>', '<footer>', '<section>', '<article>'] },
    { category: 'Text Content', elements: ['<h1>-<h6>', '<p>', '<blockquote>', '<pre>', '<code>'] },
    { category: 'Lists', elements: ['<ul>', '<ol>', '<li>', '<dl>', '<dt>', '<dd>'] },
    { category: 'Tables', elements: ['<table>', '<thead>', '<tbody>', '<tfoot>', '<tr>', '<th>', '<td>'] },
    { category: 'Forms', elements: ['<form>', '<label>', '<input>', '<textarea>', '<button>', '<select>'] },
    { category: 'Media', elements: ['<img>', '<picture>', '<audio>', '<video>', '<figure>', '<figcaption>'] },
  ]

  return (
    <div className="space-y-6">
      {/* HTML Input Analyzer */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Analyze HTML Structure</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Paste HTML to analyze:
            </label>
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="<div>Your HTML here...</div>"
              rows={6}
              className="w-full px-3 py-2 rounded-lg glass font-mono text-sm resize-none"
            />
          </div>
          <button className="px-4 py-2 rounded-lg gradient-accent text-white text-sm font-medium">
            Analyze Structure
          </button>
        </div>
      </div>

      {/* Issue Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel p-4 border-l-4 border-red-500">
          <p className="text-2xl font-bold text-red-500">
            {demoIssues.filter((i) => i.severity === 'error').length}
          </p>
          <p className="text-sm text-muted-foreground">Errors</p>
        </div>
        <div className="glass-panel p-4 border-l-4 border-orange-500">
          <p className="text-2xl font-bold text-orange-500">
            {demoIssues.filter((i) => i.severity === 'warning').length}
          </p>
          <p className="text-sm text-muted-foreground">Warnings</p>
        </div>
        <div className="glass-panel p-4 border-l-4 border-blue-500">
          <p className="text-2xl font-bold text-blue-500">
            {demoIssues.filter((i) => i.severity === 'info').length}
          </p>
          <p className="text-sm text-muted-foreground">Suggestions</p>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        <h3 className="font-semibold">Semantic Issues Found</h3>
        {demoIssues.map((issue, index) => (
          <div
            key={index}
            className={cn(
              'glass-panel p-4 border-l-4',
              issue.severity === 'error' && 'border-red-500',
              issue.severity === 'warning' && 'border-orange-500',
              issue.severity === 'info' && 'border-blue-500'
            )}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className={cn(
                  'icon-container-sm',
                  issue.severity === 'error' && 'text-red-500',
                  issue.severity === 'warning' && 'text-orange-500',
                  issue.severity === 'info' && 'text-blue-500'
                )}
              >
                {issue.severity === 'error' && <XCircle className="h-4 w-4" />}
                {issue.severity === 'warning' && <AlertTriangle className="h-4 w-4" />}
                {issue.severity === 'info' && <CheckCircle2 className="h-4 w-4" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <code className="font-mono text-sm badge-glass">{issue.element}</code>
                  <span className="badge-glass text-xs capitalize">{issue.severity}</span>
                </div>
                <p className="text-sm mb-2">{issue.issue}</p>
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>Fix:</strong> {issue.suggestion}
                </p>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="glass-panel p-3 bg-background/30">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-3 w-3 text-red-500" />
                      <p className="text-xs font-medium">Bad Example</p>
                    </div>
                    <code className="text-xs font-mono text-muted-foreground break-all">
                      {issue.code.bad}
                    </code>
                  </div>
                  <div className="glass-panel p-3 bg-background/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <p className="text-xs font-medium">Good Example</p>
                    </div>
                    <code className="text-xs font-mono text-muted-foreground break-all">
                      {issue.code.good}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Landmark Elements */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Landmark Elements</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Landmark elements help screen readers navigate your page structure
        </p>
        <div className="space-y-2">
          {landmarkElements.map((landmark, index) => (
            <div key={index} className="glass-panel p-3 bg-background/30">
              <div className="flex items-center justify-between mb-2">
                <code className="font-mono text-sm">{landmark.element}</code>
                <span
                  className={cn(
                    'badge-glass text-xs',
                    landmark.required ? 'text-orange-500' : 'text-blue-500'
                  )}
                >
                  {landmark.required ? 'Required' : 'Optional'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{landmark.purpose}</p>
              <code className="text-xs font-mono text-muted-foreground">
                {landmark.aria}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Semantic Elements Reference */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Semantic Elements Reference</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {semanticElements.map((category, index) => (
            <div key={index} className="glass-panel p-4 bg-background/30">
              <h4 className="font-semibold text-sm mb-3">{category.category}</h4>
              <div className="flex flex-wrap gap-2">
                {category.elements.map((element, i) => (
                  <code
                    key={i}
                    className="badge-glass text-xs font-mono"
                  >
                    {element}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Semantic HTML Best Practices</h3>
        <div className="space-y-3">
          <div className="glass-panel p-4 bg-background/30">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Do Use Semantic Elements
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Use <code>&lt;button&gt;</code> for clickable actions</li>
              <li>• Use <code>&lt;nav&gt;</code> for navigation areas</li>
              <li>• Use <code>&lt;main&gt;</code> for primary content</li>
              <li>• Use heading hierarchy (<code>&lt;h1&gt;</code>-<code>&lt;h6&gt;</code>)</li>
              <li>• Use <code>&lt;article&gt;</code> for standalone content</li>
            </ul>
          </div>

          <div className="glass-panel p-4 bg-background/30">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Avoid Generic Elements
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Don't use <code>&lt;div&gt;</code> for interactive elements</li>
              <li>• Don't skip heading levels</li>
              <li>• Don't use tables for layout</li>
              <li>• Don't use <code>&lt;br&gt;</code> for spacing</li>
              <li>• Don't use presentational elements (<code>&lt;b&gt;</code>, <code>&lt;i&gt;</code>)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Document Outline */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Proper Document Outline</h3>
        <div className="glass-panel p-4 bg-background/30 font-mono text-sm">
          <pre className="text-muted-foreground">
{`<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <header>
      <nav>
        <!-- Navigation -->
      </nav>
    </header>

    <main>
      <h1>Main Heading</h1>

      <article>
        <h2>Article Heading</h2>
        <p>Content...</p>
      </article>

      <aside>
        <!-- Sidebar content -->
      </aside>
    </main>

    <footer>
      <!-- Footer content -->
    </footer>
  </body>
</html>`}
          </pre>
        </div>
      </div>
    </div>
  )
}
