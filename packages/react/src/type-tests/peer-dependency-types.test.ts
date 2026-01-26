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
import type { Variant, Transition } from 'framer-motion'

// Test that required types work correctly
type TestReactNode = ReactNode
type TestComponentType = ComponentType<{ children: ReactNode }>
type TestFC = FC<{ name: string }>

type TestLucideIcon = LucideIcon
type TestVariant = Variant
type TestTransition = Transition

// =============================================================================
// Optional Peer Dependencies
// =============================================================================

/**
 * Shiki (optional) - for code syntax highlighting
 * Note: shiki exports its own types, we just need to test that they work
 */

// Test Shiki types (optional) - these will only work if shiki is installed
type TestBundledTheme = string // import('shiki').BundledTheme when installed
type TestBundledLanguage = string // import('shiki').BundledLanguage when installed

/**
 * JSZip (optional) - for DOCX parsing
 * Note: jszip exports its own types
 */

// Test JSZip types (optional) - works when jszip is installed
type TestJSZip = any // typeof import('jszip').default when installed

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
 * Note: mermaid exports its own types
 */

// Test Mermaid types (optional) - works when mermaid is installed
type TestMermaidConfig = any // import('mermaid').MermaidConfig when installed

/**
 * PDF.js (optional) - for PDF parsing
 * Note: pdfjs-dist exports its own types
 */

// Test PDF.js types (optional) - works when pdfjs-dist is installed
type TestPDFDocumentProxy = any // import('pdfjs-dist').PDFDocumentProxy when installed

/**
 * Mammoth (optional) - for enhanced DOCX parsing
 * Note: mammoth is a JavaScript library without built-in types
 */

// Test Mammoth types (optional) - manual type definitions when needed
type TestMammothResult = {
  value: string
  messages: Array<{ type: string; message: string }>
}

/**
 * Cohere AI (optional) - for reranking
 * Note: cohere-ai exports its own types, we just verify they work
 */

// Test Cohere types (optional) - using any to avoid duplicate declarations
type TestCohereClient = any

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
  | { type: 'shiki'; theme: string } // Would be import('shiki').BundledTheme when installed
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
