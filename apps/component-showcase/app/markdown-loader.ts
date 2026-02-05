/**
 * Pre-load markdown dependencies to ensure they're available for dynamic imports
 * This resolves issues where @clarity-chat/react's EnhancedMarkdownRenderer
 * can't find react-markdown via dynamic imports
 */

// Force these modules to be included in the bundle
import 'react-markdown'
import 'remark-gfm'
import 'rehype-highlight'

// Re-export to ensure they're tree-shaken correctly
export { default as ReactMarkdown } from 'react-markdown'
export { default as remarkGfm } from 'remark-gfm'
export { default as rehypeHighlight } from 'rehype-highlight'
