# Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) to manage versions and changelogs.

## Adding a changeset

When you make changes that should be released, run:

```bash
pnpm changeset
```

This will prompt you to:
1. Select which packages have changed
2. Choose the bump type (major, minor, patch)
3. Write a summary of the changes

## Releasing

To create a new release:

```bash
# Create version bumps and changelog entries
pnpm changeset version

# Publish to npm
pnpm changeset publish
```

## Guidelines

### When to add a changeset

- **Always**: Bug fixes, new features, breaking changes
- **Never**: Documentation-only changes, internal refactors, test changes

### Bump types

- **major**: Breaking changes (API changes, removed features)
- **minor**: New features (backwards compatible)
- **patch**: Bug fixes, performance improvements

### Writing good changeset summaries

- Start with a verb (Add, Fix, Update, Remove)
- Be concise but descriptive
- Reference issue numbers if applicable

Examples:
- "Add undo/redo support to chat history hook"
- "Fix rate limit header parsing for Anthropic API"
- "Update color tokens to OKLCH format"
