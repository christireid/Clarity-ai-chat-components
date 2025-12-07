import { Metadata } from 'next';
export declare const dynamic = "force-dynamic";
interface CommercialPageProps {
    params: Promise<{
        slug: string;
    }>;
}
export declare function generateStaticParams(): Promise<{
    slug: string;
}[]>;
export declare function generateMetadata({ params }: CommercialPageProps): Promise<Metadata>;
export default function CommercialPage({ params }: CommercialPageProps): Promise<import("react/jsx-runtime").JSX.Element>;
export {};
//# sourceMappingURL=page.d.ts.map