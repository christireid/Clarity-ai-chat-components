/**
 * useEnterpriseAuth - Top-level hook for enterprise authentication
 *
 * Simplified authentication hook for enterprise setups.
 *
 * @example
 * ```tsx
 * const auth = useEnterpriseAuth({
 *   provider: 'okta',
 *   apiKey: process.env.OKTA_API_KEY,
 * })
 *
 * if (auth.isAuthenticated) {
 *   return <App />
 * }
 * ```
 */
import * as React from 'react';
/**
 * useEnterpriseAuth - Enterprise authentication hook
 *
 * Provides a simple API for enterprise authentication.
 */
export function useEnterpriseAuth(options) {
    const { provider, apiKey, endpoint } = options;
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const login = React.useCallback(async (credentials) => {
        setIsLoading(true);
        setError(null);
        try {
            // Authentication logic would go here
            // For now, simulate success
            setIsAuthenticated(true);
            setUser({
                id: 'user-123',
                email: credentials.email,
                roles: ['user'],
            });
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Login failed'));
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const logout = React.useCallback(async () => {
        setIsLoading(true);
        try {
            // Logout logic would go here
            setIsAuthenticated(false);
            setUser(null);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Logout failed'));
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    return {
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
        error,
    };
}
//# sourceMappingURL=use-enterprise-auth.js.map