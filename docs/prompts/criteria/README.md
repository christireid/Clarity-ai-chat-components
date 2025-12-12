# Review Criteria - Single Source of Truth

This directory contains the canonical review criteria used across all code review tools in the Clarity Chat codebase.

## Purpose

Instead of duplicating review criteria across multiple prompt files, this directory serves as the **single source of truth** for all review standards. When criteria need to be updated (e.g., new React 19 patterns), update them here.

## Files

| File | Description |
|------|-------------|
| `security.md` | NextJS security criteria (Server Actions, XSS, CSRF) |
| `performance.md` | React performance criteria (memoization, code splitting) |
| `typescript.md` | TypeScript strict mode compliance criteria |
| `tailwind.md` | Tailwind CSS quality and consistency criteria |
| `architecture.md` | Component architecture and patterns criteria |
| `clarity-chat.md` | Clarity Chat-specific API usage criteria |

## How Criteria Are Used

These criteria are referenced by:

1. **GitHub Copilot Prompts** (`.github/prompts/`)
2. **Claude Code Commands** (`.claude/commands/`)
3. **Cursor Prompts** (`.cursor/prompts/`)
4. **VS Code Snippets** (`.vscode/clarity-chat.code-snippets`)
5. **Documentation** (`docs/prompts/`)

## Updating Criteria

When updating review standards:

1. Update the relevant file in this directory
2. Verify the change aligns with the latest framework versions
3. Consider if platform-specific prompts need adjustment
4. Update examples in `docs/prompts/examples/` if affected

## Version

Criteria Version: 1.0.0
Last Updated: December 2025
Frameworks: React 18+, NextJS 14+, TypeScript 5+, Tailwind CSS 3+
