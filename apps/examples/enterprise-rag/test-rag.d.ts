declare function chunkText(
  text: any,
  chunkSize?: number,
  overlap?: number
): {
  id: string
  text: any
  wordCount: number
  startWord: number
  endWord: number
}[]
declare const text: '\nThis is a test document for RAG chunking.\nIt contains multiple sentences to test the chunking algorithm.\nEach chunk should be around 500 tokens with 50 token overlap.\nThis helps ensure relevant context is maintained across chunks.\nThe search algorithm will find the most relevant chunks for queries.\n'
declare const chunks: {
  id: string
  text: any
  wordCount: number
  startWord: number
  endWord: number
}[]
//# sourceMappingURL=test-rag.d.ts.map
