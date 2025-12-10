/**
 * Types for API extraction from TypeScript source files
 */

/** Kind of exported API element */
export type APIKind =
  | 'function'
  | 'component'
  | 'hook'
  | 'type'
  | 'interface'
  | 'const'
  | 'class'
  | 'enum'

/** Information about a function/method parameter */
export interface ParameterInfo {
  /** Parameter name */
  name: string
  /** TypeScript type as string */
  type: string
  /** Description from JSDoc @param */
  description: string
  /** Whether the parameter is required */
  required: boolean
  /** Default value if optional */
  default?: string
}

/** Information about a component prop */
export interface PropInfo {
  /** Prop name */
  name: string
  /** TypeScript type as string */
  type: string
  /** Description from JSDoc comment */
  description: string
  /** Whether the prop is required */
  required: boolean
  /** Default value if optional */
  default?: string
}

/** Information about a property in an object type */
export interface PropertyInfo {
  /** Property name */
  name: string
  /** TypeScript type as string */
  type: string
  /** Description from JSDoc */
  description: string
  /** Whether the property is optional */
  optional: boolean
}

/** Information about a return type */
export interface ReturnInfo {
  /** TypeScript type as string */
  type: string
  /** Description from JSDoc @returns */
  description: string
  /** Properties if return type is an object (e.g., hook return) */
  properties?: PropertyInfo[]
}

/** Information about a type parameter (generic) */
export interface TypeParameterInfo {
  /** Type parameter name (e.g., T, K) */
  name: string
  /** Constraint (extends clause) */
  constraint?: string
  /** Default type */
  default?: string
  /** Description from JSDoc */
  description?: string
}

/** Extracted API information */
export interface ExtractedAPI {
  /** Export name */
  name: string
  /** Kind of API element */
  kind: APIKind
  /** Full type signature */
  signature: string
  /** Description from JSDoc */
  description: string
  /** Function/method parameters */
  parameters?: ParameterInfo[]
  /** Return type info */
  returns?: ReturnInfo
  /** Component props (for React components) */
  props?: PropInfo[]
  /** Type parameters (generics) */
  typeParameters?: TypeParameterInfo[]
  /** Usage examples from JSDoc @example */
  examples?: string[]
  /** Version when added (@since) */
  since?: string
  /** Deprecation notice */
  deprecated?: string
  /** Related APIs (@see) */
  see?: string[]
  /** Source file path (relative) */
  filePath: string
  /** Package this is exported from */
  exportedFrom: string
  /** Whether this is a default export */
  isDefault: boolean
  /** Line number in source file */
  line: number
  /** Tags from JSDoc */
  tags?: Record<string, string>
}

/** API extraction configuration */
export interface ExtractionConfig {
  /** Root path of the package */
  packagePath: string
  /** Entry points to analyze (e.g., ['src/index.ts']) */
  entryPoints: string[]
  /** Include internal APIs */
  includeInternal: boolean
  /** Include private APIs */
  includePrivate: boolean
  /** Package name */
  packageName: string
}

/** Result of API extraction for a package */
export interface ExtractionResult {
  /** Package name */
  packageName: string
  /** Package version */
  version: string
  /** Extracted APIs */
  apis: ExtractedAPI[]
  /** Extraction timestamp */
  extractedAt: string
  /** Any errors encountered */
  errors: ExtractedError[]
}

/** Error during extraction */
export interface ExtractedError {
  /** File where error occurred */
  file: string
  /** Line number if available */
  line?: number
  /** Error message */
  message: string
  /** Error code */
  code?: string
}

/** Cache entry for extracted APIs */
export interface APICacheEntry {
  /** File path */
  filePath: string
  /** Content hash */
  contentHash: string
  /** Extracted APIs from this file */
  apis: ExtractedAPI[]
  /** Cache timestamp */
  cachedAt: string
}

/** Full API cache */
export interface APICache {
  /** Version of cache format */
  version: number
  /** Cache entries by file path */
  entries: Record<string, APICacheEntry>
  /** Last full extraction timestamp */
  lastFullExtraction?: string
}
