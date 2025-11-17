'use client'

import { useState } from 'react'
import { Copy, Check, Download } from 'lucide-react'
import clsx from 'clsx'

interface CodeGeneratorProps {
  componentName: string
  props: Record<string, any>
  imports?: string[]
  wrapperCode?: string
  className?: string
}

export function CodeGenerator({
  componentName,
  props,
  imports = [],
  wrapperCode,
  className,
}: CodeGeneratorProps) {
  const [language, setLanguage] = useState<'tsx' | 'jsx'>('tsx')
  const [copied, setCopied] = useState(false)

  const generateCode = () => {
    const defaultImports = [`import { ${componentName} } from '@clarity-chat/react'`]
    const allImports = [...defaultImports, ...imports]

    const propsString = Object.entries(props)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        if (typeof value === 'boolean') {
          return value ? key : null
        }
        if (typeof value === 'string') {
          return `${key}="${value}"`
        }
        if (typeof value === 'number') {
          return `${key}={${value}}`
        }
        if (typeof value === 'function') {
          return `${key}={${value.toString()}}`
        }
        return `${key}={${JSON.stringify(value)}}`
      })
      .filter(Boolean)
      .join('\n  ')

    const componentCode = `<${componentName}${propsString ? `\n  ${propsString}` : ''}${
      wrapperCode ? '>' : ' />'
    }${wrapperCode ? `\n  ${wrapperCode}\n</${componentName}>` : ''}`

    const fullCode = `${allImports.join('\n')}

export default function Example() {
  return (
    ${componentCode}
  )
}`

    return language === 'jsx'
      ? fullCode.replace(/: \w+/g, '').replace(/<(\w+)>/g, '<$1>')
      : fullCode
  }

  const generatedCode = generateCode()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${componentName}Example.${language}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={clsx('border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm text-gray-900 dark:text-gray-50">
            💻 Generated Code
          </span>
          <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
            <button
              onClick={() => setLanguage('tsx')}
              className={clsx(
                'px-3 py-1 text-xs font-mono font-semibold rounded transition-all',
                language === 'tsx'
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              TypeScript
            </button>
            <button
              onClick={() => setLanguage('jsx')}
              className={clsx(
                'px-3 py-1 text-xs font-mono font-semibold rounded transition-all',
                language === 'jsx'
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              JavaScript
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              copied
                ? 'bg-green-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
            )}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
            title="Download as file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="bg-gray-900 dark:bg-black">
        <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-100">
          <code>{generatedCode}</code>
        </pre>
      </div>
    </div>
  )
}
