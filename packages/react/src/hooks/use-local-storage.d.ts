import * as React from 'react';
export interface UseLocalStorageOptions<T> {
    /**
     * Serializer function
     * @default JSON.stringify
     */
    serializer?: (value: T) => string;
    /**
     * Deserializer function
     * @default JSON.parse
     */
    deserializer?: (value: string) => T;
    /**
     * Initialize from function
     */
    initializeWithValue?: boolean;
}
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
export declare function useLocalStorage<T>(key: string, initialValue: T | (() => T), options?: UseLocalStorageOptions<T>): [T, React.Dispatch<React.SetStateAction<T>>, () => void];
//# sourceMappingURL=use-local-storage.d.ts.map