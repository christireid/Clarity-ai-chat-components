/**
 * TypeScript compiler API utilities
 */

import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import ts from 'typescript'

/** Default compiler options for API extraction */
export const DEFAULT_COMPILER_OPTIONS: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  lib: ['ES2022', 'DOM', 'DOM.Iterable'],
  jsx: ts.JsxEmit.ReactJSX,
  declaration: true,
  strict: true,
  skipLibCheck: true,
  noEmit: true,
  types: ['node'],
}

/** Find tsconfig.json starting from a directory */
function findTsConfig(startDir: string): string | undefined {
  let dir = startDir
  while (dir !== dirname(dir)) {
    const configPath = join(dir, 'tsconfig.json')
    if (existsSync(configPath)) {
      return configPath
    }
    dir = dirname(dir)
  }
  return undefined
}

/** Create a TypeScript program */
export function createProgram(
  entryPoints: string[],
  options?: ts.CompilerOptions
): ts.Program {
  // Try to find and use tsconfig.json
  const entryDir = entryPoints[0] ? dirname(entryPoints[0]) : process.cwd()
  const configPath = findTsConfig(entryDir)

  let compilerOptions = { ...DEFAULT_COMPILER_OPTIONS, ...options }

  if (configPath) {
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
    if (!configFile.error) {
      const parsed = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        dirname(configPath)
      )
      // Merge with defaults, but keep our defaults for certain options
      compilerOptions = {
        ...parsed.options,
        ...compilerOptions,
        skipLibCheck: true,
        noEmit: true,
      }
    }
  }

  return ts.createProgram(entryPoints, compilerOptions)
}

/** Check if a source file is from external library */
export function isExternalLibrary(sourceFile: ts.SourceFile): boolean {
  return sourceFile.fileName.includes('node_modules')
}

/** Check if a node has export modifier */
export function isExported(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) return false
  const modifiers = ts.getModifiers(node)
  return modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false
}

/** Check if a node is a default export */
export function isDefaultExport(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) return false
  const modifiers = ts.getModifiers(node)
  return (
    modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword) ?? false
  )
}

/** Get the name of an exported declaration */
export function getExportName(node: ts.Node): string | null {
  if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
    return node.name?.getText() ?? null
  }
  if (ts.isVariableStatement(node)) {
    const declaration = node.declarationList.declarations[0]
    if (declaration && ts.isIdentifier(declaration.name)) {
      return declaration.name.getText()
    }
  }
  if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
    return node.name.getText()
  }
  if (ts.isEnumDeclaration(node)) {
    return node.name.getText()
  }
  return null
}

/** Get JSDoc comment for a node */
export function getJSDocComment(node: ts.Node): string {
  const comments: string[] = []

  // Get the main JSDoc comment
  const jsDoc = (node as { jsDoc?: ts.JSDoc[] }).jsDoc
  if (jsDoc && jsDoc.length > 0) {
    const firstDoc = jsDoc[0]
    if (firstDoc?.comment) {
      comments.push(ts.getTextOfJSDocComment(firstDoc.comment) ?? '')
    }
  }

  return comments.join('\n').trim()
}

/** Get JSDoc tags for a node */
export function getJSDocTags(node: ts.Node): Map<string, string> {
  const tags = new Map<string, string>()
  const jsDocTags = ts.getJSDocTags(node)

  for (const tag of jsDocTags) {
    const tagName = tag.tagName.getText()
    const comment = tag.comment
    const value = comment
      ? typeof comment === 'string'
        ? comment
        : (ts.getTextOfJSDocComment(comment) ?? '')
      : ''
    tags.set(tagName, value)
  }

  return tags
}

/** Get @param JSDoc tags */
export function getJSDocParams(node: ts.Node): Map<string, string> {
  const params = new Map<string, string>()
  const tags = ts.getJSDocTags(node)

  for (const tag of tags) {
    if (ts.isJSDocParameterTag(tag)) {
      const paramName = tag.name.getText()
      const comment = tag.comment
      const value = comment
        ? typeof comment === 'string'
          ? comment
          : (ts.getTextOfJSDocComment(comment) ?? '')
        : ''
      params.set(paramName, value)
    }
  }

  return params
}

/** Get @returns JSDoc tag */
export function getJSDocReturns(node: ts.Node): string | null {
  const tags = ts.getJSDocTags(node)

  for (const tag of tags) {
    if (ts.isJSDocReturnTag(tag)) {
      const comment = tag.comment
      return comment
        ? typeof comment === 'string'
          ? comment
          : (ts.getTextOfJSDocComment(comment) ?? '')
        : null
    }
  }

  return null
}

/** Get @example JSDoc tags */
export function getJSDocExamples(node: ts.Node): string[] {
  const examples: string[] = []
  const tags = ts.getJSDocTags(node)

  for (const tag of tags) {
    if (tag.tagName.getText() === 'example') {
      const comment = tag.comment
      const text = comment
        ? typeof comment === 'string'
          ? comment
          : (ts.getTextOfJSDocComment(comment) ?? '')
        : ''
      if (text) {
        examples.push(text.trim())
      }
    }
  }

  return examples
}

/** Get type string from a type */
export function getTypeString(type: ts.Type, checker: ts.TypeChecker): string {
  return checker.typeToString(
    type,
    undefined,
    ts.TypeFormatFlags.NoTruncation |
      ts.TypeFormatFlags.WriteArrowStyleSignature |
      ts.TypeFormatFlags.WriteTypeArgumentsOfSignature
  )
}

/** Get signature string for a function/method */
export function getSignatureString(
  signature: ts.Signature,
  checker: ts.TypeChecker
): string {
  return checker.signatureToString(
    signature,
    undefined,
    ts.TypeFormatFlags.NoTruncation |
      ts.TypeFormatFlags.WriteArrowStyleSignature
  )
}

/** Check if a type is a React component */
export function isReactComponent(
  type: ts.Type,
  checker: ts.TypeChecker
): boolean {
  const typeString = getTypeString(type, checker)
  return (
    typeString.includes('React.FC') ||
    typeString.includes('React.FunctionComponent') ||
    typeString.includes('React.Component') ||
    typeString.includes('JSX.Element') ||
    typeString.includes('ReactElement')
  )
}

/** Check if a name is a React hook */
export function isHookName(name: string): boolean {
  return /^use[A-Z]/.test(name)
}

/** Get properties from an interface/type */
export function getTypeProperties(
  type: ts.Type,
  checker: ts.TypeChecker
): Array<{
  name: string
  type: string
  optional: boolean
  documentation: string
}> {
  const properties: Array<{
    name: string
    type: string
    optional: boolean
    documentation: string
  }> = []

  for (const symbol of type.getProperties()) {
    const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0]
    const propType = checker.getTypeOfSymbolAtLocation(
      symbol,
      declaration ?? ({} as ts.Node)
    )
    const optional = !!(symbol.flags & ts.SymbolFlags.Optional)

    let documentation = ''
    const docs = symbol.getDocumentationComment(checker)
    if (docs.length > 0) {
      documentation = docs.map((d) => d.text).join('')
    }

    properties.push({
      name: symbol.getName(),
      type: getTypeString(propType, checker),
      optional,
      documentation,
    })
  }

  return properties
}

/** Get function parameters */
export function getFunctionParameters(
  signature: ts.Signature,
  checker: ts.TypeChecker
): Array<{
  name: string
  type: string
  optional: boolean
  defaultValue?: string
}> {
  const params: Array<{
    name: string
    type: string
    optional: boolean
    defaultValue?: string
  }> = []

  for (const param of signature.getParameters()) {
    const declaration = param.valueDeclaration
    if (!declaration || !ts.isParameter(declaration)) continue

    const paramType = checker.getTypeOfSymbolAtLocation(param, declaration)
    const optional =
      !!(param.flags & ts.SymbolFlags.Optional) ||
      declaration.questionToken !== undefined

    let defaultValue: string | undefined
    if (declaration.initializer) {
      defaultValue = declaration.initializer.getText()
    }

    params.push({
      name: param.getName(),
      type: getTypeString(paramType, checker),
      optional,
      defaultValue,
    })
  }

  return params
}

/** Get return type of a signature */
export function getReturnType(
  signature: ts.Signature,
  checker: ts.TypeChecker
): string {
  const returnType = signature.getReturnType()
  return getTypeString(returnType, checker)
}

/** Find all exported symbols from a source file */
export function getExportedSymbols(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker
): ts.Symbol[] {
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
  if (!moduleSymbol) return []

  const exports = checker.getExportsOfModule(moduleSymbol)
  return exports
}

/** Get the line number of a node */
export function getLineNumber(
  node: ts.Node,
  sourceFile: ts.SourceFile
): number {
  const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart())
  return line + 1 // Convert to 1-indexed
}

/** Format type for display, simplifying common patterns */
export function formatTypeForDisplay(type: string): string {
  return type
    .replace(/import\([^)]+\)\./g, '') // Remove import() wrappers
    .replace(/readonly /g, '') // Remove readonly (for display)
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}
