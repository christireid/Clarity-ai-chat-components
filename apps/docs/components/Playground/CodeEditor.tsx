'use client'

import React from 'react'
import Editor from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { NIGHT_OWL_MONACO_THEME } from '@clarity-chat/react'

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

  // Register Night Owl theme with Monaco
  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Register the Night Owl theme
    monaco.editor.defineTheme('night-owl', NIGHT_OWL_MONACO_THEME)

    // Set the theme based on the app theme, defaulting to Night Owl for dark
    const editorTheme = theme === 'dark' ? 'night-owl' : 'light'
    monaco.editor.setTheme(editorTheme)
  }

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={(value) => onChange(value || '')}
      onMount={handleEditorDidMount}
      theme={theme === 'dark' ? 'night-owl' : 'light'}
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
