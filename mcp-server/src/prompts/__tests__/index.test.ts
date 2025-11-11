/**
 * Tests for MCP prompts
 */

import { describe, it, expect } from 'vitest'
import { handlePromptGet } from '../index.js'
import { ValidationError, NotFoundError } from '../../utils/errors.js'

describe('handlePromptGet', () => {
  describe('implement-feature', () => {
    it('should generate prompt with feature', async () => {
      const prompt = await handlePromptGet('implement-feature', {
        feature: 'Add streaming support'
      })
      
      expect(prompt).toContain('implement')
      expect(prompt).toContain('Add streaming support')
    })

    it('should include provider when provided', async () => {
      const prompt = await handlePromptGet('implement-feature', {
        feature: 'Add streaming support',
        provider: 'openai'
      })
      
      expect(prompt).toContain('OPENAI')
    })

    it('should validate required parameter', async () => {
      await expect(
        handlePromptGet('implement-feature', {} as any)
      ).rejects.toThrow()
    })
  })

  describe('debug-issue', () => {
    it('should generate prompt with issue', async () => {
      const prompt = await handlePromptGet('debug-issue', {
        issue: 'Connection timeout'
      })
      
      expect(prompt).toContain('debug')
      expect(prompt).toContain('Connection timeout')
    })

    it('should include code when provided', async () => {
      const prompt = await handlePromptGet('debug-issue', {
        issue: 'Error',
        code: 'const x = 1'
      })
      
      expect(prompt).toContain('const x = 1')
    })

    it('should validate required parameter', async () => {
      await expect(
        handlePromptGet('debug-issue', {} as any)
      ).rejects.toThrow()
    })
  })

  describe('optimize-performance', () => {
    it('should generate prompt with context', async () => {
      const prompt = await handlePromptGet('optimize-performance', {
        context: 'Slow API calls'
      })
      
      expect(prompt).toContain('optimization')
      expect(prompt).toContain('Slow API calls')
    })

    it('should validate required parameter', async () => {
      await expect(
        handlePromptGet('optimize-performance', {} as any)
      ).rejects.toThrow()
    })
  })

  describe('review-code', () => {
    it('should generate prompt with code', async () => {
      const prompt = await handlePromptGet('review-code', {
        code: 'function test() {}'
      })
      
      expect(prompt).toContain('review')
      expect(prompt).toContain('function test() {}')
    })

    it('should include focus when provided', async () => {
      const prompt = await handlePromptGet('review-code', {
        code: 'function test() {}',
        focus: 'security'
      })
      
      expect(prompt).toContain('security')
    })

    it('should validate required parameter', async () => {
      await expect(
        handlePromptGet('review-code', {} as any)
      ).rejects.toThrow()
    })
  })

  describe('convert-example', () => {
    it('should generate prompt with code and conversion targets', async () => {
      const prompt = await handlePromptGet('convert-example', {
        code: 'const x = 1',
        from: 'openai',
        to: 'anthropic'
      })
      
      expect(prompt).toContain('convert')
      expect(prompt).toContain('openai')
      expect(prompt).toContain('anthropic')
    })

    it('should validate required parameters', async () => {
      await expect(
        handlePromptGet('convert-example', { code: 'test' } as any)
      ).rejects.toThrow()
    })
  })

  describe('unknown prompt', () => {
    it('should throw NotFoundError for unknown prompt', async () => {
      await expect(
        handlePromptGet('unknown-prompt', {} as any)
      ).rejects.toThrow()
    })
  })
})
