/**
 * TypeScript Documentation Parser
 * Extracts component documentation from TypeScript files
 */

export interface PropDefinition {
  name: string
  type: string
  required: boolean
  defaultValue?: string
  description?: string
}

export interface ComponentDocs {
  name: string
  description?: string
  props: PropDefinition[]
  examples: CodeExample[]
  bestPractices: string[]
  troubleshooting: TroubleshootingItem[]
  relatedComponents: string[]
  category?: string
  tags?: string[]
}

export interface CodeExample {
  title: string
  code: string
  description?: string
  language?: string
}

export interface TroubleshootingItem {
  problem: string
  solution: string
  code?: string
}

export interface SearchIndex {
  componentName: string
  content: string
  category: string
  tags: string[]
}

/**
 * Parse TypeScript interface to extract prop definitions
 */
export function parseTypeScriptInterface(interfaceCode: string): PropDefinition[] {
  const props: PropDefinition[] = []

  // Match prop definitions: propName?: type; // description
  const propRegex = /(\w+)(\??):\s*([^;]+);(?:\s*\/\/\s*(.*))?/g

  let match
  while ((match = propRegex.exec(interfaceCode)) !== null) {
    const [, name, optional, type, description] = match
    props.push({
      name,
      type: type.trim(),
      required: !optional,
      description: description?.trim(),
    })
  }

  return props
}

/**
 * Generate search index for documentation
 */
export function buildSearchIndex(docs: ComponentDocs[]): SearchIndex[] {
  return docs.map((doc) => ({
    componentName: doc.name,
    content: [
      doc.name,
      doc.description || '',
      ...doc.props.map((p) => `${p.name} ${p.type} ${p.description || ''}`),
      ...doc.examples.map((e) => `${e.title} ${e.description || ''}`),
      ...doc.bestPractices,
      ...doc.troubleshooting.map((t) => `${t.problem} ${t.solution}`),
    ].join(' '),
    category: doc.category || 'general',
    tags: doc.tags || [],
  }))
}

/**
 * Search documentation
 */
export function searchDocs(
  index: SearchIndex[],
  query: string
): SearchIndex[] {
  const lowerQuery = query.toLowerCase()

  return index
    .filter((item) => item.content.toLowerCase().includes(lowerQuery))
    .sort((a, b) => {
      // Prioritize exact name matches
      const aNameMatch = a.componentName.toLowerCase().includes(lowerQuery)
      const bNameMatch = b.componentName.toLowerCase().includes(lowerQuery)

      if (aNameMatch && !bNameMatch) return -1
      if (!aNameMatch && bNameMatch) return 1

      return 0
    })
}

/**
 * Format type for display
 */
export function formatType(type: string): string {
  // Simplify complex types for readability
  return type
    .replace(/React\.ReactNode/g, 'ReactNode')
    .replace(/React\.FC/g, 'Component')
    .replace(/\s+/g, ' ')
    .trim()
}
