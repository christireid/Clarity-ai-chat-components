import * as React from 'react';
export type PersonaRole = 'strategist' | 'researcher' | 'assistant' | 'critic' | 'coach' | 'custom';
export interface Persona {
    id: string;
    name: string;
    role: PersonaRole;
    summary: string;
    expertise: string[];
    avatarUrl?: string;
    color?: string;
    temperature?: number;
    tags?: string[];
}
export interface PersonaPanelProps {
    personas: Persona[];
    activePersonaId?: string;
    onSelect?: (persona: Persona) => void;
    onConfigure?: (persona: Persona) => void;
    toneSubtitle?: string;
    showTemperature?: boolean;
    className?: string;
}
export declare const PersonaPanel: React.NamedExoticComponent<PersonaPanelProps>;
//# sourceMappingURL=persona-panel.d.ts.map