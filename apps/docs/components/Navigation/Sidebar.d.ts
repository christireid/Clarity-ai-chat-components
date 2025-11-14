export interface NavItem {
    title: string;
    href?: string;
    items?: NavItem[];
}
interface SidebarProps {
    navigation: NavItem[];
}
export declare function Sidebar({ navigation }: SidebarProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Sidebar.d.ts.map