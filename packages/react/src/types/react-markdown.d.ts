/**
 * Type declaration for react-markdown to fix TypeScript JSX component issues
 */
declare module 'react-markdown' {
  import { ReactElement, ReactNode, ComponentType } from 'react'
  import type { PluggableList } from 'unified'

  export interface Options {
    children?: string
    remarkPlugins?: PluggableList
    rehypePlugins?: PluggableList
    components?: Record<string, ComponentType<any>>
    [key: string]: any
  }

  export type Components = Record<string, ComponentType<any>>

  export default function ReactMarkdown(options: Options): ReactElement
}
