import type { ComponentDoc } from '@/components/doc-panel'
import { slugify } from '@/lib/slugify'

export interface SearchEntry {
  name: string
  section: string
  category: string
  href: string
  description: string
  importPath: string
  type: 'component' | 'hook' | 'primitive'
  hasSource: boolean
}

// Map doc file names to their page routes and display names
const docCategories: Array<{
  file: string
  route: string
  label: string
}> = [
  { file: 'ai-reasoning-docs', route: '/ai-reasoning', label: 'AI Reasoning' },
  { file: 'chat-docs', route: '/chat', label: 'Chat' },
  { file: 'citations-docs', route: '/citations', label: 'Citations' },
  { file: 'clones-docs', route: '/clones', label: 'AI Clones' },
  { file: 'code-data-docs', route: '/code-data', label: 'Code & Data' },
  { file: 'core-chat-docs', route: '/core-chat', label: 'Core Chat' },
  { file: 'dashboards-docs', route: '/dashboards', label: 'Dashboards' },
  { file: 'features-docs', route: '/features', label: 'Features' },
  {
    file: 'feedback-status-docs',
    route: '/feedback-status',
    label: 'Feedback & Status',
  },
  { file: 'hooks-docs', route: '/hooks', label: 'Hooks' },
  { file: 'input-docs', route: '/input', label: 'Input' },
  {
    file: 'loading-states-docs',
    route: '/loading-states',
    label: 'Loading States',
  },
  { file: 'media-files-docs', route: '/media-files', label: 'Media Files' },
  { file: 'messages-docs', route: '/messages', label: 'Messages' },
  { file: 'navigation-docs', route: '/navigation', label: 'Navigation' },
  { file: 'primitives-docs', route: '/primitives', label: 'Primitives' },
  { file: 'search-docs', route: '/search', label: 'Search' },
  { file: 'suggestions-docs', route: '/suggestions', label: 'Suggestions' },
  { file: 'theme-docs', route: '/theme', label: 'Theme' },
  {
    file: 'token-management-docs',
    route: '/token-management',
    label: 'Token Management',
  },
  { file: 'tools-docs', route: '/tools', label: 'Tools' },
]

function classifyType(name: string): SearchEntry['type'] {
  if (name.startsWith('use')) return 'hook'
  if (/^[a-z]/.test(name)) return 'hook'
  return 'component'
}

function toDocArray(docs: ComponentDoc | ComponentDoc[]): ComponentDoc[] {
  return Array.isArray(docs) ? docs : [docs]
}

let cachedIndex: SearchEntry[] | null = null

// Lazy loaders: doc files are only imported when search is first opened
const docLoaders = import.meta.glob<
  Record<string, Record<string, ComponentDoc | ComponentDoc[]>>
>('../data/docs/*-docs.ts')

async function loadCategory(
  cat: (typeof docCategories)[number]
): Promise<SearchEntry[]> {
  const modulePath = `../data/docs/${cat.file}.ts`
  const loader = docLoaders[modulePath]
  if (!loader) return []

  const mod = await loader()
  const exportKey = Object.keys(mod).find((k) => k.endsWith('Docs'))
  if (!exportKey) return []

  const record = mod[exportKey] as Record<string, ComponentDoc | ComponentDoc[]>
  const entries: SearchEntry[] = []

  for (const [section, docs] of Object.entries(record)) {
    for (const doc of toDocArray(docs)) {
      entries.push({
        name: doc.name,
        section,
        category: cat.label,
        href: `${cat.route}#${slugify(section)}`,
        description: doc.description,
        importPath: doc.importPath,
        type:
          cat.route === '/primitives' ? 'primitive' : classifyType(doc.name),
        hasSource: !!doc.sourceFile,
      })
    }
  }

  return entries
}

export async function buildSearchIndex(): Promise<SearchEntry[]> {
  if (cachedIndex) return cachedIndex

  // Load all 21 doc modules in parallel for fast Cmd+K response
  const results = await Promise.allSettled(
    docCategories.map((cat) => loadCategory(cat))
  )

  const entries: SearchEntry[] = []
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      entries.push(...result.value)
    } else {
      console.warn(
        `[SearchIndex] Failed to load ${docCategories[i].file}, skipping:`,
        result.reason
      )
    }
  })

  cachedIndex = entries
  return entries
}
