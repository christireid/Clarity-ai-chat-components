# Phase 4: Phased Enhancement Plan

> **Created**: 2025-01-XX **Status**: Not Started **Goal**: Create actionable roadmap for library
> improvements

---

## Enhancement Phases

### Phase 1: Foundations & Quick Wins

**Goal**: Fix critical issues and establish consistency without breaking changes

**Duration**: 2-3 weeks  
**Priority**: HIGH  
**Breaking Changes**: None

#### Scope

**Documentation Improvements:**

1. Create "Choose Your Hook" decision tree
2. Add hook comparison matrix
3. Document escape hatch patterns
4. Add migration guides for deprecated hooks

**Accessibility Fixes:**

1. Audit streaming components for aria-live
2. Replace deprecated `onKeyPress` with `onKeyDown`
3. Add missing aria-expanded/selected attributes
4. Test with screen readers (NVDA, JAWS, VoiceOver)

**Code Quality:**

1. Standardize code block components (7 files)
2. Add data-testid to interactive elements
3. Document component prop patterns

#### Goals

- [ ] Decision tree diagram created
- [ ] All streaming components announce properly
- [ ] Zero `onKeyPress` usage (replace with `onKeyDown`)
- [ ] Code block UX standardized across 7 components
- [ ] Documentation completeness: 95%+

#### Components/Files Affected

**Documentation:**

- `/docs/uiux-library-upgrade/hook-decision-tree.md` (NEW)
- `/docs/getting-started.md` (UPDATE)
- `/packages/react/src/hooks/README.md` (UPDATE)

**Chat Hooks:**

- `/packages/react/src/hooks/chat/use-chat.ts` (add deprecation notices)
- `/packages/react/src/hooks/chat/use-chat-enhanced.ts` (add usage docs)
- `/packages/react/src/hooks/chat/use-chat-simple.ts` (add usage docs)
- `/packages/react/src/hooks/chat/use-clarity-chat.ts` (promote as primary)

**Code Components:**

- `/packages/react/src/components/code/*.tsx` (7 files - standardize)
- `/packages/react/src/components/message/message.tsx` (code block integration)

**Keyboard Navigation:**

- Search and replace: `onKeyPress` → `onKeyDown` (1 instance found)
- Verify: All components in `/packages/react/src/components/navigation/`

**Streaming Components:**

- `/packages/react/src/components/message/message.tsx` (verify aria-live)
- `/packages/react/src/components/chat/chat-window.tsx` (verify announcements)
- `/packages/react/src/hooks/streaming/*.ts` (6 files - check announcements)

#### API Changes

**None** - This phase is backward compatible.

#### Migration Considerations

**None required** - Only additions and documentation improvements.

#### Acceptance Criteria

1. **Documentation:**
   - [ ] Decision tree published with 3+ decision points
   - [ ] Each hook has "When to use" section in JSDoc
   - [ ] Escape hatch patterns documented with examples

2. **Accessibility:**
   - [ ] All streaming messages announce to screen readers
   - [ ] Zero deprecated `onKeyPress` handlers
   - [ ] WCAG AAA compliance maintained
   - [ ] Manual testing with 3 screen readers completed

3. **Code Quality:**
   - [ ] All 7 code components have: syntax highlighting, copy button, language badge
   - [ ] Code block props standardized across components
   - [ ] Storybook stories updated with code examples

4. **Testing:**
   - [ ] All changes covered by unit tests
   - [ ] Visual regression tests pass
   - [ ] Accessibility audit passes (aXe/Lighthouse)

#### Risks & Mitigations

| Risk                                       | Impact | Probability | Mitigation                      |
| ------------------------------------------ | ------ | ----------- | ------------------------------- |
| Documentation doesn't clarify confusion    | Medium | Low         | User testing with 5 developers  |
| Screen reader testing reveals gaps         | Medium | Medium      | Allocate extra sprint buffer    |
| Code standardization breaks existing usage | High   | Low         | Maintain backward compatibility |

**Risk Score**: LOW (all changes are additive)

---

### Phase 2: Core AI Components & API Improvements

**Goal**: Enhance AI-specific components and improve extensibility

**Duration**: 2-3 weeks  
**Priority**: HIGH to MEDIUM  
**Breaking Changes**: Minor (with deprecation warnings)

#### Scope

**AI UX Enhancements:**

1. Create `<MessageActions>` compound component
2. Add citation and trust cue components
3. Improve streaming experience (stop button, cursor)
4. Add tool call visualization components

**API Ergonomics:**

1. Add `style` prop to remaining 50% of components
2. Implement `asChild` pattern for 20+ components
3. Add ref forwarding to interactive components
4. Create consistent callback naming (with deprecation)

**Performance:**

1. Optimize streaming rendering
2. Add React.memo to expensive components
3. Implement virtual scrolling optimizations

#### Goals

- [ ] `<MessageActions>` compound component shipped
- [ ] Citation components available
- [ ] Tool call visualization functional
- [ ] 100% of components accept `className` and `style`
- [ ] 50+ components support `asChild` pattern
- [ ] All interactive components forward refs

#### Components/Files Affected

**New Components:**

- `/packages/react/src/components/message/message-actions.tsx` (NEW)
- `/packages/react/src/components/message/citation.tsx` (NEW)
- `/packages/react/src/components/message/confidence-badge.tsx` (NEW)
- `/packages/react/src/components/ai/tool-call-display.tsx` (NEW)
- `/packages/react/src/components/ai/reasoning-panel.tsx` (NEW)

**Updated Components (add style/asChild/ref):**

- All 177 component files need audit for escape hatches
- Priority: `/packages/react/src/components/chat/*.tsx` (11 files)
- Priority: `/packages/react/src/components/message/*.tsx` (24 files)
- Priority: `/packages/react/src/components/input/*.tsx` (6 files)

**Streaming Improvements:**

- `/packages/react/src/components/chat/chat-window.tsx` (add stop button)
- `/packages/react/src/components/message/message.tsx` (cursor animation)
- `/packages/react/src/hooks/streaming/*.ts` (6 files - optimize)

#### API Changes

**Additions (Non-Breaking):**

```typescript
// MessageActions compound component
<Message>
  <Message.Actions>
    <Message.Copy />
    <Message.Regenerate />
    <Message.Edit />
    <Message.Branch />
    <Message.Delete />
  </Message.Actions>
</Message>

// asChild pattern
<Button asChild>
  <a href="/somewhere">Click me</a>
</Button>

// Citation component
<Citation source="https://..." confidence={0.95} />
```

**Deprecations (Breaking in v3.0):**

```typescript
// OLD (deprecated)
onValueChange={...}  // Deprecate in favor of onChange

// NEW (standard)
onChange={...}
```

#### Migration Considerations

**For Users:**

1. `MessageActions` is opt-in, existing code works
2. `asChild` is optional, doesn't affect existing usage
3. Deprecated props will show console warnings
4. Migration codemod will be provided for v3.0

**Migration Timeline:**

- v2.1: Add new patterns alongside old
- v2.2-2.5: Deprecation warnings
- v3.0: Remove deprecated patterns (6+ months notice)

#### Acceptance Criteria

1. **AI UX:**
   - [ ] MessageActions component with 5 actions
   - [ ] Citation component with source links
   - [ ] Tool call display with expand/collapse
   - [ ] Stop button visible during streaming
   - [ ] Smooth cursor animation (60fps)

2. **API Ergonomics:**
   - [ ] 100% components accept `className` + `style`
   - [ ] 50+ high-use components support `asChild`
   - [ ] All interactive components forward refs
   - [ ] Prop naming audit completed

3. **Performance:**
   - [ ] Streaming renders at <16ms per frame
   - [ ] Virtual scrolling handles 10,000+ messages
   - [ ] Bundle size increase <10KB

4. **Documentation:**
   - [ ] All new components have Storybook stories
   - [ ] Migration guide for deprecated props
   - [ ] asChild pattern documented with examples

#### Risks & Mitigations

| Risk                                   | Impact | Probability | Mitigation                   |
| -------------------------------------- | ------ | ----------- | ---------------------------- |
| asChild pattern confuses developers    | Medium | Medium      | Extensive docs + examples    |
| MessageActions breaks existing layouts | High   | Low         | Make opt-in, test thoroughly |
| Performance regressions                | High   | Low         | Benchmark before/after       |
| Bundle size increases significantly    | Medium | Medium      | Tree-shaking optimization    |

**Risk Score**: MEDIUM

---

### Phase 3: v3.0 - Architectural Improvements

**Goal**: Break compatibility for long-term improvements

**Duration**: 4-6 weeks  
**Priority**: MEDIUM  
**Breaking Changes**: YES (major version bump)

#### Scope

**Hook Consolidation:**

1. Merge 8 chat hooks into 3 clear options
2. Remove deprecated hooks
3. Unified API surface

**Component Refactoring:**

1. Compound component pattern for high-prop-count components
2. Config object pattern for complex configuration
3. Slot-based composition

**Architecture:**

1. Improved TypeScript generics
2. Better tree-shaking
3. Reduced bundle size

#### Goals

- [ ] Chat hooks reduced from 8 to 3
- [ ] ClarityChat props reduced from 25+ to <10
- [ ] Compound component pattern for 10+ components
- [ ] Bundle size reduced by 15%
- [ ] Migration codemod available

#### Components/Files Affected

**Hook Consolidation:**

- REMOVE: `/packages/react/src/hooks/chat/use-chat.ts`
- REMOVE: `/packages/react/src/hooks/chat/use-chat-core.ts`
- REMOVE: `/packages/react/src/hooks/chat/use-chat-unified.ts`
- KEEP & ENHANCE:
  - `use-clarity-chat.ts` (primary, simple use cases)
  - `use-chat-enhanced.ts` (advanced features)
  - `use-chat-composable.ts` (full customization)

**Component Refactoring:**

- `/packages/react/src/components/chat/clarity-chat.tsx` (compound components)
- `/packages/react/src/components/chat/chat-window.tsx` (compound components)
- `/packages/react/src/components/message/message.tsx` (slot-based)

#### API Changes

**Breaking Changes:**

```typescript
// OLD (v2.x)
<ClarityChat
  api="/api/chat"
  showHeader={true}
  sessionTitle="Chat"
  sessionSubtitle="AI Assistant"
  headerActions={<Button />}
  // ... 20 more props
/>

// NEW (v3.0 - Option 1: Compound)
<ClarityChat api="/api/chat">
  <ClarityChat.Header
    title="Chat"
    subtitle="AI Assistant"
    actions={<Button />}
  />
  <ClarityChat.Messages />
  <ClarityChat.Input />
</ClarityChat>

// NEW (v3.0 - Option 2: Config)
<ClarityChat
  api="/api/chat"
  config={{
    ui: { header: { title: "Chat", show: true } },
    features: { export: true, clear: true }
  }}
/>
```

**Removed Hooks:**

```typescript
// REMOVED in v3.0
import { useChat } from '@clarity-chat/react'
import { useChatCore } from '@clarity-chat/react'
import { useChatUnified } from '@clarity-chat/react'

// USE INSTEAD
import { useClarityChat } from '@clarity-chat/react'
```

#### Migration Considerations

**Migration Strategy:**

1. Release v2.9 with deprecation warnings 3 months before v3.0
2. Provide automated codemod for common patterns
3. Maintain v2.x LTS for 12 months after v3.0
4. Document all breaking changes with examples

**Codemod Coverage:**

- [ ] ClarityChat prop spreading → compound components
- [ ] Deprecated hooks → useClarityChat
- [ ] Old callback names → standardized names

#### Acceptance Criteria

1. **Hook Consolidation:**
   - [ ] 8 hooks reduced to 3
   - [ ] Clear decision tree (simple → advanced → composable)
   - [ ] 100% feature parity maintained
   - [ ] All tests passing

2. **Component Refactoring:**
   - [ ] ClarityChat props: 25+ → <10
   - [ ] Compound pattern for 10+ components
   - [ ] Backward compatibility via legacy wrapper
   - [ ] Migration examples for all patterns

3. **Architecture:**
   - [ ] Bundle size reduced 15%
   - [ ] Tree-shaking verified
   - [ ] TypeScript inference improved
   - [ ] Zero new dependencies

4. **Migration Support:**
   - [ ] Codemod covers 90%+ of use cases
   - [ ] Migration guide with before/after examples
   - [ ] Video tutorial created
   - [ ] Community feedback collected

#### Risks & Mitigations

| Risk                            | Impact | Probability | Mitigation                   |
| ------------------------------- | ------ | ----------- | ---------------------------- |
| Major version scares users away | High   | Medium      | Clear benefits communication |
| Migration too complex           | High   | Medium      | Excellent codemod + docs     |
| Feature regressions             | High   | Low         | Comprehensive test coverage  |
| Community backlash              | Medium | Low         | Long deprecation period      |
| Breaking existing apps          | High   | Medium      | LTS support for v2.x         |

**Risk Score**: HIGH (but manageable with good communication)

---

## Implementation Timeline

### Overall Schedule (14-17 weeks total)

```
Week 1-3:   Phase 1 - Foundations & Quick Wins
Week 4-6:   Phase 2 - Core AI Components (Part 1)
Week 7-9:   Phase 2 - Core AI Components (Part 2)
Week 10:    Testing, Bug Fixes, Documentation
Week 11-17: Phase 3 - v3.0 (if approved)
```

### Detailed Sprint Breakdown

#### Sprint 1 (Weeks 1-3): Foundations

- **Week 1**: Documentation improvements
  - Days 1-2: Create hook decision tree
  - Days 3-5: Update all hook documentation
- **Week 2**: Accessibility fixes
  - Days 1-2: Audit streaming aria-live
  - Days 3-4: Fix keyboard navigation
  - Day 5: Screen reader testing
- **Week 3**: Code quality
  - Days 1-3: Standardize 7 code components
  - Days 4-5: Testing and documentation

**Deliverables:**

- ✅ Hook decision tree published
- ✅ Zero accessibility issues
- ✅ Unified code block component

#### Sprint 2 (Weeks 4-6): AI Components Part 1

- **Week 4**: MessageActions compound component
  - Days 1-3: Build component + 5 actions
  - Days 4-5: Storybook stories + tests
- **Week 5**: Citation & Trust Cues
  - Days 1-2: Citation component
  - Days 3-4: Confidence badges, metadata
  - Day 5: Integration testing
- **Week 6**: Tool Call Visualization
  - Days 1-3: ToolCallDisplay component
  - Days 4-5: Examples + documentation

**Deliverables:**

- ✅ MessageActions shipped
- ✅ Citation system functional
- ✅ Tool calls visualized

#### Sprint 3 (Weeks 7-9): API Improvements

- **Week 7**: Escape hatches
  - Days 1-3: Add style prop to 50% of components
  - Days 4-5: Test + document
- **Week 8**: asChild pattern
  - Days 1-4: Implement for 50+ components
  - Day 5: Documentation + examples
- **Week 9**: Ref forwarding
  - Days 1-3: Add to interactive components
  - Days 4-5: Testing + regression checks

**Deliverables:**

- ✅ 100% components have style prop
- ✅ asChild pattern available
- ✅ Ref forwarding complete

#### Sprint 4 (Week 10): Stabilization

- Testing week (no new features)
- Bug fixes from community feedback
- Documentation polish
- Performance benchmarking

**Deliverables:**

- ✅ All tests passing
- ✅ No regressions
- ✅ Documentation complete

#### Sprint 5-8 (Weeks 11-17): v3.0 (Optional)

- **Week 11-12**: Hook consolidation
- **Week 13-14**: Component refactoring
- **Week 15-16**: Migration tooling
- **Week 17**: Beta testing + release

**Deliverables:**

- ✅ v3.0 shipped
- ✅ Migration codemod
- ✅ LTS support for v2.x

---

## Resource Requirements

### Team Composition

**Recommended Team:**

- 1 Senior Engineer (full-time) - Technical lead
- 1 Mid-level Engineer (full-time) - Implementation
- 1 Designer (25% time) - Visual consistency review
- 1 Technical Writer (25% time) - Documentation
- 1 QA Engineer (50% time) - Testing
- 1 Accessibility Specialist (consulting) - A11y review

**Alternative (Smaller Team):**

- 1 Full-stack Engineer (full-time) - All implementation
- 1 Designer/Writer (25% time) - Design + docs
- Community volunteers for testing

### Skills Required

**Phase 1 (Essential):**

- React 19 expertise
- TypeScript advanced
- Accessibility (WCAG 2.2)
- Technical writing

**Phase 2 (Essential):**

- Component library design
- API design patterns
- Performance optimization
- Storybook

**Phase 3 (v3.0 - If pursuing):**

- Breaking change management
- Migration tooling (AST manipulation)
- Community management
- Codemod authoring

### External Dependencies

**None** - All work can be done internally.

**Optional:**

- User testing platform (for decision tree validation)
- Accessibility testing service (for comprehensive audit)
- Community feedback (Discord, GitHub Discussions)

---

## Success Metrics

### Quantitative Metrics

#### Developer Experience (DX)

```
Target Metrics:
- Time to first integration: <10 minutes (from 20 minutes)
- Documentation completeness: 95%+ (from 85%)
- Hook selection confusion: <10% of developers (from 40%)
- Component customization success: 90%+ (from 60%)
```

#### Code Quality

```
Target Metrics:
- Bundle size: -15% (Phase 3 only)
- Test coverage: 85%+ (maintained)
- TypeScript strict mode: 100%
- ESLint errors: 0
- Accessibility score (Lighthouse): 100
```

#### Component Metrics

```
Target Metrics:
- Components with className: 100% (from 110%)
- Components with style prop: 100% (from 49%)
- Components with asChild: 30%+ (from 1.7%)
- Components with ref forwarding: 50%+ (from 0.6%)
```

#### AI UX Metrics

```
Target Metrics:
- Code block feature parity: 100% (from ~70%)
- Message action availability: 100% (from partial)
- Streaming UX polish: 9/10 rating (from 7/10)
- Tool call visualization: Available (from missing)
```

### Qualitative Metrics

#### User Satisfaction

- **Survey target**: 8.5/10 satisfaction score (from 7.5/10)
- **NPS target**: +50 (from +30)
- **GitHub issues**: <5 open confusion issues (from 15)
- **Documentation clarity**: 9/10 rating (from 7/10)

#### Community Engagement

- **Discord activity**: +30% increase
- **GitHub stars**: +20% increase
- **NPM downloads**: +50% increase
- **Tutorial completions**: 80%+ success rate

### Phase-Specific Success Criteria

#### Phase 1 Success = 4/5 criteria met

1. ✅ Hook decision tree used by 80%+ of new developers
2. ✅ Zero accessibility regressions (automated tests)
3. ✅ Code block standardization reduces related issues by 50%
4. ✅ Documentation satisfaction: 8/10+
5. ✅ Community feedback: "Much clearer!" sentiment

#### Phase 2 Success = 5/6 criteria met

1. ✅ MessageActions adopted in 60%+ of implementations
2. ✅ Citation components used in production apps
3. ✅ Tool call visualization demos successful
4. ✅ asChild pattern documented in top 10 most-viewed docs
5. ✅ Escape hatch complaints reduced by 70%
6. ✅ Bundle size increase <10KB

#### Phase 3 Success = 5/6 criteria met (if pursuing)

1. ✅ 90%+ of users migrate successfully using codemod
2. ✅ Hook consolidation reduces confusion to <10%
3. ✅ Bundle size reduced 15%+
4. ✅ No major regressions in production apps
5. ✅ Community support: 75%+ approval
6. ✅ LTS v2.x has <10 critical bugs

### Monitoring Plan

**Weekly Metrics:**

- CI/CD success rate
- Test coverage %
- Bundle size (bytes)
- Build time
- Lighthouse scores

**Monthly Metrics:**

- NPM download trends
- GitHub issue volume
- Discord question patterns
- Documentation page views
- User survey responses

**Quarterly Metrics:**

- NPS score
- Community growth
- Production adoption rate
- Breaking issue count

### Rollback Criteria

**Automatic Rollback Triggers:**

- Test coverage drops below 75%
- Accessibility score drops below 90
- Breaking changes without deprecation path
- Bundle size increases >25%

**Manual Rollback Consideration:**

- Community backlash (>30% negative)
- Production critical bugs (>5 in first week)
- Performance degradation (>20% slower)
- Major framework incompatibility

---

## Validation Plan

After each phase:

- [ ] Staff Engineering Review
- [ ] AI Library Product Review
- [ ] Reuse & Simplification Audit
- [ ] QA & Security Review
- [ ] Research Spot-Check
