'use client'

import * as React from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Badge,
  Checkbox,
  cn,
} from '@clarity-chat/primitives'
import type { PromptVariable } from '../../prompts/types'

/**
 * Extended variable type with editing metadata
 */
interface EditableVariable extends PromptVariable {
  /** Unique key for React list rendering */
  _key: string
}

/**
 * Props for PromptVariablesEditor component
 */
export interface PromptVariablesEditorProps {
  /** Current variables */
  variables: PromptVariable[]
  /** Callback when variables change */
  onChange: (variables: PromptVariable[]) => void
  /** Template string for auto-detection */
  template?: string
  /** Auto-detect variables from template */
  autoDetect?: boolean
  /** Allow reordering variables */
  allowReorder?: boolean
  /** Allow adding new variables */
  allowAdd?: boolean
  /** Allow removing variables */
  allowRemove?: boolean
  /** Show variable type selector */
  showTypes?: boolean
  /** Show validation input */
  showValidation?: boolean
  /** Read-only mode */
  readOnly?: boolean
  /** Custom class name */
  className?: string
}

/**
 * Available variable types
 */
const VARIABLE_TYPES: { value: PromptVariable['type']; label: string }[] = [
  { value: 'string', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'array', label: 'Array' },
  { value: 'object', label: 'Object' },
]

/**
 * Extract variables from template
 */
function extractVariablesFromTemplate(template: string): string[] {
  const pattern = /\{\{\s*([\w.]+)\s*\}\}/g
  const variables = new Set<string>()
  let match: RegExpExecArray | null

  while ((match = pattern.exec(template)) !== null) {
    if (match[1]) {
      variables.add(match[1])
    }
  }

  return Array.from(variables)
}

/**
 * Generate unique key
 */
function generateKey(): string {
  return `var-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * PromptVariablesEditor Component
 *
 * Edit and manage prompt template variables with drag-and-drop reordering,
 * type selection, validation, and auto-detection from templates.
 *
 * Features:
 * - Add, edit, remove variables
 * - Drag-and-drop reordering
 * - Auto-detect variables from template
 * - Type selection (string, number, boolean, array, object)
 * - Required/optional toggle
 * - Default value editing
 * - Description field
 *
 * @example
 * ```tsx
 * const [variables, setVariables] = useState<PromptVariable[]>([])
 *
 * <PromptVariablesEditor
 *   variables={variables}
 *   onChange={setVariables}
 *   template="Hello {{name}}, you are {{age}} years old."
 *   autoDetect
 *   allowReorder
 * />
 * ```
 */
export function PromptVariablesEditor({
  variables,
  onChange,
  template,
  autoDetect = true,
  allowReorder = true,
  allowAdd = true,
  allowRemove = true,
  showTypes = true,
  showValidation: _showValidation = false,
  readOnly = false,
  className,
}: PromptVariablesEditorProps) {
  // Convert variables to editable format with keys
  const [editableVariables, setEditableVariables] = React.useState<
    EditableVariable[]
  >(() =>
    variables.map((v) => ({
      ...v,
      _key: generateKey(),
    }))
  )

  // Track detected variables
  const detectedVarNames = React.useMemo(() => {
    if (!template || !autoDetect) return []
    return extractVariablesFromTemplate(template)
  }, [template, autoDetect])

  // Sync with external variables prop
  React.useEffect(() => {
    setEditableVariables((prevEditableVars) => {
      return variables.map((v) => {
        const existing = prevEditableVars.find((ev) => ev.name === v.name)
        return {
          ...v,
          _key: existing?._key || generateKey(),
        }
      })
    })
  }, [variables])

  // Auto-detect and add missing variables
  React.useEffect(() => {
    if (!autoDetect || !template) return

    setEditableVariables((prevVars) => {
      const existingNames = new Set(prevVars.map((v) => v.name))
      const newVars: EditableVariable[] = []

      detectedVarNames.forEach((name) => {
        if (!existingNames.has(name)) {
          newVars.push({
            name,
            type: 'string',
            required: false,
            _key: generateKey(),
          })
        }
      })

      if (newVars.length > 0) {
        const updated = [...prevVars, ...newVars]
        // Use setTimeout to avoid state update during render
        setTimeout(() => emitChange(updated), 0)
        return updated
      }
      return prevVars
    })
  }, [detectedVarNames, autoDetect, template, emitChange])

  // Emit change to parent
  const emitChange = React.useCallback(
    (vars: EditableVariable[]) => {
      // Strip internal _key before emitting
      const cleaned = vars.map(({ _key, ...rest }) => rest)
      onChange(cleaned)
    },
    [onChange]
  )

  // Update variable
  const updateVariable = React.useCallback(
    (key: string, updates: Partial<PromptVariable>) => {
      const updated = editableVariables.map((v) =>
        v._key === key ? { ...v, ...updates } : v
      )
      setEditableVariables(updated)
      emitChange(updated)
    },
    [editableVariables, emitChange]
  )

  // Add new variable
  const addVariable = React.useCallback(() => {
    const newVar: EditableVariable = {
      name: `variable${editableVariables.length + 1}`,
      type: 'string',
      required: false,
      _key: generateKey(),
    }
    const updated = [...editableVariables, newVar]
    setEditableVariables(updated)
    emitChange(updated)
  }, [editableVariables, emitChange])

  // Remove variable
  const removeVariable = React.useCallback(
    (key: string) => {
      const updated = editableVariables.filter((v) => v._key !== key)
      setEditableVariables(updated)
      emitChange(updated)
    },
    [editableVariables, emitChange]
  )

  // Handle reorder
  const handleReorder = React.useCallback(
    (newOrder: EditableVariable[]) => {
      setEditableVariables(newOrder)
      emitChange(newOrder)
    },
    [emitChange]
  )

  // Check if variable is detected in template
  const isDetected = React.useCallback(
    (name: string) => detectedVarNames.includes(name),
    [detectedVarNames]
  )

  // Find untracked variables
  const untrackedVariables = React.useMemo(() => {
    const trackedNames = new Set(editableVariables.map((v) => v.name))
    return detectedVarNames.filter((name) => !trackedNames.has(name))
  }, [editableVariables, detectedVarNames])

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Variables
              <Badge variant="secondary">{editableVariables.length}</Badge>
            </CardTitle>
            <CardDescription>
              Define variables for your prompt template
            </CardDescription>
          </div>
          {allowAdd && !readOnly && (
            <Button size="sm" onClick={addVariable}>
              + Add Variable
            </Button>
          )}
        </div>

        {/* Untracked Variables Warning */}
        {untrackedVariables.length > 0 && (
          <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              <strong>Detected in template:</strong>{' '}
              {untrackedVariables.map((name) => `{{${name}}}`).join(', ')}
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {editableVariables.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-5xl mb-3">📝</div>
            <p className="text-sm font-medium">No variables defined</p>
            <p className="text-xs mt-1">
              {autoDetect
                ? 'Variables will be auto-detected from your template'
                : 'Add variables to use in your template'}
            </p>
            {allowAdd && !readOnly && (
              <Button
                variant="outline"
                size="sm"
                onClick={addVariable}
                className="mt-4"
              >
                Add First Variable
              </Button>
            )}
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={editableVariables}
            onReorder={handleReorder}
            className="space-y-3"
          >
            <AnimatePresence>
              {editableVariables.map((variable) => (
                <Reorder.Item
                  key={variable._key}
                  value={variable}
                  disabled={!allowReorder || readOnly}
                  className="list-none"
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      'p-4 border rounded-lg',
                      'bg-card hover:bg-accent/5',
                      'transition-colors duration-150',
                      allowReorder && !readOnly && 'cursor-grab active:cursor-grabbing'
                    )}
                  >
                    {/* Variable Header */}
                    <div className="flex items-center gap-3 mb-3">
                      {allowReorder && !readOnly && (
                        <div className="text-muted-foreground cursor-grab">
                          ⋮⋮
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          id={`name-${variable._key}`}
                          value={variable.name}
                          onChange={(e) =>
                            updateVariable(variable._key, {
                              name: e.target.value.replace(/\s/g, '_'),
                            })
                          }
                          placeholder="Variable name"
                          className="font-mono text-sm"
                          disabled={readOnly}
                          aria-label="Variable name"
                        />
                      </div>
                      {isDetected(variable.name) && (
                        <Badge variant="outline" className="text-xs">
                          In template
                        </Badge>
                      )}
                      {allowRemove && !readOnly && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariable(variable._key)}
                          className="text-destructive hover:text-destructive"
                          aria-label={`Remove variable ${variable.name}`}
                        >
                          ✕
                        </Button>
                      )}
                    </div>

                    {/* Variable Settings */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Type */}
                      {showTypes && (
                        <div className="space-y-1">
                          <label
                            htmlFor={`type-${variable._key}`}
                            className="text-xs text-muted-foreground"
                          >
                            Type
                          </label>
                          <select
                            id={`type-${variable._key}`}
                            value={variable.type || 'string'}
                            onChange={(e) =>
                              updateVariable(variable._key, {
                                type: e.target.value as PromptVariable['type'],
                              })
                            }
                            className="w-full text-sm border rounded px-2 py-1.5 bg-background"
                            disabled={readOnly}
                            aria-label={`Type for ${variable.name}`}
                          >
                            {VARIABLE_TYPES.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Default Value */}
                      <div className="space-y-1">
                        <label
                          htmlFor={`default-${variable._key}`}
                          className="text-xs text-muted-foreground"
                        >
                          Default Value
                        </label>
                        <Input
                          id={`default-${variable._key}`}
                          value={
                            variable.default !== undefined
                              ? String(variable.default)
                              : ''
                          }
                          onChange={(e) =>
                            updateVariable(variable._key, {
                              default: e.target.value || undefined,
                            })
                          }
                          placeholder="Optional default"
                          className="text-sm"
                          disabled={readOnly}
                          aria-label={`Default value for ${variable.name}`}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-3 space-y-1">
                      <label
                        htmlFor={`desc-${variable._key}`}
                        className="text-xs text-muted-foreground"
                      >
                        Description
                      </label>
                      <Input
                        id={`desc-${variable._key}`}
                        value={variable.description || ''}
                        onChange={(e) =>
                          updateVariable(variable._key, {
                            description: e.target.value || undefined,
                          })
                        }
                        placeholder="Describe what this variable is for"
                        className="text-sm"
                        disabled={readOnly}
                        aria-label={`Description for ${variable.name}`}
                      />
                    </div>

                    {/* Required Toggle */}
                    <div className="mt-3 flex items-center gap-2">
                      <Checkbox
                        id={`required-${variable._key}`}
                        checked={variable.required || false}
                        onCheckedChange={(checked) =>
                          updateVariable(variable._key, {
                            required: checked === true,
                          })
                        }
                        disabled={readOnly}
                      />
                      <label
                        htmlFor={`required-${variable._key}`}
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        Required
                      </label>
                    </div>
                  </motion.div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </CardContent>
    </Card>
  )
}

PromptVariablesEditor.displayName = 'PromptVariablesEditor'
