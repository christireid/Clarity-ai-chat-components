import type { ComponentDefinition, PropValue } from '../types'

export function generateCode(
  component: ComponentDefinition,
  props: Record<string, PropValue>,
  language: 'tsx' | 'jsx',
  fullExample: boolean
): string {
  const isTypeScript = language === 'tsx'

  // Filter out default values
  const customProps = Object.entries(props).filter(([key, value]) => {
    const propDef = component.props.find((p) => p.name === key)
    return propDef && value !== propDef.default && value !== undefined
  })

  // Generate props string
  const propsString = customProps
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `  ${key}="${value}"`
      } else if (typeof value === 'boolean') {
        return value ? `  ${key}` : `  ${key}={false}`
      } else if (typeof value === 'number') {
        return `  ${key}={${value}}`
      } else if (typeof value === 'object') {
        return `  ${key}={${JSON.stringify(value)}}`
      }
      return `  ${key}={${JSON.stringify(value)}}`
    })
    .join('\n')

  if (!fullExample) {
    // Component only
    return `<${component.id}${propsString ? '\n' + propsString + '\n' : ' '}/>`.trim()
  }

  // Full example with imports and wrapper
  const imports = [
    `import { ${component.id} } from '${component.importPath}'`,
  ]

  if (isTypeScript) {
    imports.push(
      `import type { ${component.id}Props } from '${component.importPath}'`
    )
  }

  const componentCode = `<${component.id}${propsString ? '\n' + propsString + '\n' : ' '}/>`

  const code = `${imports.join('\n')}

export ${isTypeScript ? 'function' : 'const'} Example${isTypeScript ? '()' : ' ='} ${isTypeScript ? '{' : '() => {'}
  return (
    <div className="container mx-auto p-4">
      ${componentCode}
    </div>
  )
}${isTypeScript ? '' : '\n\nexport default Example'}`

  return code
}

export function generatePropsInterface(component: ComponentDefinition): string {
  const props = component.props
    .map((prop) => {
      const optional = !prop.required ? '?' : ''
      let type = 'any'

      switch (prop.type) {
        case 'string':
          type = 'string'
          break
        case 'number':
          type = 'number'
          break
        case 'boolean':
          type = 'boolean'
          break
        case 'select':
          if (prop.options) {
            type = prop.options.map((o) => `'${o.value}'`).join(' | ')
          }
          break
        case 'function':
          type = '() => void'
          break
        case 'json':
          type = 'object'
          break
      }

      return `  /** ${prop.description} */\n  ${prop.name}${optional}: ${type}`
    })
    .join('\n\n')

  return `interface ${component.id}Props {\n${props}\n}`
}

export function generateUsageExamples(
  component: ComponentDefinition
): Array<{ title: string; code: string }> {
  if (!component.examples) return []

  return component.examples.map((example) => {
    const propsString = Object.entries(example.props)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `  ${key}="${value}"`
        } else if (typeof value === 'boolean') {
          return value ? `  ${key}` : `  ${key}={false}`
        } else if (typeof value === 'number') {
          return `  ${key}={${value}}`
        } else {
          return `  ${key}={${JSON.stringify(value)}}`
        }
      })
      .join('\n')

    const code = `// ${example.description}
<${component.id}
${propsString}
/>`

    return {
      title: example.name,
      code,
    }
  })
}
