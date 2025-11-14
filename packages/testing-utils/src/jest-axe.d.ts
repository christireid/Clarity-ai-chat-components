declare module 'jest-axe' {
  import { AxeResults, RunOptions } from 'axe-core'

  export function axe(
    htmlOrNode: string | Node,
    options?: RunOptions
  ): Promise<AxeResults>

  export function toHaveNoViolations(): jest.CustomMatcherResult

  export const configureAxe: (options?: RunOptions) => typeof axe
}
