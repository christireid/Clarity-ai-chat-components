'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Badge,
  Textarea,
  cn,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@clarity-chat/primitives'
import type { PromptTemplate, PromptVariable } from '../../prompts/types'
import { getMotionSafePreset, useReducedMotion } from '../../animations'
import {
  usePromptPlayground,
  MODEL_PRICING,
  type UsePromptPlaygroundOptions,
} from '../../prompts/hooks/use-prompt-playground'

/**
 * Props for PromptPlayground component
 */
export interface PromptPlaygroundProps extends UsePromptPlaygroundOptions {
  /** Template to load */
  template?: PromptTemplate
  /** Available templates to select from */
  templates?: PromptTemplate[]
  /** On template change callback */
  onTemplateChange?: (template: string) => void
  /** On save callback */
  onSave?: (template: PromptTemplate) => void
  /** Show model selector */
  showModelSelector?: boolean
  /** Show cost estimation */
  showCostEstimate?: boolean
  /** Show token count */
  showTokenCount?: boolean
  /** Show validation */
  showValidation?: boolean
  /** Read-only mode */
  readOnly?: boolean
  /** Height of the component */
  height?: string | number
  /** Custom class name */
  className?: string
}

/**
 * PromptPlayground Component
 *
 * Interactive playground for testing and experimenting with prompt templates.
 * Provides real-time rendering, token counting, cost estimation, and variable editing.
 *
 * Features:
 * - Live template editing with syntax highlighting hints
 * - Variable extraction and inline editing
 * - Real-time rendering preview
 * - Token count and cost estimation
 * - Multiple model support
 * - Template validation
 *
 * @example
 * ```tsx
 * <PromptPlayground
 *   template={myTemplate}
 *   model="gpt-4o"
 *   showCostEstimate
 *   onSave={(template) => saveTemplate(template)}
 * />
 * ```
 */
export function PromptPlayground({
  template,
  templates = [],
  onTemplateChange,
  onSave,
  showModelSelector = true,
  showCostEstimate = true,
  showTokenCount = true,
  showValidation = true,
  readOnly = false,
  height = 600,
  className,
  ...options
}: PromptPlaygroundProps) {
  const {
    state,
    setTemplate,
    setVariable,
    extractVariables,
    render,
    validate,
    loadTemplate,
    getEstimatedCost,
    pricing,
    setModel,
  } = usePromptPlayground({
    initialTemplate: template?.template || '',
    initialVariables: template?.variables?.reduce(
      (acc, v) => ({ ...acc, [v.name]: v.default ?? '' }),
      {}
    ),
    autoRender: true,
    ...options,
  })

  const [activeTab, setActiveTab] = React.useState<string>('editor')
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>(
    template?.id || ''
  )
  const [promptName, setPromptName] = React.useState(template?.name || '')
  const [promptDescription, setPromptDescription] = React.useState(
    template?.description || ''
  )
  const prefersReducedMotion = useReducedMotion()

  // Extract variables from template
  const detectedVariables = React.useMemo(
    () => extractVariables(),
    [extractVariables]
  )

  // Validation state
  const validation = React.useMemo(() => {
    if (!showValidation) return { valid: true }
    return validate()
  }, [validate, showValidation])

  // Cost estimation
  const cost = React.useMemo(() => getEstimatedCost(500), [getEstimatedCost])

  // Handle template text change
  const handleTemplateChange = React.useCallback(
    (value: string) => {
      setTemplate(value)
      onTemplateChange?.(value)
    },
    [setTemplate, onTemplateChange]
  )

  // Handle template selection
  const handleSelectTemplate = React.useCallback(
    (id: string) => {
      const selected = templates.find((t) => t.id === id)
      if (selected) {
        setSelectedTemplateId(id)
        setPromptName(selected.name)
        setPromptDescription(selected.description || '')
        loadTemplate(selected)
      }
    },
    [templates, loadTemplate]
  )

  // Handle save
  const handleSave = React.useCallback(() => {
    if (!promptName.trim()) return

    const templateToSave: PromptTemplate = {
      id: selectedTemplateId || `template-${Date.now()}`,
      name: promptName,
      description: promptDescription,
      template: state.template,
      variables: detectedVariables.map((name) => ({
        name,
        type: 'string' as const,
        required: false,
      })),
    }

    onSave?.(templateToSave)
  }, [
    promptName,
    promptDescription,
    state.template,
    detectedVariables,
    selectedTemplateId,
    onSave,
  ])

  return (
    <Card
      className={cn('flex flex-col overflow-hidden', className)}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              Prompt Playground
              {!validation.valid && showValidation && (
                <Badge variant="destructive" className="text-xs">
                  Invalid
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Test and iterate on your prompts with live preview
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {showTokenCount && (
              <Badge variant="outline" className="font-mono text-xs">
                {state.tokenCount} tokens
              </Badge>
            )}
            {showCostEstimate && (
              <Badge variant="secondary" className="font-mono text-xs">
                ~${cost.total.toFixed(4)}
              </Badge>
            )}
          </div>
        </div>

        {/* Model Selector & Template Selector */}
        <div className="flex items-center gap-3 mt-3">
          {showModelSelector && (
            <div className="flex items-center gap-2">
              <label htmlFor="playground-model-select" className="sr-only">
                Select AI model
              </label>
              <select
                id="playground-model-select"
                value={pricing.id}
                onChange={(e) => setModel(e.target.value)}
                className="text-sm border rounded px-2 py-1 bg-background"
                disabled={readOnly}
                aria-label="Select AI model for cost estimation"
              >
                {Object.values(MODEL_PRICING).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {templates.length > 0 && (
            <div className="flex-1 flex items-center gap-2">
              <label htmlFor="playground-template-select" className="sr-only">
                Select template
              </label>
              <select
                id="playground-template-select"
                value={selectedTemplateId}
                onChange={(e) => handleSelectTemplate(e.target.value)}
                className="flex-1 text-sm border rounded px-2 py-1 bg-background"
                disabled={readOnly}
                aria-label="Select a prompt template"
              >
                <option value="">Select a template...</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="mx-4">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="variables">
              Variables ({detectedVariables.length})
            </TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            {/* Editor Tab */}
            <TabsContent value="editor" className="h-full p-4 mt-0">
              <div className="h-full flex flex-col gap-3">
                {/* Name & Description */}
                {onSave && (
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label
                        htmlFor="playground-prompt-name"
                        className="sr-only"
                      >
                        Prompt name
                      </label>
                      <Input
                        id="playground-prompt-name"
                        placeholder="Prompt name"
                        value={promptName}
                        onChange={(e) => setPromptName(e.target.value)}
                        className="w-full"
                        disabled={readOnly}
                        aria-label="Prompt name"
                        aria-required="true"
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="playground-prompt-description"
                        className="sr-only"
                      >
                        Description
                      </label>
                      <Input
                        id="playground-prompt-description"
                        placeholder="Description (optional)"
                        value={promptDescription}
                        onChange={(e) => setPromptDescription(e.target.value)}
                        className="w-full"
                        disabled={readOnly}
                        aria-label="Prompt description (optional)"
                      />
                    </div>
                  </div>
                )}

                {/* Template Editor */}
                <div className="flex-1 relative">
                  <label
                    htmlFor="playground-template-editor"
                    className="sr-only"
                  >
                    Prompt template editor
                  </label>
                  <Textarea
                    id="playground-template-editor"
                    value={state.template}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    placeholder="Enter your prompt template here...&#10;&#10;Use {{variable}} syntax for variables."
                    className={cn(
                      'h-full resize-none font-mono text-sm',
                      'leading-relaxed',
                      !validation.valid && 'border-destructive'
                    )}
                    disabled={readOnly}
                    aria-label="Prompt template editor"
                    aria-describedby={
                      !validation.valid
                        ? 'playground-validation-errors'
                        : undefined
                    }
                    aria-invalid={!validation.valid}
                  />
                  {state.isRendering && (
                    <div className="absolute top-2 right-2" aria-live="polite">
                      <Badge variant="secondary" className="animate-pulse">
                        Rendering...
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Validation Errors */}
                {!validation.valid && validation.errors && (
                  <div
                    id="playground-validation-errors"
                    role="alert"
                    aria-live="polite"
                    className="text-sm text-destructive space-y-1"
                  >
                    <span className="sr-only">Validation errors:</span>
                    {validation.errors.map((error, i) => (
                      <p key={i}>• {error}</p>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {onSave && (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => render()}
                    >
                      Render
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={!promptName.trim() || readOnly}
                    >
                      Save Template
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Variables Tab */}
            <TabsContent
              value="variables"
              className="h-full p-4 mt-0 overflow-auto"
            >
              <div
                className="space-y-4"
                role="group"
                aria-label="Template variables"
              >
                {detectedVariables.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2" aria-hidden="true">
                      {'{ }'}
                    </div>
                    <p className="text-sm">No variables detected</p>
                    <p className="text-xs mt-1">
                      Use {'{{variable}}'} syntax in your template
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {detectedVariables.map((varName, index) => {
                      const variants = getMotionSafePreset(
                        prefersReducedMotion,
                        'slideDown'
                      )
                      return (
                        <motion.div
                          key={varName}
                          {...variants}
                          transition={
                            prefersReducedMotion
                              ? { duration: 0 }
                              : { delay: index * 0.05 }
                          }
                          className="space-y-1"
                        >
                          <label
                            htmlFor={`playground-var-${varName}`}
                            className="text-sm font-medium flex items-center gap-2"
                          >
                            <code
                              className="px-1.5 py-0.5 bg-muted rounded text-xs"
                              aria-hidden="true"
                            >
                              {`{{${varName}}}`}
                            </code>
                            <span className="sr-only">Variable {varName}</span>
                          </label>
                          <Input
                            id={`playground-var-${varName}`}
                            value={
                              (state.variables[varName] as
                                | string
                                | undefined) || ''
                            }
                            onChange={(e) =>
                              setVariable(varName, e.target.value)
                            }
                            placeholder={`Enter value for ${varName}`}
                            disabled={readOnly}
                            aria-label={`Value for variable ${varName}`}
                          />
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                )}
              </div>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent
              value="preview"
              className="h-full p-4 mt-0 overflow-auto"
            >
              <div className="space-y-4">
                {/* Cost Breakdown */}
                {showCostEstimate && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    <Card>
                      <CardContent className="p-3 text-center">
                        <p className="text-xs text-muted-foreground">Input</p>
                        <p className="text-lg font-semibold font-mono">
                          ${cost.input.toFixed(5)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 text-center">
                        <p className="text-xs text-muted-foreground">
                          Output (est.)
                        </p>
                        <p className="text-lg font-semibold font-mono">
                          ${cost.output.toFixed(5)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 text-center">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-lg font-semibold font-mono text-primary">
                          ${cost.total.toFixed(5)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Rendered Output */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4
                      id="playground-output-label"
                      className="text-sm font-medium"
                    >
                      Rendered Output
                    </h4>
                    <Badge variant="outline" className="font-mono text-xs">
                      <span className="sr-only">Token count:</span>
                      {state.tokenCount} tokens
                    </Badge>
                  </div>
                  <div
                    role="region"
                    aria-labelledby="playground-output-label"
                    aria-live="polite"
                    className={cn(
                      'p-4 rounded-lg border bg-muted/30',
                      'font-mono text-sm whitespace-pre-wrap',
                      'min-h-[200px] max-h-[400px] overflow-auto'
                    )}
                  >
                    {state.output || (
                      <span className="text-muted-foreground italic">
                        No output yet. Edit template and variables to see
                        preview.
                      </span>
                    )}
                  </div>
                </div>

                {/* Errors */}
                {state.errors.length > 0 && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                  >
                    <h4 className="text-sm font-medium text-destructive mb-2">
                      Errors
                    </h4>
                    <ul
                      className="text-sm text-destructive space-y-1"
                      aria-label="Render errors"
                    >
                      {state.errors.map((error, i) => (
                        <li key={i}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

PromptPlayground.displayName = 'PromptPlayground'
