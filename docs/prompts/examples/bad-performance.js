// Example: Performance Issues
// This file contains intentional performance problems for training purposes
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { format } from 'date-fns'; // ISSUE: Could use lighter alternative
// ISSUE 1: Component not memoized, receives object props
export function UserList({ users, onSelect }) {
    // ISSUE 2: Sorting on every render without memoization
    const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
    // ISSUE 3: Creating new function on every render
    const handleClick = (user) => {
        console.log('Selected:', user.name);
        onSelect(user);
    };
    return (_jsx("ul", { children: sortedUsers.map((user) => (
        // ISSUE 4: UserCard not memoized
        _jsx(UserCard, { user: user, onClick: () => handleClick(user) }, user.id))) }));
}
// ISSUE 5: Not using React.memo
function UserCard({ user, onClick }) {
    return (_jsxs("li", { onClick: onClick, className: "p-4 border rounded", children: [_jsx("img", { src: `/avatars/${user.id}.png`, alt: user.name }), _jsx("h3", { children: user.name }), _jsx("p", { children: user.email }), _jsx("span", { children: format(user.createdAt, 'PPP') })] }));
}
// ISSUE 7: Heavy component not code-split
import { HeavyChartLibrary } from 'heavy-chart-library';
export function Dashboard() {
    const [data, setData] = useState([]);
    // ISSUE 8: Object in dependency array (unstable reference)
    const options = { limit: 10, sort: 'desc' };
    useEffect(() => {
        fetchData(options).then(setData);
    }, [options]); // Will run on every render!
    // ISSUE 9: Derived state instead of computing during render
    const [filteredData, setFilteredData] = useState([]);
    useEffect(() => {
        setFilteredData(data.filter((item) => item.active));
    }, [data]);
    return (_jsx("div", { children: _jsx(HeavyChartLibrary, { data: filteredData }) }));
}
// ISSUE 10: Not using next/font
export function Header() {
    return (_jsx("header", { style: { fontFamily: 'Inter, sans-serif' }, children: _jsx("h1", { children: "Dashboard" }) }));
}
//# sourceMappingURL=bad-performance.js.map