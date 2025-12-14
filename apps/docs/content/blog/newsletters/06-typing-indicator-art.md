# Newsletter: The Typing Indicator That Tells a Story

**Subject:** Three bouncing dots are lying to your users

---

That generic typing indicator? It says nothing.

Is the AI reading? Processing? Generating? Users don't know, and that uncertainty breeds anxiety.

## The Key Insight

**Show the AI's cognitive phases**, not just "something is happening."

```tsx
const typingStages = [
  { label: 'Reading your message...', duration: 500 },
  { label: 'Thinking...', duration: 1500 },
  { label: 'Writing response...', duration: null }, // until streaming starts
]

function IntelligentTypingIndicator({ stage }: { stage: number }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600">{typingStages[stage]?.label || 'Preparing...'}</span>
    </div>
  )
}
```

**Why this works:** It maps to how humans think. We read, we consider, we respond. Showing this
progression makes the AI feel thoughtful, not mechanical.

**Pro tip:** The "thinking" phase should feel slightly longer. It signals the AI is actually
considering the question, not just pattern-matching.

---

[Read the full article →](/blog/typing-indicator-art)

_Intelligent typing indicators built into every Clarity Chat message component._
