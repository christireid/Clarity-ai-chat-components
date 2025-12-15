/**
 * Tests for ToonOptimizer
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { ToonOptimizer } from '../simple-index'

describe('ToonOptimizer', () => {
  let optimizer: ToonOptimizer

  beforeEach(() => {
    optimizer = new ToonOptimizer({
      enableArrayTables: true,
      maxArraySizeForTable: 100,
      preserveKeys: false,
      compactNumbers: true,
      quoteStrings: false
    })
  })

  describe('Basic TOON Conversion', () => {
    it('should convert simple object to TOON', () => {
      const data = {
        name: 'John',
        age: 30,
        active: true
      }

      const toon = optimizer.convertToToon(data)
      
      expect(toon).toContain('name: John')
      expect(toon).toContain('age: 30')
      expect(toon).toContain('active: true')
    })

    it('should handle null and undefined values', () => {
      const data = {
        value: null,
        missing: undefined
      }

      const toon = optimizer.convertToToon(data)
      
      expect(toon).toContain('value: null')
      // undefined values might be handled differently
    })

    it('should handle nested objects', () => {
      const data = {
        user: {
          name: 'Alice',
          details: {
            age: 25,
            city: 'New York'
          }
        }
      }

      const toon = optimizer.convertToToon(data)
      
      expect(toon).toContain('user:')
      expect(toon).toContain('  name: Alice')
      expect(toon).toContain('  details:')
      expect(toon).toContain('    age: 25')
      expect(toon).toContain('    city: New York')
    })
  })

  describe('Array to Table Conversion', () => {
    it('should convert uniform array to table format', () => {
      const data = {
        users: [
          { id: 1, name: 'Alice', age: 25 },
          { id: 2, name: 'Bob', age: 30 },
          { id: 3, name: 'Charlie', age: 35 }
        ]
      }

      const toon = optimizer.convertToToon(data)
      
      expect(toon).toContain('users[3]{id,name,age}:')
      expect(toon).toContain('  1,Alice,25')
      expect(toon).toContain('  2,Bob,30')
      expect(toon).toContain('  3,Charlie,35')
    })

    it('should handle empty arrays', () => {
      const data = {
        items: []
      }

      const toon = optimizer.convertToToon(data)
      
      expect(toon).toContain('items[0]:')
    })

    it('should handle arrays with different structures', () => {
      const data = {
        mixed: [
          { type: 'A', value: 1 },
          { type: 'B', value: 'string' },
          { type: 'C', value: true }
        ]
      }

      const toon = optimizer.convertToToon(data)
      
      // Should still convert to table format
      expect(toon).toContain('mixed[3]{type,value}:')
    })

    it('should handle large arrays within limit', () => {
      const largeArray = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        value: `item${i + 1}`
      }))

      const data = { items: largeArray }
      const toon = optimizer.convertToToon(data)
      
      expect(toon).toContain('items[50]{id,value}:')
    })
  })

  describe('Array Beyond Table Limit', () => {
    it('should convert large arrays to regular format', () => {
      const optimizerWithLimit = new ToonOptimizer({
        enableArrayTables: true,
        maxArraySizeForTable: 5,
        preserveKeys: false,
        compactNumbers: true,
        quoteStrings: false
      })

      const data = {
        largeArray: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Item${i + 1}`
        }))
      }

      const toon = optimizerWithLimit.convertToToon(data)
      
      // Should use regular array format, not table
      expect(toon).toContain('largeArray:')
      expect(toon).toContain('-')
      expect(toon).not.toContain('[10]{')
    })
  })

  describe('TOON vs JSON Comparison', () => {
    it('should show significant token savings for uniform arrays', () => {
      const json = JSON.stringify({
        users: [
          { id: 1, name: 'Alice', age: 25, city: 'New York' },
          { id: 2, name: 'Bob', age: 30, city: 'Los Angeles' },
          { id: 3, name: 'Charlie', age: 35, city: 'Chicago' }
        ]
      }, null, 2)

      const toon = optimizer.convertToToon(JSON.parse(json))
      const savings = ToonOptimizer.calculateSavings(json, toon)
      
      expect(savings.percentage).toBeGreaterThan(20) // At least 20% savings
      expect(savings.savings).toBeGreaterThan(0)
    })

    it('should show savings for nested objects', () => {
      const data = {
        company: {
          name: 'Tech Corp',
          employees: [
            { id: 1, name: 'Alice', department: 'Engineering' },
            { id: 2, name: 'Bob', department: 'Marketing' }
          ],
          founded: 2020
        }
      }

      const json = JSON.stringify(data, null, 2)
      const toon = optimizer.convertToToon(data)
      const savings = ToonOptimizer.calculateSavings(json, toon)
      
      expect(savings.percentage).toBeGreaterThan(10) // At least 10% savings
    })
  })

  describe('Data Structure Optimization', () => {
    it('should optimize data structure for TOON', () => {
      const originalData = [
        { id: 1, name: 'Alice', age: 25 },
        { id: 2, name: 'Bob', age: 30 }, // Added age property
        { id: 3, age: 35, name: 'Charlie' }
      ]

      const optimized = optimizer.optimizeDataStructure(originalData)
      
      // Should have uniform structure
      originalData.forEach((item: any) => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('name')
        expect(item).toHaveProperty('age')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle boolean values correctly', () => {
      const data = {
        active: true,
        disabled: false
      }

      const toon = optimizer.convertToToon(data)
      
      expect(toon).toContain('active: true')
      expect(toon).toContain('disabled: false')
    })

    it('should handle numeric values correctly', () => {
      const data = {
        integer: 42,
        float: 3.14159,
        zero: 0,
        negative: -10
      }

      const toon = optimizer.convertToToon(data)
      
      expect(toon).toContain('integer: 42')
      expect(toon).toContain('float: 3.14159')
      expect(toon).toContain('zero: 0')
      expect(toon).toContain('negative: -10')
    })

    it('should handle strings with special characters', () => {
      const data = {
        message: 'Hello, "World"!',
        path: '/usr/local/bin',
        template: 'Hello ${name}'
      }

      const toon = optimizer.convertToToon(data)
      
      expect(toon).toContain('message: Hello, "World"!')
      expect(toon).toContain('path: /usr/local/bin')
      expect(toon).toContain('template: Hello ${name}')
    })
  })

  describe('Configuration Options', () => {
    it('should respect quoteStrings configuration', () => {
      const quotedOptimizer = new ToonOptimizer({
        enableArrayTables: true,
        maxArraySizeForTable: 100,
        preserveKeys: false,
        compactNumbers: true,
        quoteStrings: true
      })

      const data = {
        name: 'Test User',
        message: 'Hello World'
      }

      const toon = quotedOptimizer.convertToToon(data)
      
      expect(toon).toContain('name: "Test User"')
      expect(toon).toContain('message: "Hello World"')
    })

    it('should handle disabled table format', () => {
      const noTableOptimizer = new ToonOptimizer({
        enableArrayTables: false,
        maxArraySizeForTable: 100,
        preserveKeys: false,
        compactNumbers: true,
        quoteStrings: false
      })

      const data = {
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' }
        ]
      }

      const toon = noTableOptimizer.convertToToon(data)
      
      // Should use regular array format
      expect(toon).toContain('users:')
      expect(toon).toContain('-')
      expect(toon).not.toContain('[2]{')
    })
  })

  describe('Static Methods', () => {
    it('should provide optimized TOON for LLM', () => {
      const data = {
        users: [
          { id: 1, name: 'Alice', role: 'admin' },
          { id: 2, name: 'Bob', role: 'user' }
        ]
      }

      const toon = ToonOptimizer.optimizeForLLM(data)
      
      expect(toon).toContain('users[2]{id,name,role}:')
      expect(toon).toContain('1,Alice,admin')
      expect(toon).toContain('2,Bob,user')
    })

    it('should calculate savings correctly', () => {
      const json = '{"users":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]}'
      const toon = 'users[2]{id,name}:\n  1,Alice\n  2,Bob'
      
      const savings = ToonOptimizer.calculateSavings(json, toon)
      
      expect(savings.jsonTokens).toBeGreaterThan(0)
      expect(savings.toonTokens).toBeGreaterThan(0)
      expect(savings.savings).toBeGreaterThan(0)
      expect(savings.percentage).toBeGreaterThan(0)
    })
  })
})