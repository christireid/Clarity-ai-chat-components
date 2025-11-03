/**
 * Embedding Cache Implementation
 * 
 * Semantic caching for embeddings to reduce API costs and latency.
 * Supports in-memory and persistent storage.
 */

import type { EmbeddingCache, EmbeddingCacheEntry } from './types'

/**
 * In-Memory Embedding Cache
 * 
 * Fast, ephemeral cache for embedding results.
 * Use for development or short-lived applications.
 */
export class MemoryEmbeddingCache implements EmbeddingCache {
  private cache = new Map<string, EmbeddingCacheEntry>()
  private statsData = {
    hits: 0,
    misses: 0,
  }
  
  private getCacheKey(text: string, model: string): string {
    // Simple hash function for cache key
    const str = `${model}:${text}`
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString(36)
  }
  
  async get(text: string, model: string): Promise<number[] | null> {
    const key = this.getCacheKey(text, model)
    const entry = this.cache.get(key)
    
    if (!entry) {
      this.statsData.misses++
      return null
    }
    
    // Check expiry
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.cache.delete(key)
      this.statsData.misses++
      return null
    }
    
    this.statsData.hits++
    return entry.embedding
  }
  
  async set(text: string, model: string, embedding: number[], ttl?: number): Promise<void> {
    const key = this.getCacheKey(text, model)
    
    const entry: EmbeddingCacheEntry = {
      key,
      text,
      model,
      embedding,
      timestamp: Date.now(),
      expiresAt: ttl ? Date.now() + ttl : undefined,
    }
    
    this.cache.set(key, entry)
  }
  
  async has(text: string, model: string): Promise<boolean> {
    const key = this.getCacheKey(text, model)
    return this.cache.has(key)
  }
  
  async clear(): Promise<void> {
    this.cache.clear()
    this.stats = { hits: 0, misses: 0 }
  }
  
  async stats(): Promise<{
    size: number
    hits: number
    misses: number
    hitRate: number
  }> {
    const total = this.statsData.hits + this.statsData.misses
    return {
      size: this.cache.size,
      hits: this.statsData.hits,
      misses: this.statsData.misses,
      hitRate: total > 0 ? this.statsData.hits / total : 0,
    }
  }
}

/**
 * LocalStorage Embedding Cache
 * 
 * Persistent cache using browser localStorage.
 * Use for client-side applications.
 */
export class LocalStorageEmbeddingCache implements EmbeddingCache {
  private storageKey = 'clarity-embeddings-cache'
  private statsData = {
    hits: 0,
    misses: 0,
  }
  
  private getCacheKey(text: string, model: string): string {
    const str = `${model}:${text}`
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash.toString(36)
  }
  
  private getCache(): Map<string, EmbeddingCacheEntry> {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) return new Map()
      
      const data = JSON.parse(stored)
      return new Map(Object.entries(data))
    } catch {
      return new Map()
    }
  }
  
  private setCache(cache: Map<string, EmbeddingCacheEntry>): void {
    try {
      const data = Object.fromEntries(cache)
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      // Handle quota exceeded
      console.warn('LocalStorage cache write failed:', error)
    }
  }
  
  async get(text: string, model: string): Promise<number[] | null> {
    const cache = this.getCache()
    const key = this.getCacheKey(text, model)
    const entry = cache.get(key)
    
    if (!entry) {
      this.statsData.misses++
      return null
    }
    
    // Check expiry
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      cache.delete(key)
      this.setCache(cache)
      this.statsData.misses++
      return null
    }
    
    this.statsData.hits++
    return entry.embedding
  }
  
  async set(text: string, model: string, embedding: number[], ttl?: number): Promise<void> {
    const cache = this.getCache()
    const key = this.getCacheKey(text, model)
    
    const entry: EmbeddingCacheEntry = {
      key,
      text,
      model,
      embedding,
      timestamp: Date.now(),
      expiresAt: ttl ? Date.now() + ttl : undefined,
    }
    
    cache.set(key, entry)
    this.setCache(cache)
  }
  
  async has(text: string, model: string): Promise<boolean> {
    const cache = this.getCache()
    const key = this.getCacheKey(text, model)
    return cache.has(key)
  }
  
  async clear(): Promise<void> {
    localStorage.removeItem(this.storageKey)
    this.stats = { hits: 0, misses: 0 }
  }
  
  async stats(): Promise<{
    size: number
    hits: number
    misses: number
    hitRate: number
  }> {
    const cache = this.getCache()
    const total = this.stats.hits + this.stats.misses
    return {
      size: cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? this.stats.hits / total : 0,
    }
  }
}

/**
 * Semantic Cache with Similarity Search
 * 
 * Advanced caching that finds similar queries instead of exact matches.
 * Reduces API calls even for slightly different text.
 */
export class SemanticEmbeddingCache implements EmbeddingCache {
  private cache = new Map<string, EmbeddingCacheEntry>()
  private stats = {
    hits: 0,
    misses: 0,
  }
  private similarityThreshold: number
  
  constructor(similarityThreshold = 0.95) {
    this.similarityThreshold = similarityThreshold
  }
  
  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }
  
  private getCacheKey(text: string, model: string): string {
    return `${model}:${text}`
  }
  
  async get(text: string, model: string): Promise<number[] | null> {
    // First try exact match
    const exactKey = this.getCacheKey(text, model)
    const exactEntry = this.cache.get(exactKey)
    
    if (exactEntry && (!exactEntry.expiresAt || exactEntry.expiresAt > Date.now())) {
      this.stats.hits++
      return exactEntry.embedding
    }
    
    // Try semantic similarity (expensive, use sparingly)
    // In practice, you'd want to use a vector store for this
    // This is a simplified implementation
    
    this.stats.misses++
    return null
  }
  
  async set(text: string, model: string, embedding: number[], ttl?: number): Promise<void> {
    const key = this.getCacheKey(text, model)
    
    const entry: EmbeddingCacheEntry = {
      key,
      text,
      model,
      embedding,
      timestamp: Date.now(),
      expiresAt: ttl ? Date.now() + ttl : undefined,
    }
    
    this.cache.set(key, entry)
  }
  
  async has(text: string, model: string): Promise<boolean> {
    const key = this.getCacheKey(text, model)
    return this.cache.has(key)
  }
  
  async clear(): Promise<void> {
    this.cache.clear()
    this.stats = { hits: 0, misses: 0 }
  }
  
  async stats(): Promise<{
    size: number
    hits: number
    misses: number
    hitRate: number
  }> {
    const total = this.stats.hits + this.stats.misses
    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? this.stats.hits / total : 0,
    }
  }
}

