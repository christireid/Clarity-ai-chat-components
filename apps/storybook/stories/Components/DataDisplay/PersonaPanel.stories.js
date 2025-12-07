import { PersonaPanel } from '@clarity-chat/react';
const meta = {
    title: 'Components/DataDisplay/PersonaPanel',
    component: PersonaPanel,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Switch between tailored assistants optimized for different AI chat workflows. Supports multiple persona roles with custom configurations.',
            },
        },
        layout: 'padded',
    },
};
export default meta;
const mockPersonas = [
    {
        id: '1',
        name: 'Code Assistant',
        role: 'assistant',
        summary: 'Expert in software development and debugging',
        expertise: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
        temperature: 0.7,
        tags: ['coding', 'debugging'],
    },
    {
        id: '2',
        name: 'Research Analyst',
        role: 'researcher',
        summary: 'Deep dive into topics with thorough analysis',
        expertise: ['Research', 'Analysis', 'Data'],
        temperature: 0.5,
        tags: ['research', 'analysis'],
    },
    {
        id: '3',
        name: 'Creative Writer',
        role: 'custom',
        summary: 'Helps with creative writing and storytelling',
        expertise: ['Writing', 'Creative', 'Storytelling'],
        temperature: 0.9,
        tags: ['creative', 'writing'],
    },
];
export const Default = {
    args: {
        personas: mockPersonas,
    },
};
export const WithSelection = {
    args: {
        personas: mockPersonas,
        activePersonaId: '1',
        onSelect: (persona) => {
            console.log('Selected persona:', persona.name);
            alert(`Selected: ${persona.name}`);
        },
    },
};
export const WithConfiguration = {
    args: {
        personas: mockPersonas,
        activePersonaId: '2',
        onSelect: (persona) => console.log('Selected:', persona),
        onConfigure: (persona) => {
            console.log('Configuring persona:', persona.name);
            alert(`Configure: ${persona.name}`);
        },
    },
};
export const AllRoles = {
    args: {
        personas: [
            {
                id: 'strategist',
                name: 'Strategic Advisor',
                role: 'strategist',
                summary: 'Strategic planning and decision making',
                expertise: ['Strategy', 'Planning'],
                temperature: 0.6,
            },
            {
                id: 'researcher',
                name: 'Research Expert',
                role: 'researcher',
                summary: 'Deep research and analysis',
                expertise: ['Research'],
                temperature: 0.4,
            },
            {
                id: 'assistant',
                name: 'General Assistant',
                role: 'assistant',
                summary: 'General purpose assistant',
                expertise: ['General'],
                temperature: 0.7,
            },
            {
                id: 'critic',
                name: 'Code Critic',
                role: 'critic',
                summary: 'Critical analysis and review',
                expertise: ['Review', 'Critique'],
                temperature: 0.3,
            },
            {
                id: 'coach',
                name: 'Learning Coach',
                role: 'coach',
                summary: 'Teaching and mentoring',
                expertise: ['Education', 'Coaching'],
                temperature: 0.8,
            },
        ],
    },
};
export const WithoutTemperature = {
    args: {
        personas: mockPersonas,
        showTemperature: false,
    },
};
export const CustomSubtitle = {
    args: {
        personas: mockPersonas,
        toneSubtitle: 'Components/DataDisplay/PersonaPanel',
    },
};
//# sourceMappingURL=PersonaPanel.stories.js.map