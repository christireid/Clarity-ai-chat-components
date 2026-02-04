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
import { Skeleton, SkeletonText } from '../ui/skeleton'

export type PromptTestStatus = 'pending' | 'running' | 'pass' | 'fail'

export interface PromptVariantItem {
  id: string
  label: string
  /** Optional description for the variant */
  description?: string
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
  /** Display name of the current dataset */
  datasetName?: string
  /** Available datasets for selection */
  datasets?: Array<{ id: string; name: string }>
  /** Prompt variants to test */
  variants: PromptVariantItem[]
  /** Test cases to run */
  tests: PromptTestCase[]
  /** Callback when run all is clicked */
  onRunAll?: () => void
  /** Callback when a single variant should be run */
  onRunVariant?: (variantId: string) => void
  /** Callback when variant is selected */
  onSelectVariant?: (variantId: string) => void
  /** Callback when dataset is selected */
  onSelectDataset?: (datasetId: string) => void
  /** Whether tests are currently running */
  isRunning?: boolean
  /** Whether data is loading */
  isLoading?: boolean
  /** Custom empty state message */
  emptyMessage?: string
  className?: string
}

const statusVariant: Record<
  PromptTestStatus,
  { label: string; variant: 'info' | 'success' | 'warning' | 'destructive' }
> = {
  pending: { label: 'Pending', variant: 'info' },
  running: { label: 'Running', variant: 'info' },
  pass: { label: 'Pass', variant: 'success' },
  fail: { label: 'Fail', variant: 'destructive' },
}

const TableSkeleton = () => (
  <tbody>
    {[1, 2, 3].map((i) => (
      <tr key={i} className="border-t border-border/40">
        <td className="px-2 py-3">
          <Skeleton width={20} height={16} />
        </td>
        <td className="px-2 py-3">
          <Skeleton width="80%" height={16} />
        </td>
        <td className="px-2 py-3">
          <Skeleton width={60} height={20} />
        </td>
        <td className="px-2 py-3">
          <SkeletonText lines={2} />
        </td>
        <td className="px-2 py-3">
          <SkeletonText lines={2} />
        </td>
        <td className="px-2 py-3">
          <Skeleton width={50} height={16} />
        </td>
        <td className="px-2 py-3">
          <Skeleton width={60} height={16} />
        </td>
      </tr>
    ))}
  </tbody>
)

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <tbody>
    <tr>
      <td colSpan={7} className="px-2 py-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-3 rounded-full bg-muted p-3">
            <svg
              className="h-6 w-6 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </td>
    </tr>
  </tbody>
)

export const PromptTestHarness: React.FC<PromptTestHarnessProps> = ({
  datasetName,
  datasets = [],
  variants,
  tests,
  onRunAll,
  onRunVariant,
  onSelectVariant,
  onSelectDataset,
  isRunning = false,
  isLoading = false,
  emptyMessage = 'No test cases available. Add test cases to your dataset to get started.',
  className,
}) => {
  const [selectedVariant, setSelectedVariant] = React.useState<
    string | undefined
  >(() => variants[0]?.id)
  const [selectedDataset, setSelectedDataset] = React.useState<
    string | undefined
  >(() => datasets[0]?.id)

  // Sync with external variants changes
  React.useEffect(() => {
    if (
      variants.length > 0 &&
      !variants.find((v) => v.id === selectedVariant)
    ) {
      setSelectedVariant(variants[0]?.id)
    }
  }, [variants, selectedVariant])

  React.useEffect(() => {
    if (datasets.length > 0 && !selectedDataset && datasets[0]) {
      setSelectedDataset(datasets[0].id)
    }
  }, [datasets, selectedDataset])

  const handleDatasetChange = (value: string) => {
    setSelectedDataset(value)
    onSelectDataset?.(value)
  }

  const handleVariantChange = (value: string) => {
    setSelectedVariant(value)
    onSelectVariant?.(value)
  }

  const handleRunSelectedVariant = () => {
    if (selectedVariant) {
      onRunVariant?.(selectedVariant)
    }
  }

  // Calculate test statistics
  const passCount = tests.filter((t) => t.status === 'pass').length
  const failCount = tests.filter((t) => t.status === 'fail').length
  const runningCount = tests.filter((t) => t.status === 'running').length
  const progress =
    tests.length > 0 ? ((passCount + failCount) / tests.length) * 100 : 0

  return (
    <Card
      className={cn(
        // Glassmorphism: medium intensity, purple gradient, animated gradient (AI panel)
        'relative overflow-hidden',
        'border border-border/30 backdrop-blur-xl backdrop-saturate-150',
        'bg-gradient-to-br from-purple-500/10 via-background/80 to-purple-600/5',
        'shadow-[0_8px_32px_rgba(147,51,234,0.12)]',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-400/5 before:via-transparent before:to-purple-600/5',
        'before:animate-gradient-shift before:bg-[length:200%_200%] before:pointer-events-none',
        className
      )}
      aria-busy={isLoading || isRunning}
    >
      <CardHeader className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <CardTitle className="text-lg font-semibold text-foreground">
            Prompt regression harness
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground/80">
            Compare prompt variants across curated datasets before shipping
            changes.
          </CardDescription>
          {datasetName && (
            <Badge variant="outline" className="text-[11px]">
              Dataset: {datasetName}
            </Badge>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          {datasets.length > 0 && (
            <div className="flex flex-col gap-1">
              <label
                htmlFor="dataset-select"
                className="text-xs font-medium text-muted-foreground"
              >
                Dataset
              </label>
              <select
                id="dataset-select"
                value={selectedDataset ?? ''}
                onChange={(event) => handleDatasetChange(event.target.value)}
                disabled={isRunning}
                className="min-w-[200px] rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50"
                aria-describedby="dataset-description"
              >
                {datasets.map((ds) => (
                  <option key={ds.id} value={ds.id}>
                    {ds.name}
                  </option>
                ))}
              </select>
              <span id="dataset-description" className="sr-only">
                Select a dataset to run tests against
              </span>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="variant-select"
              className="text-xs font-medium text-muted-foreground"
            >
              Variant
            </label>
            <div className="flex flex-wrap gap-2">
              <select
                id="variant-select"
                value={selectedVariant ?? ''}
                onChange={(event) => handleVariantChange(event.target.value)}
                disabled={isRunning}
                className="min-w-[200px] rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50"
                aria-describedby="variant-description"
              >
                {variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.label}
                  </option>
                ))}
              </select>
              <span id="variant-description" className="sr-only">
                Select a prompt variant to test
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRunSelectedVariant}
                disabled={isRunning || !selectedVariant}
                aria-label={`Run ${variants.find((v) => v.id === selectedVariant)?.label ?? 'selected'} variant`}
              >
                Run variant
              </Button>
              <Button
                variant="surface"
                size="sm"
                onClick={onRunAll}
                disabled={isRunning}
              >
                {isRunning ? 'Running...' : 'Run all variants'}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Progress bar when running */}
      {isRunning && (
        <div className="relative z-10 px-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground/70">
            <span>
              Running tests... {passCount + failCount}/{tests.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Test progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <CardContent className="relative z-10 overflow-x-auto">
        <table
          className="min-w-[720px] w-full text-sm"
          role="table"
          aria-label="Prompt test results"
        >
          <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground/70">
            <tr>
              <th scope="col" className="w-[48px] py-2 px-2">
                #
              </th>
              <th scope="col" className="py-2 px-2">
                Input
              </th>
              <th scope="col" className="py-2 px-2 w-[100px]">
                Status
              </th>
              <th scope="col" className="py-2 px-2">
                Output
              </th>
              <th scope="col" className="py-2 px-2">
                Expected
              </th>
              <th scope="col" className="py-2 px-2 w-[80px]">
                Latency
              </th>
              <th scope="col" className="py-2 px-2 w-[80px]">
                Cost
              </th>
            </tr>
          </thead>
          {isLoading ? (
            <TableSkeleton />
          ) : tests.length === 0 ? (
            <EmptyState message={emptyMessage} />
          ) : (
            <tbody>
              {tests.map((test, index) => {
                const status = statusVariant[test.status]
                const isMatch =
                  test.status === 'pass' ||
                  (test.output &&
                    test.expected &&
                    test.output === test.expected)

                return (
                  <tr
                    key={test.id}
                    data-status={test.status}
                    className={cn(
                      'align-top border-t border-border/40 transition-colors',
                      test.status === 'fail' && 'bg-destructive/5'
                    )}
                  >
                    <td className="px-2 py-3 font-medium text-muted-foreground/80">
                      {index + 1}
                    </td>
                    <td className="min-w-[180px] px-2 py-3 text-foreground">
                      <p className="line-clamp-3">{test.input}</p>
                    </td>
                    <td className="px-2 py-3">
                      <Badge
                        variant={status.variant}
                        className={cn(
                          test.status === 'running' && 'animate-pulse'
                        )}
                      >
                        {status.label}
                      </Badge>
                    </td>
                    <td className="max-w-[220px] px-2 py-3">
                      {test.status === 'running' ? (
                        <SkeletonText lines={2} />
                      ) : (
                        <pre
                          className={cn(
                            'whitespace-pre-wrap text-xs',
                            isMatch
                              ? 'text-muted-foreground/80'
                              : 'text-foreground'
                          )}
                        >
                          {test.output || '—'}
                        </pre>
                      )}
                    </td>
                    <td className="max-w-[220px] px-2 py-3">
                      <pre className="whitespace-pre-wrap text-xs text-muted-foreground/70">
                        {test.expected || '—'}
                      </pre>
                    </td>
                    <td className="px-2 py-3 text-xs text-muted-foreground/70 tabular-nums">
                      {test.latencyMs !== undefined
                        ? `${test.latencyMs.toFixed(0)} ms`
                        : '—'}
                    </td>
                    <td className="px-2 py-3 text-xs text-muted-foreground/70 tabular-nums">
                      {test.costUsd !== undefined
                        ? `$${test.costUsd.toFixed(4)}`
                        : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          )}
        </table>
      </CardContent>

      <CardFooter className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground/70">
        <div className="flex items-center gap-3">
          <span>
            {tests.length} test{tests.length === 1 ? '' : 's'}
          </span>
          <span className="text-border">•</span>
          <span>
            {variants.length} variant{variants.length === 1 ? '' : 's'}
          </span>
          {(passCount > 0 || failCount > 0) && (
            <>
              <span className="text-border">•</span>
              <span className="flex items-center gap-2">
                {passCount > 0 && (
                  <span className="text-success">{passCount} passed</span>
                )}
                {failCount > 0 && (
                  <span className="text-destructive">{failCount} failed</span>
                )}
              </span>
            </>
          )}
        </div>
        {runningCount > 0 && (
          <span className="flex items-center gap-2" aria-live="polite">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
            Running {runningCount} test{runningCount === 1 ? '' : 's'}...
          </span>
        )}
      </CardFooter>
    </Card>
  )
}

PromptTestHarness.displayName = 'PromptTestHarness'
