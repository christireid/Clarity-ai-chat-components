import { ReactNode } from 'react';
interface TutorialStepProps {
    step: number;
    title: string;
    completed?: boolean;
    children: ReactNode;
    nextStepHref?: string;
    nextStepTitle?: string;
}
export declare function TutorialStep({ step, title, completed, children, nextStepHref, nextStepTitle, }: TutorialStepProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=TutorialStep.d.ts.map