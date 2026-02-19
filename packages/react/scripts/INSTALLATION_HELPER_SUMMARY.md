# Peer Dependencies Installation Helper - Summary

Complete CLI tooling for helping users install only the peer dependencies they need.

## Overview

This package provides interactive and non-interactive CLI tools to help users:

1. Discover which peer dependencies they need based on features
2. Get accurate bundle size estimates
3. Generate copy-paste ready installation commands
4. Integrate with CI/CD pipelines

## Files Created

### 1. Main Interactive Script

**File**: `scripts/install-peers.js`

Interactive CLI that guides users through feature selection with:

- 5 preset configurations (Minimal, Standard, Full, Document Q&A, Custom)
- Individual feature selection for custom setups
- Real-time bundle size calculations
- Package manager auto-detection (npm, yarn, pnpm, bun)
- Copy-paste ready commands
- Usage examples with selected features
- Beautiful CLI interface with colors

**Usage**:

```bash
pnpm install-peers
# or
node scripts/install-peers.js
```

### 2. CI/CD Script

**File**: `scripts/install-peers-ci.js`

Non-interactive version for automation and CI/CD:

- Supports all presets via arguments
- Custom feature selection via args
- Clean, parseable output
- GitHub Actions integration
- Environment variable support

**Usage**:

```bash
node scripts/install-peers-ci.js minimal
node scripts/install-peers-ci.js standard
node scripts/install-peers-ci.js full
node scripts/install-peers-ci.js document
node scripts/install-peers-ci.js custom core reactDom markdown
```

### 3. Command-Only Script

**File**: `scripts/get-install-command.js`

Outputs just the installation command for easy piping:

```bash
node scripts/get-install-command.js standard pnpm
# Output: pnpm add react@"^18.0.0" ...

# Use with eval
eval $(node scripts/get-install-command.js standard)
```

### 4. Documentation

- **`scripts/INSTALL_PEERS_README.md`** - Comprehensive guide with examples
- **`scripts/USAGE_EXAMPLES.md`** - Real-world usage scenarios
- **`scripts/install-peers.test.js`** - Test suite (vitest compatible)
- **`scripts/INSTALLATION_HELPER_SUMMARY.md`** (this file)

## Package.json Scripts

Added the following npm scripts:

```json
{
  "install-peers": "node scripts/install-peers.js",
  "install-peers:ci": "node scripts/install-peers-ci.js",
  "install-peers:minimal": "node scripts/install-peers-ci.js minimal",
  "install-peers:standard": "node scripts/install-peers-ci.js standard",
  "install-peers:full": "node scripts/install-peers-ci.js full",
  "install-peers:document": "node scripts/install-peers-ci.js document",
  "install-peers:cmd": "node scripts/get-install-command.js"
}
```

## Features Defined

The tools support 9 feature categories:

### Core Features (Required)

- Dependencies: `react`, `framer-motion`, `lucide-react`, `zod`
- Size: ~450 KB
- Always included

### React DOM (Optional)

- Dependencies: `react-dom`
- Size: ~130 KB
- Required for web apps, not for React Native

### Markdown Rendering

- Dependencies: `react-markdown`, `remark-gfm`, `rehype-highlight`
- Size: ~85 KB
- GitHub Flavored Markdown support

### Advanced Code Highlighting

- Dependencies: `shiki`, `prismjs`
- Size: ~195 KB
- 100+ languages, beautiful themes

### Diagram Support

- Dependencies: `mermaid`
- Size: ~320 KB
- Flowcharts, sequence diagrams, etc.

### Document Processing

- Dependencies: `pdfjs-dist`, `mammoth`
- Size: ~450 KB
- PDF and DOCX extraction for RAG

### Export Features

- Dependencies: `jszip`
- Size: ~120 KB
- Export conversations to ZIP

### AI Reranking

- Dependencies: `cohere-ai`
- Size: ~65 KB
- Improve RAG search quality

### Token Optimization

- Dependencies: `flowtoken`
- Size: ~40 KB
- Advanced token counting (experimental)

## Presets

### P1: Minimal (580 KB)

Core + React DOM Perfect for basic chat interfaces

### P2: Standard (860 KB)

Core + React DOM + Markdown + Code Highlighting Most common use case

### P3: Full (1.7 MB)

All features enabled Enterprise-ready

### P4: Document Q&A (1.1 MB)

Core + React DOM + Markdown + Document Processing + Reranking Optimized for RAG applications

### P5: Custom

Pick exactly what you need

## Example Workflows

### For End Users

```bash
# Interactive selection
pnpm install-peers

# Quick presets
pnpm install-peers:minimal
pnpm install-peers:standard
pnpm install-peers:full
```

### For CI/CD

```bash
# Get installation command
INSTALL_CMD=$(node scripts/get-install-command.js standard pnpm)

# Or use the CI script
node scripts/install-peers-ci.js standard

# GitHub Actions
- run: |
    node packages/react/scripts/install-peers-ci.js standard
    pnpm add @clarity-chat/react
```

### For Scripting

```bash
# Get just the command
node scripts/get-install-command.js minimal npm > install.sh
chmod +x install.sh
./install.sh

# Or eval directly
eval $(node scripts/get-install-command.js standard)
```

## User Experience Highlights

### Interactive Mode Features

1. Beautiful ASCII art header
2. Color-coded output (green for success, blue for options, yellow for warnings)
3. Clear feature descriptions with bundle sizes
4. Real-time total size calculation
5. Package manager auto-detection
6. Copy-paste ready commands
7. Usage examples with selected features
8. Tips and best practices

### CI/CD Mode Features

1. Clean, parseable output
2. Machine-readable format
3. GitHub Actions integration (set-output)
4. Environment variable export support
5. Exit codes for error handling
6. No TTY/color in non-interactive environments

## Technical Implementation

### Package Manager Detection

Auto-detects from `npm_config_user_agent` environment variable:

- Detects pnpm, yarn, bun, npm
- Falls back to npm if unknown
- Generates correct commands for each PM

### Bundle Size Calculation

Based on minified + gzipped production builds:

- Individual feature sizes tracked
- Sum calculated in real-time
- Displays in KB or MB based on size
- Includes disclaimer about actual sizes

### Modular Design

```javascript
import {
  FEATURES,
  detectPackageManager,
  generateInstallCommand,
  calculateTotalSize,
} from './install-peers.js'
```

All functions are exported for programmatic use.

## Testing

### Manual Validation

```bash
# Test interactive mode (just press Ctrl+C)
pnpm install-peers

# Test CI mode
pnpm install-peers:minimal
pnpm install-peers:standard
pnpm install-peers:full
pnpm install-peers:document

# Test command-only
pnpm install-peers:cmd standard pnpm
```

### Automated Tests

```bash
# Run test suite (if vitest is configured)
npx vitest run scripts/install-peers.test.js
```

### Integration Test

```bash
# Verify module loads and functions work
node -e "
import('./scripts/install-peers.js').then(m => {
  console.log('Features:', Object.keys(m.FEATURES).length);
  console.log('PM:', m.detectPackageManager());
  console.log('✅ Works!');
})
"
```

## Future Enhancements

Potential improvements (not implemented yet):

1. **Auto-install**: Actually run the installation command
2. **Config file**: Save user preferences for future runs
3. **Update checker**: Check if peer versions need updates
4. **Conflict detection**: Warn about version conflicts
5. **Dry run**: Show what would be installed without installing
6. **Size comparison**: Compare with other libraries
7. **Interactive preview**: Show sample UI for each feature
8. **Dependency graph**: Visual representation of dependencies

## Integration Points

### Documentation

Links to existing docs:

- Main README: Installation section
- PEER_DEPENDENCIES_DOCUMENTATION.md: Detailed peer deps guide
- QUICK_START.md: Getting started guide
- MIGRATION_GUIDE.md: Upgrade instructions

### Package.json

Updates peer dependencies list:

- Core dependencies (required)
- Optional dependencies (peerDependenciesMeta)
- Version ranges

### Build System

Compatible with:

- tsup for bundling
- Tree-shaking configurations
- External dependencies list

## Benefits

### For Users

1. Don't need to read long docs to know what to install
2. Only install what they need (smaller bundle)
3. Get accurate size estimates upfront
4. Copy-paste ready commands (no typos)
5. See usage examples immediately

### For Maintainers

1. Reduce support burden (fewer "how do I install?" questions)
2. Clear documentation of peer dependencies
3. Easy to update when adding new features
4. Testable and maintainable code
5. Works in all environments (local, CI, Docker)

### For CI/CD

1. Deterministic installations
2. No interactive prompts
3. Parseable output
4. Exit codes for error handling
5. GitHub Actions integration

## Real-World Examples

### Startup Building MVP

```bash
pnpm install-peers:minimal  # Keep it small, fast iteration
```

### SaaS Documentation Site

```bash
pnpm install-peers:standard  # Markdown + code highlighting
```

### Enterprise RAG Application

```bash
pnpm install-peers:document  # PDF/DOCX + reranking
```

### Open Source Project

```bash
pnpm install-peers:full  # Show off all features
```

## Maintenance

### Updating Features

To add a new feature:

1. Edit `scripts/install-peers.js`
2. Add entry to `FEATURES` object:

```javascript
newFeature: {
  name: 'Feature Name',
  description: 'What it does',
  dependencies: {
    'package': '^1.0.0',
  },
  bundleSize: '100 KB',
  features: ['List', 'of', 'capabilities'],
}
```

3. Update presets if needed
4. Update documentation
5. Test all scripts

### Updating Bundle Sizes

When bundle sizes change:

1. Run actual bundle analysis
2. Update `bundleSize` in FEATURES
3. Test that calculations still work
4. Update documentation examples

### Updating Version Ranges

When peer dependency versions change:

1. Update `dependencies` in FEATURES
2. Update `peerDependencies` in package.json
3. Test installation commands
4. Update migration guide if breaking

## Success Metrics

To measure success:

1. **Adoption**: Track how many users run the script
2. **Time saved**: Measure setup time before/after
3. **Support tickets**: Track reduction in "how to install" questions
4. **Bundle sizes**: Track average user bundle size
5. **Feature usage**: See which presets are most popular

## Conclusion

This CLI tooling significantly improves the developer experience for installing Clarity Chat peer
dependencies. It provides:

- Clear, interactive guidance
- Accurate information
- Copy-paste commands
- CI/CD integration
- Comprehensive documentation

Users can get started faster, with smaller bundles, and less confusion.

---

**Created**: January 26, 2026 **Version**: 1.0.0 **Status**: Stable
