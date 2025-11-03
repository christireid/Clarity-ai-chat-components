/**
 * Clarity Chat Codemods
 * Automated code transformations for version migrations
 */

export { runTransform } from './runner.js'
export { availableTransforms } from './transforms/index.js'

export interface TransformOptions {
  dry?: boolean
  print?: boolean
  verbose?: boolean
  parser?: 'babel' | 'tsx' | 'ts'
}

export interface TransformResult {
  ok: number
  nochange: number
  skip: number
  error: number
  timeElapsed: string
}

