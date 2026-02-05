'use client'

import { usePlayground } from '../context/PlaygroundContext'
import { Eye, AlertCircle, Maximize2 } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import { useState, Suspense, lazy } from 'react'
import { ChatErrorBoundary } from '@clarity-chat/error-handling'

// Dynamic imports for components
const componentRegistry: Record<string, React.ComponentType<any>> = {}

// Lazy load components
const loadComponent = (componentId: string) => {
  if (!componentRegistry[componentId]) {
    // In a real implementation, these would be actual component imports
    // For demo purposes, we'll create placeholder components
    componentRegistry[componentId] = lazy(() =>
      Promise.resolve({
        default: (props: any) => <DemoComponent componentId={componentId} {...props} />,
      })
    )
  }
  return componentRegistry[componentId]
}

export function LivePreview() {
  const { getComponentDefinition, props, theme } = usePlayground()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const component = getComponentDefinition()

  if (!component) return null

  const Component = loadComponent(component.id)

  return (
    <div
      className={cn(
        'glass-card p-6 space-y-4 transition-all',
        isFullscreen && 'fixed inset-4 z-50'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Live Preview</h2>
        </div>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="px-3 py-1.5 text-sm rounded-lg glass-panel hover:bg-white/80 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <Maximize2 className="h-3 w-3" />
          {isFullscreen ? 'Exit' : 'Fullscreen'}
        </button>
      </div>

      {/* Preview Container */}
      <div
        className={cn(
          'glass-panel p-8 rounded-xl min-h-[400px] flex items-center justify-center overflow-auto',
          theme === 'dark' && 'dark',
          isFullscreen && 'flex-1'
        )}
      >
        <ChatErrorBoundary>
          <Suspense
            fallback={
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                <span className="text-sm">Loading component...</span>
              </div>
            }
          >
            <Component {...props} />
          </Suspense>
        </ChatErrorBoundary>
      </div>

      {/* Info Panel */}
      <div className="glass-panel p-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Component:</span>
          <span className="font-medium">{component.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Props:</span>
          <span className="font-medium">
            {Object.keys(props).filter((k) => props[k] !== undefined).length} active
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Theme:</span>
          <span className="font-medium capitalize">{theme}</span>
        </div>
      </div>
    </div>
  )
}

// Demo component placeholder
function DemoComponent({ componentId, ...props }: any) {
  const renderDemoContent = () => {
    switch (componentId) {
      case 'ChatInput':
        return (
          <div className="w-full max-w-2xl space-y-2">
            <div className="relative">
              <textarea
                placeholder={props.placeholder}
                disabled={props.disabled}
                rows={props.rows}
                maxLength={props.maxLength}
                className="w-full px-4 py-3 rounded-xl glass-panel resize-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
              <div className="flex items-center gap-2 mt-2">
                {props.enableVoice && (
                  <button className="p-2 rounded-lg glass-panel hover:bg-white/80 dark:hover:bg-white/10">
                    🎤
                  </button>
                )}
                {props.enableAttachments && (
                  <button className="p-2 rounded-lg glass-panel hover:bg-white/80 dark:hover:bg-white/10">
                    📎
                  </button>
                )}
                <div className="flex-1" />
                <span className="text-xs text-muted-foreground">
                  0 / {props.maxLength}
                </span>
                <button className="px-4 py-2 rounded-lg gradient-accent text-white">
                  Send
                </button>
              </div>
            </div>
          </div>
        )

      case 'MessageBubble':
        return (
          <div className="w-full max-w-2xl">
            <div
              className={cn(
                'flex gap-3',
                props.role === 'user' && 'flex-row-reverse'
              )}
            >
              {props.showAvatar && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white font-medium">
                  {props.role === 'user' ? 'U' : 'A'}
                </div>
              )}
              <div
                className={cn(
                  'flex-1 glass-panel p-4 rounded-xl',
                  props.role === 'user' && 'bg-primary/10'
                )}
              >
                <div className="text-sm">{props.content}</div>
                {props.showTimestamp && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Just now
                  </div>
                )}
                {props.enableActions && (
                  <div className="flex gap-2 mt-2">
                    <button className="text-xs px-2 py-1 rounded glass-panel">
                      Copy
                    </button>
                    <button className="text-xs px-2 py-1 rounded glass-panel">
                      Like
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 'ThinkingIndicator':
        return (
          <div className="flex items-center gap-3">
            {props.variant === 'dots' && (
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            )}
            {props.variant === 'spinner' && (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
            )}
            <span className="text-sm text-muted-foreground">{props.message}</span>
          </div>
        )

      case 'TokenCounter':
        const percentage = (props.currentTokens / props.maxTokens) * 100
        const isWarning =
          props.showWarning && percentage > props.warningThreshold * 100

        return (
          <div className="glass-panel p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tokens</span>
              <span
                className={cn(
                  'font-medium',
                  isWarning && 'text-amber-500'
                )}
              >
                {props.currentTokens.toLocaleString()} /{' '}
                {props.maxTokens.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={cn(
                  'h-2 rounded-full transition-all',
                  isWarning ? 'bg-amber-500' : 'bg-primary'
                )}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        )

      case 'AudioRecorder':
        return (
          <div className="glass-panel p-6 rounded-xl space-y-4 w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full gradient-accent flex items-center justify-center text-white text-2xl mb-2">
                🎤
              </div>
              {props.showTimer && (
                <div className="text-sm text-muted-foreground">0:00 / {props.maxDuration}s</div>
              )}
            </div>
            {props.visualizer !== 'none' && (
              <div className="h-20 flex items-center justify-center gap-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 rounded-lg gradient-accent text-white">
                Start
              </button>
              <button className="px-4 py-2 rounded-lg glass-panel">Stop</button>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center space-y-2">
            <div className="text-4xl">{componentId === 'CodeBlock' ? '💻' : '🎨'}</div>
            <div className="text-sm font-medium">{componentId}</div>
            <div className="text-xs text-muted-foreground">
              Preview with {Object.keys(props).length} props
            </div>
          </div>
        )
    }
  }

  return <div className="w-full flex items-center justify-center">{renderDemoContent()}</div>
}
