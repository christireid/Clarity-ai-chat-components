/**
 * Vector Store Implementation
 *
 * Wraps the underlying vector database (Voy/Orama) to provide
 * a consistent interface for the RAG pipeline.
 */

export interface Document {
  id: string
  content: string
  metadata: Record<string, any>
}

export interface SearchResult extends Document {
  score: number
}

export interface VectorStore {
  addDocuments(documents: Document[]): Promise<void>
  search(query: string, k?: number): Promise<SearchResult[]>
  clear(): Promise<void>
}

/**
 * In-Memory Vector Store (Fallback/Dev)
 * Uses simple cosine similarity without WASM for portability in this environment.
 * In production, this would initialize Voy.
 */
export class InMemoryVectorStore implements VectorStore {
  private documents: Document[] = []
  private embeddings: Float32Array[] = []

  // Placeholder for embedding function - passed in constructor in real app
  private async embed(text: string): Promise<Float32Array> {
    // Mock embedding: deterministic hash-based vector for demo purposes
    const vec = new Float32Array(384) // Standard size
    for (let i = 0; i < text.length; i++) {
      vec[i % 384] += text.charCodeAt(i)
    }
    return vec
  }

  async addDocuments(documents: Document[]): Promise<void> {
    for (const doc of documents) {
      const embedding = await this.embed(doc.content)
      this.documents.push(doc)
      this.embeddings.push(embedding)
    }
  }

  async search(query: string, k: number = 5): Promise<SearchResult[]> {
    const queryEmbedding = await this.embed(query)

    const scores = this.embeddings.map((emb, idx) => ({
      index: idx,
      score: this.cosineSimilarity(queryEmbedding, emb),
    }))

    scores.sort((a, b) => b.score - a.score)

    return scores.slice(0, k).map((s) => ({
      ...this.documents[s.index],
      score: s.score,
    }))
  }

  async clear(): Promise<void> {
    this.documents = []
    this.embeddings = []
  }

  private cosineSimilarity(a: Float32Array, b: Float32Array): number {
    let dot = 0
    let normA = 0
    let normB = 0
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB))
  }
}
