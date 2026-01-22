import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  requireString,
  requireNumber,
  requireBoolean,
  requireArray,
  optional,
  requireEnum,
  withErrorHandling,
  userError,
  stringParam,
  numberParam,
  integerParam,
  booleanParam,
  enumParam,
  arrayParam,
  createReadOnlyTool,
  createApprovalTool,
  createAPITool,
} from '../tool-helpers'

describe('Tool Helpers', () => {
  describe('Input Validation', () => {
    describe('requireString', () => {
      it('should return trimmed string', () => {
        const args = { name: '  test  ' }
        expect(requireString(args, 'name')).toBe('test')
      })

      it('should throw if missing', () => {
        expect(() => requireString({}, 'name')).toThrow()
      })

      it('should throw if not string', () => {
        expect(() => requireString({ name: 123 }, 'name')).toThrow()
      })

      it('should throw if empty', () => {
        expect(() => requireString({ name: '  ' }, 'name')).toThrow()
      })
    })

    describe('requireNumber', () => {
      it('should return number', () => {
        const args = { age: 25 }
        expect(requireNumber(args, 'age')).toBe(25)
      })

      it('should throw if missing', () => {
        expect(() => requireNumber({}, 'age')).toThrow()
      })

      it('should throw if not number', () => {
        expect(() => requireNumber({ age: '25' }, 'age')).toThrow()
      })

      it('should validate min', () => {
        expect(() =>
          requireNumber({ age: 5 }, 'age', undefined, { min: 10 })
        ).toThrow()
      })

      it('should validate max', () => {
        expect(() =>
          requireNumber({ age: 15 }, 'age', undefined, { max: 10 })
        ).toThrow()
      })

      it('should validate integer', () => {
        expect(() =>
          requireNumber({ age: 5.5 }, 'age', undefined, { integer: true })
        ).toThrow()
      })
    })

    describe('requireBoolean', () => {
      it('should return boolean', () => {
        expect(requireBoolean({ active: true }, 'active')).toBe(true)
        expect(requireBoolean({ active: false }, 'active')).toBe(false)
      })

      it('should throw if missing', () => {
        expect(() => requireBoolean({}, 'active')).toThrow()
      })

      it('should throw if not boolean', () => {
        expect(() => requireBoolean({ active: 'true' }, 'active')).toThrow()
      })
    })

    describe('requireArray', () => {
      it('should return array', () => {
        const list = [1, 2, 3]
        expect(requireArray({ list }, 'list')).toBe(list)
      })

      it('should throw if missing', () => {
        expect(() => requireArray({}, 'list')).toThrow()
      })

      it('should throw if not array', () => {
        expect(() => requireArray({ list: '1,2,3' }, 'list')).toThrow()
      })

      it('should validate minLength', () => {
        expect(() =>
          requireArray({ list: [1] }, 'list', undefined, { minLength: 2 })
        ).toThrow()
      })

      it('should validate maxLength', () => {
        expect(() =>
          requireArray({ list: [1, 2, 3] }, 'list', undefined, { maxLength: 2 })
        ).toThrow()
      })
    })

    describe('optional', () => {
      it('should return value if present', () => {
        expect(optional({ val: 'test' }, 'val', 'default')).toBe('test')
      })

      it('should return default if missing', () => {
        expect(optional({}, 'val', 'default')).toBe('default')
      })
    })

    describe('requireEnum', () => {
      it('should return value if in allowed list', () => {
        expect(
          requireEnum({ status: 'active' }, 'status', ['active', 'inactive'])
        ).toBe('active')
      })

      it('should throw if not in allowed list', () => {
        expect(() =>
          requireEnum({ status: 'pending' }, 'status', ['active', 'inactive'])
        ).toThrow()
      })
    })
  })

  describe('Error Handling', () => {
    describe('withErrorHandling', () => {
      it('should pass through result on success', async () => {
        const fn = withErrorHandling(async () => 'success')
        expect(await fn({}, {})).toBe('success')
      })

      it('should wrap error with context message', async () => {
        const fn = withErrorHandling(async () => {
          throw new Error('fail')
        }, 'Context')
        await expect(fn({}, {})).rejects.toThrow('Context: fail')
      })

      it('should rethrow error if no context message', async () => {
        const fn = withErrorHandling(async () => {
          throw new Error('fail')
        })
        await expect(fn({}, {})).rejects.toThrow('fail')
      })
    })

    describe('userError', () => {
      it('should create error with message', () => {
        const err = userError('msg')
        expect(err.message).toBe('msg')
      })

      it('should include hint', () => {
        const err = userError('msg', { hint: 'try this' })
        expect(err.message).toContain('Hint: try this')
      })

      it('should include field', () => {
        const err = userError('msg', { field: 'email' })
        expect(err.message).toContain('Field: email')
      })

      it('should include value', () => {
        const err = userError('msg', { value: 123 })
        expect(err.message).toContain('Provided value: 123')
      })

      it('should attach code', () => {
        const err = userError('msg', { code: 'ERR_001' })
        expect((err as any).code).toBe('ERR_001')
      })
    })
  })

  describe('Parameter Schemas', () => {
    it('should create string param', () => {
      const schema = stringParam('desc', { minLength: 5, pattern: '.*' })
      expect(schema).toEqual({
        type: 'string',
        description: 'desc',
        minLength: 5,
        pattern: '.*',
        maxLength: undefined,
        default: undefined,
      })
    })

    it('should create number param', () => {
      const schema = numberParam('desc', { minimum: 0, maximum: 10 })
      expect(schema).toEqual({
        type: 'number',
        description: 'desc',
        minimum: 0,
        maximum: 10,
        default: undefined,
      })
    })

    it('should create boolean param', () => {
      const schema = booleanParam('desc', true)
      expect(schema).toEqual({
        type: 'boolean',
        description: 'desc',
        default: true,
      })
    })

    it('should create enum param', () => {
      const schema = enumParam('desc', ['a', 'b'], 'a')
      expect(schema).toEqual({
        type: 'string',
        description: 'desc',
        enum: ['a', 'b'],
        default: 'a',
      })
    })

    it('should create array param', () => {
      const schema = arrayParam('desc', 'string', { minItems: 1 })
      expect(schema).toEqual({
        type: 'array',
        description: 'desc',
        items: { type: 'string' },
        minItems: 1,
        maxItems: undefined,
      })
    })
  })

  describe('Tool Templates', () => {
    it('should create read-only tool', async () => {
      const execute = vi.fn().mockResolvedValue('result')
      const tool = createReadOnlyTool({
        name: 'tool',
        description: 'desc',
        parameters: { arg: stringParam('arg') },
        required: ['arg'],
        execute,
      })

      expect(tool.requiresApproval).toBe(false)
      expect(tool.cacheable).toBe(true)
      expect(tool.parameters.required).toEqual(['arg'])

      await tool.execute({ arg: 'val' }, {} as any)
      expect(execute).toHaveBeenCalled()
    })

    it('should create approval tool', () => {
      const tool = createApprovalTool({
        name: 'tool',
        description: 'desc',
        parameters: {},
        execute: async () => {},
      })

      expect(tool.requiresApproval).toBe(true)
      expect(tool.cacheable).toBe(false)
    })

    describe('createAPITool', () => {
      const fetchMock = vi.fn()

      beforeEach(() => {
        vi.stubGlobal('fetch', fetchMock)
      })

      afterEach(() => {
        vi.unstubAllGlobals()
      })

      it('should make API request', async () => {
        fetchMock.mockResolvedValue({
          ok: true,
          json: async () => ({ result: 'success' }),
        })

        const tool = createAPITool({
          name: 'api_tool',
          description: 'desc',
          parameters: { q: stringParam('query') },
          baseURL: 'https://api.example.com',
          endpoint: '/data',
          buildRequest: (args) => ({
            params: { q: args.q },
          }),
          parseResponse: (data) => data.result,
        })

        const result = await tool.execute({ q: 'test' }, {} as any)

        expect(result).toBe('success')
        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining('https://api.example.com/data?q=test'),
          expect.objectContaining({ method: 'GET' })
        )
      })

      it('should handle API errors', async () => {
        fetchMock.mockResolvedValue({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        })

        const tool = createAPITool({
          name: 'api_tool',
          description: 'desc',
          parameters: {},
          baseURL: 'https://api.example.com',
          endpoint: '/data',
          buildRequest: () => ({}),
          parseResponse: (data) => data,
        })

        await expect(tool.execute({}, {} as any)).rejects.toThrow(
          'Failed to call api_tool API: API request failed: 404 Not Found'
        )
      })
    })
  })
})
