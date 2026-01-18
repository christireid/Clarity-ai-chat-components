# Architectural Decisions Log

## Decision Template
```
### D-XXX: [Title]
**Date:** YYYY-MM-DD
**Status:** proposed | accepted | deprecated
**Context:** [Why this decision was needed]
**Decision:** [What was decided]
**Alternatives Considered:** [Other options]
**Consequences:** [Trade-offs and implications]
```

---

## Pending Decisions

### D-001: Demo System Architecture
**Date:** 2026-01-08
**Status:** proposed
**Context:** Current playground may be broken. Need to decide on demo approach.
**Options:**
1. Fix existing Sandpack-based playground
2. Replace with live preview + code tabs (MUI-style)
3. Use static code snippets with copy button
**Decision:** TBD after Agent C diagnosis
**Consequences:** Affects all demo pages

### D-002: Syntax Highlighting System
**Date:** 2026-01-08
**Status:** proposed
**Context:** Code blocks need consistent styling across docs
**Options:**
1. Shiki (build-time, better performance)
2. Prism (runtime, more flexibility)
3. rehype-pretty-code (MDX integration)
**Decision:** TBD after Agent E analysis
**Consequences:** Affects code readability and load performance

### D-003: Assistant Provider Architecture
**Date:** 2026-01-08
**Status:** proposed
**Context:** AI assistant needs multi-provider support
**Options:**
1. Single provider with fallback
2. User-selectable provider
3. Automatic provider detection based on env
**Decision:** TBD after Agent D analysis
**Consequences:** Affects assistant UX and setup complexity
