import { type NavItem } from '@/components/Navigation/Sidebar';
interface DocsLayoutProps {
    children: React.ReactNode;
    navigation: NavItem[];
    tableOfContents?: {
        title: string;
        id: string;
        level: number;
    }[];
}
export declare function DocsLayout({ children, navigation, tableOfContents, }: DocsLayoutProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=DocsLayout.d.ts.map