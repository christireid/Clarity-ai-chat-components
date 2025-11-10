import * as React from 'react'

export interface UseLocalStorageOptions<T> {
  /**
   * Serializer function
   * @default JSON.stringify
   */
  serializer?: (value: T) => string
  /**
   * Deserializer function
   * @default JSON.parse
   */
  deserializer?: (value: string) => T
  /**
   * Initialize from function
   */
  initializeWithValue?: boolean
}

/**
 * Persist state in localStorage with automatic serialization (React 19 Version)
 * 
 * **React 19 Improvements:**
 * - Uses `useTransition` for non-blocking storage operations
 * - Optimistic updates with automatic rollback on error
 * - Returns isPending state for loading indicators
 * - Better performance with deferred writes
 * 
 * @example
 * ```tsx
 * const [theme, setTheme, removeTheme, isPending] = useLocalStorage('theme', 'light')
 * const [user, setUser, removeUser, isPending] = useLocalStorage('user', null)
 * 
 * // Syncs across tabs automatically
 * <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} disabled={isPending}>
 *   Toggle theme {isPending && '...'}
 * </button>
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageOptions<T> = {}
): [T, React.Dispatch<React.SetStateAction<T>>, () => void, boolean] {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    initializeWithValue = true,
  } = options

  // Stabilize initial value for SSR and re-renders
  const initialRef = React.useRef<T>(
    initialValue instanceof Function ? (initialValue as () => T)() : initialValue
  )

  // Get current value from storage or fallback
  const readValue = React.useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialRef.current
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        return deserializer(item)
      }
      return initialRef.current
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialRef.current
    }
  }, [key, deserializer])

  // State to store our value
  // Use lazy initialization to avoid calling readValue on every render
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (!initializeWithValue) {
      return initialRef.current
    }
    return readValue()
  })
  
  // React 19: useTransition for non-blocking storage writes
  const [isPending, startTransition] = React.useTransition()

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue: React.Dispatch<React.SetStateAction<T>> = React.useCallback(
    (value) => {
      if (typeof window === 'undefined') {
        console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`)
        return
      }

      // Use functional update to avoid stale closure issues
      setStoredValue((prevValue) => {
        // Allow value to be a function so we have the same API as useState
        const newValue = value instanceof Function ? value(prevValue) : value

        // React 19: Defer storage write (non-blocking, optimistic)
        startTransition(async () => {
          try {
            // Save to localStorage
            window.localStorage.setItem(key, serializer(newValue))

            // Dispatch custom event so other useLocalStorage hooks are notified
            window.dispatchEvent(new Event('local-storage'))
          } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error)
            // On error, revert to previous value
            setStoredValue(prevValue)
          }
        })

        // Return new value immediately (optimistic update)
        return newValue
      })
    },
    [key, serializer, startTransition]
  )

  // Remove value from localStorage
  const removeValue = React.useCallback(() => {
    if (typeof window === 'undefined') {
      console.warn(`Tried removing localStorage key "${key}" even though environment is not a client`)
      return
    }

    // Optimistically update state
    const prevValue = storedValue
    setStoredValue(initialRef.current)

    // React 19: Defer storage operation (non-blocking)
    startTransition(async () => {
      try {
        window.localStorage.removeItem(key)
        window.dispatchEvent(new Event('local-storage'))
      } catch (error) {
        console.warn(`Error removing localStorage key "${key}":`, error)
        // Revert on error
        setStoredValue(prevValue)
      }
    })
  }, [key, storedValue, startTransition])

  // Sync state across tabs
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorageChange = (e: StorageEvent | Event) => {
      // Only react to relevant keys and localStorage area
      if (typeof window !== 'undefined' && 'key' in (e as StorageEvent)) {
        const se = e as StorageEvent
        if (se.storageArea && se.storageArea !== window.localStorage) return
        if (se.key !== null && se.key !== key) return
      }
      // Use readValue directly to avoid stale closure
      try {
        const item = window.localStorage.getItem(key)
        if (item) {
          setStoredValue(deserializer(item))
        } else {
          setStoredValue(initialRef.current)
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error)
      }
    }

    // Listen to changes from other tabs
    window.addEventListener('storage', handleStorageChange)
    // Listen to changes from this tab
    window.addEventListener('local-storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('local-storage', handleStorageChange)
    }
  }, [key, deserializer])

  return [storedValue, setValue, removeValue, isPending]
}
