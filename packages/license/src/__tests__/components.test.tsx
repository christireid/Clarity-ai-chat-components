/**
 * React Component Tests
 *
 * Tests for Watermark, withLicense HOCs, and LicenseProvider
 */

import * as React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Watermark, WatermarkOverlay } from '../Watermark'
import {
  withLicense,
  withLicenseStatus,
  createLicenseWrapper,
} from '../withLicense'
import {
  LicenseProvider,
  useLicenseContext,
  useLicenseContextOptional,
} from '../LicenseProvider'
import { LicenseInfo } from '../LicenseInfo'
import { generateLicenseKey } from '../generateLicense'

const TEST_SECRET = 'test-secret-key-12345'

// Helper to generate a valid test license
function createTestLicense(plan: 'community' | 'pro' | 'enterprise' = 'pro') {
  return generateLicenseKey(
    {
      orderNumber: 'CC-TEST-123',
      licensee: 'Test User',
      email: 'test@example.com',
      plan,
      scope: 'individual',
      durationDays: 365,
    },
    TEST_SECRET
  )
}

describe('Watermark Component', () => {
  it('should render with default message for Missing status', () => {
    render(<Watermark status="Missing" />)
    expect(screen.getByRole('status')).toHaveTextContent('Unlicensed')
  })

  it('should render with default message for Invalid status', () => {
    render(<Watermark status="Invalid" />)
    expect(screen.getByRole('status')).toHaveTextContent('Invalid License')
  })

  it('should render with default message for Expired status', () => {
    render(<Watermark status="Expired" />)
    expect(screen.getByRole('status')).toHaveTextContent('License Expired')
  })

  it('should render with default message for PlanMismatch status', () => {
    render(<Watermark status="PlanMismatch" />)
    expect(screen.getByRole('status')).toHaveTextContent('Upgrade Required')
  })

  it('should render custom message when provided', () => {
    render(<Watermark status="Missing" message="Custom Message" />)
    expect(screen.getByRole('status')).toHaveTextContent('Custom Message')
  })

  it('should apply custom className', () => {
    render(<Watermark status="Missing" className="custom-class" />)
    expect(screen.getByRole('status')).toHaveClass('custom-class')
  })

  it('should apply custom styles', () => {
    render(<Watermark status="Missing" style={{ backgroundColor: 'blue' }} />)
    const element = screen.getByRole('status')
    expect(element).toHaveStyle({ backgroundColor: 'blue' })
  })

  it('should set aria-label for accessibility', () => {
    render(<Watermark status="Missing" />)
    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      'Unlicensed'
    )
  })

  describe('position styles', () => {
    it('should position at top-right by default', () => {
      render(<Watermark status="Missing" />)
      const element = screen.getByRole('status')
      expect(element).toHaveStyle({
        position: 'absolute',
        top: '8px',
        right: '8px',
      })
    })

    it('should position at top-left when specified', () => {
      render(<Watermark status="Missing" position="top-left" />)
      const element = screen.getByRole('status')
      expect(element).toHaveStyle({
        position: 'absolute',
        top: '8px',
        left: '8px',
      })
    })

    it('should position at bottom-right when specified', () => {
      render(<Watermark status="Missing" position="bottom-right" />)
      const element = screen.getByRole('status')
      expect(element).toHaveStyle({
        position: 'absolute',
        bottom: '8px',
        right: '8px',
      })
    })

    it('should position at bottom-left when specified', () => {
      render(<Watermark status="Missing" position="bottom-left" />)
      const element = screen.getByRole('status')
      expect(element).toHaveStyle({
        position: 'absolute',
        bottom: '8px',
        left: '8px',
      })
    })
  })
})

describe('WatermarkOverlay Component', () => {
  it('should render children without watermark for Valid status', () => {
    render(
      <WatermarkOverlay status="Valid">
        <div data-testid="child">Content</div>
      </WatermarkOverlay>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('should render children with watermark for Missing status', () => {
    render(
      <WatermarkOverlay status="Missing">
        <div data-testid="child">Content</div>
      </WatermarkOverlay>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should pass watermark props to Watermark component', () => {
    render(
      <WatermarkOverlay
        status="Missing"
        message="Custom"
        position="bottom-left"
      >
        <div>Content</div>
      </WatermarkOverlay>
    )
    const watermark = screen.getByRole('status')
    expect(watermark).toHaveTextContent('Custom')
    expect(watermark).toHaveStyle({ bottom: '8px', left: '8px' })
  })
})

describe('withLicense HOC', () => {
  beforeEach(() => {
    LicenseInfo.clearLicenseKey()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  function TestComponent({ message }: { message: string }) {
    return <div data-testid="test-component">{message}</div>
  }

  it('should render component with watermark when unlicensed', () => {
    const LicensedComponent = withLicense(TestComponent, {
      componentName: 'TestComponent',
      showWatermark: true,
      showConsoleWarning: false,
    })

    render(<LicensedComponent message="Hello" />)
    expect(screen.getByTestId('test-component')).toHaveTextContent('Hello')
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should render component without watermark when licensed', () => {
    const validKey = createTestLicense('pro')
    LicenseInfo.setLicenseKey(validKey)

    const LicensedComponent = withLicense(TestComponent, {
      componentName: 'TestComponent',
      showWatermark: true,
      showConsoleWarning: false,
    })

    render(<LicensedComponent message="Hello" />)
    expect(screen.getByTestId('test-component')).toHaveTextContent('Hello')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('should log console warning when unlicensed', () => {
    const LicensedComponent = withLicense(TestComponent, {
      componentName: 'UniqueTestComponent1',
      showConsoleWarning: true,
    })

    render(<LicensedComponent message="Hello" />)
    expect(console.warn).toHaveBeenCalled()
  })

  it('should render fallback component when provided and unlicensed', () => {
    function Fallback() {
      return <div data-testid="fallback">Upgrade required</div>
    }

    const LicensedComponent = withLicense(TestComponent, {
      componentName: 'TestComponent',
      fallback: Fallback,
      showConsoleWarning: false,
    })

    render(<LicensedComponent message="Hello" />)
    expect(screen.getByTestId('fallback')).toBeInTheDocument()
    expect(screen.queryByTestId('test-component')).not.toBeInTheDocument()
  })

  it('should check plan level when requiredPlan is specified', () => {
    const communityKey = createTestLicense('community')
    LicenseInfo.setLicenseKey(communityKey)

    const ProComponent = withLicense(TestComponent, {
      componentName: 'ProTestComponent',
      requiredPlan: 'pro',
      showWatermark: true,
      showConsoleWarning: false,
    })

    render(<ProComponent message="Hello" />)
    // Should show watermark because community plan doesn't meet pro requirement
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should set correct displayName', () => {
    const LicensedComponent = withLicense(TestComponent, {
      componentName: 'MyComponent',
    })

    expect(LicensedComponent.displayName).toBe('withLicense(MyComponent)')
  })
})

describe('withLicenseStatus HOC', () => {
  beforeEach(() => {
    LicenseInfo.clearLicenseKey()
  })

  interface TestProps {
    title: string
    licenseStatus: { status: string }
    isLicensed: boolean
  }

  function StatusComponent({ title, isLicensed }: TestProps) {
    return (
      <div data-testid="status-component">
        {title} - {isLicensed ? 'Licensed' : 'Not Licensed'}
      </div>
    )
  }

  it('should inject license status props', () => {
    const WithStatus = withLicenseStatus(StatusComponent)

    render(<WithStatus title="Test" />)
    expect(screen.getByTestId('status-component')).toHaveTextContent(
      'Test - Not Licensed'
    )
  })

  it('should inject isLicensed=true when license is valid', () => {
    const validKey = createTestLicense('pro')
    LicenseInfo.setLicenseKey(validKey)

    const WithStatus = withLicenseStatus(StatusComponent)

    render(<WithStatus title="Test" />)
    expect(screen.getByTestId('status-component')).toHaveTextContent(
      'Test - Licensed'
    )
  })

  it('should set correct displayName', () => {
    const WithStatus = withLicenseStatus(StatusComponent)
    expect(WithStatus.displayName).toBe('withLicenseStatus(StatusComponent)')
  })
})

describe('createLicenseWrapper', () => {
  beforeEach(() => {
    LicenseInfo.clearLicenseKey()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  function SimpleComponent() {
    return <div data-testid="simple">Simple</div>
  }

  it('should create wrapper with default options', () => {
    const createProComponent = createLicenseWrapper({
      requiredPlan: 'pro',
      showWatermark: true,
      showConsoleWarning: false,
    })

    const ProSimple = createProComponent(SimpleComponent, 'SimpleComponent')

    render(<ProSimple />)
    expect(screen.getByTestId('simple')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})

describe('LicenseProvider', () => {
  it('should provide license context to children', () => {
    const validKey = createTestLicense('pro')

    function Consumer() {
      const { isValid, licensee, plan } = useLicenseContext()
      return (
        <div>
          <span data-testid="valid">{isValid ? 'yes' : 'no'}</span>
          <span data-testid="licensee">{licensee}</span>
          <span data-testid="plan">{plan}</span>
        </div>
      )
    }

    render(
      <LicenseProvider licenseKey={validKey}>
        <Consumer />
      </LicenseProvider>
    )

    expect(screen.getByTestId('valid')).toHaveTextContent('yes')
    expect(screen.getByTestId('licensee')).toHaveTextContent('Test User')
    expect(screen.getByTestId('plan')).toHaveTextContent('pro')
  })

  it('should provide invalid status when no license key', () => {
    function Consumer() {
      const { isValid, shouldShowWatermark } = useLicenseContext()
      return (
        <div>
          <span data-testid="valid">{isValid ? 'yes' : 'no'}</span>
          <span data-testid="watermark">
            {shouldShowWatermark ? 'yes' : 'no'}
          </span>
        </div>
      )
    }

    render(
      <LicenseProvider licenseKey={null}>
        <Consumer />
      </LicenseProvider>
    )

    expect(screen.getByTestId('valid')).toHaveTextContent('no')
    expect(screen.getByTestId('watermark')).toHaveTextContent('yes')
  })

  it('should check plan level with hasPlan', () => {
    const proKey = createTestLicense('pro')

    function Consumer() {
      const { hasPlan } = useLicenseContext()
      return (
        <div>
          <span data-testid="has-community">
            {hasPlan('community') ? 'yes' : 'no'}
          </span>
          <span data-testid="has-pro">{hasPlan('pro') ? 'yes' : 'no'}</span>
          <span data-testid="has-enterprise">
            {hasPlan('enterprise') ? 'yes' : 'no'}
          </span>
        </div>
      )
    }

    render(
      <LicenseProvider licenseKey={proKey}>
        <Consumer />
      </LicenseProvider>
    )

    expect(screen.getByTestId('has-community')).toHaveTextContent('yes')
    expect(screen.getByTestId('has-pro')).toHaveTextContent('yes')
    expect(screen.getByTestId('has-enterprise')).toHaveTextContent('no')
  })

  it('should throw error when useLicenseContext used outside provider', () => {
    function Consumer() {
      useLicenseContext()
      return null
    }

    expect(() => render(<Consumer />)).toThrow(
      'useLicenseContext must be used within a LicenseProvider'
    )
  })

  it('should return null from useLicenseContextOptional outside provider', () => {
    function Consumer() {
      const context = useLicenseContextOptional()
      return (
        <div data-testid="context">{context === null ? 'null' : 'exists'}</div>
      )
    }

    render(<Consumer />)
    expect(screen.getByTestId('context')).toHaveTextContent('null')
  })

  it('should memoize context value when licenseKey unchanged', () => {
    const validKey = createTestLicense('pro')
    const contextValues: unknown[] = []

    function Consumer() {
      const context = useLicenseContext()
      contextValues.push(context)
      return <div>Consumer</div>
    }

    const { rerender } = render(
      <LicenseProvider licenseKey={validKey}>
        <Consumer />
      </LicenseProvider>
    )

    rerender(
      <LicenseProvider licenseKey={validKey}>
        <Consumer />
      </LicenseProvider>
    )

    expect(contextValues[0]).toBe(contextValues[1])
  })
})
