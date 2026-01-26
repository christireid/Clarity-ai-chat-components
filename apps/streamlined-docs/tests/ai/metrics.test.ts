/**
 * Tests for Prompt Metrics Logger
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { PromptMetricsLogger } from '@/lib/ai/metrics'
import { QueryComplexity } from '@/lib/ai/complexity'

describe('Prompt Metrics Logger', () => {
  let logger: PromptMetricsLogger

  beforeEach(() => {
    logger = new PromptMetricsLogger()
  })

  describe('Logging', () => {
    it('should log metrics', () => {
      logger.log({
        queryId: '1',
        timestamp: Date.now(),
        query: 'What is React?',
        complexity: QueryComplexity.SIMPLE,
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
        groundingConfidence: 0.95,
        citationCount: 2,
        hallucinationIssues: 0,
        responseTime: 500,
        regenerated: false,
      })

      const stats = logger.getStats()
      expect(stats.totalQueries).toBe(1)
    })

    it('should handle multiple metrics', () => {
      for (let i = 0; i < 5; i++) {
        logger.log({
          queryId: `${i}`,
          timestamp: Date.now(),
          query: `Query ${i}`,
          complexity: QueryComplexity.MODERATE,
          promptTokens: 100,
          completionTokens: 50,
          totalTokens: 150,
          groundingConfidence: 0.9,
          citationCount: 1,
          hallucinationIssues: 0,
          responseTime: 400,
          regenerated: false,
        })
      }

      const stats = logger.getStats()
      expect(stats.totalQueries).toBe(5)
    })
  })

  describe('Statistics', () => {
    beforeEach(() => {
      // Add sample metrics
      logger.log({
        queryId: '1',
        timestamp: Date.now(),
        query: 'Simple query',
        complexity: QueryComplexity.SIMPLE,
        promptTokens: 50,
        completionTokens: 30,
        totalTokens: 80,
        groundingConfidence: 0.95,
        citationCount: 2,
        hallucinationIssues: 0,
        responseTime: 300,
        regenerated: false,
      })

      logger.log({
        queryId: '2',
        timestamp: Date.now(),
        query: 'Complex query',
        complexity: QueryComplexity.COMPLEX,
        promptTokens: 200,
        completionTokens: 150,
        totalTokens: 350,
        groundingConfidence: 0.75,
        citationCount: 5,
        hallucinationIssues: 1,
        responseTime: 800,
        regenerated: false,
      })
    })

    it('should calculate average grounding confidence', () => {
      const stats = logger.getStats()
      expect(stats.avgGroundingConfidence).toBe(0.85) // (0.95 + 0.75) / 2
    })

    it('should calculate average citation count', () => {
      const stats = logger.getStats()
      expect(stats.avgCitationCount).toBe(3.5) // (2 + 5) / 2
    })

    it('should calculate hallucination rate', () => {
      const stats = logger.getStats()
      expect(stats.hallucinationRate).toBe(0.5) // 1 out of 2
    })

    it('should track complexity breakdown', () => {
      const stats = logger.getStats()
      expect(stats.complexityBreakdown.simple).toBe(1)
      expect(stats.complexityBreakdown.complex).toBe(1)
    })

    it('should calculate avg tokens per complexity', () => {
      const stats = logger.getStats()
      expect(stats.avgTokensPerComplexity.simple).toBe(80)
      expect(stats.avgTokensPerComplexity.complex).toBe(350)
    })
  })

  describe('Filtering', () => {
    beforeEach(() => {
      // Add metrics at different timestamps
      logger.log({
        queryId: '1',
        timestamp: 1000,
        query: 'Old query',
        complexity: QueryComplexity.SIMPLE,
        promptTokens: 50,
        completionTokens: 30,
        totalTokens: 80,
        groundingConfidence: 0.9,
        citationCount: 1,
        hallucinationIssues: 0,
        responseTime: 300,
        regenerated: false,
      })

      logger.log({
        queryId: '2',
        timestamp: 2000,
        query: 'New query',
        complexity: QueryComplexity.COMPLEX,
        promptTokens: 200,
        completionTokens: 150,
        totalTokens: 350,
        groundingConfidence: 0.8,
        citationCount: 3,
        hallucinationIssues: 1,
        responseTime: 600,
        regenerated: false,
      })
    })

    it('should filter by time range', () => {
      const metrics = logger.getMetricsInRange(1500, 2500)
      expect(metrics.length).toBe(1)
      expect(metrics[0].queryId).toBe('2')
    })

    it('should filter by complexity', () => {
      const simpleMetrics = logger.getMetricsByComplexity(
        QueryComplexity.SIMPLE
      )
      expect(simpleMetrics.length).toBe(1)
      expect(simpleMetrics[0].queryId).toBe('1')
    })

    it('should get hallucinated responses', () => {
      const hallucinated = logger.getHallucinatedResponses()
      expect(hallucinated.length).toBe(1)
      expect(hallucinated[0].queryId).toBe('2')
    })

    it('should get low confidence responses', () => {
      const lowConfidence = logger.getLowConfidenceResponses(0.85)
      expect(lowConfidence.length).toBe(1)
      expect(lowConfidence[0].queryId).toBe('2')
    })
  })

  describe('Export', () => {
    it('should export metrics as JSON', () => {
      logger.log({
        queryId: '1',
        timestamp: Date.now(),
        query: 'Test',
        complexity: QueryComplexity.SIMPLE,
        promptTokens: 50,
        completionTokens: 30,
        totalTokens: 80,
        groundingConfidence: 0.9,
        citationCount: 1,
        hallucinationIssues: 0,
        responseTime: 300,
        regenerated: false,
      })

      const exported = logger.exportMetrics()
      const parsed = JSON.parse(exported)

      expect(parsed.metrics).toHaveLength(1)
      expect(parsed.stats).toBeDefined()
      expect(parsed.exportedAt).toBeDefined()
    })
  })

  describe('Memory management', () => {
    it('should limit stored metrics to prevent memory bloat', () => {
      // Add more than max (1000) metrics
      for (let i = 0; i < 1100; i++) {
        logger.log({
          queryId: `${i}`,
          timestamp: Date.now(),
          query: `Query ${i}`,
          complexity: QueryComplexity.SIMPLE,
          promptTokens: 50,
          completionTokens: 30,
          totalTokens: 80,
          groundingConfidence: 0.9,
          citationCount: 1,
          hallucinationIssues: 0,
          responseTime: 300,
          regenerated: false,
        })
      }

      const stats = logger.getStats()
      expect(stats.totalQueries).toBeLessThanOrEqual(1000)
    })
  })
})
