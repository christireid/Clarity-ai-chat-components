'use client'

import React from 'react'
import {
  Sandpack,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from '@codesandbox/sandpack-react'
import { nightOwl, aquaBlue } from '@codesandbox/sandpack-themes'
import { useTheme } from 'next-themes'

interface SandpackWrapperProps {
  code: string
  dependencies?: Record<string, string>
  files?: Record<string, string>
  template?: 'react' | 'react-ts'
}

const CustomSandpackPreview = () => {
  const { sandpack } = useSandpack()
  // Add any custom preview logic here if needed
  return <SandpackPreview style={{ height: '100%' }} showOpenInCodeSandbox={false} />
}

export function SandpackWrapper({
  code,
  dependencies = {},
  files = {},
  template = 'react-ts',
}: SandpackWrapperProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const customFiles = {
    '/App.tsx': code,
    ...files,
  }

  const customDependencies = {
    '@clarity-chat/react': 'latest',
    'lucide-react': 'latest',
    'framer-motion': 'latest',
    'clsx': 'latest',
    'tailwind-merge': 'latest',
    ...dependencies,
  }

  return (
    <SandpackProvider
      template={template}
      theme={isDark ? nightOwl : aquaBlue}
      files={customFiles}
      customSetup={{
        dependencies: customDependencies,
      }}
      options={{
        externalResources: ['https://cdn.tailwindcss.com'],
      }}
    >
      <SandpackLayout style={{ height: '100%', border: 'none', borderRadius: 0 }}>
        <SandpackCodeEditor
          showLineNumbers
          showInlineErrors
          showTabs
          style={{ height: '100%' }}
        />
        <CustomSandpackPreview />
      </SandpackLayout>
    </SandpackProvider>
  )
}
