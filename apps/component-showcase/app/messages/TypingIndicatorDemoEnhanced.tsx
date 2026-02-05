'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  cn,
} from '@clarity-chat/primitives'
import {
  User,
  Bot,
  Sparkles,
  RefreshCw,
  Clock,
} from 'lucide-react'

// ============================================================================
// ENHANCED TYPING INDICATOR DEMO
// ============================================================================
export function TypingIndicatorDemoEnhanced() {
  const [activeIndicators, setActiveIndicators] = useState<{
    [key: string]: boolean
  }>({
    single: false,
    multiple: false,
    dots: false,
    pulse: false,
    wave: false,
  })

  const [timeouts, setTimeouts] = useState<{ [key: string]: NodeJS.Timeout }>(
    {}
  )

  const toggleIndicator = (key: string) => {
    // Clear existing timeout if any
    if (timeouts[key]) {
      clearTimeout(timeouts[key])
    }

    const newState = !activeIndicators[key]
    setActiveIndicators((prev) => ({ ...prev, [key]: newState }))

    // Auto-hide after 5 seconds if activated
    if (newState) {
      const timeout = setTimeout(() => {
        setActiveIndicators((prev) => ({ ...prev, [key]: false }))
        setTimeouts((prev) => {
          const { [key]: _, ...rest } = prev
          return rest
        })
      }, 5000)
      setTimeouts((prev) => ({ ...prev, [key]: timeout }))
    } else {
      setTimeouts((prev) => {
        const { [key]: _, ...rest } = prev
        return rest
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Single User Typing */}
      <Card className="glass-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Single User Typing</CardTitle>
              <CardDescription>Classic typing indicator with avatar</CardDescription>
            </div>
            <Button
              variant={activeIndicators.single ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleIndicator('single')}
            >
              {activeIndicators.single ? 'Stop Typing' : 'Start Typing'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="min-h-[80px] p-4 glass-panel backdrop-blur-md rounded-lg flex items-center">
            {activeIndicators.single ? (
              <div className="flex gap-3 items-center">
                <div className="icon-container-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="glass-subtle backdrop-blur-md rounded-xl rounded-tl-none p-3">
                  <div className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click &quot;Start Typing&quot; to see the indicator
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Multiple Users Typing */}
      <Card className="glass-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Multiple Users Typing</CardTitle>
              <CardDescription>
                Show multiple people typing at once
              </CardDescription>
            </div>
            <Button
              variant={activeIndicators.multiple ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleIndicator('multiple')}
            >
              {activeIndicators.multiple ? 'Stop Typing' : 'Start Typing'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="min-h-[120px] p-4 glass-panel backdrop-blur-md rounded-lg space-y-4">
            {activeIndicators.multiple ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Alice and Bob are typing</span>
                  <span className="flex gap-0.5">
                    <span className="animate-pulse">.</span>
                    <span
                      className="animate-pulse"
                      style={{ animationDelay: '200ms' }}
                    >
                      .
                    </span>
                    <span
                      className="animate-pulse"
                      style={{ animationDelay: '400ms' }}
                    >
                      .
                    </span>
                  </span>
                </div>

                {/* Show individual avatars */}
                <div className="flex gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium ring-2 ring-background">
                      A
                    </div>
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-medium ring-2 ring-background">
                      B
                    </div>
                  </div>
                  <div className="glass-subtle backdrop-blur-md rounded-lg p-2 px-3">
                    <div className="flex items-center gap-1">
                      <span
                        className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click &quot;Start Typing&quot; to see multiple users typing
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Animation Variants */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">Animation Variants</CardTitle>
          <CardDescription>
            Different animation styles for typing indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Bouncing Dots */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Bouncing Dots</h4>
                <Button
                  variant={activeIndicators.dots ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleIndicator('dots')}
                >
                  {activeIndicators.dots ? 'Stop' : 'Start'}
                </Button>
              </div>
              <div className="min-h-[60px] p-3 glass-panel backdrop-blur-md rounded-lg flex items-center">
                {activeIndicators.dots ? (
                  <div className="flex gap-3 items-center">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className="bg-muted rounded-lg rounded-tl-none p-2">
                      <div className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Inactive</span>
                )}
              </div>
            </div>

            {/* Pulse */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Pulse</h4>
                <Button
                  variant={activeIndicators.pulse ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleIndicator('pulse')}
                >
                  {activeIndicators.pulse ? 'Stop' : 'Start'}
                </Button>
              </div>
              <div className="min-h-[60px] p-3 glass-panel backdrop-blur-md rounded-lg flex items-center">
                {activeIndicators.pulse ? (
                  <div className="flex gap-3 items-center">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className="bg-muted rounded-lg rounded-tl-none p-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span
                          className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"
                          style={{ animationDelay: '100ms' }}
                        />
                        <span
                          className="w-2 h-2 bg-primary/30 rounded-full animate-pulse"
                          style={{ animationDelay: '200ms' }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Inactive</span>
                )}
              </div>
            </div>

            {/* Wave */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Wave</h4>
                <Button
                  variant={activeIndicators.wave ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleIndicator('wave')}
                >
                  {activeIndicators.wave ? 'Stop' : 'Start'}
                </Button>
              </div>
              <div className="min-h-[60px] p-3 glass-panel backdrop-blur-md rounded-lg flex items-center">
                {activeIndicators.wave ? (
                  <div className="flex gap-3 items-center">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className="bg-muted rounded-lg rounded-tl-none p-2">
                      <div className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
                          style={{
                            animationDuration: '1.2s',
                            animationDelay: '0ms',
                          }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
                          style={{
                            animationDuration: '1.2s',
                            animationDelay: '200ms',
                          }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
                          style={{
                            animationDuration: '1.2s',
                            animationDelay: '400ms',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Inactive</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avatar Display Styles */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">Avatar Display Styles</CardTitle>
          <CardDescription>
            Different ways to show who is typing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* With Avatar */}
            <div>
              <h4 className="text-sm font-medium mb-3">With Avatar</h4>
              <div className="p-4 glass-panel backdrop-blur-md rounded-lg">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
                    AI
                  </div>
                  <div className="glass-subtle backdrop-blur-md rounded-xl rounded-tl-none p-3">
                    <div className="flex items-center gap-1">
                      <span
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Without Avatar */}
            <div>
              <h4 className="text-sm font-medium mb-3">Without Avatar</h4>
              <div className="p-4 glass-panel backdrop-blur-md rounded-lg">
                <div className="glass-subtle backdrop-blur-md rounded-lg p-3 w-fit">
                  <div className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Text Label */}
            <div>
              <h4 className="text-sm font-medium mb-3">With Text Label</h4>
              <div className="p-4 glass-panel backdrop-blur-md rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Assistant is typing</span>
                    <div className="flex gap-0.5">
                      <span className="animate-pulse">.</span>
                      <span
                        className="animate-pulse"
                        style={{ animationDelay: '200ms' }}
                      >
                        .
                      </span>
                      <span
                        className="animate-pulse"
                        style={{ animationDelay: '400ms' }}
                      >
                        .
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Messages */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">Custom Messages</CardTitle>
          <CardDescription>
            Configurable text for different contexts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 glass-panel backdrop-blur-md rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>AI is thinking</span>
                <span className="flex gap-0.5">
                  <span className="animate-pulse">.</span>
                  <span
                    className="animate-pulse"
                    style={{ animationDelay: '200ms' }}
                  >
                    .
                  </span>
                  <span
                    className="animate-pulse"
                    style={{ animationDelay: '400ms' }}
                  >
                    .
                  </span>
                </span>
              </div>
            </div>

            <div className="p-4 glass-panel backdrop-blur-md rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                <span>Generating response</span>
              </div>
            </div>

            <div className="p-4 glass-panel backdrop-blur-md rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bot className="h-4 w-4" />
                <span>Assistant is composing</span>
                <span className="flex gap-0.5">
                  <span className="animate-pulse">.</span>
                  <span
                    className="animate-pulse"
                    style={{ animationDelay: '200ms' }}
                  >
                    .
                  </span>
                  <span
                    className="animate-pulse"
                    style={{ animationDelay: '400ms' }}
                  >
                    .
                  </span>
                </span>
              </div>
            </div>

            <div className="p-4 glass-panel backdrop-blur-md rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>User is typing a message</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeout Demo */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">Auto-Hide Timeout</CardTitle>
          <CardDescription>
            Indicators automatically disappear after 5 seconds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 glass-panel backdrop-blur-md rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                All indicators above will automatically hide after 5 seconds
              </p>
              <Badge variant="outline" className="gap-2">
                <Clock className="h-3 w-3" />5s timeout
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {Object.entries(activeIndicators).map(([key, active]) => (
                <div
                  key={key}
                  className={cn(
                    'p-2 rounded border transition-colors',
                    active
                      ? 'bg-primary/10 border-primary/30'
                      : 'glass-panel backdrop-blur-md border-border'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="capitalize">{key}</span>
                    <Badge
                      variant={active ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
