import { jsx as _jsx } from "react/jsx-runtime";
import './globals.css';
export const metadata = {
    title: 'RAG Workbench - Document Q&A',
    description: 'Retrieval Augmented Generation demo with Clarity Chat',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", children: _jsx("body", { children: children }) }));
}
//# sourceMappingURL=layout.js.map