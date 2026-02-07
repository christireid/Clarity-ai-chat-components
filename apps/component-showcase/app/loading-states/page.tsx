'use client'

import { useState } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import { loadingStatesDocs } from '@/data/docs/loading-states-docs'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  cn,
} from '@clarity-chat/primitives'
import { Loader2, RefreshCw, Bot, MessageSquare } from 'lucide-react'

// ============================================================================
// SPINNER LOADERS DEMO
// ============================================================================
function SpinnerLoadersDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Spinner Loaders</CardTitle>
        <CardDescription>Various spinning loading indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-8">
          {/* Default Spinner */}
          <div className="text-center">
            <div className="h-16 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Default</p>
          </div>

          {/* Ring Spinner */}
          <div className="text-center">
            <div className="h-16 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Ring</p>
          </div>

          {/* Double Ring */}
          <div className="text-center">
            <div className="h-16 flex items-center justify-center relative">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin absolute" />
              <div
                className="w-5 h-5 border-2 border-primary/50 border-b-transparent rounded-full animate-spin animation-delay-150"
                style={{ animationDirection: 'reverse' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Double</p>
          </div>

          {/* Dots */}
          <div className="text-center">
            <div className="h-16 flex items-center justify-center gap-1">
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Dots</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SKELETON LOADERS DEMO
// ============================================================================
function SkeletonLoadersDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Skeleton Loaders</CardTitle>
        <CardDescription>Content placeholder animations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Text Skeleton */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Text Content</p>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-4/5" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/5" />
            </div>
          </div>

          {/* Card Skeleton */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Card</p>
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/4" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded animate-pulse w-full" />
                <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
              </div>
            </div>
          </div>

          {/* Message Skeleton */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Chat Message</p>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                <div className="p-3 bg-muted rounded-lg space-y-2">
                  <div className="h-3 bg-muted-foreground/10 rounded animate-pulse w-full" />
                  <div className="h-3 bg-muted-foreground/10 rounded animate-pulse w-4/5" />
                  <div className="h-3 bg-muted-foreground/10 rounded animate-pulse w-2/3" />
                </div>
              </div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Table</p>
            <div className="border rounded-lg overflow-hidden">
              <div className="p-3 bg-muted flex gap-4">
                <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-24" />
                <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-32" />
                <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-20" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 border-t flex gap-4">
                  <div className="h-4 bg-muted rounded animate-pulse w-24" />
                  <div className="h-4 bg-muted rounded animate-pulse w-32" />
                  <div className="h-4 bg-muted rounded animate-pulse w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SHIMMER EFFECTS DEMO
// ============================================================================
function ShimmerEffectsDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Shimmer Effects</CardTitle>
        <CardDescription>Gradient-based loading animations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Shimmer */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Basic Shimmer</p>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-4 rounded relative overflow-hidden bg-muted"
                  style={{ width: `${100 - i * 15}%` }}
                >
                  <div
                    className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Card Shimmer */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Card Shimmer</p>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full relative overflow-hidden bg-muted">
                  <div
                    className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                    }}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded relative overflow-hidden bg-muted w-1/2">
                    <div
                      className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                      }}
                    />
                  </div>
                  <div className="h-3 rounded relative overflow-hidden bg-muted w-1/3">
                    <div
                      className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="h-32 rounded relative overflow-hidden bg-muted">
                <div
                  className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PROGRESS INDICATORS DEMO
// ============================================================================
function ProgressIndicatorsDemo() {
  const [progress, setProgress] = useState(65)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Progress Indicators</CardTitle>
        <CardDescription>Determinate progress displays</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Linear Progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Linear Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Striped Progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Striped Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-primary relative overflow-hidden transition-all"
                style={{ width: `${progress}%` }}
              >
                <div
                  className="absolute inset-0 animate-[stripes_1s_linear_infinite]"
                  style={{
                    backgroundImage:
                      'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%)',
                    backgroundSize: '1rem 1rem',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Steps Progress */}
          <div>
            <p className="text-sm mb-3">Step Progress</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex-1 flex items-center">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                      step <= 3
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {step}
                  </div>
                  {step < 5 && (
                    <div
                      className={cn(
                        'flex-1 h-1 mx-2 rounded',
                        step < 3 ? 'bg-primary' : 'bg-muted'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setProgress(Math.max(0, progress - 10))}
            >
              -10%
            </Button>
            <Button
              size="sm"
              onClick={() => setProgress(Math.min(100, progress + 10))}
            >
              +10%
            </Button>
            <Button size="sm" variant="outline" onClick={() => setProgress(0)}>
              Reset
            </Button>
          </div>
        </div>
        <style jsx>{`
          @keyframes stripes {
            100% {
              background-position: 1rem 0;
            }
          }
        `}</style>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// AI LOADING STATES DEMO
// ============================================================================
function AILoadingStatesDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Loading States</CardTitle>
        <CardDescription>
          Specialized loading for AI interactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Thinking Animation */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">AI is thinking</span>
                <span className="flex gap-1">
                  <span
                    className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </span>
              </div>
            </div>
          </div>

          {/* Generating Response */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <RefreshCw className="h-4 w-4 text-primary animate-spin" />
              <span className="text-sm font-medium">
                Generating response...
              </span>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded animate-pulse w-full" />
              <div className="h-3 bg-muted rounded animate-pulse w-4/5" />
              <div className="h-3 bg-muted rounded animate-pulse w-3/5" />
              <div className="flex items-center gap-1 mt-2">
                <div className="w-2 h-4 bg-primary rounded-sm animate-pulse" />
              </div>
            </div>
          </div>

          {/* Streaming Text */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              React hooks are functions that let you use state and other React
              features in functional components
              <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
            </p>
          </div>

          {/* Processing Files */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">
                Processing document...
              </span>
              <Badge variant="secondary">42%</Badge>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[42%] bg-primary rounded-full animate-pulse" />
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Analyzing content...</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function LoadingStatesPage() {
  return (
    <div className="space-y-8 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-violet -top-40 -right-40 opacity-20" />
        <div className="orb-primary bottom-40 -left-40 opacity-20" />
      </div>

      <PageHeader
        title="Loading States"
        description="Spinners, skeletons, shimmers, and progress indicators"
        icon={Loader2}
        badge="8+ Components"
      />

      <Tabs defaultValue="spinners" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger value="spinners">Spinners</TabsTrigger>
          <TabsTrigger value="skeletons">Skeletons</TabsTrigger>
          <TabsTrigger value="shimmer">Shimmer</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="ai">AI States</TabsTrigger>
        </TabsList>

        <TabsContent value="spinners">
          <ComponentSection
            title="Spinner Loaders"
            description="Rotating loading indicators"
            docs={loadingStatesDocs['Spinner Loaders']}
          >
            <SpinnerLoadersDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="skeletons">
          <ComponentSection
            title="Skeleton Loaders"
            description="Content placeholders"
            docs={loadingStatesDocs['Skeleton Loaders']}
          >
            <SkeletonLoadersDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="shimmer">
          <ComponentSection
            title="Shimmer Effects"
            description="Gradient animations"
            docs={loadingStatesDocs['Shimmer Effects']}
          >
            <ShimmerEffectsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="progress">
          <ComponentSection
            title="Progress Indicators"
            description="Determinate progress"
            docs={loadingStatesDocs['Progress Indicators']}
          >
            <ProgressIndicatorsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="ai">
          <ComponentSection
            title="AI Loading States"
            description="AI-specific indicators"
            docs={loadingStatesDocs['AI Loading States']}
          >
            <AILoadingStatesDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
