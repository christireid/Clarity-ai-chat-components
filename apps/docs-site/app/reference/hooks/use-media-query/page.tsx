import React from 'react';
import { Metadata } from 'next';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';
import Callout from '@/components/Callout';

export const metadata: Metadata = {
  title: 'useMediaQuery Hook - Clarity Chat Components',
  description: 'A React hook for responsive design that detects and responds to CSS media query matches.',
};

export default function UseMediaQueryPage() {
  return (
    <div className="docs-content">
      <header className="docs-header">
        <div>
          <h1>useMediaQuery</h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">
            A React hook for responsive design that detects and responds to CSS media query matches.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The <code>useMediaQuery</code> hook listens to CSS media queries and returns a boolean indicating
          whether the query matches the current viewport. Perfect for building responsive components that
          adapt behavior based on screen size, orientation, color scheme, and more.
        </p>

        <Callout type="info" title="SSR-Safe">
          This hook is safe to use with server-side rendering and prevents hydration mismatches.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          code={`import { useMediaQuery } from '@clarity/chat-components';

export default function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Current Device:</h3>
      <p className="text-lg">
        {isMobile ? '📱 Mobile' : '💻 Desktop'}
      </p>
      <p className="text-sm text-gray-600 mt-2">
        {isMobile 
          ? 'Viewport is 768px or smaller'
          : 'Viewport is larger than 768px'}
      </p>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Parameters</h2>
        <ApiTable
          title="useMediaQuery Parameters"
          data={[
            {
              prop: 'query',
              type: 'string',
              default: 'undefined',
              description: 'CSS media query string to match (e.g., "(min-width: 768px)")'
            },
            {
              prop: 'options',
              type: 'object',
              default: '{}',
              description: 'Optional configuration object'
            },
            {
              prop: 'options.defaultValue',
              type: 'boolean',
              default: 'false',
              description: 'Default value returned during SSR or before mount'
            },
            {
              prop: 'options.initializeWithValue',
              type: 'boolean',
              default: 'true',
              description: 'Whether to immediately evaluate query on mount'
            }
          ]}
        />

        <ApiTable
          title="Return Value"
          data={[
            {
              prop: 'matches',
              type: 'boolean',
              default: 'undefined',
              description: 'Whether the media query currently matches'
            }
          ]}
        />
      </section>

      <section className="docs-section">
        <h2>Responsive Breakpoints</h2>
        <p>
          Detect common responsive breakpoints for mobile, tablet, and desktop.
        </p>
        <LiveDemo
          code={`import { useMediaQuery } from '@clarity/chat-components';

export default function ResponsiveBreakpoints() {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <div className={\`p-3 rounded-lg border \${isMobile ? 'bg-blue-50 border-blue-500' : 'bg-gray-50'}\`}>
          <div className="flex items-center justify-between">
            <span>📱 Mobile (&lt; 640px)</span>
            <span className={\`font-medium \${isMobile ? 'text-blue-600' : 'text-gray-400'}\`}>
              {isMobile ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className={\`p-3 rounded-lg border \${isTablet ? 'bg-blue-50 border-blue-500' : 'bg-gray-50'}\`}>
          <div className="flex items-center justify-between">
            <span>📲 Tablet (640px - 1023px)</span>
            <span className={\`font-medium \${isTablet ? 'text-blue-600' : 'text-gray-400'}\`}>
              {isTablet ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className={\`p-3 rounded-lg border \${isDesktop ? 'bg-blue-50 border-blue-500' : 'bg-gray-50'}\`}>
          <div className="flex items-center justify-between">
            <span>💻 Desktop (&gt; 1024px)</span>
            <span className={\`font-medium \${isDesktop ? 'text-blue-600' : 'text-gray-400'}\`}>
              {isDesktop ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
        <strong>Try resizing your browser window</strong> to see the active breakpoint change.
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Orientation Detection</h2>
        <p>
          Detect device orientation for tailored layouts.
        </p>
        <LiveDemo
          code={`import { useMediaQuery } from '@clarity/chat-components';

export default function OrientationDetection() {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isLandscape = useMediaQuery('(orientation: landscape)');

  return (
    <div className="p-6 border rounded-lg">
      <div className="text-6xl mb-4 text-center">
        {isPortrait ? '📱' : '🖥️'}
      </div>
      <h3 className="text-xl font-semibold text-center mb-2">
        {isPortrait ? 'Portrait Mode' : 'Landscape Mode'}
      </h3>
      <p className="text-sm text-gray-600 text-center">
        {isPortrait 
          ? 'Height is greater than width'
          : 'Width is greater than height'}
      </p>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Color Scheme Detection</h2>
        <p>
          Detect user's color scheme preference (light or dark mode).
        </p>
        <LiveDemo
          code={`import { useMediaQuery } from '@clarity/chat-components';

export default function ColorSchemeDetection() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersLight = useMediaQuery('(prefers-color-scheme: light)');

  return (
    <div className="space-y-3">
      <div className={\`p-4 rounded-lg border \${prefersDark ? 'bg-gray-900 text-white border-gray-700' : 'bg-white border-gray-300'}\`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{prefersDark ? '🌙' : '☀️'}</span>
          <div>
            <div className="font-semibold">
              System Preference: {prefersDark ? 'Dark' : 'Light'} Mode
            </div>
            <div className={\`text-sm \${prefersDark ? 'text-gray-400' : 'text-gray-600'}\`}>
              Detected from (prefers-color-scheme)
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
        💡 Change your system theme settings to see this update
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Reduced Motion Detection</h2>
        <p>
          Respect user's motion preferences for better accessibility.
        </p>
        <LiveDemo
          code={`import { useMediaQuery } from '@clarity/chat-components';

export default function MotionDetection() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">
            {prefersReducedMotion ? '🔇' : '✨'}
          </span>
          <div>
            <div className="font-semibold">
              {prefersReducedMotion ? 'Reduced Motion Enabled' : 'Animations Enabled'}
            </div>
            <div className="text-sm text-gray-600">
              {prefersReducedMotion 
                ? 'Respecting accessibility preference'
                : 'Full animations available'}
            </div>
          </div>
        </div>

        <div
          className={\`w-16 h-16 bg-blue-500 rounded-lg \${
            prefersReducedMotion ? '' : 'animate-bounce'
          }\`}
        />
      </div>

      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-900">
        ⚠️ Enable "Reduce motion" in your OS accessibility settings to see the difference
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Multiple Queries</h2>
        <p>
          Use multiple media queries for complex responsive logic.
        </p>
        <LiveDemo
          code={`import { useMediaQuery } from '@clarity/chat-components';

export default function MultipleQueries() {
  const isSmall = useMediaQuery('(max-width: 640px)');
  const isMedium = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const isLarge = useMediaQuery('(min-width: 1025px)');
  const isTouch = useMediaQuery('(hover: none) and (pointer: coarse)');
  const isHighDensity = useMediaQuery('(min-resolution: 2dppx)');

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 bg-gray-50 border rounded">
          <div className="text-xs font-medium text-gray-600 mb-1">Screen Size</div>
          <div className="font-semibold">
            {isSmall && 'Small (≤640px)'}
            {isMedium && 'Medium (641-1024px)'}
            {isLarge && 'Large (≥1025px)'}
          </div>
        </div>

        <div className="p-3 bg-gray-50 border rounded">
          <div className="text-xs font-medium text-gray-600 mb-1">Input Method</div>
          <div className="font-semibold">
            {isTouch ? '👆 Touch Device' : '🖱️ Mouse/Trackpad'}
          </div>
        </div>

        <div className="p-3 bg-gray-50 border rounded">
          <div className="text-xs font-medium text-gray-600 mb-1">Display Density</div>
          <div className="font-semibold">
            {isHighDensity ? '✨ Retina/HiDPI' : '📺 Standard'}
          </div>
        </div>

        <div className="p-3 bg-gray-50 border rounded">
          <div className="text-xs font-medium text-gray-600 mb-1">Layout Mode</div>
          <div className="font-semibold">
            {isSmall ? '📱 Mobile' : isMedium ? '📲 Tablet' : '💻 Desktop'}
          </div>
        </div>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Conditional Rendering</h2>
        <p>
          Render different components based on media query matches.
        </p>
        <LiveDemo
          code={`import { useMediaQuery } from '@clarity/chat-components';

function MobileNav() {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
      <div className="font-semibold mb-2">📱 Mobile Navigation</div>
      <div className="text-sm text-gray-700">
        Hamburger menu, bottom nav, simplified layout
      </div>
    </div>
  );
}

function DesktopNav() {
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded">
      <div className="font-semibold mb-2">💻 Desktop Navigation</div>
      <div className="text-sm text-gray-700">
        Full menu bar, sidebar, expanded options
      </div>
    </div>
  );
}

export default function ConditionalRendering() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="space-y-3">
      {isMobile ? <MobileNav /> : <DesktopNav />}
      
      <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
        Resize your browser to see the navigation change
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Breakpoints</h2>
        <p>
          Create reusable breakpoint hooks for your design system.
        </p>
        <LiveDemo
          code={`import { useMediaQuery } from '@clarity/chat-components';

// Custom hooks for your breakpoints
function useBreakpoint() {
  const isSm = useMediaQuery('(min-width: 640px)');
  const isMd = useMediaQuery('(min-width: 768px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1280px)');
  const is2Xl = useMediaQuery('(min-width: 1536px)');

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    currentBreakpoint: is2Xl ? '2xl' : isXl ? 'xl' : isLg ? 'lg' : isMd ? 'md' : isSm ? 'sm' : 'xs'
  };
}

export default function CustomBreakpoints() {
  const { currentBreakpoint, isSm, isMd, isLg, isXl, is2Xl } = useBreakpoint();

  return (
    <div className="space-y-4">
      <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
        <div className="text-4xl font-bold mb-2">
          {currentBreakpoint.toUpperCase()}
        </div>
        <div className="text-sm opacity-90">
          Current Breakpoint
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {[
          { name: 'xs', active: !isSm },
          { name: 'sm', active: isSm && !isMd },
          { name: 'md', active: isMd && !isLg },
          { name: 'lg', active: isLg && !isXl },
          { name: 'xl', active: isXl && !is2Xl },
          { name: '2xl', active: is2Xl }
        ].map(bp => (
          <div
            key={bp.name}
            className={\`p-2 text-center rounded border \${
              bp.active 
                ? 'bg-blue-100 border-blue-500 font-semibold' 
                : 'bg-gray-50 border-gray-200 text-gray-400'
            }\`}
          >
            {bp.name}
          </div>
        ))}
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Responsive Component State</h3>
        <p>
          Adjust component behavior dynamically based on screen size.
        </p>
        <LiveDemo
          code={`import { useMediaQuery } from '@clarity/chat-components';

export default function ResponsiveTable() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const data = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { name: 'Bob Johnson', email: 'bob@example.com', role: 'User' }
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      {isDesktop ? (
        // Desktop: Table layout
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((item, i) => (
              <tr key={i}>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2 text-gray-600">{item.email}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {item.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // Mobile: Card layout
        <div className="divide-y">
          {data.map((item, i) => (
            <div key={i} className="p-4">
              <div className="font-semibold mb-1">{item.name}</div>
              <div className="text-sm text-gray-600 mb-2">{item.email}</div>
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                {item.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`}
        />

        <h3>Performance Optimization</h3>
        <p>
          Conditionally load heavy components only when needed.
        </p>
        <LiveDemo
          code={`import { useMediaQuery } from '@clarity/chat-components';

export default function LazyLoadByBreakpoint() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold mb-2">Always Visible Content</h3>
        <p className="text-sm text-gray-600">
          This content is loaded on all devices.
        </p>
      </div>

      {isDesktop && (
        <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-2">
            Desktop-Only Content
          </h3>
          <p className="text-sm text-purple-700">
            This heavy component is only loaded on desktop screens
            to improve mobile performance.
          </p>
        </div>
      )}

      <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
        {isDesktop 
          ? '💻 Desktop: All features loaded'
          : '📱 Mobile: Optimized lightweight version'}
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>SSR Considerations</h2>
        <p>
          Handle server-side rendering safely with default values:
        </p>

        <pre><code>{`import { useMediaQuery } from '@clarity/chat-components';

// ✅ Good: Provide default value for SSR
function MyComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)', {
    defaultValue: false, // Assume desktop on server
    initializeWithValue: false // Wait for client
  });

  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
}

// ⚠️ May cause hydration mismatch without default
function MyComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  // Server renders false, client might render true
  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
}`}</code></pre>

        <Callout type="warning" title="Hydration Mismatches">
          When using SSR, always provide a <code>defaultValue</code> that matches your
          expected server render to avoid hydration mismatches. Consider using
          <code>initializeWithValue: false</code> for client-only queries.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>
        <p>
          Best practices for using media queries accessibly:
        </p>

        <h3>Respect User Preferences</h3>
        <ul>
          <li>Always check <code>prefers-reduced-motion</code> before adding animations</li>
          <li>Respect <code>prefers-color-scheme</code> for theme detection</li>
          <li>Consider <code>prefers-contrast</code> for high contrast needs</li>
          <li>Check <code>prefers-reduced-transparency</code> for visual effects</li>
        </ul>

        <h3>Touch vs Mouse Detection</h3>
        <ul>
          <li>Use <code>(hover: hover)</code> to detect hover capability</li>
          <li>Use <code>(pointer: coarse)</code> for touch devices</li>
          <li>Use <code>(pointer: fine)</code> for mouse/trackpad</li>
          <li>Don't rely solely on screen size for touch detection</li>
        </ul>

        <pre><code>{`// Check for touch capability
const isTouch = useMediaQuery('(hover: none) and (pointer: coarse)');

// Check for precise pointer
const hasPrecisePointer = useMediaQuery('(hover: hover) and (pointer: fine)');`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <h3>Performance</h3>
        <ul>
          <li>Media query listeners are efficiently managed and cleaned up automatically</li>
          <li>Multiple components can safely use the same query without duplication</li>
          <li>Consider debouncing resize-heavy operations separately</li>
          <li>Use conditional rendering to avoid loading unnecessary code</li>
        </ul>

        <h3>Design Guidelines</h3>
        <ul>
          <li>Define breakpoints in a central place for consistency</li>
          <li>Use mobile-first approach: start with mobile, enhance for desktop</li>
          <li>Test on real devices, not just browser resize</li>
          <li>Consider tablet as a unique breakpoint, not just "between mobile and desktop"</li>
          <li>Use semantic breakpoint names (isMobile, isTablet) over pixel values</li>
        </ul>

        <h3>Common Breakpoints</h3>
        <pre><code>{`// Tailwind CSS default breakpoints
const breakpoints = {
  sm: '(min-width: 640px)',   // Small tablets
  md: '(min-width: 768px)',   // Tablets
  lg: '(min-width: 1024px)',  // Laptops
  xl: '(min-width: 1280px)',  // Desktops
  '2xl': '(min-width: 1536px)' // Large displays
};

// Bootstrap breakpoints
const breakpoints = {
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1400px)'
};`}</code></pre>

        <Callout type="info" title="Design Tokens">
          Consider using design tokens or CSS custom properties for breakpoints
          that are shared between your CSS and JavaScript logic.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <p>
          The useMediaQuery hook is fully typed with TypeScript:
        </p>
        <pre><code>{`interface UseMediaQueryOptions {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
}

export function useMediaQuery(
  query: string,
  options?: UseMediaQueryOptions
): boolean;

// Usage with types
const isMobile: boolean = useMediaQuery('(max-width: 768px)');

// With options
const isDark: boolean = useMediaQuery(
  '(prefers-color-scheme: dark)',
  { defaultValue: false }
);

// Type-safe breakpoint hook
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

function useBreakpoint(): Breakpoint {
  const isSm = useMediaQuery('(min-width: 640px)');
  const isMd = useMediaQuery('(min-width: 768px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1280px)');
  
  if (isXl) return 'xl';
  if (isLg) return 'lg';
  if (isMd) return 'md';
  if (isSm) return 'sm';
  return 'xs';
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related Hooks</h2>
        <ul>
          <li><a href="/reference/hooks/use-window-size">useWindowSize</a> - Get current window dimensions</li>
          <li><a href="/reference/hooks/use-breakpoint">useBreakpoint</a> - Tailwind-style breakpoint detection</li>
          <li><a href="/reference/hooks/use-theme">useTheme</a> - Theme management with color scheme detection</li>
        </ul>
      </section>
    </div>
  );
}
