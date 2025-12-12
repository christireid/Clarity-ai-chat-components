/**
 * Playground Context
 *
 * Central state management for the playground.
 * Provides state and actions to all child components.
 */

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import type {
  PlaygroundSettings,
  ConsoleLogEntry,
  PlaygroundError,
} from '../types'
import { templates, getTemplateById } from '../templates/index'
import {
  parseUrlState,
  copyShareableUrl,
  openInCodeSandbox,
  openInStackBlitz,
  downloadAsZip,
} from '../utils'

// Storage key for localStorage persistence
const STORAGE_KEY = 'clarity-playground-state'
const STORAGE_VERSION = 1

// Default settings
const DEFAULT_SETTINGS: PlaygroundSettings = {
  autoRun: true,
  lineNumbers: true,
  fontSize: 14,
  tabSize: 2,
  wordWrap: false,
  minimap: false,
}

const DEFAULT_TEMPLATE = templates[0]

// State types
interface PlaygroundFullState {
  code: string
  theme: 'light' | 'dark'
  selectedTemplate: string
  settings: PlaygroundSettings
  consoleEntries: ConsoleLogEntry[]
  error: PlaygroundError | null
  showSettings: boolean
  showExportMenu: boolean
  showConsole: boolean
  isLoading: boolean
  lastSaved: Date | null
}

// Action types
type PlaygroundAction =
  | { type: 'SET_CODE'; code: string }
  | { type: 'SET_THEME'; theme: 'light' | 'dark' }
  | { type: 'SET_TEMPLATE'; templateId: string }
  | { type: 'SET_SETTINGS'; settings: Partial<PlaygroundSettings> }
  | { type: 'ADD_CONSOLE_ENTRY'; entry: ConsoleLogEntry }
  | { type: 'CLEAR_CONSOLE' }
  | { type: 'SET_ERROR'; error: PlaygroundError | null }
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'TOGGLE_EXPORT_MENU' }
  | { type: 'TOGGLE_CONSOLE' }
  | { type: 'CLOSE_EXPORT_MENU' }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_LAST_SAVED'; date: Date }
  | { type: 'RESET_TO_TEMPLATE' }
  | {
      type: 'LOAD_STATE'
      state: Partial<PlaygroundFullState>
    }

// Initial state
const initialState: PlaygroundFullState = {
  code: DEFAULT_TEMPLATE.code,
  theme: 'light',
  selectedTemplate: DEFAULT_TEMPLATE.id,
  settings: DEFAULT_SETTINGS,
  consoleEntries: [],
  error: null,
  showSettings: false,
  showExportMenu: false,
  showConsole: false,
  isLoading: false,
  lastSaved: null,
}

// Reducer
function playgroundReducer(
  state: PlaygroundFullState,
  action: PlaygroundAction
): PlaygroundFullState {
  switch (action.type) {
    case 'SET_CODE':
      return { ...state, code: action.code }

    case 'SET_THEME':
      return { ...state, theme: action.theme }

    case 'SET_TEMPLATE': {
      const template = getTemplateById(action.templateId)
      if (template) {
        return {
          ...state,
          selectedTemplate: action.templateId,
          code: template.code,
        }
      }
      return state
    }

    case 'SET_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      }

    case 'ADD_CONSOLE_ENTRY':
      return {
        ...state,
        consoleEntries: [...state.consoleEntries, action.entry],
      }

    case 'CLEAR_CONSOLE':
      return { ...state, consoleEntries: [] }

    case 'SET_ERROR':
      return { ...state, error: action.error }

    case 'TOGGLE_SETTINGS':
      return { ...state, showSettings: !state.showSettings }

    case 'TOGGLE_EXPORT_MENU':
      return { ...state, showExportMenu: !state.showExportMenu }

    case 'TOGGLE_CONSOLE':
      return { ...state, showConsole: !state.showConsole }

    case 'CLOSE_EXPORT_MENU':
      return { ...state, showExportMenu: false }

    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading }

    case 'SET_LAST_SAVED':
      return { ...state, lastSaved: action.date }

    case 'RESET_TO_TEMPLATE': {
      const template = getTemplateById(state.selectedTemplate)
      return {
        ...state,
        code: template?.code || DEFAULT_TEMPLATE.code,
        error: null,
        consoleEntries: [],
      }
    }

    case 'LOAD_STATE':
      return { ...state, ...action.state }

    default:
      return state
  }
}

// Context types
interface PlaygroundContextValue {
  state: PlaygroundFullState
  actions: {
    setCode: (code: string) => void
    setTheme: (theme: 'light' | 'dark') => void
    toggleTheme: () => void
    setTemplate: (templateId: string) => void
    updateSettings: (settings: Partial<PlaygroundSettings>) => void
    addConsoleEntry: (entry: Omit<ConsoleLogEntry, 'id' | 'timestamp'>) => void
    clearConsole: () => void
    setError: (error: PlaygroundError | null) => void
    toggleSettings: () => void
    toggleExportMenu: () => void
    closeExportMenu: () => void
    toggleConsole: () => void
    reset: () => void
    share: () => Promise<void>
    exportToCodeSandbox: () => void
    exportToStackBlitz: () => void
    downloadZip: () => void
    copyCode: () => Promise<void>
  }
}

const PlaygroundContext = createContext<PlaygroundContextValue | null>(null)

// Provider component
interface PlaygroundProviderProps {
  children: ReactNode
}

export function PlaygroundProvider({ children }: PlaygroundProviderProps) {
  const [state, dispatch] = useReducer(playgroundReducer, initialState)

  // Load state from URL or localStorage on mount
  useEffect(() => {
    // First, try to load from URL
    const urlState = parseUrlState()
    if (urlState) {
      dispatch({
        type: 'LOAD_STATE',
        state: {
          code: urlState.code || state.code,
          theme: urlState.theme || state.theme,
          selectedTemplate: urlState.templateId || state.selectedTemplate,
          settings: urlState.settings
            ? { ...state.settings, ...urlState.settings }
            : state.settings,
        },
      })
      // Clear URL after loading
      window.history.replaceState({}, '', window.location.pathname)
      toast.success('Loaded playground from shared link')
      return
    }

    // Otherwise, try localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.version === STORAGE_VERSION && parsed.state) {
          dispatch({
            type: 'LOAD_STATE',
            state: {
              code: parsed.state.code,
              theme: parsed.state.theme,
              selectedTemplate: parsed.state.selectedTemplate,
              settings: parsed.state.settings,
              showConsole: parsed.state.showConsole,
            },
          })
        }
      }
    } catch {
      // Silently fail on localStorage errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-save to localStorage
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        const toSave = {
          version: STORAGE_VERSION,
          state: {
            code: state.code,
            theme: state.theme,
            selectedTemplate: state.selectedTemplate,
            settings: state.settings,
            showConsole: state.showConsole,
          },
          savedAt: new Date().toISOString(),
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
        dispatch({ type: 'SET_LAST_SAVED', date: new Date() })
      } catch {
        // Silently fail on localStorage errors (quota exceeded, etc.)
      }
    }, 1000) // 1 second debounce

    return () => clearTimeout(timeout)
  }, [
    state.code,
    state.theme,
    state.selectedTemplate,
    state.settings,
    state.showConsole,
  ])

  // Actions
  const actions = useMemo(() => {
    const setCode = (code: string) => {
      dispatch({ type: 'SET_CODE', code })
    }

    const setTheme = (theme: 'light' | 'dark') => {
      dispatch({ type: 'SET_THEME', theme })
    }

    const toggleTheme = () => {
      dispatch({
        type: 'SET_THEME',
        theme: state.theme === 'light' ? 'dark' : 'light',
      })
    }

    const setTemplate = (templateId: string) => {
      const template = getTemplateById(templateId)
      if (template) {
        dispatch({ type: 'SET_TEMPLATE', templateId })
        toast.success(`Loaded template: ${template.name}`)
      } else {
        toast.error(`Template "${templateId}" not found`)
      }
    }

    const updateSettings = (settings: Partial<PlaygroundSettings>) => {
      dispatch({ type: 'SET_SETTINGS', settings })
    }

    const addConsoleEntry = (
      entry: Omit<ConsoleLogEntry, 'id' | 'timestamp'>
    ) => {
      dispatch({
        type: 'ADD_CONSOLE_ENTRY',
        entry: {
          ...entry,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          timestamp: new Date(),
        },
      })
    }

    const clearConsole = () => {
      dispatch({ type: 'CLEAR_CONSOLE' })
    }

    const setError = (error: PlaygroundError | null) => {
      dispatch({ type: 'SET_ERROR', error })
      if (error) {
        addConsoleEntry({
          level: 'error',
          message: error.message,
          args: error.stack ? [error.stack] : undefined,
        })
      }
    }

    const toggleSettings = () => {
      dispatch({ type: 'TOGGLE_SETTINGS' })
    }

    const toggleExportMenu = () => {
      dispatch({ type: 'TOGGLE_EXPORT_MENU' })
    }

    const closeExportMenu = () => {
      dispatch({ type: 'CLOSE_EXPORT_MENU' })
    }

    const toggleConsole = () => {
      dispatch({ type: 'TOGGLE_CONSOLE' })
    }

    const reset = () => {
      dispatch({ type: 'RESET_TO_TEMPLATE' })
      toast.success('Reset to template')
    }

    const share = async () => {
      const result = await copyShareableUrl({
        code: state.code,
        templateId: state.selectedTemplate,
        theme: state.theme,
        settings: state.settings,
      })

      if (result.success) {
        toast.success('Link copied to clipboard!')
      } else {
        toast.error('Failed to copy link')
      }
    }

    const exportToCodeSandbox = () => {
      const template = getTemplateById(state.selectedTemplate)
      openInCodeSandbox({
        code: state.code,
        title: template?.name || 'Clarity Chat Example',
      })
      dispatch({ type: 'CLOSE_EXPORT_MENU' })
      toast.success('Opening in CodeSandbox...')
    }

    const exportToStackBlitz = () => {
      const template = getTemplateById(state.selectedTemplate)
      openInStackBlitz({
        code: state.code,
        title: template?.name || 'Clarity Chat Example',
      })
      dispatch({ type: 'CLOSE_EXPORT_MENU' })
      toast.success('Opening in StackBlitz...')
    }

    const downloadZip = () => {
      const template = getTemplateById(state.selectedTemplate)
      downloadAsZip({
        code: state.code,
        title: template?.name || 'Clarity Chat Example',
      })
      toast.success('Download started!')
    }

    const copyCode = async () => {
      try {
        await navigator.clipboard.writeText(state.code)
        toast.success('Code copied to clipboard!')
      } catch {
        toast.error('Failed to copy code')
      }
    }

    return {
      setCode,
      setTheme,
      toggleTheme,
      setTemplate,
      updateSettings,
      addConsoleEntry,
      clearConsole,
      setError,
      toggleSettings,
      toggleExportMenu,
      closeExportMenu,
      toggleConsole,
      reset,
      share,
      exportToCodeSandbox,
      exportToStackBlitz,
      downloadZip,
      copyCode,
    }
  }, [state.code, state.theme, state.selectedTemplate, state.settings])

  const value = useMemo(() => ({ state, actions }), [state, actions])

  return (
    <PlaygroundContext.Provider value={value}>
      {children}
    </PlaygroundContext.Provider>
  )
}

// Hooks
export function usePlayground() {
  const context = useContext(PlaygroundContext)
  if (!context) {
    throw new Error('usePlayground must be used within a PlaygroundProvider')
  }
  return context
}

export function usePlaygroundState() {
  const { state } = usePlayground()
  return state
}

export function usePlaygroundActions() {
  const { actions } = usePlayground()
  return actions
}

export function usePlaygroundCode() {
  const { state } = usePlayground()
  return state.code
}

export function usePlaygroundTheme() {
  const { state, actions } = usePlayground()
  return {
    theme: state.theme,
    setTheme: actions.setTheme,
    toggleTheme: actions.toggleTheme,
  }
}

export function usePlaygroundSettings() {
  const { state, actions } = usePlayground()
  return { settings: state.settings, updateSettings: actions.updateSettings }
}

export function usePlaygroundConsole() {
  const { state, actions } = usePlayground()
  return {
    entries: state.consoleEntries,
    addEntry: actions.addConsoleEntry,
    clear: actions.clearConsole,
    showConsole: state.showConsole,
    toggleConsole: actions.toggleConsole,
  }
}
