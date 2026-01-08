import { jsx as _jsx } from "react/jsx-runtime";
import { ImageResponse } from 'next/og';
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';
export default function Icon() {
    return new ImageResponse(_jsx("div", { style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
            borderRadius: '6px',
        }, children: _jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) }) }), {
        ...size,
    });
}
//# sourceMappingURL=icon.js.map