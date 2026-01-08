import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, cn, } from '@clarity-chat/primitives';
import { EASING_FRAMER, DURATION_SECONDS as durations, } from '../../animations/constants';
const roleLabels = {
    strategist: 'Strategy',
    researcher: 'Research',
    assistant: 'Assistant',
    critic: 'Critique',
    coach: 'Coaching',
    custom: 'Custom',
};
const roleAccent = {
    strategist: 'from-primary/20 via-primary/10 to-transparent text-primary',
    researcher: 'from-[hsl(var(--success))]/20 via-[hsl(var(--success))]/10 to-transparent text-[hsl(var(--success))]',
    assistant: 'from-[hsl(var(--info))]/20 via-[hsl(var(--info))]/10 to-transparent text-[hsl(var(--info))]',
    critic: 'from-destructive/20 via-destructive/10 to-transparent text-destructive',
    coach: 'from-[hsl(var(--warning))]/20 via-[hsl(var(--warning))]/10 to-transparent text-[hsl(var(--warning))]',
    custom: 'from-primary/20 via-primary/10 to-transparent text-primary',
};
export function PersonaPanel({ personas, activePersonaId, onSelect, onConfigure, toneSubtitle = 'Switch between tailored assistants optimised for different AI chat workflows.', showTemperature = true, className, }) {
    return (_jsxs(Card, { className: cn('border-border/60 bg-[hsl(var(--surface-elevated))] shadow-[0_22px_48px_rgba(15,23,42,0.16)]', className), children: [_jsx(CardHeader, { className: "space-y-3", children: _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx(CardTitle, { className: "text-lg font-semibold text-foreground", children: "Persona switchboard" }), _jsx(CardDescription, { className: "text-sm text-muted-foreground/80", children: toneSubtitle })] }) }), _jsx(CardContent, { children: _jsx("ul", { className: "flex flex-col gap-3", role: "list", children: _jsx(AnimatePresence, { initial: false, children: personas.map((persona) => {
                            const isActive = persona.id === activePersonaId;
                            return (_jsx(motion.li, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: {
                                    duration: durations.normal,
                                    ease: EASING_FRAMER.default,
                                }, children: _jsxs(Button, { variant: isActive ? 'surface' : 'outline', className: cn('group flex w-full items-start gap-4 rounded-lg border border-border/50 p-4 text-left transition-all duration-150 ease-out hover:-translate-y-px hover:border-primary/40 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]', isActive &&
                                        'border-primary/50 shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]'), onClick: () => onSelect?.(persona), "data-state": isActive ? 'active' : 'inactive', children: [_jsx("div", { className: "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary shadow-inner", children: persona.avatarUrl ? (_jsx(Avatar, { size: "lg", src: persona.avatarUrl, alt: `${persona.name} avatar`, className: "h-12 w-12 border-none shadow-none" })) : (persona.name.slice(0, 2).toUpperCase()) }), _jsxs("div", { className: "flex flex-1 flex-col gap-2", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-base font-semibold text-foreground", children: persona.name }), _jsx("span", { className: cn('rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide', roleAccent[persona.role]), children: roleLabels[persona.role] })] }), isActive && (_jsx(Badge, { variant: "success", className: "uppercase tracking-wide", children: "Active" })), showTemperature &&
                                                            persona.temperature !== undefined && (_jsxs("span", { className: "text-xs font-medium text-muted-foreground", children: ["Temperature ", persona.temperature.toFixed(2)] }))] }), _jsx("p", { className: "text-sm text-muted-foreground/80", children: persona.summary }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [persona.expertise.map((area) => (_jsx(Badge, { variant: "subtle", className: "text-xs", children: area }, area))), persona.tags?.map((tag) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: tag }, tag)))] })] }), onConfigure && (_jsx(Button, { variant: "ghost", size: "sm", className: "flex-shrink-0 text-muted-foreground hover:text-primary", onClick: (event) => {
                                                event.stopPropagation();
                                                onConfigure?.(persona);
                                            }, children: "Configure" }))] }) }, persona.id));
                        }) }) }) })] }));
}
PersonaPanel.displayName = 'PersonaPanel';
//# sourceMappingURL=persona-panel.js.map