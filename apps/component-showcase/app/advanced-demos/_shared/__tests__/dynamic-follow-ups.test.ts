import { describe, it, expect } from 'vitest'
import { deriveFollowUpSuggestions } from '../dynamic-follow-ups'
import type { HookMessage } from '../types'
import type { PromptSuggestion } from '@clarity-chat/react'

const defaults: PromptSuggestion[] = [
  { id: 'default-1', text: 'What can you do?', type: 'follow-up' },
  { id: 'default-2', text: 'Help me get started', type: 'follow-up' },
]

describe('deriveFollowUpSuggestions', () => {
  it('returns defaults when no assistant messages', () => {
    const messages: HookMessage[] = [
      { id: 'msg-1', role: 'user', content: 'hello' },
    ]

    const result = deriveFollowUpSuggestions(messages, defaults)
    expect(result).toEqual(defaults)
  })

  it('returns defaults when messages array is empty', () => {
    const result = deriveFollowUpSuggestions([], defaults)
    expect(result).toEqual(defaults)
  })

  it('detects code content and returns code-related suggestions', () => {
    const messages: HookMessage[] = [
      { id: 'msg-1', role: 'user', content: 'Show me code' },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'Here is an example:\n```js\nfunction hello() {}\n```',
      },
    ]

    const result = deriveFollowUpSuggestions(messages, defaults)

    const texts = result.map((s) => s.text)
    expect(texts).toContain('Explain this code step by step')
    expect(texts).toContain('How would I test this?')
  })

  it('detects content with function keyword as code', () => {
    const messages: HookMessage[] = [
      {
        id: 'msg-1',
        role: 'assistant',
        content: 'You can use function getData() to fetch results.',
      },
    ]

    const result = deriveFollowUpSuggestions(messages, defaults)

    const texts = result.map((s) => s.text)
    expect(texts).toContain('Explain this code step by step')
  })

  it('detects content with import keyword as code', () => {
    const messages: HookMessage[] = [
      {
        id: 'msg-1',
        role: 'assistant',
        content: 'You need to import React from "react".',
      },
    ]

    const result = deriveFollowUpSuggestions(messages, defaults)

    const texts = result.map((s) => s.text)
    expect(texts).toContain('Explain this code step by step')
  })

  it('detects comparison content', () => {
    const messages: HookMessage[] = [
      { id: 'msg-1', role: 'user', content: 'React vs Vue' },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'When we compare React vs Vue, the main difference is...',
      },
    ]

    const result = deriveFollowUpSuggestions(messages, defaults)

    const texts = result.map((s) => s.text)
    expect(texts).toContain('Which approach do you recommend and why?')
  })

  it('detects API/component documentation content with props', () => {
    const messages: HookMessage[] = [
      {
        id: 'msg-1',
        role: 'assistant',
        content:
          'The component accepts the following props: className, onClick.',
      },
    ]

    const result = deriveFollowUpSuggestions(messages, defaults)

    const texts = result.map((s) => s.text)
    expect(texts).toContain('Show me a complete usage example')
  })

  it('detects API/component documentation content with interface', () => {
    const messages: HookMessage[] = [
      {
        id: 'msg-1',
        role: 'assistant',
        content: 'The interface defines the shape of the config object.',
      },
    ]

    const result = deriveFollowUpSuggestions(messages, defaults)

    const texts = result.map((s) => s.text)
    expect(texts).toContain('Show me a complete usage example')
  })

  it('detects API/component documentation content with api keyword', () => {
    const messages: HookMessage[] = [
      {
        id: 'msg-1',
        role: 'assistant',
        content: 'The API endpoint returns a JSON response.',
      },
    ]

    const result = deriveFollowUpSuggestions(messages, defaults)

    const texts = result.map((s) => s.text)
    expect(texts).toContain('Show me a complete usage example')
  })

  it('returns at most 3 suggestions', () => {
    // Content that triggers all categories: code + comparison + API + step
    const messages: HookMessage[] = [
      {
        id: 'msg-1',
        role: 'assistant',
        content:
          'Here is the function code ```js\n``` to compare vs other options. The props interface defines the api. First step is to then configure it.',
      },
    ]

    const result = deriveFollowUpSuggestions(messages, defaults)

    expect(result.length).toBeLessThanOrEqual(3)
  })

  it('always includes "Tell me more about this" suggestion when assistant message exists', () => {
    const messages: HookMessage[] = [
      {
        id: 'msg-1',
        role: 'assistant',
        content: 'Some generic response without any special keywords.',
      },
    ]

    const result = deriveFollowUpSuggestions(messages, defaults)

    const texts = result.map((s) => s.text)
    expect(texts).toContain('Tell me more about this')
  })

  it('includes "Tell me more about this" even when other suggestions are present', () => {
    // Only one category triggered (comparison) so total will be 2 (<= 3)
    const messages: HookMessage[] = [
      {
        id: 'msg-1',
        role: 'assistant',
        content: 'The key difference between them is the approach.',
      },
    ]

    const result = deriveFollowUpSuggestions(messages, defaults)

    const texts = result.map((s) => s.text)
    expect(texts).toContain('Which approach do you recommend and why?')
    expect(texts).toContain('Tell me more about this')
  })

  it('uses the last assistant message for analysis', () => {
    const messages: HookMessage[] = [
      {
        id: 'msg-1',
        role: 'assistant',
        content: 'Here is some code: ```js\nconst x = 1;\n```',
      },
      { id: 'msg-2', role: 'user', content: 'What about comparisons?' },
      {
        id: 'msg-3',
        role: 'assistant',
        content: 'Let me compare the difference between the two approaches.',
      },
    ]

    const result = deriveFollowUpSuggestions(messages, defaults)

    const texts = result.map((s) => s.text)
    // Should detect comparison, not code (since last assistant msg is about comparisons)
    expect(texts).toContain('Which approach do you recommend and why?')
    expect(texts).not.toContain('Explain this code step by step')
  })
})
