/**
 * Codemod: Migrate from custom toast to Sonner toast
 *
 * Transforms imports and usage from:
 * - useToast, ToastProvider, ToastContainer → toast from Sonner
 *
 * Updates toast usage patterns to match Sonner API.
 */

export default function transform(file: any, api: any) {
  const j = api.jscodeshift

  // Transform imports
  let transformed = j(file.source)
    .find(j.ImportDeclaration)
    .filter(path => {
      return path.node.source.value === '@clarity-chat/react'
    })
    .find(j.ImportSpecifier)
    .filter(path => {
      return ['useToast', 'ToastProvider', 'ToastContainer', 'ToastItem'].includes(path.node.imported.name)
    })
    .remove()

  // Add Sonner toast import if any toast usage exists
  const hasToastUsage = j(transformed.toSource())
    .find(j.CallExpression)
    .filter(path => {
      return path.node.callee.name === 'toast' ||
             (path.node.callee.object?.name === 'toast')
    })
    .size() > 0

  if (hasToastUsage) {
    transformed = transformed
      .find(j.ImportDeclaration)
      .filter(path => path.node.source.value === '@clarity-chat/react')
      .insertAfter(
        j.importDeclaration(
          [j.importSpecifier(j.identifier('toast'))],
          j.literal('@clarity-chat/react')
        )
      )
  }

  // Transform toast usage patterns
  transformed = transformed
    .find(j.VariableDeclaration)
    .filter(path => {
      // Find const { toast } = useToast()
      const declarations = path.node.declarations
      return declarations.some(decl => {
        if (decl.type === 'VariableDeclarator' &&
            decl.init?.type === 'CallExpression' &&
            decl.init.callee.name === 'useToast' &&
            decl.id.type === 'ObjectPattern') {
          return decl.id.properties.some(prop =>
            prop.type === 'ObjectProperty' &&
            prop.key.name === 'toast'
          )
        }
        return false
      })
    })
    .remove()

  // Transform toast calls from object method to direct function calls
  transformed = transformed
    .find(j.CallExpression)
    .filter(path => {
      return path.node.callee.type === 'MemberExpression' &&
             path.node.callee.object.name === 'toast' &&
             ['success', 'error', 'info', 'warning'].includes(path.node.callee.property.name)
    })
    .replaceWith(path => {
      const method = path.node.callee.property.name
      const args = path.node.arguments

      // Convert object-style calls to function calls
      // toast.success('message') → toast('message', { type: 'success' })
      if (args.length === 1) {
        return j.callExpression(
          j.identifier('toast'),
          [
            args[0],
            j.objectExpression([
              j.objectProperty(
                j.identifier('type'),
                j.stringLiteral(method)
              )
            ])
          ]
        )
      }

      // Handle cases with options
      if (args.length === 2 && args[1].type === 'ObjectExpression') {
        const options = args[1]
        options.properties.push(
          j.objectProperty(
            j.identifier('type'),
            j.stringLiteral(method)
          )
        )
        return j.callExpression(
          j.identifier('toast'),
          [args[0], options]
        )
      }

      return path.node
    })

  // Remove ToastProvider usage
  transformed = transformed
    .find(j.JSXElement)
    .filter(path => {
      const openingElement = path.node.openingElement
      return openingElement.name.type === 'JSXIdentifier' &&
             openingElement.name.name === 'ToastProvider'
    })
    .remove()

  // Add ClarityToaster if toast is used
  if (hasToastUsage) {
    transformed = transformed
      .find(j.JSXElement)
      .filter(path => {
        // Find the root element to add ClarityToaster
        const parent = path.parent
        return !parent || parent.type !== 'JSXElement'
      })
      .replaceWith(path => {
        // Wrap with ClarityToaster at the root level
        return j.jsxElement(
          j.jsxOpeningElement(
            j.jsxIdentifier('ClarityToaster'),
            [],
            false
          ),
          j.jsxClosingElement(j.jsxIdentifier('ClarityToaster')),
          [path.node]
        )
      })
  }

  return transformed.toSource()
}