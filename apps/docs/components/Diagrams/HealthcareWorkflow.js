/**
 * Healthcare Workflow Diagram
 *
 * Patient journey through healthcare chatbot
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { User, MessageCircle, FileText, Calendar, Heart, Check } from 'lucide-react';
export function HealthcareWorkflow() {
    const journey = [
        {
            icon: _jsx(User, { className: "w-6 h-6" }),
            title: 'Patient Query',
            description: 'Describes symptoms or asks medical question',
            color: 'from-blue-500 to-blue-600',
            example: '"I have a headache and fever"',
        },
        {
            icon: _jsx(MessageCircle, { className: "w-6 h-6" }),
            title: 'AI Analysis',
            description: 'Interprets symptoms, retrieves medical knowledge',
            color: 'from-purple-500 to-purple-600',
            example: 'Analyzes symptom patterns',
        },
        {
            icon: _jsx(FileText, { className: "w-6 h-6" }),
            title: 'Record Check',
            description: 'Reviews patient history, medications, allergies',
            color: 'from-green-500 to-green-600',
            example: 'Checks medical records',
        },
        {
            icon: _jsx(Heart, { className: "w-6 h-6" }),
            title: 'Recommendation',
            description: 'Provides educational health information',
            color: 'from-pink-500 to-pink-600',
            example: 'Suggests rest, fluids, monitor',
        },
        {
            icon: _jsx(Calendar, { className: "w-6 h-6" }),
            title: 'Follow-up',
            description: 'Schedules appointment if needed',
            color: 'from-orange-500 to-orange-600',
            example: 'Book with Dr. Smith',
        },
        {
            icon: _jsx(Check, { className: "w-6 h-6" }),
            title: 'Documentation',
            description: 'Logs interaction for continuity of care',
            color: 'from-cyan-500 to-cyan-600',
            example: 'Audit trail created',
        },
    ];
    return (_jsx("div", { className: "not-prose my-12", children: _jsxs("div", { className: "bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-slate-900 dark:to-cyan-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700", children: [_jsx("h3", { className: "text-2xl font-bold mb-3 text-center", children: _jsx("span", { className: "bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent", children: "Patient Care Workflow" }) }), _jsx("p", { className: "text-center text-sm text-gray-600 dark:text-gray-400 mb-8", children: "HIPAA-compliant healthcare interaction flow" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: journey.map((step, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.15 }, className: "relative", children: [_jsxs("div", { className: "p-6 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-lg h-full", children: [_jsx("div", { className: `w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-lg mb-4`, children: step.icon }), _jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("div", { className: `w-6 h-6 rounded-lg bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-xs font-bold shadow`, children: index + 1 }), _jsx("h4", { className: "font-bold text-sm", children: step.title })] }), _jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400 mb-3", children: step.description }), _jsx("div", { className: "bg-slate-100 dark:bg-slate-900 rounded-lg p-2 text-xs font-mono text-gray-700 dark:text-gray-300", children: step.example })] }), index < journey.length - 1 && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: index * 0.15 + 0.2 }, className: "hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10", children: _jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", children: [_jsx("path", { d: "M 0 12 L 18 12", stroke: "#3b82f6", strokeWidth: "2" }), _jsx("path", { d: "M 14 8 L 22 12 L 14 16", fill: "#3b82f6" })] }) }))] }, step.title))) }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 1.5 }, className: "mt-8 grid md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-center", children: [_jsx("div", { className: "text-2xl mb-1", children: "\uD83D\uDD12" }), _jsx("div", { className: "font-semibold text-sm mb-1", children: "HIPAA Compliant" }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Encrypted, audited, secure" })] }), _jsxs("div", { className: "p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800 text-center", children: [_jsx("div", { className: "text-2xl mb-1", children: "\uD83C\uDFAF" }), _jsx("div", { className: "font-semibold text-sm mb-1", children: "Context-Aware" }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Uses patient history" })] }), _jsxs("div", { className: "p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 text-center", children: [_jsx("div", { className: "text-2xl mb-1", children: "\u26A1" }), _jsx("div", { className: "font-semibold text-sm mb-1", children: "Real-time" }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Instant responses" })] })] }), _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 2 }, className: "mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-500 rounded-r-xl text-sm", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-yellow-600 dark:text-yellow-400 text-lg", children: "\u26A0\uFE0F" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-yellow-900 dark:text-yellow-100 mb-1", children: "Compliance Requirements" }), _jsx("div", { className: "text-yellow-800 dark:text-yellow-200 text-xs", children: "All interactions are encrypted (TLS 1.3), logged for audit trails, and include automatic PII detection. Every step maintains HIPAA compliance." })] })] }) })] }) }));
}
//# sourceMappingURL=HealthcareWorkflow.js.map