# Phase 3 Implementation Plan

## Current State Analysis

### ✅ Already Implemented (Phase 2)
- Domain export files (`exports/chat-ui.ts`, etc.)
- Main `index.ts` uses domain exports
- `DESIGN.md` with architecture guidelines
- Some top-level APIs (`ClarityChat`, `ChatWithMemory`)
- Some hooks with good JSDoc

### 🔄 Needs Implementation (Phase 3)

#### 1. Folder Structure Reorganization
- [ ] Create `core/` for low-level primitives
- [ ] Create `internal/` for internal utilities
- [ ] Group top-level APIs in `components/` (already done)
- [ ] Group mid-level APIs by domain
- [ ] Move low-level utilities to appropriate folders

#### 2. Hook Return Shape Standardization
- [ ] Audit all hooks for return shape consistency
- [ ] Standardize to: `{ data, isLoading, error, actions, ... }`
- [ ] Ensure all hooks return objects (not tuples)
- [ ] Add consistent keys: `data`, `state`, `error`, `isLoading`, `actions`

#### 3. Component Prop Standardization
- [ ] Audit all components for prop naming
- [ ] Standardize callbacks: `onChange`, `onSubmit`, `onClick`, `onSelect`, `onClose`
- [ ] Standardize states: `isLoading`, `disabled`
- [ ] Standardize variants: `variant`, `size`
- [ ] Group advanced options under `advanced` key

#### 4. Config Object Standardization
- [ ] Replace multi-argument functions with config objects
- [ ] Use `{ configOption, advanced?: {...} }` pattern
- [ ] Group rarely-used options under `advanced` or `expert`

#### 5. Drop-In API Implementation
- [ ] Ensure all top-level APIs work with zero config
- [ ] Add smart defaults
- [ ] Add internal guardrails
- [ ] Ensure thorough typing

#### 6. Code Consolidation
- [ ] Find and merge duplicate utilities
- [ ] Remove redundant hooks/components
- [ ] Extract shared logic to `core/` or `utils/`
- [ ] Simplify state logic with reducers/state machines

#### 7. DX Polish
- [ ] Add JSDoc to ALL public APIs
- [ ] Improve type safety (generics, inference)
- [ ] Add error messages and safeguards
- [ ] Add debug flags/logging
- [ ] Improve autocomplete (re-export types)

#### 8. Examples
- [ ] Minimal examples (10-20 LOC) for each top-level API
- [ ] Realistic examples (40-60 LOC) for mid-level APIs
- [ ] Complex examples showing composability

#### 9. Documentation
- [ ] Update README.md
- [ ] Update QUICKSTART.md
- [ ] Update DESIGN.md (if needed)
- [ ] Create domain-specific guides

#### 10. Validation
- [ ] Run lint
- [ ] Run type-check
- [ ] Run build
- [ ] Manual testing of examples
- [ ] Verify happy paths

## Execution Order

1. **Folder Structure** (Foundation)
2. **Hook Standardization** (Core APIs)
3. **Component Standardization** (UI APIs)
4. **Config Standardization** (Options)
5. **Drop-In APIs** (Top-level)
6. **Code Consolidation** (Cleanup)
7. **DX Polish** (Quality)
8. **Examples** (Usage)
9. **Documentation** (Guides)
10. **Validation** (Stability)
