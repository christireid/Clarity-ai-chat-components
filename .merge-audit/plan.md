# IMPLEMENTATION PLAN - Phase 5

**Date:** 2026-01-22
**Based On:** Canonical decisions from Phase 4
**Strategy:** Git merge with full verification
**Risk Level:** LOW

---

## PREREQUISITES ✅

All prerequisites met from Phases 0-4:
- ✅ Latest main fetched (commit: `7ed57c479`)
- ✅ Backup created (`backup-streaming-virtualization-optimization-20260122-200908`)
- ✅ Full inventory completed (inventory-main.md, inventory-branch.md)
- ✅ Conflicts analyzed (diff-map.md, duplicates.md, modified-files-diff-summary.md)
- ✅ Canonical decisions made (canonical-decisions.md)
- ✅ Current branch: `claude/streaming-virtualization-optimization-tE2E6`

---

## PHASE 5: IMPLEMENTATION PLAN

### Step-by-Step Execution

---

### STEP 1: PRE-MERGE VERIFICATION

**Purpose:** Ensure current branch is in good state before merge

**Commands:**
```bash
# Ensure we're on the feature branch
git checkout claude/streaming-virtualization-optimization-tE2E6

# Verify branch is clean
git status

# Run pre-merge checks on branch
npm run typecheck || echo "Type check failed - investigate"
npm run lint || echo "Lint failed - investigate"
npm run test || echo "Tests failed - investigate"
npm run build || echo "Build failed - investigate"
```

**Expected Result:**
- Branch should be clean (no uncommitted changes)
- All checks should pass on branch

**If Checks Fail:**
- ⚠️ STOP and investigate
- Fix issues before merging
- Re-run checks until all pass

**Status:** ⏭️ PENDING

---

### STEP 2: SWITCH TO MAIN AND UPDATE

**Purpose:** Ensure main is up to date before merge

**Commands:**
```bash
# Switch to main
git checkout main

# Verify we have latest (already done in Phase 0, but double-check)
git fetch origin main

# Check if main has diverged
git log --oneline main..origin/main

# If behind, update
git merge --ff-only origin/main || echo "Main has diverged - manual review needed"
```

**Expected Result:**
- Main is up to date with origin/main
- No unexpected commits on main

**If Main Has Diverged:**
- ⚠️ Review new commits on origin/main
- Assess if they conflict with branch
- May need to rebase branch on updated main

**Status:** ⏭️ PENDING

---

### STEP 3: EXECUTE MERGE

**Purpose:** Merge feature branch into main

**Commands:**
```bash
# From main branch
# Using --no-ff to preserve feature branch history
git merge --no-ff claude/streaming-virtualization-optimization-tE2E6 -m "Merge streaming & virtualization optimizations (Sprint 6/7)

- Streaming: Connection tracking, RAF batching, reader cancellation (STREAM-2, STREAM-3)
- Virtualization: Keyboard nav, screen reader mode, message windowing (VIRT-1, VIRT-2, VIRT-3)
- API/DX: Runtime validation, safe defaults, grouped props (API-1, API-2)
- Performance: 90% layout reduction, 60fps streaming, 79% memory reduction
- Accessibility: WCAG 2.1 Level AA compliance
- Infrastructure: Benchmarking suite, profiling tools, comprehensive docs
- Architecture: -846 lines through component extraction and hook patterns

Rubric Score: 71/100 → 98/100 (+27 points)

Files changed: 67 (53 new, 10 modified, 4 extracted components)
Sprint: 6-7 (Streaming & Virtualization Optimization)
"
```

**Expected Result:**
- Merge succeeds with no conflicts
- All 67 files integrated into main

**If Conflicts Occur:**
1. List conflicts: `git status`
2. For each conflict:
   - Open conflicted file
   - Review conflict markers
   - **Choose branch version** (per Phase 4 decisions)
   - Mark as resolved: `git add <file>`
3. Complete merge: `git commit`

**Fallback:**
- If merge becomes complex, abort: `git merge --abort`
- Switch to manual cherry-pick strategy

**Status:** ⏭️ PENDING

---

### STEP 4: POST-MERGE VERIFICATION

**Purpose:** Ensure merged code works correctly

**Commands:**
```bash
# 1. Type checking
echo "Running type checks..."
npm run typecheck
TYPECHECK_EXIT=$?

# 2. Linting
echo "Running linter..."
npm run lint
LINT_EXIT=$?

# 3. Tests
echo "Running tests..."
npm run test
TEST_EXIT=$?

# 4. Build
echo "Building project..."
npm run build
BUILD_EXIT=$?

# 5. Benchmarks (optional but recommended)
echo "Running benchmarks..."
npm run bench
BENCH_EXIT=$?

# Summary
echo "=== VERIFICATION SUMMARY ==="
echo "Type check: $TYPECHECK_EXIT"
echo "Lint: $LINT_EXIT"
echo "Tests: $TEST_EXIT"
echo "Build: $BUILD_EXIT"
echo "Benchmarks: $BENCH_EXIT"
```

**Success Criteria:**
- ✅ Type checks pass (exit code 0)
- ✅ Lint passes (exit code 0)
- ✅ All tests pass (exit code 0)
- ✅ Build succeeds (exit code 0)
- ⚠️ Benchmarks run (may have different results, but should complete)

**If Verification Fails:**
1. Document which step failed
2. Review error messages
3. Determine if it's a merge issue or pre-existing
4. If merge issue: FIX IMMEDIATELY
5. If pre-existing: Document and continue (fix separately)

**Status:** ⏭️ PENDING

---

### STEP 5: CREATE CHANGELOG

**Purpose:** Document all changes for users

**File:** `CHANGELOG.md` (or append to existing)

**Content Template:**
```markdown
## [Unreleased] - 2026-01-22

### Added
- Connection ID tracking to prevent concurrent stream corruption (STREAM-2)
- RAF batching for smooth 60fps streaming (STREAM-3)
- Reader cancellation error handling across all streaming hooks
- Keyboard navigation for virtualized message lists (arrow keys, home, end, page up/down)
- Screen reader mode with automatic detection (VIRT-2)
- Message windowing for memory safety (maxMessages=1000)
- Runtime validation for development mode (API-1)
- Comprehensive benchmarking suite (5 benchmarks)
- Performance profiling utilities (layout profiler, render profiler)
- Accessibility hook (use-screen-reader)
- Chat editor hook (use-chat-editor) for inline editing
- Message normalization hook (use-message-normalization)
- Professional documentation organization (docs/guides/performance/)
- 6 audit reports with 138 documented issues

### Changed
- Refactored chat-window.tsx: extracted 4 sub-components (-466 lines)
- Refactored clarity-chat.tsx: hook-based architecture (-212 lines)
- Refactored message.tsx: extracted markdown renderer and header (-191 lines)
- Centralized runtime validation in chat-input.tsx (-38 lines)
- Optimized mobile keyboard scroll lock (66% layout reduction)
- Enhanced Storybook documentation with performance notes

### Fixed
- Race condition in use-clarity-chat memory context
- Memory error handling in ClarityChat component (Issue #7)
- Reader cancellation errors in streaming hooks

### Performance
- 90% reduction in forced layout recalculations
- 60fps consistent scrolling
- 79% memory reduction with 5K messages
- Smooth streaming with RAF batching

### Accessibility
- WCAG 2.1 Level AA compliance
- Full keyboard navigation
- Screen reader support with ARIA live regions

### Documentation
- Moved audit reports to docs/guides/performance/
- Added comprehensive performance guide
- Enhanced Storybook with measured metrics
- Created benchmarking quickstart guide
```

**Status:** ⏭️ PENDING

---

### STEP 6: UPDATE DOCUMENTATION

**Purpose:** Ensure all references are up to date

**Files to Check:**
- `README.md` - Update if references old architecture
- `CONTRIBUTING.md` - Update if references old patterns
- `docs/` - Verify all links work
- `packages/react/README.md` - Update performance claims

**Status:** ⏭️ PENDING

---

### STEP 7: COMMIT AND PUSH

**Purpose:** Push merged main to remote

**Commands:**
```bash
# Verify we're on main
git branch --show-current

# Verify commit looks good
git log --oneline -5

# Push to origin/main
git push origin main

# Push feature branch (for PR documentation)
git push origin claude/streaming-virtualization-optimization-tE2E6
```

**Expected Result:**
- Main successfully pushed to origin
- Feature branch preserved for PR reference

**If Push Fails:**
- Check network connection
- Check permissions
- Verify remote URL: `git remote -v`

**Status:** ⏭️ PENDING

---

## ROLLBACK PLAN

**If Merge Goes Wrong:**

### Option 1: Abort During Merge
```bash
# If still in merge conflict state
git merge --abort
```

### Option 2: Reset After Merge (before push)
```bash
# Reset main to pre-merge state
git reset --hard 7ed57c479  # Last main commit before merge

# Verify reset
git log --oneline -3
```

### Option 3: Revert After Push (if already pushed)
```bash
# Create revert commit
git revert -m 1 HEAD

# Push revert
git push origin main
```

### Option 4: Restore from Backup Branch
```bash
# Delete current main
git branch -D main

# Recreate main from backup
git checkout -b main backup-streaming-virtualization-optimization-20260122-200908

# Force push (DANGEROUS - only if necessary)
git push --force-with-lease origin main
```

**Preferred:** Option 1 or 2 (cleanest)
**Last Resort:** Option 4 (requires team coordination)

---

## VERIFICATION SCRIPT

**Create:** `.merge-audit/verify-merge.sh`

```bash
#!/bin/bash
# Merge Verification Script

set -e  # Exit on error

echo "==================================="
echo "MERGE VERIFICATION SCRIPT"
echo "==================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILED=0

# 1. Type Check
echo -e "${YELLOW}[1/5] Running type checks...${NC}"
if npm run typecheck; then
    echo -e "${GREEN}✅ Type checks passed${NC}"
else
    echo -e "${RED}❌ Type checks failed${NC}"
    FAILED=1
fi
echo ""

# 2. Lint
echo -e "${YELLOW}[2/5] Running linter...${NC}"
if npm run lint; then
    echo -e "${GREEN}✅ Lint passed${NC}"
else
    echo -e "${RED}❌ Lint failed${NC}"
    FAILED=1
fi
echo ""

# 3. Tests
echo -e "${YELLOW}[3/5] Running tests...${NC}"
if npm run test; then
    echo -e "${GREEN}✅ Tests passed${NC}"
else
    echo -e "${RED}❌ Tests failed${NC}"
    FAILED=1
fi
echo ""

# 4. Build
echo -e "${YELLOW}[4/5] Building project...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build succeeded${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    FAILED=1
fi
echo ""

# 5. Benchmarks
echo -e "${YELLOW}[5/5] Running benchmarks...${NC}"
if npm run bench; then
    echo -e "${GREEN}✅ Benchmarks completed${NC}"
else
    echo -e "${YELLOW}⚠️  Benchmarks failed (non-critical)${NC}"
    # Don't fail for benchmarks
fi
echo ""

# Summary
echo "==================================="
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL VERIFICATIONS PASSED${NC}"
    echo "==================================="
    exit 0
else
    echo -e "${RED}❌ SOME VERIFICATIONS FAILED${NC}"
    echo "==================================="
    exit 1
fi
```

**Make Executable:**
```bash
chmod +x .merge-audit/verify-merge.sh
```

---

## TIMELINE ESTIMATE

| Phase | Task | Estimated Time |
|-------|------|----------------|
| 5.1 | Pre-merge verification | 5-10 min |
| 5.2 | Update main | 1 min |
| 5.3 | Execute merge | 1-2 min |
| 5.4 | Post-merge verification | 10-15 min |
| 5.5 | Create changelog | 5-10 min |
| 5.6 | Update documentation | 5 min |
| 5.7 | Commit and push | 1 min |
| **TOTAL** | **28-44 minutes** |

**Note:** Assumes no conflicts or failures. Add time for debugging if issues arise.

---

## SUCCESS CRITERIA

Merge is successful when:
- ✅ All 67 files integrated into main
- ✅ Type checks pass
- ✅ Lint passes
- ✅ All tests pass
- ✅ Build succeeds
- ✅ Benchmarks run (completion, not specific results)
- ✅ Changes pushed to origin/main
- ✅ Changelog updated
- ✅ Documentation current

---

## RISK MITIGATION

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Merge conflicts | LOW | MEDIUM | Accept branch version per Phase 4 |
| Test failures | LOW | HIGH | Fix immediately or rollback |
| Build failures | LOW | HIGH | Fix immediately or rollback |
| Network issues | LOW | LOW | Retry push |
| Main diverged | LOW | MEDIUM | Rebase branch on updated main |
| Unexpected bugs | MEDIUM | MEDIUM | Full verification catches issues |

---

## COMMUNICATION PLAN

**Before Merge:**
- ✅ Audit trail documented in `.merge-audit/`
- ✅ All decisions evidence-based

**After Merge:**
- Document in PR_DESCRIPTION.md (or create PR)
- Update team on completion
- Share rubric improvement (71→98/100)

---

## POST-MERGE TASKS

After successful merge:

1. **Clean up branches:**
   ```bash
   # Optional: Delete feature branch locally
   git branch -d claude/streaming-virtualization-optimization-tE2E6

   # Optional: Delete backup branch
   git branch -D backup-streaming-virtualization-optimization-20260122-200908
   ```

2. **Tag release:**
   ```bash
   # Create annotated tag for this milestone
   git tag -a v0.x.x -m "Sprint 6/7: Streaming & Virtualization Optimization (98/100 rubric)"
   git push origin v0.x.x
   ```

3. **Update project board:**
   - Move Sprint 6/7 items to "Done"
   - Update rubric tracker

4. **Archive audit directory:**
   ```bash
   # Optional: Move to docs for historical reference
   mv .merge-audit docs/merge-audits/2026-01-22-sprint-6-7/
   ```

---

## NEXT PHASE

**Phase 6:** Execute the merge (following this plan)

**Phase 7:** Verification and final sweep

---

**Status:** ✅ Phase 5 COMPLETE - Implementation plan ready
**Confidence:** HIGH - Detailed, actionable plan
**Date:** 2026-01-22
