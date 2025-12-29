# Documentation Site Issue Ledger

## Environment

- **Node**: v22.21.1
- **pnpm**: 10.21.0
- **Framework**: Next.js 16.0.7 (Turbopack)
- **Dev URL**: http://localhost:3000

---

## Issue Table

| ID  | Page/Route                    | Category | Severity | Description                                                        | Status           |
| --- | ----------------------------- | -------- | -------- | ------------------------------------------------------------------ | ---------------- |
| 001 | `/guides`                     | Nav      | Blocker  | Redirects to `/learn/guides` which 404s - broken main nav link     | **Fixed**        |
| 002 | `/guides/testing`             | Nav      | Med      | Redirects to `/learn/guides/testing` (works) - kept as valid       | **Verified**     |
| 003 | `/guides/accessibility`       | Nav      | Med      | Redirects to `/learn/guides/accessibility` (works) - kept as valid | **Verified**     |
| 004 | `/guides/prompt-testing`      | Nav      | High     | Redirects to `/learn/guides/prompt-testing` which 404s             | **Fixed**        |
| 005 | `/demos/accessibility-audit`  | Nav      | High     | Redirects to `/learn/demos/accessibility-audit` which 404s         | **Fixed**        |
| 006 | Build logs                    | Console  | Med      | Shiki package external warnings during compilation                 | **Acknowledged** |
| 007 | Footer `/learn/concepts`      | Nav      | Low      | Footer link to `/learn/concepts` 404s                              | **Fixed**        |
| 008 | Footer `/reference/utilities` | Nav      | Low      | Footer link to `/reference/utilities` - verified working           | **Verified**     |
| 009 | `/learn/guides`               | Nav      | Med      | No index page for guides section                                   | **Fixed**        |
| 010 | `/robots.txt`                 | SEO      | High     | HTTP 500 - conflicting public file and app route                   | **Fixed**        |

---

## Detailed Issue Reports

### Issue 001: /guides → /learn/guides redirect leads to 404

**Severity**: Blocker **Route**: `/guides` **Repro Steps**:

1. Navigate to http://localhost:3000/guides
2. Observe 308 redirect to /learn/guides
3. Observe 404 response

**Expected**: Either `/guides` page loads, or redirect goes to existing page **Actual**: Redirect
chain leads to 404

**Root Cause**: `next.config.ts` line 110-111 redirects `/guides` → `/learn/guides`, but there's no
page.tsx at `/learn/guides` (only subpages like `/learn/guides/testing`)

**Fix Plan**: Remove the redirect OR create an index page at `/app/learn/guides/page.tsx`

**Files to touch**: `apps/docs/next.config.ts`

---

### Issue 004: /guides/prompt-testing redirect to non-existent page

**Severity**: High **Route**: `/guides/prompt-testing` **Repro Steps**:

1. Navigate to http://localhost:3000/guides/prompt-testing
2. Observe 308 redirect to /learn/guides/prompt-testing
3. Observe 404 response

**Root Cause**: Redirect target `/learn/guides/prompt-testing` doesn't exist

**Fix Plan**: Remove the redirect since `/guides/prompt-testing` doesn't exist anyway

---

### Issue 005: /demos/accessibility-audit redirect to non-existent page

**Severity**: High **Route**: `/demos/accessibility-audit` **Repro Steps**:

1. Navigate to http://localhost:3000/demos/accessibility-audit
2. Observe 308 redirect to /learn/demos/accessibility-audit
3. Observe 404 response

**Root Cause**: Redirect target `/learn/demos/accessibility-audit` doesn't exist. The actual page is
at `/demos/accessibility-audit/page.tsx`

**Fix Plan**: Remove the incorrect redirect

---

### Issue 006: Shiki package external warnings

**Severity**: Medium **Category**: Console **Repro Steps**:

1. Start dev server
2. Navigate to any cookbook or reference page
3. Observe warnings in terminal

**Actual**:

```
Package shiki can't be external
The request shiki/wasm matches serverExternalPackages...
```

**Root Cause**: Shiki is used by a dependency but not installed in docs workspace

**Fix Plan**: Add shiki to docs dependencies OR configure serverExternalPackages properly

---

### Issue 010: /robots.txt returns HTTP 500

**Severity**: High **Route**: `/robots.txt` **Repro Steps**:

1. Navigate to http://localhost:3000/robots.txt
2. Observe HTTP 500 error

**Actual**:

```
Error: A conflicting public file and page file was found for path /robots.txt
```

**Root Cause**: Both `public/robots.txt` (static file) and `app/robots.ts` (dynamic route handler)
existed, causing Next.js to fail when trying to resolve which one to serve.

**Fix Applied**: Removed `public/robots.txt` to use the modern App Router convention
(`app/robots.ts`) which provides environment-aware functionality (blocks crawlers in development,
allows in production).

---

## Summary

### Final Status

- **Blocker**: 0 (1 fixed)
- **High**: 0 (3 fixed)
- **Medium**: 0 (2 fixed, 2 verified, 1 acknowledged)
- **Low**: 0 (1 fixed, 1 verified)
- **Total Open**: 0

### Fixes Applied

1. **next.config.ts**: Removed broken redirects for `/guides`, `/guides/prompt-testing`,
   `/demos/accessibility-audit`
2. **apps/docs/app/learn/concepts/page.tsx**: Created index page for Core Concepts section
3. **apps/docs/app/learn/guides/page.tsx**: Created index page for Learn Guides section
4. **apps/docs/public/robots.txt**: Removed conflicting static file (app/robots.ts is the canonical
   source)

### Acknowledged (Non-blocking)

- Shiki package external warnings during Turbopack builds - does not affect functionality

### Verified in Production Build

- Production build completes successfully
- All key routes return 200
- Docs assistant works in demo mode
- Interactive playground functions correctly
