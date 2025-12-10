/**
 * API Extraction Engine
 *
 * Extracts API information from TypeScript source files using the TypeScript Compiler API
 */

import { readFileSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'
import { glob } from 'glob'
import ts from 'typescript'
import type {
  APICache,
  APIKind,
  ExtractionConfig,
  ExtractionResult,
  ExtractedAPI,
  ExtractedError,
  ParameterInfo,
  PropInfo,
  PropertyInfo,
  ReturnInfo,
  TypeParameterInfo,
} from './types/index.js'
import {
  createProgram,
  formatTypeForDisplay,
  getExportedSymbols,
  getFunctionParameters,
  getJSDocComment,
  getJSDocExamples,
  getJSDocParams,
  getJSDocReturns,
  getJSDocTags,
  getLineNumber,
  getReturnType,
  getTypeProperties,
  getTypeString,
  isExternalLibrary,
  isHookName,
} from './utils/typescript.js'
import {
  getFileHash,
  isCacheValid,
  getCachedAPIs,
  setCacheEntry,
} from './utils/cache.js'

/** Determine API kind from symbol and type */
function determineKind(
  symbol: ts.Symbol,
  type: ts.Type,
  checker: ts.TypeChecker,
  name: string
): APIKind {
  // Check if it's a hook
  if (isHookName(name)) {
    return 'hook'
  }

  // Check declarations
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0]

  if (declaration) {
    if (ts.isClassDeclaration(declaration)) {
      return 'class'
    }

    if (ts.isEnumDeclaration(declaration)) {
      return 'enum'
    }

    if (ts.isInterfaceDeclaration(declaration)) {
      return 'interface'
    }

    if (ts.isTypeAliasDeclaration(declaration)) {
      return 'type'
    }

    if (ts.isFunctionDeclaration(declaration)) {
      return 'function'
    }

    if (ts.isVariableDeclaration(declaration)) {
      // Check if it's a React component
      const typeString = getTypeString(type, checker)
      if (
        typeString.includes('FC<') ||
        typeString.includes('FunctionComponent') ||
        typeString.includes('React.FC') ||
        typeString.includes('ForwardRefExoticComponent') ||
        (typeString.includes('=>') && typeString.includes('JSX.Element'))
      ) {
        return 'component'
      }

      // Check if it's a function
      if (type.getCallSignatures().length > 0) {
        return 'function'
      }

      return 'const'
    }
  }

  // Check type characteristics
  if (type.getCallSignatures().length > 0) {
    return 'function'
  }

  return 'const'
}

/** Extract parameter info from a signature */
function extractParameters(
  signature: ts.Signature,
  checker: ts.TypeChecker,
  paramDocs: Map<string, string>
): ParameterInfo[] {
  const params = getFunctionParameters(signature, checker)

  return params.map((param) => ({
    name: param.name,
    type: formatTypeForDisplay(param.type),
    description: paramDocs.get(param.name) ?? '',
    required: !param.optional,
    default: param.defaultValue,
  }))
}

/** Extract return info from a signature */
function extractReturnInfo(
  signature: ts.Signature,
  checker: ts.TypeChecker,
  returnDoc: string | null
): ReturnInfo | undefined {
  const returnType = signature.getReturnType()
  const typeString = getReturnType(signature, checker)

  // Skip void returns
  if (typeString === 'void') {
    return undefined
  }

  // Get properties if return is an object
  let properties: PropertyInfo[] | undefined
  if (
    returnType.isClassOrInterface() ||
    returnType.flags & ts.TypeFlags.Object
  ) {
    const props = getTypeProperties(returnType, checker)
    if (props.length > 0 && props.length <= 20) {
      // Limit to reasonable number
      properties = props.map((p) => ({
        name: p.name,
        type: formatTypeForDisplay(p.type),
        description: p.documentation,
        optional: p.optional,
      }))
    }
  }

  return {
    type: formatTypeForDisplay(typeString),
    description: returnDoc ?? '',
    properties,
  }
}

/** Extract props from a component's props type */
function extractComponentProps(
  type: ts.Type,
  checker: ts.TypeChecker
): PropInfo[] {
  // Get the first call signature to find the props parameter
  const signatures = type.getCallSignatures()
  if (signatures.length === 0) return []

  const signature = signatures[0]
  if (!signature) return []

  const params = signature.getParameters()
  if (params.length === 0) return []

  // First parameter is props
  const propsParam = params[0]
  if (!propsParam) return []

  const propsDeclaration = propsParam.valueDeclaration
  if (!propsDeclaration) return []

  const propsType = checker.getTypeOfSymbolAtLocation(
    propsParam,
    propsDeclaration
  )
  const properties = getTypeProperties(propsType, checker)

  return properties.map((p) => ({
    name: p.name,
    type: formatTypeForDisplay(p.type),
    description: p.documentation,
    required: !p.optional,
  }))
}

/** Extract type parameters (generics) */
function extractTypeParameters(declaration: ts.Node): TypeParameterInfo[] {
  let typeParams: ts.NodeArray<ts.TypeParameterDeclaration> | undefined

  if (
    ts.isFunctionDeclaration(declaration) ||
    ts.isClassDeclaration(declaration) ||
    ts.isInterfaceDeclaration(declaration) ||
    ts.isTypeAliasDeclaration(declaration)
  ) {
    typeParams = declaration.typeParameters
  }

  if (!typeParams) return []

  return typeParams.map((tp) => ({
    name: tp.name.getText(),
    constraint: tp.constraint?.getText(),
    default: tp.default?.getText(),
  }))
}

/** Get the full signature string for display */
function getDisplaySignature(
  symbol: ts.Symbol,
  type: ts.Type,
  checker: ts.TypeChecker,
  kind: APIKind
): string {
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0]

  if (kind === 'interface' || kind === 'type') {
    if (declaration) {
      // Get the full declaration text
      const sourceFile = declaration.getSourceFile()
      const text = sourceFile.text
        .slice(declaration.pos, declaration.end)
        .trim()
      // Clean up and limit length
      const cleaned = text.replace(/\/\*[\s\S]*?\*\//g, '').trim()
      if (cleaned.length <= 500) {
        return cleaned
      }
    }
    return getTypeString(type, checker)
  }

  if (kind === 'enum') {
    return getTypeString(type, checker)
  }

  const signatures = type.getCallSignatures()
  if (signatures.length > 0) {
    const sig = signatures[0]
    if (sig) {
      const params = getFunctionParameters(sig, checker)
      const returnType = getReturnType(sig, checker)

      const paramsStr = params
        .map((p) => {
          const optional = p.optional ? '?' : ''
          const defaultVal = p.defaultValue ? ` = ${p.defaultValue}` : ''
          return `${p.name}${optional}: ${formatTypeForDisplay(p.type)}${defaultVal}`
        })
        .join(', ')

      return `(${paramsStr}) => ${formatTypeForDisplay(returnType)}`
    }
  }

  return getTypeString(type, checker)
}

/** Extract API information from a single symbol */
function extractAPIFromSymbol(
  symbol: ts.Symbol,
  checker: ts.TypeChecker,
  sourceFile: ts.SourceFile,
  packageName: string
): ExtractedAPI | null {
  const name = symbol.getName()

  // Skip internal symbols
  if (name.startsWith('_') || name === 'default') {
    return null
  }

  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0]
  if (!declaration) return null

  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration)
  const kind = determineKind(symbol, type, checker, name)

  // Get JSDoc information
  const description = getJSDocComment(declaration)
  const tags = getJSDocTags(declaration)
  const paramDocs = getJSDocParams(declaration)
  const returnDoc = getJSDocReturns(declaration)
  const examples = getJSDocExamples(declaration)

  // Build API info
  const api: ExtractedAPI = {
    name,
    kind,
    signature: getDisplaySignature(symbol, type, checker, kind),
    description,
    filePath: relative(process.cwd(), sourceFile.fileName),
    exportedFrom: packageName,
    isDefault: false,
    line: getLineNumber(declaration, sourceFile),
    examples: examples.length > 0 ? examples : undefined,
    since: tags.get('since'),
    deprecated: tags.get('deprecated'),
    see: tags.has('see') ? [tags.get('see')!] : undefined,
  }

  // Extract parameters for functions/hooks
  if (kind === 'function' || kind === 'hook') {
    const signatures = type.getCallSignatures()
    if (signatures.length > 0) {
      const sig = signatures[0]
      if (sig) {
        api.parameters = extractParameters(sig, checker, paramDocs)
        api.returns = extractReturnInfo(sig, checker, returnDoc)
      }
    }
    api.typeParameters = extractTypeParameters(declaration)
  }

  // Extract props for components
  if (kind === 'component') {
    api.props = extractComponentProps(type, checker)
  }

  // Extract properties for interfaces/types
  if (kind === 'interface' || kind === 'type') {
    const props = getTypeProperties(type, checker)
    if (props.length > 0) {
      api.props = props.map((p) => ({
        name: p.name,
        type: formatTypeForDisplay(p.type),
        description: p.documentation,
        required: !p.optional,
      }))
    }
    api.typeParameters = extractTypeParameters(declaration)
  }

  return api
}

/** Extract all APIs from a TypeScript program */
function extractFromProgram(
  program: ts.Program,
  config: ExtractionConfig
): { apis: ExtractedAPI[]; errors: ExtractedError[] } {
  const checker = program.getTypeChecker()
  const apis: ExtractedAPI[] = []
  const errors: ExtractedError[] = []

  for (const sourceFile of program.getSourceFiles()) {
    // Skip external libraries
    if (isExternalLibrary(sourceFile)) continue

    // Skip non-entry-point files unless they're explicitly included
    const relativePath = relative(config.packagePath, sourceFile.fileName)
    if (
      !config.entryPoints.some((ep) =>
        relativePath.endsWith(ep.replace(/^\.\//, ''))
      )
    ) {
      continue
    }

    try {
      const exportedSymbols = getExportedSymbols(sourceFile, checker)

      for (const symbol of exportedSymbols) {
        try {
          const api = extractAPIFromSymbol(
            symbol,
            checker,
            sourceFile,
            config.packageName
          )

          if (api) {
            // Filter based on config
            if (!config.includeInternal && api.name.startsWith('_')) {
              continue
            }
            if (!config.includePrivate && api.tags?.['private']) {
              continue
            }

            apis.push(api)
          }
        } catch (err) {
          errors.push({
            file: sourceFile.fileName,
            message: `Failed to extract ${symbol.getName()}: ${(err as Error).message}`,
          })
        }
      }
    } catch (err) {
      errors.push({
        file: sourceFile.fileName,
        message: `Failed to process file: ${(err as Error).message}`,
      })
    }
  }

  return { apis, errors }
}

/** Extract APIs from a package */
export async function extractAPIs(
  config: ExtractionConfig,
  cache?: APICache
): Promise<ExtractionResult> {
  const { packagePath, entryPoints, packageName } = config
  const errors: ExtractedError[] = []

  // Resolve entry points to absolute paths
  const resolvedEntryPoints = entryPoints
    .map((ep) => join(packagePath, ep))
    .filter((ep) => {
      if (!existsSync(ep)) {
        errors.push({
          file: ep,
          message: 'Entry point file not found',
        })
        return false
      }
      return true
    })

  if (resolvedEntryPoints.length === 0) {
    return {
      packageName,
      version: getPackageVersion(packagePath),
      apis: [],
      extractedAt: new Date().toISOString(),
      errors: [
        {
          file: packagePath,
          message: 'No valid entry points found',
        },
      ],
    }
  }

  // Check cache
  let cachedAPIs: ExtractedAPI[] = []
  let needsExtraction = true

  if (cache) {
    const entryPointFile = resolvedEntryPoints[0]
    if (entryPointFile) {
      const fileHash = getFileHash(entryPointFile)
      if (isCacheValid(cache, entryPointFile, fileHash)) {
        const cached = getCachedAPIs(cache, entryPointFile)
        if (cached) {
          cachedAPIs = cached
          needsExtraction = false
        }
      }
    }
  }

  if (!needsExtraction) {
    return {
      packageName,
      version: getPackageVersion(packagePath),
      apis: cachedAPIs,
      extractedAt: new Date().toISOString(),
      errors: [],
    }
  }

  // Create TypeScript program
  const program = createProgram(resolvedEntryPoints)

  // Check for compilation errors
  const diagnostics = ts.getPreEmitDiagnostics(program)
  for (const diagnostic of diagnostics) {
    if (diagnostic.category === ts.DiagnosticCategory.Error) {
      const file = diagnostic.file?.fileName
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n'
      )
      errors.push({
        file: file ?? packagePath,
        line: diagnostic.start,
        message,
        code: `TS${diagnostic.code}`,
      })
    }
  }

  // Extract APIs
  const { apis, errors: extractionErrors } = extractFromProgram(program, config)
  errors.push(...extractionErrors)

  // Update cache
  if (cache && resolvedEntryPoints[0]) {
    const entryPointFile = resolvedEntryPoints[0]
    const fileHash = getFileHash(entryPointFile)
    setCacheEntry(cache, entryPointFile, fileHash, apis)
  }

  return {
    packageName,
    version: getPackageVersion(packagePath),
    apis,
    extractedAt: new Date().toISOString(),
    errors,
  }
}

/** Get package version from package.json */
function getPackageVersion(packagePath: string): string {
  try {
    const pkgJsonPath = join(packagePath, 'package.json')
    const content = readFileSync(pkgJsonPath, 'utf-8')
    const pkg = JSON.parse(content) as { version?: string }
    return pkg.version ?? '0.0.0'
  } catch {
    return '0.0.0'
  }
}

/** Extract APIs from multiple packages */
export async function extractMultiplePackages(
  packages: ExtractionConfig[],
  cache?: APICache
): Promise<Map<string, ExtractionResult>> {
  const results = new Map<string, ExtractionResult>()

  for (const config of packages) {
    const result = await extractAPIs(config, cache)
    results.set(config.packageName, result)
  }

  return results
}

/** Find all TypeScript source files in a package */
export async function findSourceFiles(packagePath: string): Promise<string[]> {
  const pattern = join(packagePath, 'src/**/*.{ts,tsx}')
  const files = await glob(pattern, {
    ignore: [
      '**/node_modules/**',
      '**/__tests__/**',
      '**/__mocks__/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
    ],
  })
  return files
}

/** Get default extraction config for a package */
export function getDefaultConfig(
  packagePath: string,
  packageName: string
): ExtractionConfig {
  return {
    packagePath,
    packageName,
    entryPoints: ['src/index.ts'],
    includeInternal: false,
    includePrivate: false,
  }
}

/** Filter APIs by kind */
export function filterByKind(
  apis: ExtractedAPI[],
  kind: APIKind
): ExtractedAPI[] {
  return apis.filter((api) => api.kind === kind)
}

/** Group APIs by kind */
export function groupByKind(
  apis: ExtractedAPI[]
): Map<APIKind, ExtractedAPI[]> {
  const groups = new Map<APIKind, ExtractedAPI[]>()

  for (const api of apis) {
    const existing = groups.get(api.kind) ?? []
    existing.push(api)
    groups.set(api.kind, existing)
  }

  return groups
}

/** Sort APIs alphabetically by name */
export function sortAPIs(apis: ExtractedAPI[]): ExtractedAPI[] {
  return [...apis].sort((a, b) => a.name.localeCompare(b.name))
}

/** Format extraction result as JSON */
export function formatExtractionAsJSON(result: ExtractionResult): string {
  return JSON.stringify(result, null, 2)
}
