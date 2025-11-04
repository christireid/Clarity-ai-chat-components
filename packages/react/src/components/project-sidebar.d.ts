import * as React from 'react';
import type { Project } from '@clarity-chat/types';
export interface ProjectSidebarProps {
    projects: Project[];
    selectedProjectId?: string;
    selectedChatId?: string;
    onProjectSelect: (projectId: string) => void;
    onProjectCreate: () => void;
    onProjectEdit?: (projectId: string) => void;
    onProjectDelete?: (projectId: string) => void;
    onChatSelect: (chatId: string) => void;
    onChatCreate: () => void;
    onChatEdit?: (chatId: string) => void;
    onChatDelete?: (chatId: string) => void;
    className?: string;
}
export declare const ProjectSidebar: React.NamedExoticComponent<ProjectSidebarProps>;
//# sourceMappingURL=project-sidebar.d.ts.map