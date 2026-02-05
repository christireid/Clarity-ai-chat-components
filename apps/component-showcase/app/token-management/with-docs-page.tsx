'use client'

/**
 * Example integration of Documentation Viewer with component demos
 * This shows how to enhance any showcase page with inline documentation
 */

import { useState } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import { DocumentationViewer } from '@/components/docs'
import { getComponentDocs } from '@/lib/component-docs-data'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  cn,
} from '@clarity-chat/primitives'
import { Coins, Info, Code, BookOpen } from 'lucide-react'

export default function TokenManagementWithDocsPage() {
  const [showDocs, setShowDocs] = useState(false)
  const [tokens, setTokens] = useState(1847)
  const maxTokens = 4096

  // Get documentation for TokenCounter component
  const tokenCounterDocs = getComponentDocs('TokenCounter')

  const percentage = (tokens / maxTokens) * 100

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Token Management"
        description="Track and optimize token usage with real-time counters, budgets, and cost calculators."
        icon={Coins}
        badge="Production Ready"
      />

      {/* Toggle Documentation Button */}
      <div className="flex justify-end mb-6">
        <Button
          onClick={() => setShowDocs(!showDocs)}
          variant="outline"
          className="gap-2"
        >
          <BookOpen className="h-4 w-4" />
          {showDocs ? 'Hide' : 'Show'} Documentation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demo Section */}
        <ComponentSection
          title="Live Demo"
          description="Interactive token counter component"
          icon={Code}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Token Counter</CardTitle>
              <CardDescription>
                Real-time token counting for messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Visual Token Display */}
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold gradient-text">
                    {tokens.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    of {maxTokens.toLocaleString()} tokens
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-300 rounded-full',
                        percentage < 50
                          ? 'bg-green-500'
                          : percentage < 80
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percentage.toFixed(1)}% used</span>
                    <span>{(maxTokens - tokens).toLocaleString()} remaining</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => setTokens(Math.max(0, tokens - 500))}
                  >
                    -500
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      setTokens(Math.min(maxTokens, tokens + 500))
                    }
                  >
                    +500
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setTokens(0)}
                    className="ml-auto"
                  >
                    Reset
                  </Button>
                </div>

                {/* Status */}
                {percentage > 80 && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
                    <Info className="h-4 w-4 shrink-0" />
                    <span>Approaching token limit</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </ComponentSection>

        {/* Documentation Section */}
        {showDocs && tokenCounterDocs && (
          <div className="lg:col-span-1">
            <ComponentSection
              title="Component Documentation"
              description="Props, examples, and best practices"
              icon={BookOpen}
            >
              <DocumentationViewer docs={tokenCounterDocs} />
            </ComponentSection>
          </div>
        )}
      </div>

      {/* Usage Tips */}
      {!showDocs && (
        <ComponentSection
          title="Quick Tips"
          description="How to use token management components effectively"
          className="mt-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Real-time Updates
              </h4>
              <p className="text-sm text-muted-foreground">
                Token counters update automatically as users type, providing
                immediate feedback on usage.
              </p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Visual Warnings
              </h4>
              <p className="text-sm text-muted-foreground">
                Color-coded indicators help users understand their token usage at
                a glance.
              </p>
            </div>
          </div>
        </ComponentSection>
      )}
    </div>
  )
}
