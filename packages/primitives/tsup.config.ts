import { defineConfig } from 'tsup'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    // Granular entry points matching package.json exports
    'lib/glass-variants': 'src/lib/glass-variants.ts',
    'components/icons': 'src/components/icons.tsx',
    // Granular utility entry points for optimal tree-shaking
    'utils/number': 'src/lib/utils/number.ts',
    'utils/string': 'src/lib/utils/string.ts',
    'utils/array': 'src/lib/utils/array.ts',
    'utils/object': 'src/lib/utils/object.ts',
    'utils/type-guards': 'src/lib/utils/type-guards.ts',
    'utils/async': 'src/lib/utils/async.ts',
    'utils/file': 'src/lib/utils/file.ts',
    'utils/format': 'src/lib/utils/format.ts',
    'utils/classnames': 'src/lib/utils/classnames.ts',
    'utils/dom': 'src/lib/utils/dom.ts',
    'utils/style': 'src/lib/utils/style.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  external: ['react', 'react-dom', '@clarity-chat/utils', '@clarity-chat/utils/logger'],
  clean: true,
  sourcemap: true,
  minify: true,
  splitting: true,
  treeshake: true,
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.js' : '.mjs',
    }
  },
  async onSuccess() {
    // Post-build: Add 'use client' directive to compiled files
    // This is required for Next.js App Router to recognize client components
    // that use React hooks (useState, useEffect, useRef, etc.)
    // Without this directive, Next.js will throw errors when importing these
    // components in Server Components or during SSR
    const distDir = join(process.cwd(), 'dist')
    const files = ['index.mjs', 'index.js']
    
    for (const file of files) {
      const filePath = join(distDir, file)
      if (existsSync(filePath)) {
        let content = readFileSync(filePath, 'utf-8')
        // Remove any existing 'use client' directives
        content = content.replace(/^['"]use client['"];?\s*\n?/gm, '')
        // Add 'use client' at the very top
        if (!content.trim().startsWith("'use client'")) {
          content = "'use client'\n" + content
        }
        writeFileSync(filePath, content, 'utf-8')
      }
    }
  },
})
