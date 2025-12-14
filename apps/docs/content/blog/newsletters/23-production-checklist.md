# The AI Chat Production Checklist

*Newsletter version of: From MVP to Production*

---

Your demo works. Stakeholders are impressed.

But can 10,000 users use it tomorrow?

The gap between "works on my machine" and "works for everyone, at scale" is where products die.

Here's the 50-item checklist we use internally.

## Core Functionality (Must Have)

- [ ] Messages persist across page refresh
- [ ] Streaming works and can be cancelled
- [ ] Errors show actionable messages
- [ ] Retry logic for failed messages
- [ ] Empty state for new conversations

## Performance (Must Have)

- [ ] Messages virtualized for long conversations
- [ ] Scroll to bottom on new message
- [ ] Input doesn't lag during streaming
- [ ] Token counting accurate (±5%)
- [ ] Memory doesn't leak over time

## Accessibility (Must Have)

- [ ] Keyboard navigation works
- [ ] Screen reader announces new messages
- [ ] Focus management on send
- [ ] Color contrast meets WCAG AA
- [ ] Reduced motion respected

## Security (Must Have)

- [ ] Input sanitized before display
- [ ] Rate limiting per user
- [ ] API keys not exposed to client
- [ ] Prompt injection defenses
- [ ] Audit logging for actions

## Mobile (Should Have)

- [ ] Virtual keyboard doesn't break layout
- [ ] Touch targets at least 44×44px
- [ ] Input visible above keyboard
- [ ] Works offline (graceful degradation)

## Cost Control (Should Have)

- [ ] Token usage tracked per conversation
- [ ] Alerts for unusual spending
- [ ] Model routing by complexity
- [ ] Context pruning implemented

## Quick Wins Checklist

If you only have one day:
1. ✅ Add retry button for failed messages
2. ✅ Show loading indicator during streaming
3. ✅ Add keyboard shortcut (Cmd+Enter)
4. ✅ Test with screen reader once
5. ✅ Add rate limit (even if generous)

---

**Read the full post** for the complete 50-item checklist with priority rankings.

[Read full post →]
