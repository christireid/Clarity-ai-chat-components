import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { SeatInviteDialog } from '@clarity-chat/react';
const meta = {
    title: 'Advanced/Enterprise/SeatInviteDialog',
    component: SeatInviteDialog,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
# Seat Invite Dialog

Dialog component for inviting team members to your organization with role-based access control.

## Features

- **Email Invitation**: Send invite to team member email
- **Role Selection**: Assign roles (Admin, Editor, Viewer)
- **Welcome Email**: Optional welcome email with quick start guide
- **Form Validation**: Email validation and required fields
- **Customizable Roles**: Configure available roles

## Use Cases

- Team member onboarding
- Organization management
- Access control configuration
- Billing and seat management
`,
            },
        },
    },
    argTypes: {
        triggerLabel: {
            control: 'text',
            description: 'Label for the trigger button',
            table: { defaultValue: { summary: '"Invite teammate"' } },
        },
        roles: {
            control: 'object',
            description: 'Available roles for selection',
            table: { defaultValue: { summary: "['Administrator', 'Editor', 'Viewer']" } },
        },
        defaultRole: {
            control: 'text',
            description: 'Default selected role',
        },
        onInvite: {
            action: 'invited',
            description: 'Callback when invitation is sent',
        },
    },
};
export default meta;
// ============================================================================
// Basic Examples
// ============================================================================
export const Default = {
    args: {
        triggerLabel: 'Invite teammate',
        roles: ['Administrator', 'Editor', 'Viewer'],
        onInvite: (invite) => console.log('Invite sent:', invite),
    },
};
export const CustomRoles = {
    args: {
        triggerLabel: 'Add team member',
        roles: ['Owner', 'Admin', 'Developer', 'Designer', 'Guest'],
        defaultRole: 'Developer',
        onInvite: (invite) => console.log('Invite sent:', invite),
    },
    parameters: {
        docs: {
            description: {
                story: 'Dialog with custom role options.',
            },
        },
    },
};
export const SingleRole = {
    args: {
        triggerLabel: 'Invite viewer',
        roles: ['Viewer'],
        onInvite: (invite) => console.log('Invite sent:', invite),
    },
    parameters: {
        docs: {
            description: {
                story: 'Dialog with only one role option.',
            },
        },
    },
};
// ============================================================================
// Integration Examples
// ============================================================================
export const WithTeamList = {
    render: () => {
        const [team, setTeam] = React.useState([
            { id: 1, email: 'john@company.com', role: 'Administrator', status: 'active' },
            { id: 2, email: 'jane@company.com', role: 'Editor', status: 'active' },
            { id: 3, email: 'bob@company.com', role: 'Viewer', status: 'pending' },
        ]);
        const handleInvite = (invite) => {
            const newMember = {
                id: team.length + 1,
                email: invite.email,
                role: invite.role,
                status: 'pending',
            };
            setTeam([...team, newMember]);
            console.log('Invite sent:', invite);
        };
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: "Team Members" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Manage your team and invite new members" })] }), _jsx(SeatInviteDialog, { onInvite: handleInvite })] }), _jsx("div", { className: "border rounded-lg divide-y", children: team.map((member) => (_jsxs("div", { className: "p-4 flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium", children: member.email }), _jsx("div", { className: "text-sm text-muted-foreground", children: member.role })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { className: `px-2 py-1 text-xs rounded-full ${member.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'}`, children: member.status }) })] }, member.id))) })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Complete team management interface with invite dialog.',
            },
        },
    },
};
// ============================================================================
// Enterprise Scenarios
// ============================================================================
export const EnterpriseSetup = {
    render: () => {
        const [invites, setInvites] = React.useState([]);
        const handleInvite = (invite) => {
            setInvites([...invites, { ...invite, timestamp: new Date() }]);
        };
        return (_jsxs("div", { className: "max-w-4xl space-y-6", children: [_jsxs("div", { className: "border rounded-lg p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold", children: "Organization Setup" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Set up your enterprise organization by inviting team members" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold", children: "50" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Total Seats" })] }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold", children: "23" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Active Members" })] }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold", children: "27" }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Available" })] })] }), _jsx(SeatInviteDialog, { triggerLabel: "Invite team member", roles: ['Organization Admin', 'Team Admin', 'Member', 'Guest'], defaultRole: "Member", onInvite: handleInvite })] }), invites.length > 0 && (_jsxs("div", { className: "border rounded-lg p-6", children: [_jsx("h4", { className: "font-semibold mb-4", children: "Recent Invitations" }), _jsx("div", { className: "space-y-2", children: invites.map((invite, index) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-muted rounded", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: invite.email }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [invite.role, " \u2022 ", invite.timestamp.toLocaleTimeString()] })] }), invite.sendWelcome && (_jsx("span", { className: "text-xs text-muted-foreground", children: "\u2709\uFE0F Welcome email sent" }))] }, index))) })] }))] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Complete enterprise onboarding scenario with seat tracking.',
            },
        },
    },
};
// ============================================================================
// Permission Levels
// ============================================================================
export const PermissionLevels = {
    render: () => {
        const [selectedRole, setSelectedRole] = React.useState('Member');
        const rolePermissions = {
            'Organization Admin': [
                'Full access to all features',
                'Manage billing and subscriptions',
                'Add/remove members',
                'Configure SSO and security',
                'Access audit logs',
            ],
            'Team Admin': [
                'Manage team members',
                'Configure team settings',
                'View team analytics',
                'Create and manage projects',
            ],
            'Member': [
                'Access assigned projects',
                'Create and edit content',
                'Collaborate with team',
                'View team analytics',
            ],
            'Guest': [
                'View shared projects',
                'Limited collaboration',
                'No administrative access',
            ],
        };
        const handleInvite = (invite) => {
            console.log('Inviting with role:', invite);
            setSelectedRole(invite.role);
        };
        return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx("div", { children: _jsx(SeatInviteDialog, { triggerLabel: "Invite with permissions", roles: Object.keys(rolePermissions), defaultRole: "Member", onInvite: handleInvite }) }), _jsxs("div", { className: "border rounded-lg p-4", children: [_jsxs("h4", { className: "font-semibold mb-3", children: ["Permissions for ", selectedRole] }), _jsx("ul", { className: "space-y-2", children: rolePermissions[selectedRole].map((permission, index) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-success", children: "\u2713" }), _jsx("span", { className: "text-sm", children: permission })] }, index))) })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Dialog with detailed permission levels for each role.',
            },
        },
    },
};
// ============================================================================
// Interactive Demo
// ============================================================================
export const InteractiveDemo = {
    render: () => {
        const [invitations, setInvitations] = React.useState([]);
        const handleInvite = (invite) => {
            const newInvitation = {
                ...invite,
                status: 'pending',
                sentAt: new Date(),
            };
            setInvitations([newInvitation, ...invitations]);
        };
        const updateStatus = (index, status) => {
            const updated = [...invitations];
            updated[index].status = status;
            setInvitations(updated);
        };
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between p-4 bg-muted rounded-lg", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: "Team Invitations" }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [invitations.length, " total invitations sent"] })] }), _jsx(SeatInviteDialog, { onInvite: handleInvite, roles: ['Administrator', 'Editor', 'Viewer', 'Guest'] })] }), invitations.length === 0 ? (_jsx("div", { className: "border-2 border-dashed rounded-lg p-8 text-center", children: _jsx("p", { className: "text-muted-foreground", children: "No invitations yet. Click \"Invite teammate\" to get started." }) })) : (_jsx("div", { className: "space-y-2", children: invitations.map((invitation, index) => (_jsx("div", { className: "border rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "font-medium", children: invitation.email }), _jsx("span", { className: `px-2 py-0.5 text-xs rounded-full ${invitation.status === 'accepted'
                                                        ? 'bg-green-100 text-green-800'
                                                        : invitation.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'}`, children: invitation.status })] }), _jsxs("div", { className: "text-sm text-muted-foreground mt-1", children: [invitation.role, " \u2022 Sent ", invitation.sentAt.toLocaleString(), invitation.sendWelcome && ' • Welcome email sent'] })] }), _jsx("div", { className: "flex gap-2", children: invitation.status === 'pending' && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => updateStatus(index, 'accepted'), className: "text-xs px-2 py-1 bg-success text-white rounded hover:opacity-90", children: "Accept" }), _jsx("button", { onClick: () => updateStatus(index, 'expired'), className: "text-xs px-2 py-1 bg-destructive text-white rounded hover:opacity-90", children: "Expire" })] })) })] }) }, index))) }))] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive demo with invitation tracking and status management.',
            },
        },
    },
};
//# sourceMappingURL=SeatInviteDialog.stories.js.map