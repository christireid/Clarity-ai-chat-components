'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { CodeEditorSkeleton } from './CodeEditorSkeleton'

// Dynamically import the Monaco wrapper to enable code splitting
const MonacoEditorWrapper = dynamic(
  () => import('./MonacoEditorWrapper').then(mod => ({ default: mod.MonacoEditorWrapper })),
  {
    loading: () => <CodeEditorSkeleton />,
    ssr: false
  }
)

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  height?: string
}

export default function CodeEditor({
  value,
  onChange,
  language = 'typescript',
  height = '100%'
}: CodeEditorProps) {
  const { theme } = useTheme()

  return (
    <MonacoEditorWrapper
      value={value}
      onChange={onChange}
      language={language}
      theme={theme === 'dark' ? 'vs-dark' : 'light'}
      height={height}
    />
  )
}
