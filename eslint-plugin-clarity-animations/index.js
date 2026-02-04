/**
 * ESLint Plugin: Clarity Animations
 *
 * Custom rules to enforce animation best practices and library usage.
 * Helps maintain consistent, performant animations across the codebase.
 */

module.exports = {
  rules: {
    /**
     * Rule: no-hardcoded-duration
     * Prevents hardcoded animation duration values.
     * Enforces use of duration tokens from animation library.
     *
     * Context-aware: Only triggers within animation-related contexts
     * (transition objects, motion component props, etc.)
     */
    'no-hardcoded-duration': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Enforce use of duration tokens instead of hardcoded values',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: 'code',
        messages: {
          useTokens:
            'Use duration tokens (durations.fast/normal/slow/moderate) instead of hardcoded {{value}}. Import from @/lib/animations',
        },
        schema: [],
      },
      create(context) {
        // Animation-related parent property names that indicate this is an animation context
        const animationContextProps = [
          'transition',
          'animate',
          'initial',
          'exit',
          'whileHover',
          'whileTap',
          'whileFocus',
          'whileDrag',
          'whileInView',
          'variants',
        ]

        /**
         * Check if the node is within an animation context
         */
        function isInAnimationContext(node) {
          let parent = node.parent

          while (parent) {
            // Check if we're in an object that's a value of an animation property
            if (parent.type === 'Property' && parent.key) {
              const keyName = parent.key.name || parent.key.value
              if (animationContextProps.includes(keyName)) {
                return true
              }
            }

            // Check if we're in a JSX attribute that's animation-related
            if (parent.type === 'JSXAttribute' && parent.name) {
              const attrName = parent.name.name
              if (animationContextProps.includes(attrName)) {
                return true
              }
            }

            parent = parent.parent
          }

          return false
        }

        return {
          Property(node) {
            // Check if property is named 'duration'
            if (
              node.key &&
              (node.key.name === 'duration' || node.key.value === 'duration')
            ) {
              // Check if value is a hardcoded number
              if (
                node.value.type === 'Literal' &&
                typeof node.value.value === 'number'
              ) {
                const value = node.value.value

                // Skip if it's 0 (often used for instant/no animation)
                if (value === 0) return

                // Skip values > 1 - these are likely milliseconds, not seconds
                // Animation durations in Framer Motion are typically 0.1-1.0 seconds
                if (value > 1) return

                // Only report if we're in an animation context
                if (!isInAnimationContext(node)) return

                context.report({
                  node: node.value,
                  messageId: 'useTokens',
                  data: { value },
                  fix(fixer) {
                    // Auto-fix: suggest appropriate token based on value
                    let replacement = 'durations.normal'
                    if (value <= 0.15) replacement = 'durations.fast'
                    else if (value <= 0.2) replacement = 'durations.normal'
                    else if (value <= 0.3) replacement = 'durations.moderate'
                    else if (value <= 0.5) replacement = 'durations.slow'
                    else replacement = 'durations.slower'

                    return fixer.replaceText(node.value, replacement)
                  },
                })
              }
            }
          },
        }
      },
    },

    /**
     * Rule: no-layout-animation
     * Prevents animating layout-triggering properties (width, height, top, left).
     * Enforces GPU-accelerated properties (transform, opacity) for 60fps performance.
     */
    'no-layout-animation': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Prevent animating layout properties that cause reflow',
          category: 'Performance',
          recommended: true,
        },
        messages: {
          useTransform:
            "Animating '{{prop}}' causes layout thrashing. Use 'transform: scale/translate' instead for 60fps performance.",
        },
        schema: [],
      },
      create(context) {
        const layoutProps = [
          'width',
          'height',
          'top',
          'left',
          'right',
          'bottom',
          'margin',
          'padding',
          'border',
        ]

        return {
          Property(node) {
            const propName = node.key.name || node.key.value

            // Check if this property is a layout property
            if (!layoutProps.includes(propName)) return

            // Check if we're inside an animation object
            // Look for parent properties named 'animate', 'initial', 'exit', 'whileHover', 'whileTap'
            let parent = node.parent
            let isAnimation = false

            while (parent && parent.type === 'ObjectExpression') {
              if (parent.parent && parent.parent.type === 'Property') {
                const parentKey =
                  parent.parent.key.name || parent.parent.key.value
                if (
                  [
                    'animate',
                    'initial',
                    'exit',
                    'whileHover',
                    'whileTap',
                    'transition',
                  ].includes(parentKey)
                ) {
                  isAnimation = true
                  break
                }
              }
              parent = parent.parent
            }

            if (isAnimation) {
              context.report({
                node,
                messageId: 'useTransform',
                data: { prop: propName },
              })
            }
          },
        }
      },
    },

    /**
     * Rule: prefer-animation-library
     * Suggests using animation library variants instead of inline animations.
     */
    'prefer-animation-library': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Suggest using animation library variants',
          category: 'Best Practices',
          recommended: false, // Warning only
        },
        messages: {
          useLibrary:
            'Consider using animation library variants (fadeInUp, slideUp, etc.) instead of inline animations. Import from @/lib/animations',
        },
        schema: [],
      },
      create(context) {
        return {
          JSXAttribute(node) {
            // Check for 'animate' prop with object expression
            if (
              node.name &&
              node.name.name === 'animate' &&
              node.value &&
              node.value.expression &&
              node.value.expression.type === 'ObjectExpression'
            ) {
              // Check if it's not using a variant (simple object with opacity/x/y)
              const properties = node.value.expression.properties
              const hasOpacity = properties.some(
                (p) =>
                  p.key &&
                  (p.key.name === 'opacity' || p.key.value === 'opacity')
              )
              const hasTransform = properties.some(
                (p) =>
                  p.key &&
                  (p.key.name === 'x' ||
                    p.key.value === 'x' ||
                    p.key.name === 'y' ||
                    p.key.value === 'y' ||
                    p.key.name === 'scale' ||
                    p.key.value === 'scale')
              )

              if (hasOpacity && hasTransform) {
                context.report({
                  node,
                  messageId: 'useLibrary',
                })
              }
            }
          },
        }
      },
    },

    /**
     * Rule: require-reduced-motion
     * Ensures animations respect prefers-reduced-motion accessibility preference.
     */
    'require-reduced-motion': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Ensure animations respect prefers-reduced-motion',
          category: 'Accessibility',
          recommended: true,
        },
        messages: {
          addReducedMotion:
            'Animation components should respect prefers-reduced-motion. Add accessibility support using viewport={{ once: true }} or conditional rendering.',
        },
        schema: [],
      },
      create(context) {
        return {
          JSXOpeningElement(node) {
            // Check if element is motion.* (Framer Motion component)
            if (
              node.name.type === 'JSXMemberExpression' &&
              node.name.object.name === 'motion'
            ) {
              // Check if it has animate prop (indicates animation)
              const hasAnimate = node.attributes.some(
                (attr) =>
                  attr.type === 'JSXAttribute' && attr.name.name === 'animate'
              )

              if (!hasAnimate) return

              // Check if it has viewport or whileInView (which often includes once: true)
              const hasViewport = node.attributes.some(
                (attr) =>
                  attr.type === 'JSXAttribute' &&
                  (attr.name.name === 'viewport' ||
                    attr.name.name === 'whileInView')
              )

              // Check if file imports useReducedMotion or mentions reduced-motion
              const sourceCode = context.getSourceCode()
              const text = sourceCode.getText()
              const hasReducedMotionCheck =
                text.includes('prefers-reduced-motion') ||
                text.includes('useReducedMotion')

              if (!hasViewport && !hasReducedMotionCheck) {
                context.report({
                  node,
                  messageId: 'addReducedMotion',
                })
              }
            }
          },
        }
      },
    },
  },
}
