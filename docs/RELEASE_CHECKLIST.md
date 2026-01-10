# Release Checklist

Pre-release checklist for Clarity Chat documentation and component library releases.

## Quick Reference Commands

```bash
# Run all checks
pnpm check:all

# Individual checks
pnpm typecheck           # TypeScript type checking
pnpm lint                # ESLint
pnpm test                # Unit tests
pnpm build               # Production build

# Smoke tests (requires dev server or CI mode)
cd apps/docs && npx playwright test --config=playwright.smoke.config.ts
```

---

## Pre-Release Checklist

### 1. Code Quality

- [ ] **TypeScript Compilation**
  ```bash
  pnpm typecheck
  ```
  - All packages compile without errors
  - No `any` types in public APIs
  - Strict mode passes

- [ ] **Linting**
  ```bash
  pnpm lint
  ```
  - ESLint passes with no errors
  - No warnings in critical paths

- [ ] **Formatting**
  ```bash
  pnpm format:check
  ```
  - All files properly formatted

### 2. Testing

- [ ] **Unit Tests**
  ```bash
  pnpm test
  ```
  - All tests pass
  - Coverage meets threshold (80%+)
  - No skipped tests without reason

- [ ] **Smoke Tests**
  ```bash
  # Start dev server first
  pnpm --filter @clarity-chat/docs dev &

  # Run smoke tests
  cd apps/docs && npx playwright test --config=playwright.smoke.config.ts
  ```
  - Homepage loads (200 status)
  - Getting Started page loads
  - Reference pages load
  - No console errors on main routes
  - No broken images

- [ ] **Visual Regression** (if applicable)
  ```bash
  pnpm test:visual
  ```
  - No unexpected visual changes
  - Screenshots reviewed and approved

### 3. Build Verification

- [ ] **Package Build**
  ```bash
  pnpm build:packages
  ```
  - All packages build successfully
  - No build warnings

- [ ] **Documentation Build**
  ```bash
  pnpm docs:build
  ```
  - Docs site builds successfully
  - No build-time errors
  - Static assets generated

- [ ] **Bundle Size Check**
  ```bash
  pnpm size
  ```
  - Core bundle under 50KB gzipped
  - No unexpected size increases

### 4. Demo Verification

- [ ] **Demos Functional**
  - [ ] Homepage hero chat demo works
  - [ ] Streaming states demo works
  - [ ] Tool calling showcase works
  - [ ] All example pages load

- [ ] **Interactive Elements**
  - [ ] Code examples copy correctly
  - [ ] Theme switching works
  - [ ] Navigation works on mobile

### 5. Documentation Review

- [ ] **Content Review**
  - API documentation matches implementation
  - Examples are accurate and runnable
  - No broken internal links
  - Changelog updated

- [ ] **SEO & Accessibility**
  - Meta tags present
  - Images have alt text
  - Heading hierarchy correct

### 6. License & Legal

- [ ] **License Verification**
  ```bash
  # Check for license field in all packages
  grep -r '"license"' packages/*/package.json
  ```
  - All package.json files have license field
  - LICENSE file at root is current
  - THIRD_PARTY_NOTICES.md updated

- [ ] **Dependency Audit**
  ```bash
  pnpm audit
  ```
  - No high/critical vulnerabilities
  - All dependencies use compatible licenses

### 7. Environment & Configuration

- [ ] **Environment Variables**
  - `.env.example` up to date
  - All required variables documented in DEPLOYMENT.md
  - No secrets in codebase

- [ ] **Configuration Files**
  - `next.config.ts` production-ready
  - Security headers configured
  - Analytics configured (if applicable)

### 8. Git & Version Control

- [ ] **Branch Status**
  - On `main` branch (or release branch)
  - All changes committed
  - No uncommitted changes

- [ ] **Version Bump**
  ```bash
  pnpm changeset
  pnpm version-packages
  ```
  - Version numbers updated
  - Changelog entries created

- [ ] **Tag Release**
  ```bash
  git tag v1.x.x
  git push origin v1.x.x
  ```

---

## Post-Release Verification

- [ ] **Production Deployment**
  - Site accessible at production URL
  - All routes return 200

- [ ] **Smoke Tests on Production**
  ```bash
  BASE_URL=https://clarity-chat.dev npx playwright test --config=apps/docs/playwright.smoke.config.ts
  ```

- [ ] **Analytics Verification**
  - Page views tracking
  - Events firing correctly

- [ ] **Monitoring**
  - Error tracking active
  - Performance metrics within bounds

---

## Emergency Rollback

If issues are discovered post-release:

```bash
# Vercel
vercel rollback

# Docker/ECS
aws ecs update-service --cluster production --service clarity-docs --task-definition clarity-docs:PREVIOUS_VERSION

# NPM (for package releases)
npm deprecate @clarity-chat/react@BAD_VERSION "Known issue, please use vX.X.X"
```

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| QA | | | |
| Reviewer | | | |

---

## Notes

_Add any release-specific notes here_
