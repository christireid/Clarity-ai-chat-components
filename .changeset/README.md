# Changesets

This directory contains [Changesets](https://github.com/changesets/changesets) - automated changelog and version management for the Clarity Chat Components monorepo.

## What are Changesets?

Changesets are a way to manage versions, changelogs, and publishing in a monorepo. They allow developers to:

- **Declare Changes**: Document what changed and why
- **Automate Versioning**: Automatically bump package versions
- **Generate Changelogs**: Create beautiful changelogs automatically
- **Coordinate Releases**: Manage dependencies between packages

## Quick Start

### 1. Creating a Changeset

When you make a change that should be included in the changelog:

```bash
# Run the changeset CLI
npx changeset

# Follow the prompts:
# 1. Select which packages changed
# 2. Choose version bump type (major/minor/patch)
# 3. Write a summary of the change
```

### 2. Changeset Types

**Major (Breaking Change)**
```bash
# For API changes that break existing code
✓ @clarity-chat/primitives (major)
Summary: Removed deprecated Button variant prop
```

**Minor (New Feature)**
```bash
# For new features that don't break existing code
✓ @clarity-chat/react (minor)
Summary: Added new ChatWindow component with streaming support
```

**Patch (Bug Fix)**
```bash
# For bug fixes and minor improvements
✓ @clarity-chat/primitives (patch)
Summary: Fixed focus ring color in dark mode
```

### 3. Committing Changes

```bash
# Add the changeset file
git add .changeset/*.md

# Commit with your code changes
git commit -m "feat: add new feature with changeset"
```

## Changeset Workflow

### For Contributors

1. **Make Your Changes**
   ```bash
   # Edit code, add features, fix bugs
   ```

2. **Create Changeset**
   ```bash
   npx changeset
   ```

3. **Commit Everything**
   ```bash
   git add .
   git commit -m "feat: your feature"
   git push
   ```

### For Maintainers

1. **Review Changes**
   ```bash
   # Review pending changesets
   npx changeset status
   ```

2. **Version Packages**
   ```bash
   # This updates package.json versions and generates CHANGELOG.md
   npx changeset version
   ```

3. **Publish Packages**
   ```bash
   # Build and publish to npm
   npx changeset publish
   ```

## Changeset File Format

Changesets are stored as markdown files in `.changeset/` directory:

```markdown
---
"@clarity-chat/primitives": patch
"@clarity-chat/react": minor
---

Added new ChatWindow component with real-time streaming support.

This includes:
- New ChatWindow component
- Streaming message renderer
- Auto-scroll behavior
- Enhanced loading states
```

## Best Practices

### Writing Good Summaries

✅ **Good**
```
Added dark mode support to all primitive components

- Button, Input, Card now respond to theme changes
- Uses CSS variables for easy customization
- Includes smooth transition animations
```

❌ **Bad**
```
Updated stuff
```

### When to Create Changesets

**Always create a changeset for:**
- New features
- Bug fixes
- Breaking changes
- Performance improvements
- API changes

**Don't create changesets for:**
- Documentation-only changes
- Internal refactoring (no API change)
- Test updates
- Build configuration changes

### Semantic Versioning

Follow [SemVer](https://semver.org/):

- **Major (x.0.0)**: Breaking changes that require user action
- **Minor (0.x.0)**: New features, backwards compatible
- **Patch (0.0.x)**: Bug fixes, backwards compatible

## Commands

### Create Changeset
```bash
npx changeset
```

### Check Status
```bash
npx changeset status
```

### Version Packages
```bash
npx changeset version
```

### Publish Packages
```bash
npx changeset publish
```

### Pre-release
```bash
# Enter pre-release mode
npx changeset pre enter alpha

# Create versions
npx changeset version

# Exit pre-release mode
npx changeset pre exit
```

## CI/CD Integration

Changesets work with GitHub Actions:

1. **PR Checks**: Verifies changeset exists for code changes
2. **Version PR**: Creates automated PR with version bumps
3. **Publish**: Publishes packages on merge to main

## Examples

### Example 1: Adding a Feature

```bash
# Make changes
git add src/components/new-feature.tsx

# Create changeset
npx changeset
# Select: @clarity-chat/react (minor)
# Summary: "Added NewFeature component"

# Commit
git commit -m "feat: add NewFeature component"
```

### Example 2: Fixing a Bug

```bash
# Make changes
git add src/components/button.tsx

# Create changeset
npx changeset
# Select: @clarity-chat/primitives (patch)
# Summary: "Fixed Button focus ring in Safari"

# Commit
git commit -m "fix: button focus ring in Safari"
```

### Example 3: Breaking Change

```bash
# Make changes
git add src/components/chat-input.tsx

# Create changeset
npx changeset
# Select: @clarity-chat/react (major)
# Summary: "Removed deprecated onSend prop, use onSubmit instead"

# Commit
git commit -m "feat!: remove deprecated onSend prop"
```

## Configuration

Configuration is in `.changeset/config.json`:

```json
{
  "changelog": ["@changesets/changelog-github", { "repo": "..." }],
  "commit": false,
  "baseBranch": "main",
  "access": "restricted"
}
```

## Troubleshooting

### No Changesets Found
```bash
# Create a changeset first
npx changeset
```

### Version Conflicts
```bash
# Pull latest changes
git pull

# Re-run version
npx changeset version
```

### Publish Errors
```bash
# Ensure you're authenticated
npm login

# Check package.json publishConfig
```

## Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Questions?** See the [Changesets GitHub](https://github.com/changesets/changesets) or ask the maintainers.
