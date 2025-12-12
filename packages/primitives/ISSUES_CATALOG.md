# Issues Catalog & Implementation Roadmap

## Issues Catalog

### Critical Issues (Must Fix - Blocks Release)

| ID  | Issue                                  | Current State                        | Target State                           | Effort | Dependencies                 |
| --- | -------------------------------------- | ------------------------------------ | -------------------------------------- | ------ | ---------------------------- |
| C1  | Missing prefers-reduced-motion support | No reduced motion handling           | All animations respect user preference | Low    | Create useReducedMotion hook |
| C2  | No useControllableState hook           | Manual controlled/uncontrolled logic | Reusable hook with warnings            | Low    | None                         |
| C3  | Missing ARIA utilities                 | Basic ID generation only             | Full ARIA helpers (announce, focus)    | Medium | None                         |
| C4  | No live region announcements           | Screen readers miss dynamic updates  | Global announcer utility               | Medium | C3                           |
| C5  | Button accessibility gaps              | Missing aria-disabled pattern        | Full ARIA button pattern               | Low    | None                         |

### Major Issues (Should Fix - Significant Impact)

| ID  | Issue                                     | Current State              | Target State                     | Effort | Dependencies   |
| --- | ----------------------------------------- | -------------------------- | -------------------------------- | ------ | -------------- |
| M1  | No standardized animation presets         | Inline animation configs   | Reusable spring/duration presets | Medium | C1             |
| M2  | Missing useComposedRefs hook              | Manual ref composition     | Type-safe ref merger             | Low    | None           |
| M3  | No Storybook stories                      | README examples only       | Full Storybook documentation     | High   | All components |
| M4  | Input missing label support               | No built-in label          | Label with proper association    | Low    | None           |
| M5  | Input missing clear button                | No clear functionality     | Optional clear button            | Low    | None           |
| M6  | Input missing character count             | No character limit display | Optional counter with maxLength  | Low    | None           |
| M7  | Dialog animation not reduced-motion aware | Always animates            | Respects user preference         | Low    | C1, M1         |

### Moderate Issues (Nice to Fix - Quality Improvement)

| ID  | Issue                                   | Current State           | Target State                          | Effort | Dependencies |
| --- | --------------------------------------- | ----------------------- | ------------------------------------- | ------ | ------------ |
| N1  | Limited TypeScript inference            | Basic types             | Discriminated unions where applicable | Low    | None         |
| N2  | Inconsistent data-\* attributes         | Some components only    | All components for styling hooks      | Low    | None         |
| N3  | Missing Slot pattern in some components | Not all support asChild | Consistent asChild support            | Medium | M2           |
| N4  | Button icons size coupling              | Manual icon sizing      | Size-aware icon slots                 | Low    | None         |
| N5  | Dialog missing nested dialog support    | Basic nesting           | Full z-index stack management         | Medium | None         |

### Minor Issues (Polish - Delight Factor)

| ID  | Issue                                      | Current State        | Target State                | Effort | Dependencies |
| --- | ------------------------------------------ | -------------------- | --------------------------- | ------ | ------------ |
| P1  | No skeleton loading patterns               | Loading spinner only | Skeleton placeholder option | Medium | None         |
| P2  | Button could use better tap feedback       | Ripple only          | Additional tactile feedback | Low    | None         |
| P3  | Tooltip delay not configurable per-trigger | Global delay only    | Per-trigger override        | Low    | None         |
| P4  | Missing focus-visible ring consistency     | Varies by component  | Consistent ring-3 pattern   | Low    | None         |

---

## Implementation Roadmap

### Phase A: Core Utilities (Foundation)

**Focus**: Core utilities and patterns that everything else depends on **Files to Create/Modify**:

| Task                             | Issues | Files                             | Tests                                      | Acceptance Criteria                                       |
| -------------------------------- | ------ | --------------------------------- | ------------------------------------------ | --------------------------------------------------------- |
| Create useReducedMotion hook     | C1     | `hooks/use-reduced-motion.ts`     | `__tests__/use-reduced-motion.test.ts`     | Returns boolean, reactive to changes                      |
| Create useControllableState hook | C2     | `hooks/use-controllable-state.ts` | `__tests__/use-controllable-state.test.ts` | Handles controlled/uncontrolled, warns on mode switch     |
| Create useComposedRefs hook      | M2     | `hooks/use-composed-refs.ts`      | `__tests__/use-composed-refs.test.ts`      | Merges multiple refs correctly                            |
| Create ARIA utilities            | C3, C4 | `lib/aria.ts`                     | `__tests__/aria.test.ts`                   | ID gen, announce, focus helpers                           |
| Create animation presets         | M1     | `lib/animation-presets.ts`        | `__tests__/animation-presets.test.ts`      | Spring configs, duration presets, reduced motion variants |

### Phase B: Core Component Enhancements

**Focus**: Enhance the three reference components with research findings

| Task                     | Issues         | Files                   | Tests                              | Acceptance Criteria                           |
| ------------------------ | -------------- | ----------------------- | ---------------------------------- | --------------------------------------------- |
| Enhance Button component | C5, N2, N4     | `components/button.tsx` | Update `__tests__/button.test.tsx` | Full ARIA, reduced motion, consistent data-\* |
| Enhance Dialog component | M7, N5         | `components/dialog.tsx` | Update `__tests__/dialog.test.tsx` | Reduced motion, z-index management            |
| Enhance Input component  | M4, M5, M6, N2 | `components/input.tsx`  | Update `__tests__/input.test.tsx`  | Label, clear button, character count          |

### Phase C: Tests & Accessibility Verification

**Focus**: Comprehensive test coverage and accessibility audits

| Task                              | Issues | Files | Tests                              | Acceptance Criteria               |
| --------------------------------- | ------ | ----- | ---------------------------------- | --------------------------------- |
| Add accessibility tests           | All    | -     | `__tests__/*.a11y.test.tsx`        | axe-core passes on all components |
| Add keyboard navigation tests     | All    | -     | Existing test files                | All keyboard patterns verified    |
| Add screen reader narrative tests | C4     | -     | `__tests__/screen-reader.test.tsx` | Live regions announce correctly   |

### Phase D: Documentation & Storybook

**Focus**: Storybook stories and polished documentation

| Task                  | Issues | Files                        | Tests             | Acceptance Criteria                    |
| --------------------- | ------ | ---------------------------- | ----------------- | -------------------------------------- |
| Create Button stories | M3     | `stories/button.stories.tsx` | Interaction tests | All variants, sizes, states documented |
| Create Dialog stories | M3     | `stories/dialog.stories.tsx` | Interaction tests | All animations, sizes documented       |
| Create Input stories  | M3     | `stories/input.stories.tsx`  | Interaction tests | All features documented                |
| Update README         | M3     | `README.md`                  | -                 | Comprehensive usage guide              |

---

## Priority Order (Recommended)

1. **useReducedMotion** - Foundation for accessible animations
2. **useControllableState** - Foundation for controlled components
3. **useComposedRefs** - Foundation for ref forwarding
4. **ARIA utilities** - Foundation for accessibility
5. **Animation presets** - Consistency across components
6. **Button enhancements** - Most-used component
7. **Input enhancements** - Most-used form component
8. **Dialog enhancements** - Critical for modals
9. **Tests** - Verify all changes
10. **Storybook** - Document for users
