'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { componentDefinitions } from '../config/components'
import type { ComponentDefinition, PropValue } from '../types'

interface PlaygroundState {
  selectedComponent: string
  props: Record<string, PropValue>
  showCode: boolean
  codeLanguage: 'tsx' | 'jsx'
  theme: 'light' | 'dark'
}

interface PlaygroundContextValue extends PlaygroundState {
  setSelectedComponent: (id: string) => void
  updateProp: (key: string, value: PropValue) => void
  resetProps: () => void
  toggleCodeView: () => void
  setCodeLanguage: (lang: 'tsx' | 'jsx') => void
  setTheme: (theme: 'light' | 'dark') => void
  getComponentDefinition: () => ComponentDefinition | undefined
  exportConfig: () => string
  importConfig: (config: string) => void
  shareableUrl: string
}

const PlaygroundContext = createContext<PlaygroundContextValue | undefined>(undefined)

export function PlaygroundProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlaygroundState>({
    selectedComponent: 'ChatInput',
    props: {},
    showCode: true,
    codeLanguage: 'tsx',
    theme: 'light',
  })

  // Initialize props from component definition
  const initializeProps = useCallback((componentId: string) => {
    const component = componentDefinitions.find((c) => c.id === componentId)
    if (!component) return {}

    const defaultProps: Record<string, PropValue> = {}
    component.props.forEach((prop) => {
      defaultProps[prop.name] = prop.default
    })
    return defaultProps
  }, [])

  // Load from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const configParam = params.get('config')

    if (configParam) {
      try {
        const config = JSON.parse(atob(configParam))
        setState({
          selectedComponent: config.component || 'ChatInput',
          props: config.props || {},
          showCode: config.showCode ?? true,
          codeLanguage: config.codeLanguage || 'tsx',
          theme: config.theme || 'light',
        })
      } catch (e) {
        console.error('Failed to parse config from URL:', e)
      }
    } else {
      // Initialize with default props
      setState((prev) => ({
        ...prev,
        props: initializeProps(prev.selectedComponent),
      }))
    }
  }, [initializeProps])

  const setSelectedComponent = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      selectedComponent: id,
      props: initializeProps(id),
    }))
  }, [initializeProps])

  const updateProp = useCallback((key: string, value: PropValue) => {
    setState((prev) => ({
      ...prev,
      props: { ...prev.props, [key]: value },
    }))
  }, [])

  const resetProps = useCallback(() => {
    setState((prev) => ({
      ...prev,
      props: initializeProps(prev.selectedComponent),
    }))
  }, [initializeProps])

  const toggleCodeView = useCallback(() => {
    setState((prev) => ({ ...prev, showCode: !prev.showCode }))
  }, [])

  const setCodeLanguage = useCallback((lang: 'tsx' | 'jsx') => {
    setState((prev) => ({ ...prev, codeLanguage: lang }))
  }, [])

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setState((prev) => ({ ...prev, theme }))
  }, [])

  const getComponentDefinition = useCallback(() => {
    return componentDefinitions.find((c) => c.id === state.selectedComponent)
  }, [state.selectedComponent])

  const exportConfig = useCallback(() => {
    const config = {
      component: state.selectedComponent,
      props: state.props,
      showCode: state.showCode,
      codeLanguage: state.codeLanguage,
      theme: state.theme,
    }
    return JSON.stringify(config, null, 2)
  }, [state])

  const importConfig = useCallback((config: string) => {
    try {
      const parsed = JSON.parse(config)
      setState({
        selectedComponent: parsed.component || 'ChatInput',
        props: parsed.props || {},
        showCode: parsed.showCode ?? true,
        codeLanguage: parsed.codeLanguage || 'tsx',
        theme: parsed.theme || 'light',
      })
    } catch (e) {
      console.error('Failed to import config:', e)
    }
  }, [])

  const shareableUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''

    const config = {
      component: state.selectedComponent,
      props: state.props,
      showCode: state.showCode,
      codeLanguage: state.codeLanguage,
      theme: state.theme,
    }
    const encoded = btoa(JSON.stringify(config))
    return `${window.location.origin}${window.location.pathname}?config=${encoded}`
  }, [state])

  const value: PlaygroundContextValue = {
    ...state,
    setSelectedComponent,
    updateProp,
    resetProps,
    toggleCodeView,
    setCodeLanguage,
    setTheme,
    getComponentDefinition,
    exportConfig,
    importConfig,
    shareableUrl,
  }

  return (
    <PlaygroundContext.Provider value={value}>
      {children}
    </PlaygroundContext.Provider>
  )
}

export function usePlayground() {
  const context = useContext(PlaygroundContext)
  if (!context) {
    throw new Error('usePlayground must be used within PlaygroundProvider')
  }
  return context
}
