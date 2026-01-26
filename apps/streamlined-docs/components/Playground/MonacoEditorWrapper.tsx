'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import Editor, { type Monaco } from '@monaco-editor/react'
import type { editor as MonacoEditor } from 'monaco-editor'
import { NIGHT_OWL_MONACO_THEME } from '@clarity-chat/react'
import { CodeEditorSkeleton } from './CodeEditorSkeleton'

interface MonacoEditorInternalProps {
  value: string
  onChange: (value: string) => void
  language: string
  theme: 'vs-dark' | 'light'
  height: string
}

// Internal Monaco component that will be lazy loaded
function MonacoEditorInternal({
  value,
  onChange,
  language,
  theme,
  height
}: MonacoEditorInternalProps) {
  // Register Night Owl theme with Monaco
  const handleEditorDidMount = (
    editor: MonacoEditor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    // Register the Night Owl theme
    monaco.editor.defineTheme('night-owl', NIGHT_OWL_MONACO_THEME)

    // Set the theme based on the app theme, defaulting to Night Owl for dark
    const editorTheme = theme === 'vs-dark' ? 'night-owl' : 'light'
    monaco.editor.setTheme(editorTheme)
  }

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={(value) => onChange(value || '')}
      onMount={handleEditorDidMount}
      theme={theme === 'vs-dark' ? 'night-owl' : 'light'}
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

// Dynamic import - Monaco only loads when this component renders
const DynamicMonacoEditor = dynamic(() => Promise.resolve(MonacoEditorInternal), {
  loading: () => <CodeEditorSkeleton />,
  ssr: false // Monaco requires browser APIs
})

interface MonacoEditorWrapperProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: 'vs-dark' | 'light'
  height?: string
}

export function MonacoEditorWrapper({
  value,
  onChange,
  language = 'typescript',
  theme = 'vs-dark',
  height = '100%'
}: MonacoEditorWrapperProps) {
  return (
    <Suspense fallback={<CodeEditorSkeleton />}>
      <DynamicMonacoEditor
        value={value}
        onChange={onChange}
        language={language}
        theme={theme}
        height={height}
      />
    </Suspense>
  )
}
