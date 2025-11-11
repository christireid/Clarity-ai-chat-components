# Examples Update Guide

This document tracks the modernization of example applications.

## Update Pattern

All examples should be updated to:
- React: `^19.2.0`
- React DOM: `^19.2.0`
- Next.js (if used): `^16.0.1`
- TypeScript: `^5.9.3`
- Vite (if used): `^6.0.0`
- @types/react: `^19.0.0`
- @types/react-dom: `^19.0.0`
- @vitejs/plugin-react: `^5.0.4`

## Updated Examples

- ✅ `basic-chat` - Vite + React 19
- ✅ `streaming-chat` - Next.js 16 + React 19
- ✅ `vercel-ai-sdk-compatible` - Vite + React 19

## Remaining Examples

The following examples still need updates (use the same pattern as above):

### Vite Examples
- `advanced-chat-features`
- `component-demo`
- `comprehensive-chat-demo`
- `design-system-showcase`
- `token-optimization-demo`
- `examples-showcase`
- `multi-user-chat`
- `enterprise-knowledge-hub`
- `devops-command-center`
- `ai-assistant`
- `ai-sales-copilot`
- `performance-dashboard`
- `theme-builder`

### Next.js Examples
- `rag-workbench-demo`
- `model-comparison-demo`
- `enterprise-ai-ops`
- `conversational-analytics`
- `customer-support`
- `ecommerce-assistant`
- `analytics-console-demo`
- `ai-research-platform`
- `code-assistant`

## Automated Update

You can use the provided script:
```bash
./scripts/update-examples.sh
```

Or update manually using the pattern shown in the updated examples above.
