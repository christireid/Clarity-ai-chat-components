# Implementation Plan - Code Rendering Migration

## Phase 4: Systematic Migration Status

### ✅ Context Type: Markdown/MDX Code Blocks
- **Status**: ✅ **MIGRATED**
- **Location**: All `.mdx` files in `apps/docs/content/`
- **Renderer**: Standard MDX `pre`/`code` elements → `mdxComponents.pre` in `apps/docs/components/MDX/mdx-components.tsx`
- **Migration**: Updated `mdx-components.tsx` to use canonical CodeBlock component
- **Verification**: MDX code blocks now use unified CodeBlock with Night Owl theming

### ✅ Context Type: Markdown/MDX Inline Code
- **Status**: ✅ **MIGRATED**
- **Location**: All MDX content using inline `code` elements
- **Renderer**: MDX `code` component in `mdxComponents`
- **Migration**: Updated `mdx-components.tsx` to use canonical InlineCode component with Night Owl theming
- **Verification**: Inline code now uses consistent Night Owl styling

### ✅ Context Type: Documentation Pages CodeBlock
- **Status**: ✅ **MIGRATED**
- **Location**: All documentation TSX pages using `<CodeBlock>` component
- **Renderer**: `apps/docs/components/MDX/CodeBlock.tsx` wrapper
- **Migration**: Already using canonical CodeBlock, ensured Night Owl theme is default
- **Verification**: All CodeBlock instances use Night Owl theme

### ✅ Context Type: Documentation Pages EnhancedCodeBlock
- **Status**: ✅ **MIGRATED**
- **Location**: All documentation TSX pages using `<EnhancedCodeBlock>` component
- **Renderer**: `apps/docs/components/Enhanced/EnhancedCodeBlock.tsx` wrapper
- **Migration**: Already using canonical CodeBlock, ensured Night Owl theme is default
- **Verification**: All EnhancedCodeBlock instances use Night Owl theme

### ✅ Context Type: Interactive Playgrounds
- **Status**: ✅ **MIGRATED**
- **Location**: `apps/docs/components/Playground/` directory
- **Renderer**: Monaco Editor and custom syntax highlighting
- **Migration**: Updated `InteractivePlayground.tsx` to use Night Owl colors for custom highlighting, background, and line numbers
- **Verification**: Custom syntax highlighting now uses Night Owl color palette

### ✅ Context Type: Monaco Editor Instances
- **Status**: ✅ **MIGRATED**
- **Location**: `apps/docs/components/Playground/CodeEditor.tsx`
- **Renderer**: Monaco Editor via `@monaco-editor/react`
- **Migration**: Updated `CodeEditor.tsx` to register and use Night Owl Monaco theme on mount
- **Verification**: Monaco editors now use registered Night Owl theme for dark mode

### ✅ Context Type: Reference API Examples
- **Status**: ✅ **VERIFIED**
- **Location**: `apps/docs/app/reference/` pages with dynamically generated code
- **Renderer**: CodeBlock and EnhancedCodeBlock components
- **Migration**: Already using canonical renderers
- **Verification**: Confirmed all reference pages use CodeBlock/EnhancedCodeBlock with Night Owl theme

### ✅ Context Type: Cookbook Examples
- **Status**: ✅ **VERIFIED**
- **Location**: `apps/docs/app/cookbook/` pages
- **Renderer**: CodeBlock and EnhancedCodeBlock components
- **Migration**: Already using canonical renderers
- **Verification**: Confirmed all cookbook pages use CodeBlock/EnhancedCodeBlock with Night Owl theme

### ✅ Context Type: Integration Guides
- **Status**: ✅ **VERIFIED**
- **Location**: `apps/docs/app/integrations/` and `apps/docs/app/guides/integration/`
- **Renderer**: CodeBlock components for installation and setup code
- **Migration**: Already using canonical renderers
- **Verification**: Confirmed all integration guides use CodeBlock with Night Owl theme

### ⭕ Context Type: Storybook Examples
- **Status**: **OUT OF SCOPE**
- **Location**: `apps/storybook/` stories with code examples
- **Renderer**: Storybook's built-in code rendering
- **Decision**: Storybook is a separate development tool for component development and visual testing, not part of the user-facing docs site
- **Rationale**: Task scope is limited to "docs site" code rendering contexts

## Migration Summary

### Completed Migrations: 9/10 contexts (100% of in-scope contexts)
- ✅ Markdown/MDX Code Blocks
- ✅ Markdown/MDX Inline Code
- ✅ Documentation Pages CodeBlock
- ✅ Documentation Pages EnhancedCodeBlock
- ✅ Interactive Playgrounds
- ✅ Monaco Editor Instances
- ✅ Reference API Examples (verified)
- ✅ Cookbook Examples (verified)
- ✅ Integration Guides (verified)

### Out of Scope: 1/10 contexts
- ⭕ Storybook Examples (development tool, not part of docs site)

### Next Priority Actions
1. **Monaco Editor Theme Registration** - Update CodeEditor.tsx to use Night Owl theme
2. **Interactive Playground Highlighting** - Update custom highlighting colors
3. **Storybook Evaluation** - Determine if Storybook is in scope