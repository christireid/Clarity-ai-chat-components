<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ChatWindow, Message } from '@clarity-chat/react'
import * as React from 'react'
import { createRoot, Root } from 'react-dom/client'

interface Props {
  code: string
  title?: string
  description?: string
  defaultMessages?: Message[]
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Interactive Playground',
  description: '',
  defaultMessages: () => []
})

const containerRef = ref<HTMLDivElement>()
const codeEditorRef = ref<HTMLTextAreaElement>()
const showCode = ref(false)
const editableCode = ref(props.code)
const error = ref<string>('')
const isLoading = ref(false)

let reactRoot: Root | null = null

const sanitizeCode = (code: string) => {
  const lines = code.split('\n')
  const output: string[] = []
  const reactImports = new Set<string>()

  for (const line of lines) {
    const trimmed = line.trim()

    const defaultReactImport = line.match(
      /^import\s+React(?:\s*,\s*\{([^}]+)\})?\s+from\s+['"]react['"]\s*;?\s*$/
    )
    if (defaultReactImport) {
      const named = defaultReactImport[1]
      if (named) {
        named
          .split(',')
          .map(part => part.trim())
          .filter(Boolean)
          .forEach(name => reactImports.add(name))
      }
      continue
    }

    const namedReactImport = line.match(
      /^import\s*\{\s*([^}]+)\s*\}\s*from\s+['"]react['"]\s*;?\s*$/
    )
    if (namedReactImport) {
      namedReactImport[1]
        .split(',')
        .map(part => part.trim())
        .filter(Boolean)
        .forEach(name => reactImports.add(name))
      continue
    }

    if (trimmed.startsWith('import ')) {
      // Other imports (e.g., component imports) are provided through the sandbox
      continue
    }

    output.push(line)
  }

  const reactBinding = reactImports.size
    ? `const { ${Array.from(reactImports).join(', ')} } = React\n`
    : ''

  const body = output.join('\n')

  if (!/export\s+default\s+/.test(body)) {
    throw new Error('Playground examples must end with "export default"')
  }

  const cleaned = body.replace(/export\s+default\s+/g, 'return ')

  return `${reactBinding}${cleaned}`
}

const renderPreview = () => {
  if (!containerRef.value) return

  try {
    error.value = ''
    
    // Clean up previous render
    if (reactRoot) {
      reactRoot.unmount()
    }

    // Create new React root and render
    reactRoot = createRoot(containerRef.value)

    // Evaluate code in sandbox
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
    const sandbox = {
      React,
      ChatWindow,
      Message,
      console,
    }

    const preparedCode = sanitizeCode(editableCode.value)

    const exported = new AsyncFunction(
      ...Object.keys(sandbox),
      preparedCode
    )(...Object.values(sandbox))

    const component = React.isValidElement(exported)
      ? exported
      : typeof exported === 'function'
        ? React.createElement(exported)
        : exported && typeof exported.default === 'function'
          ? React.createElement(exported.default)
          : null

    if (!component) {
      throw new Error('Playground code must export a React component.')
    }

    reactRoot.render(component)
  } catch (err: any) {
    error.value = err.message || 'Failed to render component'
    console.error('Playground error:', err)
  }
}

const handleCodeChange = () => {
  renderPreview()
}

const resetCode = () => {
  editableCode.value = props.code
  renderPreview()
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(editableCode.value)
    // Show success feedback
    const btn = document.getElementById('copy-btn')
    if (btn) {
      btn.textContent = '✓ Copied!'
      setTimeout(() => {
        btn.textContent = 'Copy Code'
      }, 2000)
    }
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}

onMounted(() => {
  renderPreview()
})
</script>

<template>
  <div class="playground">
    <div class="playground-header">
      <h3>{{ title }}</h3>
      <p v-if="description" class="description">{{ description }}</p>
    </div>

    <div class="playground-preview">
      <div ref="containerRef" class="preview-container"></div>
      <div v-if="error" class="error-message">
        <strong>Error:</strong> {{ error }}
      </div>
    </div>

    <div class="playground-controls">
      <button @click="showCode = !showCode" class="btn-secondary">
        {{ showCode ? 'Hide Code' : 'Show Code' }}
      </button>
      <button v-if="showCode" @click="resetCode" class="btn-secondary">
        Reset
      </button>
      <button v-if="showCode" id="copy-btn" @click="copyCode" class="btn-secondary">
        Copy Code
      </button>
    </div>

    <div v-if="showCode" class="playground-editor">
      <textarea
        ref="codeEditorRef"
        v-model="editableCode"
        @input="handleCodeChange"
        class="code-editor"
        spellcheck="false"
      />
    </div>
  </div>
</template>

<style scoped>
.playground {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  margin: 24px 0;
}

.playground-header {
  padding: 16px 20px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.playground-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.description {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.playground-preview {
  padding: 24px;
  background: var(--vp-c-bg);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-container {
  width: 100%;
  max-width: 800px;
  height: 600px;
}

.error-message {
  padding: 16px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: #c33;
  font-family: monospace;
  font-size: 14px;
}

.playground-controls {
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
}

.btn-secondary {
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand);
}

.playground-editor {
  border-top: 1px solid var(--vp-c-divider);
}

.code-editor {
  width: 100%;
  height: 300px;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  background: var(--vp-code-block-bg);
  color: var(--vp-code-block-color);
  border: none;
  resize: vertical;
  outline: none;
}

.code-editor:focus {
  background: var(--vp-c-bg);
}
</style>
