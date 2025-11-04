'use client'

import * as React from 'react'
import { ThemeProvider } from 'next-themes'
import { MDXProvider } from '@mdx-js/react'
import { mdxComponents } from '@/components/MDX/mdx-components'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // @ts-expect-error - next-themes has type incompatibility with React 19
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MDXProvider components={mdxComponents}>{children}</MDXProvider>
    </ThemeProvider>
  )
}
