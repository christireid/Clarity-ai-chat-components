/**
 * Documentation UI Components
 *
 * Comprehensive set of reusable components for building documentation sites.
 * All components are TypeScript-typed, accessible, responsive, and support dark mode.
 *
 * @module @clarity-docs/components
 */

// Core Documentation Components
export {
  APICard,
  APICardGrid,
  type APIMetadata,
  type APICardProps,
  type APICardGridProps,
} from './APICard'
export {
  CodeBlock,
  InlineCode,
  type CodeBlockProps,
  type InlineCodeProps,
} from './CodeBlock'
export {
  ExampleSection,
  ExampleGrid,
  type ExampleSectionProps,
  type ExampleGridProps,
} from './ExampleSection'
export {
  RelatedAPIs,
  RelatedAPIsCompact,
  type RelatedAPI,
  type RelatedAPIsProps,
  type RelatedAPIsCompactProps,
} from './RelatedAPIs'

// Navigation Components
export { DocsSidebar, type NavItem, type DocsSidebarProps } from './DocsSidebar'
export { SearchBar, type SearchResult, type SearchBarProps } from './SearchBar'

// Layout Components
export { DocPage, type DocPageProps } from './DocPage'
export {
  TwoColumnLayout,
  ThreeColumnLayout,
  type TwoColumnLayoutProps,
  type ThreeColumnLayoutProps,
} from './TwoColumnLayout'

// Interactive Components
export {
  CopyButton,
  CopyButtonWithContent,
  type CopyButtonProps,
  type CopyButtonWithContentProps,
} from './CopyButton'
export {
  ToggleCode,
  ToggleCodeGroup,
  type ToggleCodeProps,
  type ToggleCodeGroupProps,
} from './ToggleCode'

// Live Code Preview Components (shadcn/ui style)
export {
  ComponentPreview,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from './ComponentPreview'
export { CodePreview, CodeTabs } from './CodePreview'
export { InlineCode as CodeInline } from './CodePreview'

// Installation & Framework Components
export {
  InstallTabs,
  CLICommand,
  CLIAdd,
  Steps,
  ComingSoonNotice,
} from './InstallTabs'
export { FrameworkTabs, FrameworkGuide } from './FrameworkTabs'

// Component Gallery
export { ComponentGallery, sampleComponents } from './ComponentGallery'

// Re-export existing enhanced components for convenience
export { PropsTable } from '../Enhanced/PropsTable'
export { Breadcrumbs, CollapsedBreadcrumbs } from '../Enhanced/Breadcrumbs'
export { TableOfContents } from '../Enhanced/TableOfContents'
export { LivePlayground } from '../Enhanced/LivePlayground'
