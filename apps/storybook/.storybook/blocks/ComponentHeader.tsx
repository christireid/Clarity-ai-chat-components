import React from 'react'
import { StatusBadge, ComponentStatus } from './StatusBadge'
import clsx from 'clsx'

interface ComponentHeaderProps {
  title: string
  status?: ComponentStatus
  description?: string
  version?: string
  figmaUrl?: string
  className?: string
}

export const ComponentHeader: React.FC<ComponentHeaderProps> = ({
  title,
  status = 'stable',
  description,
  version,
  figmaUrl,
  className,
}) => {
  return (
    <div className={clsx('mb-8 pb-6 border-b-2 border-border', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 m-0">
            {title}
          </h1>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center gap-2">
          {version && (
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              v{version}
            </span>
          )}
          {figmaUrl && (
            <a
              href={figmaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-500 hover:text-brand-600 underline"
            >
              View in Figma →
            </a>
          )}
        </div>
      </div>
      {description && (
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed m-0">
          {description}
        </p>
      )}
    </div>
  )
}
