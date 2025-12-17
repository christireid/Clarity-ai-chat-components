// Semantic Synonym Map for Aura Search
// Maps common user terms to documentation terminology
import synonymData from './synonyms.json';

export const SYNONYM_MAP: Record<string, string[]> = synonymData;

export interface KnowledgeBaseChunk {
  title: string
  content: string
  sourcePath?: string
}

export interface KnowledgeBase {
  chunks: KnowledgeBaseChunk[]
  documents?: KnowledgeBaseChunk[] // Fallback support
  lastUpdated?: string
}
