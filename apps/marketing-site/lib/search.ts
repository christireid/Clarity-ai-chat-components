import fs from 'fs'
import path from 'path'
import { SYNONYM_MAP, KnowledgeBase } from './search-config'

// -----------------------------------------------------------------------------
// KNOWLEDGE BASE LOADING
// -----------------------------------------------------------------------------

// Global cache to prevent reloading 3MB JSON on every request in serverless
let knowledgeBaseCache: KnowledgeBase | null = null

export function getKnowledgeBase(): KnowledgeBase | null {
  if (knowledgeBaseCache) {
    return knowledgeBaseCache
  }

  // Robust path resolution for Vercel vs Local Monorepo
  const potentialPaths = [
    path.join(process.cwd(), 'lib', 'aura-knowledge.json'), // Vercel / Next.js output
    path.join(process.cwd(), 'apps', 'marketing-site', 'lib', 'aura-knowledge.json'), // Monorepo root
    path.join(process.cwd(), 'aura-knowledge.json'), // Root fallback
  ]

  for (const p of potentialPaths) {
    if (fs.existsSync(p)) {
      try {
        const fileContent = fs.readFileSync(p, 'utf-8')
        knowledgeBaseCache = JSON.parse(fileContent) as KnowledgeBase
        console.log(`[Aura] Loaded KB from: ${p} (${knowledgeBaseCache.chunks.length} chunks)`)
        return knowledgeBaseCache
      } catch (error) {
        console.error(`[Aura] Failed to parse KB at ${p}:`, error)
      }
    }
  }

  console.error('[Aura] CRITICAL: Could not find aura-knowledge.json in any checked path.')
  return null
}

// -----------------------------------------------------------------------------
// CONTEXT RETRIEVAL
// -----------------------------------------------------------------------------

export function retrieveContext(query: string, kb: KnowledgeBase): string {
  if (!query) return ''

  const terms = query.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(t => t.length > 2)
  if (terms.length === 0) return ''

  // Expansion
  const expandedTerms = new Set<string>(terms)
  terms.forEach(term => {
    if (SYNONYM_MAP[term]) {
      SYNONYM_MAP[term].forEach(syn => expandedTerms.add(syn))
    }
  })

  // Scoring
  const scoredChunks = kb.chunks.map(chunk => {
    let score = 0
    const titleLower = chunk.title.toLowerCase()
    const contentLower = chunk.content.toLowerCase()

    expandedTerms.forEach(term => {
      if (titleLower.includes(term)) score += 10 // Huge boost for title match
      const contentMatches = (contentLower.match(new RegExp(term, 'g')) || []).length
      score += contentMatches
    })

    // Penalize very short chunks that are likely noise
    if (chunk.content.length < 50) score *= 0.5

    return { ...chunk, score }
  })

  // Sort & Select
  const topChunks = scoredChunks
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  // Format with Attribution
  return topChunks
    .map(chunk => `[Source: ${chunk.title}]\n${chunk.content.slice(0, 1200)}...`) // Truncate to save tokens
    .join('\n\n')
}
