'use client'

import { useState, useMemo } from 'react'
import { PlaygroundProvider } from './context/PlaygroundContext'
import { ComponentSelector } from './components/ComponentSelector'
import { PropsEditor } from './components/PropsEditor'
import { LivePreview } from './components/LivePreview'
import { CodeDisplay } from './components/CodeDisplay'
import { PlaygroundToolbar } from './components/PlaygroundToolbar'
import { Sparkles } from 'lucide-react'

export default function PlaygroundPage() {
  return (
    <PlaygroundProvider>
      <div className="relative min-h-screen">
        {/* Background Effects */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="orb-primary -top-20 -left-20 animate-float" />
          <div
            className="orb-violet top-1/3 -right-32 animate-float"
            style={{ animationDelay: '-2s' }}
          />
          <div className="absolute inset-0 dot-pattern opacity-50" />
        </div>

        <div className="max-w-[2000px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-container">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Component Playground</h1>
                <p className="text-muted-foreground">
                  Customize components in real-time and export ready-to-use code
                </p>
              </div>
            </div>

            <PlaygroundToolbar />
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Panel - Component Selection & Props */}
            <div className="xl:col-span-3 space-y-6">
              <ComponentSelector />
              <PropsEditor />
            </div>

            {/* Center Panel - Live Preview */}
            <div className="xl:col-span-5">
              <LivePreview />
            </div>

            {/* Right Panel - Generated Code */}
            <div className="xl:col-span-4">
              <CodeDisplay />
            </div>
          </div>
        </div>
      </div>
    </PlaygroundProvider>
  )
}
