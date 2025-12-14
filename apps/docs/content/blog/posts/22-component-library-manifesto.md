# The Component Library Manifesto: Stop Rebuilding Chat UIs

Every company building AI chat is solving the same problems. Most are solving them badly.

Streaming implementation. Error handling. Token counting. Dark mode. Accessibility. Mobile optimization. Retry logic. Loading states.

Thousands of developers are building these same features, making the same mistakes, learning the same lessons. This is insane.

Let's talk about what should and shouldn't be your code.

---

## What Every AI Chat Needs

Here's what a production AI chat requires—no matter what you're building:

**Universal requirements:**
- ✅ Message display with streaming support
- ✅ Input handling (multiline, file attachments)
- ✅ Error recovery with retry
- ✅ Loading states that communicate progress
- ✅ Token tracking for cost awareness
- ✅ Accessibility (keyboard navigation, screen readers)
- ✅ Theming (dark mode, customization)
- ✅ Mobile optimization (responsive, keyboard-aware)
- ✅ Keyboard shortcuts
- ✅ Scroll management (auto-scroll, manual override)

Every AI chat application needs these features. Every single one.

**The question:** How many times should this be built?

**The current reality:** Every company builds it from scratch. Every company makes the same mistakes. Every company spends 6-10 weeks on the same problems.

If you draw a Venn diagram of three different companies' AI chat implementations, the overlap is 80%. The unique parts—the actual differentiation—is only 20%.

That 80% is what we keep rebuilding.

---

## What Should Be YOUR Code

Your engineering time is finite. Use it on what matters.

**Build these yourself:**
- Your AI's personality and system prompts
- Your business logic and workflows
- Your integration with your backend and data
- Your unique features (whatever makes you different)
- Your brand identity and custom styling

These are your competitive advantage. This is where your engineering effort should go.

**Don't build these yourself:**
- Streaming display logic
- Retry with exponential backoff
- Token counting algorithms
- WCAG-compliant message components
- Dark mode implementation
- Virtual scrolling for long conversations
- Keyboard shortcut handling
- SSE/WebSocket connection management
- Mobile viewport handling
- Error state UI

These are solved problems. Building them yourself doesn't make your product better—it just takes longer.

**The decision tree:**

```
Is this feature unique to your product?
├── Yes → Build it (competitive advantage)
└── No → Has someone solved it well?
    ├── Yes → Use it (time savings)
    └── No → Build it, then share it (community benefit)
```

For AI chat, the "No" branch covers 80% of the work.

---

## The Real Cost of "Building It Yourself"

Everyone underestimates this. Let me break it down.

**Initial build:**

Week 1-2: "It's just a chat UI, how hard can it be?"
- Basic message display working
- Input handling done
- Feeling confident

Week 3: "Wait, streaming has edge cases"
- Partial chunk handling
- Connection drops mid-stream
- Error states during stream

Week 4: "Accessibility audit failed"
- Screen readers don't announce messages
- Keyboard navigation broken
- Focus management missing

Week 5-6: "Testing reveals more issues"
- Race conditions with rapid sending
- Memory leaks in long conversations
- Mobile layout breaks with virtual keyboard

Week 7-8: "We need dark mode and theming"
- Didn't plan for this
- Refactoring existing components
- Design system integration

Week 9-10: "Bug fixes and polish"
- Edge cases from real users
- Performance optimization
- The "final 10%" that takes 50% of the time

**Total: 10 weeks to reach production quality.**

**Ongoing maintenance:**

This is where it really hurts:
- Dependencies need updating (React 19 breaks things)
- New browser versions have quirks
- Users find edge cases constantly
- Team members leave, knowledge is lost
- Documentation becomes outdated
- Security patches required

Rough estimate: 4 hours/week ongoing. Forever.

**Opportunity cost:**

While you're building chat UI basics, you're NOT building:
- Your core product features
- The things that differentiate you
- Revenue-generating functionality
- What users actually care about

This cost is hardest to see but highest to pay.

**The math:**

| Category | DIY | Library |
|----------|-----|---------|
| Initial build | $40,000 (10 weeks) | $5,000 (1 week + license) |
| Year 1 maintenance | $20,000 | $0 (included) |
| Year 2 maintenance | $25,000 | $0 (included) |
| Opportunity cost | Massive | Minimal |
| **3-year total** | **$85,000+** | **$5,000** |

The difference isn't close.

---

## The Manifesto

We believe:

**1. Developer time is precious.**
Every hour spent on solved problems is an hour stolen from innovation. Your team's time is your scarcest resource. Don't waste it rebuilding wheels.

**2. Users deserve great experiences.**
Amateur chat UX hurts users. Battle-tested components, refined across thousands of implementations, outperform homegrown solutions every time. Your users deserve the better experience.

**3. Wheel reinvention is organizational debt.**
Every line of unique code is a line you must maintain. Unique code = unique bugs = unique maintenance burden. Minimize what you own.

**4. Open source raised the bar.**
The components you build should be better than what's available—or you should use what's available. "Not invented here" syndrome is expensive.

**5. Focus is competitive advantage.**
The teams that win focus on what makes them different, not what makes them the same. If your differentiator isn't "we built the best streaming display logic," don't build streaming display logic.

---

## When Libraries Make Sense

Not everything should be a library dependency. Here's when it makes sense:

**Use a library when:**
- The problem is well-defined (clear scope)
- Many others have the same problem (community)
- Maintenance is a significant burden (ongoing cost)
- Time-to-market matters (competitive pressure)
- Quality expectations are high (users notice)

**Build yourself when:**
- Your needs are truly unique (rare)
- No library meets your requirements (rarer)
- You have deep expertise in this area (specialized teams)
- Maintenance is your core competency (you're building a library)
- Learning is more important than shipping (early exploration)

**For AI chat specifically:**
95% of the surface area is shared across all implementations. 5% is unique to each product.

The smart move: library for the 95%, custom for the 5%.

---

## Common Objections

**"We need full control"**
You have full control with a library—you control which version you use, how you integrate it, and you can always fork if needed. What you give up is the maintenance burden.

**"It won't match our design system"**
Good libraries are themeable and composable. You customize the appearance without rebuilding the logic. The streaming logic doesn't care about your brand colors.

**"We're worried about vendor lock-in"**
The lock-in with DIY is worse—you're locked into maintaining your own codebase forever. Libraries can be replaced; custom code must be rewritten.

**"Our engineers want to build it"**
Engineers want to solve interesting problems. Chat UI boilerplate isn't interesting after the first week. Let them work on the hard problems unique to your product.

**"It's too expensive"**
Compared to what? 10 weeks of engineering time at $10K/week is $100K. A $5K library license is rounding error.

---

## The Takeaway

80% of AI chat is the same across every company. The streaming logic. The error handling. The accessibility. The theming.

Building this yourself makes sense if building chat components is your business. Otherwise, it's an expensive distraction.

**The rule:**
Build what's unique. Use what's solved.

Your users don't care who wrote the code. They care that it works, looks good, and doesn't break. Give them that—and spend your engineering cycles on what makes your product special.

---

*Clarity Chat is the library we wish existed when we started building AI products. 70+ components, 35+ hooks, 11 themes—so you can focus on what makes your product unique. [See what's included →](/docs/components)*
