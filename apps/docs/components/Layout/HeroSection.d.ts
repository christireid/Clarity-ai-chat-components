interface HeroSectionProps {
    title: React.ReactNode;
    description: string;
    primaryCta: {
        text: string;
        href: string;
    };
    secondaryCta?: {
        text: string;
        href: string;
    };
}
export declare function HeroSection({ title, description, primaryCta, secondaryCta, }: HeroSectionProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=HeroSection.d.ts.map