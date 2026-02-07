import { describe, it, expect } from 'vitest'
import {
  getTextContent,
  formatTimestamp,
  createConversation,
  generateId,
} from '../types'

describe('getTextContent', () => {
  it('returns string content as-is', () => {
    expect(getTextContent('hello world')).toBe('hello world')
  })

  it('returns empty string for non-string content', () => {
    expect(getTextContent(undefined)).toBe('')
    expect(getTextContent(null)).toBe('')
    expect(getTextContent(42)).toBe('')
    expect(getTextContent({ text: 'nested' })).toBe('')
    expect(getTextContent(['array'])).toBe('')
  })

  it('returns empty string for empty string', () => {
    expect(getTextContent('')).toBe('')
  })
})

describe('formatTimestamp', () => {
  it('formats a Date into HH:MM format', () => {
    const date = new Date('2025-01-15T14:30:00')
    const result = formatTimestamp(date)
    // The exact format depends on locale, but it should contain numbers
    expect(result).toMatch(/\d{1,2}:\d{2}/)
  })
})

describe('createConversation', () => {
  it('creates a conversation with the given title', () => {
    const conv = createConversation('Test Chat')
    expect(conv.title).toBe('Test Chat')
    expect(conv.messages).toEqual([])
    expect(conv.id).toBeDefined()
    expect(conv.id.length).toBeGreaterThan(0)
    expect(conv.createdAt).toBeInstanceOf(Date)
    expect(conv.updatedAt).toBeInstanceOf(Date)
  })

  it('creates unique IDs for different conversations', () => {
    const conv1 = createConversation('First')
    const conv2 = createConversation('Second')
    expect(conv1.id).not.toBe(conv2.id)
  })
})

describe('generateId', () => {
  it('returns a non-empty string', () => {
    const id = generateId()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })

  it('returns unique values', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })
})
