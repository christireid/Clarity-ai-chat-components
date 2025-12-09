# llms.txt Generation Scripts

This directory contains scripts for generating AI-optimized documentation files following the
[llms.txt specification](https://llmstxt.org/).

## Overview

The generation system produces:

- **`/llms.txt`** - Concise navigation file with site structure (~2,500 tokens)
- **`/llms-full.txt`** - Complete documentation in a single file (~350K tokens)

## Quick Start

```bash
# Generate llms.txt files
cd apps/docs
pnpm run generate:llms
```

## File Structure

```
scripts/
├── generate-llms.ts       # Main generation script
├── navigation-config.ts   # Documentation structure & descriptions
├── types.ts              # TypeScript type definitions
├── lib/
│   └── content-extractor.ts  # JSX/TSX content extraction utilities
├── __tests__/
│   ├── content-extractor.test.ts
│   └── navigation-config.test.ts
└── README.md             # This file
```

## How It Works

1. **Discovery**: Scans `app/` directory for all `page.tsx` files
2. **Validation**: Checks navigation config against discovered pages
3. **Extraction**: Extracts content from JSX using regex patterns
4. **Generation**: Creates `llms.txt` and `llms-full.txt` files
5. **Output**: Writes files to `public/` directory

## Updating Navigation Config

When adding new documentation pages, update `navigation-config.ts`:

```typescript
// navigation-config.ts
export const navigationConfig: NavigationSection[] = [
  {
    title: 'Section Name',
    items: [
      {
        title: 'Page Title',
        href: '/path/to/page', // Must match actual page path
        description: 'Brief description for AI indexing',
      },
    ],
  },
]
```

### Guidelines for Descriptions

- Keep descriptions under 100 characters
- Focus on what the page teaches, not what it is
- Use action words: "Learn how to...", "Configure...", "Build..."
- Avoid generic descriptions like "Documentation for X"

## Validation Warnings

The generator validates your navigation config and warns about:

| Warning                     | Meaning                               | Fix                                 |
| --------------------------- | ------------------------------------- | ----------------------------------- |
| "Broken link: /path"        | Navigation links to non-existent page | Update href or create the page      |
| "N pages not in navigation" | Pages exist but aren't in llms.txt    | Add entries to navigation-config.ts |

## GitHub Actions

The CI workflow (`.github/workflows/generate-llms.yml`) automatically:

- Regenerates files on merge to `main`
- Validates generated files
- Commits changes back to the repository

### Manual Trigger

You can manually trigger regeneration:

```bash
gh workflow run generate-llms.yml
```

## Configuration

Key constants in `generate-llms.ts`:

| Constant          | Default | Description                               |
| ----------------- | ------- | ----------------------------------------- |
| `MAX_TOKENS`      | 500,000 | Maximum tokens for llms-full.txt          |
| `MAX_PAGE_TOKENS` | 50,000  | Maximum tokens per page before truncation |

## Troubleshooting

### "Documentation directory not found"

Run the script from the `apps/docs` directory:

```bash
cd apps/docs && pnpm run generate:llms
```

### Warnings about broken links

Check that the `href` in `navigation-config.ts` matches the actual page path:

- Page at `app/learn/quick-start/page.tsx` → href: `/learn/quick-start`
- Page at `app/reference/components/button/page.tsx` → href: `/reference/components/button`

### Content not being extracted

The extractor uses regex patterns for JSX. Complex nested components may not extract correctly.
Check `lib/content-extractor.ts` for supported patterns.

## Testing

```bash
# Run all script tests
pnpm test scripts/__tests__

# Run specific test file
pnpm test scripts/__tests__/content-extractor.test.ts
```

## Output Format

### llms.txt

```markdown
# Clarity Chat

> Brief project description

## Section Name

- [Page Title](url): Description

## AI-Optimized APIs

- [Components API](url): JSON endpoint with component docs
```

### llms-full.txt

```markdown
# Clarity Chat - Complete Documentation

## Table of Contents

1. [Page Title](#anchor)

---

<doc url="/path" title="Page Title">
[Full page content in markdown]
</doc>
```

## Contributing

1. Run tests before committing: `pnpm test scripts/__tests__`
2. Regenerate files: `pnpm run generate:llms`
3. Verify no broken link warnings in output
