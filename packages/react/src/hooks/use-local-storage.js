import * as React from 'react';
/**
 * Persist state in localStorage with automatic serialization
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage('theme', 'light')
 * const [user, setUser] = useLocalStorage('user', null)
 *
 * // Syncs across tabs automatically
 * <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
 *   Toggle theme
 * </button>
 * ```
 */
export function useLocalStorage(key, initialValue, options = {}) {
    const { serializer = JSON.stringify, deserializer = JSON.parse, initializeWithValue = true, } = options;
    // Get initial value
    const readValue = React.useCallback(() => {
        if (typeof window === 'undefined') {
            return initialValue instanceof Function ? initialValue() : initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                return deserializer(item);
            }
            return initialValue instanceof Function ? initialValue() : initialValue;
        }
        catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue instanceof Function ? initialValue() : initialValue;
        }
    }, [key, initialValue, deserializer]);
    // State to store our value
    const [storedValue, setStoredValue] = React.useState(initializeWithValue ? readValue : (initialValue instanceof Function ? initialValue() : initialValue));
    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = React.useCallback((value) => {
        if (typeof window === 'undefined') {
            console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`);
        }
        try {
            // Allow value to be a function so we have the same API as useState
            const newValue = value instanceof Function ? value(storedValue) : value;
            // Save to localStorage
            window.localStorage.setItem(key, serializer(newValue));
            // Save state
            setStoredValue(newValue);
            // Dispatch custom event so other useLocalStorage hooks are notified
            window.dispatchEvent(new Event('local-storage'));
        }
        catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue, serializer]);
    // Remove value from localStorage
    const removeValue = React.useCallback(() => {
        if (typeof window === 'undefined') {
            console.warn(`Tried removing localStorage key "${key}" even though environment is not a client`);
            return;
        }
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue instanceof Function ? initialValue() : initialValue);
            window.dispatchEvent(new Event('local-storage'));
        }
        catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);
    // Sync state across tabs
    React.useEffect(() => {
        const handleStorageChange = (e) => {
            if (e?.key && e.key !== key) {
                return;
            }
            setStoredValue(readValue());
        };
        // Listen to changes from other tabs
        window.addEventListener('storage', handleStorageChange);
        // Listen to changes from this tab
        window.addEventListener('local-storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage', handleStorageChange);
        };
    }, [key, readValue]);
    return [storedValue, setValue, removeValue];
}
//# sourceMappingURL=use-local-storage.js.map