import Link from 'next/link'
import { CodeBlock } from './CodeBlock'
import { Callout } from './Callout'
import clsx from 'clsx'

// Custom components to use in MDX files
export const mdxComponents = {
  // Headings with anchor links
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={clsx('scroll-mt-20 text-4xl font-bold mb-4 mt-8 first:mt-0', className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={clsx('scroll-mt-20 text-3xl font-bold mb-3 mt-8 border-b border-border pb-2', className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={clsx('scroll-mt-20 text-2xl font-semibold mb-3 mt-6', className)}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={clsx('scroll-mt-20 text-xl font-semibold mb-2 mt-4', className)}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={clsx('scroll-mt-20 text-lg font-semibold mb-2 mt-4', className)}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={clsx('scroll-mt-20 text-base font-semibold mb-2 mt-4', className)}
      {...props}
    />
  ),

  // Paragraphs
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={clsx('leading-7 [&:not(:first-child)]:mt-4', className)}
      {...props}
    />
  ),

  // Links
  a: ({ className, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith('http')
    const Component = isExternal ? 'a' : Link

    return (
      <Component
        className={clsx(
          'font-medium text-brand-500 hover:text-brand-600 underline underline-offset-4',
          className
        )}
        href={href || '#'}
        {...(isExternal && {
          target: '_blank',
          rel: 'noopener noreferrer',
        })}
        {...props}
      />
    )
  },

  // Lists
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={clsx('my-6 ml-6 list-disc [&>li]:mt-2', className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={clsx('my-6 ml-6 list-decimal [&>li]:mt-2', className)}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={clsx('leading-7', className)} {...props} />
  ),

  // Blockquote
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={clsx(
        'mt-6 border-l-4 border-brand-500 pl-6 italic text-text-secondary [&>p]:my-2',
        className
      )}
      {...props}
    />
  ),

  // Tables
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-x-auto">
      <table
        className={clsx('w-full border-collapse border border-border', className)}
        {...props}
      />
    </div>
  ),
  thead: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
      className={clsx('bg-bg-secondary', className)}
      {...props}
    />
  ),
  tbody: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className={clsx('[&_tr:last-child]:border-0', className)} {...props} />
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={clsx('border-b border-border transition-colors hover:bg-bg-secondary', className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={clsx(
        'px-4 py-3 text-left font-semibold text-text-primary [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={clsx(
        'px-4 py-3 text-text-secondary [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  ),

  // Horizontal rule
  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className={clsx('my-8 border-border', className)} {...props} />
  ),

  // Code blocks
  pre: ({ className, children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    // Extract code content and language from children
    const child = children as any
    const code = child?.props?.children || ''
    const language = child?.props?.className?.replace('language-', '') || 'text'
    
    return (
      <CodeBlock
        code={typeof code === 'string' ? code : ''}
        language={language}
        className={className}
      />
    )
  },

  // Inline code
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={clsx(
        'relative rounded bg-bg-tertiary px-[0.3rem] py-[0.2rem] font-mono text-sm',
        className
      )}
      {...props}
    />
  ),

  // Custom components
  CodeBlock,
  Callout,
}
