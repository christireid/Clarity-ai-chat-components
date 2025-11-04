interface User {
    id: string;
    username: string;
    room: string;
    joinedAt: number;
}
interface UserListProps {
    users: User[];
    currentUserId: string;
}
export declare function UserList({ users, currentUserId }: UserListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=UserList.d.ts.map