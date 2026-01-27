/**
 * Type declarations for PrismJS language components
 *
 * These modules are side-effect modules that register languages with Prism.
 * They don't export values - importing them registers the language.
 */

/** PrismJS language registration module type - side-effect only */
type PrismLanguageModule = void

declare module 'prismjs/components/prism-typescript' {
  const typescript: PrismLanguageModule
  export = typescript
}

declare module 'prismjs/components/prism-javascript' {
  const javascript: PrismLanguageModule
  export = javascript
}

declare module 'prismjs/components/prism-jsx' {
  const jsx: PrismLanguageModule
  export = jsx
}

declare module 'prismjs/components/prism-tsx' {
  const tsx: PrismLanguageModule
  export = tsx
}

declare module 'prismjs/components/prism-json' {
  const json: PrismLanguageModule
  export = json
}

declare module 'prismjs/components/prism-bash' {
  const bash: PrismLanguageModule
  export = bash
}

declare module 'prismjs/components/prism-css' {
  const css: PrismLanguageModule
  export = css
}

declare module 'prismjs/components/prism-python' {
  const python: PrismLanguageModule
  export = python
}

declare module 'prismjs/components/prism-yaml' {
  const yaml: PrismLanguageModule
  export = yaml
}

declare module 'prismjs/components/prism-markdown' {
  const markdown: PrismLanguageModule
  export = markdown
}

declare module 'prismjs/components/prism-sql' {
  const sql: PrismLanguageModule
  export = sql
}

declare module 'prismjs/components/prism-java' {
  const java: PrismLanguageModule
  export = java
}
