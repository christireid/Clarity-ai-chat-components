import { defineConfig } from 'tsup'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false, // Keep readable for transparency
  external: ['react'],
  esbuildOptions(options) {
    options.banner = {
      js: '// @clarity-chat/license - License validation for Clarity Chat Pro',
    }
  },
  async onSuccess() {
    // Post-build: Add 'use client' directive to compiled files
    // This is required for Next.js App Router to recognize client components
    // that use React hooks (useState, useEffect, useSyncExternalStore, etc.)
    // Without this directive, Next.js will throw errors when importing these
    // components in Server Components or during SSR
    const distDir = join(process.cwd(), 'dist')
    const files = ['index.js', 'index.mjs']
    
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
