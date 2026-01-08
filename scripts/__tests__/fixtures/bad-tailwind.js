import { jsx as _jsx } from "react/jsx-runtime";
// Test fixture: Tailwind issues
export function BadComponent() {
    return (_jsx("div", { className: "w-[342px] p-[15px] mt-[23px]", children: _jsx("div", { className: "bg-[#f5f5f5] text-[#333333]", children: "Content" }) }));
}
//# sourceMappingURL=bad-tailwind.js.map