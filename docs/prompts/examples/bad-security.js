// Example: Security Issues
// This file contains intentional security vulnerabilities for training purposes
'use server';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { db } from '@/lib/db';
// ISSUE 1: No input validation on Server Action
export async function createUser(formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const role = formData.get('role');
    // Direct database insertion without validation
    await db.user.create({
        data: { name, email, role }
    });
    return { success: true };
}
// ISSUE 2: SQL injection vulnerability
export async function searchUsers(query) {
    // String concatenation in query - SQL injection!
    const users = await db.$queryRaw `
    SELECT * FROM users WHERE name LIKE '%${query}%'
  `;
    return users;
}
// ISSUE 3: Exposing secrets in client component
'use client';
import { useState } from 'react';
// Secret exposed to client bundle!
const API_KEY = process.env.OPENAI_API_KEY;
export function ChatInterface() {
    const [messages, setMessages] = useState([]);
    // ISSUE 4: dangerouslySetInnerHTML without sanitization
    const renderMessage = (content) => (_jsx("div", { dangerouslySetInnerHTML: { __html: content } }));
    // ISSUE 5: No CSRF consideration for sensitive action
    const deleteAccount = async () => {
        await fetch('/api/delete-account', { method: 'POST' });
    };
    return (_jsxs("div", { children: [messages.map((msg, i) => (_jsx("div", { children: renderMessage(msg.content) }, i))), _jsx("button", { onClick: deleteAccount, children: "Delete My Account" })] }));
}
// ISSUE 6: Environment variable without NEXT_PUBLIC prefix used client-side
export function ApiStatus() {
    // This will be undefined in browser, but indicates intent to use server secret
    const status = process.env.DATABASE_URL ? 'Connected' : 'Disconnected';
    return _jsx("div", { children: status });
}
//# sourceMappingURL=bad-security.js.map