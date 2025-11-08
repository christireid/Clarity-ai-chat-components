import * as React from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  cn,
} from '@clarity-chat/primitives'

export interface WorkflowSuggestion {
  id: string
  name: string
  description: string
  steps: string[]
  estimatedTime?: string
  audience?: string
  tags?: string[]
}

export interface WorkflowSuggestionListProps {
  workflows: WorkflowSuggestion[]
  onSelect?: (workflow: WorkflowSuggestion) => void
  onPreview?: (workflow: WorkflowSuggestion) => void
  className?: string
  title?: string
  subtitle?: string
}

const defaultTitle = 'Workflow accelerators'
const defaultSubtitle = 'Present curated workflows that help users accomplish routine tasks with minimal prompting.'

export const WorkflowSuggestionList = React.memo(function WorkflowSuggestionList({
  workflows,
  onSelect,
  onPreview,
  className,
  title = defaultTitle,
  subtitle = defaultSubtitle,
}: WorkflowSuggestionListProps) {
  return (
    <Card className={cn('border-border/60 bg-[hsl(var(--surface-elevated))] shadow-[0_24px_48px_rgba(15,23,42,0.32)]', className)}>
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground/80">{subtitle}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {workflows.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/50 bg-[hsl(var(--surface-muted))] p-6 text-center text-sm text-muted-foreground">
            No workflows available. Define templated flows to guide users through complex tasks.
          </div>
        )}

        <ul className="space-y-4">
          {workflows.map((workflow) => (
            <li
              key={workflow.id}
              className="space-y-3 rounded-2xl border border-border/60 bg-[hsl(var(--surface-muted))] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.12)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{workflow.name}</span>
                    {workflow.audience && (
                      <Badge variant="outline" className="text-[11px]">
                        {workflow.audience}
                      </Badge>
                    )}
                    {workflow.estimatedTime && (
                      <Badge variant="subtle" className="text-[11px]">
                        {workflow.estimatedTime}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground/85">{workflow.description}</p>
                  {workflow.tags && workflow.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {workflow.tags.map((tag) => (
                        <Badge key={tag} variant="subtle" className="text-[11px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {onPreview && (
                    <Button variant="ghost" size="sm" onClick={() => onPreview(workflow)}>
                      Preview
                    </Button>
                  )}
                  {onSelect && (
                    <Button
                      variant="surface"
                      size="sm"
                      onClick={() => onSelect(workflow)}
                    >
                      Start workflow
                    </Button>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-border/40 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
                  Steps
                </p>
                <ol className="mt-2 space-y-2 text-sm text-muted-foreground/85">
                  {workflow.steps.map((step, index) => (
                    <li key={`${workflow.id}-step-${index}`} className="flex gap-3">
                      <span className="mt-0.5 text-primary">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
})

WorkflowSuggestionList.displayName = 'WorkflowSuggestionList'

