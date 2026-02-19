# RUTHLESS PRIORITY STACK RANK

Scoring model: Impact = Revenue + Trust + Adoption + Survivability
Priority = Impact / Effort

---

## TIER 0: EXISTENTIAL THREATS
*Fix these or the project is dead on arrival*

| Rank | Problem | Impact | Effort | Action |
|------|---------|--------|--------|--------|
| 1 | T1: Fabricated "100+ companies" claims | 10 | LOW | Delete every instance across all marketing/research docs |
| 2 | T2: Deceptive MIT license | 9 | LOW | Choose: pure MIT or honest dual-license. Fix LICENSE file |
| 3 | T3: Pre-release badge vs production-ready claims | 9 | LOW | Remove all "production-ready" from docs and code comments |
| 4 | T7: "245 components" fiction in comparison tables | 8 | LOW | Fix all inflated component counts |
| 5 | P1: npm package never published | 10 | MEDIUM | Not fixable in code review — needs manual npm publish |
| 6 | P4: clarity-chat.dev referenced 150+ times, unowned | 8 | HIGH | Replace with GitHub Pages URL or owned domain |

## TIER 1: PRODUCT CREDIBILITY BLOCKERS
*Fix these to be taken seriously by technical reviewers*

| Rank | Problem | Impact | Effort | Action |
|------|---------|--------|--------|--------|
| 7 | T4: "100% TypeScript" claim | 8 | LOW | Change to honest "TypeScript" without "100%" |
| 8 | T6: "150+ components" inflated | 7 | LOW | Use honest count or remove specific numbers |
| 9 | T5: "WCAG AAA" overclaim | 7 | LOW | Use "WCAG AA with AAA targets" |
| 10 | T9: "60-90% savings" misattribution | 7 | LOW | Add clear attribution to provider caching |
| 11 | T8: "150+ animations" unsubstantiated | 5 | LOW | Remove specific number |
| 12 | T10: Biased comparison table | 6 | LOW | Add honest "Maturity: Pre-release" and fair competitor data |
| 13 | G5: README is 1148 lines (too long) | 7 | MEDIUM | Cut to <400 lines. Move details to docs |
| 14 | O7: 87 root markdown files | 6 | MEDIUM | Archive old audits to docs/archive/ |
| 15 | M1+M4: LICENSE contradictions | 7 | LOW | Make LICENSE pure MIT, remove confusing notices |

## TIER 2: GROWTH UNLOCKS
*These enable adoption once credibility is fixed*

| Rank | Problem | Impact | Effort | Action |
|------|---------|--------|--------|--------|
| 16 | P2: No live demo | 9 | HIGH | Deploy example app to Vercel |
| 17 | P3: No documentation site | 8 | HIGH | Deploy docs to GitHub Pages |
| 18 | G1: No ICP defined | 7 | MEDIUM | Define target user in README |
| 19 | G3: No acquisition channel | 7 | HIGH | Requires community building |
| 20 | P7: No community | 4 | LOW | Enable GitHub Discussions |
| 21 | O8: 42 example apps, none deployed | 5 | MEDIUM | Deploy 2-3 key examples |

## TIER 3: OPTIMIZATION
*Polish once the above is handled*

| Rank | Problem | Impact | Effort | Action |
|------|---------|--------|--------|--------|
| 22 | C1: 499 'as any' casts | 7 | HIGH | Ongoing TypeScript migration |
| 23 | C4: 630 remaining TS errors | 7 | HIGH | Enable strict checks incrementally |
| 24 | O1: 15 packages | 6 | HIGH | Consider consolidating to 5 |
| 25 | O9: 650KB bundle size | 6 | MEDIUM | Audit and reduce |
| 26 | I2: 21 peer dependencies | 5 | MEDIUM | Make more optional, reduce required |
| 27 | O2: 25 CI workflows | 5 | LOW | Consolidate to 10 |
| 28 | I1: Version mismatch | 4 | LOW | Align versions |
| 29-49 | Remaining items | 3-5 | Various | Lower priority |

---

## IMPLEMENTATION ORDER (What we can fix NOW in code)

### Batch 1: Trust Emergency (all LOW effort, do first)
1. Delete ALL fabricated "100+ companies" claims
2. Fix LICENSE to pure MIT
3. Remove ALL "production-ready" claims
4. Fix "100% TypeScript" to "TypeScript"
5. Fix "245 components" to honest numbers
6. Fix "WCAG AAA" to "WCAG AA with AAA targets"
7. Fix "150+ animations" to remove specific number
8. Fix comparison table honesty
9. Fix "60-90% savings" attribution

### Batch 2: README Overhaul (MEDIUM effort)
10. Cut README from 1148 to <400 lines
11. Move package details to docs
12. Rewrite positioning: "New open-source library" not "enterprise platform"

### Batch 3: Repo Cleanup (MEDIUM effort)
13. Archive 60+ root markdown files to docs/archive/
14. Clean up domain references (clarity-chat.dev)
15. Fix version inconsistency

### Batch 4: Code Quality (HIGH effort, ongoing)
16. Remove 'as any' casts where possible
17. Enable stricter TypeScript checks
18. Clean up barrel exports
