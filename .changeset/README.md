# Changesets

This directory contains changeset files that describe changes to packages in this repository.

## What are changesets?

Changesets are a way to manage versioning and changelogs with a focus on monorepos. They help automate the process of:

1. **Version bumping** - Automatically increment versions based on semantic versioning
2. **Changelog generation** - Create CHANGELOG.md files automatically
3. **Publishing** - Publish packages to npm with proper versioning

## How to use changesets

### Adding a changeset

When you make changes to the codebase:

```bash
npx changeset
```

This will:
1. Ask which packages have changed
2. Ask what type of change it is (major/minor/patch)
3. Ask for a summary of the changes
4. Create a changeset file in `.changeset/`

### Example changeset session

```
$ npx changeset
🦋  Which packages would you like to include?
  ✔ @clarity-chat/react

🦋  Which type of change is this for @clarity-chat/react?
  ○ patch (bugfix, performance, etc)
  ● minor (new feature)
  ○ major (breaking change)

🦋  Please enter a summary for this change:
Added voice input component with speech-to-text

🦋  Changeset added! 
```

### Consuming changesets

When ready to release:

```bash
# Update package versions
npx changeset version

# Build packages
npm run build

# Publish to npm
npx changeset publish
```

## Automated releases (CI)

Our GitHub Actions workflow automatically:
1. Creates a release PR when changesets are added
2. Publishes packages when the PR is merged
3. Creates GitHub releases
4. Updates CHANGELOG.md

## Changeset types

### Patch (0.0.X)
- Bug fixes
- Performance improvements
- Documentation updates
- Refactoring (no API changes)

### Minor (0.X.0)
- New features
- New components
- New hooks
- Backward-compatible changes

### Major (X.0.0)
- Breaking changes
- API redesigns
- Removed features
- Incompatible updates

## Best practices

1. **Create changesets for every PR** that changes package code
2. **Be descriptive** in changeset summaries
3. **Group related changes** in a single changeset
4. **Follow semantic versioning** strictly
5. **Don't commit changeset files** manually (use `npx changeset`)

## Manual workflow

For manual releases:

```bash
# 1. Create changesets for your changes
npx changeset

# 2. Commit the changeset
git add .changeset
git commit -m "chore: add changeset"

# 3. When ready to release
npx changeset version
git add .
git commit -m "chore: version packages"

# 4. Build
npm run build

# 5. Publish
npx changeset publish
git push --follow-tags
```

## Learn more

- [Changesets documentation](https://github.com/changesets/changesets)
- [Versioning guide](https://semver.org/)
