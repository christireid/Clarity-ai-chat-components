# Newsletter: Make Chat Feel Instant

**Subject:** The trick that makes iMessage feel faster than it is

---

When you tap send in iMessage, your message appears instantly.

It doesn't wait for server confirmation. It doesn't show a spinner. It just _appears_.

This is optimistic UI, and it transforms how your AI chat feels.

## The Key Insight

**Show the message before the server confirms it.** Update the status silently afterward.

```tsx
const handleSend = async (content: string) => {
  // 1. Show immediately
  const tempId = `temp-${Date.now()}`
  addMessage({
    id: tempId,
    content,
    status: 'sending', // Shows subtle indicator
  })

  // 2. Send to server in background
  try {
    const { id } = await sendToServer(content)
    updateMessage(tempId, { id, status: 'sent' })
  } catch (error) {
    updateMessage(tempId, { status: 'failed' })
  }
}
```

**The three states:**

- **Sending**: Slightly faded, clock icon
- **Sent**: Full opacity, checkmark
- **Failed**: Red border, retry button

**Critical rule:** Failed messages stay visible. The user's words are precious—never silently delete
them.

The psychology is simple: 0ms perceived latency feels instant. 500ms actual latency with a spinner
feels slow.

---

[Read the full article →](/blog/optimistic-ui)

_Clarity Chat's `useOptimisticMessage` hook handles status transitions, retry logic, and offline
queuing._
