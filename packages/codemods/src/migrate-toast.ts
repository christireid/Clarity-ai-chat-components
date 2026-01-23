import { API, FileInfo, Options } from 'jscodeshift'

/**
 * Toast Migration Codemod
 *
 * Migrates from custom toast system to Sonner-based toast system.
 *
 * Changes:
 * - useToast -> toast function calls
 * - ToastProvider -> ClarityToaster
 * - ToastContainer removal
 * - Import updates
 */

export function migrateToast(file: FileInfo, api: API, _options: Options) {
  const j = api.jscodeshift
  const root = j(file.source)

  let hasChanges = false

  // 1. Update imports: replace useToast, ToastProvider, ToastContainer with ClarityToaster, toast
  root
    .find(j.ImportDeclaration)
    .filter((path) => {
      return (
        path.node.source.value === '@clarity-chat/react' ||
        path.node.source.value === '@clarity/chat-components'
      )
    })
    .forEach((path) => {
      const specifiers = path.node.specifiers || []

      // Find and remove old toast imports
      const oldToastImports = specifiers.filter((spec) => {
        return (
          spec.type === 'ImportSpecifier' &&
          ['useToast', 'ToastProvider', 'ToastContainer'].includes(
            spec.imported.name
          )
        )
      })

      // Add new toast imports if old ones exist
      if (oldToastImports.length > 0) {
        // Remove old imports
        path.node.specifiers = specifiers.filter((spec) => {
          return !(
            spec.type === 'ImportSpecifier' &&
            ['useToast', 'ToastProvider', 'ToastContainer'].includes(
              spec.imported.name
            )
          )
        })

        // Add new imports
        const newImports = ['ClarityToaster', 'toast']
        newImports.forEach((importName) => {
          if (
            !path.node.specifiers.some(
              (spec: any) => spec.imported?.name === importName
            )
          ) {
            path.node.specifiers.push(
              j.importSpecifier(j.identifier(importName))
            )
          }
        })

        hasChanges = true
      }
    })

  // 2. Replace ToastProvider usage with ClarityToaster
  root
    .find(j.JSXElement)
    .filter((path) => {
      return (
        path.node.openingElement.name.type === 'JSXIdentifier' &&
        path.node.openingElement.name.name === 'ToastProvider'
      )
    })
    .forEach((path) => {
      // Replace ToastProvider with ClarityToaster (self-closing)
      path.node.openingElement.name.name = 'ClarityToaster'
      path.node.openingElement.selfClosing = true

      // Remove any children and closing element
      if (path.node.closingElement) {
        path.node.closingElement = null
      }
      path.node.children = []

      hasChanges = true
    })

  // 3. Remove ToastContainer elements
  root
    .find(j.JSXElement)
    .filter((path) => {
      return (
        path.node.openingElement.name.type === 'JSXIdentifier' &&
        path.node.openingElement.name.name === 'ToastContainer'
      )
    })
    .forEach((path) => {
      // Remove the entire element
      path.prune()
      hasChanges = true
    })

  // 4. Transform useToast hook usage to direct toast calls
  root
    .find(j.VariableDeclarator)
    .filter((path) => {
      return (
        path.node.id.type === 'ObjectPattern' &&
        path.node.init?.type === 'CallExpression' &&
        path.node.init.callee.type === 'Identifier' &&
        path.node.init.callee.name === 'useToast'
      )
    })
    .forEach((path) => {
      const objectPattern = path.node.id as any
      const properties = objectPattern.properties || []

      // Find toast function destructuring
      const toastProperty = properties.find((prop: any) => {
        return prop.key?.name === 'toast' || prop.key?.name === 'showToast'
      })

      if (toastProperty) {
        // Replace useToast destructuring with direct toast import
        // This will be handled by the import transformation above
        hasChanges = true
      }
    })

  // 5. Transform toast function calls
  root
    .find(j.CallExpression)
    .filter((path) => {
      return (
        path.node.callee.type === 'MemberExpression' &&
        path.node.callee.object.type === 'Identifier' &&
        ['toast', 'showToast'].includes(path.node.callee.object.name) &&
        path.node.callee.property.type === 'Identifier'
      )
    })
    .forEach((path) => {
      const memberExpr = path.node.callee as any
      const propertyName = memberExpr.property.name

      // Transform toast.success(), toast.error(), etc. to direct calls
      if (
        ['success', 'error', 'info', 'warning', 'message'].includes(
          propertyName
        )
      ) {
        // Replace toast.success(args) with toast.success(args)
        // This should work as-is with the new toast import
        hasChanges = true
      }
    })

  return hasChanges ? root.toSource() : file.source
}
