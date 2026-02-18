# Release Checklist

> **Purpose**: Comprehensive pre-release verification checklist for @clarity-chat packages **Last
> Updated**: January 27, 2026 **Status**: Ready for Phase 1 Release (React + Core packages)

---

## Overview

This checklist ensures all @clarity-chat packages meet quality, security, and configuration
standards before public npm release. Complete each section in order and check off items as you
verify them.

**CRITICAL**: This project uses pnpm workspaces with `workspace:*` dependencies. You **MUST** use
`pnpm publish` (not npm publish) to automatically resolve these to proper version numbers.

---

## Pre-Publish Verification

### Test Suite Status

Run from monorepo root:

```bash
# Full test suite
pnpm test

# Known issues to verify are documented:
# 1. Search integration tests (search-integration.test.tsx - 4 tests)
#    - Expected: Mock implementation not matching production
#    - Status: Non-critical, documented in docs/known-issues.md
# 2. Document loader fallback (document-loader.test.ts - 1 test)
#    - Expected: Intentional fallback mechanism test
#    - Status: Non-critical, documented in docs/known-issues.md
```

- [ ] All tests pass (excluding 5 known non-critical issues)
- [ ] Test coverage meets requirements (85%+ for hooks/utils, 80%+ for components)
- [ ] Known issues documented in `/docs/known-issues.md`
- [ ] No new test failures introduced

### Build Status

Run from monorepo root:

```bash
# Build all packages (sequential to avoid memory issues)
pnpm build:sequential

# Verify build artifacts exist
ls -la packages/react/dist
ls -la packages/primitives/dist
ls -la packages/types/dist
ls -la packages/utils/dist
ls -la packages/memory/dist
ls -la packages/token-optimization/dist
ls -la packages/error-handling/dist
```

- [ ] All packages build successfully without errors
- [ ] All packages have `dist/` directories with compiled output
- [ ] TypeScript declaration files (`.d.ts`) generated for all packages
- [ ] No build warnings that indicate problems
- [ ] Bundle sizes within acceptable limits (check with `pnpm size`)

### Security Audit Status

Run from monorepo root:

```bash
# Security audit
pnpm audit --production

# Check for high/critical vulnerabilities
pnpm audit --audit-level=high
```

- [ ] No high or critical vulnerabilities in production dependencies
- [ ] Next.js updated to v16.1.5+ (CVE-2025-23656 fixed - completed in Task 4.2)
- [ ] All peer dependencies use secure versions
- [ ] Security audit report reviewed and acceptable
- [ ] `SECURITY.md` exists at repository root with reporting instructions

### TypeScript Compilation Status

Run from monorepo root:

```bash
# Type check all packages
pnpm typecheck

# Check specific packages
pnpm --filter @clarity-chat/react typecheck
pnpm --filter @clarity-chat/primitives typecheck
```

- [ ] All packages type check without errors
- [ ] No `@ts-ignore` or `@ts-expect-error` comments without justification
- [ ] All exported types are properly typed (no `any`)
- [ ] Strict mode enabled in all package `tsconfig.json` files

### Documentation Links Verified

All documentation links tested and working (completed in Task 5.2):

- [ ] Main README.md links work (completed)
- [ ] Package README.md links work (completed)
- [ ] Internal documentation cross-references work (completed)
- [ ] External documentation links (React, TypeScript, etc.) accessible
- [ ] API reference documentation generated and accessible

---

## Package Configuration

### Public Access Configuration

Verify each package has `publishConfig` set correctly:

```bash
# Check packages have publishConfig
grep -r "publishConfig" packages/*/package.json

# Verify access is "public"
grep -A 1 "publishConfig" packages/*/package.json | grep "public"
```

**Required packages for Phase 1 release:**

- [ ] `@clarity-chat/react` - publishConfig: { access: "public" } ✓
- [ ] `@clarity-chat/primitives` - publishConfig: { access: "public" } ✓
- [ ] `@clarity-chat/types` - publishConfig: { access: "public" } ✓
- [ ] `@clarity-chat/utils` - publishConfig: { access: "public" } ✓
- [ ] `@clarity-chat/memory` - publishConfig: { access: "public" } ✓
- [ ] `@clarity-chat/token-optimization` - publishConfig: { access: "public" } ✓
- [ ] `@clarity-chat/error-handling` - publishConfig: { access: "public" } ✓
- [ ] `@clarity-chat/license` - publishConfig: { access: "public" } ✓

> **Status**: All completed in Task 3.1

### LICENSE Files

Verify all packages have MIT license files:

```bash
# Check all packages have LICENSE files
ls -1 packages/*/LICENSE
```

- [ ] All packages have `LICENSE` file (completed in Task 3.2)
- [ ] All LICENSE files contain MIT license text
- [ ] Copyright year is current (2026)
- [ ] Copyright holder is "Code & Clarity"

### README Files

Verify all packages have comprehensive README.md:

```bash
# Check all packages have README files
ls -1 packages/*/README.md

# Verify README content is complete
grep -l "Installation" packages/*/README.md
grep -l "Usage" packages/*/README.md
```

Each README should include:

- [ ] Package name and description
- [ ] Installation instructions
- [ ] Basic usage examples
- [ ] API reference or link to docs
- [ ] Link to full documentation site
- [ ] License information
- [ ] Author/company information

**Status**: All completed in Task 3.3

### Author Information

Verify all packages have company details:

```bash
# Check author field in all packages
grep -A 3 '"author"' packages/*/package.json
```

Required author fields:

```json
"author": {
  "name": "Code & Clarity",
  "email": "hello@codeclarity.ai",
  "url": "https://codeclarity.ai"
}
```

- [ ] All packages have author field
- [ ] Author name is "Code & Clarity"
- [ ] Author email is "hello@codeclarity.ai"
- [ ] Author URL is "https://codeclarity.ai"

**Status**: Completed in Task 3.1

---

## Critical Publishing Requirements

### ⚠️ MUST USE pnpm publish

**CRITICAL FINDING from Task 5.1:**

The @clarity-chat packages use pnpm workspace dependencies (`workspace:*`). These **MUST** be
resolved during publish using `pnpm publish`.

#### Why pnpm publish is Required

1. **Workspace Protocol**: Dependencies use `"@clarity-chat/types": "workspace:*"` syntax
2. **Automatic Resolution**: `pnpm publish` automatically converts `workspace:*` to actual version
   numbers
3. **npm publish Fails**: Using `npm publish` will publish packages with invalid `workspace:*`
   dependencies
4. **Manual Tarballs Fail**: Installing from local tarballs includes `workspace:*` references that
   npm cannot resolve

#### Evidence from Task 5.1

When testing manual tarball installation:

```bash
npm ERR! Cannot read properties of null (reading 'length')
# This error occurs because npm cannot resolve workspace:* dependencies
```

#### The Workspace Dependency Chain

```
@clarity-chat/react
├── @clarity-chat/primitives: workspace:*
├── @clarity-chat/types: workspace:*
├── @clarity-chat/utils: workspace:*
├── @clarity-chat/memory: workspace:*
├── @clarity-chat/token-optimization: workspace:*
├── @clarity-chat/error-handling: workspace:*
└── @clarity-chat/license: workspace:*
```

**All of these `workspace:*` references must be resolved before publish.**

### Dry Run Command

**Always test publish with dry-run first:**

```bash
# Navigate to package directory
cd packages/react

# Dry run to verify what will be published
pnpm publish --dry-run

# Check the output for:
# 1. Files that will be included
# 2. workspace:* dependencies are NOT present (should be version numbers)
# 3. Package size is reasonable
# 4. No unexpected files included
```

- [ ] Dry run completes without errors
- [ ] No `workspace:*` in dependencies (should be version numbers like "^2.0.0")
- [ ] All required files included (dist/, README.md, LICENSE, CHANGELOG.md)
- [ ] No sensitive files included (.env, secrets, private keys)
- [ ] Package size is reasonable (check with `pnpm publish --dry-run --json`)

### Verification After Dry Run

After dry run, verify the package contents:

```bash
# Check what will be published
pnpm pack --dry-run

# Examine the package.json that will be published
# The workspace:* dependencies should be replaced with actual versions
```

Expected in published package.json:

```json
{
  "dependencies": {
    "@clarity-chat/types": "^2.0.0", // NOT workspace:*
    "@clarity-chat/primitives": "^2.0.0", // NOT workspace:*
    "@clarity-chat/utils": "^2.0.0" // NOT workspace:*
  }
}
```

### Publishing Order

Packages must be published in dependency order (pnpm handles this):

1. **Foundation Packages** (no internal dependencies):
   - [ ] `@clarity-chat/license`
   - [ ] `@clarity-chat/types`

2. **Core Utility Packages**:
   - [ ] `@clarity-chat/error-handling` (depends on: types)
   - [ ] `@clarity-chat/utils` (depends on: types)

3. **Feature Packages**:
   - [ ] `@clarity-chat/primitives` (depends on: types, utils)
   - [ ] `@clarity-chat/token-optimization` (depends on: types, utils)
   - [ ] `@clarity-chat/memory` (depends on: types, utils, error-handling)

4. **Main Package**:
   - [ ] `@clarity-chat/react` (depends on all above)

### Publishing Commands

```bash
# CORRECT: Use pnpm publish (resolves workspace:* automatically)
pnpm publish --access public

# INCORRECT: Do NOT use npm publish
# npm publish  # ❌ Will break workspace:* dependencies

# INCORRECT: Do NOT install from local tarballs
# npm pack && npm install ./clarity-chat-react-2.0.0.tgz  # ❌ Will fail
```

---

## Version Management

### Changesets Workflow

This project uses [Changesets](https://github.com/changesets/changesets) for version management.

#### Current Configuration

```json
{
  "changelog": [
    "@changesets/changelog-github",
    {
      "repo": "christireid/Clarity-ai-chat-components"
    }
  ],
  "linked": [["@clarity-chat/react", "@clarity-chat/primitives", "@clarity-chat/types"]],
  "baseBranch": "main",
  "updateInternalDependencies": "patch"
}
```

**Linked Packages**: `@clarity-chat/react`, `@clarity-chat/primitives`, and `@clarity-chat/types`
version together.

#### Creating a Changeset

Before any release, create changesets for all changes:

```bash
# Generate a new changeset
pnpm changeset

# Follow the prompts:
# 1. Select packages that have changed
# 2. Choose version bump type (major/minor/patch)
# 3. Write changeset description
```

- [ ] Changesets created for all package changes
- [ ] Changeset descriptions are clear and user-facing
- [ ] Version bump types are appropriate (follow semver)
- [ ] Breaking changes marked as major versions

#### Version Bump Procedure

After changesets are created and merged to main:

```bash
# 1. Update versions based on changesets
pnpm version-packages

# This will:
# - Update package.json versions
# - Update CHANGELOG.md files
# - Update internal dependencies to match new versions
# - Delete consumed changesets

# 2. Review the changes
git diff

# 3. Commit version changes
git add .
git commit -m "chore: version packages"

# 4. Push to GitHub
git push origin main
```

- [ ] Versions updated correctly
- [ ] CHANGELOG.md files generated
- [ ] Internal dependencies updated
- [ ] Git commit created for version bump
- [ ] Changes pushed to main branch

#### Changelog Generation

Changesets automatically generates changelogs using GitHub issues/PRs:

- [ ] Changelogs include all changes since last release
- [ ] Changelogs link to relevant GitHub issues/PRs
- [ ] Changelogs are in chronological order
- [ ] Breaking changes clearly marked in changelogs

---

## Publishing Process

### Pre-Publish Checklist

Before running publish commands:

```bash
# 1. Ensure you're on the main branch
git branch --show-current

# 2. Ensure working directory is clean
git status

# 3. Pull latest changes
git pull origin main

# 4. Ensure all packages are built
pnpm build:sequential

# 5. Run full test suite
pnpm test

# 6. Run typecheck
pnpm typecheck

# 7. Authenticate with npm (if not already)
npm whoami
# If not logged in: npm login
```

- [ ] On `main` branch
- [ ] Working directory is clean
- [ ] All changes pulled from remote
- [ ] All packages built successfully
- [ ] All tests passing
- [ ] Type checking passes
- [ ] Authenticated with npm registry
- [ ] npm account has publish rights to @clarity-chat org

### Step-by-Step Publish Commands

**Option A: Use changeset release (recommended)**

This publishes all packages with changesets in the correct order:

```bash
# Publish all packages that have changesets
pnpm release

# This runs:
# 1. turbo run build (builds all packages)
# 2. changeset publish (publishes changed packages)
# 3. Creates git tags for versions
# 4. Pushes tags to GitHub
```

**Option B: Manual publish (for individual packages)**

If you need to publish a single package:

```bash
# Navigate to package directory
cd packages/react

# Verify with dry run first
pnpm publish --dry-run

# Publish to npm
pnpm publish --access public

# Tag the release
git tag @clarity-chat/react@2.0.0
git push origin @clarity-chat/react@2.0.0
```

### Publishing Checklist

- [ ] Build completed successfully
- [ ] Dry run executed without errors
- [ ] All packages published to npm
- [ ] Git tags created for all versions
- [ ] Git tags pushed to GitHub
- [ ] No errors during publish process

### Verification After Publish

Immediately after publishing, verify packages are available:

```bash
# Check package on npm registry
npm view @clarity-chat/react

# Verify version is correct
npm view @clarity-chat/react version

# Check all dependencies resolved correctly
npm view @clarity-chat/react dependencies

# Install in a test project
mkdir test-install && cd test-install
npm init -y
npm install @clarity-chat/react react react-dom
```

- [ ] Package visible on npm registry (https://www.npmjs.com/package/@clarity-chat/react)
- [ ] Version number is correct
- [ ] Dependencies show actual versions (NOT workspace:\*)
- [ ] Package installs successfully in clean project
- [ ] All peer dependencies install correctly
- [ ] Basic import works: `import { ClarityChatApp } from '@clarity-chat/react'`

### Rollback Procedure

If issues are found after publish:

```bash
# 1. Unpublish within 72 hours (if critical issue)
npm unpublish @clarity-chat/react@2.0.0

# 2. OR deprecate the version (preferred)
npm deprecate @clarity-chat/react@2.0.0 "Critical bug found, use version X.Y.Z instead"

# 3. Fix the issue locally

# 4. Create new changeset with patch version
pnpm changeset

# 5. Version and publish again
pnpm version-packages
git add . && git commit -m "chore: version packages"
git push origin main
pnpm release
```

- [ ] Rollback procedure documented and understood
- [ ] Team knows how to deprecate versions
- [ ] Team knows how to unpublish (within 72 hours)

---

## Post-Publish

### Verify Package on npm

After successful publish:

```bash
# View package details
npm view @clarity-chat/react

# Check package page on npm
open https://www.npmjs.com/package/@clarity-chat/react
```

**Verify on npm website:**

- [ ] Package page loads correctly
- [ ] README renders properly
- [ ] Version number is correct
- [ ] Installation instructions are clear
- [ ] Links to documentation work
- [ ] Keywords/tags are appropriate
- [ ] License is displayed correctly

### Test Installation in Clean Project

Create a fresh test project and install:

```bash
# Create test project
mkdir /tmp/test-clarity-chat
cd /tmp/test-clarity-chat

# Initialize project
npm init -y

# Install @clarity-chat/react with peer dependencies
npm install @clarity-chat/react react react-dom framer-motion lucide-react zod

# Test basic import
cat > test.js << 'EOF'
import { ClarityChatApp } from '@clarity-chat/react'
console.log('Import successful:', ClarityChatApp)
EOF

# Run test
node test.js
```

- [ ] Package installs without errors
- [ ] Peer dependencies install correctly
- [ ] No warnings about missing dependencies
- [ ] Basic imports work correctly
- [ ] TypeScript types are available
- [ ] No console errors in test import

### Update Documentation Site

After successful publish:

```bash
# Update docs site to reference new version
cd apps/streamlined-docs

# Update installation instructions to use published package
# Edit getting-started pages to reference npm install

# Deploy docs site
pnpm build
# Deploy to hosting (Vercel/Netlify/etc.)
```

- [ ] Getting started guide updated with npm install commands
- [ ] Version numbers updated throughout docs
- [ ] Code examples tested with published packages
- [ ] API reference regenerated if needed
- [ ] Migration guide updated if breaking changes
- [ ] Documentation site deployed

### Create GitHub Release

After packages are published:

```bash
# Create GitHub release from tag
gh release create @clarity-chat/react@2.0.0 \
  --title "@clarity-chat/react v2.0.0" \
  --notes-file CHANGELOG.md \
  --draft

# Or use GitHub UI:
open https://github.com/christireid/Clarity-ai-chat-components/releases/new
```

**GitHub Release should include:**

- [ ] Release title with package name and version
- [ ] Changelog copied from CHANGELOG.md
- [ ] Installation instructions
- [ ] Migration guide link (if breaking changes)
- [ ] Link to documentation
- [ ] "What's Changed" summary
- [ ] Contributors acknowledged

### Announce Release

After all verification complete:

- [ ] Tweet/social media announcement
- [ ] Blog post (if major version)
- [ ] Email to users (if applicable)
- [ ] Update README shields with latest version
- [ ] Post in relevant communities (Reddit, Discord, etc.)
- [ ] Update any showcase/example projects

---

## Reference: Previous Completed Tasks

This checklist incorporates findings from all pre-release tasks:

### Phase 1: Test Stabilization ✅

- Task 1.1: Hash length bug fixed
- Task 1.2: Logger test spy issues fixed
- Task 1.3: Full test suite green (2 non-critical known issues documented)

### Phase 2: Documentation Cleanup ✅

- Task 2.1: Staged deletions committed
- Task 2.2: Root-level documentation artifacts cleaned (49 files removed)
- Task 2.3: .api-dx-audit directory cleaned

### Phase 3: Package Configuration ✅

- Task 3.1: All packages updated for public npm (publishConfig set)
- Task 3.2: LICENSE files added/verified (all packages have MIT license)
- Task 3.3: README.md verified in all packages

### Phase 4: Security & Quality ✅

- Task 4.1: Sensitive information removed
- Task 4.2: Security audit run (Next.js vulnerability fixed)
- Task 4.3: TypeScript compilation verified (no errors)

### Phase 5: Verification ✅

- Task 5.1: Smoke test package installation (**CRITICAL FINDING: Must use pnpm publish**)
- Task 5.2: Documentation links verified (all links working)
- Task 5.3: Release checklist created (this document)

---

## Quick Reference Commands

```bash
# Pre-publish checks
pnpm build:sequential      # Build all packages
pnpm test                  # Run all tests
pnpm typecheck             # Type check all packages
pnpm audit --production    # Security audit

# Versioning
pnpm changeset             # Create changeset
pnpm version-packages      # Update versions

# Publishing
pnpm publish --dry-run     # Test publish (per package)
pnpm release               # Publish all changed packages

# Post-publish verification
npm view @clarity-chat/react                    # Check npm registry
npm install @clarity-chat/react                 # Test install
gh release create @clarity-chat/react@2.0.0     # Create GitHub release
```

---

## Additional Resources

- **Changesets Documentation**: https://github.com/changesets/changesets
- **pnpm Publish Documentation**: https://pnpm.io/cli/publish
- **npm Package Access**: https://docs.npmjs.com/package-scope-access-level-and-visibility
- **Semantic Versioning**: https://semver.org/
- **Package.json Fields**: https://docs.npmjs.com/cli/v9/configuring-npm/package-json

---

## Checklist Summary

**Total Items**: 98 verification points

**Before publish:**

- [ ] 4/4 pre-publish verification sections complete
- [ ] 4/4 package configuration sections complete
- [ ] Critical publishing requirements understood
- [ ] Version management workflow complete

**During publish:**

- [ ] Pre-publish checklist complete
- [ ] Publish commands executed successfully
- [ ] Verification after publish complete

**After publish:**

- [ ] Package verified on npm
- [ ] Installation tested in clean project
- [ ] Documentation site updated
- [ ] GitHub release created
- [ ] Release announced

---

**Last Updated**: January 27, 2026 **Maintained By**: Code & Clarity **Next Review**: After first
public release
