import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export function JoinForm({ onJoin }) {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('general');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onJoin({ username: username.trim(), room });
        }
    };
    return (_jsxs("div", { style: {
            maxWidth: '400px',
            margin: '0 auto',
            padding: '2rem',
        }, children: [_jsx("h2", { style: {
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    textAlign: 'center',
                }, children: "Join Multi-User Chat" }), _jsxs("form", { onSubmit: handleSubmit, style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "username", style: {
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: 500,
                                }, children: "Username" }), _jsx("input", { id: "username", type: "text", value: username, onChange: (e) => setUsername(e.target.value), required: true, style: {
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid rgba(128, 128, 128, 0.3)',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                }, placeholder: "Enter your username" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "room", style: {
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: 500,
                                }, children: "Room" }), _jsxs("select", { id: "room", value: room, onChange: (e) => setRoom(e.target.value), style: {
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid rgba(128, 128, 128, 0.3)',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                }, children: [_jsx("option", { value: "general", children: "General" }), _jsx("option", { value: "tech", children: "Tech Support" }), _jsx("option", { value: "sales", children: "Sales" }), _jsx("option", { value: "random", children: "Random" })] })] }), _jsx("button", { type: "submit", style: {
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }, children: "Join Chat" })] })] }));
}
//# sourceMappingURL=JoinForm.js.map