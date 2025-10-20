import * as React from 'react'

export interface UseToggleReturn {
  /**
   * Current toggle state
   */
  value: boolean
  /**
   * Toggle the state
   */
  toggle: () => void
  /**
   * Set to true
   */
  setTrue: () => void
  /**
   * Set to false
   */
  setFalse: () => void
  /**
   * Set to specific value
   */
  setValue: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * Enhanced boolean state with helper functions
 * 
 * @example
 * ```tsx
 * const modal = useToggle(false)
 * const sidebar = useToggle(true)
 * 
 * return (
 *   <>
 *     <button onClick={modal.toggle}>Toggle Modal</button>
 *     <button onClick={modal.setTrue}>Open Modal</button>
 *     <button onClick={modal.setFalse}>Close Modal</button>
 *     {modal.value && <Modal onClose={modal.setFalse} />}
 *   </>
 * )
 * ```
 */
export function useToggle(initialValue: boolean = false): UseToggleReturn {
  const [value, setValue] = React.useState(initialValue)

  const toggle = React.useCallback(() => {
    setValue((v) => !v)
  }, [])

  const setTrue = React.useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = React.useCallback(() => {
    setValue(false)
  }, [])

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue,
  }
}
