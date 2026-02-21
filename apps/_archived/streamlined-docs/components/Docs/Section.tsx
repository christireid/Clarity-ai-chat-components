import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Section - Main section component with anchor link support
 *
 * Extracted from chat-window/page.tsx for reusability. Provides:
 * - Automatic anchor link generation from id
 * - Scroll margin for sticky header navigation
 * - Hover state showing # symbol
 *
 * @example
 * ```tsx
 * <Section id="overview" title="Overview">
 *   <p>Component description...</p>
 * </Section>
 * ```
 */
export interface SectionProps {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}

export function Section({ id, title, children, className }: SectionProps) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

/**
 * SubSection - Nested section component for organizing content within a Section
 *
 * Similar to Section but with smaller heading and additional top margin.
 *
 * @example
 * ```tsx
 * <Section id="props" title="Props Reference">
 *   <SubSection id="core-props" title="Core Props">
 *     <PropsTable props={coreProps} />
 *   </SubSection>
 * </Section>
 * ```
 */
export interface SubSectionProps {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}

export function SubSection({ id, title, children, className }: SubSectionProps) {
  return (
    <div id={id} className={cn('scroll-mt-24 mt-8', className)}>
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}
