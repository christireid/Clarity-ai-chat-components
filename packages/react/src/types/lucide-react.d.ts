/**
 * Type declarations for lucide-react (peer dependency)
 *
 * lucide-react is a peer dependency and may not be installed during development.
 * This declaration file provides type safety for icon imports.
 *
 * @see https://lucide.dev/guide/packages/lucide-react
 */

declare module 'lucide-react' {
  import type { FC, SVGProps } from 'react'

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number
    strokeWidth?: string | number
    absoluteStrokeWidth?: boolean
    color?: string
  }

  export type LucideIcon = FC<LucideProps>

  // All icon exports used in this project
  export const Activity: LucideIcon
  export const AlertCircle: LucideIcon
  export const AlertTriangle: LucideIcon
  export const Archive: LucideIcon
  export const ArrowDown: LucideIcon
  export const ArrowLeft: LucideIcon
  export const ArrowRight: LucideIcon
  export const ArrowUp: LucideIcon
  export const AtSign: LucideIcon
  export const BarChart3: LucideIcon
  export const Bell: LucideIcon
  export const Bookmark: LucideIcon
  export const BookmarkPlus: LucideIcon
  export const Bot: LucideIcon
  export const Brain: LucideIcon
  export const Briefcase: LucideIcon
  export const Bug: LucideIcon
  export const Calculator: LucideIcon
  export const Calendar: LucideIcon
  export const Check: LucideIcon
  export const CheckCheck: LucideIcon
  export const CheckCircle: LucideIcon
  export const CheckCircle2: LucideIcon
  export const ChevronDown: LucideIcon
  export const ChevronLeft: LucideIcon
  export const ChevronRight: LucideIcon
  export const ChevronUp: LucideIcon
  export const ChevronsDown: LucideIcon
  export const Circle: LucideIcon
  export const Clipboard: LucideIcon
  export const ClipboardCheck: LucideIcon
  export const Clock: LucideIcon
  export const Code: LucideIcon
  export const Command: LucideIcon
  export const Copy: LucideIcon
  export const CornerDownLeft: LucideIcon
  export const Cpu: LucideIcon
  export const Database: LucideIcon
  export const Download: LucideIcon
  export const Edit3: LucideIcon
  export const ExternalLink: LucideIcon
  export const Eye: LucideIcon
  export const EyeOff: LucideIcon
  export const FileCode: LucideIcon
  export const FileText: LucideIcon
  export const Filter: LucideIcon
  export const FolderOpen: LucideIcon
  export const GitBranch: LucideIcon
  export const Globe: LucideIcon
  export const Hash: LucideIcon
  export const Home: LucideIcon
  export const ImageIcon: LucideIcon
  export const Info: LucideIcon
  export const Languages: LucideIcon
  export const Link2: LucideIcon
  export const List: LucideIcon
  export const Loader2: LucideIcon
  export const Lock: LucideIcon
  export const Mail: LucideIcon
  export const MapPin: LucideIcon
  export const Maximize2: LucideIcon
  export const MessageSquare: LucideIcon
  export const Mic: LucideIcon
  export const MicOff: LucideIcon
  export const Minimize2: LucideIcon
  export const Minus: LucideIcon
  export const MoreHorizontal: LucideIcon
  export const MoreVertical: LucideIcon
  export const PanelLeft: LucideIcon
  export const Pause: LucideIcon
  export const Pin: LucideIcon
  export const PinOff: LucideIcon
  export const Pipette: LucideIcon
  export const Play: LucideIcon
  export const Plus: LucideIcon
  export const Radio: LucideIcon
  export const RefreshCw: LucideIcon
  export const Repeat: LucideIcon
  export const RotateCcw: LucideIcon
  export const RotateCw: LucideIcon
  export const Scissors: LucideIcon
  export const Search: LucideIcon
  export const Settings: LucideIcon
  export const Share2: LucideIcon
  export const Shield: LucideIcon
  export const ShieldAlert: LucideIcon
  export const Shuffle: LucideIcon
  export const Sliders: LucideIcon
  export const SmilePlus: LucideIcon
  export const SortAsc: LucideIcon
  export const SortDesc: LucideIcon
  export const Sparkles: LucideIcon
  export const Square: LucideIcon
  export const Star: LucideIcon
  export const StopCircle: LucideIcon
  export const Terminal: LucideIcon
  export const ThumbsDown: LucideIcon
  export const ThumbsUp: LucideIcon
  export const Timer: LucideIcon
  export const Trash2: LucideIcon
  export const TrendingDown: LucideIcon
  export const TrendingUp: LucideIcon
  export const User: LucideIcon
  export const Video: LucideIcon
  export const Volume2: LucideIcon
  export const Wand2: LucideIcon
  export const Waves: LucideIcon
  export const Wifi: LucideIcon
  export const WifiOff: LucideIcon
  export const Wrench: LucideIcon
  export const X: LucideIcon
  export const XCircle: LucideIcon
  export const Zap: LucideIcon
}
