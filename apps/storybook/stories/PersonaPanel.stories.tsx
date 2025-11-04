import type { Meta, StoryObj } from '@storybook/react'
import { PersonaPanel } from '@clarity-chat/react'
import { useState } from 'react'

/**
 * PersonaPanel allows users to switch between different AI personas.
 * 
 * **Key Features:**
 * - Multiple AI personalities
 * - Visual persona cards
 * - Customizable traits
 * - Context switching
 * 
 * **Use Cases:**
 * - Multi-purpose assistants
 * - Role-based responses
 * - User preference
 * - Specialized experts
 */
const meta = {
  title: 'Components/PersonaPanel',
  component: PersonaPanel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Switch between different AI personas with distinct personalities and expertise.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '700px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PersonaPanel>

export default meta
type Story = StoryObj<typeof meta>

const defaultPersonas = [
  {
    id: 'professional',
    name: 'Professional Assistant',
    description: 'Formal and precise responses for business contexts',
    avatar: '👔',
    traits: ['Formal', 'Precise', 'Detailed'],
  },
  {
    id: 'friendly',
    name: 'Friendly Helper',
    description: 'Casual and warm responses for everyday conversations',
    avatar: '😊',
    traits: ['Casual', 'Warm', 'Conversational'],
  },
  {
    id: 'technical',
    name: 'Technical Expert',
    description: 'In-depth technical knowledge with code examples',
    avatar: '🔧',
    traits: ['Technical', 'Detailed', 'Examples'],
  },
]

export const Default: Story = {
  args: {
    personas: defaultPersonas,
    selectedPersona: 'professional',
    onPersonaChange: (personaId: string) => {
      console.log('Selected persona:', personaId)
    },
  },
}

export const WithMorePersonas: Story = {
  args: {
    personas: [
      ...defaultPersonas,
      {
        id: 'creative',
        name: 'Creative Writer',
        description: 'Imaginative and expressive for creative projects',
        avatar: '✍️',
        traits: ['Creative', 'Expressive', 'Imaginative'],
      },
      {
        id: 'teacher',
        name: 'Patient Teacher',
        description: 'Explains concepts step-by-step with examples',
        avatar: '👨‍🏫',
        traits: ['Patient', 'Clear', 'Educational'],
      },
      {
        id: 'researcher',
        name: 'Research Assistant',
        description: 'Thorough research with cited sources',
        avatar: '🔬',
        traits: ['Thorough', 'Analytical', 'Cited'],
      },
    ],
    selectedPersona: 'friendly',
    onPersonaChange: (personaId: string) => {
      console.log('Selected persona:', personaId)
    },
  },
}

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState('professional')
    
    return (
      <div className="space-y-4">
        <PersonaPanel
          personas={defaultPersonas}
          selectedPersona={selected}
          onPersonaChange={setSelected}
        />
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold mb-2">Current Persona:</p>
          <p className="text-sm text-gray-700">
            {defaultPersonas.find(p => p.id === selected)?.name}
          </p>
        </div>
      </div>
    )
  },
}

export const InSidebar: Story = {
  render: () => {
    const [selected, setSelected] = useState('friendly')
    
    return (
      <div className="flex h-96 border rounded-lg overflow-hidden">
        <div className="w-80 bg-gray-50 border-r p-4">
          <h3 className="font-semibold mb-3">AI Persona</h3>
          <PersonaPanel
            personas={defaultPersonas}
            selectedPersona={selected}
            onPersonaChange={setSelected}
            layout="vertical"
          />
        </div>
        
        <div className="flex-1 p-6">
          <h2 className="text-xl font-bold mb-3">Chat Interface</h2>
          <p className="text-gray-600 mb-4">
            The AI will respond in the style of the selected persona.
          </p>
          
          <div className="space-y-3">
            <div className="flex justify-end">
              <div className="max-w-xs bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
                Tell me about AI
              </div>
            </div>
            
            <div className="flex justify-start gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                {defaultPersonas.find(p => p.id === selected)?.avatar}
              </div>
              <div className="max-w-md bg-gray-100 px-4 py-2 rounded-lg text-sm">
                {selected === 'professional' && (
                  'Artificial Intelligence refers to computational systems designed to perform tasks that typically require human intelligence...'
                )}
                {selected === 'friendly' && (
                  'Hey! AI is pretty cool - it\'s basically computers learning to do smart stuff that humans usually do...'
                )}
                {selected === 'technical' && (
                  'AI encompasses machine learning algorithms, neural networks, and deep learning architectures...'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
}

export const CompactView: Story = {
  render: () => {
    const [selected, setSelected] = useState('professional')
    
    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium">AI Persona</label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            {defaultPersonas.map((persona) => (
              <option key={persona.id} value={persona.id}>
                {persona.avatar} {persona.name}
              </option>
            ))}
          </select>
        </div>
        
        <p className="text-xs text-gray-600">
          {defaultPersonas.find(p => p.id === selected)?.description}
        </p>
      </div>
    )
  },
}

export const SpecializedExperts: Story = {
  args: {
    personas: [
      {
        id: 'code',
        name: 'Code Assistant',
        description: 'Expert in multiple programming languages',
        avatar: '💻',
        traits: ['Code', 'Debug', 'Optimize'],
        specialties: ['Python', 'JavaScript', 'TypeScript', 'Rust'],
      },
      {
        id: 'design',
        name: 'Design Advisor',
        description: 'UI/UX design principles and best practices',
        avatar: '🎨',
        traits: ['Visual', 'UX', 'Accessibility'],
        specialties: ['Figma', 'Design Systems', 'Color Theory'],
      },
      {
        id: 'data',
        name: 'Data Scientist',
        description: 'Statistical analysis and machine learning',
        avatar: '📊',
        traits: ['Analytical', 'ML', 'Visualization'],
        specialties: ['Pandas', 'NumPy', 'TensorFlow', 'Scikit-learn'],
      },
    ],
    selectedPersona: 'code',
    onPersonaChange: (id: string) => console.log(id),
  },
}
