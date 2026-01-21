# Code Rendering Contexts Inventory

## Context Type: Markdown/MDX Code Blocks
- Location(s): All `.mdx` files in `apps/docs/content/`
- Renderer: Standard MDX `pre`/`code` elements → `mdxComponents.pre` in `apps/docs/components/MDX/mdx-components.tsx`
- Component Path(s): `apps/docs/components/MDX/mdx-components.tsx` (lines 152-165)
- Current Theme/Styles: Basic Tailwind styling, no syntax highlighting
- Highlighting: None (plain text only)
- Features: None (just plain code blocks)
- Issues: No syntax highlighting, no copy button, no language badges
- Priority: High
- Migration Plan: Update MDX components to use canonical CodeBlock

## Context Type: Documentation Pages CodeBlock
- Location(s): All documentation TSX pages using `<CodeBlock>` component
- Renderer: `apps/docs/components/MDX/CodeBlock.tsx` wrapper
- Component Path(s): `apps/docs/components/MDX/CodeBlock.tsx`, `@clarity-chat/react` unified CodeBlock
- Current Theme/Styles: Shiki with configurable themes (currently not Night Owl)
- Highlighting: Shiki syntax highlighting
- Features: Copy button, download button, line numbers, keyboard shortcuts, expand/collapse
- Issues: Not consistently using Night Owl theme
- Priority: High
- Migration Plan: Update to use canonical renderer with Night Owl theme

## Context Type: Documentation Pages EnhancedCodeBlock
- Location(s): All documentation TSX pages using `<EnhancedCodeBlock>` component
- Renderer: `apps/docs/components/Enhanced/EnhancedCodeBlock.tsx` wrapper
- Component Path(s): `apps/docs/components/Enhanced/EnhancedCodeBlock.tsx`, `@clarity-chat/react` unified CodeBlock
- Current Theme/Styles: Shiki with configurable themes (currently not Night Owl)
- Highlighting: Shiki syntax highlighting
- Features: Copy button, download button, sandbox links, filename display, line numbers, keyboard shortcuts
- Issues: Not consistently using Night Owl theme
- Priority: High
- Migration Plan: Update to use canonical renderer with Night Owl theme

## Context Type: Interactive Playgrounds
- Location(s): `apps/docs/components/Playground/` directory
- Renderer: Monaco Editor and custom syntax highlighting
- Component Path(s): `apps/docs/components/Playground/CodePlayground.tsx` (Monaco), `apps/docs/components/Playground/InteractivePlayground.tsx` (custom highlighting)
- Current Theme/Styles: Monaco uses 'vs-dark'/'light', InteractivePlayground uses custom CSS highlighting
- Highlighting: Monaco built-in, InteractivePlayground custom regex-based
- Features: Live code editing, execution, copy buttons
- Issues: Monaco not using Night Owl theme, InteractivePlayground highlighting not Night Owl
- Priority: Medium
- Migration Plan: Register Night Owl theme with Monaco, update custom highlighting

## Context Type: Monaco Editor Instances
- Location(s): `apps/docs/components/Playground/CodeEditor.tsx` (used by CodePlayground)
- Renderer: Monaco Editor via `@monaco-editor/react`
- Component Path(s): `apps/docs/components/Playground/CodeEditor.tsx`
- Current Theme/Styles: Uses 'vs-dark' or 'light' based on Next.js theme
- Highlighting: Monaco's built-in highlighting engine
- Features: Full IDE-like editing experience, syntax highlighting, IntelliSense
- Issues: Not configured for Night Owl theme, theme switching not aligned with code blocks
- Priority: Medium
- Migration Plan: Register Night Owl theme with Monaco and align with code block theming

## Context Type: Reference API Examples
- Location(s): `apps/docs/app/reference/` pages with dynamically generated code
- Renderer: Likely CodeBlock/EnhancedCodeBlock components
- Component Path(s): Various reference pages
- Current Theme/Styles: Inherits from CodeBlock components
- Highlighting: Shiki via CodeBlock components
- Features: Varies by page
- Issues: Inconsistent theming
- Priority: High
- Migration Plan: Ensure all use canonical renderer

## Context Type: Cookbook Examples
- Location(s): `apps/docs/app/cookbook/` pages
- Renderer: CodeBlock and EnhancedCodeBlock components
- Component Path(s): Various cookbook pages
- Current Theme/Styles: Inherits from CodeBlock components
- Highlighting: Shiki via CodeBlock components
- Features: Copy buttons, line numbers where enabled
- Issues: Not consistently Night Owl themed
- Priority: High
- Migration Plan: Update to canonical renderer

## Context Type: Integration Guides
- Location(s): `apps/docs/app/integrations/` and `apps/docs/app/guides/integration/`
- Renderer: CodeBlock components for installation and setup code
- Component Path(s): Integration guide pages
- Current Theme/Styles: Inherits from CodeBlock components
- Highlighting: Shiki via CodeBlock components
- Features: Installation commands, configuration examples
- Issues: May have mixed theming
- Priority: High
- Migration Plan: Update to canonical renderer

## Context Type: Inline Code
- Location(s): All documentation content using `code` elements
- Renderer: MDX `code` component in `mdxComponents`
- Component Path(s): `apps/docs/components/MDX/mdx-components.tsx` (lines 168-176)
- Current Theme/Styles: Basic Tailwind background styling
- Highlighting: None (plain inline code)
- Features: None
- Issues: Not aligned with Night Owl theme colors
- Priority: Medium
- Migration Plan: Create InlineCode component with Night Owl colors

## Context Type: Storybook Examples
- Location(s): `apps/storybook/` stories with code examples
- Renderer: Storybook's built-in code rendering
- Component Path(s): Various `.stories.tsx` files
- Current Theme/Styles: Storybook default themes
- Highlighting: Storybook's syntax highlighting
- Features: Varies by story
- Issues: Not Night Owl themed
- Priority: Low
- Migration Plan: Update if Storybook is part of docs site, otherwise defer