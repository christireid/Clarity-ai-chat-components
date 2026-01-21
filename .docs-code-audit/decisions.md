# Architectural Decisions - Docs Site Night Owl Code Styling

## Framework & Pipeline
- **Framework**: Next.js (App Router)
- **MDX Pipeline**: `next-mdx-remote` and `@next/mdx` are both present.
- **Current Rendering**: Code is currently rendered via a mix of `CodeBlock.tsx` (in `apps/docs/components/MDX/`), `EnhancedCodeBlock.tsx` (in `apps/docs/components/Enhanced/`), and standard MDX `pre`/`code` tags.

## Highlighter Libraries
- **Current**: `highlight.js`, `prismjs`, `prism-react-renderer`.
- **Target**: **Shiki** (preferred) for SSR-compatible, accurate Night Owl highlighting. Fallback to Prism if necessary, but aim for single source of truth.

## Code Rendering Contexts
- **Markdown/MDX**: Standard blocks using ```.
- **Interactive Editors**: Monaco Editor (`@monaco-editor/react`).
- **Live Playgrounds**: `react-live`.
- **API Reference**: Dynamically generated code examples in reference pages.

## Decision: Canonical Renderer
- We will establish `CodeBlock` as the single canonical component for all code blocks.
- We will establish `InlineCode` as the single canonical component for inline code.
- Night Owl will be the only supported theme, implemented via Shiki themes or a shared token mapping.

### Canonical API Design
**CodeBlock** (existing):
```tsx
<CodeBlock
  language="typescript"
  theme="night-owl" // Will be defaulted to Night Owl
  showLineNumbers={false}
  highlightLines="2,5-7"
  showCopyButton={true}
  showLanguageBadge={true}
  title="example.ts"
>
  {codeString}
</CodeBlock>
```

**InlineCode** (new):
```tsx
<InlineCode enableCopy={true}>npm install</InlineCode>
```

### Shared UI Components
- **CopyButton**: Reused from CodeBlockHeader component
- **LanguageBadge**: Reused from CodeBlockHeader component
- **FilenameChip**: Will be created if needed for additional metadata

### Night Owl Theme Implementation
- Single source of truth: Shiki Night Owl theme
- Consistent token mapping across all renderers
- Monaco Editor will use registered Night Owl theme
- InlineCode uses Night Owl background/foreground colors

## Decision: Theme Source of Truth
- **Single Source File**: `packages/react/src/components/code/themes/night-owl.ts` contains all Night Owl color definitions.
- **Shiki Integration**: CodeBlock uses `theme="night-owl"` (Shiki's built-in theme).
- **Monaco Integration**: `NIGHT_OWL_MONACO_THEME` provides compatible Monaco theme.
- **CSS Variables**: Night Owl colors available as CSS custom properties in `code-fonts.css`.
- **Component Integration**: InlineCode uses CSS variables for consistent theming.
- **Contrast & Accessibility**: All colors meet WCAG AA standards.
