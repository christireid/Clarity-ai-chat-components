import { logger } from '@clarity-chat/utils/logger';
/**
 * useDesignPatterns Hook
 *
 * React hook for working with design patterns in the architect framework.
 *
 * @packageDocumentation
 */

import { useState, useCallback, useMemo } from 'react'
import type {
  DesignPattern,
  DesignPatternCategory,
  PatternRecommendation,
} from '../types'
import {
  DESIGN_PATTERN_CATALOG,
  getPatternInfo,
  getPatternIdsByCategory,
  suggestPatternsForUseCase,
  createPatternRecommendation,
} from '../phases/phase2-planning'

/**
 * Pattern selection state
 */
export interface PatternSelectionState {
  /** Selected patterns */
  selectedPatterns: DesignPattern[]
  /** Pattern recommendations */
  recommendations: PatternRecommendation[]
  /** Current filter category */
  filterCategory: DesignPatternCategory | 'all'
  /** Search query */
  searchQuery: string
}

/**
 * Options for the design patterns hook
 */
export interface UseDesignPatternsOptions {
  /** Initial selected patterns */
  initialPatterns?: DesignPattern[]
  /** Callback when pattern is selected */
  onPatternSelected?: (pattern: DesignPattern) => void
  /** Callback when pattern is deselected */
  onPatternDeselected?: (pattern: DesignPattern) => void
}

/**
 * Return type for the design patterns hook
 */
export interface UseDesignPatternsReturn {
  /** Current state */
  state: PatternSelectionState
  /** All available patterns */
  allPatterns: DesignPattern[]
  /** Filtered patterns based on category and search */
  filteredPatterns: DesignPattern[]
  /** Select a pattern */
  selectPattern: (pattern: DesignPattern) => void
  /** Deselect a pattern */
  deselectPattern: (pattern: DesignPattern) => void
  /** Toggle pattern selection */
  togglePattern: (pattern: DesignPattern) => void
  /** Clear all selections */
  clearSelections: () => void
  /** Set filter category */
  setFilterCategory: (category: DesignPatternCategory | 'all') => void
  /** Set search query */
  setSearchQuery: (query: string) => void
  /** Add a recommendation */
  addRecommendation: (
    pattern: DesignPattern,
    rationale: string,
    tradeoffs?: string[],
    implementationNotes?: string
  ) => void
  /** Remove a recommendation */
  removeRecommendation: (pattern: DesignPattern) => void
  /** Get pattern info */
  getPatternDetails: (
    pattern: DesignPattern
  ) => ReturnType<typeof getPatternInfo>
  /** Suggest patterns for use case */
  suggestPatterns: (useCase: string) => DesignPattern[]
  /** Check if pattern is selected */
  isSelected: (pattern: DesignPattern) => boolean
  /** Get patterns by category */
  getByCategory: (category: DesignPatternCategory) => DesignPattern[]
}

/**
 * Initial state
 */
const INITIAL_STATE: PatternSelectionState = {
  selectedPatterns: [],
  recommendations: [],
  filterCategory: 'all',
  searchQuery: '',
}

/**
 * All available pattern names
 */
const ALL_PATTERNS = Object.keys(DESIGN_PATTERN_CATALOG) as DesignPattern[]

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
 *     logger.debug('Selected:', pattern)
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
export function useDesignPatterns(
  options: UseDesignPatternsOptions = {}
): UseDesignPatternsReturn {
  const {
    initialPatterns = [],
    onPatternSelected,
    onPatternDeselected,
  } = options

  const [state, setState] = useState<PatternSelectionState>(() => ({
    ...INITIAL_STATE,
    selectedPatterns: initialPatterns,
  }))

  /**
   * Filter patterns based on category and search
   */
  const filteredPatterns = useMemo(() => {
    let patterns = ALL_PATTERNS

    // Filter by category
    if (state.filterCategory !== 'all') {
      patterns = getPatternIdsByCategory(state.filterCategory)
    }

    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      patterns = patterns.filter((pattern) => {
        const info = DESIGN_PATTERN_CATALOG[pattern]
        return (
          pattern.toLowerCase().includes(query) ||
          info.name.toLowerCase().includes(query) ||
          info.intent.toLowerCase().includes(query) ||
          info.useCases.some((uc) => uc.toLowerCase().includes(query))
        )
      })
    }

    return patterns
  }, [state.filterCategory, state.searchQuery])

  /**
   * Select a pattern
   */
  const selectPattern = useCallback(
    (pattern: DesignPattern) => {
      setState((prev) => {
        if (prev.selectedPatterns.includes(pattern)) {
          return prev
        }
        onPatternSelected?.(pattern)
        return {
          ...prev,
          selectedPatterns: [...prev.selectedPatterns, pattern],
        }
      })
    },
    [onPatternSelected]
  )

  /**
   * Deselect a pattern
   */
  const deselectPattern = useCallback(
    (pattern: DesignPattern) => {
      setState((prev) => {
        if (!prev.selectedPatterns.includes(pattern)) {
          return prev
        }
        onPatternDeselected?.(pattern)
        return {
          ...prev,
          selectedPatterns: prev.selectedPatterns.filter((p) => p !== pattern),
          recommendations: prev.recommendations.filter(
            (r) => r.pattern !== pattern
          ),
        }
      })
    },
    [onPatternDeselected]
  )

  /**
   * Toggle pattern selection
   */
  const togglePattern = useCallback(
    (pattern: DesignPattern) => {
      if (state.selectedPatterns.includes(pattern)) {
        deselectPattern(pattern)
      } else {
        selectPattern(pattern)
      }
    },
    [state.selectedPatterns, selectPattern, deselectPattern]
  )

  /**
   * Clear all selections
   */
  const clearSelections = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedPatterns: [],
      recommendations: [],
    }))
  }, [])

  /**
   * Set filter category
   */
  const setFilterCategory = useCallback(
    (category: DesignPatternCategory | 'all') => {
      setState((prev) => ({
        ...prev,
        filterCategory: category,
      }))
    },
    []
  )

  /**
   * Set search query
   */
  const setSearchQuery = useCallback((query: string) => {
    setState((prev) => ({
      ...prev,
      searchQuery: query,
    }))
  }, [])

  /**
   * Add a recommendation
   */
  const addRecommendation = useCallback(
    (
      pattern: DesignPattern,
      rationale: string,
      tradeoffs?: string[],
      implementationNotes?: string
    ) => {
      const recommendation = createPatternRecommendation(
        pattern,
        rationale,
        tradeoffs,
        implementationNotes
      )

      setState((prev) => ({
        ...prev,
        recommendations: [
          ...prev.recommendations.filter((r) => r.pattern !== pattern),
          recommendation,
        ],
        selectedPatterns: prev.selectedPatterns.includes(pattern)
          ? prev.selectedPatterns
          : [...prev.selectedPatterns, pattern],
      }))
    },
    []
  )

  /**
   * Remove a recommendation
   */
  const removeRecommendation = useCallback((pattern: DesignPattern) => {
    setState((prev) => ({
      ...prev,
      recommendations: prev.recommendations.filter(
        (r) => r.pattern !== pattern
      ),
    }))
  }, [])

  /**
   * Get pattern details
   */
  const getPatternDetails = useCallback(
    (pattern: DesignPattern) => getPatternInfo(pattern),
    []
  )

  /**
   * Suggest patterns for use case
   */
  const suggestPatterns = useCallback(
    (useCase: string) => suggestPatternsForUseCase(useCase),
    []
  )

  /**
   * Check if pattern is selected
   */
  const isSelected = useCallback(
    (pattern: DesignPattern) => state.selectedPatterns.includes(pattern),
    [state.selectedPatterns]
  )

  /**
   * Get patterns by category
   */
  const getByCategory = useCallback(
    (category: DesignPatternCategory) => getPatternIdsByCategory(category),
    []
  )

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
  }
}
