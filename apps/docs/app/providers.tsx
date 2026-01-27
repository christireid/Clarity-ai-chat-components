'use client'

import * as React from 'react'
import { ThemeProvider } from 'next-themes'
import { MDXProvider } from '@mdx-js/react'
// import { ToastProvider } from '@clarity-chat/react'
import { mdxComponents } from '@/components/MDX/mdx-components'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* TODO: Add ToastProvider once it's exported from @clarity-chat/react */}
      {/* <ToastProvider position="top-right" defaultDuration={4000}> */}
      <MDXProvider components={mdxComponents}>{children}</MDXProvider>
      {/* </ToastProvider> */}
    </ThemeProvider>
  )
}
