'use client'

import React from 'react'
import Editor from '@monaco-editor/react'
import { useTheme } from 'next-themes'

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
  height = '100%',
}: CodeEditorProps) {
  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('night-owl', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '637777', fontStyle: 'italic' },
        { token: 'constant', foreground: '82aaff' },
        { token: 'keyword', foreground: 'c792ea' },
        { token: 'parameter', foreground: 'd7dbe0' },
        { token: 'variable', foreground: 'd6deeb' },
        { token: 'string', foreground: 'ecc48d' },
        { token: 'number', foreground: 'f78c6c' },
        { token: 'type', foreground: 'ffcb8b' },
        { token: 'class', foreground: 'ffcb8b' },
        { token: 'function', foreground: '82aaff' },
        { token: 'tag', foreground: '7fdbca' },
        { token: 'attribute.name', foreground: 'addb67' },
        { token: 'attribute.value', foreground: 'ecc48d' },
        { token: 'punctuation', foreground: '7fdbca' },
      ],
      colors: {
        'editor.background': '#011627',
        'editor.foreground': '#d6deeb',
        'editorCursor.foreground': '#80a4c2',
        'editor.lineHighlightBackground': '#010e17',
        'editorLineNumber.foreground': '#4b6479',
        'editor.selectionBackground': '#1d3b53',
        'editorIndentGuide.background': '#5f7e9745',
        'editorIndentGuide.activeBackground': '#5f7e97',
      },
    })
  }

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={(value) => onChange(value || '')}
      theme="night-owl"
      beforeMount={handleEditorWillMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        formatOnPaste: true,
        formatOnType: true,
        quickSuggestions: true,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        snippetSuggestions: 'top',
      }}
    />
  )
}
