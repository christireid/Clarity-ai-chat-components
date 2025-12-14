# Newsletter: AI Chat That Everyone Can Use

**Subject:** 15% of your users can't use your AI chat

---

That's roughly how many people have some form of disability that affects how they interact with
software.

Screen readers, keyboard navigation, reduced motion preferences, high contrast needs—accessibility
isn't a nice-to-have. It's table stakes.

## The Key Insight

Live regions are your secret weapon for accessible AI chat.

When the AI starts responding, screen reader users need to know. When it's done, they need to know
that too. ARIA live regions make this automatic.

```tsx
function AccessibleChat() {
  return (
    <div role="log" aria-live="polite" aria-label="Chat messages">
      {messages.map((msg) => (
        <div key={msg.id} role="article" aria-label={`${msg.role} says`}>
          {msg.content}
        </div>
      ))}

      {isTyping && <div aria-live="assertive">AI is typing a response...</div>}
    </div>
  )
}
```

`aria-live="polite"` announces new messages without interrupting. `aria-live="assertive"` interrupts
for important status changes.

**The checklist:**

- [ ] All interactive elements keyboard-accessible
- [ ] Focus management when new messages arrive
- [ ] Announce loading states to screen readers
- [ ] Respect `prefers-reduced-motion`
- [ ] Sufficient color contrast (4.5:1 minimum)

---

[Read the full article →](/blog/accessibility-screen-readers)

_Clarity Chat components are WCAG 2.1 AA compliant out of the box._
