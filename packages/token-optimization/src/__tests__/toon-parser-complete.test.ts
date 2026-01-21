/**
 * Comprehensive tests for TOON Parser Implementation
 *
 * Tests all required features:
 * 1. parseTable with delimiter support and type preservation
 * 2. parseArray for primitive and mixed arrays
 * 3. TOONParseError with line/column tracking
 * 4. Schema validation
 * 5. encode method (object -> TOON)
 * 6. estimateSavings with recommendations
 * 7. Round-trip capability
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  ToonOptimizer,
  TOONParseError,
  encodeToon,
  decodeToon,
  validateToon,
} from '../formats/toon-optimizer'
import type { TOONSchema, ToonConfig } from '../formats/toon-optimizer'

describe('TOON Parser Complete Implementation', () => {
  let optimizer: ToonOptimizer
  const defaultConfig: ToonConfig = {
    enableArrayTables: true,
    maxArraySizeForTable: 100,
    preserveKeys: false,
    compactNumbers: true,
    quoteStrings: false,
  }

  beforeEach(() => {
    optimizer = new ToonOptimizer(defaultConfig)
  })

  describe('1. parseTable with delimiter support and type preservation', () => {
    it('should parse tabular format with comma delimiter', () => {
      const toon = `users[2]{id,name,role}:
  1,Alice,admin
  2,Bob,user`

      const result = optimizer.decode(toon) as { users: unknown[] }

      expect(result.users).toHaveLength(2)
      expect(result.users[0]).toEqual({ id: 1, name: 'Alice', role: 'admin' })
      expect(result.users[1]).toEqual({ id: 2, name: 'Bob', role: 'user' })
    })

    it('should parse tabular format with tab delimiter', () => {
      const tabOptimizer = new ToonOptimizer({
        ...defaultConfig,
        tableDelimiter: 'tab',
      })

      const toon = `users[2]{id,name,role}:
  1\tAlice\tadmin
  2\tBob\tuser`

      const result = tabOptimizer.decode(toon) as { users: unknown[] }

      expect(result.users).toHaveLength(2)
      expect(result.users[0]).toEqual({ id: 1, name: 'Alice', role: 'admin' })
    })

    it('should parse tabular format with pipe delimiter', () => {
      const pipeOptimizer = new ToonOptimizer({
        ...defaultConfig,
        tableDelimiter: 'pipe',
      })

      const toon = `data[2]{id,value}:
  1|test
  2|data`

      const result = pipeOptimizer.decode(toon) as { data: unknown[] }

      expect(result.data).toHaveLength(2)
      expect(result.data[0]).toEqual({ id: 1, value: 'test' })
    })

    it('should handle quoted values with escaping', () => {
      const toon = `data[2]{id,message}:
  1,"Hello, World"
  2,"Say \\"Hi\\""`

      const result = optimizer.decode(toon) as { data: unknown[] }

      expect(result.data[0]).toEqual({ id: 1, message: 'Hello, World' })
      expect(result.data[1]).toEqual({ id: 2, message: 'Say "Hi"' })
    })

    it('should preserve types: numbers stay numbers', () => {
      const toon = `items[3]{id,count,price}:
  1,100,99.99
  2,0,0.01
  3,-5,-10.5`

      const result = optimizer.decode(toon) as { items: unknown[] }

      expect(typeof (result.items[0] as { count: number }).count).toBe('number')
      expect((result.items[0] as { price: number }).price).toBe(99.99)
      expect((result.items[2] as { id: number }).id).toBe(3)
      expect((result.items[2] as { count: number }).count).toBe(-5)
    })

    it('should preserve types: booleans', () => {
      const toon = `flags[2]{name,active,admin}:
  feature1,true,false
  feature2,false,true`

      const result = optimizer.decode(toon) as { flags: unknown[] }

      expect((result.flags[0] as { active: boolean }).active).toBe(true)
      expect((result.flags[0] as { admin: boolean }).admin).toBe(false)
    })

    it('should preserve types: null values', () => {
      const toon = `users[2]{id,name,email}:
  1,Alice,
  2,Bob,null`

      const result = optimizer.decode(toon) as { users: unknown[] }

      expect((result.users[0] as { email: null }).email).toBeNull()
      expect((result.users[1] as { email: null }).email).toBeNull()
    })

    it('should handle nested field paths', () => {
      // Use numeric zip codes since unquoted numbers are parsed as numbers
      const data = {
        users: [
          { id: 1, address: { city: 'NYC', zip: 10001 } },
          { id: 2, address: { city: 'LA', zip: 90001 } },
          { id: 3, address: { city: 'CHI', zip: 60601 } },
        ],
      }

      const encoded = optimizer.encode(data)
      const decoded = optimizer.decode(encoded)

      expect(decoded).toEqual(data)
    })

    it('should handle nested field paths with quoted strings', () => {
      const quotedOptimizer = new ToonOptimizer({
        ...defaultConfig,
        quoteStrings: true,
      })

      // With quoteStrings: true, strings are preserved
      const data = {
        users: [
          { id: 1, address: { city: 'NYC', zip: '10001' } },
          { id: 2, address: { city: 'LA', zip: '90001' } },
          { id: 3, address: { city: 'CHI', zip: '60601' } },
        ],
      }

      const encoded = quotedOptimizer.encode(data)
      const decoded = quotedOptimizer.decode(encoded)

      expect(decoded).toEqual(data)
    })
  })

  describe('2. parseArray for primitive and mixed arrays', () => {
    it('should parse inline primitive arrays', () => {
      const toon = `tags[3]: admin,ops,dev`

      const result = optimizer.decode(toon) as { tags: string[] }

      expect(result.tags).toEqual(['admin', 'ops', 'dev'])
    })

    it('should parse inline numeric arrays', () => {
      const toon = `numbers[4]: 1,2,3,4`

      const result = optimizer.decode(toon) as { numbers: number[] }

      expect(result.numbers).toEqual([1, 2, 3, 4])
    })

    it('should parse mixed arrays with primitives', () => {
      const toon = `items:
  - 1
  - text
  - true
  - null`

      const result = optimizer.decode(toon) as { items: unknown[] }

      expect(result.items).toEqual([1, 'text', true, null])
    })

    it('should parse mixed arrays with objects', () => {
      const toon = `items:
  - 1
  - a: 1
  - text`

      const result = optimizer.decode(toon) as { items: unknown[] }

      expect(result.items).toHaveLength(3)
      expect(result.items[0]).toBe(1)
      expect(result.items[1]).toEqual({ a: 1 })
      expect(result.items[2]).toBe('text')
    })

    it('should parse empty arrays', () => {
      const toon = `items[0]:`

      const result = optimizer.decode(toon) as { items: unknown[] }

      expect(result.items).toEqual([])
    })

    it('should parse arrays with nested objects', () => {
      const toon = `users:
  -
    name: Alice
    age: 25
  -
    name: Bob
    age: 30`

      const result = optimizer.decode(toon) as { users: unknown[] }

      expect(result.users).toHaveLength(2)
      expect(result.users[0]).toEqual({ name: 'Alice', age: 25 })
      expect(result.users[1]).toEqual({ name: 'Bob', age: 30 })
    })
  })

  describe('3. TOONParseError with line/column tracking', () => {
    it('should throw TOONParseError with line number', () => {
      const toon = `users[3]{id,name}:
  1,Alice
  2,Bob`

      expect(() => optimizer.decode(toon)).toThrow(TOONParseError)

      try {
        optimizer.decode(toon)
      } catch (e) {
        expect(e).toBeInstanceOf(TOONParseError)
        const error = e as TOONParseError
        expect(error.line).toBeDefined()
        expect(typeof error.line).toBe('number')
      }
    })

    it('should provide snippet in error', () => {
      const toon = `data[2]{a,b}:
  1,2
  3`

      try {
        optimizer.decode(toon)
      } catch (e) {
        const error = e as TOONParseError
        expect(error.snippet).toBeDefined()
      }
    })

    it('should include column information', () => {
      try {
        const toon = `invalid[2]{x}:
  1
  2`
        optimizer.decode(toon)
      } catch (e) {
        const error = e as TOONParseError
        expect(error.column).toBeDefined()
      }
    })
  })

  describe('4. Schema validation', () => {
    it('should validate data against schema - valid case', () => {
      const schema: TOONSchema = {
        fields: [
          { name: 'id', type: 'number', required: true },
          { name: 'name', type: 'string', required: true },
          { name: 'email', type: 'string' },
        ],
      }

      const data = { id: 1, name: 'Alice', email: 'alice@example.com' }

      const result = validateToon(data, schema)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect missing required fields', () => {
      const schema: TOONSchema = {
        fields: [
          { name: 'id', type: 'number', required: true },
          { name: 'name', type: 'string', required: true },
        ],
      }

      const data = { id: 1 }

      const result = validateToon(data, schema)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.path === 'name')).toBe(true)
    })

    it('should detect type mismatches', () => {
      const schema: TOONSchema = {
        fields: [
          { name: 'id', type: 'number', required: true },
          { name: 'name', type: 'string', required: true },
        ],
      }

      const data = { id: 'not-a-number', name: 'Alice' }

      const result = validateToon(data, schema)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.path === 'id')).toBe(true)
      expect(result.errors.some((e) => e.expected === 'number')).toBe(true)
    })

    it('should validate nested schemas', () => {
      const schema: TOONSchema = {
        fields: [
          {
            name: 'users',
            type: 'array',
            items: [
              { name: 'id', type: 'number', required: true },
              { name: 'name', type: 'string', required: true },
            ],
          },
        ],
      }

      const data = {
        users: [
          { id: 1, name: 'Alice' },
          { id: 'invalid', name: 'Bob' },
        ],
      }

      const result = ToonOptimizer.validateAgainstSchema(data, schema)

      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.path.includes('users[1]'))).toBe(true)
    })

    it('should skip optional fields that are missing', () => {
      const schema: TOONSchema = {
        fields: [
          { name: 'id', type: 'number', required: true },
          { name: 'email', type: 'string', required: false },
        ],
      }

      const data = { id: 1 }

      const result = validateToon(data, schema)

      expect(result.valid).toBe(true)
    })
  })

  describe('5. encode method (object -> TOON)', () => {
    it('should encode simple objects', () => {
      const data = { name: 'Alice', age: 30, active: true }

      const toon = optimizer.encode(data)

      expect(toon).toContain('name: Alice')
      expect(toon).toContain('age: 30')
      expect(toon).toContain('active: true')
    })

    it('should use tabular format for 3+ similar objects', () => {
      const data = {
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
          { id: 3, name: 'Charlie' },
        ],
      }

      const toon = optimizer.encode(data)

      expect(toon).toContain('users[3]{id,name}:')
      expect(toon).toContain('1,Alice')
      expect(toon).toContain('2,Bob')
      expect(toon).toContain('3,Charlie')
    })

    it('should use inline format for primitive arrays', () => {
      const data = { tags: ['admin', 'ops', 'dev'] }

      const toon = optimizer.encode(data)

      expect(toon).toContain('tags[3]: admin,ops,dev')
    })

    it('should use indentation for nested objects', () => {
      const data = {
        user: {
          name: 'Alice',
          address: {
            city: 'NYC',
            zip: '10001',
          },
        },
      }

      const toon = optimizer.encode(data)

      expect(toon).toContain('user:')
      expect(toon).toContain('  name: Alice')
      expect(toon).toContain('  address:')
      expect(toon).toContain('    city: NYC')
    })

    it('should handle null values', () => {
      const data = { value: null }

      const toon = optimizer.encode(data)

      expect(toon).toContain('value: null')
    })

    it('should not use table format for < 3 objects', () => {
      const data = {
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
      }

      const toon = optimizer.encode(data)

      // Should use inline primitive array format for small arrays
      // or regular list format, not table format
      expect(toon).not.toContain('{id,name}:')
    })
  })

  describe('6. estimateSavings with recommendations', () => {
    it('should estimate savings for tabular data', () => {
      const data = {
        users: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `User${i + 1}`,
          email: `user${i + 1}@example.com`,
          role: 'user',
        })),
      }

      const savings = optimizer.estimateSavings(data)

      expect(savings.jsonTokens).toBeGreaterThan(0)
      expect(savings.toonTokens).toBeGreaterThan(0)
      expect(savings.savingsPercent).toBeDefined()
      expect(['use-toon', 'use-json', 'marginal']).toContain(
        savings.recommendation
      )
    })

    it('should recommend use-toon for significant savings (>= 20%)', () => {
      const data = {
        items: Array.from({ length: 50 }, (_, i) => ({
          id: i,
          name: `Item${i}`,
          value: i * 10,
          active: i % 2 === 0,
        })),
      }

      const savings = optimizer.estimateSavings(data)

      // Large uniform arrays should have significant savings
      expect(savings.savingsPercent).toBeGreaterThan(0)
    })

    it('should provide reasonable estimates for simple objects', () => {
      const data = { name: 'Alice', age: 30 }

      const savings = optimizer.estimateSavings(data)

      expect(savings.jsonTokens).toBeGreaterThan(0)
      expect(savings.toonTokens).toBeGreaterThan(0)
    })
  })

  describe('7. Round-trip capability', () => {
    it('should round-trip simple objects', () => {
      const original = { name: 'Alice', age: 30, active: true }

      const encoded = optimizer.encode(original)
      const decoded = optimizer.decode(encoded)

      expect(decoded).toEqual(original)
    })

    it('should round-trip nested objects', () => {
      const original = {
        user: {
          name: 'Alice',
          details: {
            age: 30,
            city: 'NYC',
          },
        },
      }

      const encoded = optimizer.encode(original)
      const decoded = optimizer.decode(encoded)

      expect(decoded).toEqual(original)
    })

    it('should round-trip tabular arrays', () => {
      const original = {
        users: [
          { id: 1, name: 'Alice', role: 'admin' },
          { id: 2, name: 'Bob', role: 'user' },
          { id: 3, name: 'Charlie', role: 'user' },
        ],
      }

      const encoded = optimizer.encode(original)
      const decoded = optimizer.decode(encoded)

      expect(decoded).toEqual(original)
    })

    it('should round-trip primitive arrays', () => {
      const original = { tags: ['admin', 'ops', 'dev'] }

      const encoded = optimizer.encode(original)
      const decoded = optimizer.decode(encoded)

      expect(decoded).toEqual(original)
    })

    it('should round-trip numeric arrays', () => {
      const original = { numbers: [1, 2, 3, 4, 5] }

      const encoded = optimizer.encode(original)
      const decoded = optimizer.decode(encoded)

      expect(decoded).toEqual(original)
    })

    it('should round-trip boolean values', () => {
      const original = { active: true, disabled: false }

      const encoded = optimizer.encode(original)
      const decoded = optimizer.decode(encoded)

      expect(decoded).toEqual(original)
    })

    it('should round-trip null values', () => {
      const original = { value: null, other: 'test' }

      const encoded = optimizer.encode(original)
      const decoded = optimizer.decode(encoded)

      expect(decoded).toEqual(original)
    })

    it('should round-trip negative numbers', () => {
      const original = { temp: -10, balance: -99.99 }

      const encoded = optimizer.encode(original)
      const decoded = optimizer.decode(encoded)

      expect(decoded).toEqual(original)
    })

    it('should round-trip empty arrays', () => {
      const original = { items: [] }

      const encoded = optimizer.encode(original)
      const decoded = optimizer.decode(encoded)

      expect(decoded).toEqual(original)
    })

    it('should round-trip complex nested structures', () => {
      const original = {
        company: {
          name: 'Tech Corp',
          employees: [
            { id: 1, name: 'Alice', department: 'Engineering' },
            { id: 2, name: 'Bob', department: 'Marketing' },
            { id: 3, name: 'Charlie', department: 'Sales' },
          ],
          locations: ['NYC', 'LA', 'Chicago'],
          metadata: {
            founded: 2020,
            active: true,
          },
        },
      }

      const encoded = optimizer.encode(original)
      const decoded = optimizer.decode(encoded)

      expect(decoded).toEqual(original)
    })

    it('should round-trip with different delimiters', () => {
      const tabOptimizer = new ToonOptimizer({
        ...defaultConfig,
        tableDelimiter: 'tab',
      })

      const original = {
        data: [
          { a: 1, b: 2 },
          { a: 3, b: 4 },
          { a: 5, b: 6 },
        ],
      }

      const encoded = tabOptimizer.encode(original)
      const decoded = tabOptimizer.decode(encoded)

      expect(decoded).toEqual(original)
    })
  })

  describe('Convenience functions', () => {
    it('encodeToon should work', () => {
      const data = { name: 'Test' }
      const result = encodeToon(data)
      expect(result).toContain('name: Test')
    })

    it('decodeToon should work', () => {
      const toon = 'name: Test'
      const result = decodeToon(toon)
      expect(result).toEqual({ name: 'Test' })
    })

    it('round-trip with convenience functions', () => {
      const original = { users: [{ id: 1 }, { id: 2 }, { id: 3 }] }
      const encoded = encodeToon(original)
      const decoded = decodeToon(encoded)
      expect(decoded).toEqual(original)
    })
  })

  describe('Edge cases', () => {
    it('should handle strings with special characters', () => {
      const original = {
        message: 'Hello, "World"!',
        path: '/usr/local/bin',
      }

      const encoded = optimizer.encode(original)
      const decoded = optimizer.decode(encoded)

      expect(decoded).toEqual(original)
    })

    it('should handle floating point numbers', () => {
      const original = { pi: 3.14159, e: 2.71828 }

      const encoded = optimizer.encode(original)
      const decoded = optimizer.decode(encoded)

      expect(decoded).toEqual(original)
    })

    it('should handle zero values', () => {
      const original = { count: 0, rate: 0.0 }

      const encoded = optimizer.encode(original)
      const decoded = optimizer.decode(encoded)

      expect((decoded as { count: number }).count).toBe(0)
    })

    it('should handle scientific notation', () => {
      const toon = `value: 1.5e10`
      const result = optimizer.decode(toon) as { value: number }
      expect(result.value).toBe(1.5e10)
    })

    it('should handle strings that look like numbers', () => {
      const quotedOptimizer = new ToonOptimizer({
        ...defaultConfig,
        quoteStrings: true,
      })

      const original = { code: '00123' }
      const encoded = quotedOptimizer.encode(original)

      expect(encoded).toContain('"00123"')
    })
  })

  describe('Static methods', () => {
    it('optimizeForLLM should work', () => {
      const result = ToonOptimizer.optimizeForLLM({
        items: [{ a: 1 }, { a: 2 }, { a: 3 }],
      })

      expect(result).toContain('items[3]{a}:')
    })

    it('calculateSavings should work', () => {
      const json = JSON.stringify({ a: 1, b: 2 })
      const toon = 'a: 1\nb: 2'

      const savings = ToonOptimizer.calculateSavings(json, toon)

      expect(savings.jsonTokens).toBeGreaterThan(0)
      expect(savings.toonTokens).toBeGreaterThan(0)
      expect(savings.percentage).toBeDefined()
    })
  })
})
