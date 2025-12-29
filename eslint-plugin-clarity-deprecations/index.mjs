/**
 * ESLint Plugin: Clarity Deprecations
 *
 * Custom rules to catch deprecated hook imports and guide migration.
 * Helps users migrate from deprecated hooks to recommended alternatives.
 */

const DEPRECATED_HOOKS = {
  useChat: {
    replacement: 'useClarityChat',
    message: 'useChat is deprecated. Use useClarityChat instead.',
    docs: 'https://clarity-chat.dev/docs/migration/deprecated-hooks',
  },
  useChatEnhanced: {
    replacement: 'useClarityChat',
    message: 'useChatEnhanced is deprecated. Use useClarityChat instead.',
    docs: 'https://clarity-chat.dev/docs/migration/deprecated-hooks',
  },
  useChatSimple: {
    replacement: 'useClarityChat',
    message: 'useChatSimple is deprecated. Use useClarityChat instead.',
    docs: 'https://clarity-chat.dev/docs/migration/deprecated-hooks',
  },
  useChatComposable: {
    replacement: 'useClarityChat',
    message:
      'useChatComposable is deprecated. Use useClarityChat with memory and transport options instead.',
    docs: 'https://clarity-chat.dev/docs/migration/deprecated-hooks',
  },
  useChatLegacy: {
    replacement: 'useClarityChat',
    message: 'useChatLegacy is deprecated. Use useClarityChat instead.',
    docs: 'https://clarity-chat.dev/docs/migration/deprecated-hooks',
  },
}

export default {
  rules: {
    /**
     * Rule: no-deprecated-hooks
     * Warns when importing deprecated hooks and suggests replacements.
     */
    'no-deprecated-hooks': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Prevent importing deprecated Clarity Chat hooks',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: 'code',
        messages: {
          deprecatedHook:
            "{{hookName}} is deprecated. Use {{replacement}} instead. See: {{docs}}",
        },
        schema: [],
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            // Only check imports from @clarity-chat/react
            if (
              !node.source.value.includes('@clarity-chat/react') &&
              !node.source.value.includes('./hooks/chat/')
            ) {
              return
            }

            // Check each imported specifier
            node.specifiers.forEach((specifier) => {
              if (specifier.type !== 'ImportSpecifier') return

              const importedName = specifier.imported.name
              const deprecatedInfo = DEPRECATED_HOOKS[importedName]

              if (deprecatedInfo) {
                context.report({
                  node: specifier,
                  messageId: 'deprecatedHook',
                  data: {
                    hookName: importedName,
                    replacement: deprecatedInfo.replacement,
                    docs: deprecatedInfo.docs,
                  },
                  fix(fixer) {
                    // Auto-fix: replace deprecated hook with replacement
                    return fixer.replaceText(
                      specifier.imported,
                      deprecatedInfo.replacement
                    )
                  },
                })
              }
            })
          },
        }
      },
    },

    /**
     * Rule: no-deprecated-hook-calls
     * Warns when calling deprecated hooks and suggests replacements.
     */
    'no-deprecated-hook-calls': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Prevent calling deprecated Clarity Chat hooks',
          category: 'Best Practices',
          recommended: true,
        },
        messages: {
          deprecatedCall:
            "Calling {{hookName}}() is deprecated. Migrate to {{replacement}}(). See: {{docs}}",
        },
        schema: [],
      },
      create(context) {
        return {
          CallExpression(node) {
            if (node.callee.type !== 'Identifier') return

            const hookName = node.callee.name
            const deprecatedInfo = DEPRECATED_HOOKS[hookName]

            if (deprecatedInfo) {
              context.report({
                node,
                messageId: 'deprecatedCall',
                data: {
                  hookName,
                  replacement: deprecatedInfo.replacement,
                  docs: deprecatedInfo.docs,
                },
              })
            }
          },
        }
      },
    },
  },
}
