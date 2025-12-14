# The Art of the Typing Indicator: Why ChatGPT Got It Right

Three bouncing dots. That's all it takes to make AI feel human.

The typing indicator is the most underrated UX element in AI chat. It's easy to dismiss as decorative—just some animation while users wait. But get it wrong, and your AI feels cold, robotic, broken. Get it right, and suddenly users describe your AI as "thoughtful" and "like talking to an expert."

ChatGPT, Claude, Gemini—every major AI chat nails this. Most custom implementations don't even try. Let's break down what makes a great typing indicator and how to build one.

---

## Why It Matters

Without a typing indicator, here's what users experience:

1. Send a message
2. Nothing happens
3. ...is it working?
4. ...should I click again?
5. ...is the app broken?
6. Either response appears (jarring) or user refreshes (lost)

With a good typing indicator:

1. Send a message
2. Indicator appears ("I'm working on this")
3. User relaxes, waits patiently
4. Indicator transitions smoothly to response
5. User reads response

The indicator isn't about filling time—it's about communication. It says: "I heard you. I'm thinking. Response coming."

In user testing, we found that the same 3-second response felt "fast" with a typing indicator and "slow" without one. Perception beats reality.

---

## What ChatGPT Gets Right

OpenAI clearly spent time on their typing indicator. Let's analyze it:

**The dots:**
Three circles that pulse in a wave pattern. Not bouncing (too playful), not static (boring). A subtle, organic wave that feels like breathing.

**The timing:**
The animation is smooth, unhurried. About 1.4 seconds per cycle. Fast enough to feel active, slow enough to feel calm.

**The transition:**
When streaming begins, the dots don't just vanish. They fade out as the first words appear. The handoff is seamless—you don't even notice it happening.

**The context:**
"GPT-4" label nearby reminds you which model is thinking. It's not just "loading"—it's specifically GPT-4 processing your request.

Every one of these details is intentional. And they compound into an experience that feels responsive and professional.

---

## Multi-Stage Indicators

Basic typing indicators show one state: "thinking." But AI processing often has multiple phases, and showing them resets user patience at each transition.

**Single stage:**
- "Thinking..." (0s)
- ...still "Thinking..." (5s)
- ...still "Thinking..." (10s) — user gets frustrated

**Multiple stages:**
- "Reading your message..." (0s)
- "Thinking..." (2s) — patience reset
- "Writing response..." (4s) — patience reset
- First words appear (6s)

Same 6-second wait, very different perception. Each stage change signals progress.

Here's how to implement it:

```tsx
type Stage = {
  id: string
  label: string
  icon: React.ReactNode
  duration: number
}

const defaultStages: Stage[] = [
  {
    id: 'reading',
    label: 'Reading your message...',
    icon: <EyeIcon className="w-4 h-4" />,
    duration: 1000,
  },
  {
    id: 'thinking',
    label: 'Thinking...',
    icon: <SparklesIcon className="w-4 h-4" />,
    duration: 2000,
  },
  {
    id: 'writing',
    label: 'Writing response...',
    icon: <PencilIcon className="w-4 h-4" />,
    duration: 1500,
  },
]

function useMultiStageTyping(stages: Stage[] = defaultStages) {
  const [currentStageIndex, setCurrentStageIndex] = useState(-1)
  const [isActive, setIsActive] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const start = useCallback(() => {
    setIsActive(true)
    setCurrentStageIndex(0)

    let index = 0
    const advanceStage = () => {
      index++
      if (index < stages.length) {
        setCurrentStageIndex(index)
        timeoutRef.current = setTimeout(advanceStage, stages[index].duration)
      }
      // Stay on last stage until stopped
    }

    timeoutRef.current = setTimeout(advanceStage, stages[0].duration)
  }, [stages])

  const stop = useCallback(() => {
    setIsActive(false)
    setCurrentStageIndex(-1)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const currentStage = currentStageIndex >= 0 ? stages[currentStageIndex] : null

  return { isActive, currentStage, start, stop }
}
```

And the visual component:

```tsx
function ThinkingIndicator({ stage }: { stage: Stage | null }) {
  if (!stage) return null

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-fade-in">
      {/* Animated icon container */}
      <div className="relative flex items-center justify-center w-8 h-8">
        <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-30" />
        <div className="relative flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
          {stage.icon}
        </div>
      </div>

      {/* Stage label */}
      <span className="text-sm text-gray-600 font-medium">
        {stage.label}
      </span>

      {/* Pulsing dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}
```

---

## Animation Principles

The animation itself matters. Here's what works:

### Use easing, not linear

Linear animation feels robotic. Use ease-in-out for organic feel:

```css
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.dot {
  animation: pulse 1.4s ease-in-out infinite;
}

/* Stagger the dots */
.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
```

### Keep it subtle

The indicator supports the experience—it shouldn't distract from it. Avoid:
- Bright, flashy colors
- Fast or frantic motion
- Large elements that dominate the UI
- Jarring transitions

### Respect reduced motion

Some users have vestibular disorders. Animations can cause nausea:

```css
@media (prefers-reduced-motion: reduce) {
  .dot {
    animation: none;
    opacity: 0.7;
  }
}
```

For these users, a static indicator with text ("Thinking...") works fine.

---

## The Transition to Content

The handoff from typing indicator to actual content should be seamless. No jarring pop, no flash, no jump.

```tsx
function StreamingMessage({
  content,
  isStreaming,
}: {
  content: string
  isStreaming: boolean
}) {
  const [showIndicator, setShowIndicator] = useState(true)

  // Hide indicator once content starts
  useEffect(() => {
    if (content.length > 0) {
      setShowIndicator(false)
    }
  }, [content])

  return (
    <div className="relative">
      {/* Indicator fades out */}
      {showIndicator && (
        <div className={cn(
          "transition-opacity duration-200",
          content.length > 0 ? "opacity-0" : "opacity-100"
        )}>
          <ThinkingIndicator />
        </div>
      )}

      {/* Content fades in */}
      <div className={cn(
        "transition-opacity duration-200",
        content.length > 0 ? "opacity-100" : "opacity-0"
      )}>
        <div className="prose">
          {content}
          {isStreaming && <BlinkingCursor />}
        </div>
      </div>
    </div>
  )
}

function BlinkingCursor() {
  return (
    <span className="inline-block w-2 h-4 ml-0.5 bg-current animate-blink" />
  )
}
```

The CSS:

```css
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.animate-blink {
  animation: blink 1s step-end infinite;
}
```

The cursor continues the "typing" metaphor into the streaming phase. It blinks at the end of the content, showing where new text will appear.

---

## Adaptive Timing

Not all queries deserve the same thinking time. A simple "hello" shouldn't show 3 seconds of "analyzing your complex question."

```tsx
function useAdaptiveTyping() {
  const { start, stop, currentStage } = useMultiStageTyping()

  const startTyping = useCallback((userMessage: string) => {
    // Quick responses for short messages
    if (userMessage.length < 20) {
      // Skip straight to "Writing response..."
      setTimeout(() => start(), 500)
      return
    }

    // Longer analysis for complex queries
    if (
      userMessage.includes('analyze') ||
      userMessage.includes('explain') ||
      userMessage.includes('compare')
    ) {
      // Show all stages
      start()
      return
    }

    // Default behavior
    start()
  }, [start])

  return { startTyping, stop, currentStage }
}
```

Match the indicator duration to the expected response complexity. Users develop intuitions about how long things "should" take.

---

## Performance Considerations

Animations consume CPU/GPU resources. On lower-end devices or when the tab is backgrounded, pause or simplify:

```tsx
function usePerformantAnimation() {
  const [isVisible, setIsVisible] = useState(true)
  const [isReduced, setIsReduced] = useState(false)

  useEffect(() => {
    // Pause when tab is hidden
    const handleVisibility = () => {
      setIsVisible(!document.hidden)
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // Check for low-power mode or reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReduced(motionQuery.matches)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return { shouldAnimate: isVisible && !isReduced }
}
```

When `shouldAnimate` is false, show a static indicator instead.

---

## The Complete Example

Putting it all together:

```tsx
function ChatMessage({ message, isLatest }: {
  message: Message
  isLatest: boolean
}) {
  if (message.role === 'assistant' && message.isStreaming) {
    return (
      <div className="p-4">
        <StreamingMessage
          content={message.content}
          isStreaming={message.isStreaming}
        />
      </div>
    )
  }

  if (message.role === 'assistant' && message.isPending) {
    return (
      <div className="p-4">
        <ThinkingIndicator stage={message.currentStage} />
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="prose">{message.content}</div>
    </div>
  )
}
```

---

## The Takeaway

The typing indicator is small but mighty. It's the difference between "is this thing working?" and "I can see it's thinking."

The essentials:
1. **Show activity, not just waiting** — Pulsing dots beat static spinners
2. **Use multiple stages** — Each change resets patience
3. **Animate organically** — Easing, not linear. Subtle, not flashy
4. **Transition smoothly** — Fade to content, don't jump
5. **Respect accessibility** — Support reduced motion
6. **Adapt to context** — Quick queries get quick indicators

Three bouncing dots. When done right, they make your AI feel alive.

---

*Want typing indicators without the implementation work? Clarity Chat's `ThinkingIndicator` component supports multi-stage progress, adaptive timing, smooth transitions, and accessibility—all configurable. [Check out the docs →](/docs/components/thinking-indicator)*
