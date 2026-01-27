import { describe, it, expect, beforeEach } from 'vitest'
import { PromptTemplateEngine, renderPrompt } from '../template'
import { PromptTemplateLibrary } from '../library'
import type { PromptTemplate } from '../types'

describe('PromptTemplateEngine', () => {
  let engine: PromptTemplateEngine

  beforeEach(() => {
    engine = new PromptTemplateEngine()
  })

  describe('render', () => {
    it('should replace simple variables', () => {
      const template = 'Hello {{name}}!'
      const result = engine.render(template, {
        variables: { name: 'Alice' },
      })

      expect(result.success).toBe(true)
      expect(result.prompt).toBe('Hello Alice!')
    })

    it('should handle multiple variables', () => {
      const template = '{{greeting}} {{name}}, you are {{age}} years old.'
      const result = engine.render(template, {
        variables: { greeting: 'Hi', name: 'Bob', age: 30 },
      })

      expect(result.prompt).toBe('Hi Bob, you are 30 years old.')
    })

    it('should handle nested variables', () => {
      const template = 'Hello {{user.name}}!'
      const result = engine.render(template, {
        variables: { user: { name: 'Charlie' } },
      })

      expect(result.prompt).toBe('Hello Charlie!')
    })

    it('should handle array values', () => {
      const template = 'Colors: {{colors}}'
      const result = engine.render(template, {
        variables: { colors: ['red', 'blue', 'green'] },
      })

      expect(result.prompt).toBe('Colors: red, blue, green')
    })

    it('should trim whitespace when requested', () => {
      const template = '  Hello {{name}}!  '
      const result = engine.render(template, {
        variables: { name: 'Alice' },
        trim: true,
      })

      expect(result.prompt).toBe('Hello Alice!')
    })

    it('should track used variables', () => {
      const template = 'Hello {{name}}! Age: {{age}}'
      const result = engine.render(template, {
        variables: { name: 'Alice', age: 30, extra: 'ignored' },
      })

      expect(result.usedVariables).toContain('name')
      expect(result.usedVariables).toContain('age')
      expect(result.usedVariables).not.toContain('extra')
    })
  })

  describe('validation', () => {
    it('should validate required variables', () => {
      const template: PromptTemplate = {
        id: 'test',
        name: 'Test',
        template: 'Hello {{name}}!',
        variables: [{ name: 'name', type: 'string', required: true }],
      }

      const result = engine.render(template, {
        variables: {},
        validate: true,
      })

      expect(result.success).toBe(false)
      expect(result.errors).toContain('Missing required variable: name')
    })

    it('should pass validation with all required variables', () => {
      const template: PromptTemplate = {
        id: 'test',
        name: 'Test',
        template: 'Hello {{name}}!',
        variables: [{ name: 'name', type: 'string', required: true }],
      }

      const result = engine.render(template, {
        variables: { name: 'Alice' },
        validate: true,
      })

      expect(result.success).toBe(true)
      expect(result.errors).toBeUndefined()
    })
  })

  describe('extractVariables', () => {
    it('should extract variable names', () => {
      const template = 'Hello {{name}}, you are {{age}} years old.'
      const variables = engine.extractVariables(template)

      expect(variables).toContain('name')
      expect(variables).toContain('age')
      expect(variables).toHaveLength(2)
    })

    it('should handle nested variables', () => {
      const template = '{{user.name}} from {{user.location}}'
      const variables = engine.extractVariables(template)

      expect(variables).toContain('user.name')
      expect(variables).toContain('user.location')
    })
  })

  describe('validate', () => {
    it('should detect unclosed variables', () => {
      const template = 'Hello {{name!'
      const result = engine.validate(template)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Mismatched variable delimiters')
    })

    it('should validate correct templates', () => {
      const template = 'Hello {{name}}!'
      const result = engine.validate(template)

      expect(result.valid).toBe(true)
      expect(result.errors).toBeUndefined()
    })
  })
})

describe('renderPrompt helper', () => {
  it('should render simple prompts', () => {
    const result = renderPrompt('Hello {{name}}!', { name: 'Alice' })

    expect(result).toBe('Hello Alice!')
  })

  it('should throw on validation errors', () => {
    const template: PromptTemplate = {
      id: 'test',
      name: 'Test',
      template: 'Hello {{name}}!',
      variables: [{ name: 'name', required: true }],
    }

    expect(() => {
      renderPrompt(template, {}, { validate: true })
    }).toThrow()
  })
})

describe('PromptLibrary', () => {
  let library: PromptTemplateLibrary

  beforeEach(() => {
    library = new PromptTemplateLibrary()
  })

  describe('add and get', () => {
    it('should store and retrieve templates', () => {
      const template: PromptTemplate = {
        id: 'greeting',
        name: 'Greeting',
        template: 'Hello {{name}}!',
      }

      library.add(template)
      const retrieved = library.get('greeting')

      expect(retrieved).toEqual(template)
    })
  })

  describe('getByName', () => {
    it('should find template by name', () => {
      const template: PromptTemplate = {
        id: 'test',
        name: 'Test Template',
        template: 'Test',
      }

      library.add(template)
      const found = library.getByName('Test Template')

      expect(found).toEqual(template)
    })
  })

  describe('search', () => {
    it('should search by name and description', () => {
      library.add({
        id: '1',
        name: 'Greeting Template',
        template: 'Hello',
        description: 'A friendly greeting',
      })

      library.add({
        id: '2',
        name: 'Farewell Template',
        template: 'Goodbye',
        description: 'Say goodbye',
      })

      const results = library.search('greeting')
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Greeting Template')
    })

    it('should search by tags', () => {
      library.add({
        id: '1',
        name: 'Template 1',
        template: 'Test',
        tags: ['important', 'work'],
      })

      const results = library.search('important')
      expect(results).toHaveLength(1)
    })
  })

  describe('getByTag', () => {
    it('should filter by tag', () => {
      library.add({
        id: '1',
        name: 'Template 1',
        template: 'Test',
        tags: ['work'],
      })

      library.add({
        id: '2',
        name: 'Template 2',
        template: 'Test',
        tags: ['personal'],
      })

      const workTemplates = library.getByTag('work')
      expect(workTemplates).toHaveLength(1)
      expect(workTemplates[0].name).toBe('Template 1')
    })
  })

  describe('export and import', () => {
    it('should export and import library', () => {
      library.add({
        id: '1',
        name: 'Template 1',
        template: 'Test',
      })

      const exported = library.export()

      const newLibrary = new PromptTemplateLibrary()
      newLibrary.import(exported)

      expect(newLibrary.get('1')).toBeDefined()
    })
  })
})
