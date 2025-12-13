/**
 * Shared Icons Module
 * Centralized SVG icons for the dev-tools package
 * Eliminates duplication across components
 */

import * as React from 'react'

export interface IconProps {
  /** Icon width in pixels */
  size?: number | 'sm' | 'md' | 'lg' | 'xl'
  /** Additional CSS class */
  className?: string
  /** Accessible label */
  'aria-label'?: string
}

// Size presets
const sizeMap = {
  sm: 14,
  md: 16,
  lg: 18,
  xl: 48,
} as const

function getSize(size: IconProps['size'] = 'md'): number {
  if (typeof size === 'number') return size
  return sizeMap[size]
}

// Base SVG props for stroke-based icons
function getSvgProps(props: IconProps, defaultSize: number = 16) {
  const size = props.size ? getSize(props.size) : defaultSize
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: props.className,
    'aria-label': props['aria-label'],
    'aria-hidden': !props['aria-label'],
  }
}

// ============================================================================
// Navigation & UI Icons
// ============================================================================

export function SearchIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 14)}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function ArrowUpDownIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 14)}>
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  )
}

export function KeyboardIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 14)}>
      <rect width="20" height="16" x="2" y="4" rx="2" ry="2" />
      <path d="M6 8h.001" />
      <path d="M10 8h.001" />
      <path d="M14 8h.001" />
      <path d="M18 8h.001" />
      <path d="M8 12h.001" />
      <path d="M12 12h.001" />
      <path d="M16 12h.001" />
      <path d="M7 16h10" />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 20)}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

// ============================================================================
// Status & Feedback Icons
// ============================================================================

export function CheckIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 14)}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

export function AlertCircleIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

export function XCircleIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 14)}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

// ============================================================================
// Action Icons
// ============================================================================

export function TrashIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 14)}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

// ============================================================================
// Media Control Icons
// ============================================================================

export function PlayIcon(props: IconProps) {
  const size = props.size ? getSize(props.size) : 16
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={props.className}
      aria-label={props['aria-label']}
      aria-hidden={!props['aria-label']}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

export function PauseIcon(props: IconProps) {
  const size = props.size ? getSize(props.size) : 16
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={props.className}
      aria-label={props['aria-label']}
      aria-hidden={!props['aria-label']}
    >
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  )
}

export function RewindIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <polygon points="11 19 2 12 11 5 11 19" />
      <polygon points="22 19 13 12 22 5 22 19" />
    </svg>
  )
}

export function FastForwardIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <polygon points="13 19 22 12 13 5 13 19" />
      <polygon points="2 19 11 12 2 5 2 19" />
    </svg>
  )
}

export function SkipBackIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <polygon points="19 20 9 12 19 4 19 20" />
      <line x1="5" y1="19" x2="5" y2="5" />
    </svg>
  )
}

export function SkipForwardIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <polygon points="5 4 15 12 5 20 5 4" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </svg>
  )
}

// ============================================================================
// Time & Clock Icons
// ============================================================================

export function ClockIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export function HistoryIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 48)} strokeWidth={1.5}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  )
}

// ============================================================================
// Performance & Analytics Icons
// ============================================================================

export function ZapIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 18)}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

export function ActivityIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 48)} strokeWidth={1.5}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

export function TrendingUpIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

export function TrendingDownIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  )
}

export function MemoryIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3" />
      <path d="M15 1v3" />
      <path d="M9 20v3" />
      <path d="M15 20v3" />
      <path d="M20 9h3" />
      <path d="M20 14h3" />
      <path d="M1 9h3" />
      <path d="M1 14h3" />
    </svg>
  )
}

export function BarChartIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 48)} strokeWidth={1.5}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

// ============================================================================
// Communication Icons
// ============================================================================

export function MessageSquareIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 14)}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

export function InboxIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 48)} strokeWidth={1.5}>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  )
}

// ============================================================================
// Git & Version Control Icons
// ============================================================================

export function GitCommitIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 14)}>
      <circle cx="12" cy="12" r="4" />
      <line x1="1.05" y1="12" x2="7" y2="12" />
      <line x1="17.01" y1="12" x2="22.96" y2="12" />
    </svg>
  )
}

// ============================================================================
// Feature/Panel Icons
// ============================================================================

export function InspectorIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 18)}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

export function ProfilerIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 18)}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

export function ValidationIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 18)}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

export function TimeTravelIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 18)}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export function ComparisonIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 18)}>
      <path d="M16 3h5v5" />
      <path d="M8 3H3v5" />
      <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
      <path d="m15 9 6-6" />
    </svg>
  )
}

export function ScaleIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 18)}>
      <path d="M16 3h5v5" />
      <path d="M8 3H3v5" />
      <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
      <path d="m15 9 6-6" />
    </svg>
  )
}

// ============================================================================
// Settings & Configuration Icons
// ============================================================================

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props, 18)}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

export function KeyIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  )
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

// ============================================================================
// Misc Icons
// ============================================================================

export function DollarSignIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

export function HashIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  )
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

export function LightbulbIcon(props: IconProps) {
  return (
    <svg {...getSvgProps(props)}>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}

// ============================================================================
// Legacy Icons object for backward compatibility during migration
// This allows gradual migration of existing components
// ============================================================================

/**
 * @deprecated Use individual icon components instead
 * This object provides backward compatibility during migration
 */
export const Icons = {
  // Navigation & UI
  Search: SearchIcon,
  ChevronDown: ChevronDownIcon,
  ArrowRight: ArrowRightIcon,
  ArrowUpDown: ArrowUpDownIcon,
  Keyboard: KeyboardIcon,
  Close: CloseIcon,

  // Status & Feedback
  Check: CheckIcon,
  CheckCircle: CheckCircleIcon,
  AlertCircle: AlertCircleIcon,
  AlertTriangle: AlertTriangleIcon,
  XCircle: XCircleIcon,
  Info: InfoIcon,

  // Actions
  Trash: TrashIcon,
  Copy: CopyIcon,
  Download: DownloadIcon,

  // Media Controls
  Play: PlayIcon,
  Pause: PauseIcon,
  Rewind: RewindIcon,
  FastForward: FastForwardIcon,
  SkipBack: SkipBackIcon,
  SkipForward: SkipForwardIcon,

  // Time & Clock
  Clock: ClockIcon,
  History: HistoryIcon,

  // Performance & Analytics
  Zap: ZapIcon,
  Activity: ActivityIcon,
  TrendingUp: TrendingUpIcon,
  TrendingDown: TrendingDownIcon,
  Memory: MemoryIcon,
  BarChart: BarChartIcon,

  // Communication
  MessageSquare: MessageSquareIcon,
  Inbox: InboxIcon,

  // Git
  GitCommit: GitCommitIcon,

  // Feature/Panel Icons
  Inspector: InspectorIcon,
  Profiler: ProfilerIcon,
  Validation: ValidationIcon,
  TimeTravel: TimeTravelIcon,
  Comparison: ComparisonIcon,
  Scale: ScaleIcon,

  // Settings & Configuration
  Shield: ShieldIcon,
  Key: KeyIcon,
  Settings: SettingsIcon,
  Globe: GlobeIcon,

  // Misc
  DollarSign: DollarSignIcon,
  Hash: HashIcon,
  Trophy: TrophyIcon,
  Lightbulb: LightbulbIcon,
} as const

export type IconName = keyof typeof Icons
