/**
 * Peer Dependency Type Definitions
 *
 * This module provides type-safe interfaces for detecting and handling
 * optional peer dependencies at runtime.
 *
 * @module peer-dependencies
 * @since 2.0.0
 */

/**
 * Required peer dependencies that must be installed
 * @category Required Peer Dependencies
 */
export interface RequiredPeerDependencies {
  /** React core library */
  react: '^18.0.0 || ^19.0.0'
  /** Framer Motion for animations */
  'framer-motion': '^12.23.25'
  /** Lucide React icon library */
  'lucide-react': '^0.500.0'
  /** Zod validation library */
  zod: '^3.24.0'
}

/**
 * Optional peer dependencies for enhanced features
 * @category Optional Peer Dependencies
 */
export interface OptionalPeerDependencies {
  /** React DOM for client-side rendering */
  'react-dom'?: '^18.0.0 || ^19.0.0'
  /** FlowToken for accurate token counting */
  flowtoken?: '^1.0.0'
  /** Mermaid for diagram rendering */
  mermaid?: '^11.0.0'
  /** PDF.js for PDF parsing */
  'pdfjs-dist'?: '^3.0.0 || ^4.0.0'
  /** Mammoth for DOCX parsing */
  mammoth?: '^1.0.0'
  /** Cohere AI for reranking */
  'cohere-ai'?: '^7.0.0'
  /** Shiki for syntax highlighting */
  shiki?: '^3.0.0'
  /** JSZip for ZIP file creation */
  jszip?: '^3.10.0'
  /** Prism.js for syntax highlighting */
  prismjs?: '^1.29.0'
  /** React Markdown for markdown rendering */
  'react-markdown'?: '^10.0.0'
  /** Remark GFM for GitHub Flavored Markdown */
  'remark-gfm'?: '^4.0.0'
  /** Rehype Highlight for code highlighting in markdown */
  'rehype-highlight'?: '^7.0.0'
}

/**
 * Feature flags based on available peer dependencies
 * @category Utilities
 */
export interface PeerDependencyFeatures {
  /** Whether markdown rendering is available */
  hasMarkdown: boolean
  /** Whether syntax highlighting is available */
  hasSyntaxHighlighting: boolean
  /** Whether PDF parsing is available */
  hasPDFSupport: boolean
  /** Whether DOCX parsing is available */
  hasDOCXSupport: boolean
  /** Whether accurate token counting is available */
  hasAccurateTokenCounting: boolean
  /** Whether reranking is available */
  hasReranking: boolean
  /** Whether ZIP export is available */
  hasZipExport: boolean
  /** Whether diagram rendering is available */
  hasDiagramSupport: boolean
}

/**
 * Component peer dependency requirements
 * @category Types
 */
export interface ComponentPeerRequirements {
  /** Component name */
  component: string
  /** Required peer dependencies */
  required: Array<keyof RequiredPeerDependencies>
  /** Optional peer dependencies that enhance functionality */
  optional: Array<keyof OptionalPeerDependencies>
  /** Fallback behavior when optional peers are missing */
  fallback?: string
}

/**
 * Peer dependency detection result
 * @category Types
 */
export interface PeerDependencyStatus {
  /** Package name */
  package: string
  /** Whether the package is installed */
  installed: boolean
  /** Detected version (if installed) */
  version?: string
  /** Whether the version is compatible */
  compatible?: boolean
  /** Reason for incompatibility (if applicable) */
  incompatibilityReason?: string
}

/**
 * Complete peer dependency check result
 * @category Types
 */
export interface PeerDependencyCheck {
  /** All required dependencies present and compatible */
  allRequiredPresent: boolean
  /** Status of each required dependency */
  required: Record<keyof RequiredPeerDependencies, PeerDependencyStatus>
  /** Status of each optional dependency */
  optional: Record<keyof OptionalPeerDependencies, PeerDependencyStatus>
  /** Available features based on installed dependencies */
  features: PeerDependencyFeatures
  /** Missing required dependencies */
  missingRequired: string[]
  /** Missing optional dependencies that would enable features */
  missingOptional: string[]
  /** Installation instructions for missing dependencies */
  installInstructions?: string
}

/**
 * Peer dependency fallback configuration
 * @category Types
 */
export interface PeerDependencyFallback {
  /** Feature that requires the peer dependency */
  feature: string
  /** Peer dependency package name */
  peer: keyof OptionalPeerDependencies
  /** Fallback behavior when peer is missing */
  fallback: 'disable' | 'degraded' | 'warning' | 'error'
  /** Message to show when using fallback */
  message: string
  /** Alternative peer dependencies that could be used */
  alternatives?: Array<keyof OptionalPeerDependencies>
}

/**
 * Runtime peer dependency checker
 * @category Utilities
 */
export class PeerDependencyChecker {
  private static cache: Map<string, boolean> = new Map()

  /**
   * Check if a peer dependency is available
   * @param packageName - Name of the package to check
   * @returns true if the package is available
   *
   * @example
   * ```tsx
   * if (PeerDependencyChecker.isAvailable('react-markdown')) {
   *   // Use markdown renderer
   * } else {
   *   // Use plain text fallback
   * }
   * ```
   */
  static isAvailable(packageName: string): boolean {
    if (this.cache.has(packageName)) {
      return this.cache.get(packageName)!
    }

    try {
      require.resolve(packageName)
      this.cache.set(packageName, true)
      return true
    } catch {
      this.cache.set(packageName, false)
      return false
    }
  }

  /**
   * Check all required peer dependencies
   * @returns Status of all required dependencies
   */
  static checkRequired(): Record<
    keyof RequiredPeerDependencies,
    PeerDependencyStatus
  > {
    const required: Array<keyof RequiredPeerDependencies> = [
      'react',
      'framer-motion',
      'lucide-react',
      'zod',
    ]

    return required.reduce(
      (acc, pkg) => {
        acc[pkg] = {
          package: pkg,
          installed: this.isAvailable(pkg),
        }
        return acc
      },
      {} as Record<keyof RequiredPeerDependencies, PeerDependencyStatus>
    )
  }

  /**
   * Check all optional peer dependencies
   * @returns Status of all optional dependencies
   */
  static checkOptional(): Record<
    keyof OptionalPeerDependencies,
    PeerDependencyStatus
  > {
    const optional: Array<keyof OptionalPeerDependencies> = [
      'react-dom',
      'flowtoken',
      'mermaid',
      'pdfjs-dist',
      'mammoth',
      'cohere-ai',
      'shiki',
      'jszip',
      'prismjs',
      'react-markdown',
      'remark-gfm',
      'rehype-highlight',
    ]

    return optional.reduce(
      (acc, pkg) => {
        acc[pkg] = {
          package: pkg,
          installed: this.isAvailable(pkg),
        }
        return acc
      },
      {} as Record<keyof OptionalPeerDependencies, PeerDependencyStatus>
    )
  }

  /**
   * Perform a complete peer dependency check
   * @returns Complete check results with features and missing dependencies
   *
   * @example
   * ```tsx
   * const check = PeerDependencyChecker.checkAll()
   * if (!check.allRequiredPresent) {
   *   console.error('Missing required dependencies:', check.missingRequired)
   *   console.log(check.installInstructions)
   * }
   * if (check.features.hasMarkdown) {
   *   // Enable markdown features
   * }
   * ```
   */
  static checkAll(): PeerDependencyCheck {
    const required = this.checkRequired()
    const optional = this.checkOptional()

    const missingRequired = Object.entries(required)
      .filter(([, status]) => !status.installed)
      .map(([pkg]) => pkg)

    const missingOptional = Object.entries(optional)
      .filter(([, status]) => !status.installed)
      .map(([pkg]) => pkg)

    const features: PeerDependencyFeatures = {
      hasMarkdown: this.isAvailable('react-markdown'),
      hasSyntaxHighlighting:
        this.isAvailable('shiki') || this.isAvailable('prismjs'),
      hasPDFSupport: this.isAvailable('pdfjs-dist'),
      hasDOCXSupport: this.isAvailable('mammoth'),
      hasAccurateTokenCounting: this.isAvailable('flowtoken'),
      hasReranking: this.isAvailable('cohere-ai'),
      hasZipExport: this.isAvailable('jszip'),
      hasDiagramSupport: this.isAvailable('mermaid'),
    }

    const installInstructions =
      missingRequired.length > 0
        ? `Install required dependencies:\nnpm install ${missingRequired.join(' ')}`
        : undefined

    return {
      allRequiredPresent: missingRequired.length === 0,
      required,
      optional,
      features,
      missingRequired,
      missingOptional,
      installInstructions,
    }
  }

  /**
   * Clear the peer dependency cache
   * Useful for testing or when dependencies change at runtime
   */
  static clearCache(): void {
    this.cache.clear()
  }
}

/**
 * Component to peer dependency mapping
 * @category Component Requirements
 */
export const COMPONENT_PEER_REQUIREMENTS: ComponentPeerRequirements[] = [
  {
    component: 'ClarityChat',
    required: ['react', 'framer-motion', 'lucide-react', 'zod'],
    optional: [],
    fallback: 'Not applicable - all dependencies are required',
  },
  {
    component: 'ChatWindow',
    required: ['react', 'framer-motion', 'lucide-react', 'zod'],
    optional: ['react-markdown', 'remark-gfm'],
    fallback: 'Markdown renders as plain text',
  },
  {
    component: 'EnhancedMarkdownRenderer',
    required: ['react', 'framer-motion'],
    optional: ['react-markdown', 'remark-gfm', 'rehype-highlight'],
    fallback: 'Plain text with basic formatting',
  },
  {
    component: 'CodeBlock',
    required: ['react'],
    optional: ['shiki', 'prismjs'],
    fallback: 'Plain text code block',
  },
  {
    component: 'DocumentIntegration',
    required: ['react', 'framer-motion', 'lucide-react'],
    optional: ['pdfjs-dist', 'mammoth'],
    fallback: 'Shows warning for unsupported file types',
  },
  {
    component: 'TokenBudgetBar',
    required: ['react', 'framer-motion'],
    optional: ['flowtoken'],
    fallback: 'Character-based token estimation (~75% accurate)',
  },
  {
    component: 'SemanticMessageSearch',
    required: ['react', 'framer-motion', 'lucide-react'],
    optional: ['cohere-ai'],
    fallback: 'Vector similarity without reranking',
  },
  {
    component: 'BatchExportDialog',
    required: ['react', 'framer-motion', 'lucide-react'],
    optional: ['jszip'],
    fallback: 'Individual file downloads instead of ZIP',
  },
  {
    component: 'MessageList',
    required: ['react', 'framer-motion', 'zod'],
    optional: [],
  },
  {
    component: 'ChatInput',
    required: ['react', 'framer-motion', 'lucide-react', 'zod'],
    optional: [],
  },
  {
    component: 'StreamingMessage',
    required: ['react', 'framer-motion'],
    optional: ['react-markdown'],
    fallback: 'Plain text streaming',
  },
  {
    component: 'TypingIndicator',
    required: ['react', 'framer-motion'],
    optional: [],
  },
]

/**
 * Hook to peer dependency mapping
 * @category Hook Requirements
 */
export const HOOK_PEER_REQUIREMENTS: ComponentPeerRequirements[] = [
  {
    component: 'useClarityChat',
    required: ['react', 'zod'],
    optional: [],
  },
  {
    component: 'useTokenBudgetMonitor',
    required: ['react'],
    optional: ['flowtoken'],
    fallback: 'Character-based estimation',
  },
  {
    component: 'useRAGPipeline',
    required: ['react', 'zod'],
    optional: ['pdfjs-dist', 'mammoth', 'cohere-ai'],
    fallback: 'Limited to supported document types',
  },
  {
    component: 'useSemanticCache',
    required: ['react'],
    optional: [],
  },
  {
    component: 'useAgent',
    required: ['react', 'zod'],
    optional: [],
  },
]

/**
 * Feature to peer dependency mapping
 * @category Feature Requirements
 */
export const FEATURE_PEER_REQUIREMENTS: Record<
  string,
  {
    peers: Array<keyof OptionalPeerDependencies>
    description: string
    fallback: string
  }
> = {
  markdown: {
    peers: ['react-markdown', 'remark-gfm'],
    description: 'Rich markdown rendering with GitHub Flavored Markdown',
    fallback: 'Plain text with basic formatting',
  },
  syntaxHighlighting: {
    peers: ['shiki', 'prismjs'],
    description: 'Code syntax highlighting with themes',
    fallback: 'Plain text code blocks',
  },
  pdfLoading: {
    peers: ['pdfjs-dist'],
    description: 'PDF document parsing and text extraction',
    fallback: 'File upload shows warning',
  },
  docxLoading: {
    peers: ['mammoth'],
    description: 'DOCX document parsing',
    fallback: 'File upload shows warning',
  },
  tokenCounting: {
    peers: ['flowtoken'],
    description: 'Accurate token counting for various models',
    fallback: 'Character-based estimation (4 chars ≈ 1 token)',
  },
  reranking: {
    peers: ['cohere-ai'],
    description: 'Semantic search result reranking',
    fallback: 'Vector similarity only',
  },
  zipExport: {
    peers: ['jszip'],
    description: 'Batch export to ZIP file',
    fallback: 'Individual file downloads',
  },
  diagrams: {
    peers: ['mermaid'],
    description: 'Diagram rendering from markdown',
    fallback: 'Plain text code block',
  },
}

/**
 * Get peer dependency requirements for a component
 * @param componentName - Name of the component
 * @returns Peer dependency requirements or undefined
 *
 * @example
 * ```tsx
 * const reqs = getComponentRequirements('ChatWindow')
 * console.log('Required:', reqs.required)
 * console.log('Optional:', reqs.optional)
 * console.log('Fallback:', reqs.fallback)
 * ```
 */
export function getComponentRequirements(
  componentName: string
): ComponentPeerRequirements | undefined {
  return COMPONENT_PEER_REQUIREMENTS.find(
    (req) => req.component === componentName
  )
}

/**
 * Get peer dependency requirements for a hook
 * @param hookName - Name of the hook
 * @returns Peer dependency requirements or undefined
 */
export function getHookRequirements(
  hookName: string
): ComponentPeerRequirements | undefined {
  return HOOK_PEER_REQUIREMENTS.find((req) => req.component === hookName)
}

/**
 * Get missing peer dependencies for a feature
 * @param feature - Feature name
 * @returns Array of missing peer dependencies
 *
 * @example
 * ```tsx
 * const missing = getMissingPeersForFeature('markdown')
 * if (missing.length > 0) {
 *   console.log(`Install: npm install ${missing.join(' ')}`)
 * }
 * ```
 */
export function getMissingPeersForFeature(feature: string): string[] {
  const featureReq = FEATURE_PEER_REQUIREMENTS[feature]
  if (!featureReq) return []

  return featureReq.peers.filter(
    (peer) => !PeerDependencyChecker.isAvailable(peer)
  )
}

/**
 * Get installation command for missing peers
 * @param packageManager - Package manager to use (npm, pnpm, yarn)
 * @param peers - Array of peer dependency names
 * @returns Installation command string
 *
 * @example
 * ```tsx
 * const missing = getMissingPeersForFeature('markdown')
 * const cmd = getInstallCommand('pnpm', missing)
 * console.log(cmd) // "pnpm add react-markdown remark-gfm"
 * ```
 */
export function getInstallCommand(
  packageManager: 'npm' | 'pnpm' | 'yarn',
  peers: string[]
): string {
  if (peers.length === 0) return ''

  const cmd = {
    npm: 'npm install',
    pnpm: 'pnpm add',
    yarn: 'yarn add',
  }[packageManager]

  return `${cmd} ${peers.join(' ')}`
}

/**
 * Validate peer dependencies and show warnings
 * @param componentName - Name of component to validate
 * @param showWarnings - Whether to console.warn for missing optional peers
 * @returns Validation result
 *
 * @example
 * ```tsx
 * const result = validatePeerDependencies('ChatWindow', true)
 * if (!result.valid) {
 *   throw new Error(result.message)
 * }
 * ```
 */
export function validatePeerDependencies(
  componentName: string,
  showWarnings = true
): { valid: boolean; message: string; missing: string[] } {
  const reqs = getComponentRequirements(componentName)
  if (!reqs) {
    return { valid: true, message: '', missing: [] }
  }

  const missing = reqs.required.filter(
    (peer) => !PeerDependencyChecker.isAvailable(peer)
  )

  if (missing.length > 0) {
    const message = `${componentName} requires: ${missing.join(', ')}\nInstall with: npm install ${missing.join(' ')}`
    return { valid: false, message, missing }
  }

  if (showWarnings) {
    const missingOptional = reqs.optional.filter(
      (peer) => !PeerDependencyChecker.isAvailable(peer)
    )

    if (missingOptional.length > 0) {
      console.warn(
        `${componentName}: Optional dependencies not found: ${missingOptional.join(', ')}\n` +
          `Fallback: ${reqs.fallback}\n` +
          `Install with: npm install ${missingOptional.join(' ')}`
      )
    }
  }

  return { valid: true, message: '', missing: [] }
}
