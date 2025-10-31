'use client'

import { ThemeProvider } from 'next-themes'
import { MDXProvider } from '@mdx-js/react'
import { mdxComponents } from '@/components/MDX/mdx-components'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MDXProvider components={mdxComponents}>{children}</MDXProvider>
    </ThemeProvider>
  )
}
