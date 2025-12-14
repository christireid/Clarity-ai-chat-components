# Documentation Link Mapping

Reference for blog post CTAs and their corresponding documentation pages.

---

## Link Inventory

All documentation links used across blog posts:

| Blog Post | Link Path | Required Doc Page |
|-----------|-----------|-------------------|
| 01 | `/docs/hooks/use-realistic-typing` | Hook: useRealisticTyping |
| 02 | `/docs/components/loading-states` | Component: LoadingStates |
| 03 | `/docs/theming` | Theming guide |
| 04 | `/docs/accessibility` | Accessibility features |
| 05 | `/docs/error-handling` | Error handling guide |
| 06 | `/docs/components/thinking-indicator` | Component: ThinkingIndicator |
| 07 | `/docs/hooks/streaming` | Hooks: useStreamingSSE, useStreamingWebSocket |
| 08 | `/docs/hooks/context-management` | Hooks: useTokenTracker, useSlidingContextManager |
| 09 | `/docs/getting-started` | Quick start guide |
| 10 | `/docs/hooks/use-token-tracker` | Hook: useTokenTracker |
| 11 | `/docs/hooks/use-error-recovery` | Hook: useErrorRecovery |
| 12 | `/docs/hooks/use-optimistic-message` | Hook: useOptimisticMessage |
| 13 | `/docs/cost-optimization` | Cost optimization guide |
| 14 | `/docs/hooks/use-token-tracker` | Hook: useTokenTracker (cache monitoring) |
| 15 | `/docs/hooks/use-model-router` | Hook: useModelRouter |
| 17 | `/docs/rag` | RAG integration guide |
| 18 | `/docs/agents` | Agent orchestration guide |
| 19 | `/docs/security` | Security guide |
| 20 | `/docs/memory` | Memory management guide |
| 21 | `/docs/getting-started` | Quick start guide |
| 22 | `/docs/components` | Component library index |
| 23 | `/docs/components` | Component library index |
| 24 | `/docs/analytics` | Analytics integration guide |

---

## Required Documentation Structure

```
docs/
├── getting-started.md           # Quick start
├── accessibility.md             # WCAG compliance
├── theming.md                   # Theme system
├── error-handling.md            # Error recovery
├── cost-optimization.md         # Cost management
├── security.md                  # Security features
├── analytics.md                 # Analytics integration
├── rag.md                       # RAG components
├── agents.md                    # Agent orchestration
├── memory.md                    # Memory management
├── components/
│   ├── index.md                 # Component library
│   ├── loading-states.md        # LoadingStates
│   └── thinking-indicator.md    # ThinkingIndicator
└── hooks/
    ├── streaming.md             # SSE/WebSocket hooks
    ├── context-management.md    # Token/context hooks
    ├── use-realistic-typing.md  # useRealisticTyping
    ├── use-token-tracker.md     # useTokenTracker
    ├── use-error-recovery.md    # useErrorRecovery
    ├── use-optimistic-message.md # useOptimisticMessage
    └── use-model-router.md      # useModelRouter
```

---

## Link Verification Checklist

Before publishing, verify each doc page:

- [ ] `/docs/getting-started` - Exists, has intro content
- [ ] `/docs/accessibility` - Exists, covers WCAG
- [ ] `/docs/theming` - Exists, shows themes
- [ ] `/docs/error-handling` - Exists, has examples
- [ ] `/docs/cost-optimization` - Exists, has strategies
- [ ] `/docs/security` - Exists, covers OWASP
- [ ] `/docs/analytics` - Exists, lists providers
- [ ] `/docs/rag` - Exists, has components
- [ ] `/docs/agents` - Exists, has hooks
- [ ] `/docs/memory` - Exists, has architecture
- [ ] `/docs/components` - Index page exists
- [ ] `/docs/components/loading-states` - Component page
- [ ] `/docs/components/thinking-indicator` - Component page
- [ ] `/docs/hooks/streaming` - Hook documentation
- [ ] `/docs/hooks/context-management` - Hook documentation
- [ ] `/docs/hooks/use-realistic-typing` - Hook documentation
- [ ] `/docs/hooks/use-token-tracker` - Hook documentation
- [ ] `/docs/hooks/use-error-recovery` - Hook documentation
- [ ] `/docs/hooks/use-optimistic-message` - Hook documentation
- [ ] `/docs/hooks/use-model-router` - Hook documentation

---

## Fallback Strategy

If a documentation page doesn't exist yet:

1. **Option A:** Create a placeholder page with "Coming soon" and email signup
2. **Option B:** Redirect to `/docs/getting-started`
3. **Option C:** Remove the CTA temporarily (not recommended)

Recommended: Option A for pre-launch, then fill in content over time.

---

## Broken Link Detection

Run this command to find broken internal links:

```bash
# Assuming a Next.js docs site
npx next build 2>&1 | grep "could not be found"

# Or for static site generators
grep -r "/docs/" apps/docs/content/blog/posts/*.md | \
  while read line; do
    url=$(echo "$line" | grep -oE '/docs/[a-z/-]+')
    if [ ! -f "apps/docs/content${url}.md" ]; then
      echo "Missing: $url"
    fi
  done
```

---

## SEO Considerations

Each documentation page should have:

1. **Title** matching the blog post reference
2. **Description** mentioning the feature name
3. **Canonical URL** set correctly
4. **JSON-LD** structured data for documentation

This ensures blog → docs traffic maintains SEO value.
