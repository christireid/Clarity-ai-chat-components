/**
 * Integration test for documentation template system
 *
 * Verifies that all extracted components work together correctly.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  PropsTable,
  Section,
  SubSection,
  DocumentationPage,
  type PropDefinition,
  type TocItem,
} from '../index'
import { Layout } from 'lucide-react'

describe('Documentation Template System', () => {
  describe('PropsTable', () => {
    it('renders props with all fields', () => {
      const props: PropDefinition[] = [
        {
          name: 'message',
          type: 'string',
          required: true,
          description: 'Message content to display',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description: 'Loading state indicator',
        },
      ]

      render(<PropsTable props={props} title="Test Props" />)

      expect(screen.getByText('Test Props')).toBeInTheDocument()
      expect(screen.getByText('message')).toBeInTheDocument()
      expect(screen.getByText('string')).toBeInTheDocument()
      expect(screen.getByText('*')).toHaveAttribute('title', 'Required')
      expect(screen.getByText('isLoading')).toBeInTheDocument()
      expect(screen.getByText('false')).toBeInTheDocument()
    })

    it('marks deprecated props', () => {
      const props: PropDefinition[] = [
        {
          name: 'oldProp',
          type: 'string',
          deprecated: true,
          deprecatedMessage: 'Use newProp instead',
          description: 'Deprecated property',
        },
      ]

      render(<PropsTable props={props} />)

      expect(screen.getByText('deprecated')).toBeInTheDocument()
      expect(screen.getByText('Use newProp instead')).toBeInTheDocument()
    })
  })

  describe('Section and SubSection', () => {
    it('renders sections with anchor links', () => {
      render(
        <Section id="overview" title="Overview">
          <p>Section content</p>
          <SubSection id="details" title="Details">
            <p>Subsection content</p>
          </SubSection>
        </Section>
      )

      expect(screen.getByText('Overview')).toBeInTheDocument()
      expect(screen.getByText('Details')).toBeInTheDocument()
      expect(screen.getByText('Section content')).toBeInTheDocument()
      expect(screen.getByText('Subsection content')).toBeInTheDocument()

      // Check anchor links
      const overviewLink = screen.getByText('Overview').closest('a')
      expect(overviewLink).toHaveAttribute('href', '#overview')
    })
  })

  describe('DocumentationPage', () => {
    it('renders complete documentation page structure', () => {
      const tableOfContents: TocItem[] = [
        { id: 'overview', title: 'Overview' },
        { id: 'props', title: 'Props' },
      ]

      render(
        <DocumentationPage
          title="TestComponent"
          description="A test component for documentation"
          icon={Layout}
          badges={[{ label: 'Stable', variant: 'stable' }]}
          packageName="@clarity-chat/react"
          tableOfContents={tableOfContents}
        >
          <Section id="overview" title="Overview">
            <p>Component overview</p>
          </Section>
        </DocumentationPage>
      )

      expect(screen.getByText('TestComponent')).toBeInTheDocument()
      expect(screen.getByText('A test component for documentation')).toBeInTheDocument()
      expect(screen.getByText('Stable')).toBeInTheDocument()
      expect(screen.getByText('@clarity-chat/react')).toBeInTheDocument()
      expect(screen.getByText('On this page')).toBeInTheDocument()
    })

    it('renders with feature highlights', () => {
      const tableOfContents: TocItem[] = [{ id: 'overview', title: 'Overview' }]

      render(
        <DocumentationPage
          title="TestComponent"
          description="Test description"
          icon={Layout}
          badges={[]}
          packageName="@clarity-chat/react"
          tableOfContents={tableOfContents}
          features={[
            {
              icon: Layout,
              label: 'Composable',
              description: 'Highly composable',
            },
          ]}
        >
          <div>Content</div>
        </DocumentationPage>
      )

      expect(screen.getByText('Composable')).toBeInTheDocument()
      expect(screen.getByText('Highly composable')).toBeInTheDocument()
    })
  })
})
