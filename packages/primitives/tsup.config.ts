import { defineConfig } from 'tsup'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  entry: ['src/index.ts'],
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
