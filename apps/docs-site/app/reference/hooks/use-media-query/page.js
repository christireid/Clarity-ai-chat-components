import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LiveDemo } from '@/components/Demo/LiveDemo';
import { ApiTable } from '@/components/Demo/ApiTable';
import { Callout } from '@/components/MDX/Callout';
export const metadata = {
    title: 'useMediaQuery Hook - Clarity Chat Components',
    description: 'A React hook for responsive design that detects and responds to CSS media query matches.',
};
export default function UseMediaQueryPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsx("header", { className: "docs-header", children: _jsxs("div", { children: [_jsx("h1", { children: "useMediaQuery" }), _jsx("p", { className: "text-xl text-neutral-700 dark:text-neutral-300 mt-2", children: "A React hook for responsive design that detects and responds to CSS media query matches." })] }) }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsxs("p", { children: ["The ", _jsx("code", { children: "useMediaQuery" }), " hook listens to CSS media queries and returns a boolean indicating whether the query matches the current viewport. Perfect for building responsive components that adapt behavior based on screen size, orientation, color scheme, and more."] }), _jsx(Callout, { type: "info", title: "SSR-Safe", children: "This hook is safe to use with server-side rendering and prevents hydration mismatches." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(LiveDemo, { code: `import { useMediaQuery } from '@clarity/chat-components';

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
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Parameters" }), _jsx(ApiTable, { title: "useMediaQuery Parameters", data: [
                            {
                                name: 'query',
                                type: 'string',
                                default: 'undefined',
                                description: 'CSS media query string to match (e.g., "(min-width: 768px)")'
                            },
                            {
                                name: 'options',
                                type: 'object',
                                default: '{}',
                                description: 'Optional configuration object'
                            },
                            {
                                name: 'options.defaultValue',
                                type: 'boolean',
                                default: 'false',
                                description: 'Default value returned during SSR or before mount'
                            },
                            {
                                name: 'options.initializeWithValue',
                                type: 'boolean',
                                default: 'true',
                                description: 'Whether to immediately evaluate query on mount'
                            }
                        ] }), _jsx(ApiTable, { title: "Return Value", data: [
                            {
                                name: 'matches',
                                type: 'boolean',
                                default: 'undefined',
                                description: 'Whether the media query currently matches'
                            }
                        ] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Responsive Breakpoints" }), _jsx("p", { children: "Detect common responsive breakpoints for mobile, tablet, and desktop." }), _jsx(LiveDemo, { code: `import { useMediaQuery } from '@clarity/chat-components';

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
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Orientation Detection" }), _jsx("p", { children: "Detect device orientation for tailored layouts." }), _jsx(LiveDemo, { code: `import { useMediaQuery } from '@clarity/chat-components';

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
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Color Scheme Detection" }), _jsx("p", { children: "Detect user's color scheme preference (light or dark mode)." }), _jsx(LiveDemo, { code: `import { useMediaQuery } from '@clarity/chat-components';

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
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Reduced Motion Detection" }), _jsx("p", { children: "Respect user's motion preferences for better accessibility." }), _jsx(LiveDemo, { code: `import { useMediaQuery } from '@clarity/chat-components';

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
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Multiple Queries" }), _jsx("p", { children: "Use multiple media queries for complex responsive logic." }), _jsx(LiveDemo, { code: `import { useMediaQuery } from '@clarity/chat-components';

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
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Conditional Rendering" }), _jsx("p", { children: "Render different components based on media query matches." }), _jsx(LiveDemo, { code: `import { useMediaQuery } from '@clarity/chat-components';

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
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Custom Breakpoints" }), _jsx("p", { children: "Create reusable breakpoint hooks for your design system." }), _jsx(LiveDemo, { code: `import { useMediaQuery } from '@clarity/chat-components';

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
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Advanced Patterns" }), _jsx("h3", { children: "Responsive Component State" }), _jsx("p", { children: "Adjust component behavior dynamically based on screen size." }), _jsx(LiveDemo, { code: `import { useMediaQuery } from '@clarity/chat-components';

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
}` }), _jsx("h3", { children: "Performance Optimization" }), _jsx("p", { children: "Conditionally load heavy components only when needed." }), _jsx(LiveDemo, { code: `import { useMediaQuery } from '@clarity/chat-components';

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
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "SSR Considerations" }), _jsx("p", { children: "Handle server-side rendering safely with default values:" }), _jsx("pre", { children: _jsx("code", { children: `import { useMediaQuery } from '@clarity/chat-components';

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
}` }) }), _jsxs(Callout, { type: "warning", title: "Hydration Mismatches", children: ["When using SSR, always provide a ", _jsx("code", { children: "defaultValue" }), " that matches your expected server render to avoid hydration mismatches. Consider using", _jsx("code", { children: "initializeWithValue: false" }), " for client-only queries."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Accessibility" }), _jsx("p", { children: "Best practices for using media queries accessibly:" }), _jsx("h3", { children: "Respect User Preferences" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Always check ", _jsx("code", { children: "prefers-reduced-motion" }), " before adding animations"] }), _jsxs("li", { children: ["Respect ", _jsx("code", { children: "prefers-color-scheme" }), " for theme detection"] }), _jsxs("li", { children: ["Consider ", _jsx("code", { children: "prefers-contrast" }), " for high contrast needs"] }), _jsxs("li", { children: ["Check ", _jsx("code", { children: "prefers-reduced-transparency" }), " for visual effects"] })] }), _jsx("h3", { children: "Touch vs Mouse Detection" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Use ", _jsx("code", { children: "(hover: hover)" }), " to detect hover capability"] }), _jsxs("li", { children: ["Use ", _jsx("code", { children: "(pointer: coarse)" }), " for touch devices"] }), _jsxs("li", { children: ["Use ", _jsx("code", { children: "(pointer: fine)" }), " for mouse/trackpad"] }), _jsx("li", { children: "Don't rely solely on screen size for touch detection" })] }), _jsx("pre", { children: _jsx("code", { children: `// Check for touch capability
const isTouch = useMediaQuery('(hover: none) and (pointer: coarse)');

// Check for precise pointer
const hasPrecisePointer = useMediaQuery('(hover: hover) and (pointer: fine)');` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsx("h3", { children: "Performance" }), _jsxs("ul", { children: [_jsx("li", { children: "Media query listeners are efficiently managed and cleaned up automatically" }), _jsx("li", { children: "Multiple components can safely use the same query without duplication" }), _jsx("li", { children: "Consider debouncing resize-heavy operations separately" }), _jsx("li", { children: "Use conditional rendering to avoid loading unnecessary code" })] }), _jsx("h3", { children: "Design Guidelines" }), _jsxs("ul", { children: [_jsx("li", { children: "Define breakpoints in a central place for consistency" }), _jsx("li", { children: "Use mobile-first approach: start with mobile, enhance for desktop" }), _jsx("li", { children: "Test on real devices, not just browser resize" }), _jsx("li", { children: "Consider tablet as a unique breakpoint, not just \"between mobile and desktop\"" }), _jsx("li", { children: "Use semantic breakpoint names (isMobile, isTablet) over pixel values" })] }), _jsx("h3", { children: "Common Breakpoints" }), _jsx("pre", { children: _jsx("code", { children: `// Tailwind CSS default breakpoints
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
};` }) }), _jsx(Callout, { type: "info", title: "Design Tokens", children: "Consider using design tokens or CSS custom properties for breakpoints that are shared between your CSS and JavaScript logic." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "TypeScript" }), _jsx("p", { children: "The useMediaQuery hook is fully typed with TypeScript:" }), _jsx("pre", { children: _jsx("code", { children: `interface UseMediaQueryOptions {
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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related Hooks" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: "/reference/hooks/use-window-size", children: "useWindowSize" }), " - Get current window dimensions"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/hooks/use-breakpoint", children: "useBreakpoint" }), " - Tailwind-style breakpoint detection"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/hooks/use-theme", children: "useTheme" }), " - Theme management with color scheme detection"] })] })] })] }));
}
//# sourceMappingURL=page.js.map