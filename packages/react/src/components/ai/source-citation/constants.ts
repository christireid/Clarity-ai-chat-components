/**
 * Constants and configuration for SourceCitation component
 */

import type { SourceCitationSize } from './types'

export const SIZE_CONFIG = {
  sm: {
    container: 'text-xs',
    title: 'text-xs font-medium',
    snippet: 'text-[10px]',
    favicon: 'w-3 h-3',
    badge: 'text-[9px] px-1 py-0',
    padding: 'p-1.5',
    gap: 'gap-1.5',
    iconSize: 12,
  },
  md: {
    container: 'text-sm',
    title: 'text-sm font-medium',
    snippet: 'text-xs',
    favicon: 'w-4 h-4',
    badge: 'text-[10px] px-1.5 py-0.5',
    padding: 'p-2.5',
    gap: 'gap-2',
    iconSize: 14,
  },
  lg: {
    container: 'text-base',
    title: 'text-base font-semibold',
    snippet: 'text-sm',
    favicon: 'w-5 h-5',
    badge: 'text-xs px-2 py-0.5',
    padding: 'p-3.5',
    gap: 'gap-3',
    iconSize: 16,
  },
} as const

export type SizeConfigType = typeof SIZE_CONFIG
export type SizeConfig = SizeConfigType[SourceCitationSize]
