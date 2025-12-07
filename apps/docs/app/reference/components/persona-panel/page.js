import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Persona Panel - Clarity Chat Components',
    description: 'Switch between different AI personas - strategist, researcher, critic, coach, and custom roles.',
};
export default function PersonaPanelPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "Persona Panel" }), _jsx("p", { className: "docs-lead", children: "Let users switch between different AI personalities. Like having a team of experts - strategist, researcher, critic, coach - each with their own style." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "Think of this like switching between different team members. Need strategic advice? Pick the Strategist. Need facts? Pick the Researcher. Each persona has different expertise and communication styles." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function BasicPersonas() {
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
      onSelect={(p) => console.log('Selected:', p.name)}
    />
  )
}

render(<BasicPersonas />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "All Persona Types" }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react'

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

render(<AllPersonas />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "PersonaPanel Props", data: personaProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Use clear, descriptive persona names" }), _jsx("li", { children: "Show expertise areas to help users choose" }), _jsx("li", { children: "Limit to 3-6 personas (too many is overwhelming)" }), _jsx("li", { children: "Make active persona visually distinct" }), _jsx("li", { children: "Consider showing temperature for advanced users" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/model-selector", className: "docs-card", children: [_jsx("h3", { children: "Model Selector" }), _jsx("p", { children: "Choose AI model" })] }), _jsxs("a", { href: "/reference/components/settings-panel", className: "docs-card", children: [_jsx("h3", { children: "Settings Panel" }), _jsx("p", { children: "Configure AI behavior" })] })] })] })] }));
}
const personaProps = [
    {
        name: 'personas',
        type: 'Persona[]',
        required: true,
        description: 'Array of available personas'
    },
    {
        name: 'activePersonaId',
        type: 'string',
        required: false,
        description: 'ID of currently active persona'
    },
    {
        name: 'onSelect',
        type: '(persona: Persona) => void',
        required: false,
        description: 'Callback when persona is selected'
    },
    {
        name: 'onConfigure',
        type: '(persona: Persona) => void',
        required: false,
        description: 'Callback to configure persona settings'
    },
    {
        name: 'showTemperature',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Display temperature parameter'
    },
    {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes'
    }
];
//# sourceMappingURL=page.js.map