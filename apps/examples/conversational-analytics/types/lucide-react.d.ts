/**
 * Type declarations to fix lucide-react compatibility with TypeScript 5.x + React 18
 */

declare module 'lucide-react' {
  import type { SVGProps, FC } from 'react'

  export interface LucideProps extends Partial<Omit<SVGProps<SVGSVGElement>, 'ref'>> {
    size?: string | number
    absoluteStrokeWidth?: boolean
  }

  export type LucideIcon = FC<LucideProps>

  // All lucide-react icons
  export const AlertCircle: LucideIcon
  export const AlertTriangle: LucideIcon
  export const ArrowLeft: LucideIcon
  export const ArrowRight: LucideIcon
  export const BarChart: LucideIcon
  export const BarChart2: LucideIcon
  export const BarChart3: LucideIcon
  export const Calendar: LucideIcon
  export const Check: LucideIcon
  export const CheckCircle: LucideIcon
  export const CheckCircle2: LucideIcon
  export const ChevronDown: LucideIcon
  export const ChevronLeft: LucideIcon
  export const ChevronRight: LucideIcon
  export const ChevronUp: LucideIcon
  export const Circle: LucideIcon
  export const Clock: LucideIcon
  export const Copy: LucideIcon
  export const Database: LucideIcon
  export const DollarSign: LucideIcon
  export const Download: LucideIcon
  export const Edit: LucideIcon
  export const Eye: LucideIcon
  export const EyeOff: LucideIcon
  export const FileText: LucideIcon
  export const Filter: LucideIcon
  export const Loader2: LucideIcon
  export const MessageSquare: LucideIcon
  export const MoreHorizontal: LucideIcon
  export const MoreVertical: LucideIcon
  export const RefreshCw: LucideIcon
  export const Search: LucideIcon
  export const Send: LucideIcon
  export const Settings: LucideIcon
  export const ShoppingCart: LucideIcon
  export const Star: LucideIcon
  export const ThumbsDown: LucideIcon
  export const ThumbsUp: LucideIcon
  export const TrendingUp: LucideIcon
  export const TrendingDown: LucideIcon
  export const Trash: LucideIcon
  export const Upload: LucideIcon
  export const User: LucideIcon
  export const Users: LucideIcon
  export const X: LucideIcon
  export const Zap: LucideIcon
}
