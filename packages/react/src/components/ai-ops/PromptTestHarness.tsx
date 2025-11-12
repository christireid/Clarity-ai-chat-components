import * as React from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  cn,
} from '@clarity-chat/primitives'
import { SkeletonText } from '../skeleton'

export type PromptTestStatus = 'pending' | 'running' | 'pass' | 'fail'

export interface PromptVariantItem {
  id: string
  label: string
}

export interface PromptTestCase {
  id: string
  input: string
  status: PromptTestStatus
  output?: string
  expected?: string
  latencyMs?: number
  costUsd?: number
}

export interface PromptTestHarnessProps {
  datasetName?: string
  datasets?: Array<{ id: string; name: string }>
  variants: PromptVariantItem[]
  tests: PromptTestCase[]
  onRunAll?: () => void
  onRunVariant?: (variantId: string) => void
  onSelectDataset?: (datasetId: string) => void
  isRunning?: boolean
  className?: string
}

const statusVariant: Record<PromptTestStatus, { label: string; variant: 'info' | 'success' | 'warning' | 'destructive' }> = {
  pending: { label: 'Pending', variant: 'info' },
  running: { label: 'Running', variant: 'info' },
  pass: { label: 'Pass', variant: 'success' },
  fail: { label: 'Fail', variant: 'destructive' },
}

export const PromptTestHarness: React.FC<PromptTestHarnessProps> = ({
  datasetName,
  datasets = [],
  variants,
  tests,
  onRunAll,
  onRunVariant,
  onSelectDataset,
  isRunning = false,
  className,
}) => {
  const [selectedVariant, setSelectedVariant] = React.useState<string | undefined>(() => variants[0]?.id)
  const [selectedDataset, setSelectedDataset] = React.useState<string | undefined>(() => datasets[0]?.id)

  React.useEffect(() => {
    if (datasets.length > 0 && !selectedDataset) {
      setSelectedDataset(datasets[0].id)
    }
  }, [datasets, selectedDataset])

  const handleDatasetChange = (value: string) => {
    setSelectedDataset(value)
    onSelectDataset?.(value)
  }

  const handleVariantChange = (value: string) => {
    setSelectedVariant(value)
    onRunVariant?.(value)
  }

  return (
    <Card className={cn('border-border/60 bg-[hsl(var(--surface-elevated))] shadow-sm', className)}>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <CardTitle className="text-lg font-semibold text-foreground">Prompt regression harness</CardTitle>
          <CardDescription className="text-sm text-muted-foreground/80">
            Compare prompt variants across curated datasets before shipping changes.
          </CardDescription>
          {datasetName && (
            <Badge variant="outline" className="text-[11px]">
              Dataset • {datasetName}
            </Badge>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          {datasets.length > 0 && (
            <select
              value={selectedDataset ?? ''}
              onChange={(event) => handleDatasetChange(event.target.value)}
              className="min-w-[200px] rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              {datasets.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.name}
                </option>
              ))}
            </select>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="surface"
              size="sm"
              onClick={onRunAll}
              disabled={isRunning}
            >
              Run all variants
            </Button>
            <select
              value={selectedVariant ?? ''}
              onChange={(event) => handleVariantChange(event.target.value)}
              className="min-w-[200px] rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              {variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <table className="min-w-[720px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground/70">
            <tr>
              <th className="w-[24px] py-2">#</th>
              <th className="py-2">Input</th>
              <th className="py-2">Status</th>
              <th className="py-2">Output</th>
              <th className="py-2">Expected</th>
              <th className="py-2">Latency</th>
              <th className="py-2">Cost</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test, index) => {
              const status = statusVariant[test.status]
              return (
                <tr key={test.id} data-status={test.status} className="align-top border-t border-border/40">
                  <td className="px-2 py-3 font-medium text-muted-foreground/80">{index + 1}</td>
                  <td className="min-w-[180px] px-2 py-3 text-foreground">{test.input}</td>
                  <td className="px-2 py-3">
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </td>
                  <td className="max-w-[220px] px-2 py-3">
                    {test.status === 'running' ? (
                      <SkeletonText lines={2} />
                    ) : (
                      <pre className="whitespace-pre-wrap text-xs text-muted-foreground/80">
                        {test.output || '—'}
                      </pre>
                    )}
                  </td>
                  <td className="max-w-[220px] px-2 py-3">
                    <pre className="whitespace-pre-wrap text-xs text-muted-foreground/70">
                      {test.expected || '—'}
                    </pre>
                  </td>
                  <td className="px-2 py-3 text-xs text-muted-foreground/70">
                    {test.latencyMs ? `${test.latencyMs.toFixed(0)} ms` : '—'}
                  </td>
                  <td className="px-2 py-3 text-xs text-muted-foreground/70">
                    {test.costUsd ? `$${test.costUsd.toFixed(4)}` : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground/70">
        <span>
          {tests.length} test{tests.length === 1 ? '' : 's'} • {variants.length} variant{variants.length === 1 ? '' : 's'}
        </span>
        {isRunning && <span>Running… this may take a few minutes.</span>}
      </CardFooter>
    </Card>
  )
}

PromptTestHarness.displayName = 'PromptTestHarness'

