import { jsx as _jsx } from "react/jsx-runtime";
import { DocsLayout } from '@/components/Layout/DocsLayout';
import { examplesNavigation } from '@/lib/navigation';
export default function ExamplesLayout({ children, }) {
    return (_jsx(DocsLayout, { navigation: examplesNavigation, children: children }));
}
//# sourceMappingURL=layout.js.map