'use client'

/**
 * usePromptArchitect Hook
 *
 * State management hook for the Prompt Architect Studio.
 * Handles prompt templates, variable extraction, compilation, versioning,
 * and streaming responses.
 *
 * @packageDocumentation
 */

import * as React from 'react'
import { estimateTokens } from '../../../../utils/tokenization/estimator'
import type { CoreMessage } from '../../../../hooks/chat/use-chat-enhanced'
import type {
  PromptArchitectState,
  PromptArchitectAction,
  ExtractedVariable,
  PromptVersion,
  PreviewMessage,
  TokenStats,
  PromptPreset,
  UsePromptArchitectOptions,
  UsePromptArchitectReturn,
  DebugViewMode,
  ModelConfig,
} from '../types'
import { getModelConfig, getDefaultModelConfig, estimateCost } from '../types'
import { extractVariablesFromMultiple } from '../utils/variable-parser'
import {
  compileTemplate,
  buildMessagesArray,
  getMissingVariables,
} from '../utils/template-compiler'

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_STORAGE_KEY = 'prompt-architect-state'
const DEFAULT_AUTO_SAVE_DELAY = 1000
const MAX_VERSIONS = 20 // Limit to prevent unbounded localStorage growth

const DEFAULT_SYSTEM_PROMPT = `You are a helpful AI assistant.

Your role is to {{ role_description }}.

Guidelines:
- Be concise and accurate
- {{ additional_guidelines }}`

const DEFAULT_USER_PROMPT = `{{ user_request }}`

// =============================================================================
// INITIAL STATE
// =============================================================================

function createInitialState(
  options?: UsePromptArchitectOptions
): PromptArchitectState {
  const defaultModel = getDefaultModelConfig()

  return {
    // Editor
    systemPrompt: options?.initialSystemPrompt ?? DEFAULT_SYSTEM_PROMPT,
    userPromptTemplate: options?.initialUserPrompt ?? DEFAULT_USER_PROMPT,

    // Variables
    extractedVariables: [],
    variableValues: {},

    // Versioning
    versions: [],
    activeVersionId: null,

    // Preview
    previewMessages: [],
    isStreaming: false,
    streamingContent: '',
    lastError: null,

    // UI
    debugViewMode: 'compiled',
    showDebugView: false,
    structuredOutputMode: false,
    selectedModel: options?.defaultModel ?? defaultModel.id,

    // Tokens
    tokenStats: {
      systemPromptTokens: 0,
      userPromptTokens: 0,
      variableTokens: 0,
      totalTokens: 0,
      maxTokens: options?.maxTokens ?? defaultModel.maxTokens,
      utilizationPercent: 0,
      estimatedInputCost: 0,
      estimatedOutputCost: 0,
      estimatedTotalCost: 0,
    },

    // Persistence
    lastSavedAt: null,
    isDirty: false,
  }
}

// =============================================================================
// REDUCER
// =============================================================================

function promptArchitectReducer(
  state: PromptArchitectState,
  action: PromptArchitectAction
): PromptArchitectState {
  switch (action.type) {
    case 'SET_SYSTEM_PROMPT':
      return {
        ...state,
        systemPrompt: action.payload,
        isDirty: true,
        activeVersionId: null, // Editing breaks version link
      }

    case 'SET_USER_PROMPT_TEMPLATE':
      return {
        ...state,
        userPromptTemplate: action.payload,
        isDirty: true,
        activeVersionId: null,
      }

    case 'SET_VARIABLE_VALUE':
      return {
        ...state,
        variableValues: {
          ...state.variableValues,
          [action.payload.name]: action.payload.value,
        },
        isDirty: true,
      }

    case 'SET_ALL_VARIABLES':
      return {
        ...state,
        variableValues: action.payload,
        isDirty: true,
      }

    case 'UPDATE_EXTRACTED_VARIABLES':
      return {
        ...state,
        extractedVariables: action.payload,
      }

    case 'LOAD_VERSION': {
      const version = state.versions.find((v) => v.id === action.payload)
      if (!version) return state

      return {
        ...state,
        systemPrompt: version.systemPrompt,
        userPromptTemplate: version.userPromptTemplate,
        variableValues: { ...version.variableValues },
        activeVersionId: version.id,
        isDirty: false,
      }
    }

    case 'SAVE_VERSION': {
      const newVersion: PromptVersion = {
        id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: action.payload.name,
        description: action.payload.description,
        systemPrompt: state.systemPrompt,
        userPromptTemplate: state.userPromptTemplate,
        variableValues: { ...state.variableValues },
        createdAt: new Date(),
      }

      // Add new version and enforce MAX_VERSIONS limit
      let versions = [...state.versions, newVersion]

      // Remove oldest versions if exceeding limit (keep newest)
      if (versions.length > MAX_VERSIONS) {
        versions = versions.slice(-MAX_VERSIONS)
      }

      return {
        ...state,
        versions,
        activeVersionId: newVersion.id,
        isDirty: false,
      }
    }

    case 'DELETE_VERSION':
      return {
        ...state,
        versions: state.versions.filter((v) => v.id !== action.payload),
        activeVersionId:
          state.activeVersionId === action.payload
            ? null
            : state.activeVersionId,
      }

    case 'LOAD_PRESET':
      return {
        ...state,
        systemPrompt: action.payload.systemPrompt,
        userPromptTemplate: action.payload.userPromptTemplate,
        variableValues: { ...action.payload.defaultVariables },
        activeVersionId: null,
        isDirty: true,
      }

    case 'ADD_PREVIEW_MESSAGE':
      return {
        ...state,
        previewMessages: [...state.previewMessages, action.payload],
      }

    case 'SET_STREAMING':
      return {
        ...state,
        isStreaming: action.payload,
        streamingContent: action.payload ? '' : state.streamingContent,
      }

    case 'UPDATE_STREAMING_CONTENT':
      return {
        ...state,
        streamingContent: action.payload,
      }

    case 'APPEND_STREAMING_CONTENT':
      return {
        ...state,
        streamingContent: state.streamingContent + action.payload,
      }

    case 'FINISH_STREAMING': {
      // Convert streaming content to a message
      const assistantMessage: PreviewMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: state.streamingContent,
        isCompiled: true,
        timestamp: new Date(),
      }

      return {
        ...state,
        isStreaming: false,
        streamingContent: '',
        previewMessages: [...state.previewMessages, assistantMessage],
        lastError: action.payload?.error ?? null,
      }
    }

    case 'CLEAR_PREVIEW':
      return {
        ...state,
        previewMessages: [],
        streamingContent: '',
        lastError: null,
      }

    case 'SET_DEBUG_VIEW_MODE':
      return {
        ...state,
        debugViewMode: action.payload,
      }

    case 'TOGGLE_DEBUG_VIEW':
      return {
        ...state,
        showDebugView: !state.showDebugView,
      }

    case 'TOGGLE_STRUCTURED_OUTPUT':
      return {
        ...state,
        structuredOutputMode: !state.structuredOutputMode,
        isDirty: true,
      }

    case 'SET_MODEL': {
      const modelConfig = getModelConfig(action.payload)
      return {
        ...state,
        selectedModel: action.payload,
        tokenStats: {
          ...state.tokenStats,
          maxTokens: modelConfig?.maxTokens ?? state.tokenStats.maxTokens,
        },
      }
    }

    case 'UPDATE_TOKEN_STATS':
      return {
        ...state,
        tokenStats: action.payload,
      }

    case 'MARK_SAVED':
      return {
        ...state,
        lastSavedAt: new Date(),
        isDirty: false,
      }

    case 'MARK_DIRTY':
      return {
        ...state,
        isDirty: true,
      }

    case 'HYDRATE_FROM_STORAGE': {
      // Enforce MAX_VERSIONS limit on loaded data
      let versions = action.payload.versions ?? state.versions
      if (versions.length > MAX_VERSIONS) {
        versions = versions.slice(-MAX_VERSIONS)
      }

      return {
        ...state,
        ...action.payload,
        versions,
        // Reset transient state
        isStreaming: false,
        streamingContent: '',
        lastError: null,
      }
    }

    case 'RESET':
      return createInitialState()

    default:
      return state
  }
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook for managing Prompt Architect Studio state
 *
 * @param options - Configuration options
 * @returns State and actions for the Prompt Architect
 *
 * @example
 * ```tsx
 * const {
 *   state,
 *   compiledSystemPrompt,
 *   compiledUserPrompt,
 *   setSystemPrompt,
 *   setVariableValue,
 *   runPrompt,
 * } = usePromptArchitect({
 *   autoSave: true,
 *   defaultModel: 'gpt-4o',
 * })
 * ```
 */
export function usePromptArchitect(
  options?: UsePromptArchitectOptions
): UsePromptArchitectReturn {
  const {
    autoSave = true,
    storageKey = DEFAULT_STORAGE_KEY,
    autoSaveDelay = DEFAULT_AUTO_SAVE_DELAY,
    onRun,
  } = options ?? {}

  // Initialize reducer
  const [state, dispatch] = React.useReducer(
    promptArchitectReducer,
    options,
    createInitialState
  )

  // ==========================================================================
  // VARIABLE EXTRACTION (runs when templates change)
  // ==========================================================================

  React.useEffect(() => {
    const result = extractVariablesFromMultiple([
      state.systemPrompt,
      state.userPromptTemplate,
    ])

    dispatch({
      type: 'UPDATE_EXTRACTED_VARIABLES',
      payload: result.variables,
    })

    // Preserve existing values, add defaults for new variables
    const currentValues = { ...state.variableValues }
    let hasNewVariables = false

    for (const v of result.variables) {
      if (!(v.name in currentValues)) {
        currentValues[v.name] = ''
        hasNewVariables = true
      }
    }

    if (hasNewVariables) {
      dispatch({
        type: 'SET_ALL_VARIABLES',
        payload: currentValues,
      })
    }
  }, [state.systemPrompt, state.userPromptTemplate, state.variableValues])

  // ==========================================================================
  // TOKEN COUNTING (debounced)
  // ==========================================================================

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const compiledSystem = compileTemplate(
        state.systemPrompt,
        state.variableValues,
        { keepUnresolved: false }
      )
      const compiledUser = compileTemplate(
        state.userPromptTemplate,
        state.variableValues,
        { keepUnresolved: false }
      )

      const systemTokens = estimateTokens(compiledSystem, state.selectedModel)
      const userTokens = estimateTokens(compiledUser, state.selectedModel)

      // Calculate variable tokens (tokens used by variable values)
      const variableTokens = Object.values(state.variableValues).reduce(
        (sum, value) => sum + estimateTokens(value, state.selectedModel),
        0
      )

      const totalTokens = systemTokens + userTokens
      const modelConfig = getModelConfig(state.selectedModel)
      const maxTokens = modelConfig?.maxTokens ?? 8192
      const utilizationPercent = Math.min(
        100,
        Math.round((totalTokens / maxTokens) * 100)
      )

      // Estimate output tokens as 25% of max output (reasonable estimate)
      const estimatedOutputTokens = Math.min(
        (modelConfig?.maxOutputTokens ?? 2048) * 0.25,
        2000
      )

      // Calculate cost estimates
      const costs = estimateCost(
        totalTokens,
        estimatedOutputTokens,
        state.selectedModel
      )

      dispatch({
        type: 'UPDATE_TOKEN_STATS',
        payload: {
          systemPromptTokens: systemTokens,
          userPromptTokens: userTokens,
          variableTokens,
          totalTokens,
          maxTokens,
          utilizationPercent,
          estimatedInputCost: costs.inputCost,
          estimatedOutputCost: costs.outputCost,
          estimatedTotalCost: costs.totalCost,
        },
      })
    }, 150) // Debounce token calculation

    return () => clearTimeout(timeoutId)
  }, [
    state.systemPrompt,
    state.userPromptTemplate,
    state.variableValues,
    state.selectedModel,
  ])

  // ==========================================================================
  // AUTO-SAVE TO LOCALSTORAGE
  // ==========================================================================

  React.useEffect(() => {
    if (!autoSave || !state.isDirty) return

    const timeoutId = setTimeout(() => {
      try {
        const toSave = {
          systemPrompt: state.systemPrompt,
          userPromptTemplate: state.userPromptTemplate,
          variableValues: state.variableValues,
          versions: state.versions,
          structuredOutputMode: state.structuredOutputMode,
          selectedModel: state.selectedModel,
        }
        localStorage.setItem(storageKey, JSON.stringify(toSave))
        dispatch({ type: 'MARK_SAVED' })
      } catch (e) {
        console.warn('[PromptArchitect] Failed to save to localStorage:', e)
      }
    }, autoSaveDelay)

    return () => clearTimeout(timeoutId)
  }, [
    autoSave,
    autoSaveDelay,
    storageKey,
    state.isDirty,
    state.systemPrompt,
    state.userPromptTemplate,
    state.variableValues,
    state.versions,
    state.structuredOutputMode,
    state.selectedModel,
  ])

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  const compiledSystemPrompt = React.useMemo(
    () =>
      compileTemplate(state.systemPrompt, state.variableValues, {
        keepUnresolved: true,
      }),
    [state.systemPrompt, state.variableValues]
  )

  const compiledUserPrompt = React.useMemo(
    () =>
      compileTemplate(state.userPromptTemplate, state.variableValues, {
        keepUnresolved: true,
      }),
    [state.userPromptTemplate, state.variableValues]
  )

  const messagesArray = React.useMemo(
    () =>
      buildMessagesArray(
        compileTemplate(state.systemPrompt, state.variableValues, {
          keepUnresolved: false,
        }),
        compileTemplate(state.userPromptTemplate, state.variableValues, {
          keepUnresolved: false,
        }),
        state.structuredOutputMode
      ),
    [
      state.systemPrompt,
      state.userPromptTemplate,
      state.variableValues,
      state.structuredOutputMode,
    ]
  )

  const missingVariables = React.useMemo(() => {
    const systemMissing = getMissingVariables(
      state.systemPrompt,
      state.variableValues
    )
    const userMissing = getMissingVariables(
      state.userPromptTemplate,
      state.variableValues
    )
    return [...new Set([...systemMissing, ...userMissing])]
  }, [state.systemPrompt, state.userPromptTemplate, state.variableValues])

  const hasAllRequiredVariables = missingVariables.length === 0

  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  const setSystemPrompt = React.useCallback((value: string) => {
    dispatch({ type: 'SET_SYSTEM_PROMPT', payload: value })
  }, [])

  const setUserPromptTemplate = React.useCallback((value: string) => {
    dispatch({ type: 'SET_USER_PROMPT_TEMPLATE', payload: value })
  }, [])

  const setVariableValue = React.useCallback((name: string, value: string) => {
    dispatch({ type: 'SET_VARIABLE_VALUE', payload: { name, value } })
  }, [])

  const setAllVariables = React.useCallback(
    (values: Record<string, string>) => {
      dispatch({ type: 'SET_ALL_VARIABLES', payload: values })
    },
    []
  )

  const clearVariables = React.useCallback(() => {
    const cleared: Record<string, string> = {}
    for (const v of state.extractedVariables) {
      cleared[v.name] = ''
    }
    dispatch({ type: 'SET_ALL_VARIABLES', payload: cleared })
  }, [state.extractedVariables])

  const saveVersion = React.useCallback(
    (name: string, description?: string) => {
      dispatch({ type: 'SAVE_VERSION', payload: { name, description } })
    },
    []
  )

  const loadVersion = React.useCallback((id: string) => {
    dispatch({ type: 'LOAD_VERSION', payload: id })
  }, [])

  const deleteVersion = React.useCallback((id: string) => {
    dispatch({ type: 'DELETE_VERSION', payload: id })
  }, [])

  const loadPreset = React.useCallback((preset: PromptPreset) => {
    dispatch({ type: 'LOAD_PRESET', payload: preset })
  }, [])

  const toggleDebugView = React.useCallback(() => {
    dispatch({ type: 'TOGGLE_DEBUG_VIEW' })
  }, [])

  const setDebugViewMode = React.useCallback((mode: DebugViewMode) => {
    dispatch({ type: 'SET_DEBUG_VIEW_MODE', payload: mode })
  }, [])

  const toggleStructuredOutput = React.useCallback(() => {
    dispatch({ type: 'TOGGLE_STRUCTURED_OUTPUT' })
  }, [])

  const setModel = React.useCallback((model: string) => {
    dispatch({ type: 'SET_MODEL', payload: model })
  }, [])

  const clearPreview = React.useCallback(() => {
    dispatch({ type: 'CLEAR_PREVIEW' })
  }, [])

  const runPrompt = React.useCallback(async () => {
    if (state.isStreaming) return

    // Clear previous messages and add new ones
    dispatch({ type: 'CLEAR_PREVIEW' })

    // Add system message to preview
    const systemContent = compileTemplate(
      state.systemPrompt,
      state.variableValues,
      { keepUnresolved: false }
    )
    if (systemContent.trim()) {
      dispatch({
        type: 'ADD_PREVIEW_MESSAGE',
        payload: {
          id: `msg-system-${Date.now()}`,
          role: 'system',
          content: systemContent,
          isCompiled: true,
          timestamp: new Date(),
        },
      })
    }

    // Add user message to preview
    const userContent = compileTemplate(
      state.userPromptTemplate,
      state.variableValues,
      { keepUnresolved: false }
    )
    if (userContent.trim()) {
      dispatch({
        type: 'ADD_PREVIEW_MESSAGE',
        payload: {
          id: `msg-user-${Date.now()}`,
          role: 'user',
          content: userContent,
          isCompiled: true,
          timestamp: new Date(),
        },
      })
    }

    // Start streaming
    dispatch({ type: 'SET_STREAMING', payload: true })

    try {
      if (onRun) {
        // Use custom handler
        await onRun(messagesArray)
      } else {
        // Demo mode - simulate streaming response
        await simulateStreamingResponse(dispatch, state.structuredOutputMode)
      }

      dispatch({ type: 'FINISH_STREAMING' })
    } catch (error) {
      dispatch({
        type: 'FINISH_STREAMING',
        payload: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      })
    }
  }, [
    state.isStreaming,
    state.systemPrompt,
    state.userPromptTemplate,
    state.variableValues,
    state.structuredOutputMode,
    messagesArray,
    onRun,
  ])

  const saveToStorage = React.useCallback(() => {
    try {
      const toSave = {
        systemPrompt: state.systemPrompt,
        userPromptTemplate: state.userPromptTemplate,
        variableValues: state.variableValues,
        versions: state.versions,
        structuredOutputMode: state.structuredOutputMode,
        selectedModel: state.selectedModel,
      }
      localStorage.setItem(storageKey, JSON.stringify(toSave))
      dispatch({ type: 'MARK_SAVED' })
    } catch (e) {
      console.warn('[PromptArchitect] Failed to save to localStorage:', e)
    }
  }, [
    storageKey,
    state.systemPrompt,
    state.userPromptTemplate,
    state.variableValues,
    state.versions,
    state.structuredOutputMode,
    state.selectedModel,
  ])

  const loadFromStorage = React.useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)

        // Convert date strings back to Date objects for versions
        if (parsed.versions && Array.isArray(parsed.versions)) {
          parsed.versions = parsed.versions.map(
            (v: { createdAt?: string | Date; [key: string]: unknown }) => ({
              ...v,
              createdAt: v.createdAt ? new Date(v.createdAt) : new Date(),
            })
          )
        }

        dispatch({ type: 'HYDRATE_FROM_STORAGE', payload: parsed })
        return true
      }
    } catch (e) {
      console.warn('[PromptArchitect] Failed to load from localStorage:', e)
    }
    return false
  }, [storageKey])

  const reset = React.useCallback(() => {
    dispatch({ type: 'RESET' })
    try {
      localStorage.removeItem(storageKey)
    } catch {
      // Ignore storage errors on reset
    }
  }, [storageKey])

  // Load from storage on mount
  React.useEffect(() => {
    loadFromStorage()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentionally only run once on mount
  }, [])

  // ==========================================================================
  // RETURN
  // ==========================================================================

  return {
    state,
    compiledSystemPrompt,
    compiledUserPrompt,
    messagesArray,
    hasAllRequiredVariables,
    missingVariables,
    setSystemPrompt,
    setUserPromptTemplate,
    setVariableValue,
    setAllVariables,
    clearVariables,
    saveVersion,
    loadVersion,
    deleteVersion,
    loadPreset,
    toggleDebugView,
    setDebugViewMode,
    toggleStructuredOutput,
    setModel,
    runPrompt,
    clearPreview,
    saveToStorage,
    loadFromStorage,
    reset,
  }
}

// =============================================================================
// DEMO STREAMING SIMULATION
// =============================================================================

/**
 * Simulate a streaming response for demo purposes
 */
async function simulateStreamingResponse(
  dispatch: React.Dispatch<PromptArchitectAction>,
  structuredOutputMode: boolean
): Promise<void> {
  const response = structuredOutputMode
    ? `{
  "thinking": "Let me analyze this request step by step. First, I need to understand what's being asked, then formulate a helpful response based on the context provided.",
  "result": "I've processed your request successfully. Based on the information you've provided, here's my analysis and recommendation. The key points to consider are the context you've shared and the specific goals you want to achieve.",
  "confidence": 0.92
}`
    : `I understand your request. Let me help you with that.

Based on the context you've provided, here's my response:

1. **First Point**: I've analyzed the information you shared and identified the key aspects that need attention.

2. **Second Point**: Considering your goals, I recommend the following approach...

3. **Conclusion**: This solution should address your needs effectively while being practical to implement.

Is there anything specific you'd like me to elaborate on?`

  // Simulate streaming character by character with variable speed
  for (let i = 0; i < response.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 20 + 5))
    dispatch({
      type: 'UPDATE_STREAMING_CONTENT',
      payload: response.slice(0, i + 1),
    })
  }
}

export default usePromptArchitect
