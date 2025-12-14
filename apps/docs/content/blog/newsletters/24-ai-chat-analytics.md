# Newsletter: What to Measure in AI Chat

**Subject:** The metrics that actually matter

---

You're probably tracking the wrong things.

Page views and session duration don't tell you if your AI chat is working.

## The Metrics That Matter

**1. Resolution rate** Did the user get their answer? Not "did they send a message" but "did they
leave satisfied?"

Proxy: Messages per session. Lower is often better.

**2. First response accuracy** Did the AI understand the question correctly on the first try?

Proxy: Rephrasing rate. Users who immediately rephrase = AI missed the point.

**3. Cost per resolution** Not cost per message. Cost per _solved problem_.

A $0.50 conversation that solves the problem beats a $0.05 conversation that doesn't.

**4. Error recovery rate** When something goes wrong, does the user recover or abandon?

Track: Error → retry → success sequences.

**5. Escalation rate** How often do users give up on AI and seek human help?

This is your ceiling. Everything else optimizes toward lowering it.

```typescript
const trackConversation = (session: Session) => {
  analytics.track('conversation_complete', {
    resolution: session.wasResolved,
    messageCount: session.messages.length,
    totalCost: session.tokenCost,
    escalated: session.requestedHuman,
    errorRecovery: session.recoveredFromError,
  })
}
```

---

[Read the full article →](/blog/ai-chat-analytics)

_Measure what matters. Improve what you measure._
