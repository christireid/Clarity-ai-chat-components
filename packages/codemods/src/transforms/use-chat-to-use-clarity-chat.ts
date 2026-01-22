/**
 * Codemod: Migrate from useChat to useClarityChat
 *
 * Transforms deprecated useChat imports and usage to useClarityChat.
 * Handles both named imports and aliased imports.
 */

export default function transform(file: any, api: any) {
  const j = api.jscodeshift
  const { statement } = j.template

  // Transform import declarations
  const importTransform = j(file.source)
    .find(j.ImportDeclaration)
    .filter(path => {
      return path.node.source.value === '@clarity-chat/react'
    })
    .find(j.ImportSpecifier)
    .filter(path => {
      // Match useChat with any alias (useChat, useChat as alias, etc.)
      return path.node.imported.name === 'useChat' ||
             (path.node.imported.name === 'useChat' && path.node.local?.name)
    })
    .replaceWith(() => {
      return j.importSpecifier(j.identifier('useClarityChat'))
    })

  // Transform variable declarations that use useChat
  const variableTransform = importTransform
    .find(j.VariableDeclarator)
    .filter(path => {
      return path.node.init?.callee?.name === 'useChat'
    })
    .replaceWith(path => {
      // Replace the function call
      const callExpression = path.node.init
      return j.variableDeclarator(
        path.node.id,
        j.callExpression(
          j.identifier('useClarityChat'),
          callExpression.arguments
        )
      )
    })

  // Transform hook calls in expressions
  const callTransform = variableTransform
    .find(j.CallExpression)
    .filter(path => {
      return path.node.callee.name === 'useChat'
    })
    .replaceWith(path => {
      return j.callExpression(
        j.identifier('useClarityChat'),
        path.node.arguments
      )
    })

  return callTransform.toSource()
}