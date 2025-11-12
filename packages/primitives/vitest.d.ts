/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom'
import type { AxeMatchers } from 'vitest-axe/matchers'

declare module 'vitest' {
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}

declare module 'vitest-axe/matchers' {
  export function toHaveNoViolations(results: any): any
  export interface AxeMatchers {
    toHaveNoViolations(): void
  }
}
