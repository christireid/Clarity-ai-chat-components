# JSDoc Peer Dependencies Documentation - Complete

## Summary

Updated JSDoc comments for all components using optional peer dependencies to document requirements,
bundle impact, and fallback behavior.

## Updated Components

### 1. Code Highlighting Components

#### CodeBlock.tsx

**Location**: `src/components/code/CodeBlock.tsx`

Added JSDoc tags:

```typescript
/**
 * @requires shiki - Syntax highlighting engine (optional peer dependency)
 * @installation npm install shiki
 * @bundleImpact ~200KB when shiki is installed
 * @fallback Basic <pre><code> rendering without syntax highlighting
 * @docs https://clarity-chat.dev/docs/peer-dependencies
 */
```

**Features**:

- Documents shiki as optional peer
- Shows installation command
- Notes 200KB bundle impact
- Describes fallback behavior

#### StreamingCodeBlock.tsx

**Location**: `src/components/code/StreamingCodeBlock.tsx`

Added JSDoc tags:

```typescript
/**
 * @requires shiki - Syntax highlighting engine (optional peer dependency)
 * @installation npm install shiki
 * @bundleImpact ~200KB when shiki is installed (lazy-loaded on demand)
 * @fallback Basic plain text rendering without syntax highlighting
 * @docs https://clarity-chat.dev/docs/peer-dependencies
 */
```

**Features**:

- Highlights lazy-loading behavior
- Documents graceful degradation

### 2. Markdown Rendering

#### EnhancedMarkdownRenderer.tsx

**Location**: `src/components/ai/EnhancedMarkdownRenderer.tsx`

Added JSDoc tags:

```typescript
/**
 * @requires react-markdown - Core markdown rendering (optional peer dependency)
 * @requires remark-gfm - GitHub Flavored Markdown support (optional peer dependency)
 * @requires rehype-highlight - Syntax highlighting (optional peer dependency)
 * @requires mermaid - Diagram rendering (optional peer dependency, only if enableMermaid=true)
 * @installation npm install react-markdown remark-gfm rehype-highlight
 * @installation npm install mermaid (for diagram support)
 * @bundleImpact react-markdown ~50KB, remark-gfm ~15KB, rehype-highlight ~30KB, mermaid ~300KB
 * @fallback Plain text rendering with basic formatting when react-markdown is not installed
 * @docs https://clarity-chat.dev/docs/peer-dependencies
 */
```

**Features**:

- Documents all markdown-related peers
- Breaks down bundle impact per package
- Notes conditional mermaid requirement
- Describes plain text fallback

### 3. Virtualization Components

#### VirtualizedMessageList.tsx

**Location**: `src/components/chat/VirtualizedMessageList.tsx`

Added JSDoc tags:

```typescript
/**
 * @requires react-window - Virtual scrolling library (direct dependency)
 * @requires react-virtualized-auto-sizer - Auto-sizing container (direct dependency)
 * @bundleImpact react-window ~8KB, react-virtualized-auto-sizer ~3KB (included in @clarity-chat/react)
 * @note These are direct dependencies, not peer dependencies - no installation needed
 * @alternative Consider TanStackMessageList for modern API and better TypeScript support
 * @docs https://clarity-chat.dev/docs/components/virtualized-message-list
 */
```

**Features**:

- Clarifies these are direct dependencies
- Notes no installation needed
- Suggests modern alternative

#### TanstackMessageList.tsx

**Location**: `src/components/chat/TanstackMessageList.tsx`

Added JSDoc tags:

```typescript
/**
 * @requires @tanstack/react-virtual - Modern virtualization library (direct dependency)
 * @bundleImpact ~7KB (included in @clarity-chat/react)
 * @note This is a direct dependency, not a peer dependency - no installation needed
 * @recommended Use this over VirtualizedMessageList for new projects
 * @docs https://clarity-chat.dev/docs/components/tanstack-message-list
 */
```

**Features**:

- Recommends over legacy alternative
- Notes modern API benefits

### 4. Document Loaders

#### pdf-loader.ts

**Location**: `src/document-loaders/pdf-loader.ts`

Added JSDoc tags:

```typescript
/**
 * @requires pdfjs-dist - PDF parsing library (optional peer dependency)
 * @installation npm install pdfjs-dist
 * @bundleImpact ~600KB (includes worker bundle)
 * @note Requires additional setup for worker configuration
 * @fallback Throws error if pdfjs-dist is not installed
 * @docs https://clarity-chat.dev/docs/document-loaders#pdf-setup
 */
```

**Features**:

- Documents large bundle size
- Notes worker setup requirement
- Provides setup example in docstring

#### docx-loader.ts

**Location**: `src/document-loaders/docx-loader.ts`

Added JSDoc tags:

```typescript
/**
 * @requires jszip - ZIP file parsing for .docx format (optional peer dependency)
 * @installation npm install jszip
 * @bundleImpact ~100KB (JSZip library)
 * @fallback Returns error document with installation instructions if jszip is not installed
 * @docs https://clarity-chat.dev/docs/document-loaders#docx-setup
 */
```

**Features**:

- Documents ZIP parsing requirement
- Describes error document fallback

### 5. RAG and Embeddings

#### cohere.ts (Reranker)

**Location**: `src/reranking/cohere.ts`

Added JSDoc tags:

```typescript
/**
 * @requires cohere-ai - Cohere API client (optional peer dependency)
 * @installation npm install cohere-ai
 * @bundleImpact ~50KB when cohere-ai is installed
 * @note Requires Cohere API key (get free key at https://cohere.com)
 * @alternative Use SimpleReranker for local reranking without API calls
 * @docs https://clarity-chat.dev/docs/rag/reranking
 */
```

**Features**:

- Documents API key requirement
- Suggests local alternative
- Links to setup docs

### 6. Animation Components

#### FlowtokenAdapter.tsx

**Location**: `src/components/message/FlowtokenAdapter.tsx`

Added JSDoc tags:

```typescript
/**
 * @requires flowtoken - Specialized LLM streaming animations (optional peer dependency)
 * @installation npm install flowtoken
 * @bundleImpact ~15KB when flowtoken is installed
 * @fallback Shows static text without animations if flowtoken is not installed
 * @docs https://clarity-chat.dev/docs/animations/flowtoken
 */
```

**Features**:

- Documents streaming animation enhancement
- Notes graceful degradation to static text

#### motion-safe.ts

**Location**: `src/animations/motion-safe.ts`

Added JSDoc tags:

```typescript
/**
 * @requires framer-motion - Animation library (peer dependency)
 * @installation npm install framer-motion
 * @bundleImpact ~80KB when framer-motion is installed
 * @note framer-motion is a required peer dependency for @clarity-chat/react
 * @docs https://clarity-chat.dev/docs/animations/motion-safe
 */
```

**Features**:

- Clarifies this is a required peer
- Documents core animation dependency

## Documentation Files Created

### 1. PEER_DEPENDENCIES_DOCUMENTATION.md

Comprehensive guide covering:

- Summary table of all peer dependencies
- Bundle impact analysis
- Component-by-component documentation
- Installation guides (minimal, common, full)
- Bundle size considerations
- Migration guide from bundled versions
- Troubleshooting section
- Links to detailed docs

**Key Sections**:

- Summary of Peer Dependencies (table)
- Component Documentation Updates
- Updated Components (detailed)
- Installation Guide
- Bundle Size Considerations
- Migration from Previous Versions
- Troubleshooting
- Documentation Links

### 2. QUICK_START_PEER_DEPS.md

Quick reference guide covering:

- TL;DR installation commands
- By-feature installation
- Component checker script
- Common scenarios
- Troubleshooting quick fixes

**Key Sections**:

- TL;DR (minimal, common, full setups)
- By Feature (individual package installs)
- Component Checker (runtime detection)
- Common Scenarios (use-case specific)
- Troubleshooting (error fixes)

## JSDoc Tag Standards

All component documentation now follows this standard format:

### Required Tags for Optional Peer Dependencies

1. **@requires** - Lists peer dependencies with description

   ```typescript
   @requires shiki - Syntax highlighting (npm install shiki)
   ```

2. **@installation** - Shows installation command

   ```typescript
   @installation npm install shiki
   ```

3. **@bundleImpact** - Documents bundle size impact

   ```typescript
   @bundleImpact ~200KB when installed
   ```

4. **@fallback** - Describes behavior when dependency is missing

   ```typescript
   @fallback Basic <pre><code> rendering without syntax highlighting
   ```

5. **@docs** - Links to detailed documentation
   ```typescript
   @docs https://clarity-chat.dev/docs/peer-dependencies
   ```

### Additional Tags When Applicable

- **@note** - Important notes about setup or usage
- **@alternative** - Alternative components or approaches
- **@recommended** - Recommendation status

## Benefits

### For Developers

1. **Discovery**: JSDoc comments in IDE show peer requirements inline
2. **Installation**: Copy-paste installation commands from docs
3. **Bundle Awareness**: Understand size impact before installing
4. **Graceful Degradation**: Know what happens without optional deps
5. **Quick Reference**: Quick start guide for common scenarios

### For Type Safety

1. **IntelliSense**: VS Code and other IDEs show requirements in autocomplete
2. **Hover Info**: Hover over components to see peer requirements
3. **Documentation**: Generated API docs include peer dependency info
4. **Examples**: JSDoc examples show complete setup

### For Bundle Optimization

1. **Informed Decisions**: Developers can choose features based on size
2. **Tree Shaking**: Optional peers can be excluded from builds
3. **Lazy Loading**: Documented which features support lazy loading
4. **Alternatives**: Know when smaller alternatives exist

## Migration Impact

### Before

```typescript
// No indication of peer dependencies
import { CodeBlock } from '@clarity-chat/react'

// Would fail at runtime if shiki not installed
<CodeBlock language="typescript">...</CodeBlock>
```

### After

```typescript
// JSDoc comment shows requirements in IDE
import { CodeBlock } from '@clarity-chat/react'
// /**
//  * @requires shiki - Syntax highlighting (npm install shiki)
//  * @bundleImpact ~200KB when installed
//  * @fallback Basic rendering without highlighting
//  */

// Install if needed
// npm install shiki

<CodeBlock language="typescript">...</CodeBlock>
```

## Testing

All updated components maintain their existing functionality:

1. **CodeBlock**: Shows warning banner when shiki is missing
2. **EnhancedMarkdownRenderer**: Falls back to PlainTextMarkdown
3. **PDFLoader**: Throws helpful error with setup instructions
4. **DOCXLoader**: Returns error document with instructions
5. **CohereReranker**: Requires API key validation
6. **FlowTokenStreamingText**: Shows static text fallback

## Next Steps

1. **README Updates**: Update main README with peer deps section (Task #2)
2. **Migration Guide**: Create 2.0.0 migration guide (Task #1)
3. **Online Docs**: Update clarity-chat.dev with new peer deps docs
4. **Examples**: Add examples showing optional vs required setup
5. **Bundle Analysis**: Run bundle size analysis to verify savings

## Files Modified

1. `src/components/code/CodeBlock.tsx`
2. `src/components/code/StreamingCodeBlock.tsx`
3. `src/components/ai/EnhancedMarkdownRenderer.tsx`
4. `src/components/chat/VirtualizedMessageList.tsx`
5. `src/components/chat/TanstackMessageList.tsx`
6. `src/document-loaders/pdf-loader.ts`
7. `src/document-loaders/docx-loader.ts`
8. `src/components/message/FlowtokenAdapter.tsx`
9. `src/reranking/cohere.ts`
10. `src/animations/motion-safe.ts`

## Files Created

1. `PEER_DEPENDENCIES_DOCUMENTATION.md` (8,713 bytes)
2. `QUICK_START_PEER_DEPS.md` (3,704 bytes)
3. `JSDOC_PEER_DEPS_COMPLETE.md` (this file)

## Status

Task #5: Update component documentation with peer requirements - **COMPLETED** ✓

All components using optional peer dependencies now have:

- Comprehensive JSDoc comments
- Installation instructions
- Bundle impact documentation
- Fallback behavior documentation
- Links to detailed documentation

## Date

January 26, 2026
