# Error Messages That Don't Make Users Rage-Quit

*Newsletter version of: User-Friendly Error UX*

---

"Error: Something went wrong."

You've just told your user absolutely nothing.

What went wrong? Their network? Your server? The AI? Is their message lost? Can they retry?

A single useless error message can undo an entire positive experience.

## Error Classification

Different errors need different handling:

**Recoverable (User Can Fix)**
- Network offline → "Check your connection and try again"
- Rate limited → "Too many messages. Wait 30 seconds."

**Non-Recoverable (You Need to Fix)**
- Server error → "Our systems are having trouble. We're on it."
- Auth expired → "Please refresh the page to continue"

**User Error**
- Empty message → "Please enter a message"
- Too long → "Message too long (max 4000 characters)"

## The Three-Part Error Message

Every error should have:

1. **What happened** (human-readable)
2. **Why it matters** (impact)
3. **What to do next** (action)

```typescript
// Bad
"Error 429"

// Good
"You're sending messages too quickly. Wait 30 seconds, then try again."
```

## Preserve User Input

The worst UX: user writes a long message, hits send, error, message gone.

```typescript
// Save input before sending
localStorage.setItem('draft', userMessage)

// Clear only on success
if (response.ok) {
  localStorage.removeItem('draft')
}

// Restore on page load
const draft = localStorage.getItem('draft')
```

## Key Takeaway

Errors happen. How you handle them determines whether users stay or leave.

---

**Read the full post** for error classification utilities and recovery UI patterns.

[Read full post →]
