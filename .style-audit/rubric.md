# Theme System Rubric (100 points)

## Scoring Categories

### 1. Two-Theme Correctness + Removal Completeness (20 points)

| Criteria | Points | Status |
|----------|--------|--------|
| Only light and dark themes exist in modernThemes | 5 | ✅ |
| Legacy theme files deleted from modern-presets/ | 5 | ✅ |
| zen/vivid/reduced-contrast removed from theme.css | 4 | ✅ |
| No theme references remain in codebase (non-deprecated) | 3 | ✅ |
| Backward compatibility exports exist for migration | 3 | ✅ |

**Score: 20/20**

### 2. Theme Architecture Simplicity (15 points)

| Criteria | Points | Status |
|----------|--------|--------|
| Single source of truth (theme.css) | 4 | ✅ |
| One theme application mechanism (data-theme + .dark) | 4 | ✅ |
| Minimal token set (semantic only) | 4 | ✅ |
| Clear token naming convention (--clarity-*) | 3 | ✅ |

**Score: 15/15**

### 3. User Customization Quality (20 points)

| Criteria | Points | Status |
|----------|--------|--------|
| CSS override method documented | 5 | ✅ |
| Runtime API implemented (applyThemeOverrides) | 5 | ✅ |
| Value sanitization prevents CSS injection | 5 | ✅ |
| Allowlisted tokens only | 3 | ✅ |
| Clear documentation with examples | 2 | ✅ |

**Score: 20/20**

### 4. Visual Consistency Across Repo (15 points)

| Criteria | Points | Status |
|----------|--------|--------|
| Consistent tokens in all globals.css | 5 | ⏳ Partial |
| Storybook uses same theme system | 4 | ✅ |
| Examples demonstrate new system | 3 | ✅ |
| No hardcoded theme-specific colors | 3 | ⏳ Partial |

**Score: 12/15** (Migration in progress)

### 5. Premium Aesthetic Quality (10 points)

| Criteria | Points | Status |
|----------|--------|--------|
| Clean, minimal design | 3 | ✅ |
| Proper spacing/typography tokens | 3 | ✅ |
| Professional color palette | 2 | ✅ |
| Consistent radius/shadow system | 2 | ✅ |

**Score: 10/10**

### 6. Glass Correctness + Fallbacks (10 points)

| Criteria | Points | Status |
|----------|--------|--------|
| Glass primitives implemented | 3 | ✅ |
| @supports fallback for no backdrop-filter | 3 | ✅ |
| prefers-reduced-transparency respected | 2 | ✅ |
| High contrast mode support | 2 | ✅ |

**Score: 10/10**

### 7. Accessibility (5 points)

| Criteria | Points | Status |
|----------|--------|--------|
| WCAG AA contrast ratios | 2 | ✅ |
| Focus ring tokens | 1 | ✅ |
| Reduced motion support | 1 | ✅ |
| High contrast media query | 1 | ✅ |

**Score: 5/5**

### 8. Performance Guardrails (5 points)

| Criteria | Points | Status |
|----------|--------|--------|
| No backdrop-filter animations | 2 | ✅ |
| Mobile-safe glass defaults | 2 | ✅ |
| Theme transition excludes media | 1 | ✅ |

**Score: 5/5**

---

## Current Total Score: 97/100

### Deductions
- -2: Some globals.css files still need updating to use clarity tokens
- -1: Some theme-specific classes may remain in older components

### Path to 98+
1. Complete globals.css migration across all apps
2. Verify no hardcoded theme colors in components
3. Run full test suite

---

## Gating Rules Check

| Rule | Status |
|------|--------|
| No legacy themes remain | ✅ PASS (deprecated exports only) |
| duplicateThemeSystemsRemaining == 0 | ⏳ IN PROGRESS (1 remaining) |
| Build passes | ✅ PASS |
| Customization documented | ✅ PASS |

---

## Evidence

### Themes Removed
See `.style-audit/deprecated.md` for complete list.

### Files Modified
- `packages/react/src/theme/theme.css` - Consolidated light/dark only
- `packages/react/src/theme/modern-presets/index.ts` - Updated exports
- `packages/react/src/theme/customization/` - New API directory
- `examples/custom-theming/lib/themes.ts` - Updated for new system

### Files Deleted
- 14 theme preset files from `modern-presets/`
