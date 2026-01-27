/**
 * Advanced Document Parser
 *
 * Enhanced markdown parsing with:
 * - Section-aware chunking
 * - Code block extraction and indexing
 * - Metadata extraction (frontmatter, titles, categories)
 * - Cross-reference detection
 * - Hierarchical heading structure
 */

export interface ParsedDocument {
  /** Original file path */
  path: string
  /** Document title (from frontmatter or first H1) */
  title: string
  /** Document category/type */
  category: DocumentCategory
  /** Extracted frontmatter metadata */
  frontmatter: Record<string, unknown>
  /** Parsed sections with hierarchy */
  sections: DocumentSection[]
  /** Extracted code blocks */
  codeBlocks: CodeBlock[]
  /** Detected cross-references */
  crossReferences: CrossReference[]
  /** Generated tags from content */
  tags: string[]
  /** Last modified timestamp */
  lastModified: Date
}

export interface DocumentSection {
  /** Unique section ID */
  id: string
  /** Section heading text */
  heading: string
  /** Heading level (1-6) */
  level: number
  /** Section content (markdown) */
  content: string
  /** Parent section ID (for nested sections) */
  parentId?: string
  /** Child section IDs */
  childIds: string[]
  /** Code blocks in this section */
  codeBlockIds: string[]
  /** Cross-references in this section */
  crossReferenceIds: string[]
  /** Start line in original document */
  startLine: number
  /** End line in original document */
  endLine: number
}

export interface CodeBlock {
  /** Unique code block ID */
  id: string
  /** Programming language */
  language: string
  /** Code content */
  code: string
  /** Optional caption/description */
  caption?: string
  /** Section ID containing this code block */
  sectionId: string
  /** Keywords extracted from code */
  keywords: string[]
  /** Line number in original document */
  lineNumber: number
  /** Whether this is a valid, complete example */
  isExecutable: boolean
}

export interface CrossReference {
  /** Unique reference ID */
  id: string
  /** Type of reference */
  type: CrossReferenceType
  /** Reference text */
  text: string
  /** Target path/URL */
  target: string
  /** Section ID containing this reference */
  sectionId: string
  /** Context around the reference */
  context: string
  /** Line number in original document */
  lineNumber: number
}

export type CrossReferenceType =
  | 'internal-link'    // [text](/path)
  | 'external-link'    // [text](https://...)
  | 'component-ref'    // <ComponentName />
  | 'hook-ref'         // useHookName()
  | 'import-ref'       // import { X } from 'Y'
  | 'see-also'         // See also: ...
  | 'api-ref'          // Reference to API endpoint

export type DocumentCategory =
  | 'component'
  | 'hook'
  | 'guide'
  | 'cookbook'
  | 'example'
  | 'concept'
  | 'api'
  | 'changelog'
  | 'readme'

/**
 * Parse a markdown document into structured sections
 */
export function parseMarkdownDocument(
  content: string,
  filePath: string
): ParsedDocument {
  const lines = content.split('\n')

  // Extract frontmatter
  const frontmatter = extractFrontmatter(content)

  // Determine document category
  const category = inferDocumentCategory(filePath, frontmatter, content)

  // Parse heading structure
  const sections = parseSections(lines)

  // Extract code blocks
  const codeBlocks = extractCodeBlocks(lines, sections)

  // Detect cross-references
  const crossReferences = detectCrossReferences(lines, sections)

  // Generate tags
  const tags = generateTags(content, frontmatter, sections, codeBlocks)

  // Determine title
  const title = determineTitle(frontmatter, sections, filePath)

  return {
    path: filePath,
    title,
    category,
    frontmatter,
    sections,
    codeBlocks,
    crossReferences,
    tags,
    lastModified: new Date(),
  }
}

/**
 * Extract YAML frontmatter from markdown
 */
function extractFrontmatter(content: string): Record<string, unknown> {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/
  const match = content.match(frontmatterRegex)

  if (!match) return {}

  try {
    const yaml = match[1]
    // Simple YAML parser (production would use a library like js-yaml)
    const result: Record<string, unknown> = {}

    const yamlLines = yaml.split('\n')
    for (const line of yamlLines) {
      const colonIndex = line.indexOf(':')
      if (colonIndex === -1) continue

      const key = line.slice(0, colonIndex).trim()
      let value: string | string[] = line.slice(colonIndex + 1).trim()

      // Handle quoted strings
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1)
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1)
      }

      // Handle arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value
          .slice(1, -1)
          .split(',')
          .map(v => v.trim().replace(/['"]/g, ''))
      }

      result[key] = value
    }

    return result
  } catch (error) {
    console.error('Error parsing frontmatter:', error)
    return {}
  }
}

/**
 * Infer document category from path and content
 */
function inferDocumentCategory(
  filePath: string,
  frontmatter: Record<string, unknown>,
  content: string
): DocumentCategory {
  // Check frontmatter first
  if (frontmatter.category) {
    return frontmatter.category as DocumentCategory
  }

  const pathLower = filePath.toLowerCase()

  // Path-based inference
  if (pathLower.includes('/components/')) return 'component'
  if (pathLower.includes('/hooks/')) return 'hook'
  if (pathLower.includes('/guides/')) return 'guide'
  if (pathLower.includes('/cookbook/')) return 'cookbook'
  if (pathLower.includes('/examples/')) return 'example'
  if (pathLower.includes('/concepts/')) return 'concept'
  if (pathLower.includes('/api/')) return 'api'
  if (pathLower.includes('changelog')) return 'changelog'
  if (pathLower.includes('readme')) return 'readme'

  // Content-based inference
  const contentLower = content.toLowerCase()
  if (contentLower.includes('## props') || contentLower.includes('## api')) {
    return 'component'
  }
  if (contentLower.includes('usehook') || contentLower.includes('use hook')) {
    return 'hook'
  }
  if (contentLower.includes('## example') || contentLower.includes('## usage')) {
    return 'example'
  }

  return 'concept' // Default
}

/**
 * Parse markdown into hierarchical sections
 */
function parseSections(lines: string[]): DocumentSection[] {
  const sections: DocumentSection[] = []
  const headingStack: Array<{ level: number; section: DocumentSection }> = []

  let currentSection: DocumentSection | null = null
  let currentContent: string[] = []
  let inCodeBlock = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Track code blocks to avoid treating them as headings
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      currentContent.push(line)
      continue
    }

    if (inCodeBlock) {
      currentContent.push(line)
      continue
    }

    // Check for heading (ATX style: # Heading)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)

    if (headingMatch) {
      // Save previous section
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim()
        currentSection.endLine = i - 1
      }

      // Create new section
      const level = headingMatch[1].length
      const heading = headingMatch[2].trim()
      const id = generateSectionId(heading, i)

      const section: DocumentSection = {
        id,
        heading,
        level,
        content: '',
        childIds: [],
        codeBlockIds: [],
        crossReferenceIds: [],
        startLine: i,
        endLine: i,
      }

      // Establish parent-child relationships
      while (headingStack.length > 0) {
        const top = headingStack[headingStack.length - 1]
        if (top.level < level) {
          // Found parent
          section.parentId = top.section.id
          top.section.childIds.push(id)
          break
        }
        // Pop sections at same or deeper level
        headingStack.pop()
      }

      headingStack.push({ level, section })
      sections.push(section)
      currentSection = section
      currentContent = []
    } else {
      currentContent.push(line)
    }
  }

  // Save last section
  if (currentSection) {
    currentSection.content = currentContent.join('\n').trim()
    currentSection.endLine = lines.length - 1
  }

  return sections
}

/**
 * Generate a unique section ID
 */
function generateSectionId(heading: string, lineNumber: number): string {
  const slug = heading
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')

  return `section-${slug}-${lineNumber}`
}

/**
 * Extract all code blocks with metadata
 */
function extractCodeBlocks(
  lines: string[],
  sections: DocumentSection[]
): CodeBlock[] {
  const codeBlocks: CodeBlock[] = []
  let inCodeBlock = false
  let currentCode: string[] = []
  let currentLanguage = ''
  let currentCaption = ''
  let codeStartLine = 0
  let currentSectionId = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Find current section
    if (!inCodeBlock) {
      const section = sections.find(
        s => i >= s.startLine && i <= s.endLine
      )
      currentSectionId = section?.id || ''
    }

    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        // Start of code block
        inCodeBlock = true
        currentLanguage = line.trim().slice(3).trim() || 'text'
        currentCode = []
        codeStartLine = i

        // Check for caption in previous line
        if (i > 0 && lines[i - 1].trim()) {
          const prevLine = lines[i - 1].trim()
          if (prevLine.startsWith('**') || prevLine.startsWith('_')) {
            currentCaption = prevLine.replace(/[*_]/g, '')
          }
        }
      } else {
        // End of code block
        inCodeBlock = false

        const code = currentCode.join('\n')
        const id = `code-${codeStartLine}`
        const keywords = extractCodeKeywords(code, currentLanguage)
        const isExecutable = isValidCode(code, currentLanguage)

        const codeBlock: CodeBlock = {
          id,
          language: currentLanguage,
          code,
          caption: currentCaption || undefined,
          sectionId: currentSectionId,
          keywords,
          lineNumber: codeStartLine,
          isExecutable,
        }

        codeBlocks.push(codeBlock)

        // Add reference to section
        const section = sections.find(s => s.id === currentSectionId)
        if (section) {
          section.codeBlockIds.push(id)
        }

        currentCaption = ''
      }
    } else if (inCodeBlock) {
      currentCode.push(line)
    }
  }

  return codeBlocks
}

/**
 * Extract keywords from code based on language
 */
function extractCodeKeywords(code: string, language: string): string[] {
  const keywords = new Set<string>()

  // Common patterns across languages
  const patterns = [
    // Function/method names
    /\bfunction\s+(\w+)/g,
    /\bconst\s+(\w+)\s*=/g,
    /\blet\s+(\w+)\s*=/g,
    /\bvar\s+(\w+)\s*=/g,

    // React hooks
    /\b(use[A-Z]\w+)/g,

    // Component names (PascalCase)
    /<([A-Z]\w+)/g,

    // Import names
    /import\s+(?:{([^}]+)}|\w+)\s+from/g,

    // Class names
    /\bclass\s+(\w+)/g,

    // Type names
    /\btype\s+(\w+)/g,
    /\binterface\s+(\w+)/g,
  ]

  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(code)) !== null) {
      if (match[1]) {
        keywords.add(match[1])
      }
    }
  }

  // Language-specific keywords
  if (language === 'typescript' || language === 'javascript' || language === 'tsx' || language === 'jsx') {
    const jsKeywords = code.match(/\b(async|await|Promise|useState|useEffect|useCallback|useMemo)\b/g)
    if (jsKeywords) {
      jsKeywords.forEach(k => keywords.add(k))
    }
  }

  return Array.from(keywords)
}

/**
 * Check if code appears to be valid and executable
 */
function isValidCode(code: string, language: string): boolean {
  if (!code.trim()) return false

  // Check for common patterns that indicate complete examples
  const hasImports = /^import\s+/m.test(code)
  const hasExports = /^export\s+/m.test(code)
  const hasFunction = /\b(function|const|class)\s+\w+/m.test(code)

  // TypeScript/JavaScript specific checks
  if (language === 'typescript' || language === 'javascript' || language === 'tsx' || language === 'jsx') {
    // Look for complete component/function definitions
    const hasCompleteFunction = /^(export\s+)?(const|function)\s+\w+.*{[\s\S]*}$/m.test(code)
    if (hasCompleteFunction) return true

    // Check for balanced braces
    const openBraces = (code.match(/{/g) || []).length
    const closeBraces = (code.match(/}/g) || []).length
    if (openBraces !== closeBraces) return false
  }

  return hasImports || hasExports || hasFunction
}

/**
 * Detect cross-references in the document
 */
function detectCrossReferences(
  lines: string[],
  sections: DocumentSection[]
): CrossReference[] {
  const references: CrossReference[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNumber = i

    // Find current section
    const section = sections.find(s => i >= s.startLine && i <= s.endLine)
    const sectionId = section?.id || ''

    // Markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    let match
    while ((match = linkRegex.exec(line)) !== null) {
      const text = match[1]
      const target = match[2]
      const isExternal = target.startsWith('http://') || target.startsWith('https://')

      references.push({
        id: `ref-${lineNumber}-${match.index}`,
        type: isExternal ? 'external-link' : 'internal-link',
        text,
        target,
        sectionId,
        context: extractContext(lines, i, 50),
        lineNumber,
      })
    }

    // Component references: <ComponentName />
    const componentRegex = /<([A-Z]\w+)\s*(?:\/>|>)/g
    while ((match = componentRegex.exec(line)) !== null) {
      const componentName = match[1]
      references.push({
        id: `comp-${lineNumber}-${match.index}`,
        type: 'component-ref',
        text: componentName,
        target: componentName,
        sectionId,
        context: extractContext(lines, i, 50),
        lineNumber,
      })
    }

    // Hook references: useHookName()
    const hookRegex = /\b(use[A-Z]\w+)\(/g
    while ((match = hookRegex.exec(line)) !== null) {
      const hookName = match[1]
      references.push({
        id: `hook-${lineNumber}-${match.index}`,
        type: 'hook-ref',
        text: hookName,
        target: hookName,
        sectionId,
        context: extractContext(lines, i, 50),
        lineNumber,
      })
    }

    // Import references: import { X } from 'Y'
    const importRegex = /import\s+(?:{([^}]+)}|(\w+))\s+from\s+['"]([^'"]+)['"]/g
    while ((match = importRegex.exec(line)) !== null) {
      const imports = match[1] || match[2]
      const from = match[3]
      references.push({
        id: `import-${lineNumber}-${match.index}`,
        type: 'import-ref',
        text: imports,
        target: from,
        sectionId,
        context: extractContext(lines, i, 50),
        lineNumber,
      })
    }

    // "See also:" references
    const seeAlsoRegex = /see\s+also:?\s+([^\n.]+)/i
    if ((match = seeAlsoRegex.exec(line)) !== null) {
      const referenceText = match[1].trim()
      references.push({
        id: `see-also-${lineNumber}`,
        type: 'see-also',
        text: referenceText,
        target: referenceText,
        sectionId,
        context: extractContext(lines, i, 50),
        lineNumber,
      })
    }
  }

  // Add references to sections
  for (const ref of references) {
    const section = sections.find(s => s.id === ref.sectionId)
    if (section) {
      section.crossReferenceIds.push(ref.id)
    }
  }

  return references
}

/**
 * Extract context around a line
 */
function extractContext(lines: string[], lineIndex: number, maxLength: number): string {
  const start = Math.max(0, lineIndex - 1)
  const end = Math.min(lines.length, lineIndex + 2)
  const context = lines.slice(start, end).join(' ')

  if (context.length <= maxLength) return context

  return context.slice(0, maxLength - 3) + '...'
}

/**
 * Generate tags from document content
 */
function generateTags(
  content: string,
  frontmatter: Record<string, unknown>,
  sections: DocumentSection[],
  codeBlocks: CodeBlock[]
): string[] {
  const tags = new Set<string>()

  // Tags from frontmatter
  if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
    frontmatter.tags.forEach(tag => tags.add(String(tag)))
  }

  // Extract keywords from headings
  for (const section of sections) {
    const words = section.heading
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3)
    words.forEach(w => tags.add(w))
  }

  // Extract from code blocks
  for (const block of codeBlocks) {
    tags.add(block.language)
    block.keywords.forEach(k => tags.add(k.toLowerCase()))
  }

  // Common technical terms
  const technicalTerms = [
    'react', 'typescript', 'javascript', 'component', 'hook',
    'api', 'props', 'state', 'effect', 'async', 'promise',
    'authentication', 'authorization', 'rag', 'ai', 'llm',
    'streaming', 'chat', 'message', 'conversation',
  ]

  const contentLower = content.toLowerCase()
  for (const term of technicalTerms) {
    if (contentLower.includes(term)) {
      tags.add(term)
    }
  }

  return Array.from(tags).slice(0, 20) // Limit to top 20 tags
}

/**
 * Determine document title
 */
function determineTitle(
  frontmatter: Record<string, unknown>,
  sections: DocumentSection[],
  filePath: string
): string {
  // Check frontmatter
  if (frontmatter.title) {
    return String(frontmatter.title)
  }

  // Use first H1 heading
  const firstH1 = sections.find(s => s.level === 1)
  if (firstH1) {
    return firstH1.heading
  }

  // Use filename
  const filename = filePath.split('/').pop() || 'Untitled'
  return filename.replace(/\.(md|mdx)$/, '').replace(/-/g, ' ')
}
