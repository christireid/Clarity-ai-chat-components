/**
 * Text Splitter
 * 
 * Flexible text chunking with overlap and sentence preservation.
 * Works with any text, no external dependencies.
 */

import type { Document, DocumentChunk, ChunkingOptions, TextSplitter as ITextSplitter } from './types'

export class RecursiveTextSplitter implements ITextSplitter {
  private defaultOptions: ChunkingOptions = {
    chunkSize: 1000,
    chunkOverlap: 200,
    splitBySentence: true,
    separators: ['\n\n', '\n', '. ', '! ', '? ', '; ', ', ', ' '],
    keepSeparator: false,
  }
  
  split(text: string, options?: Partial<ChunkingOptions>): DocumentChunk[] {
    const opts = { ...this.defaultOptions, ...options }
    const chunks: DocumentChunk[] = []
    
    let currentChunks = [text]
    
    // Try each separator in order
    for (const separator of opts.separators!) {
      const nextChunks: string[] = []
      
      for (const chunk of currentChunks) {
        if (this.getLength(chunk, opts) <= opts.chunkSize) {
          nextChunks.push(chunk)
        } else {
          // Split by this separator
          const split = chunk.split(separator)
          for (let i = 0; i < split.length; i++) {
            const part = split[i]
            if (opts.keepSeparator && i < split.length - 1) {
              nextChunks.push(part + separator)
            } else {
              nextChunks.push(part)
            }
          }
        }
      }
      
      currentChunks = nextChunks
    }
    
    // Merge small chunks
    const mergedChunks = this.mergeChunks(currentChunks, opts)
    
    // Create DocumentChunk objects
    let position = 0
    for (let i = 0; i < mergedChunks.length; i++) {
      const content = mergedChunks[i]
      const start = position
      const end = position + content.length
      
      chunks.push({
        id: `chunk-${i}`,
        content,
        index: i,
        start,
        end,
        metadata: {
          chunkIndex: i,
          totalChunks: mergedChunks.length,
        },
      })
      
      position = end
    }
    
    return chunks
  }
  
  splitDocuments(documents: Document[], options?: Partial<ChunkingOptions>): DocumentChunk[] {
    const allChunks: DocumentChunk[] = []
    
    for (const doc of documents) {
      const chunks = this.split(doc.content, options)
      
      // Add document metadata to chunks
      for (const chunk of chunks) {
        chunk.documentId = doc.metadata.source || 'unknown'
        chunk.metadata = {
          ...chunk.metadata,
          ...doc.metadata,
        }
        allChunks.push(chunk)
      }
    }
    
    return allChunks
  }
  
  private mergeChunks(chunks: string[], options: ChunkingOptions): string[] {
    const merged: string[] = []
    let current = ''
    
    for (const chunk of chunks) {
      if (!chunk.trim()) continue
      
      const testMerge = current ? current + chunk : chunk
      
      if (this.getLength(testMerge, options) <= options.chunkSize) {
        current = testMerge
      } else {
        if (current) {
          merged.push(current)
        }
        current = chunk
      }
    }
    
    if (current) {
      merged.push(current)
    }
    
    // Add overlap
    if (options.chunkOverlap && options.chunkOverlap > 0) {
      return this.addOverlap(merged, options.chunkOverlap, options)
    }
    
    return merged
  }
  
  private addOverlap(chunks: string[], overlapSize: number, options: ChunkingOptions): string[] {
    const withOverlap: string[] = []
    
    for (let i = 0; i < chunks.length; i++) {
      let chunk = chunks[i]
      
      // Add overlap from previous chunk
      if (i > 0) {
        const prevChunk = chunks[i - 1]
        const overlapText = this.getLastNChars(prevChunk, overlapSize, options)
        chunk = overlapText + chunk
      }
      
      withOverlap.push(chunk)
    }
    
    return withOverlap
  }
  
  private getLastNChars(text: string, n: number, options: ChunkingOptions): string {
    if (options.tokenizer) {
      const tokens = options.tokenizer(text)
      const lastN = tokens.slice(-n)
      return lastN.join('')
    }
    
    return text.slice(-n)
  }
  
  private getLength(text: string, options: ChunkingOptions): number {
    if (options.tokenizer) {
      return options.tokenizer(text).length
    }
    return text.length
  }
}

/**
 * Character-based text splitter (simple)
 */
export class CharacterTextSplitter implements ITextSplitter {
  split(text: string, options?: Partial<ChunkingOptions>): DocumentChunk[] {
    const chunkSize = options?.chunkSize || 1000
    const chunkOverlap = options?.chunkOverlap || 0
    const chunks: DocumentChunk[] = []
    
    let start = 0
    let index = 0
    
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length)
      const content = text.slice(start, end)
      
      chunks.push({
        id: `chunk-${index}`,
        content,
        index,
        start,
        end,
        metadata: {},
      })
      
      start = end - chunkOverlap
      index++
    }
    
    return chunks
  }
  
  splitDocuments(documents: Document[], options?: Partial<ChunkingOptions>): DocumentChunk[] {
    return documents.flatMap(doc => this.split(doc.content, options))
  }
}

/**
 * Token-based text splitter
 */
export class TokenTextSplitter implements ITextSplitter {
  private tokenizer: (text: string) => string[]
  
  constructor(tokenizer: (text: string) => string[]) {
    this.tokenizer = tokenizer
  }
  
  split(text: string, options?: Partial<ChunkingOptions>): DocumentChunk[] {
    const chunkSize = options?.chunkSize || 1000
    const chunkOverlap = options?.chunkOverlap || 0
    
    const tokens = this.tokenizer(text)
    const chunks: DocumentChunk[] = []
    
    let start = 0
    let index = 0
    
    while (start < tokens.length) {
      const end = Math.min(start + chunkSize, tokens.length)
      const chunkTokens = tokens.slice(start, end)
      const content = chunkTokens.join('')
      
      chunks.push({
        id: `chunk-${index}`,
        content,
        index,
        start,
        end: start + chunkTokens.length,
        metadata: {
          tokens: chunkTokens.length,
        },
      })
      
      start = end - chunkOverlap
      index++
    }
    
    return chunks
  }
  
  splitDocuments(documents: Document[], options?: Partial<ChunkingOptions>): DocumentChunk[] {
    return documents.flatMap(doc => this.split(doc.content, options))
  }
}

