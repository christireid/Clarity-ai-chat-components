import { API, FileInfo, Options } from 'jscodeshift'

/**
 * Markdown Renderers Migration Codemod
 *
 * Migrates from deprecated markdown renderers to EnhancedMarkdownRenderer.
 *
 * Changes:
 * - MarkdownRendererEnhanced -> EnhancedMarkdownRenderer
 * - MessageMarkdownRenderer removal
 * - Import updates
 */

export function migrateMarkdownRenderers(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift
  const root = j(file.source)

  let hasChanges = false

  // 1. Update imports: replace MarkdownRendererEnhanced with EnhancedMarkdownRenderer
  root
    .find(j.ImportDeclaration)
    .filter((path) => {
      return (
        path.node.source.value === '@clarity-chat/react' ||
        path.node.source.value === '@clarity-chat/react/internal'
      )
    })
    .forEach((path) => {
      const specifiers = path.node.specifiers || []

      // Replace MarkdownRendererEnhanced with EnhancedMarkdownRenderer
      specifiers.forEach((spec) => {
        if (
          spec.type === 'ImportSpecifier' &&
          spec.imported.name === 'MarkdownRendererEnhanced'
        ) {
          spec.imported.name = 'EnhancedMarkdownRenderer'
          hasChanges = true
        }
      })

      // Remove MessageMarkdownRenderer imports
      path.node.specifiers = specifiers.filter((spec) => {
        return !(
          spec.type === 'ImportSpecifier' &&
          spec.imported.name === 'MessageMarkdownRenderer'
        )
      })

      if (path.node.specifiers.length !== specifiers.length) {
        hasChanges = true
      }
    })

  // 2. Replace JSX usage: MarkdownRendererEnhanced -> EnhancedMarkdownRenderer
  root
    .find(j.JSXElement)
    .filter((path) => {
      return (
        path.node.openingElement.name.type === 'JSXIdentifier' &&
        path.node.openingElement.name.name === 'MarkdownRendererEnhanced'
      )
    })
    .forEach((path) => {
      // Replace component name
      path.node.openingElement.name.name = 'EnhancedMarkdownRenderer'

      // Update props if needed (old API used individual boolean props, new uses config object)
      const attributes = path.node.openingElement.attributes || []

      // Check for old boolean props
      const oldProps = ['enableHighlight', 'enableGFM', 'enableMath']
      const hasOldProps = attributes.some((attr) => {
        return (
          attr.type === 'JSXAttribute' &&
          attr.name.type === 'JSXIdentifier' &&
          oldProps.includes(attr.name.name)
        )
      })

      if (hasOldProps) {
        // Convert old props to config object
        let configProps: Record<string, any> = {}

        attributes.forEach((attr, index) => {
          if (
            attr.type === 'JSXAttribute' &&
            attr.name.type === 'JSXIdentifier'
          ) {
            const propName = attr.name.name
            const propValue = attr.value

            if (propName === 'enableHighlight') {
              configProps.enableSyntaxHighlight = propValue
            } else if (propName === 'enableGFM') {
              configProps.enableGFM = propValue
            } else if (propName === 'enableMath') {
              configProps.enableKaTeX = propValue
            }
          }
        })

        // Create config object
        if (Object.keys(configProps).length > 0) {
          const configProp = j.jsxAttribute(
            j.jsxIdentifier('config'),
            j.jsxExpressionContainer(
              j.objectExpression(
                Object.entries(configProps).map(([key, value]) => {
                  return j.objectProperty(
                    j.identifier(key),
                    value || j.booleanLiteral(true)
                  )
                })
              )
            )
          )

          // Replace old props with config prop
          const newAttributes = attributes.filter((attr) => {
            return !(
              attr.type === 'JSXAttribute' &&
              attr.name.type === 'JSXIdentifier' &&
              oldProps.includes(attr.name.name)
            )
          })

          newAttributes.push(configProp)
          path.node.openingElement.attributes = newAttributes
        }

        hasChanges = true
      }

      hasChanges = true
    })

  // 3. Remove MessageMarkdownRenderer JSX usage
  root
    .find(j.JSXElement)
    .filter((path) => {
      return (
        path.node.openingElement.name.type === 'JSXIdentifier' &&
        path.node.openingElement.name.name === 'MessageMarkdownRenderer'
      )
    })
    .forEach((path) => {
      // Replace with EnhancedMarkdownRenderer or remove if not needed
      // For now, replace with EnhancedMarkdownRenderer
      path.node.openingElement.name.name = 'EnhancedMarkdownRenderer'

      // Copy content prop if it exists
      hasChanges = true
    })

  return hasChanges ? root.toSource() : file.source
}