import {
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  MessageSquare,
} from 'lucide-react'
import clsx from 'clsx'

type CalloutType = 'info' | 'warning' | 'error' | 'success' | 'tip' | 'quote'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

const calloutConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-900 dark:text-blue-100',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    titleColor: 'text-yellow-900 dark:text-yellow-100',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    borderColor: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-900 dark:text-red-100',
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-800',
    iconColor: 'text-green-600 dark:text-green-400',
    titleColor: 'text-green-900 dark:text-green-100',
  },
  tip: {
    icon: Lightbulb,
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    iconColor: 'text-purple-600 dark:text-purple-400',
    titleColor: 'text-purple-900 dark:text-purple-100',
  },
  quote: {
    icon: MessageSquare,
    bgColor: 'bg-gray-50 dark:bg-gray-950/30',
    borderColor: 'border-gray-200 dark:border-gray-800',
    iconColor: 'text-gray-600 dark:text-gray-400',
    titleColor: 'text-gray-900 dark:text-gray-100',
  },
}

export function Callout({ type = 'info', title, children, className, icon }: CalloutProps) {
  const config = calloutConfig[type]
  const DefaultIcon = config.icon

  const defaultTitles = {
    info: 'Info',
    warning: 'Warning',
    error: 'Error',
    success: 'Success',
    tip: 'Tip',
    quote: 'Quote',
  }

  return (
    <div
      className={clsx(
        'not-prose my-6 p-5 rounded-xl border-2 shadow-sm transition-all duration-200 hover:shadow-md',
        config.bgColor,
        config.borderColor,
        className
      )}
      role="note"
      aria-label={`${type} callout`}
    >
      <div className="flex gap-3">
        <div
          className={clsx(
            'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
            'bg-white/50 dark:bg-black/20 shadow-inner',
            config.iconColor
          )}
        >
          {icon || <DefaultIcon className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          {(title || defaultTitles[type]) && (
            <div
              className={clsx(
                'font-semibold mb-2 text-base',
                config.titleColor
              )}
            >
              {title || defaultTitles[type]}
            </div>
          )}
          <div className="text-sm leading-relaxed text-text-secondary [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
