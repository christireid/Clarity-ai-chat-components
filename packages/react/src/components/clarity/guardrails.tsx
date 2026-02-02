'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import { Switch } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import {
  AlertTriangle,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Lock,
  Unlock,
  FileWarning,
  Ban,
  Flag,
  Sparkles,
  RefreshCw,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'

// Types
export interface ModerationResult {
  flagged: boolean
  categories: {
    [key: string]: boolean
  }
  categoryScores: {
    [key: string]: number
  }
}

export interface PIIDetection {
  type:
    | 'email'
    | 'phone'
    | 'ssn'
    | 'credit_card'
    | 'address'
    | 'name'
    | 'date'
    | 'ip'
    | 'custom'
  value: string
  start: number
  end: number
  confidence: number
  redacted?: string
}

export interface FactCheckResult {
  claim: string
  verdict: 'supported' | 'refuted' | 'unverifiable' | 'mixed'
  confidence: number
  sources?: { title: string; url: string }[]
  explanation?: string
}

export interface HallucinationCheck {
  text: string
  isGrounded: boolean
  groundingScore: number
  ungroundedSpans?: { start: number; end: number; reason: string }[]
}

export interface SafetyFilter {
  id: string
  name: string
  description: string
  enabled: boolean
  sensitivity: 'low' | 'medium' | 'high'
  category: string
}

// Moderation Badge
interface ModerationBadgeProps {
  result: ModerationResult
  showCategories?: boolean
  className?: string
}

export function ModerationBadge({
  result,
  showCategories = false,
  className,
}: ModerationBadgeProps) {
  const flaggedCategories = Object.entries(result.categories)
    .filter(([_, flagged]) => flagged)
    .map(([category]) => category)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {result.flagged ? (
        <Badge variant="destructive" className="gap-1">
          <ShieldAlert className="h-3 w-3" />
          Flagged
        </Badge>
      ) : (
        <Badge variant="default" className="gap-1 bg-green-500">
          <ShieldCheck className="h-3 w-3" />
          Safe
        </Badge>
      )}
      {showCategories && flaggedCategories.length > 0 && (
        <div className="flex gap-1">
          {flaggedCategories.map((cat) => (
            <Badge key={cat} variant="outline" className="text-xs">
              {cat}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

// Moderation Details Card
interface ModerationDetailsProps {
  result: ModerationResult
  className?: string
}

export function ModerationDetails({
  result,
  className,
}: ModerationDetailsProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Content Moderation
          </CardTitle>
          <ModerationBadge result={result} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(result.categoryScores).map(([category, score]) => {
            const isFlagged = result.categories[category]
            return (
              <div key={category} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {isFlagged ? (
                      <XCircle className="h-3 w-3 text-red-500" />
                    ) : (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                    <span className="capitalize">
                      {category.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span
                    className={cn('font-mono', isFlagged && 'text-red-500')}
                  >
                    {(score * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={score * 100}
                  className={cn('h-1', isFlagged && '[&>div]:bg-red-500')}
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// PII Detection Display
interface PIIDetectionDisplayProps {
  detections: PIIDetection[]
  originalText: string
  onRedact?: () => void
  className?: string
}

export function PIIDetectionDisplay({
  detections,
  originalText,
  onRedact,
  className,
}: PIIDetectionDisplayProps) {
  const [showOriginal, setShowOriginal] = React.useState(false)

  const typeIcons = {
    email: '📧',
    phone: '📱',
    ssn: '🔢',
    credit_card: '💳',
    address: '🏠',
    name: '👤',
    date: '📅',
    ip: '🌐',
    custom: '🔍',
  }

  const renderRedactedText = () => {
    if (showOriginal) return originalText

    let result = originalText
    const sortedDetections = [...detections].sort((a, b) => b.start - a.start)

    for (const detection of sortedDetections) {
      const redacted = detection.redacted || '[REDACTED]'
      result =
        result.slice(0, detection.start) +
        redacted +
        result.slice(detection.end)
    }

    return result
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4" />
            PII Detection
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={detections.length > 0 ? 'destructive' : 'default'}>
              {detections.length} found
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOriginal(!showOriginal)}
            >
              {showOriginal ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-mono whitespace-pre-wrap">
            {renderRedactedText()}
          </p>
        </div>

        {detections.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Detected PII:</p>
            {detections.map((detection, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded text-sm"
              >
                <div className="flex items-center gap-2">
                  <span>{typeIcons[detection.type]}</span>
                  <span className="capitalize">
                    {detection.type.replace(/_/g, ' ')}
                  </span>
                  {showOriginal && (
                    <code className="px-1 py-0.5 bg-muted rounded text-xs">
                      {detection.value}
                    </code>
                  )}
                </div>
                <Badge variant="outline">
                  {(detection.confidence * 100).toFixed(0)}% confidence
                </Badge>
              </div>
            ))}
          </div>
        )}

        {onRedact && detections.length > 0 && (
          <Button onClick={onRedact} className="w-full">
            <Lock className="h-4 w-4 mr-2" />
            Auto-Redact All PII
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Fact Check Result Display
interface FactCheckDisplayProps {
  results: FactCheckResult[]
  className?: string
}

export function FactCheckDisplay({
  results,
  className,
}: FactCheckDisplayProps) {
  const verdictConfig = {
    supported: {
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    refuted: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    unverifiable: {
      icon: AlertCircle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
    mixed: {
      icon: AlertTriangle,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Fact Check Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.map((result, index) => {
            const config = verdictConfig[result.verdict]
            const Icon = config.icon

            return (
              <Collapsible key={index}>
                <div className={cn('p-3 rounded-lg', config.bg)}>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <Icon className={cn('h-4 w-4 mt-0.5', config.color)} />
                        <div className="text-left">
                          <p className="text-sm font-medium">{result.claim}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {result.verdict} (
                            {(result.confidence * 100).toFixed(0)}% confidence)
                          </p>
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-3 pt-3 border-t space-y-2">
                      {result.explanation && (
                        <p className="text-sm text-muted-foreground">
                          {result.explanation}
                        </p>
                      )}
                      {result.sources && result.sources.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Sources:</p>
                          {result.sources.map((source, i) => (
                            <a
                              key={i}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline block"
                            >
                              {source.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Hallucination Indicator
interface HallucinationIndicatorProps {
  check: HallucinationCheck
  className?: string
}

export function HallucinationIndicator({
  check,
  className,
}: HallucinationIndicatorProps) {
  const renderHighlightedText = () => {
    if (!check.ungroundedSpans || check.ungroundedSpans.length === 0) {
      return check.text
    }

    const sortedSpans = [...check.ungroundedSpans].sort(
      (a, b) => a.start - b.start
    )
    const result: React.ReactNode[] = []
    let lastEnd = 0

    sortedSpans.forEach((span, index) => {
      if (span.start > lastEnd) {
        result.push(check.text.slice(lastEnd, span.start))
      }

      result.push(
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="bg-red-500/20 border-b-2 border-red-500 cursor-help">
                {check.text.slice(span.start, span.end)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{span.reason}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )

      lastEnd = span.end
    })

    if (lastEnd < check.text.length) {
      result.push(check.text.slice(lastEnd))
    }

    return result
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Grounding Check
          </CardTitle>
          <Badge variant={check.isGrounded ? 'default' : 'destructive'}>
            {check.isGrounded ? 'Grounded' : 'Potential Hallucination'}
          </Badge>
        </div>
        <CardDescription>
          Grounding Score: {(check.groundingScore * 100).toFixed(0)}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Progress
            value={check.groundingScore * 100}
            className={cn('h-2', !check.isGrounded && '[&>div]:bg-red-500')}
          />
          <p className="text-sm leading-relaxed">{renderHighlightedText()}</p>
          {check.ungroundedSpans && check.ungroundedSpans.length > 0 && (
            <p className="text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3 inline mr-1" />
              {check.ungroundedSpans.length} potentially ungrounded span(s)
              highlighted
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Safety Filters Panel
interface SafetyFiltersPanelProps {
  filters: SafetyFilter[]
  onFilterChange: (id: string, enabled: boolean) => void
  onSensitivityChange: (
    id: string,
    sensitivity: 'low' | 'medium' | 'high'
  ) => void
  className?: string
}

export function SafetyFiltersPanel({
  filters,
  onFilterChange,
  onSensitivityChange,
  className,
}: SafetyFiltersPanelProps) {
  const groupedFilters = filters.reduce(
    (acc, filter) => {
      if (!acc[filter.category]) {
        acc[filter.category] = []
      }
      acc[filter.category].push(filter)
      return acc
    },
    {} as Record<string, SafetyFilter[]>
  )

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Safety Filters
        </CardTitle>
        <CardDescription>Configure content moderation settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedFilters).map(([category, categoryFilters]) => (
            <div key={category} className="space-y-3">
              <p className="text-sm font-medium capitalize">{category}</p>
              {categoryFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={filter.id}
                        checked={filter.enabled}
                        onCheckedChange={(enabled) =>
                          onFilterChange(filter.id, enabled)
                        }
                      />
                      <Label htmlFor={filter.id} className="font-medium">
                        {filter.name}
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {filter.description}
                    </p>
                  </div>
                  {filter.enabled && (
                    <div className="flex gap-1">
                      {(['low', 'medium', 'high'] as const).map((level) => (
                        <Button
                          key={level}
                          variant={
                            filter.sensitivity === level ? 'default' : 'outline'
                          }
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => onSensitivityChange(filter.id, level)}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Safety Shield Indicator (Inline)
interface SafetyShieldProps {
  status: 'safe' | 'warning' | 'blocked'
  tooltip?: string
  className?: string
}

export function SafetyShield({
  status,
  tooltip,
  className,
}: SafetyShieldProps) {
  const config = {
    safe: { icon: ShieldCheck, color: 'text-green-500' },
    warning: { icon: ShieldAlert, color: 'text-yellow-500' },
    blocked: { icon: ShieldOff, color: 'text-red-500' },
  }

  const { icon: Icon, color } = config[status]

  const shield = <Icon className={cn('h-4 w-4', color, className)} />

  if (!tooltip) return shield

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{shield}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Content Warning Banner
interface ContentWarningBannerProps {
  type: 'nsfw' | 'violence' | 'hate' | 'self_harm' | 'other'
  message?: string
  onProceed?: () => void
  onGoBack?: () => void
  className?: string
}

export function ContentWarningBanner({
  type,
  message,
  onProceed,
  onGoBack,
  className,
}: ContentWarningBannerProps) {
  const defaultMessages = {
    nsfw: 'This content may contain adult material.',
    violence: 'This content may contain graphic violence.',
    hate: 'This content may contain hate speech.',
    self_harm:
      "This content discusses self-harm. If you're struggling, please seek help.",
    other: 'This content may be sensitive.',
  }

  return (
    <div
      className={cn(
        'p-6 rounded-lg bg-destructive/10 border border-destructive/20 text-center space-y-4',
        className
      )}
    >
      <div className="flex justify-center">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Content Warning</h3>
        <p className="text-sm text-muted-foreground">
          {message || defaultMessages[type]}
        </p>
      </div>
      <div className="flex justify-center gap-3">
        {onGoBack && (
          <Button variant="outline" onClick={onGoBack}>
            Go Back
          </Button>
        )}
        {onProceed && (
          <Button variant="destructive" onClick={onProceed}>
            I Understand, Proceed
          </Button>
        )}
      </div>
    </div>
  )
}
