'use client'

import { useState } from 'react'
import { ComponentSection } from '@/components/component-section'
import {
  Eye,
  Keyboard,
  Volume2,
  Contrast,
  Focus,
  CheckCircle2,
  Image,
  Code2,
  AlertCircle,
  XCircle,
  Zap,
  Settings,
  Download,
  Play,
} from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import { AccessibilityInspector } from './components/AccessibilityInspector'
import { ARIAViewer } from './components/ARIAViewer'
import { KeyboardTester } from './components/KeyboardTester'
import { ScreenReaderPreview } from './components/ScreenReaderPreview'
import { ContrastChecker } from './components/ContrastChecker'
import { FocusIndicatorTester } from './components/FocusIndicatorTester'
import { WCAGComplianceChecker } from './components/WCAGComplianceChecker'
import { AltTextValidator } from './components/AltTextValidator'
import { SemanticHTMLAnalyzer } from './components/SemanticHTMLAnalyzer'

export default function AccessibilityPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  const tools = [
    {
      id: 'inspector',
      name: 'Accessibility Inspector',
      icon: Eye,
      description: 'Inspect component accessibility tree and properties',
      color: 'text-blue-500',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      component: AccessibilityInspector,
    },
    {
      id: 'aria',
      name: 'ARIA Attributes Viewer',
      icon: Code2,
      description: 'View all ARIA attributes and their values',
      color: 'text-purple-500',
      gradient: 'from-purple-500/20 to-violet-500/20',
      component: ARIAViewer,
    },
    {
      id: 'keyboard',
      name: 'Keyboard Navigation Tester',
      icon: Keyboard,
      description: 'Test keyboard navigation and shortcuts',
      color: 'text-green-500',
      gradient: 'from-green-500/20 to-emerald-500/20',
      component: KeyboardTester,
    },
    {
      id: 'screen-reader',
      name: 'Screen Reader Preview',
      icon: Volume2,
      description: 'Preview how screen readers interpret content',
      color: 'text-orange-500',
      gradient: 'from-orange-500/20 to-amber-500/20',
      component: ScreenReaderPreview,
    },
    {
      id: 'contrast',
      name: 'Color Contrast Checker',
      icon: Contrast,
      description: 'Check color contrast ratios for WCAG compliance',
      color: 'text-pink-500',
      gradient: 'from-pink-500/20 to-rose-500/20',
      component: ContrastChecker,
    },
    {
      id: 'focus',
      name: 'Focus Indicator Tester',
      icon: Focus,
      description: 'Test focus indicators and keyboard navigation',
      color: 'text-cyan-500',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      component: FocusIndicatorTester,
    },
    {
      id: 'wcag',
      name: 'WCAG Compliance Checker',
      icon: CheckCircle2,
      description: 'Check WCAG 2.1 Level AA/AAA compliance',
      color: 'text-indigo-500',
      gradient: 'from-indigo-500/20 to-purple-500/20',
      component: WCAGComplianceChecker,
    },
    {
      id: 'alt-text',
      name: 'Alternative Text Validator',
      icon: Image,
      description: 'Validate alt text for images and media',
      color: 'text-yellow-500',
      gradient: 'from-yellow-500/20 to-orange-500/20',
      component: AltTextValidator,
    },
    {
      id: 'semantic',
      name: 'Semantic HTML Analyzer',
      icon: Settings,
      description: 'Analyze semantic HTML structure and landmarks',
      color: 'text-teal-500',
      gradient: 'from-teal-500/20 to-cyan-500/20',
      component: SemanticHTMLAnalyzer,
    },
  ]

  const SelectedToolComponent = tools.find((t) => t.id === selectedTool)?.component

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="glass-card p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="icon-container">
            <Eye className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Accessibility Testing Tools</h1>
            <p className="text-muted-foreground text-lg">
              Comprehensive tools to help you build accessible components that meet WCAG standards.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4">
            <p className="text-2xl font-bold gradient-text">{tools.length}</p>
            <p className="text-sm text-muted-foreground">Testing Tools</p>
          </div>
          <div className="glass-panel p-4">
            <p className="text-2xl font-bold text-green-500">AAA</p>
            <p className="text-sm text-muted-foreground">WCAG Level</p>
          </div>
          <div className="glass-panel p-4">
            <p className="text-2xl font-bold text-blue-500">100%</p>
            <p className="text-sm text-muted-foreground">Coverage</p>
          </div>
          <div className="glass-panel p-4">
            <p className="text-2xl font-bold text-purple-500">Real-time</p>
            <p className="text-sm text-muted-foreground">Analysis</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-lg gradient-accent text-white text-sm font-medium flex items-center gap-2">
            <Play className="h-4 w-4" />
            Run All Tests
          </button>
          <button className="px-4 py-2 rounded-lg glass text-sm font-medium flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </button>
          <button className="px-4 py-2 rounded-lg glass text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Auto-fix Issues
          </button>
        </div>
      </div>

      {/* Tools Grid */}
      <ComponentSection title="Testing Tools" description="Select a tool to start testing">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id === selectedTool ? null : tool.id)}
              className={cn(
                'feature-card text-left cursor-pointer transition-all',
                selectedTool === tool.id && 'ring-2 ring-primary'
              )}
            >
              <div
                className={cn(
                  'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br',
                  tool.gradient
                )}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn('icon-container-sm', tool.color)}>
                    <tool.icon className="h-5 w-5" />
                  </div>
                  {selectedTool === tool.id && (
                    <span className="badge-glass text-xs text-green-500">Active</span>
                  )}
                </div>

                <h3 className="font-semibold mb-1">{tool.name}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
            </button>
          ))}
        </div>
      </ComponentSection>

      {/* Selected Tool Display */}
      {SelectedToolComponent && (
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {tools.find((t) => t.id === selectedTool)?.name}
            </h2>
            <button
              onClick={() => setSelectedTool(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
          <SelectedToolComponent />
        </div>
      )}

      {/* WCAG Guidelines Reference */}
      <ComponentSection
        title="WCAG Guidelines Reference"
        description="Quick reference for accessibility standards"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-container-sm text-green-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Level A (Required)</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Keyboard accessible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Text alternatives for non-text content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Distinguishable content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Navigable structure</span>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-container-sm text-blue-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Level AA (Recommended)</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>4.5:1 contrast ratio for text</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Resize text up to 200%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Multiple ways to navigate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Consistent navigation</span>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-container-sm text-purple-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Level AAA (Enhanced)</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>7:1 contrast ratio for text</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>Enhanced focus indicators</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>Section headings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>No timing requirements</span>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-container-sm text-orange-500">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Common Issues</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <span>Missing ARIA labels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <span>Poor color contrast</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <span>Keyboard traps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <span>Missing alt text</span>
              </li>
            </ul>
          </div>
        </div>
      </ComponentSection>

      {/* Best Practices */}
      <ComponentSection
        title="Accessibility Best Practices"
        description="Follow these guidelines for better accessibility"
      >
        <div className="space-y-4">
          {[
            {
              title: 'Use Semantic HTML',
              description:
                'Use proper HTML elements (button, nav, header) instead of generic divs',
              icon: Code2,
              color: 'text-blue-500',
            },
            {
              title: 'Provide Text Alternatives',
              description: 'Add alt text for images and aria-labels for icon buttons',
              icon: Image,
              color: 'text-green-500',
            },
            {
              title: 'Ensure Keyboard Navigation',
              description:
                'All interactive elements should be accessible via keyboard',
              icon: Keyboard,
              color: 'text-purple-500',
            },
            {
              title: 'Test with Screen Readers',
              description: 'Verify content makes sense when read by screen readers',
              icon: Volume2,
              color: 'text-orange-500',
            },
            {
              title: 'Check Color Contrast',
              description: 'Maintain 4.5:1 contrast ratio for normal text',
              icon: Contrast,
              color: 'text-pink-500',
            },
            {
              title: 'Provide Clear Focus Indicators',
              description: 'Make focus states visible and distinguishable',
              icon: Focus,
              color: 'text-cyan-500',
            },
          ].map((practice, index) => (
            <div key={index} className="glass-panel p-4 flex items-start gap-4">
              <div className={cn('icon-container-sm', practice.color)}>
                <practice.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{practice.title}</h3>
                <p className="text-sm text-muted-foreground">{practice.description}</p>
              </div>
            </div>
          ))}
        </div>
      </ComponentSection>
    </div>
  )
}
