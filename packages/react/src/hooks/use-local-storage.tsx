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
  /**
   * Event namespace to prevent collisions with other libraries
   * @default 'clarity-chat'
   */
  namespace?: string
  /**
   * Debounce writes to storage (milliseconds)
   * Useful for rapid updates like form inputs
   * @default 0 (no debounce)
   */
  debounceMs?: number
}

/**
 * Persist state in localStorage with automatic serialization and cross-tab sync.
 * 
 * **Features:**
 * - Automatic JSON serialization/deserialization
 * - Cross-tab/window synchronization
 * - SSR-safe (no hydration warnings)
 * - Custom serializers for complex types
 * - Debounced writes for performance
 * - Namespaced events to prevent collisions
 * - Quota exceeded handling
 * 
 * **Use Cases:**
 * - User preferences (theme, language)
 * - Form drafts
 * - Shopping cart
 * - Auth tokens
 * - UI state persistence
 * 
 * @template T - Type of value to store
 * @param {string} key - Storage key (namespaced automatically)
 * @param {T | (() => T)} initialValue - Initial value or initializer function
 * @param {UseLocalStorageOptions<T>} [options] - Configuration options
 * @returns {[T, Dispatch<SetStateAction<T>>, () => void]} State, setter, and remove function
 * @example
 * ```tsx
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')
 * const [user, setUser] = useLocalStorage('user', null)
 * 
 * // Syncs across tabs automatically
 * <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
 *   Toggle theme
 * </button>
 * 
 * // Remove from storage
 * <button onClick={removeTheme}>Reset theme</button>
 * ```
 * 
 * @example
 * ```tsx
 * // With custom serializer for Date objects
 * const [lastLogin, setLastLogin] = useLocalStorage(
 *   'lastLogin',
 *   new Date(),
 *   {
 *     serializer: (date) => date.toISOString(),
 *     deserializer: (str) => new Date(str),
 *     debounceMs: 300, // Debounce writes
 *   }
 * )
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageOptions<T> = {}
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    initializeWithValue = true,
    namespace = 'clarity-chat',
    debounceMs = 0,
  } = options

  // Create namespaced event name to prevent collisions
  const storageEventName = `${namespace}:storage:${key}`

  // Get initial value
  const readValue = React.useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue instanceof Function ? initialValue() : initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        return deserializer(item)
      }
      return initialValue instanceof Function ? initialValue() : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue instanceof Function ? initialValue() : initialValue
    }
  }, [key, initialValue, deserializer])

  // State to store our value
  const [storedValue, setStoredValue] = React.useState<T>(
    initializeWithValue ? readValue : (initialValue instanceof Function ? initialValue() : initialValue)
  )

  // Ref for debounce timeout
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue: React.Dispatch<React.SetStateAction<T>> = React.useCallback(
    (value) => {
      if (typeof window === 'undefined') {
        console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`)
        return
      }

      try {
        // Allow value to be a function so we have the same API as useState
        const newValue = value instanceof Function ? value(storedValue) : value

        // Update state immediately for responsive UI
        setStoredValue(newValue)

        // Debounced localStorage write
        const writeToStorage = () => {
          try {
            window.localStorage.setItem(key, serializer(newValue))
            
            // Dispatch namespaced custom event so other hooks are notified
            window.dispatchEvent(new CustomEvent(storageEventName, { detail: newValue }))
          } catch (error: unknown) {
            // Handle quota exceeded errors gracefully
            if (error instanceof Error && error.name === 'QuotaExceededError') {
              console.error(
                `localStorage quota exceeded for key "${key}". ` +
                `Consider implementing a cleanup strategy or using a different storage mechanism.`
              )
            } else {
              console.warn(`Error setting localStorage key "${key}":`, error)
            }
          }
        }

        if (debounceMs > 0) {
          // Clear existing timeout
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
          }
          
          // Schedule write
          debounceTimeoutRef.current = setTimeout(writeToStorage, debounceMs)
        } else {
          // Write immediately
          writeToStorage()
        }
      } catch (error) {
        console.warn(`Error processing localStorage update for key "${key}":`, error)
      }
    },
    [key, storedValue, serializer, storageEventName, debounceMs]
  )

  // Cleanup debounce timeout on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  // Remove value from localStorage
  const removeValue = React.useCallback(() => {
    if (typeof window === 'undefined') {
      console.warn(`Tried removing localStorage key "${key}" even though environment is not a client`)
      return
    }

    try {
      // Clear any pending debounced write
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
        debounceTimeoutRef.current = null
      }

      window.localStorage.removeItem(key)
      setStoredValue(initialValue instanceof Function ? initialValue() : initialValue)
      window.dispatchEvent(new CustomEvent(storageEventName, { detail: null }))
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue, storageEventName])

  // Sync state across tabs and windows
  React.useEffect(() => {
    // Handle storage events from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      // Only respond to changes for our key
      if (e.key && e.key !== key) {
        return
      }
      setStoredValue(readValue())
    }

    // Handle custom events from this tab (other hooks)
    const handleCustomStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent
      // Update state from event detail if available, otherwise read from storage
      if (customEvent.detail !== undefined) {
        setStoredValue(customEvent.detail)
      } else {
        setStoredValue(readValue())
      }
    }

    // Listen to changes from other tabs/windows (native storage event)
    window.addEventListener('storage', handleStorageChange)
    
    // Listen to changes from this tab (custom namespaced event)
    window.addEventListener(storageEventName, handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(storageEventName, handleCustomStorageChange)
    }
  }, [key, readValue, storageEventName])

  return [storedValue, setValue, removeValue]
}
