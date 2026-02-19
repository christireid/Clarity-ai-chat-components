# CLAIMS VS REALITY

Forensic audit of every marketing claim against actual evidence.

---

## Summary Scorecard

| # | Claim | Verdict | Risk |
|---|-------|---------|------|
| 1 | "150+ components" | INFLATED | HIGH |
| 2 | "70+ hooks" | APPROXIMATELY TRUE | LOW |
| 3 | "100% TypeScript" | MISLEADING | MEDIUM |
| 4 | "WCAG AAA" | OVERSTATED | MEDIUM |
| 5 | "Save 60-90% on AI costs" | MISLEADING | MEDIUM |
| 6 | "450+ tests" | UNVERIFIED | LOW |
| 7 | "MIT License" | CONDITIONAL | HIGH |
| 8 | "Unique token optimization" | PARTIALLY TRUE | MEDIUM |
| 9 | "150+ animations" | UNSUBSTANTIATED | LOW |
| 10 | "15 theme presets" | UNVERIFIED | LOW |
| 11 | Evidence of users | NONE | HIGH |
| 12 | "Production-ready" | CONTRADICTS PRE-RELEASE BADGE | HIGH |
| 13 | "100+ companies in production" | FABRICATED | CRITICAL |
| 14 | "245 components" (marketing docs) | GROSSLY INFLATED | HIGH |
| 15 | "190+ production-ready components" (llms.txt) | INFLATED | HIGH |

---

## Detailed Analysis

### CLAIM 1: "150+ components"
- **Source**: README.md
- **Reality**: 745 .tsx files total, but ~89 substantial components (rest are tests, utilities, wrappers)
- **Verdict**: Even counting generously, "150" is at the upper bound. The marketing docs claiming "245" are fabricated.

### CLAIM 2: "70+ hooks"
- **Source**: README.md
- **Reality**: 71-80 hook files found. Claim is approximately correct.
- **Verdict**: PASS

### CLAIM 3: "TypeScript-first" / "100% TypeScript"
- **Source**: README.md, package.json
- **Reality**: 28 @ts-nocheck, 47 @ts-ignore, 499 'as any' casts. React package disables strict checks with ~630 remaining errors.
- **Verdict**: TypeScript is used, but "100% TypeScript" is misleading when hundreds of type suppressions exist.

### CLAIM 4: "WCAG AAA target"
- **Source**: README.md
- **Reality**: ARIA attributes present (1,568 found), accessibility test infrastructure exists. CHANGELOG shows 85% WCAG AA (not AAA). No independent audit.
- **Verdict**: "WCAG AA" with "AAA target" is the honest framing. No AAA certification.

### CLAIM 5: "Save 60-90% on AI costs"
- **Source**: README.md
- **Reality**: Token optimization package exists. But the savings come from provider-side prompt caching (OpenAI, Anthropic), not from Clarity's code. The asterisk disclaimer exists but is easy to miss.
- **Verdict**: Clarity provides the UI to visualize costs. The actual savings are the provider's feature, not Clarity's.

### CLAIM 6: "MIT License"
- **Source**: LICENSE file, README badge
- **Reality**: LICENSE file contains a notice: "This MIT License applies ONLY to the FREE/CORE components." References LICENSE-PRO.md and LICENSE-ENTERPRISE.md which define commercial restrictions.
- **Verdict**: Dual-licensed, not pure MIT. The MIT badge is misleading.

### CLAIM 7: "100+ companies in production"
- **Source**: TWEET_THREAD.md, README_HERO_SECTION.md, ONE_PAGER_ELEVATOR_PITCH.md, research docs
- **Reality**: Zero users, zero testimonials, zero case studies, zero download data. This is a pre-release project.
- **Verdict**: COMPLETELY FABRICATED. This is the single most damaging claim in the entire codebase.

### CLAIM 8: "Production-ready"
- **Source**: Multiple locations (README code comments, CHANGELOG, marketing docs)
- **Reality**: README badge says "pre-release-orange". React package has 630 remaining TS errors. 2 apps disabled. No published npm package verified.
- **Verdict**: Pre-release. Not production-ready by any reasonable definition.

### CLAIM 9: "245 components" / "190+ production-ready components"
- **Source**: README_HERO_SECTION.md comparison table, navigation-config.ts llms.txt description
- **Reality**: ~89 substantial components.
- **Verdict**: 2.7x-3x overcount.

---

## Critical Risk Assessment

### EXISTENTIAL RISKS (will destroy credibility if discovered)
1. **"100+ companies in production"** - Fabricated. Will be called out instantly by any reviewer.
2. **MIT badge with conditional license** - License bait-and-switch perception.
3. **Pre-release badge contradicting production-ready claims** - Self-contradictory.

### HIGH RISKS (will reduce trust)
4. Inflated component counts
5. "100% TypeScript" with hundreds of type suppressions
6. "WCAG AAA" without any AAA certification

### MEDIUM RISKS (will raise eyebrows)
7. Token savings attribution
8. Test count claims without published reports
9. Animation count claims
