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
  ScrollArea,
  cn,
} from '@clarity-chat/primitives'
import {
  User,
  Bot,
  AlertCircle,
  Check,
  X,
  RefreshCw,
  Edit,
  Trash2,
  Pin,
  Sparkles,
  Loader2,
} from 'lucide-react'

export function ComprehensiveMessageVariantsDemo() {
  return (
    <Card className="glass-card backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          All Message Variants
        </CardTitle>
        <CardDescription>
          User, Assistant, System, Error, Loading, Edited, Deleted, and Pinned states
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[700px]">
          <div className="space-y-8 p-2">
            {/* User Messages - Different Lengths */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 sticky top-0 glass-panel backdrop-blur-md p-2 rounded-lg z-10">
                <User className="h-4 w-4 text-primary" />
                1. User Messages - Different Lengths
              </h4>
              <div className="p-4 glass-panel backdrop-blur-md rounded-lg space-y-3">
                {/* Short */}
                <div className="flex gap-3 flex-row-reverse">
                  <div className="icon-container-sm gradient-accent text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="gradient-accent text-white rounded-xl rounded-tr-none p-3 max-w-[70%] glow-sm backdrop-blur-md">
                    <p className="text-sm">Hi!</p>
                    <span className="text-xs opacity-70 mt-1 block text-right">
                      10:30 AM
                    </span>
                  </div>
                </div>
                {/* Medium */}
                <div className="flex gap-3 flex-row-reverse">
                  <div className="icon-container-sm gradient-accent text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="gradient-accent text-white rounded-xl rounded-tr-none p-3 max-w-[70%] glow-sm backdrop-blur-md">
                    <p className="text-sm">
                      Can you help me understand how React hooks work?
                    </p>
                    <span className="text-xs opacity-70 mt-1 block text-right">
                      10:31 AM
                    </span>
                  </div>
                </div>
                {/* Long */}
                <div className="flex gap-3 flex-row-reverse">
                  <div className="icon-container-sm gradient-accent text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="gradient-accent text-white rounded-xl rounded-tr-none p-3 max-w-[70%] glow-sm backdrop-blur-md">
                    <p className="text-sm">
                      I'm building a complex dashboard with real-time updates,
                      multiple data sources, and need to optimize performance.
                      What's the best state management approach for this
                      scenario?
                    </p>
                    <span className="text-xs opacity-70 mt-1 block text-right">
                      10:32 AM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assistant Messages - With Markdown & Code */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 sticky top-0 glass-panel backdrop-blur-md p-2 rounded-lg z-10">
                <Bot className="h-4 w-4 text-primary" />
                2. Assistant Messages - Rich Content
              </h4>
              <div className="p-4 glass-panel backdrop-blur-md rounded-lg space-y-3">
                <div className="flex gap-3">
                  <div className="icon-container-sm">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="glass-subtle backdrop-blur-md rounded-xl rounded-tl-none p-3.5 max-w-[80%] space-y-2">
                    <p className="text-sm font-medium">
                      Here's how useEffect works:
                    </p>
                    <div className="glass-panel backdrop-blur-sm p-3 rounded-lg">
                      <pre className="text-xs font-mono overflow-x-auto">
                        <code className="text-primary">{`useEffect(() => {
  // Side effect code
  fetchData();

  return () => cleanup();
}, [dependency]);`}</code>
                      </pre>
                    </div>
                    <ul className="text-sm list-disc list-inside text-muted-foreground space-y-1">
                      <li>Runs after render</li>
                      <li>Cleanup on unmount</li>
                      <li>Dependency array controls re-runs</li>
                    </ul>
                    <span className="text-xs text-muted-foreground block">
                      10:33 AM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Messages */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 sticky top-0 glass-panel backdrop-blur-md p-2 rounded-lg z-10">
                <AlertCircle className="h-4 w-4 text-primary" />
                3. System Messages - Info, Warning, Error, Success
              </h4>
              <div className="p-4 glass-panel backdrop-blur-md rounded-lg space-y-3">
                {/* Info */}
                <div className="flex justify-center">
                  <div className="glass-panel px-4 py-2 rounded-full">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-muted-foreground">
                        Session started
                      </span>
                    </div>
                  </div>
                </div>
                {/* Success */}
                <div className="flex justify-center">
                  <div className="glass-panel px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-green-700 dark:text-green-400">
                        Connected successfully
                      </span>
                    </div>
                  </div>
                </div>
                {/* Warning */}
                <div className="flex justify-center">
                  <div className="glass-panel px-4 py-2 rounded-full border border-yellow-500/20 bg-yellow-500/5">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-700 dark:text-yellow-400">
                        Rate limit warning
                      </span>
                    </div>
                  </div>
                </div>
                {/* Error */}
                <div className="flex justify-center">
                  <div className="glass-panel px-4 py-2 rounded-full border border-red-500/20 bg-red-500/5">
                    <div className="flex items-center gap-2 text-sm">
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-red-700 dark:text-red-400">
                        Connection failed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Messages with Retry */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 sticky top-0 glass-panel backdrop-blur-md p-2 rounded-lg z-10">
                <AlertCircle className="h-4 w-4 text-primary" />
                4. Error Messages - With Retry Button
              </h4>
              <div className="p-4 glass-panel backdrop-blur-md rounded-lg space-y-3">
                <div className="flex gap-3">
                  <div className="icon-container-sm">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="glass-card p-4 border-l-4 border-red-500 bg-red-500/5">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-medium text-red-700 dark:text-red-400">
                            Failed to generate response
                          </p>
                          <p className="text-xs text-muted-foreground">
                            API rate limit exceeded
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 border-red-500/30 hover:bg-red-500/10"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Retry
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading Messages */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 sticky top-0 glass-panel backdrop-blur-md p-2 rounded-lg z-10">
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                5. Loading Messages - Skeleton States
              </h4>
              <div className="p-4 glass-panel backdrop-blur-md rounded-lg space-y-3">
                {/* Skeleton */}
                <div className="flex gap-3">
                  <div className="icon-container-sm animate-pulse">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="glass-card p-4 space-y-3">
                      <div className="h-3 w-full glass-panel backdrop-blur-sm rounded animate-pulse" />
                      <div className="h-3 w-5/6 glass-panel backdrop-blur-sm rounded animate-pulse" />
                      <div className="h-3 w-4/6 glass-panel backdrop-blur-sm rounded animate-pulse" />
                    </div>
                  </div>
                </div>
                {/* Typing dots */}
                <div className="flex gap-3">
                  <div className="icon-container-sm">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="glass-card px-4 py-3 rounded-xl rounded-tl-none">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
                {/* Streaming */}
                <div className="flex gap-3">
                  <div className="icon-container-sm">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="glass-card p-3.5">
                      <p className="text-sm">
                        React hooks are powerful features that
                        <span className="inline-block w-1.5 h-4 bg-primary ml-1 animate-pulse" />
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Generating...
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edited Messages */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 sticky top-0 glass-panel backdrop-blur-md p-2 rounded-lg z-10">
                <Edit className="h-4 w-4 text-primary" />
                6. Edited Messages - With Indicator
              </h4>
              <div className="p-4 glass-panel backdrop-blur-md rounded-lg space-y-3">
                <div className="flex gap-3 flex-row-reverse">
                  <div className="icon-container-sm gradient-accent text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 items-end flex flex-col">
                    <div className="gradient-accent text-white rounded-xl rounded-tr-none p-3 max-w-[70%] glow-sm backdrop-blur-md">
                      <p className="text-sm">
                        Can you explain useEffect? (typo fixed)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs badge-glass"
                      >
                        <Edit className="h-2.5 w-2.5 mr-1" />
                        Edited
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        10:35 AM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deleted Messages */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 sticky top-0 glass-panel backdrop-blur-md p-2 rounded-lg z-10">
                <Trash2 className="h-4 w-4 text-primary" />
                7. Deleted Messages - Tombstone State
              </h4>
              <div className="p-4 glass-panel backdrop-blur-md rounded-lg space-y-3">
                <div className="flex gap-3 flex-row-reverse">
                  <div className="icon-container-sm glass-panel backdrop-blur-sm">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="glass-card p-3 max-w-[70%] border-dashed opacity-60">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Message deleted</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="icon-container-sm glass-panel backdrop-blur-sm">
                    <Bot className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="glass-card p-3 max-w-[80%] border-dashed opacity-60">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Message deleted by user</span>
                      </div>
                      <Button size="sm" variant="ghost" className="text-xs h-7">
                        Undo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pinned Messages */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 sticky top-0 glass-panel backdrop-blur-md p-2 rounded-lg z-10">
                <Pin className="h-4 w-4 text-primary" />
                8. Pinned Messages - With Pin Indicator
              </h4>
              <div className="p-4 glass-panel backdrop-blur-md rounded-lg space-y-3">
                <div className="glass-panel p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-500/5">
                  <div className="flex items-start gap-3">
                    <Pin className="h-5 w-5 text-yellow-500 shrink-0 rotate-45" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400"
                        >
                          Pinned
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Yesterday
                        </span>
                      </div>
                      <p className="text-sm">
                        <strong>Important:</strong> Server maintenance scheduled
                        for Friday 8-10 PM
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Pinned by Admin
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
