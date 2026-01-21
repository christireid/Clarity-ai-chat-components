/**
 * Codemod: Migrate from deprecated markdown renderers to EnhancedMarkdownRenderer
 *
 * Transforms imports and usage of:
 * - MarkdownRendererEnhanced → EnhancedMarkdownRenderer
 * - MessageMarkdownRenderer → EnhancedMarkdownRenderer
 *
 * Updates props to match the new API.
 */

export default function transform(file: any, api: any) {
  const j = api.jscodeshift

  // Transform import declarations
  let transformed = j(file.source)
    .find(j.ImportDeclaration)
    .filter((path: any) => {
      return path.node.source.value === '@clarity-chat/react'
    })
    .find(j.ImportSpecifier)
    .filter((path: any) => {
      return path.node.imported.name === 'MarkdownRendererEnhanced' ||
             path.node.imported.name === 'MessageMarkdownRenderer'
    })
    .replaceWith(() => {
      return j.importSpecifier(j.identifier('EnhancedMarkdownRenderer'))
    })

  // Transform JSX usage
  transformed = transformed
    .find(j.JSXElement)
    .filter(path => {
      const openingElement = path.node.openingElement
      return openingElement.name.type === 'JSXIdentifier' &&
             (openingElement.name.name === 'MarkdownRendererEnhanced' ||
              openingElement.name.name === 'MessageMarkdownRenderer')
    })
    .replaceWith(path => {
      // Update component name
      const openingElement = path.node.openingElement
      const closingElement = path.node.closingElement

      openingElement.name.name = 'EnhancedMarkdownRenderer'

      if (closingElement) {
        closingElement.name.name = 'EnhancedMarkdownRenderer'
      }

      // Transform props
      const attributes = openingElement.attributes || []

      // Convert enableMath → enableKaTeX
      const mathAttr = attributes.find(attr =>
        attr.type === 'JSXAttribute' &&
        attr.name.name === 'enableMath'
      )

      if (mathAttr) {
        mathAttr.name.name = 'config'
        mathAttr.value = j.jsxExpressionContainer(
          j.objectExpression([
            j.objectProperty(
              j.identifier('enableKaTeX'),
              mathAttr.value.expression || j.booleanLiteral(true)
            )
          ])
        )
      }

      // Convert enableHighlight → enableSyntaxHighlight
      const highlightAttr = attributes.find(attr =>
        attr.type === 'JSXAttribute' &&
        attr.name.name === 'enableHighlight'
      )

      if (highlightAttr) {
        highlightAttr.name.name = 'config'
        if (mathAttr) {
          // Merge with existing config
          const configExpr = mathAttr.value.expression
          if (configExpr.type === 'ObjectExpression') {
            configExpr.properties.push(
              j.objectProperty(
                j.identifier('enableSyntaxHighlight'),
                highlightAttr.value.expression || j.booleanLiteral(true)
              )
            )
          }
          // Remove the separate highlight attribute
          attributes.splice(attributes.indexOf(highlightAttr), 1)
        } else {
          highlightAttr.value = j.jsxExpressionContainer(
            j.objectExpression([
              j.objectProperty(
                j.identifier('enableSyntaxHighlight'),
                highlightAttr.value.expression || j.booleanLiteral(true)
              )
            ])
          )
        }
      }

      return path.node
    })

  return transformed.toSource()
}