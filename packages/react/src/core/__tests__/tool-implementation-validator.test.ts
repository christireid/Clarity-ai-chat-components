import { describe, it, expect, vi } from 'vitest'
import type { ToolDefinition } from '../../types/tool-definition'
import {
  validateToolImplementation,
  validateToolImplementationStrict,
  isToolImplementationSafe,
  getValidationSummary,
} from '../tool-implementation-validator'

describe('Tool Implementation Validator', () => {
  // Helper to create a valid tool
  const createValidTool = (): ToolDefinition => ({
    name: 'test_tool',
    description: 'A test tool',
    parameters: {
      type: 'object',
      properties: {
        input: { type: 'string' },
      },
    },
    execute: async (args: any) => {
      return { result: args.input }
    },
  })

  describe('validateToolImplementation', () => {
    describe('Valid Tools', () => {
      it('should validate a valid tool', () => {
        const tool = createValidTool()
        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })

      it('should validate tool with minimal configuration', () => {
        const tool: ToolDefinition = {
          name: 'minimal',
          description: 'Minimal tool',
          execute: async () => ({ success: true }),
        }

        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    describe('Missing Required Fields', () => {
      it('should fail if tool has no name', () => {
        const tool: any = {
          description: 'No name',
          execute: async () => ({}),
        }

        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(false)
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            code: 'MISSING_NAME',
            severity: 'error',
          })
        )
      })

      it('should warn if tool has no description', () => {
        const tool: ToolDefinition = {
          name: 'test',
          execute: async () => ({}),
        } as any

        const result = validateToolImplementation(tool)

        expect(result.warnings).toContainEqual(
          expect.objectContaining({
            code: 'MISSING_DESCRIPTION',
            severity: 'warning',
          })
        )
      })

      it('should fail if tool has no execute function', () => {
        const tool: any = {
          name: 'test',
          description: 'Test',
        }

        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(false)
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            code: 'MISSING_EXECUTE',
            severity: 'error',
          })
        )
      })

      it('should fail if execute is not a function', () => {
        const tool: any = {
          name: 'test',
          description: 'Test',
          execute: 'not a function',
        }

        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(false)
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            code: 'INVALID_EXECUTE',
            severity: 'error',
          })
        )
      })
    })

    describe('Dangerous Patterns', () => {
      it('should detect eval() usage', () => {
        const tool: ToolDefinition = {
          name: 'dangerous',
          description: 'Uses eval',
          execute: async (args: any) => {
            // This is intentionally bad code for testing
            const result = eval(args.code) // Should be detected
            return { result }
          },
        }

        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(false)
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            code: 'DANGEROUS_EVAL',
            severity: 'error',
          })
        )
      })

      it('should detect Function constructor usage', () => {
        const tool: ToolDefinition = {
          name: 'dangerous',
          description: 'Uses Function constructor',
          execute: async (args: any) => {
            const fn = new Function('x', 'return x * 2')
            return { result: fn(args.input) }
          },
        }

        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(false)
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            code: 'DANGEROUS_FUNCTION_CONSTRUCTOR',
            severity: 'error',
          })
        )
      })

      it('should detect exec() usage', () => {
        const tool: ToolDefinition = {
          name: 'dangerous',
          description: 'Uses exec',
          execute: async (args: any) => {
            // Simulate exec usage in string
            const code = 'exec(args.command)'
            return { result: code }
          },
        }

        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(false)
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            code: 'DANGEROUS_EXEC',
            severity: 'error',
          })
        )
      })

      it('should detect child_process usage', () => {
        const tool: ToolDefinition = {
          name: 'dangerous',
          description: 'Uses child_process',
          execute: async (args: any) => {
            // Reference child_process in function string
            const ref = 'child_process'
            return { result: ref }
          },
        }

        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(false)
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            code: 'DANGEROUS_CHILD_PROCESS',
            severity: 'error',
          })
        )
      })

      it('should detect vm module usage', () => {
        const tool: ToolDefinition = {
          name: 'dangerous',
          description: 'Uses vm module',
          execute: async (args: any) => {
            // Reference vm.runInContext
            const ref = 'vm.runInContext'
            return { result: ref }
          },
        }

        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(false)
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            code: 'DANGEROUS_VM_MODULE',
            severity: 'error',
          })
        )
      })
    })

    describe('Parameter Schema Validation', () => {
      it('should fail if parameters is not an object', () => {
        const tool: any = {
          name: 'test',
          description: 'Test',
          parameters: 'invalid',
          execute: async () => ({}),
        }

        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(false)
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            code: 'INVALID_PARAMETERS_SCHEMA',
            severity: 'error',
          })
        )
      })

      it('should fail if parameters is an array', () => {
        const tool: any = {
          name: 'test',
          description: 'Test',
          parameters: [],
          execute: async () => ({}),
        }

        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(false)
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            code: 'INVALID_PARAMETERS_SCHEMA',
            severity: 'error',
          })
        )
      })

      it('should warn if parameters schema has no type', () => {
        const tool: ToolDefinition = {
          name: 'test',
          description: 'Test',
          parameters: {
            properties: { input: { type: 'string' } },
          } as any,
          execute: async () => ({}),
        }

        const result = validateToolImplementation(tool)

        expect(result.warnings).toContainEqual(
          expect.objectContaining({
            code: 'MISSING_SCHEMA_TYPE',
            severity: 'warning',
          })
        )
      })

      it('should inform if parameters has no properties', () => {
        const tool: ToolDefinition = {
          name: 'test',
          description: 'Test',
          parameters: {
            type: 'object',
          },
          execute: async () => ({}),
        }

        const result = validateToolImplementation(tool)

        expect(result.issues).toContainEqual(
          expect.objectContaining({
            code: 'NO_PARAMETERS',
            severity: 'info',
          })
        )
      })

      it('should inform if tool has no parameter schema', () => {
        const tool: ToolDefinition = {
          name: 'test',
          description: 'Test',
          execute: async () => ({}),
        }

        const result = validateToolImplementation(tool)

        expect(result.issues).toContainEqual(
          expect.objectContaining({
            code: 'NO_PARAMETER_SCHEMA',
            severity: 'info',
          })
        )
      })
    })

    describe('Timeout Validation', () => {
      it('should fail if timeout is not a number', () => {
        const tool: any = {
          name: 'test',
          description: 'Test',
          timeout: 'invalid',
          execute: async () => ({}),
        }

        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(false)
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            code: 'INVALID_TIMEOUT',
            severity: 'error',
          })
        )
      })

      it('should fail if timeout is negative', () => {
        const tool: ToolDefinition = {
          name: 'test',
          description: 'Test',
          timeout: -1000,
          execute: async () => ({}),
        }

        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(false)
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            code: 'INVALID_TIMEOUT',
            severity: 'error',
          })
        )
      })

      it('should warn if timeout is excessive', () => {
        const tool: ToolDefinition = {
          name: 'test',
          description: 'Test',
          timeout: 120000, // 2 minutes
          execute: async () => ({}),
        }

        const result = validateToolImplementation(tool)

        expect(result.warnings).toContainEqual(
          expect.objectContaining({
            code: 'EXCESSIVE_TIMEOUT',
            severity: 'warning',
          })
        )
      })

      it('should accept reasonable timeout', () => {
        const tool: ToolDefinition = {
          name: 'test',
          description: 'Test',
          timeout: 30000, // 30 seconds
          execute: async () => ({}),
        }

        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    describe('Function Signature Validation', () => {
      it('should warn if execute function has too many parameters', () => {
        const tool: ToolDefinition = {
          name: 'test',
          description: 'Test',
          execute: async (args: any, ctx: any, extra: any) => {
            return {}
          },
        }

        const result = validateToolImplementation(tool)

        expect(result.warnings).toContainEqual(
          expect.objectContaining({
            code: 'SUSPICIOUS_SIGNATURE',
            severity: 'warning',
          })
        )
      })

      it('should accept execute with 1 parameter', () => {
        const tool: ToolDefinition = {
          name: 'test',
          description: 'Test',
          execute: async (args: any) => ({}),
        }

        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(true)
      })

      it('should accept execute with 2 parameters', () => {
        const tool: ToolDefinition = {
          name: 'test',
          description: 'Test',
          execute: async (args: any, ctx: any) => ({}),
        }

        const result = validateToolImplementation(tool)

        expect(result.valid).toBe(true)
      })
    })

    describe('Caching Validation', () => {
      it('should warn if cacheable but no cacheKey function', () => {
        const tool: ToolDefinition = {
          name: 'test',
          description: 'Test',
          cacheable: true,
          execute: async () => ({}),
        }

        const result = validateToolImplementation(tool)

        expect(result.warnings).toContainEqual(
          expect.objectContaining({
            code: 'CACHEABLE_WITHOUT_KEY',
            severity: 'warning',
          })
        )
      })

      it('should not warn if cacheable with cacheKey', () => {
        const tool: ToolDefinition = {
          name: 'test',
          description: 'Test',
          cacheable: true,
          cacheKey: (args) => `key_${JSON.stringify(args)}`,
          execute: async () => ({}),
        }

        const result = validateToolImplementation(tool)

        const cacheableWarning = result.warnings.find(
          (w) => w.code === 'CACHEABLE_WITHOUT_KEY'
        )
        expect(cacheableWarning).toBeUndefined()
      })
    })

    describe('Tool Name Validation', () => {
      it('should warn about dangerous tool names', () => {
        const dangerousNames = ['exec', 'eval', 'system', 'shell', 'command']

        for (const name of dangerousNames) {
          const tool: ToolDefinition = {
            name,
            description: 'Test',
            execute: async () => ({}),
          }

          const result = validateToolImplementation(tool)

          expect(result.warnings).toContainEqual(
            expect.objectContaining({
              code: 'SUSPICIOUS_TOOL_NAME',
              severity: 'warning',
            })
          )
        }
      })

      it('should not warn about safe tool names', () => {
        const tool: ToolDefinition = {
          name: 'get_weather',
          description: 'Test',
          execute: async () => ({}),
        }

        const result = validateToolImplementation(tool)

        const nameWarning = result.warnings.find(
          (w) => w.code === 'SUSPICIOUS_TOOL_NAME'
        )
        expect(nameWarning).toBeUndefined()
      })
    })

    describe('Approval Requirements', () => {
      it('should warn if sensitive tool lacks approval requirement', () => {
        const sensitivePatterns = [
          'delete',
          'remove',
          'destroy',
          'drop',
          'truncate',
        ]

        for (const pattern of sensitivePatterns) {
          const tool: ToolDefinition = {
            name: `${pattern}_item`,
            description: 'Sensitive operation',
            execute: async () => ({}),
          }

          const result = validateToolImplementation(tool)

          expect(result.warnings).toContainEqual(
            expect.objectContaining({
              code: 'SENSITIVE_WITHOUT_APPROVAL',
              severity: 'warning',
            })
          )
        }
      })

      it('should not warn if sensitive tool requires approval', () => {
        const tool: ToolDefinition = {
          name: 'delete_item',
          description: 'Delete an item',
          requiresApproval: true,
          execute: async () => ({}),
        }

        const result = validateToolImplementation(tool)

        const approvalWarning = result.warnings.find(
          (w) => w.code === 'SENSITIVE_WITHOUT_APPROVAL'
        )
        expect(approvalWarning).toBeUndefined()
      })
    })
  })

  describe('validateToolImplementationStrict', () => {
    it('should not throw for valid tool', () => {
      const tool = createValidTool()

      expect(() => {
        validateToolImplementationStrict(tool)
      }).not.toThrow()
    })

    it('should throw for invalid tool', () => {
      const tool: any = {
        name: 'invalid',
        // Missing execute
      }

      expect(() => {
        validateToolImplementationStrict(tool)
      }).toThrow(/validation failed/)
    })

    it('should log warnings but not throw', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const tool: ToolDefinition = {
        name: 'test',
        // Missing description (warning)
        execute: async () => ({}),
      } as any

      expect(() => {
        validateToolImplementationStrict(tool)
      }).not.toThrow()

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('isToolImplementationSafe', () => {
    it('should return true for safe tool', () => {
      const tool = createValidTool()

      expect(isToolImplementationSafe(tool)).toBe(true)
    })

    it('should return false for tool with eval', () => {
      const tool: ToolDefinition = {
        name: 'unsafe',
        description: 'Unsafe',
        execute: async (args: any) => {
          return { result: eval(args.code) }
        },
      }

      expect(isToolImplementationSafe(tool)).toBe(false)
    })

    it('should return false for tool with Function constructor', () => {
      const tool: ToolDefinition = {
        name: 'unsafe',
        description: 'Unsafe',
        execute: async (args: any) => {
          const fn = new Function('return 42')
          return { result: fn() }
        },
      }

      expect(isToolImplementationSafe(tool)).toBe(false)
    })

    it('should return true despite warnings', () => {
      const tool: ToolDefinition = {
        name: 'test',
        // Missing description (warning, not security issue)
        execute: async () => ({}),
      } as any

      expect(isToolImplementationSafe(tool)).toBe(true)
    })
  })

  describe('getValidationSummary', () => {
    it('should return success message for valid tool', () => {
      const tool = createValidTool()
      const result = validateToolImplementation(tool)
      const summary = getValidationSummary(result)

      expect(summary).toContain('✓')
      expect(summary).toContain('valid')
    })

    it('should show error count for invalid tool', () => {
      const tool: any = { name: 'test' } // Missing execute
      const result = validateToolImplementation(tool)
      const summary = getValidationSummary(result)

      expect(summary).toContain('✗')
      expect(summary).toContain('error')
    })

    it('should show warning count', () => {
      const tool: ToolDefinition = {
        name: 'test',
        // Missing description
        execute: async () => ({}),
      } as any
      const result = validateToolImplementation(tool)
      const summary = getValidationSummary(result)

      expect(summary).toContain('⚠')
      expect(summary).toContain('warning')
    })
  })
})
