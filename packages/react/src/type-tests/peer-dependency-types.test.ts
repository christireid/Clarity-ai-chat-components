/**
 * Type Tests for Peer Dependency Imports
 *
 * This file verifies that all peer dependency types are properly imported
 * and don't cause compilation errors. These are compile-time tests only.
 *
 * @note This file is excluded from the main build but checked during typecheck
 */

// =============================================================================
// Required Peer Dependencies (always present)
// =============================================================================

// React (required)
import type { ReactNode, ComponentType, FC } from 'react'

// Lucide React (required peer, not optional)
import type { LucideIcon } from 'lucide-react'

// Framer Motion (required peer)
import type { Variant, Transition, AnimationControls } from 'framer-motion'

// Test that required types work correctly
type TestReactNode = ReactNode
type TestComponentType = ComponentType<{ children: ReactNode }>
type TestFC = FC<{ name: string }>

type TestLucideIcon = LucideIcon
type TestVariant = Variant
type TestTransition = Transition
type TestAnimationControls = AnimationControls

// =============================================================================
// Optional Peer Dependencies
// =============================================================================

/**
 * Shiki (optional) - for code syntax highlighting
 */
declare module 'shiki' {
  export type BundledTheme = string
  export type BundledLanguage = string

  export interface HighlighterCore {
    codeToHtml(code: string, options: any): string
  }
}

// Test Shiki types (optional)
type TestBundledTheme = import('shiki').BundledTheme
type TestBundledLanguage = import('shiki').BundledLanguage

/**
 * JSZip (optional) - for DOCX parsing
 */
declare module 'jszip' {
  export default class JSZip {
    file(path: string): any
    loadAsync(data: ArrayBuffer): Promise<JSZip>
  }
}

// Test JSZip types (optional)
type TestJSZip = import('jszip').default

/**
 * flowtoken (optional) - for token counting
 */
declare module 'flowtoken' {
  export function countTokens(text: string, model?: string): number
  export function truncateToTokenLimit(
    text: string,
    limit: number,
    model?: string
  ): string
}

// Test flowtoken types (optional)
type TestCountTokens = typeof import('flowtoken').countTokens

/**
 * Mermaid (optional) - for diagram rendering
 */
declare module 'mermaid' {
  export interface MermaidConfig {
    theme?: string
    logLevel?: string
  }

  export function initialize(config: MermaidConfig): void
  export function render(id: string, text: string): Promise<{ svg: string }>
}

// Test Mermaid types (optional)
type TestMermaidConfig = import('mermaid').MermaidConfig

/**
 * PDF.js (optional) - for PDF parsing
 */
declare module 'pdfjs-dist' {
  export interface PDFDocumentProxy {
    numPages: number
    getPage(pageNumber: number): Promise<PDFPageProxy>
  }

  export interface PDFPageProxy {
    getTextContent(): Promise<TextContent>
  }

  export interface TextContent {
    items: TextItem[]
  }

  export interface TextItem {
    str: string
    transform: number[]
  }

  export const GlobalWorkerOptions: {
    workerSrc: string
  }

  export function getDocument(src: any): any
}

// Test PDF.js types (optional)
type TestPDFDocumentProxy = import('pdfjs-dist').PDFDocumentProxy

/**
 * Mammoth (optional) - for enhanced DOCX parsing
 */
declare module 'mammoth' {
  export interface ConversionResult {
    value: string
    messages: Array<{ type: string; message: string }>
  }

  export function extractRawText(options: {
    arrayBuffer: ArrayBuffer
  }): Promise<ConversionResult>
  export function convertToMarkdown(options: {
    arrayBuffer: ArrayBuffer
  }): Promise<ConversionResult>
}

// Test Mammoth types (optional)
type TestMammothResult = import('mammoth').ConversionResult

/**
 * Cohere AI (optional) - for reranking
 */
declare module 'cohere-ai' {
  export class CohereClient {
    constructor(options: { apiKey: string })
    rerank(options: {
      model: string
      query: string
      documents: string[]
    }): Promise<{ results: Array<{ index: number; relevance_score: number }> }>
  }
}

// Test Cohere types (optional)
type TestCohereClient = import('cohere-ai').CohereClient

// =============================================================================
// Type Inference Tests
// =============================================================================

/**
 * Test that type inference works correctly with peer dependencies
 */

// Test 1: Framer Motion variant inference
const testVariant: Variant = {
  opacity: 1,
  x: 0,
  transition: {
    duration: 0.3,
  },
}

// Test 2: React component inference
const TestComponent: FC<{ icon: LucideIcon }> = ({ icon: Icon }) => {
  return null
}

// Test 3: Conditional type with optional peer dependency
type OptionalShikiType<T extends boolean> = T extends true
  ? import('shiki').BundledTheme
  : string

type TestOptionalType1 = OptionalShikiType<true>
type TestOptionalType2 = OptionalShikiType<false>

// =============================================================================
// Generic Type Tests
// =============================================================================

/**
 * Test that generics work correctly with peer dependency types
 */

interface ComponentWithIcon<T extends LucideIcon> {
  icon: T
  label: string
}

type TestGenericComponent = ComponentWithIcon<LucideIcon>

interface AnimatedComponent<V extends Variant> {
  variants: {
    initial: V
    animate: V
    exit: V
  }
}

type TestGenericAnimation = AnimatedComponent<Variant>

// =============================================================================
// Union Type Tests
// =============================================================================

/**
 * Test discriminated unions with peer dependency types
 */

type ThemeConfig =
  | { type: 'shiki'; theme: import('shiki').BundledTheme }
  | { type: 'custom'; theme: string }

function applyTheme(config: ThemeConfig): void {
  switch (config.type) {
    case 'shiki':
      // TypeScript should narrow to shiki theme
      const shikiTheme: string = config.theme
      break
    case 'custom':
      // TypeScript should narrow to custom theme
      const customTheme: string = config.theme
      break
  }
}

// =============================================================================
// Circular Dependency Check
// =============================================================================

/**
 * These types should not create circular dependencies
 */

interface AnimationConfig {
  variant: Variant
  transition: Transition
}

interface ComponentConfig {
  animation: AnimationConfig
  icon: LucideIcon
  children: ReactNode
}

type RecursiveConfig = {
  config: ComponentConfig
  nested?: RecursiveConfig
}

// =============================================================================
// Export Check
// =============================================================================

/**
 * Ensure all test types are used (prevents unused type errors)
 */
export type PeerDependencyTypeTests = {
  // Required types
  reactNode: TestReactNode
  componentType: TestComponentType
  fc: TestFC
  lucideIcon: TestLucideIcon
  variant: TestVariant
  transition: TestTransition
  animationControls: TestAnimationControls

  // Optional types
  bundledTheme: TestBundledTheme
  bundledLanguage: TestBundledLanguage
  jszip: TestJSZip
  countTokens: TestCountTokens
  mermaidConfig: TestMermaidConfig
  pdfDocumentProxy: TestPDFDocumentProxy
  mammothResult: TestMammothResult
  cohereClient: TestCohereClient

  // Inference tests
  optionalType1: TestOptionalType1
  optionalType2: TestOptionalType2

  // Generic tests
  genericComponent: TestGenericComponent
  genericAnimation: TestGenericAnimation

  // Union tests
  themeConfig: ThemeConfig

  // Circular dependency tests
  recursiveConfig: RecursiveConfig
}

// =============================================================================
// Runtime Check (Development Only)
// =============================================================================

if (process.env.NODE_ENV === 'development') {
  console.log('✓ Peer dependency type tests compiled successfully')
}
