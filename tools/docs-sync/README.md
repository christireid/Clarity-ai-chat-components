# @clarity-chat/docs-sync

Automated documentation synchronization for Clarity Chat. This tool detects code changes, extracts
API information from TypeScript sources, and generates/updates documentation automatically.

## Features

- **Change Detection**: Analyzes git diffs to identify documentation-relevant changes
- **API Extraction**: Uses TypeScript Compiler API to extract type signatures, JSDoc comments, and
  metadata
- **Doc Generation**: Generates MDX documentation for components, hooks, and types
- **Changelog Generation**: Creates changelog entries from conventional commits
- **Incremental Updates**: Only updates docs for changed files
- **CI Integration**: GitHub Actions workflow for automated sync on merge

## Installation

```bash
pnpm install
pnpm build
```

## CLI Commands

### Detect Changes

Analyze git commits to find documentation-relevant changes:

```bash
# Detect changes between commits
pnpm docs-sync detect-changes --base=HEAD~1 --head=HEAD

# Output as JSON
pnpm docs-sync detect-changes --base=abc123 --head=def456 --output=json

# Output for GitHub Actions
pnpm docs-sync detect-changes --base=$BEFORE --head=$AFTER --output=github
```

### Extract APIs

Extract API information from TypeScript source files:

```bash
# Extract all packages
pnpm docs-sync extract-apis

# Extract specific packages
pnpm docs-sync extract-apis --packages=react,types

# Force full extraction (ignore cache)
pnpm docs-sync extract-apis --full

# Parallel extraction (faster for multiple packages)
pnpm docs-sync extract-apis --parallel --concurrency=3

# Verbose output for debugging
pnpm docs-sync extract-apis --verbose
```

### Generate Documentation

Generate documentation from extracted API data:

```bash
# Generate docs for all packages
pnpm docs-sync generate-docs

# Generate for specific packages
pnpm docs-sync generate-docs --packages=react

# Dry run (preview changes)
pnpm docs-sync generate-docs --dry-run
```

### Generate Changelog

Generate changelog from conventional commits:

```bash
# Generate from last tag
pnpm docs-sync generate-changelog

# Generate from specific ref
pnpm docs-sync generate-changelog --since=v1.0.0

# Set version
pnpm docs-sync generate-changelog --version=1.1.0

# Preview only
pnpm docs-sync generate-changelog --dry-run
```

### Full Sync

Run complete sync (detect, extract, generate, commit):

```bash
# Full sync
pnpm docs-sync sync --base=HEAD~1

# Force full rebuild
pnpm docs-sync sync --base=HEAD~10 --full

# Dry run
pnpm docs-sync sync --base=HEAD~1 --dry-run
```

### Verify

Check if documentation is up to date:

```bash
# Basic verification
pnpm docs-sync verify

# Check for broken internal links
pnpm docs-sync verify --check-links

# Check API documentation coverage
pnpm docs-sync verify --check-coverage
```

### API Diff

Compare current APIs with a baseline to detect changes:

```bash
# Compare with saved baseline
pnpm docs-sync diff

# Use a specific baseline file
pnpm docs-sync diff --baseline=path/to/baseline.json

# Output as JSON for CI integration
pnpm docs-sync diff --output=json

# Output as changelog markdown
pnpm docs-sync diff --output=changelog
```

This is useful for detecting breaking changes in PRs:

```yaml
# In your GitHub Actions workflow
- name: Check for breaking changes
  run: pnpm docs-sync diff --output=json
  continue-on-error: true
```

### Initialize Config

Create a default configuration file:

```bash
# Create .docs-sync.json with defaults
pnpm docs-sync init

# Overwrite existing config
pnpm docs-sync init --force
```

## Configuration

Create a `.docs-sync.json` in your project root:

```json
{
  "version": 1,
  "docsDir": "apps/docs/content",
  "packages": [
    {
      "name": "@clarity-chat/react",
      "path": "packages/react",
      "entryPoints": ["src/index.ts"],
      "docsPath": "components",
      "generateComponentDocs": true,
      "generateHookDocs": true,
      "generateTypeDocs": true
    }
  ],
  "changelog": {
    "outputPath": "CHANGELOG.md",
    "types": ["feat", "fix", "perf"],
    "includeBreaking": true
  }
}
```

## GitHub Actions

The workflow in `.github/workflows/docs-sync.yml` runs automatically on merge to main:

1. **Analyze Changes**: Detects which files changed and classifies them
2. **Generate Docs**: Extracts APIs and generates documentation
3. **Build Verify**: Builds the docs site to catch errors
4. **Notify**: Alerts on breaking changes

To trigger a manual rebuild:

```bash
gh workflow run docs-sync.yml -f full_rebuild=true
```

## How It Works

### Change Detection

1. Parses git diff between commits
2. Classifies each file as docs-relevant or not
3. Identifies affected packages and APIs
4. Determines change type (breaking, feature, fix)

### API Extraction

1. Creates TypeScript program from entry points
2. Walks AST to find exported symbols
3. Extracts type signatures, JSDoc, examples
4. Caches results for incremental builds

### Documentation Generation

1. Loads extracted API data
2. Renders templates for each API type
3. Updates existing docs or creates new ones
4. Skips manually maintained docs (no `autoGenerated: true`)

### Changelog Generation

1. Parses conventional commit messages
2. Groups by type (feat, fix, etc.)
3. Highlights breaking changes
4. Generates markdown with links

## Development

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type check
pnpm typecheck

# Build
pnpm build
```

## License

MIT
