import { Metadata } from 'next';
export declare const dynamic = "force-dynamic";
interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}
export declare function generateStaticParams(): Promise<{
    slug: string;
}[]>;
export declare function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata>;
export default function BlogPostPage({ params }: BlogPostPageProps): Promise<import("react/jsx-runtime").JSX.Element>;
export {};
//# sourceMappingURL=page.d.ts.map