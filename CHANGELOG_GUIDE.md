# Changelog Generation Guide

Complete guide for automated changelog generation in Clarity Chat Components.

## Overview

The project uses [Changesets](https://github.com/changesets/changesets) for automated version management and changelog generation. This ensures:

- **Consistent Versioning**: Semantic versioning across all packages
- **Automated Changelogs**: Beautiful, auto-generated CHANGELOG.md files
- **Coordinated Releases**: Manages dependencies between packages
- **Clear Communication**: Easy-to-understand release notes

## System Components

### 1. Changesets (.changeset/)

**What**: Markdown files describing changes

**Location**: `.changeset/*.md`

**Format**:
```markdown
---
"@clarity-chat/primitives": patch
"@clarity-chat/react": minor
---

Your change description here
```

### 2. Configuration

**File**: `.changeset/config.json`

```json
{
  "changelog": ["@changesets/changelog-github", { "repo": "..." }],
  "commit": false,
  "baseBranch": "main",
  "access": "restricted"
}
```

### 3. GitHub Actions

**Workflows**:
- `changeset-check.yml` - Verifies changesets on PRs
- `changeset-release.yml` - Automates releases on merge

### 4. Scripts

**Custom Tools**:
- `scripts/generate-changelog.js` - Manual changelog generation
- Integrated with `npm run version-packages`

## Complete Workflow

### For Feature Development

```bash
# 1. Create feature branch
git checkout -b feature/amazing-feature

# 2. Make your changes
# ... edit files ...

# 3. Create a changeset
npx changeset

# Interactive prompts:
? Which packages would you like to include?
  ✓ @clarity-chat/primitives
  ✓ @clarity-chat/react
  
? What kind of change is this for @clarity-chat/primitives?
  ○ major (breaking change)
  ● minor (new feature)
  ○ patch (bug fix)

? What kind of change is this for @clarity-chat/react?
  ○ major
  ● minor
  ○ patch

? Please enter a summary for this change:
Added new ChatWindow component with streaming support

# 4. Review the generated changeset
cat .changeset/random-string-here.md

# 5. Commit everything
git add .
git commit -m "feat: add ChatWindow component"
git push origin feature/amazing-feature

# 6. Create PR
# Changeset check will verify changeset exists
```

### For Bug Fixes

```bash
# 1. Fix the bug
# ... edit files ...

# 2. Create changeset
npx changeset

# Select patch for bug fixes
? What kind of change is this?
  ○ major
  ○ minor
  ● patch

? Please enter a summary:
Fixed Button focus ring color in dark mode

# 3. Commit and push
git add .
git commit -m "fix: button focus ring in dark mode"
git push
```

### For Breaking Changes

```bash
# 1. Make breaking changes
# ... edit files ...

# 2. Create changeset
npx changeset

# Select major for breaking changes
? What kind of change is this?
  ● major (breaking change)
  ○ minor
  ○ patch

? Please enter a summary:
BREAKING: Removed deprecated Button variant prop.
Use `appearance` prop instead.

# 3. Commit with conventional commit
git add .
git commit -m "feat!: remove deprecated Button variant prop"
git push
```

## Versioning and Release

### Manual Release Process

```bash
# 1. Check status
npx changeset status

# Output shows pending changes:
# @clarity-chat/primitives: 2 changesets (1 minor, 1 patch)
# @clarity-chat/react: 1 changeset (1 minor)

# 2. Version packages
npx changeset version

# This will:
# - Bump package.json versions
# - Generate CHANGELOG.md files
# - Delete consumed changesets

# 3. Review changes
git diff

# Check:
# - package.json versions bumped correctly
# - CHANGELOG.md generated properly
# - Changesets consumed

# 4. Commit version changes
git add .
git commit -m "chore: version packages"
git push

# 5. Publish (if ready)
npm run release

# This runs:
# - Build all packages
# - Run changeset publish
# - Create git tags
# - Push to npm registry
```

### Automated Release (GitHub Actions)

**On PR Merge to Main**:

1. **Changeset Bot Creates Version PR**
   - Detects changesets
   - Bumps versions
   - Generates changelogs
   - Creates PR: "chore: version packages"

2. **Review Version PR**
   - Check version bumps
   - Review CHANGELOG.md
   - Verify no issues

3. **Merge Version PR**
   - Packages published automatically
   - Git tags created
   - Release notes generated

## Changelog Format

### Generated Structure

```markdown
# Changelog

## Unreleased (2024-01-15)

### @clarity-chat/primitives

#### ✨ Features

- Added new Button variants for ghost and link styles
- Enhanced Card component with new elevation prop

#### 🐛 Bug Fixes

- Fixed focus ring color in dark mode
- Corrected Input padding inconsistency

### @clarity-chat/react

#### ✨ Features

- Added ChatWindow component with streaming support
- New ThinkingIndicator with custom animations

#### 💥 Breaking Changes

- Removed deprecated ChatInput onSend prop. Use onSubmit instead.

## v2.0.0 (2024-01-01)

...
```

### Icons and Formatting

- 💥 **Breaking Changes** - major version bumps
- ✨ **Features** - new functionality (minor)
- 🐛 **Bug Fixes** - patches and fixes
- 📚 **Documentation** - docs improvements
- ⚡ **Performance** - optimization improvements

## Best Practices

### Writing Good Changeset Summaries

✅ **Good**:
```
Added dark mode support to Button component

- Responds to system theme preference
- Smooth color transitions
- Accessible contrast ratios maintained
```

❌ **Bad**:
```
Updated button
```

### Version Selection Guide

**Major (x.0.0)** - Breaking Changes
- API removals
- Signature changes
- Behavior changes that break existing code

**Minor (0.x.0)** - New Features
- New components
- New props (backwards compatible)
- New functionality

**Patch (0.0.x)** - Bug Fixes
- Bug fixes
- Documentation updates
- Internal improvements

### When to Create Changesets

**Always**:
- New features
- Bug fixes
- Breaking changes
- Performance improvements
- API changes

**Never**:
- Documentation-only (except API docs)
- Test-only changes
- Internal refactoring (no API impact)
- Build config changes

## Commands Reference

```bash
# Create a changeset
npx changeset

# Check pending changesets
npx changeset status

# Version packages
npx changeset version

# Publish packages
npx changeset publish

# Generate changelog manually
node scripts/generate-changelog.js

# Enter pre-release mode
npx changeset pre enter alpha

# Exit pre-release mode
npx changeset pre exit
```

## Troubleshooting

### Issue: No Changeset Found in PR

**Solution**:
```bash
# Create a changeset
npx changeset

# Add and commit
git add .changeset/*.md
git commit -m "chore: add changeset"
git push
```

### Issue: Version Conflicts

**Solution**:
```bash
# Pull latest
git pull origin main

# Re-run versioning
npx changeset version

# Resolve conflicts manually
# Commit resolved versions
```

### Issue: Published Wrong Version

**Solution**:
```bash
# Unpublish from npm (within 72 hours)
npm unpublish @clarity-chat/package@version

# Fix and republish
npm run release
```

## Integration with CI/CD

### PR Checks

`.github/workflows/changeset-check.yml` runs on every PR:

1. Detects if package code changed
2. Checks for changeset presence
3. Validates changeset format
4. Reports status

### Release Automation

`.github/workflows/changeset-release.yml` runs on merge to main:

1. Detects pending changesets
2. Creates version bump PR OR publishes
3. Generates changelogs
4. Creates git tags
5. Publishes to npm

## Examples

### Example 1: Minor Feature

```bash
npx changeset

# Select packages and type
✓ @clarity-chat/react (minor)

# Write summary
Added new ChatWindow component with real-time streaming support.
Includes auto-scroll, typing indicators, and message formatting.

# Review
cat .changeset/cool-feature-xyz.md

# Commit
git add .
git commit -m "feat: add ChatWindow component"
```

### Example 2: Patch Fix

```bash
npx changeset

# Select
✓ @clarity-chat/primitives (patch)

# Summary
Fixed Button focus ring not showing in Safari

# Commit
git commit -m "fix: button focus ring in Safari"
```

### Example 3: Breaking Change

```bash
npx changeset

# Select
✓ @clarity-chat/react (major)

# Summary
BREAKING: Removed deprecated onSend prop from ChatInput.
Use onSubmit instead for consistent API.

Migration:
- Before: <ChatInput onSend={...} />
- After: <ChatInput onSubmit={...} />

# Commit
git commit -m "feat!: remove deprecated ChatInput onSend prop"
```

## Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)

---

**Questions?** Contact the maintainers or check the Changesets GitHub.
