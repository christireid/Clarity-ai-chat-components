/**
 * MCP Server Integration Tests
 *
 * End-to-end tests for the MCP server protocol integration.
 * Tests the actual tool, resource, and prompt handlers through
 * the MCP server interface.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { tools, handleToolCall } from '../tools/index.js'
import { resources, handleResourceRead } from '../resources/index.js'
import { prompts, handlePromptGet } from '../prompts/index.js'

// Mock fs module for project-related tools
vi.mock('fs/promises', () => ({
  default: {
    mkdir: vi.fn(),
    writeFile: vi.fn(),
    readFile: vi.fn(),
    readdir: vi.fn(),
    access: vi.fn(),
  },
  mkdir: vi.fn(),
  writeFile: vi.fn(),
  readFile: vi.fn(),
  readdir: vi.fn(),
  access: vi.fn(),
}))

describe('MCP Server Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ===========================================================================
  // Server Configuration Tests
  // ===========================================================================
  describe('Server Configuration', () => {
    it('should expose correct number of tools', () => {
      // Should have 16 tools total (7 original + 8 component discovery + 1 accessibility checker)
      expect(tools.length).toBe(16)
    })

    it('should expose correct number of resources', () => {
      // Should have at least 5 resources
      expect(resources.length).toBeGreaterThanOrEqual(5)
    })

    it('should expose correct number of prompts', () => {
      // Should have 10 prompts (5 original + 5 interactive demos)
      expect(prompts.length).toBe(10)
    })

    it('should have valid tool definitions', () => {
      for (const tool of tools) {
        expect(tool.name).toBeTruthy()
        expect(typeof tool.name).toBe('string')
        expect(tool.description).toBeTruthy()
        expect(tool.inputSchema).toBeDefined()
        expect(tool.inputSchema.type).toBe('object')
      }
    })

    it('should have valid resource definitions', () => {
      for (const resource of resources) {
        expect(resource.uri).toBeTruthy()
        expect(resource.uri).toMatch(/^clarity:\/\//)
        expect(resource.name).toBeTruthy()
      }
    })

    it('should have valid prompt definitions', () => {
      for (const prompt of prompts) {
        expect(prompt.name).toBeTruthy()
        expect(typeof prompt.name).toBe('string')
        expect(prompt.description).toBeTruthy()
        expect(Array.isArray(prompt.arguments)).toBe(true)
      }
    })
  })

  // ===========================================================================
  // Tool Integration Tests
  // ===========================================================================
  describe('Tool Integration', () => {
    describe('Component Discovery Flow', () => {
      it('should complete full component discovery workflow', async () => {
        // Step 1: List categories
        const categories = await handleToolCall('clarity_list_categories', {})
        expect(categories.totalComponents).toBeGreaterThan(0)
        expect(categories.categories.length).toBeGreaterThan(0)

        // Step 2: Search for components
        const searchResult = await handleToolCall(
          'clarity_discover_components',
          {
            query: 'chat',
          }
        )
        expect(searchResult.resultCount).toBeGreaterThan(0)

        // Step 3: Get component docs for first result
        const firstComponent = searchResult.components[0]
        const docs = await handleToolCall('clarity_get_component_docs', {
          componentName: firstComponent.name,
        })
        expect(docs.name).toBe(firstComponent.name)
        expect(docs.props).toBeDefined()

        // Step 4: Get accessibility info
        const a11y = await handleToolCall('clarity_get_accessibility', {
          componentName: firstComponent.name,
        })
        expect(a11y.componentName).toBe(firstComponent.name)
        expect(a11y.wcagLevel).toBeDefined()

        // Step 5: Generate code
        const code = await handleToolCall('clarity_generate_code', {
          componentName: firstComponent.name,
          variant: 'basic',
        })
        expect(code.code).toBeDefined()
        expect(code.imports).toBeDefined()

        // Step 6: Get related components
        const related = await handleToolCall('clarity_get_related_components', {
          componentName: firstComponent.name,
        })
        expect(related.componentName).toBe(firstComponent.name)
        expect(Array.isArray(related.relatedComponents)).toBe(true)
      })

      it('should complete hook discovery workflow', async () => {
        // Step 1: Search for hooks
        const searchResult = await handleToolCall('clarity_discover_hooks', {
          query: 'use',
        })
        expect(searchResult.resultCount).toBeGreaterThan(0)

        // Step 2: Get hook docs for first result
        const firstHook = searchResult.hooks[0]
        const docs = await handleToolCall('clarity_get_hook_docs', {
          hookName: firstHook.name,
        })
        expect(docs.name).toBe(firstHook.name)
        expect(docs.parameters).toBeDefined()
        expect(docs.returns).toBeDefined()
      })
    })

    describe('Model Information Flow', () => {
      it('should complete model information workflow', async () => {
        // Step 1: Get model info
        const modelInfo = await handleToolCall('get_model_info', {
          modelName: 'gpt-4o',
        })
        expect(modelInfo.name).toBeDefined()
        expect(modelInfo.pricing).toBeDefined()
        expect(modelInfo.contextWindow).toBeGreaterThan(0)

        // Step 2: Calculate cost
        const cost = await handleToolCall('calculate_cost', {
          modelName: 'gpt-4o',
          promptTokens: 1000,
          completionTokens: 500,
        })
        expect(cost.totalCost).toBeGreaterThan(0)
        expect(cost.inputCost).toBeGreaterThan(0)
        expect(cost.outputCost).toBeGreaterThan(0)
      })
    })

    describe('Accessibility Checker Flow', () => {
      it('should perform accessibility audit', async () => {
        const audit = await handleToolCall('clarity_check_accessibility', {
          componentNames: ['ClarityChat', 'ChatInput', 'MessageList'],
          wcagLevel: 'AA',
        })

        expect(audit.auditDate).toBeDefined()
        expect(audit.components.length).toBe(3)
        expect(audit.overallScore).toBeGreaterThanOrEqual(0)
        expect(audit.overallScore).toBeLessThanOrEqual(100)
        expect(audit.summary.totalComponents).toBe(3)
      })

      it('should audit default components when none specified', async () => {
        const audit = await handleToolCall('clarity_check_accessibility', {})

        expect(audit.components.length).toBeGreaterThan(0)
        expect(audit.summary).toBeDefined()
      })
    })

    describe('Error Handling', () => {
      it('should throw for unknown tool', async () => {
        await expect(handleToolCall('nonexistent_tool', {})).rejects.toThrow()
      })

      it('should throw for missing required parameters', async () => {
        await expect(
          handleToolCall('clarity_discover_components', {})
        ).rejects.toThrow()
      })

      it('should throw for invalid enum values', async () => {
        await expect(
          handleToolCall('clarity_discover_components', {
            query: 'test',
            category: 'invalid-category',
          })
        ).rejects.toThrow()
      })

      it('should handle component not found gracefully', async () => {
        await expect(
          handleToolCall('clarity_get_component_docs', {
            componentName: 'NonExistentComponent123',
          })
        ).rejects.toThrow()
      })
    })
  })

  // ===========================================================================
  // Resource Integration Tests
  // ===========================================================================
  describe('Resource Integration', () => {
    it('should read getting-started docs', async () => {
      const content = await handleResourceRead('clarity://docs/getting-started')
      expect(content).toBeTruthy()
      expect(content).toContain('Clarity Chat')
    })

    it('should read api-reference docs', async () => {
      const content = await handleResourceRead('clarity://docs/api-reference')
      expect(content).toBeTruthy()
    })

    it('should read examples list', async () => {
      const content = await handleResourceRead('clarity://examples/list')
      expect(content).toBeTruthy()
      const examples = JSON.parse(content)
      // Examples can be either an array or an object with examples property
      expect(
        Array.isArray(examples) || (examples && typeof examples === 'object')
      ).toBe(true)
    })

    it('should read model pricing', async () => {
      const content = await handleResourceRead('clarity://models/pricing')
      expect(content).toBeTruthy()
      const pricing = JSON.parse(content)
      expect(pricing).toBeDefined()
    })

    it('should read model capabilities', async () => {
      const content = await handleResourceRead('clarity://models/capabilities')
      expect(content).toBeTruthy()
      const capabilities = JSON.parse(content)
      expect(capabilities).toBeDefined()
    })

    it('should throw for unknown resource', async () => {
      await expect(
        handleResourceRead('clarity://nonexistent/resource')
      ).rejects.toThrow()
    })

    it('should cache resources for repeated reads', async () => {
      // First read
      const content1 = await handleResourceRead(
        'clarity://docs/getting-started'
      )
      // Second read should be cached
      const content2 = await handleResourceRead(
        'clarity://docs/getting-started'
      )
      expect(content1).toBe(content2)
    })
  })

  // ===========================================================================
  // Prompt Integration Tests
  // ===========================================================================
  describe('Prompt Integration', () => {
    describe('Original Prompts', () => {
      it('should generate implement-feature prompt', async () => {
        const prompt = await handlePromptGet('implement-feature', {
          feature: 'Add voice input to chat',
          provider: 'openai',
        })
        expect(prompt).toContain('voice')
        expect(prompt).toContain('OPENAI')
        expect(prompt).toContain('Implementation Plan')
      })

      it('should generate debug-issue prompt', async () => {
        const prompt = await handlePromptGet('debug-issue', {
          issue: 'Messages not streaming',
          code: 'const response = await fetch(...)',
        })
        expect(prompt).toContain('streaming')
        expect(prompt).toContain('Root Cause')
      })

      it('should generate optimize-performance prompt', async () => {
        const prompt = await handlePromptGet('optimize-performance', {
          context: 'High token usage in production',
        })
        expect(prompt).toContain('Token Usage')
        expect(prompt).toContain('Cost')
      })

      it('should generate review-code prompt', async () => {
        const prompt = await handlePromptGet('review-code', {
          code: 'function sendMessage() { ... }',
          focus: 'security',
        })
        expect(prompt).toContain('Security')
        expect(prompt).toContain('Correctness')
      })

      it('should generate convert-example prompt', async () => {
        const prompt = await handlePromptGet('convert-example', {
          code: 'import { openai } from "@ai-sdk/openai"',
          from: 'openai',
          to: 'anthropic',
        })
        expect(prompt).toContain('openai')
        expect(prompt).toContain('anthropic')
        expect(prompt).toContain('Converted Code')
      })
    })

    describe('Interactive Demo Prompts', () => {
      it('should generate quick-start-demo prompt', async () => {
        const prompt = await handlePromptGet('quick-start-demo', {
          provider: 'anthropic',
          framework: 'nextjs',
        })
        expect(prompt).toContain('ANTHROPIC')
        expect(prompt).toContain('Next')
        expect(prompt).toContain('Step 1')
      })

      it('should generate explore-components prompt', async () => {
        const prompt = await handlePromptGet('explore-components', {
          category: 'input',
        })
        expect(prompt).toContain('input')
        expect(prompt).toContain('Component')
        expect(prompt).toContain('ChatInput')
      })

      it('should generate build-chatbot prompt', async () => {
        const prompt = await handlePromptGet('build-chatbot', {
          type: 'customer-support',
          features: 'streaming,voice',
        })
        expect(prompt).toContain('Customer Support')
        expect(prompt).toContain('VoiceInput')
        expect(prompt).toContain('Streaming')
      })

      it('should generate accessibility-guide prompt', async () => {
        const prompt = await handlePromptGet('accessibility-guide', {
          wcagLevel: 'AAA',
        })
        expect(prompt).toContain('WCAG')
        expect(prompt).toContain('AAA')
        expect(prompt).toContain('Keyboard')
        expect(prompt).toContain('Screen Reader')
      })

      it('should generate model-comparison prompt', async () => {
        const prompt = await handlePromptGet('model-comparison', {
          useCase: 'coding',
          budget: '100',
        })
        expect(prompt).toContain('Coding')
        expect(prompt).toContain('100')
        expect(prompt).toContain('gpt-4o')
        expect(prompt).toContain('claude')
      })
    })

    describe('Error Handling', () => {
      it('should throw for unknown prompt', async () => {
        await expect(
          handlePromptGet('nonexistent-prompt', {})
        ).rejects.toThrow()
      })

      it('should throw for missing required arguments', async () => {
        await expect(handlePromptGet('implement-feature', {})).rejects.toThrow()
      })
    })
  })

  // ===========================================================================
  // Cross-Feature Integration Tests
  // ===========================================================================
  describe('Cross-Feature Integration', () => {
    it('should support building a complete chat implementation', async () => {
      // This test simulates a user building a complete chat implementation
      // using multiple tools in sequence

      // 1. Start with quick-start guide
      const guide = await handlePromptGet('quick-start-demo', {
        provider: 'openai',
      })
      expect(guide).toContain('ClarityChat')

      // 2. Explore available components
      const components = await handleToolCall('clarity_list_categories', {})
      expect(components.totalComponents).toBeGreaterThan(0)

      // 3. Search for input components
      const inputComponents = await handleToolCall(
        'clarity_discover_components',
        {
          query: 'input',
          category: 'input',
        }
      )
      expect(inputComponents.resultCount).toBeGreaterThan(0)

      // 4. Get documentation for ChatInput
      const chatInputDocs = await handleToolCall('clarity_get_component_docs', {
        componentName: 'ChatInput',
      })
      expect(chatInputDocs.props.length).toBeGreaterThan(0)

      // 5. Generate code for ChatInput
      const chatInputCode = await handleToolCall('clarity_generate_code', {
        componentName: 'ChatInput',
        variant: 'typescript',
      })
      expect(chatInputCode.code).toContain('ChatInput')

      // 6. Check accessibility requirements
      const a11y = await handleToolCall('clarity_get_accessibility', {
        componentName: 'ChatInput',
      })
      expect(a11y.keyboardSupport.length).toBeGreaterThan(0)

      // 7. Run accessibility audit
      const audit = await handleToolCall('clarity_check_accessibility', {
        componentNames: ['ClarityChat', 'ChatInput', 'MessageList'],
      })
      expect(audit.overallScore).toBeGreaterThanOrEqual(0)

      // 8. Get model recommendations
      const modelInfo = await handleToolCall('get_model_info', {
        modelName: 'gpt-4o-mini',
      })
      expect(modelInfo.pricing).toBeDefined()

      // 9. Calculate expected costs
      const cost = await handleToolCall('calculate_cost', {
        modelName: 'gpt-4o-mini',
        promptTokens: 10000,
        completionTokens: 5000,
      })
      expect(cost.totalCost).toBeDefined()
    })
  })
})
