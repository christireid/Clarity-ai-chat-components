/**
 * Code Helper Template
 * 
 * AI assistant specialized for programming help
 */

import React from 'react'
import { AIAssistantTemplate } from './ai-assistant'
import { minimalDarkTheme } from '../theme/presets'
import { ThemeProvider } from '../theme/ThemeProvider'

export interface CodeHelperTemplateProps {
  apiKeys?: {
    openai?: string
    anthropic?: string
    google?: string
  }
  languages?: string[]
}

/**
 * Code Helper Template
 * 
 * Features:
 * - Syntax highlighting
 * - Code execution examples
 * - Language-specific help
 * - Dark theme optimized for code
 * - File upload for code review
 * 
 * @example
 * ```tsx
 * <CodeHelperTemplate
 *   apiKeys={{ openai: process.env.OPENAI_API_KEY }}
 *   languages={['typescript', 'python', 'react']}
 * />
 * ```
 */
export function CodeHelperTemplate({
  apiKeys,
  languages = ['javascript', 'typescript', 'python', 'react', 'sql'],
}: CodeHelperTemplateProps) {
  const systemPrompt = `You are an expert programming assistant. You help with:
- Writing clean, efficient code
- Debugging and error fixing
- Code reviews and best practices
- Explaining complex concepts
- Providing examples and documentation

Supported languages: ${languages.join(', ')}

Always provide code examples with proper syntax highlighting using markdown code blocks.
Explain your reasoning and suggest improvements when relevant.`

  return (
    <ThemeProvider theme={minimalDarkTheme}>
      <AIAssistantTemplate
        apiKeys={apiKeys}
        systemPrompt={systemPrompt}
        defaultModel="gpt-4-turbo-preview"
        enableFileUpload={true}
        enableContextManagement={true}
        maxTokens={8192}
      />
    </ThemeProvider>
  )
}