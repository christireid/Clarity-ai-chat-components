/**
 * Icon Components
 *
 * Centralized SVG icons for Clarity Chat.
 * These will eventually be replaced with Lucide React icons,
 * but provide immediate improvement over emojis.
 */

import * as React from 'react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

const getIconProps = (props: IconProps) => {
  const { size, ...rest } = props
  return {
    width: size ?? 20,
    height: size ?? 20,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...rest,
  }
}

// Message & Chat Icons
export const SendIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
)

export const LoadingIcon: React.FC<IconProps> = (props) => (
  <svg
    {...getIconProps(props)}
    viewBox="0 0 24 24"
    className="animate-spin"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

export const ThumbsUpIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
)

export const ThumbsDownIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M17 14V2" />
    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L14 22h0a3.13 3.13 0 0 1-3-3.88Z" />
  </svg>
)

export const CopyIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

export const CheckIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export const CloseIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

// File & Media Icons
export const PaperclipIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
)

export const ImageIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
)

export const FileIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

export const DownloadIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
)

// Status & Feedback Icons
export const AlertCircleIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
)

export const InfoIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
)

export const CheckCircleIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

export const XCircleIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
)

// Navigation Icons
export const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const ChevronUpIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="m18 15-6-6-6 6" />
  </svg>
)

export const ArrowDownIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
)

export const MoreHorizontalIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
)

// Settings & Tools Icons
export const SettingsIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const RefreshIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
)

export const EditIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

export const TrashIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
)

export const SearchIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

// Theme Icons
export const SunIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
)

export const MoonIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

// AI & Chat Icons
export const BotIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <rect width="18" height="10" x="3" y="11" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" x2="8" y1="16" y2="16" />
    <line x1="16" x2="16" y1="16" y2="16" />
  </svg>
)

export const UserIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export const SparklesIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
)

// Aliases for common naming conventions
export const XIcon = CloseIcon
export const LoaderIcon = LoadingIcon

// Alert and Shield Icons
export const AlertTriangleIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
)

export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export const ShieldCloseIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m14.5 9-5 5" />
    <path d="m9.5 9 5 5" />
  </svg>
)

// Media Icons
export const MicIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
)

export const LinkIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

export const ClockIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

export const DollarSignIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

export const TrendingUpIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

export const ShieldIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

export const FilterIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)

export const PlayIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

export const CodeIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

export const MessageSquareIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

export const LightbulbIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
)

export const FlagIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" x2="4" y1="22" y2="15" />
  </svg>
)

export const WrapTextIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <line x1="3" x2="21" y1="6" y2="6" />
    <path d="M3 12h15a3 3 0 1 1 0 6h-4" />
    <polyline points="16 16 14 18 16 20" />
  </svg>
)

export const ExternalLinkIcon: React.FC<IconProps> = (props) => (
  <svg {...getIconProps(props)} viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </svg>
)
