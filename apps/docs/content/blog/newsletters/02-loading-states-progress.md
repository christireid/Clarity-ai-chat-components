# Newsletter: The Art of Loading States

**Subject:** Why your AI chat feels broken (and how to fix it)

---

That spinning circle isn't doing you any favors.

Users don't want to know something is "loading." They want to know *what's happening* and *how long they'll wait.*

The difference between a frustrating AI chat and a delightful one often comes down to those few seconds of loading. Here's the insight that changed how we build loading states.

## The Key Insight

Loading states should communicate **progress**, not just **activity**.

Instead of a generic spinner, tell users what's actually happening:

```tsx
function AILoadingState({ phase }: { phase: LoadingPhase }) {
  const phases = {
    connecting: { label: 'Connecting...', progress: 20 },
    processing: { label: 'Thinking...', progress: 50 },
    generating: { label: 'Writing response...', progress: 80 },
  }

  const current = phases[phase]

  return (
    <div className="flex items-center gap-3">
      <div className="w-32 h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-blue-500 rounded-full transition-all"
          style={{ width: `${current.progress}%` }}
        />
      </div>
      <span className="text-sm text-gray-600">{current.label}</span>
    </div>
  )
}
```

Three phases. Three states of mind for your user. Each one tells them "we're working on it" without the anxiety of not knowing.

**The result?** Users rate wait times 35% shorter when they see meaningful progress, even when the actual duration is identical.

---

[Read the full article →](/blog/loading-states-progress)

*Building AI chat that doesn't make users anxious? That's what Clarity Chat is for.*
