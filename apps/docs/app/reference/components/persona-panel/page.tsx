import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Persona Panel - Clarity Chat Components',
  description:
    'Switch between different AI personas - strategist, researcher, critic, coach, and custom roles.',
}

export default function PersonaPanelPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Persona Panel</h1>
        <p className="docs-lead">
          Let users switch between different AI personalities. Like having a
          team of experts - strategist, researcher, critic, coach - each with
          their own style.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Think of this like switching between different team members. Need
          strategic advice? Pick the Strategist. Need facts? Pick the
          Researcher. Each persona has different expertise and communication
          styles.
        </p>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function BasicPersonas() {
  const personas = [
    {
      id: '1',
      name: 'Strategic Advisor',
      role: 'strategist',
      summary: 'High-level strategic thinking',
      expertise: ['Planning', 'Decision making', 'Long-term thinking']
    },
    {
      id: '2',
      name: 'Research Assistant',
      role: 'researcher',
      summary: 'Deep dive into facts and data',
      expertise: ['Research', 'Analysis', 'Data gathering']
    },
    {
      id: '3',
      name: 'Helpful Guide',
      role: 'assistant',
      summary: 'Friendly general help',
      expertise: ['Q&A', 'Tutorials', 'Support']
    }
  ]

  return (
    <PersonaPanel
      personas={personas}
      onSelect={(p) => logger.debug('Selected:', p.name)}
    />
  )
}

render(<BasicPersonas />)`}
        />
      </section>

      <section className="docs-section">
        <h2>All Persona Types</h2>
        <CodePlayground
          initialCode={`import { useState } from 'react'

function AllPersonas() {
  const [active, setActive] = useState('1')

  const personas = [
    {
      id: '1',
      name: 'Strategic Thinker',
      role: 'strategist',
      summary: 'Big picture planning and strategy',
      expertise: ['Strategy', 'Planning', 'Vision'],
      temperature: 0.7
    },
    {
      id: '2',
      name: 'Fact Checker',
      role: 'researcher',
      summary: 'Data-driven research and analysis',
      expertise: ['Research', 'Analysis', 'Verification'],
      temperature: 0.3
    },
    {
      id: '3',
      name: 'Friendly Helper',
      role: 'assistant',
      summary: 'General assistance and guidance',
      expertise: ['Help', 'Support', 'Tutorials'],
      temperature: 0.5
    },
    {
      id: '4',
      name: 'Critical Reviewer',
      role: 'critic',
      summary: 'Constructive criticism and review',
      expertise: ['Review', 'Critique', 'Improvement'],
      temperature: 0.6
    },
    {
      id: '5',
      name: 'Personal Coach',
      role: 'coach',
      summary: 'Motivational coaching and guidance',
      expertise: ['Coaching', 'Motivation', 'Growth'],
      temperature: 0.8
    }
  ]

  return (
    <div className="space-y-4">
      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="text-sm">
          <strong>Active:</strong> {personas.find(p => p.id === active)?.name}
        </div>
      </div>

      <PersonaPanel
        personas={personas}
        activePersonaId={active}
        onSelect={(p) => setActive(p.id)}
        showTemperature={true}
      />
    </div>
  )
}

render(<AllPersonas />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable title="PersonaPanel Props" data={personaProps} />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use clear, descriptive persona names</li>
          <li>Show expertise areas to help users choose</li>
          <li>Limit to 3-6 personas (too many is overwhelming)</li>
          <li>Make active persona visually distinct</li>
          <li>Consider showing temperature for advanced users</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/model-selector" className="docs-card">
            <h3>Model Selector</h3>
            <p>Choose AI model</p>
          </a>
          <a href="/reference/components/settings-panel" className="docs-card">
            <h3>Settings Panel</h3>
            <p>Configure AI behavior</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const personaProps = [
  {
    name: 'personas',
    type: 'Persona[]',
    required: true,
    description: 'Array of available personas',
  },
  {
    name: 'activePersonaId',
    type: 'string',
    required: false,
    description: 'ID of currently active persona',
  },
  {
    name: 'onSelect',
    type: '(persona: Persona) => void',
    required: false,
    description: 'Callback when persona is selected',
  },
  {
    name: 'onConfigure',
    type: '(persona: Persona) => void',
    required: false,
    description: 'Callback to configure persona settings',
  },
  {
    name: 'showTemperature',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Display temperature parameter',
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Additional CSS classes',
  },
]
