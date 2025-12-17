/**
 * usePromptLibrary Hook
 *
 * React hook for managing prompt templates, versions, and deployments.
 * Provides a complete interface for prompt lifecycle management.
 *
 * @packageDocumentation
 */

'use client'

import * as React from 'react'
import type {
  PromptTemplate,
  PromptVersion,
  PromptDeployment,
  PromptEnvironment,
  PromptChangeHistoryEntry,
  PromptLibraryState,
} from '../types'

/**
 * Options for usePromptLibrary hook
 */
export interface UsePromptLibraryOptions {
  /** Initial templates to load */
  initialTemplates?: PromptTemplate[]
  /** Storage key for persistence */
  storageKey?: string
  /** Enable local storage persistence */
  persist?: boolean
  /** Current user info for change tracking */
  currentUser?: {
    id: string
    name: string
  }
  /** Callback when state changes */
  onChange?: (state: PromptLibraryState) => void
}

/**
 * Return type for usePromptLibrary hook
 */
export interface UsePromptLibraryReturn {
  /** Current state */
  state: PromptLibraryState
  /** Template operations */
  templates: {
    /** Get all templates */
    getAll: () => PromptTemplate[]
    /** Get template by ID */
    get: (id: string) => PromptTemplate | undefined
    /** Get template by name */
    getByName: (name: string) => PromptTemplate | undefined
    /** Search templates */
    search: (query: string) => PromptTemplate[]
    /** Get templates by tag */
    getByTag: (tag: string) => PromptTemplate[]
    /** Add a template */
    add: (template: Omit<PromptTemplate, 'id'> & { id?: string }) => PromptTemplate
    /** Update a template */
    update: (id: string, updates: Partial<PromptTemplate>) => void
    /** Remove a template */
    remove: (id: string) => void
    /** Duplicate a template */
    duplicate: (id: string, newName?: string) => PromptTemplate | undefined
  }
  /** Version operations */
  versions: {
    /** Get all versions for a template */
    getAll: (templateId: string) => PromptVersion[]
    /** Get specific version */
    get: (templateId: string, versionId: string) => PromptVersion | undefined
    /** Get active version */
    getActive: (templateId: string) => PromptVersion | undefined
    /** Create new version */
    create: (
      templateId: string,
      template: string,
      notes?: string
    ) => PromptVersion
    /** Set active version */
    setActive: (templateId: string, versionId: string) => void
    /** Compare two versions */
    compare: (
      templateId: string,
      versionId1: string,
      versionId2: string
    ) => { version1: PromptVersion; version2: PromptVersion; diff: string[] } | undefined
    /** Rollback to version */
    rollback: (templateId: string, versionId: string) => void
  }
  /** Deployment operations */
  deployments: {
    /** Get deployments for environment */
    getByEnvironment: (env: PromptEnvironment) => PromptDeployment[]
    /** Get active deployment for template in environment */
    getActive: (templateId: string, env: PromptEnvironment) => PromptDeployment | undefined
    /** Deploy version to environment */
    deploy: (
      templateId: string,
      versionId: string,
      env: PromptEnvironment,
      trafficPercentage?: number
    ) => PromptDeployment
    /** Rollback deployment */
    rollback: (deploymentId: string) => void
    /** Update traffic percentage */
    updateTraffic: (deploymentId: string, percentage: number) => void
  }
  /** History operations */
  history: {
    /** Get all history */
    getAll: () => PromptChangeHistoryEntry[]
    /** Get history for template */
    getForTemplate: (templateId: string) => PromptChangeHistoryEntry[]
    /** Clear history */
    clear: () => void
  }
  /** Export/Import */
  export: () => string
  import: (json: string) => boolean
  /** Reset to initial state */
  reset: () => void
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate semantic version number
 */
function generateVersion(versions: PromptVersion[]): string {
  if (versions.length === 0) return '1.0.0'
  const latest = versions[versions.length - 1]
  if (!latest) return '1.0.0'
  const parts = latest.version.split('.').map(Number)
  if (parts.length < 3) return '1.0.0'
  parts[2] = (parts[2] ?? 0) + 1
  return parts.join('.')
}

/**
 * Simple diff algorithm for comparing versions
 */
function computeDiff(str1: string, str2: string): string[] {
  const lines1 = str1.split('\n')
  const lines2 = str2.split('\n')
  const diff: string[] = []

  const maxLen = Math.max(lines1.length, lines2.length)
  for (let i = 0; i < maxLen; i++) {
    const line1 = lines1[i]
    const line2 = lines2[i]
    if (line1 === line2) {
      diff.push(`  ${line1 ?? ''}`)
    } else {
      if (line1 !== undefined) diff.push(`- ${line1}`)
      if (line2 !== undefined) diff.push(`+ ${line2}`)
    }
  }

  return diff
}

/**
 * usePromptLibrary Hook
 *
 * Comprehensive prompt library management with templates, versions,
 * deployments, and change history tracking.
 *
 * @example
 * ```tsx
 * const { templates, versions, deployments } = usePromptLibrary({
 *   persist: true,
 *   currentUser: { id: 'user-1', name: 'John Doe' },
 * })
 *
 * // Add a template
 * const template = templates.add({
 *   name: 'Code Review',
 *   template: 'Review this {{language}} code:\n\n{{code}}',
 *   variables: [
 *     { name: 'language', required: true },
 *     { name: 'code', required: true },
 *   ],
 * })
 *
 * // Create a new version
 * const version = versions.create(template.id, 'Updated template...', 'Added error handling')
 *
 * // Deploy to production
 * deployments.deploy(template.id, version.id, 'production')
 * ```
 */
export function usePromptLibrary(
  options: UsePromptLibraryOptions = {}
): UsePromptLibraryReturn {
  const {
    initialTemplates = [],
    storageKey = 'clarity-prompt-library',
    persist = false,
    currentUser = { id: 'system', name: 'System' },
    onChange,
  } = options

  // Initialize state
  const [state, setState] = React.useState<PromptLibraryState>(() => {
    // Try to load from storage
    if (persist && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const parsed = JSON.parse(stored)
          return {
            ...parsed,
            isLoading: false,
            error: undefined,
          }
        }
      } catch {
        // Ignore storage errors
      }
    }

    return {
      templates: initialTemplates,
      versions: {},
      deployments: {
        development: [],
        staging: [],
        production: [],
      },
      abTests: [],
      analytics: {},
      history: [],
      isLoading: false,
      error: undefined,
    }
  })

  // Persist to storage
  React.useEffect(() => {
    if (persist && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state))
      } catch {
        // Ignore storage errors
      }
    }
    onChange?.(state)
  }, [state, persist, storageKey, onChange])

  // Add history entry
  const addHistoryEntry = React.useCallback(
    (
      entry: Omit<PromptChangeHistoryEntry, 'id' | 'changedAt' | 'changedBy'>
    ) => {
      setState((prev) => ({
        ...prev,
        history: [
          ...prev.history,
          {
            ...entry,
            id: generateId(),
            changedAt: Date.now(),
            changedBy: currentUser,
          },
        ],
      }))
    },
    [currentUser]
  )

  // Template operations
  const templateOps = React.useMemo(
    () => ({
      getAll: () => state.templates,
      get: (id: string) => state.templates.find((t) => t.id === id),
      getByName: (name: string) =>
        state.templates.find((t) => t.name === name),
      search: (query: string) => {
        const lowerQuery = query.toLowerCase()
        return state.templates.filter(
          (t) =>
            t.name.toLowerCase().includes(lowerQuery) ||
            t.description?.toLowerCase().includes(lowerQuery) ||
            t.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        )
      },
      getByTag: (tag: string) =>
        state.templates.filter((t) => t.tags?.includes(tag)),
      add: (
        template: Omit<PromptTemplate, 'id'> & { id?: string }
      ): PromptTemplate => {
        const newTemplate: PromptTemplate = {
          ...template,
          id: template.id || generateId(),
        }
        setState((prev) => ({
          ...prev,
          templates: [...prev.templates, newTemplate],
        }))
        addHistoryEntry({
          templateId: newTemplate.id,
          changeType: 'created',
          description: `Created template "${newTemplate.name}"`,
        })
        return newTemplate
      },
      update: (id: string, updates: Partial<PromptTemplate>) => {
        setState((prev) => {
          const template = prev.templates.find((t) => t.id === id)
          if (!template) return prev

          return {
            ...prev,
            templates: prev.templates.map((t) =>
              t.id === id ? { ...t, ...updates } : t
            ),
          }
        })
        addHistoryEntry({
          templateId: id,
          changeType: 'updated',
          description: `Updated template`,
        })
      },
      remove: (id: string) => {
        const template = state.templates.find((t) => t.id === id)
        if (!template) return

        setState((prev) => ({
          ...prev,
          templates: prev.templates.filter((t) => t.id !== id),
          versions: Object.fromEntries(
            Object.entries(prev.versions).filter(([key]) => key !== id)
          ),
        }))
        addHistoryEntry({
          templateId: id,
          changeType: 'deleted',
          description: `Deleted template "${template.name}"`,
        })
      },
      duplicate: (id: string, newName?: string): PromptTemplate | undefined => {
        const template = state.templates.find((t) => t.id === id)
        if (!template) return undefined

        const duplicated: PromptTemplate = {
          ...template,
          id: generateId(),
          name: newName || `${template.name} (Copy)`,
        }
        setState((prev) => ({
          ...prev,
          templates: [...prev.templates, duplicated],
        }))
        addHistoryEntry({
          templateId: duplicated.id,
          changeType: 'created',
          description: `Duplicated from "${template.name}"`,
        })
        return duplicated
      },
    }),
    [state.templates, addHistoryEntry]
  )

  // Version operations
  const versionOps = React.useMemo(
    () => ({
      getAll: (templateId: string) => state.versions[templateId] || [],
      get: (templateId: string, versionId: string) =>
        state.versions[templateId]?.find((v) => v.id === versionId),
      getActive: (templateId: string) => {
        const versions = state.versions[templateId] || []
        return (
          versions.find((v) => v.isActive) || versions[versions.length - 1]
        )
      },
      create: (
        templateId: string,
        template: string,
        notes?: string
      ): PromptVersion => {
        const existingVersions = state.versions[templateId] || []
        const newVersion: PromptVersion = {
          id: generateId(),
          templateId,
          version: generateVersion(existingVersions),
          template,
          createdAt: Date.now(),
          notes,
          isActive: true,
        }

        setState((prev) => {
          const versions = prev.versions[templateId] || []
          return {
            ...prev,
            versions: {
              ...prev.versions,
              [templateId]: [
                ...versions.map((v) => ({ ...v, isActive: false })),
                newVersion,
              ],
            },
          }
        })

        addHistoryEntry({
          templateId,
          changeType: 'version-created',
          description: `Created version ${newVersion.version}`,
          versionId: newVersion.id,
          newValue: template,
        })

        return newVersion
      },
      setActive: (templateId: string, versionId: string) => {
        setState((prev) => ({
          ...prev,
          versions: {
            ...prev.versions,
            [templateId]: (prev.versions[templateId] || []).map((v) => ({
              ...v,
              isActive: v.id === versionId,
            })),
          },
        }))
      },
      compare: (
        templateId: string,
        versionId1: string,
        versionId2: string
      ) => {
        const versions = state.versions[templateId] || []
        const version1 = versions.find((v) => v.id === versionId1)
        const version2 = versions.find((v) => v.id === versionId2)
        if (!version1 || !version2) return undefined

        return {
          version1,
          version2,
          diff: computeDiff(version1.template, version2.template),
        }
      },
      rollback: (templateId: string, versionId: string) => {
        const version = state.versions[templateId]?.find(
          (v) => v.id === versionId
        )
        if (!version) return

        // Create a new version from the rollback target
        versionOps.create(
          templateId,
          version.template,
          `Rolled back to version ${version.version}`
        )
      },
    }),
    [state.versions, addHistoryEntry]
  )

  // Deployment operations
  const deploymentOps = React.useMemo(
    () => ({
      getByEnvironment: (env: PromptEnvironment) =>
        state.deployments[env] || [],
      getActive: (templateId: string, env: PromptEnvironment) =>
        state.deployments[env]?.find(
          (d) => d.templateId === templateId && d.status === 'active'
        ),
      deploy: (
        templateId: string,
        versionId: string,
        env: PromptEnvironment,
        trafficPercentage = 100
      ): PromptDeployment => {
        // Find previous active deployment for rollback target
        const previousActive = state.deployments[env]?.find(
          (d) => d.templateId === templateId && d.status === 'active'
        )

        const deployment: PromptDeployment = {
          id: generateId(),
          templateId,
          versionId,
          environment: env,
          status: 'active',
          deployedAt: Date.now(),
          deployedBy: currentUser.id,
          rollbackTarget: previousActive?.versionId,
          trafficPercentage,
        }

        setState((prev) => ({
          ...prev,
          deployments: {
            ...prev.deployments,
            [env]: [
              ...(prev.deployments[env] || []).map((d) =>
                d.templateId === templateId && d.status === 'active'
                  ? { ...d, status: 'archived' as const }
                  : d
              ),
              deployment,
            ],
          },
        }))

        addHistoryEntry({
          templateId,
          changeType: 'deployed',
          description: `Deployed to ${env}`,
          versionId,
          environment: env,
        })

        return deployment
      },
      rollback: (deploymentId: string) => {
        setState((prev) => {
          const envs: PromptEnvironment[] = [
            'development',
            'staging',
            'production',
          ]
          let updatedDeployments = { ...prev.deployments }
          let targetDeployment: PromptDeployment | undefined

          for (const env of envs) {
            const deployment = prev.deployments[env]?.find(
              (d) => d.id === deploymentId
            )
            if (deployment) {
              targetDeployment = deployment
              updatedDeployments = {
                ...updatedDeployments,
                [env]: prev.deployments[env]?.map((d) =>
                  d.id === deploymentId
                    ? { ...d, status: 'rolled-back' as const }
                    : d
                ) || [],
              }
              break
            }
          }

          if (targetDeployment) {
            addHistoryEntry({
              templateId: targetDeployment.templateId,
              changeType: 'rolled-back',
              description: `Rolled back deployment in ${targetDeployment.environment}`,
              versionId: targetDeployment.versionId,
              environment: targetDeployment.environment,
            })
          }

          return { ...prev, deployments: updatedDeployments }
        })
      },
      updateTraffic: (deploymentId: string, percentage: number) => {
        setState((prev) => {
          const envs: PromptEnvironment[] = [
            'development',
            'staging',
            'production',
          ]
          let updatedDeployments = { ...prev.deployments }

          for (const env of envs) {
            const idx = prev.deployments[env]?.findIndex(
              (d) => d.id === deploymentId
            )
            if (idx !== undefined && idx >= 0 && prev.deployments[env]) {
              updatedDeployments = {
                ...updatedDeployments,
                [env]: prev.deployments[env]?.map((d, i) =>
                  i === idx
                    ? { ...d, trafficPercentage: Math.min(100, Math.max(0, percentage)) }
                    : d
                ) || [],
              }
              break
            }
          }

          return { ...prev, deployments: updatedDeployments }
        })
      },
    }),
    [state.deployments, currentUser.id, addHistoryEntry]
  )

  // History operations
  const historyOps = React.useMemo(
    () => ({
      getAll: () => state.history,
      getForTemplate: (templateId: string) =>
        state.history.filter((h) => h.templateId === templateId),
      clear: () => {
        setState((prev) => ({ ...prev, history: [] }))
      },
    }),
    [state.history]
  )

  // Export/Import
  const exportLibrary = React.useCallback(() => {
    return JSON.stringify(
      {
        templates: state.templates,
        versions: state.versions,
        deployments: state.deployments,
        history: state.history,
        exportedAt: Date.now(),
      },
      null,
      2
    )
  }, [state])

  const importLibrary = React.useCallback((json: string): boolean => {
    try {
      const data = JSON.parse(json)
      if (!data.templates || !Array.isArray(data.templates)) {
        return false
      }

      setState((prev) => ({
        ...prev,
        templates: data.templates || prev.templates,
        versions: data.versions || prev.versions,
        deployments: data.deployments || prev.deployments,
        history: data.history || prev.history,
      }))

      addHistoryEntry({
        templateId: 'library',
        changeType: 'updated',
        description: 'Imported library from file',
      })

      return true
    } catch {
      return false
    }
  }, [addHistoryEntry])

  // Reset
  const reset = React.useCallback(() => {
    setState({
      templates: initialTemplates,
      versions: {},
      deployments: {
        development: [],
        staging: [],
        production: [],
      },
      abTests: [],
      analytics: {},
      history: [],
      isLoading: false,
      error: undefined,
    })
  }, [initialTemplates])

  return {
    state,
    templates: templateOps,
    versions: versionOps,
    deployments: deploymentOps,
    history: historyOps,
    export: exportLibrary,
    import: importLibrary,
    reset,
  }
}

export default usePromptLibrary
