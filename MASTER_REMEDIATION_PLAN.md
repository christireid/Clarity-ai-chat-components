# MASTER REMEDIATION PLAN

## Execution Strategy

Work top-to-bottom through the priority stack rank. Each fix includes exact files, exact changes, and validation criteria.

---

## BATCH 1: TRUST EMERGENCY (Execute Immediately)

### FIX-001: Delete all fabricated "100+ companies" claims
**Files:** docs/marketing/TWEET_THREAD.md, docs/marketing/README_HERO_SECTION.md, docs/marketing/ONE_PAGER_ELEVATOR_PITCH.md, docs/research/strategy/feature-gap-prioritization.md, docs/research/strategy/ceo-market-positioning.md, docs/research/QUICK_REFERENCE.md, docs/research/COMPETITIVE_ANALYSIS_REPORT.md, docs/research/CLARITY_CHAT_ROADMAP.md, apps/marketing-site/lib/aura-knowledge.json
**Action:** Find and delete/replace all "100+ companies" and "Used by X companies" claims
**Validation:** `grep -r "100+ companies" .` returns 0 results (excluding audit docs)

### FIX-002: Fix LICENSE to pure MIT
**File:** LICENSE
**Action:** Remove the conditional notice ("ONLY to FREE/CORE components" section). Make it standard MIT. Remove the "Premium/Commercial Components" list. If dual-license is intended, create a separate COMMERCIAL_LICENSE.md and don't put restrictions in LICENSE.
**Validation:** LICENSE file is standard MIT with no conditional language

### FIX-003: Remove all "production-ready" from docs/code
**Files:** 90+ files with "production-ready"
**Action:** Replace in marketing docs, source code comments, README. Keep in audit/review docs as historical context.
**Validation:** No "production-ready" claims in user-facing files

### FIX-004: Fix inflated component counts
**Files:** README.md, docs/marketing/*, apps/streamlined-docs/scripts/navigation-config.*
**Action:** "245 components" -> remove or use "150+ components" consistently. "190+ production-ready" -> "150+ components"
**Validation:** No "245" or "190+" references remain

### FIX-005: Fix "100% TypeScript" claim
**File:** README.md (Quick Stats section)
**Action:** Change "100% TypeScript" to "TypeScript"
**Validation:** No "100% TypeScript" in README

### FIX-006: Fix WCAG AAA claims
**Files:** README.md, LICENSE-PRO.md, various docs
**Action:** "WCAG AAA" -> "WCAG AA with AAA targets" or "WCAG AAA (target)"
**Validation:** Consistent "target" qualifier on all AAA mentions

### FIX-007: Fix "150+ animations" claim
**File:** README.md
**Action:** "150+ animations" -> "Rich animations" (remove unverifiable number)
**Validation:** No "150+" animation count claim

### FIX-008: Fix cost savings attribution
**Files:** README.md
**Action:** Already has asterisk disclaimer, strengthen it. Make it clear savings are from provider caching.
**Validation:** Clear attribution in all cost savings mentions

### FIX-009: Fix comparison table
**File:** README.md
**Action:** Already shows "Maturity: Pre-release" which is honest. Verify competitor data is fair.
**Validation:** Table has no provably false claims

### FIX-010: Fix LICENSE-PRO.md
**File:** LICENSE-PRO.md
**Action:** Remove "WCAG AAA" claim, make feature list match reality
**Validation:** No overclaims in license files

## BATCH 2: README & REPO CLEANUP

### FIX-011: Clean domain references
**Files:** 150+ files referencing clarity-chat.dev
**Action:** In source code and docs used by developers, replace with GitHub repo URLs where appropriate. Marketing docs being deleted anyway.
**Priority:** Source code files first, then docs

### FIX-012: Archive root markdown files
**Action:** Create docs/archive/ directory, move 60+ audit/analysis files there
**Validation:** Root directory has <15 markdown files

### FIX-013: Streamline README
**Action:** Cut to essentials: intro, quick start, what's inside (brief), installation, license. Move everything else to docs.
**Validation:** README under 400 lines

## BATCH 3: MARKETING DOC CLEANUP

### FIX-017: Clean docs/marketing/
**Action:** Either delete fabricated marketing templates or rewrite with honest claims
**Validation:** No fabricated stats in marketing docs

### FIX-018: Clean docs/research/
**Action:** Add disclaimers or fix fabricated stats in research docs
**Validation:** No fabricated claims presented as facts

---

## VALIDATION CRITERIA

After all fixes:
- `grep -r "100+ companies" .` -> 0 results in non-audit files
- `grep -r "production-ready" .` -> 0 results in user-facing files
- `grep -r "245 components" .` -> 0 results
- `grep -r "100% TypeScript" .` -> 0 results in README
- LICENSE file is clean MIT
- README is under 500 lines
- Root directory has fewer markdown files
