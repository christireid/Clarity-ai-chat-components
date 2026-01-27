import type { API, FileInfo, Options } from 'jscodeshift'

/**
 * Reduced Motion Hook Migration Codemod
 *
 * Migrates useReducedMotion imports to use the canonical source.
 *
 * Changes:
 * - @clarity-chat/react/hooks/ui/use-reduced-motion -> @clarity-chat/primitives
 * - Ensures consistent import across codebase
 */

export function migrateReducedMotion(
  file: FileInfo,
  api: API,
  _options: Options
) {
  const j = api.jscodeshift
  const root = j(file.source)

  let hasChanges = false

  // Find all useReducedMotion imports
  root
    .find(j.ImportDeclaration)
    .filter((path) => {
      const sourceValue = path.node.source.value
      return typeof sourceValue === 'string' && sourceValue.includes('use-reduced-motion')
    })
    .forEach((path) => {
      // Check if it's not already from primitives
      if (path.node.source.value !== '@clarity-chat/primitives') {
        // Update import source to primitives
        path.node.source = j.literal('@clarity-chat/primitives')
        hasChanges = true
      }
    })

  // Also handle direct import from react package
  root
    .find(j.ImportDeclaration)
    .filter((path) => {
      return (
        path.node.source.value === '@clarity-chat/react' ||
        path.node.source.value ===
          '@clarity-chat/react/hooks/ui/use-reduced-motion'
      )
    })
    .forEach((path) => {
      const specifiers = path.node.specifiers || []

      // Check if useReducedMotion is imported
      const hasReducedMotion = specifiers.some((spec) => {
        return (
          spec.type === 'ImportSpecifier' &&
          spec.imported.name === 'useReducedMotion'
        )
      })

      if (hasReducedMotion) {
        // Remove useReducedMotion from this import
        path.node.specifiers = specifiers.filter((spec) => {
          return !(
            spec.type === 'ImportSpecifier' &&
            spec.imported.name === 'useReducedMotion'
          )
        })

        // Add a separate import from primitives
        const existingPrimitivesImport = root
          .find(j.ImportDeclaration)
          .filter(
            (path) => path.node.source.value === '@clarity-chat/primitives'
          )

        if (existingPrimitivesImport.length > 0) {
          // Add to existing primitives import
          const primitivesImport = existingPrimitivesImport.get(0)
          const primitivesSpecifiers = primitivesImport.node.specifiers || []

          if (
            !primitivesSpecifiers.some(
              (spec: any) => spec.imported?.name === 'useReducedMotion'
            )
          ) {
            primitivesSpecifiers.push(
              j.importSpecifier(j.identifier('useReducedMotion'))
            )
          }
        } else {
          // Create new primitives import
          const newImport = j.importDeclaration(
            [j.importSpecifier(j.identifier('useReducedMotion'))],
            j.literal('@clarity-chat/primitives')
          )

          // Insert after the current import
          path.insertAfter(newImport)
        }

        hasChanges = true
      }
    })

  return hasChanges ? root.toSource() : file.source
}
