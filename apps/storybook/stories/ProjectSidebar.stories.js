import { ProjectSidebar } from '@clarity-chat/react';
const meta = {
    title: 'Components/ProjectSidebar',
    component: ProjectSidebar,
    parameters: { layout: 'fullscreen' },
    tags: ['autodocs'],
};
export default meta;
const mockProjects = [
    { id: '1', name: 'React Tutorial', conversationCount: 5, lastActive: Date.now() - 3600000 },
    { id: '2', name: 'TypeScript Guide', conversationCount: 3, lastActive: Date.now() - 7200000 },
];
export const Default = {
    args: { projects: mockProjects, activeProjectId: '1', onProjectSelect: (id) => console.log(id) },
};
//# sourceMappingURL=ProjectSidebar.stories.js.map