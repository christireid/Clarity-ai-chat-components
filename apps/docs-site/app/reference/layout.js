import { jsx as _jsx } from "react/jsx-runtime";
import { DocsLayout } from '@/components/Layout/DocsLayout';
import { referenceNavigation } from '@/lib/navigation';
export default function ReferenceLayout({ children, }) {
    return (_jsx(DocsLayout, { navigation: referenceNavigation, children: children }));
}
//# sourceMappingURL=layout.js.map