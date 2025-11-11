/**
 * Tests for MCP tools
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { handleToolCall } from '../index.js'
import { ValidationError, NotFoundError } from '../../utils/errors.js'
import * as fs from 'fs/promises'
import * as path from 'path'

// Mock fs module
vi.mock('fs/promises', () => ({
  default: {
    mkdir: vi.fn(),
    writeFile: vi.fn(),
    readFile: vi.fn(),
    readdir: vi.fn(),
    access: vi.fn()
  },
  mkdir: vi.fn(),
  writeFile: vi.fn(),
  readFile: vi.fn(),
  readdir: vi.fn(),
  access: vi.fn()
}))

describe('handleToolCall', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('list_examples', () => {
    it('should return list of examples', async () => {
      const result = await handleToolCall('list_examples', {})
      expect(result.examples).toBeDefined()
      expect(Array.isArray(result.examples)).toBe(true)
      expect(result.examples.length).toBeGreaterThan(0)
    })
  })

  describe('get_example', () => {
    it('should return example code when found', async () => {
      const result = await handleToolCall('get_example', { exampleName: 'basic-chat' })
      expect(result.name).toBe('basic-chat')
      expect(result.code).toBeDefined()
      expect(typeof result.code).toBe('string')
    })

    it('should throw NotFoundError when example not found', async () => {
      await expect(
        handleToolCall('get_example', { exampleName: 'nonexistent' })
      ).rejects.toThrow()
    })

    it('should validate required parameter', async () => {
      await expect(
        handleToolCall('get_example', {} as any)
      ).rejects.toThrow()
    })
  })

  describe('get_model_info', () => {
    it('should return model info when found', async () => {
      const result = await handleToolCall('get_model_info', { modelName: 'gpt-4-turbo' })
      expect(result.provider).toBe('OpenAI')
      expect(result.contextWindow).toBeDefined()
      expect(result.pricing).toBeDefined()
    })

    it('should throw NotFoundError when model not found', async () => {
      await expect(
        handleToolCall('get_model_info', { modelName: 'gpt-999' })
      ).rejects.toThrow()
    })

    it('should validate required parameter', async () => {
      await expect(
        handleToolCall('get_model_info', {} as any)
      ).rejects.toThrow()
    })
  })

  describe('calculate_cost', () => {
    it('should calculate cost correctly', async () => {
      const result = await handleToolCall('calculate_cost', {
        modelName: 'gpt-4-turbo',
        promptTokens: 1000,
        completionTokens: 500
      })
      
      expect(result.modelName).toBe('gpt-4-turbo')
      expect(result.promptTokens).toBe(1000)
      expect(result.completionTokens).toBe(500)
      expect(result.totalTokens).toBe(1500)
      expect(result.totalCost).toBeGreaterThan(0)
      expect(result.currency).toBe('USD')
    })

    it('should validate required parameters', async () => {
      await expect(
        handleToolCall('calculate_cost', { modelName: 'gpt-4-turbo' } as any)
      ).rejects.toThrow()
    })

    it('should validate token counts are non-negative', async () => {
      await expect(
        handleToolCall('calculate_cost', {
          modelName: 'gpt-4-turbo',
          promptTokens: -1,
          completionTokens: 100
        } as any)
      ).rejects.toThrow()
    })
  })

  describe('init_project', () => {
    beforeEach(() => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined)
      vi.mocked(fs.writeFile).mockResolvedValue(undefined)
    })

    it('should validate required parameters', async () => {
      await expect(
        handleToolCall('init_project', {} as any)
      ).rejects.toThrow()
    })

    it('should validate provider enum', async () => {
      await expect(
        handleToolCall('init_project', {
          provider: 'invalid',
          framework: 'nextjs',
          projectPath: '/tmp/test'
        } as any)
      ).rejects.toThrow()
    })

    it('should validate framework enum', async () => {
      await expect(
        handleToolCall('init_project', {
          provider: 'openai',
          framework: 'invalid',
          projectPath: '/tmp/test'
        } as any)
      ).rejects.toThrow()
    })
  })

  describe('validate_config', () => {
    beforeEach(() => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify({
        dependencies: { openai: '^4.0.0' }
      }))
      vi.mocked(fs.access).mockResolvedValue(undefined)
    })

    it('should validate required parameter', async () => {
      await expect(
        handleToolCall('validate_config', {} as any)
      ).rejects.toThrow()
    })
  })

  describe('analyze_project', () => {
    beforeEach(() => {
      vi.mocked(fs.readdir).mockResolvedValue(['package.json', '.env.local', 'tsconfig.json'] as any)
      vi.mocked(fs.access).mockResolvedValue(undefined)
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify({
        dependencies: { openai: '^4.0.0', next: '^14.0.0' }
      }))
    })

    it('should analyze project correctly', async () => {
      const result = await handleToolCall('analyze_project', {
        projectPath: '/tmp/test-project'
      })
      
      expect(result.path).toBe('/tmp/test-project')
      expect(result.hasPackageJson).toBe(true)
      expect(result.providers).toContain('OpenAI')
    })

    it('should throw NotFoundError when directory does not exist', async () => {
      const accessError = new Error('ENOENT')
      accessError.name = 'ENOENT'
      vi.mocked(fs.access).mockRejectedValueOnce(accessError)
      
      await expect(
        handleToolCall('analyze_project', {
          projectPath: '/nonexistent'
        })
      ).rejects.toThrow()
    })
  })

  describe('unknown tool', () => {
    it('should throw ValidationError for unknown tool', async () => {
      await expect(
        handleToolCall('unknown_tool', {} as any)
      ).rejects.toThrow()
    })
  })
})
