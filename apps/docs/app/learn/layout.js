import { jsx as _jsx } from "react/jsx-runtime";
import { DocsLayout } from '@/components/Layout/DocsLayout';
import { learnNavigation } from '@/lib/navigation';
export default function LearnLayout({ children, }) {
    return (_jsx(DocsLayout, { navigation: learnNavigation, children: children }));
}
//# sourceMappingURL=layout.js.map