import '@testing-library/jest-dom'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import type { AxeMatchers } from 'vitest-axe/matchers'

declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void>, AxeMatchers {}
  interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {}
}
