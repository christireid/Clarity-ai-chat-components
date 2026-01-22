# Diff Map - Main vs Branch

**Date**: 2026-01-22
**Comparison**: main (`7ed57c479`) vs branch (`103acebb1`)

---

## File-by-File Comparison

### AREA 3: Core Tool System

#### `tool-executor.ts`
- **Main**: 649 lines
- **Branch**: 1,294 lines (+645, +99%)
- **Type**: **ENHANCEMENT** (not duplicate, same exports, more features)
- **Conflicts**: None (backward compatible)
- **Action**: **Accept branch version** (superset of main)

#### `tool-lifecycle.ts`
- **Main**: 721 lines
- **Branch**: 993 lines (+272, +38%)
- **Type**: **ENHANCEMENT** (not duplicate, same exports, more features)
- **Conflicts**: None (backward compatible)
- **Action**: **Accept branch version** (superset of main)

#### `tool-orchestrator.ts`
- **Main**: 527 lines
- **Branch**: 556 lines (+29, +6%)
- **Type**: **ENHANCEMENT** (minor improvements)
- **Conflicts**: None (backward compatible)
- **Action**: **Accept branch version** (superset of main)

#### `tool-registry.ts`
- **Main**: 486 lines
- **Branch**: 490 lines (+4, +1%)
- **Type**: **ENHANCEMENT** (adds validation integration)
- **Conflicts**: None (backward compatible)
- **Action**: **Accept branch version** (superset of main)

#### `tool-implementation-validator.ts`
- **Main**: Does not exist
- **Branch**: 429 lines (NEW)
- **Type**: **NEW FILE**
- **Conflicts**: None
- **Action**: **Accept branch version**

---

### AREA 6: App API Layer

#### `tools-engine.ts`
- **Main**: 627 lines
- **Branch**: 830 lines (+203, +32%)
- **Type**: **ENHANCEMENT** (type unification, better DX)
- **Conflicts**: None (backward compatible via migration helpers)
- **Action**: **Accept branch version** (superset of main)

---

### AREA 4: Tool Utilities

#### `tool-execution.ts`
- **Main**: 548 lines
- **Branch**: 771 lines (+223, +41%)
- **Type**: **ENHANCEMENT** (batch deduplication, better options)
- **Conflicts**: None (backward compatible)
- **Action**: **Accept branch version** (superset of main)

#### `tool-helpers.ts`
- **Main**: Does not exist
- **Branch**: 654 lines (NEW)
- **Type**: **NEW FILE**
- **Conflicts**: None
- **Action**: **Accept branch version**

#### `tool-performance.ts`
- **Main**: 562 lines
- **Branch**: 562 lines (unchanged)
- **Type**: **IDENTICAL**
- **Conflicts**: None
- **Action**: **Keep unchanged** (or accept branch, same result)

---

### AREA 7: Agents

#### `tools.ts`
- **Main**: Unknown (need to check)
- **Branch**: Modified (+58 lines, deprecation warnings)
- **Type**: **ENHANCEMENT** (adds deprecation warnings)
- **Conflicts**: Need to verify main's state
- **Action**: **Accept branch version** (adds deprecation, backward compatible)

---

### AREA 2: Documentation

All 6 documentation files:
- **Main**: Do not exist
- **Branch**: All NEW (4,213 lines total)
- **Type**: **NEW FILES**
- **Conflicts**: None
- **Action**: **Accept all branch versions**

---

### AREA 5: Test Coverage

All 5 new test files:
- **Main**: Do not exist
- **Branch**: All NEW (2,676 lines total)
- **Type**: **NEW FILES**
- **Conflicts**: None
- **Action**: **Accept all branch versions**

Modified test files:
- `tool-system-e2e.test.ts`: Enhanced (+101 lines)
- `streaming-tools-integration.test.ts`: Minor fix (+3 lines)
- **Action**: **Accept branch versions**

---

### AREA 1: Audit Infrastructure

All `.tool-calling-audit/*` files:
- **Main**: Do not exist
- **Branch**: All NEW (5,450 lines total)
- **Type**: **NEW FILES** (branch-specific documentation)
- **Conflicts**: None
- **Action**: **Accept all branch versions**

---

### AREA 9: Package Configuration

#### `package.json` (root)
- **Main**: Unknown state
- **Branch**: +1 line
- **Type**: **MINOR MODIFICATION**
- **Conflicts**: Possible (need to check)
- **Action**: **Merge carefully**

#### `packages/react/package.json`
- **Main**: Unknown version
- **Branch**: Version bumped (+2 lines)
- **Type**: **VERSION BUMP**
- **Conflicts**: Possible if main also bumped version
- **Action**: **Accept branch version** (or resolve version conflict)

#### `packages/codemods/package.json`
- **Main**: Unknown state
- **Branch**: +4 lines
- **Type**: **MINOR MODIFICATION**
- **Conflicts**: Possible
- **Action**: **Merge carefully**

#### `apps/storybook/package.json`
- **Main**: Unknown state
- **Branch**: +6 lines
- **Type**: **MINOR MODIFICATION**
- **Conflicts**: Possible
- **Action**: **Merge carefully**

#### `pnpm-lock.yaml`
- **Main**: State at main HEAD
- **Branch**: Major update (+2,508 lines)
- **Type**: **LOCK FILE UPDATE**
- **Conflicts**: **HIGH PROBABILITY**
- **Action**: **Regenerate after merge** (standard practice)

---

### AREA 10: Changelog & Versioning

#### `packages/react/CHANGELOG.md`
- **Main**: Unknown state
- **Branch**: +115 lines (added entries)
- **Type**: **CHANGELOG UPDATE**
- **Conflicts**: Possible if main has new entries
- **Action**: **Merge both sets of entries** (chronological order)

#### `.changeset/tool-calling-hardening.md`
- **Main**: Does not exist
- **Branch**: NEW (7 lines)
- **Type**: **NEW FILE**
- **Conflicts**: None
- **Action**: **Accept branch version**

---

### AREA 11: Config & Utilities

#### `packages/utils/src/config-manager.ts`
- **Main**: Unknown state
- **Branch**: +10 lines
- **Type**: **MINOR MODIFICATION**
- **Conflicts**: Need to check
- **Action**: **Accept branch version** (likely safe)

---

### AREA 12: Benchmarking

#### `tools/scripts/benchmark.js`
- **Main**: Unknown state
- **Branch**: +124 lines (major update)
- **Type**: **ENHANCEMENT**
- **Conflicts**: Need to check
- **Action**: **Accept branch version** (improvements)

---

### AREA 8: UI Components

#### `chat-input.tsx`
- **Main**: Unknown state
- **Branch**: +2 lines
- **Type**: **MINOR FIX**
- **Conflicts**: Low probability
- **Action**: **Accept branch version**

#### `copy-button.tsx`
- **Main**: Unknown state
- **Branch**: +2 lines
- **Type**: **MINOR FIX**
- **Conflicts**: Low probability
- **Action**: **Accept branch version**

#### `ui/__tests__/skeleton.test.tsx`
- **Main**: Unknown state
- **Branch**: +67 lines
- **Type**: **TEST ENHANCEMENT**
- **Conflicts**: Need to check
- **Action**: **Accept branch version**

---

## Summary by Type

### NEW FILES (17 files, 13,422 lines)
All can be added without conflicts:
- tool-implementation-validator.ts + test (1,108 lines)
- tool-helpers.ts + test (1,078 lines)
- 6 documentation guides (4,213 lines)
- 5 new test files (2,676 lines)
- 14 audit infrastructure files (5,450 lines)
- 1 changeset file (7 lines)

### ENHANCEMENTS (8 files, 1,372 lines added)
All are backward-compatible supersets:
- tool-executor.ts (+645 lines)
- tool-lifecycle.ts (+272 lines)
- tool-execution.ts (+223 lines)
- tools-engine.ts (+203 lines)
- tool-orchestrator.ts (+29 lines)

### MINOR MODIFICATIONS (10 files, <200 lines)
Need careful merge:
- package.json files (4 files)
- Component files (3 files)
- Config files (2 files)
- Benchmark script (1 file)

### HIGH-CONFLICT RISK (2 files)
- pnpm-lock.yaml (regenerate after merge)
- CHANGELOG.md (merge entries)

---

## Conflict Probability Assessment

- **ZERO CONFLICT**: 34 files (NEW files)
- **LOW CONFLICT**: 8 files (Enhancements are supersets)
- **MEDIUM CONFLICT**: 5 files (Minor modifications)
- **HIGH CONFLICT**: 2 files (Lock file, changelog)

**Overall Risk**: **LOW** - Most changes are additions or enhancements

---

## Next Steps

Phase 4 will make canonical decisions for:
1. Package version resolution strategy
2. Changelog merge strategy
3. Lock file regeneration strategy
4. Verification of backward compatibility claims
