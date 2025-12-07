'use client';
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
    // Stabilize initial value for SSR and re-renders
    const initialRef = React.useRef(initialValue instanceof Function ? initialValue() : initialValue);
    // Get current value from storage or fallback
    const readValue = React.useCallback(() => {
        if (typeof window === 'undefined') {
            return initialRef.current;
        }
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                return deserializer(item);
            }
            return initialRef.current;
        }
        catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialRef.current;
        }
    }, [key, deserializer]);
    // State to store our value
    // Use lazy initialization to avoid calling readValue on every render
    const [storedValue, setStoredValue] = React.useState(() => {
        if (!initializeWithValue) {
            return initialRef.current;
        }
        return readValue();
    });
    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = React.useCallback((value) => {
        if (typeof window === 'undefined') {
            console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`);
            return;
        }
        try {
            // Use functional update to avoid stale closure issues
            setStoredValue((prevValue) => {
                // Allow value to be a function so we have the same API as useState
                const newValue = value instanceof Function ? value(prevValue) : value;
                // Save to localStorage
                window.localStorage.setItem(key, serializer(newValue));
                // Dispatch custom event so other useLocalStorage hooks are notified
                window.dispatchEvent(new Event('local-storage'));
                return newValue;
            });
        }
        catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, serializer]);
    // Remove value from localStorage
    const removeValue = React.useCallback(() => {
        if (typeof window === 'undefined') {
            console.warn(`Tried removing localStorage key "${key}" even though environment is not a client`);
            return;
        }
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialRef.current);
            window.dispatchEvent(new Event('local-storage'));
        }
        catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error);
        }
    }, [key]);
    // Sync state across tabs
    React.useEffect(() => {
        if (typeof window === 'undefined')
            return;
        const handleStorageChange = (e) => {
            // Only react to relevant keys and localStorage area
            if (typeof window !== 'undefined' && 'key' in e) {
                const se = e;
                if (se.storageArea && se.storageArea !== window.localStorage)
                    return;
                if (se.key !== null && se.key !== key)
                    return;
            }
            // Use readValue directly to avoid stale closure
            try {
                const item = window.localStorage.getItem(key);
                if (item) {
                    setStoredValue(deserializer(item));
                }
                else {
                    setStoredValue(initialRef.current);
                }
            }
            catch (error) {
                console.warn(`Error reading localStorage key "${key}":`, error);
            }
        };
        // Listen to changes from other tabs
        window.addEventListener('storage', handleStorageChange);
        // Listen to changes from this tab
        window.addEventListener('local-storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage', handleStorageChange);
        };
    }, [key, deserializer]);
    return [storedValue, setValue, removeValue];
}
//# sourceMappingURL=use-local-storage.js.map