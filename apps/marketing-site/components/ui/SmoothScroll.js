'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { ReactLenis } from '@studio-freight/react-lenis';
import { durations } from '@/lib/constants';
export default function SmoothScroll({ children, }) {
    return (_jsx(ReactLenis, { root: true, options: { lerp: 0.1, duration: durations.slower, smoothWheel: true }, children: children }));
}
//# sourceMappingURL=SmoothScroll.js.map