import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'ProjectSidebar - Clarity Chat Components',
  description: 'Sidebar for navigating conversations, documents, and tools.',
}

export default function ProjectSidebarPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>ProjectSidebar</h1>
        <p className="docs-lead">
          A structured sidebar for AI projects showing threads, files, and quick actions.
        </p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function Example() {
  return (
    <div className="h-[420px] border rounded overflow-hidden">
      <ProjectSidebar />
    </div>
  )
}

render(<Example />)`}
        />
      </section>
    </div>
  )
}
