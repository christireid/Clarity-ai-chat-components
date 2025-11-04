import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Button, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Input, } from '@clarity-chat/primitives';
export const SeatInviteDialog = ({ triggerLabel = 'Invite teammate', roles = ['Administrator', 'Editor', 'Viewer'], defaultRole, onInvite, className, }) => {
    const [open, setOpen] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [role, setRole] = React.useState(defaultRole ?? roles[0]);
    const [sendWelcome, setSendWelcome] = React.useState(true);
    const resetState = React.useCallback(() => {
        setEmail('');
        setRole(defaultRole ?? roles[0]);
        setSendWelcome(true);
    }, [defaultRole, roles]);
    const handleInvite = () => {
        if (!email.trim())
            return;
        onInvite?.({ email: email.trim(), role, sendWelcome });
        resetState();
        setOpen(false);
    };
    return (_jsxs(Dialog, { open: open, onOpenChange: (next) => {
            setOpen(next);
            if (!next)
                resetState();
        }, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "surface", className: className, children: triggerLabel }) }), _jsxs(DialogContent, { className: "w-full max-w-lg", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Invite teammate" }), _jsx(DialogDescription, { children: "Seats are billed per active member. Select a role and optionally send a welcome email." })] }), _jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("label", { className: "flex flex-col gap-1 text-sm font-medium text-foreground", children: ["Email address", _jsx(Input, { type: "email", placeholder: "jane@company.com", value: email, onChange: (event) => setEmail(event.target.value), autoFocus: true, required: true })] }), _jsxs("label", { className: "flex flex-col gap-1 text-sm font-medium text-foreground", children: ["Role", _jsx("select", { value: role, onChange: (event) => setRole(event.target.value), className: "rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40", children: roles.map((option) => (_jsx("option", { value: option, children: option }, option))) })] }), _jsxs("label", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx("input", { type: "checkbox", checked: sendWelcome, onChange: (event) => setSendWelcome(event.target.checked), className: "h-4 w-4 rounded border border-border/60" }), "Send welcome email with quick start instructions"] })] }), _jsxs(DialogFooter, { className: "flex flex-wrap justify-end gap-2", children: [_jsx(Button, { variant: "ghost", onClick: () => setOpen(false), children: "Cancel" }), _jsx(Button, { variant: "surface", onClick: handleInvite, disabled: !email.trim(), children: "Send invite" })] })] })] }));
};
SeatInviteDialog.displayName = 'SeatInviteDialog';
//# sourceMappingURL=SeatInviteDialog.js.map