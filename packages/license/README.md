# @clarity-chat/license

License validation for [Clarity Chat Pro](https://claritychat.dev) - Premium AI Chat Components for
React.

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

## Support

- Documentation: [claritychat.dev/docs](https://claritychat.dev/docs)
- Issues: [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- Email: support@claritychat.dev

---

© 2025 Code & Clarity. All rights reserved.
