interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}
interface UserListProps {
    users: User[];
    onSelect: (user: User) => void;
}
export declare function UserList({ users, onSelect }: UserListProps): import("react").JSX.Element;
export declare function Dashboard(): import("react").JSX.Element;
export declare function Header(): import("react").JSX.Element;
export {};
//# sourceMappingURL=bad-performance.d.ts.map