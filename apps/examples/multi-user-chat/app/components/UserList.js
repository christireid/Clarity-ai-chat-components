import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
export function UserList({ users, currentUserId }) {
    return (_jsxs("div", { style: {
            width: '250px',
            borderLeft: '1px solid rgba(128, 128, 128, 0.2)',
            padding: '1rem',
            overflowY: 'auto',
        }, children: [_jsxs("h3", { style: {
                    fontSize: '1rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                }, children: ["Active Users (", users.length, ")"] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.5rem' }, children: users.map((user) => (_jsxs("div", { style: {
                        padding: '0.5rem',
                        borderRadius: '6px',
                        backgroundColor: user.id === currentUserId
                            ? 'rgba(37, 99, 235, 0.1)'
                            : 'rgba(128, 128, 128, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }, children: [_jsx("div", { style: {
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#10b981',
                            } }), _jsxs("span", { style: {
                                fontSize: '0.875rem',
                                fontWeight: user.id === currentUserId ? 600 : 400,
                            }, children: [user.username, user.id === currentUserId && ' (You)'] })] }, user.id))) })] }));
}
//# sourceMappingURL=UserList.js.map