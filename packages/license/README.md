# @clarity-chat/license

[![npm version](https://img.shields.io/npm/v/@clarity-chat/license.svg)](https://www.npmjs.com/package/@clarity-chat/license)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

Commercial license validation for [Clarity Chat Pro](https://claritychat.dev) - Premium AI Chat
Components for React.

## Features

- **Client-side validation** - No server calls, instant verification
- **Honor system enforcement** - Watermarks + console warnings for unlicensed usage
- **React hooks & context** - Multiple integration patterns for flexibility
- **SSR-safe** - Works with Next.js, Remix, and other SSR frameworks
- **TypeScript-first** - Full type safety with strict mode support
- **Zero runtime dependencies** - Self-contained package
- **Grace period support** - 14-day grace period for expired licenses

## Installation

```bash
npm install @clarity-chat/license
# or
pnpm add @clarity-chat/license
# or
yarn add @clarity-chat/license
```

## Quick Start

### 1. Set Your License Key

Set your license key once at your application's entry point:

```tsx
// In _app.tsx (Next.js Pages) or layout.tsx (Next.js App Router)
import { LicenseInfo } from '@clarity-chat/license'

// Using environment variable (recommended)
LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_CLARITY_LICENSE_KEY!)
```

For Next.js App Router, you may need a client component:

```tsx
// components/ClarityLicense.tsx
'use client'

import { LicenseInfo } from '@clarity-chat/license'

LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_CLARITY_LICENSE_KEY!)

export default function ClarityLicense() {
  return null
}
```

```tsx
// app/layout.tsx
import ClarityLicense from '@/components/ClarityLicense'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ClarityLicense />
        {children}
      </body>
    </html>
  )
}
```

### 2. Use Pro Components

Pro components will automatically validate the license:

```tsx
import { ChatAnalytics } from '@clarity-chat/react-pro'

function Dashboard() {
  return <ChatAnalytics conversations={conversations} />
}
```

## API Reference

### LicenseInfo

Static class for managing the license key.

```tsx
import { LicenseInfo } from '@clarity-chat/license'

// Set license key
LicenseInfo.setLicenseKey('CC-1-xxx...')

// Check if valid
if (LicenseInfo.isValid()) {
  console.log('Licensed to:', LicenseInfo.getLicensee())
}

// Get full status
const status = LicenseInfo.getStatus()
```

### Hooks

```tsx
import { useLicenseStatus, useIsLicensed, useHasPlan } from '@clarity-chat/license'

function MyComponent() {
  const status = useLicenseStatus()
  const isLicensed = useIsLicensed()
  const hasPro = useHasPlan('pro')

  if (!isLicensed) {
    return <div>Please purchase a license</div>
  }

  return <div>Welcome, {status.payload?.licensee}!</div>
}
```

### Higher-Order Components

```tsx
import { withLicense } from '@clarity-chat/license'

const LicensedComponent = withLicense(MyComponent, {
  componentName: 'MyComponent',
  requiredPlan: 'pro',
  showWatermark: true,
})
```

### LicenseGate

Gate access to features based on license plan:

```tsx
import { LicenseGate, LicenseUpgradePrompt } from '@clarity-chat/license'

function MyApp() {
  return (
    <LicenseGate
      requiredPlan="pro"
      fallback={<LicenseUpgradePrompt requiredPlan="pro" featureName="Analytics" />}
    >
      <ProAnalytics />
    </LicenseGate>
  )
}
```

Props:

- `requiredPlan` - Required plan level (`'community'`, `'pro'`, `'enterprise'`)
- `children` - Content to render when licensed
- `fallback` - Content to render when not licensed
- `loading` - Content during SSR hydration (defaults to skeleton)
- `noLoadingSkeleton` - Disable default loading skeleton

### UI Components

#### LicenseStatusBadge

Display current license status in your settings or footer:

```tsx
import { LicenseStatusBadge } from '@clarity-chat/license'

function Settings() {
  return (
    <LicenseStatusBadge
      variant="badge" // 'icon' | 'badge' | 'full'
      size="md" // 'sm' | 'md' | 'lg'
      onClick={() => navigate('/settings/license')}
    />
  )
}
```

#### LicenseExpiryWarning

Show a banner when license is approaching expiration:

```tsx
import { LicenseExpiryWarning } from '@clarity-chat/license'

function Layout({ children }) {
  return (
    <>
      <LicenseExpiryWarning
        daysThreshold={30}
        position="top"
        renewUrl="https://claritychat.dev/pricing"
        persistDismiss={true}
      />
      {children}
    </>
  )
}
```

#### LicenseUpgradePrompt

Convert gated features into upgrade opportunities:

```tsx
import { LicenseUpgradePrompt } from '@clarity-chat/license'

// Card variant (default)
<LicenseUpgradePrompt
  requiredPlan="enterprise"
  featureName="Advanced Analytics"
  benefits={['Real-time insights', 'Custom dashboards']}
/>

// Inline variant
<LicenseUpgradePrompt
  requiredPlan="pro"
  variant="inline"
/>

// Minimal variant
<LicenseUpgradePrompt
  requiredPlan="pro"
  variant="minimal"
/>
```

#### LicenseLoadingSkeleton

A subtle loading skeleton for SSR hydration states:

```tsx
import { LicenseLoadingSkeleton } from '@clarity-chat/license'

;<LicenseGate requiredPlan="pro" loading={<LicenseLoadingSkeleton width="100%" height="200px" />}>
  <ProFeature />
</LicenseGate>
```

### useLicenseWarning

Emit one-time console warnings for unlicensed usage:

```tsx
import { useLicenseWarning } from '@clarity-chat/license'

function ProFeature() {
  useLicenseWarning('ProFeature', 'pro')
  return <div>Pro feature content</div>
}
```

## License Types

| Plan       | Features                             |
| ---------- | ------------------------------------ |
| Community  | Core components (MIT licensed)       |
| Pro        | Premium components, priority support |
| Enterprise | All features, custom support, SLA    |

## Purchase

Get your license at [claritychat.dev/pricing](https://claritychat.dev/pricing).

## FAQ

### Is the license key validated online?

No. License validation is done entirely client-side with no network requests. Your key is decoded
and validated locally.

### What happens if my license expires?

- **In production**: Your deployed applications continue to work forever
- **In development**: You'll see a warning that you need to renew for updates

### Can I use one license for multiple projects?

- **Individual**: One developer, unlimited projects
- **Team**: Up to 5 developers, unlimited projects
- **Organization**: Unlimited developers in your company

## LicenseProvider (Context API)

For SSR frameworks or testing, use the context-based API:

```tsx
import { LicenseProvider, useLicenseContext } from '@clarity-chat/license'

// Wrap your app
function App() {
  return (
    <LicenseProvider licenseKey={process.env.NEXT_PUBLIC_CLARITY_LICENSE_KEY}>
      <MyApp />
    </LicenseProvider>
  )
}

// Use in components
function MyComponent() {
  const { isValid, licensee, hasPlan } = useLicenseContext()

  return (
    <div>
      {isValid ? `Licensed to ${licensee}` : 'Unlicensed'}
      {hasPlan('enterprise') && <EnterpriseFeatures />}
    </div>
  )
}
```

## Migration from @clarity-chat/licensing

If you were using the legacy `@clarity-chat/licensing` package:

### Breaking Changes

1. Package renamed from `@clarity-chat/licensing` to `@clarity-chat/license`
2. API simplified - `validateLicense` renamed to `verifyLicense`
3. New context-based API added alongside static API

### Migration Steps

```diff
// 1. Update imports
- import { validateLicense } from '@clarity-chat/licensing';
+ import { verifyLicense } from '@clarity-chat/license';

// 2. Update function calls
- const result = validateLicense(key);
+ const result = verifyLicense(key);
```

Then remove the old package:

```bash
npm uninstall @clarity-chat/licensing
```

## Status Codes

| Code                    | Description                                |
| ----------------------- | ------------------------------------------ |
| `Valid`                 | License is valid                           |
| `Invalid`               | License key format is invalid              |
| `Missing`               | No license key provided                    |
| `Expired`               | License has expired                        |
| `ExpiredForDevelopment` | Expired for dev, still valid in production |
| `GracePeriod`           | License expired but within grace period    |
| `PlanMismatch`          | License plan insufficient for feature      |
| `OutOfScope`            | License not valid for current domain       |

## Support

- Documentation: [claritychat.dev/docs](https://claritychat.dev/docs)
- Issues: [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- Email: support@claritychat.dev

---

© 2025 Code & Clarity. All rights reserved.
