import React from 'react';
import { Metadata } from 'next';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';
import Callout from '@/components/Callout';

export const metadata: Metadata = {
  title: 'Skeleton Component - Clarity Chat Components',
  description: 'A placeholder component that displays a loading skeleton while content is being fetched.',
};

export default function SkeletonPage() {
  return (
    <div className="docs-content">
      <header className="docs-header">
        <div>
          <h1>Skeleton</h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">
            A placeholder component that displays a loading skeleton while content is being fetched.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The Skeleton component provides placeholder content that mimics the structure of the actual content
          being loaded. This creates a better perceived performance and reduces layout shift compared to
          showing spinners or blank states.
        </p>

        <Callout type="info" title="Perceived Performance">
          Skeleton screens make apps feel faster by showing structure immediately,
          even before data arrives. Users perceive the page as loading faster.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          code={`import { Skeleton } from '@clarity/chat-components';

export default function BasicSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="Skeleton Props"
          data={[
            {
              prop: 'variant',
              type: "'text' | 'circular' | 'rectangular'",
              default: "'rectangular'",
              description: 'Shape variant of the skeleton'
            },
            {
              prop: 'width',
              type: 'number | string',
              default: "'100%'",
              description: 'Width of the skeleton'
            },
            {
              prop: 'height',
              type: 'number | string',
              default: 'undefined',
              description: 'Height of the skeleton'
            },
            {
              prop: 'animation',
              type: "'pulse' | 'wave' | 'none'",
              default: "'pulse'",
              description: 'Animation style'
            },
            {
              prop: 'className',
              type: 'string',
              default: 'undefined',
              description: 'Additional CSS classes'
            }
          ]}
        />
      </section>

      <section className="docs-section">
        <h2>Variants</h2>
        <p>
          Choose from different shapes to match your content structure.
        </p>
        <LiveDemo
          code={`import { Skeleton } from '@clarity/chat-components';

export default function SkeletonVariants() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-gray-600 mb-2">Rectangular (default)</div>
        <Skeleton className="h-32 w-full" />
      </div>

      <div>
        <div className="text-sm text-gray-600 mb-2">Circular</div>
        <Skeleton variant="circular" className="w-16 h-16" />
      </div>

      <div>
        <div className="text-sm text-gray-600 mb-2">Text</div>
        <div className="space-y-2">
          <Skeleton variant="text" className="h-4" />
          <Skeleton variant="text" className="h-4 w-3/4" />
          <Skeleton variant="text" className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Animations</h2>
        <p>
          Choose from different animation styles or disable animation entirely.
        </p>
        <LiveDemo
          code={`import { Skeleton } from '@clarity/chat-components';

export default function SkeletonAnimations() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-gray-600 mb-2">Pulse (default)</div>
        <Skeleton animation="pulse" className="h-20 w-full" />
      </div>

      <div>
        <div className="text-sm text-gray-600 mb-2">Wave</div>
        <Skeleton animation="wave" className="h-20 w-full" />
      </div>

      <div>
        <div className="text-sm text-gray-600 mb-2">No Animation</div>
        <Skeleton animation="none" className="h-20 w-full" />
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>User Profile Skeleton</h2>
        <p>
          A common pattern for loading user profile information.
        </p>
        <LiveDemo
          code={`import { Skeleton } from '@clarity/chat-components';

export default function UserProfileSkeleton() {
  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" className="w-16 h-16" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Card Skeleton</h2>
        <p>
          Loading state for card-based layouts.
        </p>
        <LiveDemo
          code={`import { Skeleton } from '@clarity/chat-components';

export default function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>List Skeleton</h2>
        <p>
          Loading state for list items and table rows.
        </p>
        <LiveDemo
          code={`import { Skeleton } from '@clarity/chat-components';

export default function ListSkeleton() {
  return (
    <div className="border rounded-lg divide-y">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="p-4 flex items-center gap-4">
          <Skeleton variant="circular" className="w-10 h-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Form Skeleton</h2>
        <p>
          Loading state for form layouts.
        </p>
        <LiveDemo
          code={`import { Skeleton } from '@clarity/chat-components';

export default function FormSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-6">
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Chat Message Skeleton</h2>
        <p>
          Loading state specifically for chat interfaces.
        </p>
        <LiveDemo
          code={`import { Skeleton } from '@clarity/chat-components';

export default function ChatSkeleton() {
  return (
    <div className="space-y-4">
      {/* Incoming message */}
      <div className="flex gap-3">
        <Skeleton variant="circular" className="w-8 h-8" />
        <div className="flex-1 space-y-2 max-w-md">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Outgoing message */}
      <div className="flex gap-3 flex-row-reverse">
        <Skeleton variant="circular" className="w-8 h-8" />
        <div className="flex-1 space-y-2 max-w-md">
          <Skeleton className="h-12 w-full rounded-2xl bg-blue-200" />
          <div className="flex justify-end">
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>

      {/* Typing indicator */}
      <div className="flex gap-3">
        <Skeleton variant="circular" className="w-8 h-8" />
        <Skeleton className="h-10 w-20 rounded-2xl" animation="pulse" />
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Conditional Loading</h2>
        <p>
          Toggle between skeleton and actual content based on loading state.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Skeleton, Button } from '@clarity/chat-components';

export default function ConditionalSkeleton() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-4">
      <Button onClick={() => setLoading(!loading)}>
        Toggle Loading
      </Button>

      <div className="border rounded-lg p-6">
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" className="w-12 h-12" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div>
                <div className="font-semibold">John Doe</div>
                <div className="text-sm text-gray-600">Software Engineer</div>
              </div>
            </div>
            <p className="text-gray-700">
              This is the actual content that replaced the skeleton.
              It shows real user information and bio.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Staggered Animation</h3>
        <p>
          Create staggered loading animations for better visual interest.
        </p>
        <LiveDemo
          code={`import { Skeleton } from '@clarity/chat-components';

export default function StaggeredSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 100, 200, 300].map((delay, i) => (
        <div
          key={i}
          className="border rounded-lg p-4 flex items-center gap-4"
          style={{ animationDelay: \`\${delay}ms\` }}
        >
          <Skeleton variant="circular" className="w-12 h-12" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}`}
        />

        <h3>Skeleton with Logo</h3>
        <p>
          Include branding elements while content loads.
        </p>
        <LiveDemo
          code={`import { Skeleton } from '@clarity/chat-components';

export default function BrandedSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
        <div className="text-white text-4xl font-bold">LOGO</div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 -mt-12">
          <div className="w-20 h-20 rounded-full border-4 border-white bg-white shadow-lg">
            <Skeleton variant="circular" className="w-full h-full" />
          </div>
          <div className="flex-1 space-y-2 mt-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>
        <p>
          The Skeleton component includes accessibility features:
        </p>

        <h3>ARIA Attributes</h3>
        <ul>
          <li><code>aria-busy="true"</code> - Indicates content is loading</li>
          <li><code>aria-label="Loading..."</code> - Descriptive label for screen readers</li>
          <li><code>role="status"</code> - Announces loading state</li>
        </ul>

        <h3>Screen Reader Support</h3>
        <ul>
          <li>Skeleton screens announce "Loading" to screen readers</li>
          <li>When content loads, focus and announcements update appropriately</li>
          <li>Avoid showing skeleton for extended periods (use timeout)</li>
        </ul>

        <Callout type="warning" title="Reduced Motion">
          Skeleton animations respect <code>prefers-reduced-motion</code> settings
          and disable animations for users who prefer reduced motion.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <h3>When to Use</h3>
        <ul>
          <li>✅ Initial page load with structured content</li>
          <li>✅ Fetching list items or card grids</li>
          <li>✅ Loading user profiles and dashboard data</li>
          <li>✅ When content structure is known in advance</li>
          <li>✅ To reduce perceived loading time</li>
        </ul>

        <h3>When Not to Use</h3>
        <ul>
          <li>❌ For very fast loads (under 300ms) - content may flash</li>
          <li>❌ When content structure is completely unknown</li>
          <li>❌ For background updates - use subtle indicators instead</li>
          <li>❌ In form validation - use inline feedback</li>
        </ul>

        <h3>Design Guidelines</h3>
        <ul>
          <li>Match skeleton structure closely to actual content layout</li>
          <li>Use similar dimensions to real content to avoid layout shift</li>
          <li>Maintain consistent spacing and alignment</li>
          <li>Use subtle animation - avoid distracting motion</li>
          <li>Combine with minimum display time to prevent flashing</li>
          <li>Consider dark mode - skeletons should work in both themes</li>
          <li>Show skeleton for at least 300ms if it appears at all</li>
        </ul>

        <h3>Performance Guidelines</h3>
        <ul>
          <li>Skeleton screens are lightweight and performant</li>
          <li>CSS-only animations avoid JavaScript overhead</li>
          <li>Render skeleton on server for immediate display</li>
          <li>Avoid too many skeleton elements (diminishing returns)</li>
        </ul>

        <Callout type="info" title="Progressive Enhancement">
          Combine skeletons with progressive data loading - show partial content
          as it arrives rather than waiting for everything to load.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <p>
          The Skeleton component is fully typed with TypeScript:
        </p>
        <pre><code>{`type SkeletonVariant = 'text' | 'circular' | 'rectangular';
type SkeletonAnimation = 'pulse' | 'wave' | 'none';

interface SkeletonProps {
  // Appearance
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  animation?: SkeletonAnimation;
  
  // Styling
  className?: string;
}

export default function Skeleton(props: SkeletonProps): JSX.Element;

// Helper component for common patterns
interface SkeletonTextProps {
  lines?: number;
  width?: string | string[];
}

export function SkeletonText(props: SkeletonTextProps): JSX.Element;`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related Components</h2>
        <ul>
          <li><a href="/reference/components/spinner">Spinner</a> - Indeterminate loading indicator</li>
          <li><a href="/reference/components/progress">Progress</a> - Determinate progress indicator</li>
          <li><a href="/reference/hooks/use-loading">useLoading</a> - Loading state management hook</li>
        </ul>
      </section>
    </div>
  );
}
