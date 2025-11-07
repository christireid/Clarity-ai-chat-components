import * as React from 'react'

export interface UseCharacterCounterOptions {
  value: string
  maxLength?: number
  warningThreshold?: number
}

export interface CharacterCounterResult {
  charCount: number
  isOverLimit: boolean
  isNearLimit: boolean
  hasContent: boolean
  counterColor: string
  progressColor: string
  progressPercentage: number
}

/**
 * Custom hook for managing character counter logic
 * 
 * @example
 * ```tsx
 * const {
 *   charCount,
 *   isOverLimit,
 *   counterColor,
 *   progressPercentage
 * } = useCharacterCounter({
 *   value: inputValue,
 *   maxLength: 500,
 *   warningThreshold: 0.8
 * })
 * ```
 */
export function useCharacterCounter({
  value,
  maxLength,
  warningThreshold = 0.8,
}: UseCharacterCounterOptions): CharacterCounterResult {
  const charCount = React.useMemo(() => value.length, [value])
  const isOverLimit = React.useMemo(
    () => (maxLength ? charCount > maxLength : false),
    [charCount, maxLength]
  )
  const isNearLimit = React.useMemo(
    () => (maxLength ? charCount >= maxLength * warningThreshold : false),
    [charCount, maxLength, warningThreshold]
  )
  const hasContent = React.useMemo(
    () => value.trim().length > 0,
    [value]
  )

  const counterColor = React.useMemo(() => {
    if (isOverLimit) return 'text-destructive font-semibold'
    if (isNearLimit) return 'text-[hsl(var(--warning))] font-medium'
    if (charCount > 0) return 'text-primary'
    return 'text-muted-foreground'
  }, [isOverLimit, isNearLimit, charCount])

  const progressColor = React.useMemo(() => {
    if (isOverLimit) return 'bg-destructive'
    if (isNearLimit) return 'bg-[hsl(var(--warning))]'
    return 'bg-primary'
  }, [isOverLimit, isNearLimit])

  const progressPercentage = React.useMemo(() => {
    if (!maxLength) return 0
    return Math.min((charCount / maxLength) * 100, 100)
  }, [charCount, maxLength])

  return {
    charCount,
    isOverLimit,
    isNearLimit,
    hasContent,
    counterColor,
    progressColor,
    progressPercentage,
  }
}
