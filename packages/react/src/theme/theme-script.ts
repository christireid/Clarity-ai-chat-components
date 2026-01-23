/**
 * Pre-hydration Theme Script
 *
 * This script should be inlined in the <head> of your HTML document
 * to prevent theme flash during SSR/hydration.
 *
 * @example
 * ```tsx
 * // Next.js app/layout.tsx
 * import { themeScript } from '@clarity-chat/react/theme'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en" suppressHydrationWarning>
 *       <head>
 *         <script dangerouslySetInnerHTML={{ __html: themeScript }} />
 *       </head>
 *       <body>
 *         <ThemeProvider>{children}</ThemeProvider>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */

/**
 * The inline script to prevent theme flash.
 * This runs synchronously before React hydration.
 */
export const themeScript = `
(function() {
  try {
    // Get stored theme preferences
    var stored = localStorage.getItem('clarity-chat-theme');
    var parsed = stored ? JSON.parse(stored) : { mode: 'system' };
    var mode = parsed.mode || 'system';

    // Resolve system preference
    if (mode === 'system') {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      mode = prefersDark ? 'dark' : 'light';
    }

    // Apply dark class immediately (before paint)
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply theme preset if set
    if (parsed.preset) {
      document.documentElement.setAttribute('data-theme', parsed.preset);
    }

    // Set color-scheme for native elements
    document.documentElement.style.colorScheme = mode;
  } catch (e) {
    // Fail silently - defaults to light mode
  }
})();
`.trim()

/**
 * Get the theme script as a string for use in HTML templates.
 *
 * @param storageKey - Custom localStorage key (default: 'clarity-chat-theme')
 * @returns The inline script string
 */
export function getThemeScript(storageKey = 'clarity-chat-theme'): string {
  return `
(function() {
  try {
    var stored = localStorage.getItem('${storageKey}');
    var parsed = stored ? JSON.parse(stored) : { mode: 'system' };
    var mode = parsed.mode || 'system';

    if (mode === 'system') {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      mode = prefersDark ? 'dark' : 'light';
    }

    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (parsed.preset) {
      document.documentElement.setAttribute('data-theme', parsed.preset);
    }

    document.documentElement.style.colorScheme = mode;
  } catch (e) {}
})();
`.trim()
}
