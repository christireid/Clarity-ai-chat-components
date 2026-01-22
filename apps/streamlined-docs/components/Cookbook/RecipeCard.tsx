'use client'

import React from 'react'

export interface RecipeTag {
  label: string
  /** If true, uses primary/brand color styling */
  primary?: boolean
}

export interface RecipeCardProps {
  /** URL to the recipe page */
  href: string
  /** Emoji icon for the recipe */
  icon: string
  /** Title of the recipe */
  title: string
  /** Short description of what the recipe does */
  description: string
  /** Tags to categorize the recipe (max 2 recommended) */
  tags: readonly RecipeTag[] | RecipeTag[]
}

/**
 * RecipeCard - A consistent card component for cookbook recipes
 *
 * @example
 * ```tsx
 * <RecipeCard
 *   href="/cookbook/openai-streaming"
 *   icon="💬"
 *   title="OpenAI Streaming Chat"
 *   description="Build a chat with streaming responses"
 *   tags={[
 *     { label: 'OpenAI', primary: true },
 *     { label: 'Streaming' }
 *   ]}
 * />
 * ```
 */
export function RecipeCard({
  href,
  icon,
  title,
  description,
  tags,
}: RecipeCardProps) {
  return (
    <a
      href={href}
      className="group p-6 rounded-xl bg-bg-secondary border border-border hover:border-brand-500/40 hover:shadow-lg transition-all block h-full"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary mb-2 group-hover:text-brand-500 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-text-secondary mb-4 line-clamp-2">
            {description}
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={
                  tag.primary
                    ? 'text-xs bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-1 rounded font-medium'
                    : 'text-xs bg-bg-tertiary text-text-secondary px-2 py-1 rounded'
                }
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  )
}

export default RecipeCard
