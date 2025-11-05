/**
 * InitWizard - Interactive setup wizard using Ink
 */
interface InitWizardProps {
    detectedFramework?: string;
    packageManager: string;
    onComplete: (config: any) => void;
}
export declare function InitWizard({ detectedFramework, packageManager, onComplete }: InitWizardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=InitWizard.d.ts.map