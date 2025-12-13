/**
 * Variable Parser Tests
 *
 * Comprehensive tests for the variable extraction and parsing utilities.
 */
import { describe, it, expect } from 'vitest'
import {
  VARIABLE_REGEX,
  inferVariableType,
  formatDisplayName,
  extractVariables,
  extractVariablesFromMultiple,
  validateVariableName,
  containsVariableSyntax,
  getTemplateSegments,
  getVariablePositions,
} from '../utils/variable-parser'

describe('variable-parser', () => {
  describe('VARIABLE_REGEX', () => {
    it('should match basic variable syntax', () => {
      expect('{{ name }}').toMatch(VARIABLE_REGEX)
      expect('{{name}}').toMatch(VARIABLE_REGEX)
      expect('{{  name  }}').toMatch(VARIABLE_REGEX)
    })

    it('should match variables with underscores', () => {
      expect('{{ user_name }}').toMatch(VARIABLE_REGEX)
      expect('{{ _private }}').toMatch(VARIABLE_REGEX)
      expect('{{ __dunder__ }}').toMatch(VARIABLE_REGEX)
    })

    it('should match variables with numbers', () => {
      expect('{{ var1 }}').toMatch(VARIABLE_REGEX)
      expect('{{ item_2 }}').toMatch(VARIABLE_REGEX)
    })

    it('should not match invalid variable names', () => {
      VARIABLE_REGEX.lastIndex = 0
      expect(VARIABLE_REGEX.test('{{ 123 }}')).toBe(false)
      VARIABLE_REGEX.lastIndex = 0
      expect(VARIABLE_REGEX.test('{{ 1name }}')).toBe(false)
    })

    it('should not match empty braces', () => {
      VARIABLE_REGEX.lastIndex = 0
      expect(VARIABLE_REGEX.test('{{ }}')).toBe(false)
      VARIABLE_REGEX.lastIndex = 0
      expect(VARIABLE_REGEX.test('{{}}')).toBe(false)
    })
  })

  describe('inferVariableType', () => {
    describe('number inference', () => {
      it('should infer number for count variables', () => {
        expect(inferVariableType('retry_count')).toBe('number')
        expect(inferVariableType('item_count')).toBe('number')
        expect(inferVariableType('count')).toBe('number')
      })

      it('should infer number for numeric suffixes', () => {
        expect(inferVariableType('max_retries')).toBe('number')
        expect(inferVariableType('min_value')).toBe('number')
        expect(inferVariableType('timeout')).toBe('number')
        expect(inferVariableType('limit')).toBe('number')
      })

      it('should infer number for size/dimension variables', () => {
        expect(inferVariableType('width')).toBe('number')
        expect(inferVariableType('height')).toBe('number')
        expect(inferVariableType('size')).toBe('number')
        expect(inferVariableType('length')).toBe('number')
      })

      it('should infer number for time variables', () => {
        expect(inferVariableType('year')).toBe('number')
        expect(inferVariableType('month')).toBe('number')
        expect(inferVariableType('duration')).toBe('number')
      })
    })

    describe('textarea inference', () => {
      it('should infer textarea for content variables', () => {
        expect(inferVariableType('user_context')).toBe('textarea')
        expect(inferVariableType('content')).toBe('textarea')
        expect(inferVariableType('description')).toBe('textarea')
      })

      it('should infer textarea for code variables', () => {
        expect(inferVariableType('code')).toBe('textarea')
        expect(inferVariableType('snippet')).toBe('textarea')
        expect(inferVariableType('source')).toBe('textarea')
      })

      it('should infer textarea for text variables', () => {
        expect(inferVariableType('user_prompt')).toBe('textarea')
        expect(inferVariableType('system_prompt')).toBe('textarea')
        expect(inferVariableType('instructions')).toBe('textarea')
        expect(inferVariableType('user_feedback')).toBe('textarea')
      })

      it('should infer textarea for data format variables', () => {
        expect(inferVariableType('json')).toBe('textarea')
        expect(inferVariableType('xml')).toBe('textarea')
        expect(inferVariableType('html')).toBe('textarea')
        expect(inferVariableType('markdown')).toBe('textarea')
      })
    })

    describe('toggle inference', () => {
      it('should infer toggle for is_ prefix', () => {
        expect(inferVariableType('is_active')).toBe('toggle')
        expect(inferVariableType('is_enabled')).toBe('toggle')
        expect(inferVariableType('is_visible')).toBe('toggle')
      })

      it('should infer toggle for has_ prefix', () => {
        expect(inferVariableType('has_permission')).toBe('toggle')
        expect(inferVariableType('has_access')).toBe('toggle')
      })

      it('should infer toggle for boolean prefixes', () => {
        expect(inferVariableType('enable_feature')).toBe('toggle')
        expect(inferVariableType('show_details')).toBe('toggle')
        expect(inferVariableType('include_headers')).toBe('toggle')
        expect(inferVariableType('use_cache')).toBe('toggle')
      })

      it('should infer toggle for boolean suffixes', () => {
        expect(inferVariableType('feature_enabled')).toBe('toggle')
        expect(inferVariableType('mode_active')).toBe('toggle')
        expect(inferVariableType('input_required')).toBe('toggle')
      })
    })

    describe('text inference (default)', () => {
      it('should default to text for unrecognized patterns', () => {
        expect(inferVariableType('name')).toBe('text')
        expect(inferVariableType('title')).toBe('text')
        expect(inferVariableType('user')).toBe('text')
        expect(inferVariableType('email')).toBe('text')
      })
    })
  })

  describe('formatDisplayName', () => {
    it('should convert snake_case to Title Case', () => {
      expect(formatDisplayName('user_name')).toBe('User Name')
      expect(formatDisplayName('first_name')).toBe('First Name')
      expect(formatDisplayName('max_retry_count')).toBe('Max Retry Count')
    })

    it('should convert camelCase to Title Case', () => {
      expect(formatDisplayName('userName')).toBe('User Name')
      expect(formatDisplayName('firstName')).toBe('First Name')
      expect(formatDisplayName('maxRetryCount')).toBe('Max Retry Count')
    })

    it('should handle uppercase acronyms', () => {
      expect(formatDisplayName('API_KEY')).toBe('API KEY')
      expect(formatDisplayName('XMLParser')).toBe('XML Parser')
    })

    it('should handle single words', () => {
      expect(formatDisplayName('name')).toBe('Name')
      expect(formatDisplayName('title')).toBe('Title')
    })

    it('should handle mixed formats', () => {
      expect(formatDisplayName('user_firstName')).toBe('User First Name')
    })

    it('should trim whitespace', () => {
      expect(formatDisplayName('  name  ')).toBe('Name')
    })
  })

  describe('extractVariables', () => {
    it('should extract single variable', () => {
      const result = extractVariables('Hello {{ name }}!')
      expect(result.variables).toHaveLength(1)
      expect(result.variables[0].name).toBe('name')
      expect(result.totalPlaceholders).toBe(1)
    })

    it('should extract multiple unique variables', () => {
      const result = extractVariables('{{ greeting }} {{ name }}!')
      expect(result.variables).toHaveLength(2)
      expect(result.variables[0].name).toBe('greeting')
      expect(result.variables[1].name).toBe('name')
      expect(result.totalPlaceholders).toBe(2)
    })

    it('should deduplicate repeated variables', () => {
      const result = extractVariables('{{ name }} says {{ name }}')
      expect(result.variables).toHaveLength(1)
      expect(result.variables[0].name).toBe('name')
      expect(result.variables[0].occurrenceCount).toBe(2)
      expect(result.totalPlaceholders).toBe(2)
    })

    it('should return empty for template without variables', () => {
      const result = extractVariables('Hello world!')
      expect(result.variables).toHaveLength(0)
      expect(result.totalPlaceholders).toBe(0)
    })

    it('should return empty for empty string', () => {
      const result = extractVariables('')
      expect(result.variables).toHaveLength(0)
    })

    it('should include inferred types', () => {
      const result = extractVariables(
        '{{ user_count }} {{ is_active }} {{ content }}'
      )
      expect(result.variables[0].inferredType).toBe('number')
      expect(result.variables[1].inferredType).toBe('toggle')
      expect(result.variables[2].inferredType).toBe('textarea')
    })

    it('should include display names', () => {
      const result = extractVariables('{{ user_name }}')
      expect(result.variables[0].displayName).toBe('User Name')
    })

    it('should detect unmatched opening braces', () => {
      const result = extractVariables('Hello {{ name } world')
      expect(result.hasUnmatchedBraces).toBe(true)
      expect(result.warnings.length).toBeGreaterThan(0)
    })

    it('should detect unmatched closing braces', () => {
      const result = extractVariables('Hello { name }} world')
      expect(result.hasUnmatchedBraces).toBe(true)
    })

    it('should warn about very short variable names', () => {
      const result = extractVariables('{{ x }}')
      expect(result.warnings.some((w) => w.includes('very short'))).toBe(true)
    })

    it('should warn about very long variable names', () => {
      const longName = 'a'.repeat(35)
      const result = extractVariables(`{{ ${longName} }}`)
      expect(result.warnings.some((w) => w.includes('very long'))).toBe(true)
    })

    it('should sort variables by first occurrence', () => {
      const result = extractVariables('{{ second }} then {{ first }} appears')
      expect(result.variables[0].name).toBe('second')
      expect(result.variables[1].name).toBe('first')
    })

    it('should track first occurrence position', () => {
      const result = extractVariables('Hello {{ name }}!')
      expect(result.variables[0].firstOccurrence).toBe(6)
    })
  })

  describe('extractVariablesFromMultiple', () => {
    it('should combine variables from multiple templates', () => {
      const result = extractVariablesFromMultiple([
        'System: {{ role }}',
        'User: {{ name }} asks about {{ topic }}',
      ])
      expect(result.variables).toHaveLength(3)
      expect(result.variables.map((v) => v.name).sort()).toEqual([
        'name',
        'role',
        'topic',
      ])
    })

    it('should deduplicate across templates', () => {
      const result = extractVariablesFromMultiple([
        '{{ name }} in template 1',
        '{{ name }} in template 2',
      ])
      expect(result.variables).toHaveLength(1)
      expect(result.variables[0].occurrenceCount).toBe(2)
    })

    it('should combine total placeholders', () => {
      const result = extractVariablesFromMultiple([
        '{{ a }} {{ b }}',
        '{{ c }} {{ a }}',
      ])
      expect(result.totalPlaceholders).toBe(4)
    })

    it('should track unmatched braces across templates', () => {
      const result = extractVariablesFromMultiple([
        '{{ valid }}',
        '{{ broken }',
      ])
      expect(result.hasUnmatchedBraces).toBe(true)
    })

    it('should deduplicate warnings', () => {
      const result = extractVariablesFromMultiple(['{{ x }}', '{{ x }}'])
      // Should only have one warning about short name
      const shortWarnings = result.warnings.filter((w) =>
        w.includes('very short')
      )
      expect(shortWarnings.length).toBeLessThanOrEqual(1)
    })

    it('should handle empty array', () => {
      const result = extractVariablesFromMultiple([])
      expect(result.variables).toHaveLength(0)
      expect(result.totalPlaceholders).toBe(0)
    })

    it('should sort merged variables by name', () => {
      const result = extractVariablesFromMultiple([
        '{{ zebra }}',
        '{{ apple }}',
      ])
      expect(result.variables[0].name).toBe('apple')
      expect(result.variables[1].name).toBe('zebra')
    })
  })

  describe('validateVariableName', () => {
    it('should accept valid variable names', () => {
      expect(validateVariableName('name').valid).toBe(true)
      expect(validateVariableName('user_name').valid).toBe(true)
      expect(validateVariableName('_private').valid).toBe(true)
      expect(validateVariableName('item1').valid).toBe(true)
    })

    it('should reject empty names', () => {
      const result = validateVariableName('')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('empty')
    })

    it('should reject names starting with numbers', () => {
      const result = validateVariableName('1name')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('letter or underscore')
    })

    it('should reject names with special characters', () => {
      const result = validateVariableName('user-name')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('letters, numbers, and underscores')
    })

    it('should reject names with spaces', () => {
      const result = validateVariableName('user name')
      expect(result.valid).toBe(false)
    })

    it('should reject names over 50 characters', () => {
      const result = validateVariableName('a'.repeat(51))
      expect(result.valid).toBe(false)
      expect(result.error).toContain('too long')
    })

    it('should accept names exactly 50 characters', () => {
      const result = validateVariableName('a'.repeat(50))
      expect(result.valid).toBe(true)
    })
  })

  describe('containsVariableSyntax', () => {
    it('should detect variable syntax', () => {
      expect(containsVariableSyntax('Hello {{ name }}')).toBe(true)
      expect(containsVariableSyntax('{{var}}')).toBe(true)
    })

    it('should return false for plain text', () => {
      expect(containsVariableSyntax('Hello world')).toBe(false)
      expect(containsVariableSyntax('')).toBe(false)
    })

    it('should return false for partial syntax', () => {
      expect(containsVariableSyntax('Hello { name }')).toBe(false)
      expect(containsVariableSyntax('Hello {{ }}')).toBe(false)
    })
  })

  describe('getTemplateSegments', () => {
    it('should split template into text and variable segments', () => {
      const segments = getTemplateSegments('Hello {{ name }}!')
      expect(segments).toHaveLength(3)
      expect(segments[0]).toEqual({ type: 'text', content: 'Hello ' })
      expect(segments[1]).toEqual({
        type: 'variable',
        content: '{{ name }}',
        variableName: 'name',
      })
      expect(segments[2]).toEqual({ type: 'text', content: '!' })
    })

    it('should handle template starting with variable', () => {
      const segments = getTemplateSegments('{{ greeting }} world')
      expect(segments[0]).toEqual({
        type: 'variable',
        content: '{{ greeting }}',
        variableName: 'greeting',
      })
      expect(segments[1]).toEqual({ type: 'text', content: ' world' })
    })

    it('should handle template ending with variable', () => {
      const segments = getTemplateSegments('Hello {{ name }}')
      expect(segments).toHaveLength(2)
      expect(segments[1].type).toBe('variable')
    })

    it('should handle multiple consecutive variables', () => {
      const segments = getTemplateSegments('{{ a }}{{ b }}')
      expect(segments).toHaveLength(2)
      expect(segments[0]).toEqual({
        type: 'variable',
        content: '{{ a }}',
        variableName: 'a',
      })
      expect(segments[1]).toEqual({
        type: 'variable',
        content: '{{ b }}',
        variableName: 'b',
      })
    })

    it('should handle empty template', () => {
      const segments = getTemplateSegments('')
      expect(segments).toHaveLength(0)
    })

    it('should handle template with no variables', () => {
      const segments = getTemplateSegments('Plain text')
      expect(segments).toHaveLength(1)
      expect(segments[0]).toEqual({ type: 'text', content: 'Plain text' })
    })
  })

  describe('getVariablePositions', () => {
    it('should return positions of all variables', () => {
      const positions = getVariablePositions('Hello {{ name }}!')
      expect(positions).toHaveLength(1)
      expect(positions[0]).toEqual({
        start: 6,
        end: 16,
        variableName: 'name',
      })
    })

    it('should return multiple positions', () => {
      const positions = getVariablePositions('{{ a }} and {{ b }}')
      expect(positions).toHaveLength(2)
      expect(positions[0].variableName).toBe('a')
      expect(positions[1].variableName).toBe('b')
    })

    it('should return empty array for no variables', () => {
      const positions = getVariablePositions('No variables here')
      expect(positions).toHaveLength(0)
    })

    it('should calculate correct positions with whitespace', () => {
      const positions = getVariablePositions('{{  name  }}')
      expect(positions[0].start).toBe(0)
      expect(positions[0].end).toBe(12)
    })
  })
})
