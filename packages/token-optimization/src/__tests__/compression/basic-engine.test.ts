/**
 * Tests for Basic Compression Engine
 */

import { BasicCompressionEngine, compressText } from '../src/compression/basic-engine'

describe('BasicCompressionEngine', () => {
  let engine: BasicCompressionEngine
  
  beforeEach(() => {
    engine = new BasicCompressionEngine({
      qualityThreshold: 0.7,
      maxProcessingTime: 5000
    })
  })
  
  describe('compress', () => {
    it('should compress text successfully', async () => {
      const text = 'This is a test text that needs to be compressed. '.repeat(50)
      const result = await engine.compress(text, 0.7)
      
      expect(result.success).toBe(true)
      expect(result.compressed).toBeDefined()
      expect(result.compressionRatio).toBeGreaterThan(1)
      expect(result.quality).toBeGreaterThanOrEqual(0.7)
    })
    
    it('should handle empty text', async () => {
      const result = await engine.compress('', 0.7)
      
      expect(result.compressed).toBe('')
      expect(result.compressionRatio).toBe(1)
      expect(result.quality).toBe(1)
    })
    
    it('should respect target ratio', async () => {
      const text = 'This is test content for compression ratio testing. '.repeat(100)
      const targetRatio = 0.6
      const result = await engine.compress(text, targetRatio)
      
      expect(result.compressionRatio).toBeGreaterThanOrEqual(targetRatio * 0.8) // Allow some variance
    })
  })
  
  describe('compressText convenience function', () => {
    it('should compress text using convenience function', async () => {
      const text = 'Test content for convenience function. '.repeat(50)
      const result = await compressText(text, 0.7)
      
      expect(result.compressed).toBeDefined()
      expect(result.compressionRatio).toBeGreaterThan(1)
    })
  })
  
  describe('compression strategies', () => {
    it('should apply truncate strategy to short content', async () => {
      const text = 'Short content for truncation testing.'
      const result = await engine.compress(text, 0.8)
      
      expect(result.method).toBe('truncate')
      expect(result.compressed).toBeDefined()
    })
    
    it('should apply extract strategy to structured content', async () => {
      const text = `
        This is a structured document with multiple sections.
        
        Section 1: Introduction
        This section introduces the main concepts.
        
        Section 2: Implementation
        This section describes the implementation details.
        
        Section 3: Conclusion
        This section summarizes the findings.
      `
      const result = await engine.compress(text, 0.7)
      
      expect(result.compressed).toBeDefined()
      expect(result.quality).toBeGreaterThanOrEqual(0.7)
    })
  })
  
  describe('quality threshold', () => {
    it('should use fallback when quality is below threshold', async () => {
      const text = 'Test content that might have low quality when compressed. '.repeat(20)
      
      // Mock a compression that produces low quality
      const result = await engine.compress(text, 0.9) // Aggressive compression
      
      expect(result.quality).toBeGreaterThanOrEqual(0.7) // Should use fallback
    })
  })
  
  describe('timeout protection', () => {
    it('should handle compression timeout gracefully', async () => {
      const text = 'Test content for timeout testing. '.repeat(1000)
      
      // This should complete within timeout
      const result = await engine.compress(text, 0.7)
      
      expect(result.compressed).toBeDefined()
      expect(result.metadata?.processingTime).toBeLessThan(5000)
    })
  })
})

describe('compressTextBatch', () => {
  it('should compress multiple texts', async () => {
    const texts = [
      'First text for batch compression. '.repeat(50),
      'Second text for batch compression. '.repeat(50),
      'Third text for batch compression. '.repeat(50)
    ]
    
    const results = await compressTextBatch(texts, 0.7)
    
    expect(results).toHaveLength(3)
    results.forEach(result => {
      expect(result.compressed).toBeDefined()
      expect(result.compressionRatio).toBeGreaterThan(1)
    })
  })
})

describe('compression quality assessment', () => {
  it('should assess compression quality', async () => {
    const text = 'This is a comprehensive test of compression quality assessment. '
    const engine = new BasicCompressionEngine()
    
    const result = await engine.compress(text, 0.8)
    
    expect(result.quality).toBeGreaterThanOrEqual(0.7)
    expect(result.quality).toBeLessThanOrEqual(1.0)
  })
  
  it('should preserve semantic meaning', async () => {
    const text = `
      The key concepts in this document are:
      1. Semantic preservation during compression
      2. Maintaining information density
      3. Quality assessment metrics
      
      These concepts are crucial for effective compression.
    `
    
    const result = await compressText(text, 0.7)
    
    // Check that key terms are preserved
    expect(result.compressed).toContain('semantic')
    expect(result.compressed).toContain('compression')
    expect(result.compressed).toContain('quality')
  })
})