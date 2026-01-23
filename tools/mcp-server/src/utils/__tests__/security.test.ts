/**
 * Tests for security utilities - PII sanitization
 */

import { describe, it, expect } from 'vitest'
import * as security from '../security.js'

const { maskSensitive, sanitizeForLogging } = security

describe('maskSensitive', () => {
  it('should mask API keys showing first and last 4 characters', () => {
    const apiKey = 'sk-1234567890abcdefghijklmnop'
    const result = maskSensitive(apiKey)
    expect(result).toBe('sk-1********mnop')
    expect(result).toContain('sk-1')
    expect(result).toContain('mnop')
    expect(result).toContain('*'.repeat(8))
  })

  it('should mask short strings completely with stars', () => {
    const short = 'secret'
    const result = maskSensitive(short)
    expect(result).toBe('******')
  })

  it('should respect custom visibleChars parameter', () => {
    const token = 'abcdefghijklmnopqrstuvwxyz'
    const result = maskSensitive(token, 2)
    expect(result).toContain('ab')
    expect(result).toContain('yz')
    expect(result).toContain('*'.repeat(8))
  })

  it('should handle empty strings', () => {
    const result = maskSensitive('')
    expect(result).toBe('')
  })

  it('should mask OAuth tokens', () => {
    const oauth = 'ya29.a0AfH6SMBx...'
    const result = maskSensitive(oauth)
    expect(result).toContain('ya29')
    expect(result).toContain('*'.repeat(8))
  })

  it('should mask JWT tokens', () => {
    const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    const result = maskSensitive(jwt)
    expect(result).toContain('eyJh')
    expect(result).toContain('ssw5c')
    expect(result.length).toBeGreaterThan(16)
  })
})

describe('sanitizeForLogging', () => {
  describe('API key detection and masking', () => {
    it('should mask apiKey field', () => {
      const input = {
        username: 'john',
        apiKey: 'sk-1234567890abcdef',
      }
      const result = sanitizeForLogging(input)
      expect(result.username).toBe('john')
      expect(result.apiKey).toContain('sk-1')
      expect(result.apiKey).toContain('cdef')
      expect(result.apiKey).toContain('*'.repeat(8))
    })

    it('should mask api_key field (snake_case)', () => {
      const input = {
        api_key: 'sk-proj-abc123xyz',
      }
      const result = sanitizeForLogging(input)
      expect(result.api_key).toContain('sk-p')
      expect(result.api_key).toContain('*'.repeat(8))
    })

    it('should mask API-KEY field (dash-case)', () => {
      const input = {
        'API-KEY': 'sk-test-key',
      }
      const result = sanitizeForLogging(input)
      expect(result['API-KEY']).toContain('*'.repeat(8))
    })

    it('should mask token fields', () => {
      const input = {
        accessToken: 'ya29.a0AfH6SMBx',
        refresh_token: 'refresh-123456',
      }
      const result = sanitizeForLogging(input)
      expect(result.accessToken).toContain('*')
      expect(result.refresh_token).toContain('*')
    })

    it('should mask authorization fields', () => {
      const input = {
        authorization: 'Bearer abc123xyz789',
        auth: 'Basic dXNlcjpwYXNz',
      }
      const result = sanitizeForLogging(input)
      expect(result.authorization).toContain('*')
      expect(result.auth).toContain('*')
    })
  })

  describe('Password and secret detection', () => {
    it('should mask password field', () => {
      const input = {
        username: 'john',
        password: 'SuperSecret123!',
      }
      const result = sanitizeForLogging(input)
      expect(result.username).toBe('john')
      expect(result.password).toContain('*')
      expect(result.password).not.toBe('SuperSecret123!')
    })

    it('should mask passwd and pwd variations', () => {
      const input = {
        passwd: 'secret1',
        pwd: 'secret2',
      }
      const result = sanitizeForLogging(input)
      expect(result.passwd).toContain('*')
      expect(result.pwd).toContain('*')
    })

    it('should mask secret fields', () => {
      const input = {
        clientSecret: 'secret-abc-123',
        api_secret: 'another-secret',
      }
      const result = sanitizeForLogging(input)
      expect(result.clientSecret).toContain('*')
      expect(result.api_secret).toContain('*')
    })
  })

  describe('PII detection and masking', () => {
    it('should mask email addresses', () => {
      const input = {
        name: 'John Doe',
        email: 'john.doe@example.com',
      }
      const result = sanitizeForLogging(input)
      expect(result.name).toBe('John Doe')
      expect(result.email).toContain('*')
      expect(result.email).not.toBe('john.doe@example.com')
    })

    it('should mask phone numbers', () => {
      const input = {
        phone: '+1-555-123-4567',
        telephone: '555-987-6543',
      }
      const result = sanitizeForLogging(input)
      expect(result.phone).toContain('*')
      expect(result.telephone).toContain('*')
    })

    it('should mask SSN fields', () => {
      const input = {
        ssn: '123-45-6789',
        social_security: '987-65-4321',
      }
      const result = sanitizeForLogging(input)
      expect(result.ssn).toContain('*')
      expect(result.social_security).toContain('*')
    })

    it('should mask credit card information', () => {
      const input = {
        credit_card: '4111111111111111',
        creditcard: '5555555555554444',
        card_number: '378282246310005',
        cvv: '123',
      }
      const result = sanitizeForLogging(input)
      expect(result.credit_card).toContain('*')
      expect(result.creditcard).toContain('*')
      expect(result.card_number).toContain('*')
      expect(result.cvv).toContain('*')
    })

    it('should mask address fields', () => {
      const input = {
        address: '123 Main St, City, State 12345',
      }
      const result = sanitizeForLogging(input)
      expect(result.address).toContain('*')
    })
  })

  describe('Nested object sanitization', () => {
    it('should recursively sanitize nested objects', () => {
      const input = {
        user: 'john',
        config: {
          apiKey: 'sk-nested-key',
          settings: {
            token: 'nested-token',
            name: 'safe-value',
          },
        },
      }
      const result = sanitizeForLogging(input)
      expect(result.user).toBe('john')
      expect((result.config as any).apiKey).toContain('*')
      expect((result.config as any).settings.token).toContain('*')
      expect((result.config as any).settings.name).toBe('safe-value')
    })

    it('should sanitize arrays of objects', () => {
      const input = {
        requests: [
          { url: 'https://api.example.com', apiKey: 'key-1' },
          { url: 'https://api.example.com', apiKey: 'key-2' },
        ],
      }
      const result = sanitizeForLogging(input)
      const requests = result.requests as any[]
      expect(requests[0].url).toBe('https://api.example.com')
      expect(requests[0].apiKey).toContain('*')
      expect(requests[1].apiKey).toContain('*')
    })

    it('should handle mixed arrays with primitives and objects', () => {
      const input = {
        items: [
          'public-value',
          { apiKey: 'secret-key' },
          42,
          { password: 'secret-pwd' },
        ],
      }
      const result = sanitizeForLogging(input)
      const items = result.items as any[]
      expect(items[0]).toBe('public-value')
      expect(items[1].apiKey).toContain('*')
      expect(items[2]).toBe(42)
      expect(items[3].password).toContain('*')
    })
  })

  describe('Non-string sensitive values', () => {
    it('should mark non-string sensitive values as [REDACTED]', () => {
      const input = {
        apiKey: { nested: 'object' },
        token: 123456,
        secret: true,
      }
      const result = sanitizeForLogging(input)
      expect(result.apiKey).toBe('[REDACTED]')
      expect(result.token).toBe('[REDACTED]')
      expect(result.secret).toBe('[REDACTED]')
    })

    it('should preserve null and undefined for sensitive keys', () => {
      const input = {
        apiKey: null,
        token: undefined,
      }
      const result = sanitizeForLogging(input)
      expect(result.apiKey).toBeNull()
      expect(result.token).toBeUndefined()
    })
  })

  describe('Real-world tool argument scenarios', () => {
    it('should sanitize OpenAI API call arguments', () => {
      const input = {
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Hello' }],
        apiKey: 'sk-proj-abc123def456',
        temperature: 0.7,
      }
      const result = sanitizeForLogging(input)
      expect(result.model).toBe('gpt-4')
      expect(result.messages).toEqual([{ role: 'user', content: 'Hello' }])
      expect(result.apiKey).toContain('*')
      expect(result.temperature).toBe(0.7)
    })

    it('should sanitize Anthropic API call arguments', () => {
      const input = {
        model: 'claude-3-opus',
        prompt: 'Test prompt',
        api_key: 'sk-ant-api-xyz789',
        max_tokens: 1024,
      }
      const result = sanitizeForLogging(input)
      expect(result.model).toBe('claude-3-opus')
      expect(result.prompt).toBe('Test prompt')
      expect(result.api_key).toContain('*')
      expect(result.max_tokens).toBe(1024)
    })

    it('should sanitize webhook configuration', () => {
      const input = {
        url: 'https://webhook.example.com/callback',
        secret: 'webhook-secret-key-123',
        events: ['message.sent', 'message.received'],
      }
      const result = sanitizeForLogging(input)
      expect(result.url).toBe('https://webhook.example.com/callback')
      expect(result.secret).toContain('*')
      expect(result.events).toEqual(['message.sent', 'message.received'])
    })

    it('should sanitize user registration data', () => {
      const input = {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'SuperSecret123!',
        phone: '+1-555-123-4567',
        preferences: { theme: 'dark' },
      }
      const result = sanitizeForLogging(input)
      expect(result.username).toBe('johndoe')
      expect(result.email).toContain('*')
      expect(result.password).toContain('*')
      expect(result.phone).toContain('*')
      expect((result.preferences as any).theme).toBe('dark')
    })

    it('should sanitize payment processing data', () => {
      const input = {
        amount: 99.99,
        currency: 'USD',
        credit_card: '4111111111111111',
        cvv: '123',
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      }
      const result = sanitizeForLogging(input)
      expect(result.amount).toBe(99.99)
      expect(result.currency).toBe('USD')
      expect(result.credit_card).toContain('*')
      expect(result.cvv).toContain('*')
      expect((result.customer as any).name).toBe('John Doe')
      expect((result.customer as any).email).toContain('*')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty objects', () => {
      const input = {}
      const result = sanitizeForLogging(input)
      expect(result).toEqual({})
    })

    it('should handle objects with non-sensitive keys only', () => {
      const input = {
        name: 'test',
        count: 42,
        active: true,
      }
      const result = sanitizeForLogging(input)
      expect(result).toEqual(input)
    })

    it('should handle deeply nested structures', () => {
      const input = {
        level1: {
          level2: {
            level3: {
              level4: {
                apiKey: 'deep-secret',
                publicData: 'visible',
              },
            },
          },
        },
      }
      const result = sanitizeForLogging(input)
      const level4 = (result.level1 as any).level2.level3.level4
      expect(level4.apiKey).toContain('*')
      expect(level4.publicData).toBe('visible')
    })

    it('should handle arrays of primitives', () => {
      const input = {
        tags: ['tag1', 'tag2', 'tag3'],
        counts: [1, 2, 3, 4, 5],
      }
      const result = sanitizeForLogging(input)
      expect(result.tags).toEqual(['tag1', 'tag2', 'tag3'])
      expect(result.counts).toEqual([1, 2, 3, 4, 5])
    })

    it('should handle case variations in key names', () => {
      const input = {
        APIKEY: 'upper-case-key',
        ApiKey: 'camel-case-key',
        'api-key': 'dash-case-key',
        api_key: 'snake-case-key',
      }
      const result = sanitizeForLogging(input)
      expect(result.APIKEY).toContain('*')
      expect(result.ApiKey).toContain('*')
      expect(result['api-key']).toContain('*')
      expect(result.api_key).toContain('*')
    })
  })

  describe('Performance and security', () => {
    it('should not expose original values in masked output', () => {
      const apiKey = 'sk-highly-sensitive-secret-key'
      const input = { apiKey }
      const result = sanitizeForLogging(input)
      expect(result.apiKey).not.toBe(apiKey)
      expect(result.apiKey).not.toContain('sensitive')
    })

    it('should handle large objects efficiently', () => {
      const input: Record<string, any> = {}
      for (let i = 0; i < 100; i++) {
        input[`field${i}`] = `value${i}`
      }
      input.apiKey = 'secret-key'

      const result = sanitizeForLogging(input)
      expect(result.apiKey).toContain('*')
      expect(Object.keys(result).length).toBe(101)
    })
  })
})
