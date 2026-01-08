/**
 * useDesignPatterns Hook
 *
 * React hook for working with design patterns in the architect framework.
 *
 * @packageDocumentation
 */
import { useState, useCallback, useMemo } from 'react';
import { DESIGN_PATTERN_CATALOG, getPatternInfo, getPatternIdsByCategory, suggestPatternsForUseCase, createPatternRecommendation, } from '../phases/phase2-planning';
/**
 * Initial state
 */
const INITIAL_STATE = {
    selectedPatterns: [],
    recommendations: [],
    filterCategory: 'all',
    searchQuery: '',
};
/**
 * All available pattern names
 */
const ALL_PATTERNS = Object.keys(DESIGN_PATTERN_CATALOG);
/**
 * Hook for working with design patterns
 *
 * @param options - Configuration options
 * @returns Pattern state and actions
 *
 * @example
 * ```typescript
 * const patterns = useDesignPatterns({
 *   onPatternSelected: (pattern) => {
 *     console.log('Selected:', pattern)
 *   },
 * })
 *
 * // Filter by category
 * patterns.setFilterCategory('creational')
 *
 * // Search patterns
 * patterns.setSearchQuery('factory')
 *
 * // Select a pattern
 * patterns.selectPattern('FACTORY_METHOD')
 *
 * // Get suggestions
 * const suggestions = patterns.suggestPatterns('object creation')
 * ```
 */
export function useDesignPatterns(options = {}) {
    const { initialPatterns = [], onPatternSelected, onPatternDeselected, } = options;
    const [state, setState] = useState(() => ({
        ...INITIAL_STATE,
        selectedPatterns: initialPatterns,
    }));
    /**
     * Filter patterns based on category and search
     */
    const filteredPatterns = useMemo(() => {
        let patterns = ALL_PATTERNS;
        // Filter by category
        if (state.filterCategory !== 'all') {
            patterns = getPatternIdsByCategory(state.filterCategory);
        }
        // Filter by search query
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            patterns = patterns.filter((pattern) => {
                const info = DESIGN_PATTERN_CATALOG[pattern];
                return (pattern.toLowerCase().includes(query) ||
                    info.name.toLowerCase().includes(query) ||
                    info.intent.toLowerCase().includes(query) ||
                    info.useCases.some((uc) => uc.toLowerCase().includes(query)));
            });
        }
        return patterns;
    }, [state.filterCategory, state.searchQuery]);
    /**
     * Select a pattern
     */
    const selectPattern = useCallback((pattern) => {
        setState((prev) => {
            if (prev.selectedPatterns.includes(pattern)) {
                return prev;
            }
            onPatternSelected?.(pattern);
            return {
                ...prev,
                selectedPatterns: [...prev.selectedPatterns, pattern],
            };
        });
    }, [onPatternSelected]);
    /**
     * Deselect a pattern
     */
    const deselectPattern = useCallback((pattern) => {
        setState((prev) => {
            if (!prev.selectedPatterns.includes(pattern)) {
                return prev;
            }
            onPatternDeselected?.(pattern);
            return {
                ...prev,
                selectedPatterns: prev.selectedPatterns.filter((p) => p !== pattern),
                recommendations: prev.recommendations.filter((r) => r.pattern !== pattern),
            };
        });
    }, [onPatternDeselected]);
    /**
     * Toggle pattern selection
     */
    const togglePattern = useCallback((pattern) => {
        if (state.selectedPatterns.includes(pattern)) {
            deselectPattern(pattern);
        }
        else {
            selectPattern(pattern);
        }
    }, [state.selectedPatterns, selectPattern, deselectPattern]);
    /**
     * Clear all selections
     */
    const clearSelections = useCallback(() => {
        setState((prev) => ({
            ...prev,
            selectedPatterns: [],
            recommendations: [],
        }));
    }, []);
    /**
     * Set filter category
     */
    const setFilterCategory = useCallback((category) => {
        setState((prev) => ({
            ...prev,
            filterCategory: category,
        }));
    }, []);
    /**
     * Set search query
     */
    const setSearchQuery = useCallback((query) => {
        setState((prev) => ({
            ...prev,
            searchQuery: query,
        }));
    }, []);
    /**
     * Add a recommendation
     */
    const addRecommendation = useCallback((pattern, rationale, tradeoffs, implementationNotes) => {
        const recommendation = createPatternRecommendation(pattern, rationale, tradeoffs, implementationNotes);
        setState((prev) => ({
            ...prev,
            recommendations: [
                ...prev.recommendations.filter((r) => r.pattern !== pattern),
                recommendation,
            ],
            selectedPatterns: prev.selectedPatterns.includes(pattern)
                ? prev.selectedPatterns
                : [...prev.selectedPatterns, pattern],
        }));
    }, []);
    /**
     * Remove a recommendation
     */
    const removeRecommendation = useCallback((pattern) => {
        setState((prev) => ({
            ...prev,
            recommendations: prev.recommendations.filter((r) => r.pattern !== pattern),
        }));
    }, []);
    /**
     * Get pattern details
     */
    const getPatternDetails = useCallback((pattern) => getPatternInfo(pattern), []);
    /**
     * Suggest patterns for use case
     */
    const suggestPatterns = useCallback((useCase) => suggestPatternsForUseCase(useCase), []);
    /**
     * Check if pattern is selected
     */
    const isSelected = useCallback((pattern) => state.selectedPatterns.includes(pattern), [state.selectedPatterns]);
    /**
     * Get patterns by category
     */
    const getByCategory = useCallback((category) => getPatternIdsByCategory(category), []);
    return {
        state,
        allPatterns: ALL_PATTERNS,
        filteredPatterns,
        selectPattern,
        deselectPattern,
        togglePattern,
        clearSelections,
        setFilterCategory,
        setSearchQuery,
        addRecommendation,
        removeRecommendation,
        getPatternDetails,
        suggestPatterns,
        isSelected,
        getByCategory,
    };
}
//# sourceMappingURL=use-design-patterns.js.map