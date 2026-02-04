/**
 * Hook Templates
 *
 * Templates for generating React hooks with tests.
 */

export const hook = `import { useState, useCallback } from 'react'

export interface Use{{pascalName}}Options {
  /**
   * Initial value for the hook
   */
  initialValue?: unknown
}

export interface Use{{pascalName}}Return {
  /**
   * Current state value
   */
  value: unknown
  /**
   * Update the value
   */
  setValue: (value: unknown) => void
  /**
   * Reset to initial value
   */
  reset: () => void
}

/**
 * use{{pascalName}} - {{description}}
 *
 * @param options - Hook configuration options
 * @returns Hook state and methods
 *
 * @example
 * \`\`\`tsx
 * function MyComponent() {
 *   const { value, setValue, reset } = use{{pascalName}}()
 *
 *   return (
 *     <div>
 *       <span>{String(value)}</span>
 *       <button onClick={() => setValue('new value')}>Update</button>
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   )
 * }
 * \`\`\`
 */
export function use{{pascalName}}(
  options: Use{{pascalName}}Options = {}
): Use{{pascalName}}Return {
  const { initialValue = null } = options

  const [value, setValueState] = useState<unknown>(initialValue)

  const setValue = useCallback((newValue: unknown) => {
    setValueState(newValue)
  }, [])

  const reset = useCallback(() => {
    setValueState(initialValue)
  }, [initialValue])

  return {
    value,
    setValue,
    reset,
  }
}
`

export const hookTest = `import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { use{{pascalName}} } from './use{{pascalName}}'


describe('use{{pascalName}}', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => use{{pascalName}}())

    expect(result.current.value).toBe(null)
  })

  it('should initialize with custom initial value', () => {
    const { result } = renderHook(() =>
      use{{pascalName}}({ initialValue: 'test' })
    )

    expect(result.current.value).toBe('test')
  })

  it('should update value', () => {
    const { result } = renderHook(() => use{{pascalName}}())

    act(() => {
      result.current.setValue('new value')
    })

    expect(result.current.value).toBe('new value')
  })

  it('should reset to initial value', () => {
    const { result } = renderHook(() =>
      use{{pascalName}}({ initialValue: 'initial' })
    )

    act(() => {
      result.current.setValue('changed')
    })

    expect(result.current.value).toBe('changed')

    act(() => {
      result.current.reset()
    })

    expect(result.current.value).toBe('initial')
  })

  it('should maintain referential stability of callbacks', () => {
    const { result, rerender } = renderHook(() => use{{pascalName}}())

    const { setValue: setValue1, reset: reset1 } = result.current

    rerender()

    const { setValue: setValue2, reset: reset2 } = result.current

    expect(setValue1).toBe(setValue2)
    expect(reset1).toBe(reset2)
  })
})
`

export const context = `import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'

// === STATE TYPES ===

export interface {{pascalName}}State {
  /**
   * Current value in the context
   */
  value: unknown
  /**
   * Loading state
   */
  isLoading: boolean
  /**
   * Error state
   */
  error: Error | null
}

// === ACTION TYPES ===

export interface {{pascalName}}Actions {
  /**
   * Update the value
   */
  setValue: (value: unknown) => void
  /**
   * Reset the context to initial state
   */
  reset: () => void
  /**
   * Clear any errors
   */
  clearError: () => void
}

// === CONTEXT VALUE ===

export type {{pascalName}}ContextValue = {{pascalName}}State & {{pascalName}}Actions

// === CONTEXT ===

const {{pascalName}}Context = createContext<{{pascalName}}ContextValue | null>(null)

{{pascalName}}Context.displayName = '{{pascalName}}Context'

// === PROVIDER ===

export interface {{pascalName}}ProviderProps {
  /**
   * Child components
   */
  children: ReactNode
  /**
   * Initial value for the context
   */
  initialValue?: unknown
}

const defaultState: {{pascalName}}State = {
  value: null,
  isLoading: false,
  error: null,
}

/**
 * {{pascalName}}Provider - {{description}}
 *
 * @example
 * \`\`\`tsx
 * function App() {
 *   return (
 *     <{{pascalName}}Provider>
 *       <MyComponent />
 *     </{{pascalName}}Provider>
 *   )
 * }
 * \`\`\`
 */
export function {{pascalName}}Provider({
  children,
  initialValue,
}: {{pascalName}}ProviderProps) {
  const [state, setState] = useState<{{pascalName}}State>({
    ...defaultState,
    value: initialValue ?? defaultState.value,
  })

  const setValue = useCallback((value: unknown) => {
    setState((prev) => ({ ...prev, value }))
  }, [])

  const reset = useCallback(() => {
    setState({
      ...defaultState,
      value: initialValue ?? defaultState.value,
    })
  }, [initialValue])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  const contextValue = useMemo<{{pascalName}}ContextValue>(
    () => ({
      ...state,
      setValue,
      reset,
      clearError,
    }),
    [state, setValue, reset, clearError]
  )

  return (
    <{{pascalName}}Context.Provider value={contextValue}>
      {children}
    </{{pascalName}}Context.Provider>
  )
}

// === HOOK ===

/**
 * use{{pascalName}} - Access the {{pascalName}} context
 *
 * @throws Error if used outside of {{pascalName}}Provider
 *
 * @example
 * \`\`\`tsx
 * function MyComponent() {
 *   const { value, setValue, reset } = use{{pascalName}}()
 *
 *   return (
 *     <div>
 *       <span>{String(value)}</span>
 *       <button onClick={() => setValue('new')}>Update</button>
 *     </div>
 *   )
 * }
 * \`\`\`
 */
export function use{{pascalName}}(): {{pascalName}}ContextValue {
  const context = useContext({{pascalName}}Context)

  if (!context) {
    throw new Error(
      'use{{pascalName}} must be used within a {{pascalName}}Provider. ' +
      'Make sure to wrap your component tree with <{{pascalName}}Provider>.'
    )
  }

  return context
}

// === EXPORTS ===

export { {{pascalName}}Context }
`

export const contextTest = `import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { {{pascalName}}Provider, use{{pascalName}} } from './{{pascalName}}Context'


function TestConsumer() {
  const { value, setValue, reset } = use{{pascalName}}()

  return (
    <div>
      <span data-testid="value">{String(value)}</span>
      <button onClick={() => setValue('updated')}>Update</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}

describe('{{pascalName}}Context', () => {
  it('should provide default value', () => {
    render(
      <{{pascalName}}Provider>
        <TestConsumer />
      </{{pascalName}}Provider>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('null')
  })

  it('should provide initial value', () => {
    render(
      <{{pascalName}}Provider initialValue="initial">
        <TestConsumer />
      </{{pascalName}}Provider>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('initial')
  })

  it('should update value', () => {
    render(
      <{{pascalName}}Provider>
        <TestConsumer />
      </{{pascalName}}Provider>
    )

    fireEvent.click(screen.getByText('Update'))
    expect(screen.getByTestId('value')).toHaveTextContent('updated')
  })

  it('should reset to initial value', () => {
    render(
      <{{pascalName}}Provider initialValue="initial">
        <TestConsumer />
      </{{pascalName}}Provider>
    )

    fireEvent.click(screen.getByText('Update'))
    fireEvent.click(screen.getByText('Reset'))
    expect(screen.getByTestId('value')).toHaveTextContent('initial')
  })

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<TestConsumer />)).toThrow(
      'use{{pascalName}} must be used within a {{pascalName}}Provider'
    )

    consoleSpy.mockRestore()
  })
})
`
