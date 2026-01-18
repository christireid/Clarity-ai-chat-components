'use client'

import { motion } from 'framer-motion'
import { Copy, Check, Play, Code2 } from 'lucide-react'
import { useState, useCallback } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'

interface CodeSandboxProps {
  title?: string
  language: string
  code: string
  description?: string
  executable?: boolean
  highlightLines?: number[]
}

const languageLabels: Record<string, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  python: 'Python',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  bash: 'Bash',
  sql: 'SQL',
}

const languageColors: Record<string, string> = {
  typescript: 'bg-blue-500',
  javascript: 'bg-yellow-500',
  python: 'bg-green-500',
  html: 'bg-orange-500',
  css: 'bg-pink-500',
  json: 'bg-slate-500',
  bash: 'bg-slate-700',
  sql: 'bg-purple-500',
}

export function CodeSandbox({
  title,
  language,
  code,
  description,
  executable = false,
  highlightLines = [],
}: CodeSandboxProps) {
  const [copied, setCopied] = useState(false)
  const [output, setOutput] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const handleRun = useCallback(async () => {
    if (!executable) return

    // Security: Instead of executing arbitrary code with new Function(),
    // we copy the code to clipboard and suggest the user run it in their browser console
    setIsRunning(true)
    setOutput(null)

    try {
      await navigator.clipboard.writeText(code)
      setOutput(
        'Code copied! Paste in your browser console (F12 → Console) to run it.'
      )
    } catch {
      setOutput(
        'Open your browser console (F12 → Console) and paste this code to run it.'
      )
    } finally {
      setIsRunning(false)
    }
  }, [code, executable])

  // Syntax highlighting
  const prismLanguage =
    language === 'typescript'
      ? 'typescript'
      : language === 'javascript'
        ? 'javascript'
        : language === 'python'
          ? 'python'
          : language === 'html'
            ? 'markup'
            : language === 'css'
              ? 'css'
              : language === 'json'
                ? 'json'
                : language === 'bash'
                  ? 'bash'
                  : language === 'sql'
                    ? 'sql'
                    : 'javascript'

  const highlightedCode = Prism.languages[prismLanguage]
    ? Prism.highlight(code, Prism.languages[prismLanguage], prismLanguage)
    : code

  const lines = code.split('\n')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl border border-[#1e293b]"
      style={{ backgroundColor: '#011627' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-[#1e293b]"
        style={{ backgroundColor: '#0b2942' }}
      >
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          {/* Title and language */}
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-slate-400" />
            {title && <span className="text-sm text-[#d6deeb]">{title}</span>}
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium text-white ${languageColors[language] || 'bg-slate-600'}`}
            >
              {languageLabels[language] || language}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {executable && (
            <motion.button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play
                className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`}
              />
              {isRunning ? 'Running...' : 'Run'}
            </motion.button>
          )}
          <motion.button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div
          className="px-4 py-2 border-b border-[#1e293b]"
          style={{ backgroundColor: '#0b294280' }}
        >
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      )}

      {/* Code */}
      <div className="relative overflow-x-auto">
        <pre
          className="p-4 text-sm leading-relaxed"
          style={{ backgroundColor: '#011627' }}
        >
          <code className="font-mono">
            {lines.map((line, index) => (
              <motion.div
                key={index}
                className={`flex ${highlightLines.includes(index + 1) ? 'bg-yellow-500/10 -mx-4 px-4' : ''}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <span className="inline-block w-8 text-slate-500 select-none text-right mr-4">
                  {index + 1}
                </span>
                <span
                  className="text-[#d6deeb]"
                  dangerouslySetInnerHTML={{
                    __html: Prism.languages[prismLanguage]
                      ? Prism.highlight(
                          line,
                          Prism.languages[prismLanguage],
                          prismLanguage
                        )
                      : line,
                  }}
                />
              </motion.div>
            ))}
          </code>
        </pre>
      </div>

      {/* Output */}
      {output !== null && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-[#1e293b]"
        >
          <div
            className="px-4 py-2 text-xs text-slate-400 font-medium"
            style={{ backgroundColor: '#0b2942' }}
          >
            Output
          </div>
          <pre className="p-4 text-sm font-mono text-emerald-400 bg-[#010e17] max-h-32 overflow-auto">
            {output}
          </pre>
        </motion.div>
      )}
    </motion.div>
  )
}
