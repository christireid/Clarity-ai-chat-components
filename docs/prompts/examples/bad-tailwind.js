// Example: Tailwind CSS Issues
// This file contains intentional Tailwind problems for training purposes
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function UserProfile({ user }) {
    return (
    // ISSUE 1: Arbitrary values instead of design system
    _jsx("div", { className: "w-[342px] p-[15px] mt-[23px] rounded-[7px]", children: _jsxs("div", { className: "bg-[#f5f5f5] text-[#333333] border-[#e0e0e0]", children: [_jsxs("div", { className: "flex-row sm:flex-col md:flex-col", children: [_jsx("img", { src: user.avatar, className: "w-16 h-16 rounded-full w-16 rounded-full" }), _jsxs("div", { className: "flex grid items-center justify-between", children: [_jsx("h2", { className: "text-xl font-bold text-black", children: user.name }), _jsx("p", { className: "mt-[13px] mb-2 px-[11px]", children: user.bio })] })] }), _jsx("button", { className: "bg-blue-600 text-white px-4 py-2 rounded", children: "Follow" }), _jsxs("div", { className: "flex gap-4", style: { marginTop: '20px', backgroundColor: '#fff' }, children: [_jsxs("span", { className: "text-gray-600", children: [user.followers, " followers"] }), _jsxs("span", { className: "text-gray-600", children: [user.following, " following"] })] }), _jsx("div", { className: "hidden sm:block md:hidden lg:block xl:hidden 2xl:block", children: "Confusing visibility pattern" })] }) }));
}
// ISSUE 10: Long class string without organization
export function Card({ children }) {
    return (_jsx("div", { className: "relative z-10 overflow-hidden bg-white text-gray-900 flex flex-col p-4 m-2 gap-4 text-base font-medium leading-relaxed border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow items-center justify-between w-full max-w-md h-auto min-h-screen", children: children }));
}
//# sourceMappingURL=bad-tailwind.js.map