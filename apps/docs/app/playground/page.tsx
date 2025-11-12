'use client'

import React, { useState } from 'react'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { TemplateSelector } from '@/components/Playground/TemplateSelector'
import { PlaygroundControls } from '@/components/Playground/PlaygroundControls'
import { playgroundTemplates } from '@/lib/playground-templates'

export default function PlaygroundPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(playgroundTemplates[0])
  const [code, setCode] = useState(selectedTemplate.code)
  const [dependencies, setDependencies] = useState(selectedTemplate.dependencies)

  const handleTemplateChange = (templateId: string) => {
    const template = playgroundTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(template)
      setCode(template.code)
      setDependencies(template.dependencies)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-800">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                🎮 Interactive Playground
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Try Clarity Chat components live in your browser
              </p>
            </div>
            <PlaygroundControls
              code={code}
              dependencies={dependencies}
              templateName={selectedTemplate.name}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Template Selector */}
          <div className="col-span-12 lg:col-span-3">
            <TemplateSelector
              templates={playgroundTemplates}
              selectedId={selectedTemplate.id}
              onSelect={handleTemplateChange}
            />
          </div>

          {/* Main Playground */}
          <div className="col-span-12 lg:col-span-9">
            <CodePlayground
              initialCode={code}
              dependencies={dependencies}
              onCodeChange={setCode}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
