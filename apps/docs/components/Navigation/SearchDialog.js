'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Hash, FileText, BookOpen, Wrench, Code2, Sparkles, Rocket, Link2 } from 'lucide-react';
import { CommandPalette } from '@clarity-chat/react';
import { searchData } from '@/lib/search-data';
export function SearchDialog({ open, onClose }) {
    const router = useRouter();
    // Transform search data into CommandItem format
    const commandItems = useMemo(() => {
        return searchData.map((item) => ({
            id: item.href,
            label: item.title,
            description: item.description,
            icon: getTypeIcon(item.type),
            category: getCategoryName(item.type),
            onSelect: () => {
                router.push(item.href);
            },
        }));
    }, [router]);
    return (_jsx(CommandPalette, { items: commandItems, open: open, onClose: onClose, placeholder: "Search documentation..." }));
}
// Icon mapping by content type
function getTypeIcon(type) {
    const iconClass = "w-4 h-4";
    switch (type) {
        case 'component':
            return _jsx(Hash, { className: `${iconClass} text-brand-500` });
        case 'hook':
            return _jsx(Wrench, { className: `${iconClass} text-purple-500` });
        case 'guide':
            return _jsx(FileText, { className: `${iconClass} text-green-500` });
        case 'example':
            return _jsx(Code2, { className: `${iconClass} text-orange-500` });
        case 'cookbook':
            return _jsx(BookOpen, { className: `${iconClass} text-amber-500` });
        case 'concept':
            return _jsx(Sparkles, { className: `${iconClass} text-blue-500` });
        case 'deployment':
            return _jsx(Rocket, { className: `${iconClass} text-indigo-500` });
        case 'integration':
            return _jsx(Link2, { className: `${iconClass} text-teal-500` });
        default:
            return _jsx(FileText, { className: `${iconClass} text-gray-500` });
    }
}
// Category name mapping
function getCategoryName(type) {
    const categoryMap = {
        component: 'Components',
        hook: 'Hooks',
        guide: 'Guides',
        example: 'Examples',
        cookbook: 'Cookbook',
        concept: 'Concepts',
        deployment: 'Deployment',
        integration: 'Integrations',
    };
    return categoryMap[type] || 'Documentation';
}
//# sourceMappingURL=SearchDialog.js.map