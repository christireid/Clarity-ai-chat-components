'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Download } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface ComplianceIssue {
  id: string
  level: 'A' | 'AA' | 'AAA'
  criterion: string
  description: string
  status: 'pass' | 'fail' | 'warning'
  element?: string
  fix?: string
}

export function WCAGComplianceChecker() {
  const [selectedLevel, setSelectedLevel] = useState<'A' | 'AA' | 'AAA'>('AA')

  const issues: ComplianceIssue[] = [
    {
      id: '1.1.1',
      level: 'A',
      criterion: 'Non-text Content',
      description: 'All images have appropriate alt text',
      status: 'pass',
      element: 'img[src="/logo.png"]',
    },
    {
      id: '1.3.1',
      level: 'A',
      criterion: 'Info and Relationships',
      description: 'Semantic HTML elements used correctly',
      status: 'pass',
    },
    {
      id: '1.4.3',
      level: 'AA',
      criterion: 'Contrast (Minimum)',
      description: 'Text has 4.5:1 contrast ratio',
      status: 'warning',
      element: '.muted-text',
      fix: 'Increase contrast to meet 4.5:1 requirement',
    },
    {
      id: '1.4.6',
      level: 'AAA',
      criterion: 'Contrast (Enhanced)',
      description: 'Text has 7:1 contrast ratio',
      status: 'fail',
      element: '.secondary-text',
      fix: 'Use darker color to achieve 7:1 contrast',
    },
    {
      id: '2.1.1',
      level: 'A',
      criterion: 'Keyboard',
      description: 'All functionality available via keyboard',
      status: 'pass',
    },
    {
      id: '2.1.2',
      level: 'A',
      criterion: 'No Keyboard Trap',
      description: 'No keyboard focus traps detected',
      status: 'pass',
    },
    {
      id: '2.4.1',
      level: 'A',
      criterion: 'Bypass Blocks',
      description: 'Skip navigation link provided',
      status: 'fail',
      fix: 'Add skip to main content link',
    },
    {
      id: '2.4.3',
      level: 'A',
      criterion: 'Focus Order',
      description: 'Focus order is logical and intuitive',
      status: 'pass',
    },
    {
      id: '2.4.7',
      level: 'AA',
      criterion: 'Focus Visible',
      description: 'Focus indicators are clearly visible',
      status: 'pass',
    },
    {
      id: '3.1.1',
      level: 'A',
      criterion: 'Language of Page',
      description: 'Page language is identified',
      status: 'pass',
      element: '<html lang="en">',
    },
    {
      id: '3.2.3',
      level: 'AA',
      criterion: 'Consistent Navigation',
      description: 'Navigation is consistent across pages',
      status: 'pass',
    },
    {
      id: '3.3.1',
      level: 'A',
      criterion: 'Error Identification',
      description: 'Form errors are clearly identified',
      status: 'warning',
      element: 'form.contact-form',
      fix: 'Add aria-describedby to link errors',
    },
    {
      id: '3.3.2',
      level: 'A',
      criterion: 'Labels or Instructions',
      description: 'Form fields have clear labels',
      status: 'pass',
    },
    {
      id: '4.1.1',
      level: 'A',
      criterion: 'Parsing',
      description: 'HTML is valid and well-formed',
      status: 'pass',
    },
    {
      id: '4.1.2',
      level: 'A',
      criterion: 'Name, Role, Value',
      description: 'All components have proper ARIA attributes',
      status: 'pass',
    },
  ]

  const filteredIssues = issues.filter((issue) => {
    if (selectedLevel === 'A') return issue.level === 'A'
    if (selectedLevel === 'AA') return issue.level === 'A' || issue.level === 'AA'
    return true
  })

  const stats = {
    total: filteredIssues.length,
    pass: filteredIssues.filter((i) => i.status === 'pass').length,
    warning: filteredIssues.filter((i) => i.status === 'warning').length,
    fail: filteredIssues.filter((i) => i.status === 'fail').length,
  }

  const complianceScore = Math.round((stats.pass / stats.total) * 100)

  return (
    <div className="space-y-6">
      {/* Level Selector */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">WCAG Conformance Level</h3>
        <div className="flex gap-3">
          {(['A', 'AA', 'AAA'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={cn(
                'px-6 py-3 rounded-lg font-medium transition-all',
                selectedLevel === level
                  ? 'gradient-accent text-white'
                  : 'glass hover:bg-primary/5'
              )}
            >
              Level {level}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          {selectedLevel === 'A' && 'Minimum level of conformance'}
          {selectedLevel === 'AA' && 'Recommended level for most websites'}
          {selectedLevel === 'AAA' && 'Highest level of conformance'}
        </p>
      </div>

      {/* Compliance Score */}
      <div className="glass-panel p-8">
        <div className="text-center mb-6">
          <div className="text-6xl font-bold gradient-text mb-2">{complianceScore}%</div>
          <p className="text-muted-foreground">Compliance Score</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="glass-panel p-4 border-l-4 border-green-500">
            <p className="text-2xl font-bold text-green-500">{stats.pass}</p>
            <p className="text-sm text-muted-foreground">Passing</p>
          </div>
          <div className="glass-panel p-4 border-l-4 border-orange-500">
            <p className="text-2xl font-bold text-orange-500">{stats.warning}</p>
            <p className="text-sm text-muted-foreground">Warnings</p>
          </div>
          <div className="glass-panel p-4 border-l-4 border-red-500">
            <p className="text-2xl font-bold text-red-500">{stats.fail}</p>
            <p className="text-sm text-muted-foreground">Failing</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="px-4 py-2 rounded-lg gradient-accent text-white text-sm font-medium">
          Run Full Audit
        </button>
        <button className="px-4 py-2 rounded-lg glass text-sm font-medium flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        <h3 className="font-semibold">Compliance Checklist</h3>
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className={cn(
              'glass-panel p-4 border-l-4',
              issue.status === 'pass' && 'border-green-500',
              issue.status === 'warning' && 'border-orange-500',
              issue.status === 'fail' && 'border-red-500'
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'icon-container-sm',
                    issue.status === 'pass' && 'text-green-500',
                    issue.status === 'warning' && 'text-orange-500',
                    issue.status === 'fail' && 'text-red-500'
                  )}
                >
                  {issue.status === 'pass' && <CheckCircle2 className="h-4 w-4" />}
                  {issue.status === 'warning' && <AlertCircle className="h-4 w-4" />}
                  {issue.status === 'fail' && <XCircle className="h-4 w-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{issue.criterion}</span>
                    <span className="badge-glass text-xs">{issue.id}</span>
                    <span className="badge-glass text-xs">Level {issue.level}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {issue.description}
                  </p>
                  {issue.element && (
                    <code className="text-xs font-mono glass-panel p-1 px-2 inline-block">
                      {issue.element}
                    </code>
                  )}
                  {issue.fix && (
                    <div className="mt-2 glass-panel p-2 bg-background/30">
                      <p className="text-xs font-medium mb-1">Suggested Fix:</p>
                      <p className="text-xs text-muted-foreground">{issue.fix}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Principles Summary */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">WCAG Principles (POUR)</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass-panel p-4 bg-background/30">
            <h4 className="font-semibold text-sm mb-2">1. Perceivable</h4>
            <p className="text-xs text-muted-foreground">
              Information and UI components must be presentable to users in ways they can
              perceive.
            </p>
          </div>
          <div className="glass-panel p-4 bg-background/30">
            <h4 className="font-semibold text-sm mb-2">2. Operable</h4>
            <p className="text-xs text-muted-foreground">
              UI components and navigation must be operable by all users.
            </p>
          </div>
          <div className="glass-panel p-4 bg-background/30">
            <h4 className="font-semibold text-sm mb-2">3. Understandable</h4>
            <p className="text-xs text-muted-foreground">
              Information and operation of UI must be understandable.
            </p>
          </div>
          <div className="glass-panel p-4 bg-background/30">
            <h4 className="font-semibold text-sm mb-2">4. Robust</h4>
            <p className="text-xs text-muted-foreground">
              Content must be robust enough to work with current and future technologies.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
