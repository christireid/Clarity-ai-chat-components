import type { Meta, StoryObj } from '@storybook/react-vite';
import { EnhancedMarkdownRenderer } from '@clarity-chat/react';
/**
 * **EnhancedMarkdownRenderer Component**
 *
 * Enhanced markdown renderer with LaTeX math support,
 * Mermaid diagrams, syntax highlighting, and more.
 *
 * **Key Features:**
 * - Standard markdown rendering
 * - LaTeX math support (inline and block)
 * - Mermaid diagram rendering
 * - Syntax highlighting for code blocks
 * - Table support
 * - Link handling
 * - Customizable styling
 *
 * **Use Cases:**
 * - AI chat responses with markdown
 * - Documentation rendering
 * - Technical content display
 * - Educational content
 */
declare const meta: Meta<typeof EnhancedMarkdownRenderer>;
export default meta;
type Story = StoryObj<typeof EnhancedMarkdownRenderer>;
export declare const Default: Story;
export declare const WithSyntaxHighlighting: Story;
export declare const WithKaTeX: Story;
export declare const WithMermaid: Story;
export declare const StreamingContent: Story;
export declare const AllFeatures: Story;
//# sourceMappingURL=EnhancedMarkdownRenderer.stories.d.ts.map