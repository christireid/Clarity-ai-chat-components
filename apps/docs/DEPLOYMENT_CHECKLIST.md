# Deployment Checklist: Clarity Chat Docs UI Polish Changes

**Date**: 2026-01-10
**Changes**: Navigation AnimatePresence fix, Mobile scroll optimization, Animation cleanup, Tiered glass system, Layout overflow fix

---

## Change Summary

| File | Change Type | Risk Level |
|------|-------------|------------|
| `components/Navigation/Navigation.tsx` | AnimatePresence key fix, glass enhancement | Low |
| `components/Navigation/MobileBottomNav.tsx` | Scroll handler optimization with rAF | Low |
| `components/Diagrams/StatisticsShowcase.tsx` | Animation cleanup with proper effect return | Low |
| `styles/globals.css` | Tiered glassmorphism CSS variables | Low |
| `app/layout.tsx` | Removed duplicate `overflow-x-hidden` | Low |

**Overall Risk Assessment**: LOW - These are CSS/animation polish changes with no data mutations, API changes, or business logic modifications.

---

## Pre-Deploy Invariants

State the specific invariants that must remain true:

- [ ] All pages render without console errors
- [ ] Navigation works on desktop and mobile viewports
- [ ] Theme switching (light/dark/system) continues to function
- [ ] Animations respect `prefers-reduced-motion` setting
- [ ] No horizontal scrollbar appears on any viewport
- [ ] Mobile bottom navigation shows/hides correctly on scroll
- [ ] Glass effects render correctly in both themes

---

## Pre-Deploy Verification (Required)

### 1. Build Verification

Run from `/Users/christireid/Dev/Clarity-ai-chat-components`:

```bash
# Clean install and type check
pnpm install
pnpm --filter @clarity-chat/docs typecheck

# Build the docs site
pnpm --filter @clarity-chat/docs build
```

**Expected Results**:
- [ ] `typecheck` exits with code 0
- [ ] `build` completes successfully with no errors
- [ ] No TypeScript errors related to changed files

### 2. Lint Verification

```bash
pnpm --filter @clarity-chat/docs lint
```

**Expected Results**:
- [ ] Lint passes (warnings under threshold of 800)
- [ ] No new errors in changed files

### 3. Unit Test Verification

```bash
pnpm --filter @clarity-chat/docs test
```

**Expected Results**:
- [ ] All tests pass
- [ ] No regressions in navigation-related tests

### 4. Smoke Test Verification

```bash
# Start dev server in one terminal
cd /Users/christireid/Dev/Clarity-ai-chat-components/apps/docs
pnpm dev

# Run smoke tests in another terminal
pnpm --filter @clarity-chat/docs test:smoke
```

**Expected Results**:
- [ ] All route tests pass (homepage, guides, reference, etc.)
- [ ] No console errors detected
- [ ] Navigation tests pass
- [ ] Responsive design tests pass (375px, 768px, 1920px)

---

## Pre-Deploy Manual Verification

### 5. Visual Inspection Checklist

Start the dev server and manually verify:

```bash
cd /Users/christireid/Dev/Clarity-ai-chat-components/apps/docs
pnpm dev
# Open http://localhost:3000
```

#### Navigation Component (`Navigation.tsx`)

| Check | Desktop | Mobile | Status |
|-------|---------|--------|--------|
| Logo hover animation works | [ ] | N/A | |
| Nav links hover underline animation | [ ] | N/A | |
| Theme toggle cycles correctly (light -> dark -> system) | [ ] | [ ] | |
| Theme icon animates on change | [ ] | [ ] | |
| Mobile hamburger menu opens/closes | N/A | [ ] | |
| Mobile menu items animate in with stagger | N/A | [ ] | |
| Search button opens dialog | [ ] | [ ] | |
| Cmd+K opens search | [ ] | [ ] | |
| Active nav item highlighted correctly | [ ] | [ ] | |

#### Mobile Bottom Nav (`MobileBottomNav.tsx`)

Test at 375px viewport width:

| Check | Status |
|-------|--------|
| Bottom nav visible on load | [ ] |
| Nav hides when scrolling down (after 100px) | [ ] |
| Nav shows when scrolling up | [ ] |
| No scroll jank or stuttering | [ ] |
| Active tab highlighted | [ ] |
| "More" button opens quick actions panel | [ ] |
| Quick actions panel closes on selection | [ ] |

#### Statistics Showcase (`StatisticsShowcase.tsx`)

Navigate to a page with statistics (homepage):

| Check | Status |
|-------|--------|
| Numbers animate counting up on scroll into view | [ ] |
| Animation triggers only once | [ ] |
| Decorative circles pulse smoothly | [ ] |
| No memory warnings in console | [ ] |

#### Glass Effects (`globals.css`)

| Check | Light Mode | Dark Mode |
|-------|------------|-----------|
| Navigation header has glass effect | [ ] | [ ] |
| Glass has appropriate blur | [ ] | [ ] |
| Glass borders visible but subtle | [ ] | [ ] |
| Glass shadow depth appropriate | [ ] | [ ] |
| No visual artifacts or glitches | [ ] | [ ] |

#### Layout (`layout.tsx`)

| Check | Desktop | Mobile | Status |
|-------|---------|--------|--------|
| No horizontal scrollbar on homepage | [ ] | [ ] | |
| No horizontal scrollbar on guides | [ ] | [ ] | |
| No horizontal scrollbar on reference | [ ] | [ ] | |
| Content doesn't overflow viewport | [ ] | [ ] | |

### 6. Reduced Motion Verification

Test with reduced motion preference:

```bash
# In Chrome DevTools:
# 1. Open DevTools (Cmd+Option+I)
# 2. Open Command Palette (Cmd+Shift+P)
# 3. Type "reduced motion" and select "Emulate CSS prefers-reduced-motion: reduce"
```

| Check | Status |
|-------|--------|
| Theme icon changes without rotation animation | [ ] |
| Nav hover effects are instant, not animated | [ ] |
| Statistics numbers appear instantly without counting | [ ] |
| Page transitions are instant | [ ] |

### 7. Accessibility Verification

| Check | Status |
|-------|--------|
| Tab navigation works through all nav items | [ ] |
| Focus indicators visible on all interactive elements | [ ] |
| Skip to content link works | [ ] |
| Screen reader announces nav state changes | [ ] |

---

## Deploy Steps

### Production Deployment

```bash
# 1. Ensure all pre-deploy checks pass
# 2. Merge to main branch
git checkout main
git pull origin main
git merge <feature-branch>

# 3. Push to trigger CI/CD
git push origin main

# 4. Monitor deployment pipeline
# Check GitHub Actions or your deployment platform
```

---

## Post-Deploy Verification (Within 5 Minutes)

### 1. Production Smoke Tests

```bash
# Set production URL
export BASE_URL="https://clarity-chat.dev"

# Run critical route checks
curl -s -o /dev/null -w "%{http_code}" $BASE_URL
# Expected: 200

curl -s -o /dev/null -w "%{http_code}" $BASE_URL/learn/quick-start
# Expected: 200

curl -s -o /dev/null -w "%{http_code}" $BASE_URL/reference/components
# Expected: 200
```

### 2. Browser Verification (Production)

Open production site and verify:

| Check | Chrome | Safari | Firefox | Status |
|-------|--------|--------|---------|--------|
| Homepage loads | [ ] | [ ] | [ ] | |
| Navigation renders | [ ] | [ ] | [ ] | |
| Theme toggle works | [ ] | [ ] | [ ] | |
| Mobile nav works (resize to mobile) | [ ] | [ ] | [ ] | |
| No console errors | [ ] | [ ] | [ ] | |

### 3. Console Error Check

Open browser console on production and check:

```javascript
// In browser console on production:
// Should see no errors related to:
// - AnimatePresence
// - framer-motion
// - Navigation
// - Scroll handlers
```

| Console Check | Status |
|---------------|--------|
| No "Warning: Each child in a list should have a unique key" | [ ] |
| No "Maximum update depth exceeded" errors | [ ] |
| No "Cannot read property of undefined" errors | [ ] |
| No memory leak warnings | [ ] |

### 4. Performance Spot Check

```javascript
// In browser console:
const entries = performance.getEntriesByType('navigation');
console.log('Page load time:', entries[0]?.loadEventEnd);
// Should be under 3000ms
```

| Metric | Threshold | Actual | Status |
|--------|-----------|--------|--------|
| Page load time | < 3000ms | ___ms | [ ] |
| Largest Contentful Paint | < 2500ms | ___ms | [ ] |
| No layout shift on scroll | CLS < 0.1 | ___ | [ ] |

---

## Rollback Plan

### Can we roll back?

- [x] Yes - Pure frontend changes, no data migrations
- [x] Yes - No API changes
- [x] Yes - No database changes
- [x] Yes - Git revert is safe

### Rollback Steps

If issues are detected:

```bash
# 1. Identify the merge commit
git log --oneline -5

# 2. Revert the merge commit
git revert -m 1 <merge-commit-sha>

# 3. Push the revert
git push origin main

# 4. Monitor deployment
# Watch CI/CD pipeline complete

# 5. Verify rollback
curl -s -o /dev/null -w "%{http_code}" https://clarity-chat.dev
```

### Rollback Verification

After rollback:

| Check | Status |
|-------|--------|
| Site loads successfully | [ ] |
| No console errors | [ ] |
| Navigation works | [ ] |
| Original behavior restored | [ ] |

---

## Monitoring Plan (First 24 Hours)

### Metrics to Watch

| Metric/Log | Alert Condition | Check At |
|------------|-----------------|----------|
| Error rate | > 1% for 5 min | +1h, +4h, +24h |
| JS errors in monitoring | Any new error type | +1h, +4h, +24h |
| Core Web Vitals (CWV) | LCP > 2.5s, CLS > 0.1 | +4h, +24h |
| User reports | Any navigation issues | Continuous |

### Monitoring Commands

```bash
# Check Vercel/hosting logs (if applicable)
vercel logs --prod

# Check for errors in analytics (if configured)
# Review Sentry/error tracking dashboard
```

### Sample Console Verification (1 Hour After Deploy)

```javascript
// Run in browser console on production:

// Check for any errors logged
console.log('Checking for errors...');

// Verify scroll handler isn't causing issues
let scrollCount = 0;
window.addEventListener('scroll', () => scrollCount++);
// Scroll page up and down several times
// scrollCount should not be excessive (< 100 for normal scrolling)
console.log('Scroll events:', scrollCount);

// Verify no memory leaks
console.log('Memory:', performance.memory?.usedJSHeapSize);
// Should not grow continuously on navigation
```

---

## Go/No-Go Decision Criteria

### GO Criteria (All Must Pass)

- [ ] Build succeeds with no errors
- [ ] Type check passes
- [ ] Lint passes (under warning threshold)
- [ ] All unit tests pass
- [ ] Smoke tests pass
- [ ] Manual visual inspection passes
- [ ] Reduced motion preference respected
- [ ] No accessibility regressions

### NO-GO Criteria (Any One Blocks)

- [ ] Build fails
- [ ] Type errors in changed files
- [ ] New lint errors in changed files
- [ ] Test failures
- [ ] Console errors on any page
- [ ] Navigation functionality broken
- [ ] Mobile nav scroll behavior broken
- [ ] Horizontal scrollbar appears

---

## Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Developer | _____________ | ____/____/____ | [ ] Approved |
| QA | _____________ | ____/____/____ | [ ] Approved |
| Stakeholder | _____________ | ____/____/____ | [ ] Approved |

---

## Quick Reference Commands

```bash
# All commands from /Users/christireid/Dev/Clarity-ai-chat-components

# Pre-deploy checks
pnpm --filter @clarity-chat/docs typecheck
pnpm --filter @clarity-chat/docs build
pnpm --filter @clarity-chat/docs lint
pnpm --filter @clarity-chat/docs test
pnpm --filter @clarity-chat/docs test:smoke

# Start dev server
pnpm --filter @clarity-chat/docs dev

# Production URL checks
curl -I https://clarity-chat.dev
curl -I https://clarity-chat.dev/learn/quick-start
```

---

**Document Version**: 1.0
**Last Updated**: 2026-01-10
**Prepared By**: Deployment Verification Agent
