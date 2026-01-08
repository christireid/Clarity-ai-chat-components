import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { Badge, Button, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Input, Textarea, cn, } from '@clarity-chat/primitives';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateEmail = (email) => {
    return EMAIL_REGEX.test(email.trim());
};
const parseEmails = (input) => {
    // Split by comma, newline, or space and filter valid emails
    return input
        .split(/[,\n\s]+/)
        .map((e) => e.trim())
        .filter((e) => e.length > 0);
};
export const SeatInviteDialog = ({ triggerLabel = 'Invite teammate', roles = ['Administrator', 'Editor', 'Viewer'], defaultRole, onInvite, onCancelInvite, isLoading = false, remainingSeats, pendingInvites = [], customMessage, allowBulkInvite = true, className, }) => {
    const [open, setOpen] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [bulkEmails, setBulkEmails] = React.useState('');
    const [role, setRole] = React.useState(() => {
        if (defaultRole)
            return defaultRole;
        const firstRole = roles[0];
        return typeof firstRole === 'string' ? firstRole : (firstRole?.id ?? '');
    });
    const [sendWelcome, setSendWelcome] = React.useState(true);
    const [mode, setMode] = React.useState('single');
    const [emailError, setEmailError] = React.useState(null);
    const [bulkErrors, setBulkErrors] = React.useState([]);
    // Normalize roles to RoleOption format
    const normalizedRoles = React.useMemo(() => {
        return roles.map((r) => (typeof r === 'string' ? { id: r, name: r } : r));
    }, [roles]);
    const selectedRoleDetails = normalizedRoles.find((r) => r.id === role || r.name === role);
    const resetState = React.useCallback(() => {
        setEmail('');
        setBulkEmails('');
        setEmailError(null);
        setBulkErrors([]);
        const firstRole = roles[0];
        setRole(defaultRole ??
            (typeof firstRole === 'string' ? firstRole : (firstRole?.id ?? '')));
        setSendWelcome(true);
        setMode('single');
    }, [defaultRole, roles]);
    const validateSingleEmail = (value) => {
        if (!value.trim()) {
            setEmailError(null);
            return false;
        }
        if (!validateEmail(value)) {
            setEmailError('Please enter a valid email address');
            return false;
        }
        setEmailError(null);
        return true;
    };
    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);
        if (emailError) {
            validateSingleEmail(value);
        }
    };
    const handleEmailBlur = () => {
        if (email.trim()) {
            validateSingleEmail(email);
        }
    };
    const validateBulkEmails = () => {
        const emails = parseEmails(bulkEmails);
        const valid = [];
        const invalid = [];
        emails.forEach((e) => {
            if (validateEmail(e)) {
                valid.push(e);
            }
            else {
                invalid.push(e);
            }
        });
        return { valid, invalid };
    };
    const handleInvite = () => {
        if (mode === 'single') {
            if (!validateSingleEmail(email))
                return;
            onInvite?.([{ email: email.trim(), role, sendWelcome }]);
        }
        else {
            const { valid, invalid } = validateBulkEmails();
            if (invalid.length > 0) {
                setBulkErrors(invalid);
                return;
            }
            if (valid.length === 0)
                return;
            onInvite?.(valid.map((e) => ({ email: e, role, sendWelcome })));
        }
        resetState();
        setOpen(false);
    };
    const emailCount = mode === 'bulk' ? parseEmails(bulkEmails).length : email.trim() ? 1 : 0;
    const exceedsSeats = remainingSeats !== undefined && emailCount > remainingSeats;
    const canSubmit = emailCount > 0 &&
        !exceedsSeats &&
        !emailError &&
        bulkErrors.length === 0 &&
        !isLoading;
    return (_jsxs(Dialog, { open: open, onOpenChange: (next) => {
            setOpen(next);
            if (!next)
                resetState();
        }, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "surface", className: className, children: triggerLabel }) }), _jsxs(DialogContent, { className: "w-full max-w-lg", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { children: ["Invite teammate", allowBulkInvite && mode === 'bulk' ? 's' : ''] }), _jsx(DialogDescription, { children: remainingSeats !== undefined ? (_jsxs(_Fragment, { children: ["You have", ' ', _jsxs("span", { className: cn('font-medium', remainingSeats <= 2 ? 'text-warning' : 'text-foreground'), children: [remainingSeats, " seat", remainingSeats === 1 ? '' : 's'] }), ' ', "remaining. Seats are billed per active member."] })) : ('Seats are billed per active member. Select a role and optionally send a welcome email.') })] }), _jsxs("div", { className: "flex flex-col gap-4", children: [allowBulkInvite && (_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("button", { type: "button", onClick: () => setMode('single'), className: cn('rounded-md px-3 py-1.5 transition-colors', mode === 'single'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'), children: "Single invite" }), _jsx("button", { type: "button", onClick: () => setMode('bulk'), className: cn('rounded-md px-3 py-1.5 transition-colors', mode === 'bulk'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'), children: "Bulk invite" })] })), mode === 'single' ? (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "invite-email", className: "text-sm font-medium text-foreground", children: "Email address" }), _jsx(Input, { id: "invite-email", type: "email", placeholder: "jane@company.com", value: email, onChange: handleEmailChange, onBlur: handleEmailBlur, autoFocus: true, required: true, "aria-invalid": !!emailError, "aria-describedby": emailError ? 'email-error' : undefined, className: cn(emailError && 'border-destructive') }), emailError && (_jsx("p", { id: "email-error", className: "text-xs text-destructive", children: emailError }))] })) : (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "invite-bulk-emails", className: "text-sm font-medium text-foreground", children: "Email addresses" }), _jsx(Textarea, { id: "invite-bulk-emails", placeholder: "Enter email addresses separated by commas or new lines...", value: bulkEmails, onChange: (e) => {
                                            setBulkEmails(e.target.value);
                                            setBulkErrors([]);
                                        }, className: cn('min-h-[100px] resize-y', bulkErrors.length > 0 && 'border-destructive'), "aria-describedby": bulkErrors.length > 0 ? 'bulk-error' : undefined }), _jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [_jsx("span", { children: "Separate multiple emails with commas or new lines" }), emailCount > 0 && (_jsxs("span", { className: cn(exceedsSeats && 'text-destructive'), children: [emailCount, " email", emailCount === 1 ? '' : 's'] }))] }), bulkErrors.length > 0 && (_jsxs("p", { id: "bulk-error", className: "text-xs text-destructive", children: ["Invalid emails: ", bulkErrors.join(', ')] }))] })), exceedsSeats && (_jsxs("div", { className: "rounded-md bg-destructive/10 p-3 text-sm text-destructive", children: ["You can only invite ", remainingSeats, " more member", remainingSeats === 1 ? '' : 's', ". Please upgrade your plan or remove existing members."] })), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "invite-role", className: "text-sm font-medium text-foreground", children: "Role" }), _jsx("select", { id: "invite-role", value: role, onChange: (event) => setRole(event.target.value), className: "w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40", children: normalizedRoles.map((option) => (_jsx("option", { value: option.id, children: option.name }, option.id))) }), selectedRoleDetails?.description && (_jsx("p", { className: "text-xs text-muted-foreground", children: selectedRoleDetails.description }))] }), _jsxs("label", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx("input", { type: "checkbox", checked: sendWelcome, onChange: (event) => setSendWelcome(event.target.checked), className: "h-4 w-4 rounded border border-border/60 accent-primary" }), "Send welcome email with quick start instructions"] }), pendingInvites.length > 0 && (_jsxs("div", { className: "space-y-2 rounded-lg border border-border/50 bg-muted p-3", children: [_jsxs("h4", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: ["Pending invites (", pendingInvites.length, ")"] }), _jsx("ul", { className: "space-y-2", role: "list", children: pendingInvites.map((invite) => (_jsxs("li", { className: "flex items-center justify-between gap-2 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [_jsx("span", { className: "truncate text-foreground", children: invite.email }), _jsx(Badge, { variant: "outline", className: "text-[10px] shrink-0", children: invite.role })] }), onCancelInvite && (_jsx(Button, { variant: "ghost", size: "sm", className: "h-6 text-xs text-destructive hover:text-destructive shrink-0", onClick: () => onCancelInvite(invite), children: "Cancel" }))] }, invite.id))) })] }))] }), _jsxs(DialogFooter, { className: "flex flex-wrap justify-end gap-2", children: [_jsx(Button, { variant: "ghost", onClick: () => setOpen(false), disabled: isLoading, children: "Cancel" }), _jsx(Button, { variant: "surface", onClick: handleInvite, disabled: !canSubmit, children: isLoading ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "mr-1.5 h-4 w-4 animate-spin", fill: "none", viewBox: "0 0 24 24", "aria-hidden": "true", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Sending..."] })) : (_jsxs(_Fragment, { children: ["Send invite", mode === 'bulk' && emailCount > 1 ? 's' : '', emailCount > 1 && ` (${emailCount})`] })) })] })] })] }));
};
SeatInviteDialog.displayName = 'SeatInviteDialog';
//# sourceMappingURL=SeatInviteDialog.js.map