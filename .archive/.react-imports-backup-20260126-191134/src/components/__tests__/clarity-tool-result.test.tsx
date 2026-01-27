/**
 * Tests for ClarityToolResult component
 */

import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { ClarityToolResult, type ToolCall } from '../ClarityToolResult'
import { createToolUIRegistry } from '../../agents/tool-ui-registry'
import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced'

describe('ClarityToolResult', () => {
  const mockMessages: CoreMessage[] = [
    { role: 'user', content: 'Test message' },
  ]

  it('should render registered tool component', () => {
    const TestComponent = vi.fn(() =>
      React.createElement('div', null, 'Test Tool Result')
    )

    const registry = createToolUIRegistry({
      test_tool: TestComponent,
    })

    const toolCall: ToolCall = {
      name: 'test_tool',
      args: { arg1: 'value1' },
      id: 'tool-1',
    }

    const result = { data: 'test' }

    const { container } = render(
      React.createElement(ClarityToolResult, {
        registry,
        toolCall,
        result,
        messages: mockMessages,
      })
    )

    expect(TestComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        data: result,
        messages: mockMessages,
        toolCall: {
          name: 'test_tool',
          args: { arg1: 'value1' },
        },
      }),
      {}
    )
    expect(container.textContent).toContain('Test Tool Result')
  })

  it('should render fallback for unregistered tool', () => {
    const registry = createToolUIRegistry({})

    const toolCall: ToolCall = {
      name: 'unknown_tool',
      args: {},
      id: 'tool-1',
    }

    const result = { data: 'test' }

    const { container } = render(
      React.createElement(ClarityToolResult, {
        registry,
        toolCall,
        result,
        messages: mockMessages,
      })
    )

    // Should render default fallback with JSON
    expect(container.textContent).toContain('Tool:')
    expect(container.textContent).toContain('unknown_tool')
  })

  it('should render custom fallback component', () => {
    const CustomFallback = vi.fn(() =>
      React.createElement('div', null, 'Custom Fallback')
    )

    const registry = createToolUIRegistry({})

    const toolCall: ToolCall = {
      name: 'unknown_tool',
      args: {},
      id: 'tool-1',
    }

    render(
      React.createElement(ClarityToolResult, {
        registry,
        toolCall,
        result: { data: 'test' },
        messages: mockMessages,
        fallback: CustomFallback,
      })
    )

    expect(CustomFallback).toHaveBeenCalledWith(
      expect.objectContaining({
        toolCall,
        result: { data: 'test' },
      }),
      {}
    )
  })

  it('should show header when showHeader is true', () => {
    const TestComponent = vi.fn(() => React.createElement('div', null, 'Test'))

    const registry = createToolUIRegistry({
      test_tool: TestComponent,
    })

    const toolCall: ToolCall = {
      name: 'test_tool',
      args: {},
      id: 'tool-1',
    }

    const { container } = render(
      React.createElement(ClarityToolResult, {
        registry,
        toolCall,
        result: { data: 'test' },
        messages: mockMessages,
        showHeader: true,
      })
    )

    expect(container.textContent).toContain('Tool:')
    expect(container.textContent).toContain('test_tool')
  })

  it('should pass componentProps to tool component', () => {
    const TestComponent = vi.fn(() => React.createElement('div', null, 'Test'))

    const registry = createToolUIRegistry({
      test_tool: TestComponent,
    })

    const toolCall: ToolCall = {
      name: 'test_tool',
      args: {},
      id: 'tool-1',
    }

    render(
      React.createElement(ClarityToolResult, {
        registry,
        toolCall,
        result: { data: 'test' },
        messages: mockMessages,
        componentProps: { customProp: 'customValue' },
      })
    )

    expect(TestComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        customProp: 'customValue',
      }),
      {}
    )
  })

  it('should handle empty result', () => {
    const TestComponent = vi.fn(() => React.createElement('div', null, 'Test'))

    const registry = createToolUIRegistry({
      test_tool: TestComponent,
    })

    const toolCall: ToolCall = {
      name: 'test_tool',
      args: {},
      id: 'tool-1',
    }

    render(
      React.createElement(ClarityToolResult, {
        registry,
        toolCall,
        result: null,
        messages: mockMessages,
      })
    )

    expect(TestComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        data: null,
      }),
      {}
    )
  })
})
