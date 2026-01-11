# Playground Architecture

## Core Components
1. **Sandpack Integration**: Moving to Sandpack for better dependency handling.
2. **Template Registry**: `apps/docs/lib/playground-templates.ts`
3. **State Management**: URL-based state for sharing.

## Changes Required
- [ ] Replace `react-live` with `@codesandbox/sandpack-react`
- [ ] Add `lz-string` for URL compression
- [ ] Implement "Open in CodeSandbox" properly
