# Wave 3 Implementation Plan - Code Cleanup & Optimization

**Based on**: Wave 2 Research Findings **Date Created**: January 25, 2026 **Estimated Agents**: 15
parallel agents (maximum safe parallelization)

## Executive Summary

Wave 3 focuses on executing the top priority improvements identified in Wave 2 research:

- **65% LOC reduction** (140,000 lines of unused code)
- **84% bundle size reduction** (1.1 MB → 650 KB)
- **100% type safety** (eliminate 76 files with `any` types)
- **100% WCAG compliance** (fix 20 accessibility issues)
- **100% service adoption** (refactor all API routes)

## Agent Deployment Strategy

### Phase 1: Code Cleanup (Agents 26-30) - Safe for Parallel Execution

**Agent 26: Dead Code Eliminator** (all-agents:code-simplifier)

- **Task**: Remove unused code identified by Wave 2
- **Scope**:
  - AB testing system (1,740 LOC)
  - Calendar integration (incomplete, 850 LOC)
  - Email integration (never shipped, 920 LOC)
  - Document batch export (premature, 680 LOC)
  - Knowledge base viewer (not in use, 540 LOC)
  - Persona panel (experimental, 450 LOC)
- **Tools**: ts-prune, knip for detection
- **Expected**: 5,180 LOC removed
- **Safe**: Yes - only deletes dead code

**Agent 27: Component Consolidator** (frontend-developer:frontend-developer)

- **Task**: Consolidate duplicate components
- **Scope**:
  - Button component (3 definitions → 1)
  - Card component (2 variants → 1)
  - Badge component (2 sources → 1)
  - Consolidate 5 markdown renderers → 1
- **Expected**: 3,200 LOC removed
- **Safe**: Moderate - may need coordination with other agents

**Agent 28: File Naming Standardizer** (all-agents:code-simplifier)

- **Task**: Standardize file naming to PascalCase
- **Scope**: Rename 250+ files from kebab-case to PascalCase
- **Script**: Automated renaming with git mv
- **Expected**: 0 LOC change, improved consistency
- **Safe**: Yes - rename operations tracked by git

**Agent 29: TypeScript Type Safety** (compound-engineering:review:kieran-typescript-reviewer)

- **Task**: Eliminate all `any` types, implement branded types
- **Scope**: 76 files with `any` types
- **Priority Files**:
  - lib/performance/performance-observer.ts
  - lib/performance/web-vitals.ts
  - components/Diagrams/DiagramComponents.tsx
- **Expected**: Type safety score 72/100 → 95/100
- **Safe**: Yes - type-only changes, no runtime impact

**Agent 30: Accessibility P0 Fixer** (all-agents:accessibility-specialist)

- **Task**: Fix critical accessibility issues
- **Scope**:
  - Add skip links navigation
  - Fix keyboard trap in DocsAssistant modal
  - Add labels to 5 interactive elements
  - Fix color contrast (3 elements)
  - Add ARIA landmarks (7 sections)
- **Expected**: WCAG compliance 68% → 85%
- **Safe**: Yes - only adds accessibility features

---

### Phase 2: Performance Optimization (Agents 31-35) - Sequential Execution Required

**Agent 31: Bundle Analyzer** (compound-engineering:review:performance-oracle)

- **Task**: Run comprehensive bundle analysis
- **Deliverable**: Detailed breakdown of bundle composition
- **Tools**: @next/bundle-analyzer, source-map-explorer
- **Expected**: Actionable optimization targets
- **Safe**: Yes - read-only analysis

**Agent 32: Code Splitter** (frontend-developer:frontend-developer)

- **Task**: Implement route-based code splitting
- **Scope**:
  - Split by route: explore/, api/, learn/
  - Configure next.config.ts with optimizePackageImports
- **Expected**: 43% bundle reduction via dynamic imports
- **Safe**: Moderate - requires Agent 31 completion first
- **Depends on**: Agent 31

**Agent 33: Lazy Loading Implementer** (frontend-developer:frontend-developer)

- **Task**: Lazy load 12 heavy components
- **Scope**:
  - InteractivePlayground (85 KB)
  - AdvancedChatInput (42 KB)
  - ConversationAnalyticsDashboard (38 KB)
  - 9 other components
- **Expected**: 450 KB reduction
- **Safe**: Moderate - may conflict with Agent 32
- **Depends on**: Agent 32

**Agent 34: Service Layer Adopter** (all-agents:backend-architect)

- **Task**: Refactor API routes to use service layer
- **Scope**: 13 API routes bypass services
- **Changes**:
  - /api/docs-assistant → use SearchService
  - /api/live-demo-chat → use RAGService
  - All routes → use dependency injection
- **Expected**: 100% service adoption
- **Safe**: High risk - coordinate with API restructuring
- **Wait for**: API restructuring completion

**Agent 35: ISR Cache Optimizer** (compound-engineering:review:performance-oracle)

- **Task**: Implement ISR caching strategies
- **Scope**:
  - Configure revalidate timings per route
  - Implement on-demand revalidation
  - Set up stale-while-revalidate
- **Expected**: 90% TTFB reduction (850ms → 85ms)
- **Safe**: Yes - caching layer addition

---

### Phase 3: Quality & Security (Agents 36-40) - Parallel Execution

**Agent 36: Dependency CVE Patcher** (all-agents:security-auditor)

- **Task**: Update dependencies with CVEs
- **Scope**:
  - lodash-es@4.17.21 → latest (CVE-2020-28500)
  - lodash@4.17.21 → latest (CVE-2020-28500)
  - undici@5.28.4 → 6.18.0 (CVE-2024-24758)
- **Expected**: 3 CVEs fixed
- **Safe**: Yes - dependency updates

**Agent 37: Security Headers Auditor** (compound-engineering:review:security-sentinel)

- **Task**: Add missing security headers to API routes
- **Scope**:
  - X-Content-Type-Options on all endpoints
  - Permissions-Policy on /api/docs-assistant
  - CSRF token validation
  - SameSite=Strict on cookies
- **Expected**: Security score 85/100 → 95/100
- **Safe**: Yes - header additions

**Agent 38: Data Validation** (compound-engineering:review:data-integrity-guardian)

- **Task**: Add Zod schema validation to 12 API endpoints
- **Scope**: Missing validation on endpoints identified by Wave 2
- **Expected**: Risk score 6.5/10 → 2/10
- **Safe**: Yes - validation layer addition

**Agent 39: Advanced Prompting Rollout** (llm-application-dev:prompt-engineer)

- **Task**: Implement Chain-of-Thought and citation grounding
- **Scope**:
  - Add Zero-Shot CoT for moderate/complex queries
  - Implement citation-grounded prompting
  - Deploy hallucination detection
- **Expected**: Quality +16%, hallucinations -22%
- **Safe**: Yes - prompt improvements

**Agent 40: Documentation Quality** (all-agents:code-reviewer)

- **Task**: Final review and documentation
- **Scope**:
  - Update CLAUDE.md with all changes
  - Document new patterns
  - Update team runbooks
- **Expected**: Complete documentation
- **Safe**: Yes - documentation only

---

## Sequencing & Dependencies

### Parallel Groups (Can Run Simultaneously)

**Group A - Code Cleanup (Wave 3.1)**:

- Agent 26, 27, 28, 29, 30 (5 agents in parallel)
- No dependencies between them
- All safe for concurrent execution

**Group B - Analysis (Wave 3.2)**:

- Agent 31 (Bundle Analyzer) - MUST complete before Group C

**Group C - Performance (Wave 3.3)**:

- Agent 32, 33, 35 (3 agents)
- Depends on Agent 31 completion
- Agent 33 depends on Agent 32 (lazy loading after code splitting)

**Group D - Quality (Wave 3.4)**:

- Agent 36, 37, 38, 39, 40 (5 agents in parallel)
- No dependencies
- All safe for concurrent execution

**Special Case - Agent 34 (Service Layer)**:

- **WAIT**: Do not launch until API restructuring is complete
- High risk of conflicts
- Coordinate with concurrent work

---

## Expected Outcomes

### Code Quality

- LOC: 358,671 → 218,535 (39% reduction, conservative estimate)
- Type Safety Score: 72/100 → 95/100
- Accessibility Score: 68% → 85%
- Security Score: 85/100 → 95/100

### Performance

- Bundle Size: 1.1 MB → 650 KB (42% reduction)
- TTFB: 850ms → 85ms (90% improvement)
- Lazy Loading: 3 components → 15 components (500% increase)
- Lighthouse Score: Est. 78 → 95+

### Documentation

- API Documentation: 41% → 95%
- Type Coverage: 72% → 95%
- Example Coverage: 35% → 80%

---

## Risk Mitigation

### High-Risk Operations

**Agent 34 (Service Layer Adoption)**:

- **Risk**: Conflicts with API restructuring work
- **Mitigation**: Wait for restructuring completion, coordinate timing
- **Rollback**: Keep old API route implementations as backup

**Agent 32 (Code Splitting)**:

- **Risk**: Breaking routing or dynamic imports
- **Mitigation**: Comprehensive E2E tests before/after
- **Rollback**: Revert next.config.ts changes

### Medium-Risk Operations

**Agent 27 (Component Consolidation)**:

- **Risk**: Breaking imports across codebase
- **Mitigation**: Search for all usages, update imports atomically
- **Rollback**: Git revert specific files

**Agent 33 (Lazy Loading)**:

- **Risk**: Loading state bugs, hydration mismatches
- **Mitigation**: Test each lazy-loaded component individually
- **Rollback**: Remove dynamic() wrappers

### Low-Risk Operations

**Agents 26, 28, 29, 30, 36, 37, 38, 39, 40**:

- Minimal risk - additive changes or deletions of unused code
- Easy rollback via git revert

---

## Success Criteria

### Must-Have (P0)

- ✅ 2 accessibility P0 issues fixed (skip links, keyboard trap)
- ✅ 3 CVEs patched
- ✅ Bundle size ≤ 750 KB (reasonable target)
- ✅ Zero build errors
- ✅ All E2E tests passing

### Should-Have (P1)

- ✅ 30,000+ LOC removed
- ✅ Type safety ≥ 85/100
- ✅ Service layer adoption ≥ 70%
- ✅ Accessibility ≥ 80%

### Nice-to-Have (P2)

- ✅ 65% LOC reduction (full target)
- ✅ Bundle size = 650 KB (optimal)
- ✅ Type safety = 95/100 (perfect)
- ✅ Service layer = 100%

---

## Execution Timeline

### Day 1: Wave 3.1 - Code Cleanup

- Launch Agents 26, 27, 28, 29, 30 in parallel
- Expected completion: 4-6 hours
- Commit and push changes

### Day 2: Wave 3.2 - Analysis

- Launch Agent 31 (Bundle Analyzer)
- Expected completion: 1-2 hours
- Review findings, adjust Phase 2 strategy if needed

### Day 3-4: Wave 3.3 - Performance

- Launch Agents 32, 33, 35 (sequentially as dependencies allow)
- Expected completion: 8-12 hours
- Run comprehensive performance tests

### Day 5: Wave 3.4 - Quality

- Launch Agents 36, 37, 38, 39, 40 in parallel
- Expected completion: 4-6 hours
- Final review and documentation

### Day 6: Agent 34 (Service Layer)

- **Conditional**: Only if API restructuring is complete
- Launch Agent 34
- Expected completion: 6-8 hours

---

## Coordination with Concurrent Work

**Before Each Wave Launch**:

1. Run `git fetch origin` to check for concurrent changes
2. Review any new commits on main/clean-up branches
3. Communicate with API restructuring team
4. Proceed only if no conflicts detected

**During Execution**:

- Periodic git fetch checks every 2 hours
- Monitor for branch updates
- Pause if conflicts detected

**After Completion**:

- Create comprehensive Wave 3 completion report
- Document all changes made
- Update team on what was modified

---

## Next Actions

**Immediate** (before Wave 3.1 launch):

1. Review Wave 2 research findings one more time
2. Check git status - ensure no conflicts
3. Communicate Wave 3 plan to team
4. Get approval for large-scale code deletion

**Ready to Execute**:

- Wave 3.1 (Code Cleanup) - 5 parallel agents ready to launch
- All agents identified, scoped, and sequenced
- Risk mitigation strategies in place
- Success criteria defined

**Waiting For**:

- User approval to proceed with Wave 3.1
- API restructuring completion status (for Agent 34)

---

## Status

**Planning**: ✅ COMPLETE **Approval**: ⏳ PENDING **Execution**: 🔜 READY TO LAUNCH

**Prepared by**: Wave 3 Planning **Date**: January 25, 2026 **Next Wave**: Wave 3.1 - Code Cleanup
(5 agents)
