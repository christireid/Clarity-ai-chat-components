'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export function CustomerForm({ onSubmit }) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && name && subject) {
            onSubmit({ email, name, subject });
        }
    };
    return (_jsxs("div", { style: {
            maxWidth: '500px',
            margin: '0 auto',
            padding: '2rem',
        }, children: [_jsx("h2", { style: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }, children: "Start a Support Conversation" }), _jsxs("form", { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", style: { display: 'block', marginBottom: '0.5rem', fontWeight: 500 }, children: "Your Name" }), _jsx("input", { id: "name", type: "text", value: name, onChange: (e) => setName(e.target.value), required: true, style: {
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid rgba(128, 128, 128, 0.3)',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                }, placeholder: "John Doe" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", style: { display: 'block', marginBottom: '0.5rem', fontWeight: 500 }, children: "Email Address" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, style: {
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid rgba(128, 128, 128, 0.3)',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                }, placeholder: "john@example.com" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "subject", style: { display: 'block', marginBottom: '0.5rem', fontWeight: 500 }, children: "Subject" }), _jsx("input", { id: "subject", type: "text", value: subject, onChange: (e) => setSubject(e.target.value), required: true, style: {
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid rgba(128, 128, 128, 0.3)',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                }, placeholder: "How can we help you?" })] }), _jsx("button", { type: "submit", style: {
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }, children: "Start Chat" })] })] }));
}
//# sourceMappingURL=CustomerForm.js.map