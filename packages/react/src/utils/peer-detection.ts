/**
 * Peer Detection Utilities
 *
 * Runtime detection of optional peer dependencies to enable graceful degradation.
 * Components can use these utilities to adapt their behavior based on available peers.
 *
 * PEER DEPENDENCIES: All detected packages are optional peer dependencies
 * - flowtoken: Token counting and optimization
 * - mermaid: Diagram rendering
 * - pdfjs-dist: PDF document parsing
 * - mammoth: DOCX document parsing
 * - cohere-ai: Reranking and embeddings
 * - shiki: Syntax highlighting
 * - jszip: ZIP archive handling
 * - prismjs: Alternative syntax highlighting
 * - react-markdown: Markdown rendering
 * - remark-gfm: GitHub Flavored Markdown
 * - rehype-highlight: Code highlighting for markdown
 *
 * @example
 * ```tsx
 * import { usePeerCapabilities } from '@clarity-chat/react/utils'
 *
 * function MyComponent() {
 *   const capabilities = usePeerCapabilities()
 *
 *   if (capabilities.tokenCounting) {
 *     // Use flowtoken for accurate counting
 *   } else {
 *     // Use fallback estimation
 *   }
 * }
 * ```
 */

'use client'

import * as React from 'react'

/**
 * Capabilities object indicating which optional peers are available
 */
export interface PeerCapabilities {
  /** Token counting with flowtoken (more accurate than estimation) */
  tokenCounting: boolean
  /** Diagram rendering with mermaid */
  diagrams: boolean
  /** PDF document parsing with pdfjs-dist */
  pdfParsing: boolean
  /** DOCX document parsing with mammoth */
  docxParsing: boolean
  /** Reranking and embeddings with cohere-ai */
  reranking: boolean
  /** Syntax highlighting with shiki (preferred over prismjs) */
  syntaxHighlighting: boolean
  /** ZIP archive handling with jszip */
  zipHandling: boolean
  /** Markdown rendering with react-markdown */
  markdown: boolean
  /** GitHub Flavored Markdown support with remark-gfm */
  markdownGfm: boolean
  /** Code highlighting for markdown with rehype-highlight */
  markdownCodeHighlight: boolean
  /** Alternative syntax highlighting with prismjs (fallback for shiki) */
  prismHighlighting: boolean
}

/**
 * Individual peer detection results
 */
interface PeerDetectionResult {
  available: boolean
  module: any
  error?: Error
}

/**
 * Cache for peer detection results to avoid repeated import attempts
 */
const detectionCache = new Map<string, PeerDetectionResult>()

/**
 * In-flight detection promises to prevent concurrent checks
 */
const detectionPromises = new Map<string, Promise<PeerDetectionResult>>()

/**
 * Detect if a peer dependency is available
 * Uses dynamic imports with caching for performance
 *
 * @param packageName - The npm package name to detect
 * @returns Promise with detection result
 */
async function detectPeer(packageName: string): Promise<PeerDetectionResult> {
  // Check cache first
  const cached = detectionCache.get(packageName)
  if (cached) {
    return cached
  }

  // Check if detection is in progress
  const inFlight = detectionPromises.get(packageName)
  if (inFlight) {
    return inFlight
  }

  // Start new detection
  const promise = (async () => {
    try {
      // Attempt dynamic import
      const module = await import(packageName)

      const result: PeerDetectionResult = {
        available: true,
        module: module.default || module,
      }

      // Cache successful detection
      detectionCache.set(packageName, result)
      return result
    } catch (error) {
      // Graceful degradation: Package is optional
      const result: PeerDetectionResult = {
        available: false,
        module: null,
        error: error instanceof Error ? error : new Error(String(error)),
      }

      // Cache failed detection
      detectionCache.set(packageName, result)
      return result
    } finally {
      // Clean up in-flight tracking
      detectionPromises.delete(packageName)
    }
  })()

  detectionPromises.set(packageName, promise)
  return promise
}

/**
 * Detect all optional peer dependencies
 * Results are cached for performance
 *
 * @returns Promise with capabilities object
 */
export async function detectPeerCapabilities(): Promise<PeerCapabilities> {
  // Detect all peers in parallel
  const [
    flowtoken,
    mermaid,
    pdfjsDist,
    mammoth,
    cohereAi,
    shiki,
    jszip,
    prismjs,
    reactMarkdown,
    remarkGfm,
    rehypeHighlight,
  ] = await Promise.all([
    detectPeer('flowtoken'),
    detectPeer('mermaid'),
    detectPeer('pdfjs-dist'),
    detectPeer('mammoth'),
    detectPeer('cohere-ai'),
    detectPeer('shiki'),
    detectPeer('jszip'),
    detectPeer('prismjs'),
    detectPeer('react-markdown'),
    detectPeer('remark-gfm'),
    detectPeer('rehype-highlight'),
  ])

  return {
    tokenCounting: flowtoken.available,
    diagrams: mermaid.available,
    pdfParsing: pdfjsDist.available,
    docxParsing: mammoth.available,
    reranking: cohereAi.available,
    syntaxHighlighting: shiki.available,
    zipHandling: jszip.available,
    markdown: reactMarkdown.available,
    markdownGfm: remarkGfm.available,
    markdownCodeHighlight: rehypeHighlight.available,
    prismHighlighting: prismjs.available,
  }
}

/**
 * Get a specific peer module if available
 * Returns null if the peer is not installed
 *
 * @param packageName - The npm package name to load
 * @returns Promise with the module or null
 *
 * @example
 * ```tsx
 * const mermaid = await getPeerModule('mermaid')
 * if (mermaid) {
 *   // Use mermaid for rendering
 *   await mermaid.initialize(config)
 * }
 * ```
 */
export async function getPeerModule<T = any>(
  packageName: string
): Promise<T | null> {
  const result = await detectPeer(packageName)
  return result.available ? result.module : null
}

/**
 * Check if a specific peer is available (boolean check only)
 * More efficient than getPeerModule when you only need availability
 *
 * @param packageName - The npm package name to check
 * @returns Promise with boolean availability
 *
 * @example
 * ```tsx
 * const hasFlowtoken = await isPeerAvailable('flowtoken')
 * if (hasFlowtoken) {
 *   // Use accurate token counting
 * }
 * ```
 */
export async function isPeerAvailable(packageName: string): Promise<boolean> {
  const result = await detectPeer(packageName)
  return result.available
}

/**
 * Clear the peer detection cache
 * Useful for testing or when dependencies change at runtime
 *
 * @example
 * ```tsx
 * // Clear all cached detections
 * clearPeerCache()
 *
 * // Clear specific package
 * clearPeerCache('flowtoken')
 * ```
 */
export function clearPeerCache(packageName?: string): void {
  if (packageName) {
    detectionCache.delete(packageName)
    detectionPromises.delete(packageName)
  } else {
    detectionCache.clear()
    detectionPromises.clear()
  }
}

/**
 * Get detection statistics for debugging
 * Shows which peers have been detected and their status
 *
 * @returns Object with cache statistics
 *
 * @example
 * ```tsx
 * const stats = getPeerDetectionStats()
 * console.log('Detected peers:', stats.available)
 * console.log('Missing peers:', stats.unavailable)
 * ```
 */
export function getPeerDetectionStats() {
  const stats = {
    total: detectionCache.size,
    available: [] as string[],
    unavailable: [] as string[],
    inFlight: detectionPromises.size,
  }

  for (const [packageName, result] of detectionCache.entries()) {
    if (result.available) {
      stats.available.push(packageName)
    } else {
      stats.unavailable.push(packageName)
    }
  }

  return stats
}

/**
 * React hook for accessing peer capabilities
 * Detects capabilities on mount and provides loading state
 *
 * @returns Object with capabilities and loading state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { capabilities, isLoading } = usePeerCapabilities()
 *
 *   if (isLoading) {
 *     return <div>Loading capabilities...</div>
 *   }
 *
 *   return (
 *     <div>
 *       {capabilities.diagrams ? (
 *         <MermaidDiagram />
 *       ) : (
 *         <FallbackTextDiagram />
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function usePeerCapabilities() {
  const [capabilities, setCapabilities] =
    React.useState<PeerCapabilities | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    let mounted = true

    detectPeerCapabilities()
      .then((caps) => {
        if (mounted) {
          setCapabilities(caps)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setIsLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return {
    capabilities,
    isLoading,
    error,
  }
}

/**
 * React hook for checking a specific peer availability
 * More efficient than usePeerCapabilities when you only need one peer
 *
 * @param packageName - The npm package name to check
 * @returns Object with availability and loading state
 *
 * @example
 * ```tsx
 * function TokenCounter() {
 *   const { available: hasFlowtoken, isLoading } = usePeerAvailable('flowtoken')
 *
 *   if (isLoading) return <Skeleton />
 *
 *   return hasFlowtoken ? (
 *     <AccurateTokenCount />
 *   ) : (
 *     <EstimatedTokenCount />
 *   )
 * }
 * ```
 */
export function usePeerAvailable(packageName: string) {
  const [available, setAvailable] = React.useState<boolean | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    let mounted = true

    isPeerAvailable(packageName)
      .then((isAvailable) => {
        if (mounted) {
          setAvailable(isAvailable)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setIsLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [packageName])

  return {
    available,
    isLoading,
    error,
  }
}

/**
 * React hook for loading a specific peer module
 * Returns the module if available, null otherwise
 *
 * @param packageName - The npm package name to load
 * @returns Object with module, availability, and loading state
 *
 * @example
 * ```tsx
 * function DiagramRenderer({ diagram }: Props) {
 *   const { module: mermaid, available, isLoading } = usePeerModule('mermaid')
 *
 *   React.useEffect(() => {
 *     if (mermaid) {
 *       mermaid.initialize({ theme: 'dark' })
 *     }
 *   }, [mermaid])
 *
 *   if (isLoading) return <Skeleton />
 *   if (!available) return <PlainTextDiagram />
 *
 *   return <MermaidDiagram code={diagram} />
 * }
 * ```
 */
export function usePeerModule<T = any>(packageName: string) {
  const [module, setModule] = React.useState<T | null>(null)
  const [available, setAvailable] = React.useState<boolean | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    let mounted = true

    getPeerModule<T>(packageName)
      .then((mod) => {
        if (mounted) {
          setModule(mod)
          setAvailable(mod !== null)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setAvailable(false)
          setIsLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [packageName])

  return {
    module,
    available,
    isLoading,
    error,
  }
}

/**
 * Generate installation instructions for missing peers
 * Useful for displaying user-friendly messages
 *
 * @param capabilities - The capabilities object from usePeerCapabilities
 * @returns Object with missing packages and installation commands
 *
 * @example
 * ```tsx
 * function SetupGuide() {
 *   const { capabilities } = usePeerCapabilities()
 *
 *   if (!capabilities) return null
 *
 *   const instructions = getInstallationInstructions(capabilities)
 *
 *   return (
 *     <div>
 *       <h3>Missing Optional Dependencies</h3>
 *       <code>{instructions.npm}</code>
 *       <code>{instructions.pnpm}</code>
 *     </div>
 *   )
 * }
 * ```
 */
export function getInstallationInstructions(capabilities: PeerCapabilities) {
  const missing: string[] = []

  // Map capabilities to package names
  const capabilityMap: Record<keyof PeerCapabilities, string> = {
    tokenCounting: 'flowtoken',
    diagrams: 'mermaid',
    pdfParsing: 'pdfjs-dist',
    docxParsing: 'mammoth',
    reranking: 'cohere-ai',
    syntaxHighlighting: 'shiki',
    zipHandling: 'jszip',
    markdown: 'react-markdown',
    markdownGfm: 'remark-gfm',
    markdownCodeHighlight: 'rehype-highlight',
    prismHighlighting: 'prismjs',
  }

  // Collect missing packages
  for (const [capability, packageName] of Object.entries(capabilityMap)) {
    if (!capabilities[capability as keyof PeerCapabilities]) {
      missing.push(packageName)
    }
  }

  return {
    missing,
    npm: missing.length > 0 ? `npm install ${missing.join(' ')}` : null,
    pnpm: missing.length > 0 ? `pnpm add ${missing.join(' ')}` : null,
    yarn: missing.length > 0 ? `yarn add ${missing.join(' ')}` : null,
  }
}
