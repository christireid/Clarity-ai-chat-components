# Migration Checklist: v1.x → v2.0

**Project:** _________________________
**Date Started:** ___________________
**Completed By:** ___________________
**Team:** ___________________________

---

## Pre-Migration (Before You Start)

### Planning & Preparation

- [ ] **Read migration guide** - Review complete v1-to-v2 guide
- [ ] **Backup project** - Create git branch or backup
  ```bash
  git checkout -b migration/v2.0
  git commit -am "Checkpoint before v2.0 migration"
  ```
- [ ] **Audit features** - List which features you're using:
  - [ ] Basic chat
  - [ ] Token optimization
  - [ ] RAG / Document loaders (PDF, DOCX)
  - [ ] Cohere reranking
  - [ ] Mermaid diagrams
  - [ ] Advanced syntax highlighting
  - [ ] Markdown rendering
- [ ] **Record baseline** - Document current metrics:
  - Bundle size: _____________ MB
  - Test coverage: ____________ %
  - TypeScript errors: ________
  - Build time: _______________ s
- [ ] **Check dependencies** - Review package.json
- [ ] **Run tests** - Ensure all tests pass on v1.x
  ```bash
  npm test
  ```
- [ ] **Check TypeScript** - No errors on v1.x
  ```bash
  npm run typecheck
  ```

### Environment Setup

- [ ] **Node.js version** - v18+ recommended
  ```bash
  node -v  # Should be >= 18.0.0
  ```
- [ ] **Package manager** - npm, pnpm, or yarn updated
- [ ] **CI/CD access** - Can update build pipelines if needed
- [ ] **Staging environment** - Available for testing

---

## Migration Phase (Core Changes)

### Step 1: Package Update

- [ ] **Install v2.0**
  ```bash
  npm install @clarity-chat/react@2.0.0
  ```
- [ ] **Verify installation**
  ```bash
  npm ls @clarity-chat/react
  ```

### Step 2: Peer Dependencies

**Required (everyone must install):**

- [ ] **framer-motion**
  ```bash
  npm install framer-motion@^12.23.25
  ```
- [ ] **lucide-react**
  ```bash
  npm install lucide-react@^0.500.0
  ```
- [ ] **zod**
  ```bash
  npm install zod@^3.24.0
  ```

**Optional (install if using feature):**

- [ ] **flowtoken** (token optimization)
  ```bash
  npm install flowtoken@^1.0.0
  ```
- [ ] **pdfjs-dist** (PDF loader)
  ```bash
  npm install pdfjs-dist@^4.0.0
  ```
- [ ] **mammoth** (DOCX loader)
  ```bash
  npm install mammoth@^1.0.0
  ```
- [ ] **jszip** (ZIP handling)
  ```bash
  npm install jszip@^3.10.0
  ```
- [ ] **cohere-ai** (Cohere reranking)
  ```bash
  npm install cohere-ai@^7.0.0
  ```
- [ ] **shiki** (advanced syntax highlighting)
  ```bash
  npm install shiki@^3.0.0
  ```
- [ ] **mermaid** (diagrams)
  ```bash
  npm install mermaid@^11.0.0
  ```
- [ ] **prismjs** (code highlighting)
  ```bash
  npm install prismjs@^1.29.0
  ```
- [ ] **react-markdown** (markdown rendering)
  ```bash
  npm install react-markdown@^10.0.0
  ```
- [ ] **remark-gfm** (GitHub Flavored Markdown)
  ```bash
  npm install remark-gfm@^4.0.0
  ```
- [ ] **rehype-highlight** (code highlighting in markdown)
  ```bash
  npm install rehype-highlight@^7.0.0
  ```

### Step 3: Run Automated Migration

- [ ] **Download codemod script**
  ```bash
  curl -O https://raw.githubusercontent.com/christireid/Clarity-ai-chat-components/main/scripts/migrate-v1-to-v2.js
  chmod +x migrate-v1-to-v2.js
  ```
- [ ] **Dry run** - Review changes without modifying files
  ```bash
  node migrate-v1-to-v2.js src/ --dry-run
  ```
- [ ] **Review dry run output** - Check what will be changed
- [ ] **Run migration with backup**
  ```bash
  node migrate-v1-to-v2.js src/ --backup --verbose
  ```
- [ ] **Review migration report** - Check `migration-report.json`

### Step 4: Manual Code Updates

#### Hook Imports

- [ ] **Find remaining useChat imports**
  ```bash
  grep -r "useChat" src/ --include="*.tsx" --include="*.ts"
  ```
- [ ] **Replace with useClarityChat**
  ```tsx
  // Before
  import { useChat } from '@clarity-chat/react'

  // After
  import { useClarityChat } from '@clarity-chat/react'
  ```
- [ ] **Update hook calls**
  ```tsx
  // Before
  const chat = useChat({ api: '/api/chat' })

  // After
  const chat = useClarityChat({ api: '/api/chat' })
  ```

#### Component Props

- [ ] **Update ChatWindow props** (if using nested props)
  ```tsx
  // Before (v1.x nested props)
  <ChatWindow
    messageActions={{ onCopy: handleCopy }}
    editActions={{ editingMessageId: id }}
    header={{ show: true, title: 'Chat' }}
  />

  // After (v2.0 top-level props)
  <ChatWindow
    onMessageCopy={handleCopy}
    editingMessageId={id}
    showHeader={true}
    sessionTitle="Chat"
  />
  ```
- [ ] **Update other component props** (if applicable)

#### Import Paths

- [ ] **Update token optimization imports**
  ```tsx
  // Before
  import { TokenCounter } from '@clarity-chat/react/internal'

  // After
  import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
  ```
- [ ] **Update component subpath imports**
  ```tsx
  // Before
  import { ToolCard } from '@clarity-chat/react/components/ai/ToolCard'

  // After
  import { ToolCard } from '@clarity-chat/react'
  ```

#### Deprecated Components

- [ ] **Replace Think component**
  ```tsx
  // Before
  import { Think } from '@clarity-chat/react'

  // After
  import { ThinkingPill } from '@clarity-chat/react'
  ```

### Step 5: Update Configuration Files

#### package.json

- [ ] **Update dependencies section**
  ```json
  {
    "dependencies": {
      "@clarity-chat/react": "^2.0.0",
      "framer-motion": "^12.23.25",
      "lucide-react": "^0.500.0",
      "zod": "^3.24.0"
    }
  }
  ```

#### TypeScript Config (if needed)

- [ ] **Ensure proper module resolution**
  ```json
  {
    "compilerOptions": {
      "moduleResolution": "bundler",
      "types": ["@clarity-chat/react"]
    }
  }
  ```

#### Bundler Config (optional optimization)

- [ ] **Configure code splitting** (optional)
  ```typescript
  // vite.config.ts or next.config.js
  // Add manual chunks for better splitting
  ```

---

## Testing Phase (Verify Migration)

### Automated Tests

- [ ] **Clear caches**
  ```bash
  rm -rf node_modules/.cache
  rm -rf .next/cache
  rm -rf dist/
  ```
- [ ] **TypeScript check**
  ```bash
  npm run typecheck
  ```
  - [ ] No errors
  - [ ] No new warnings
- [ ] **Lint check**
  ```bash
  npm run lint
  ```
- [ ] **Unit tests**
  ```bash
  npm test
  ```
  - [ ] All tests pass
  - [ ] No new failures
- [ ] **Build**
  ```bash
  npm run build
  ```
  - [ ] Build succeeds
  - [ ] No errors
  - [ ] Check bundle size reduction

### Manual Testing

#### Core Functionality

- [ ] **Send messages** - Messages send and appear correctly
- [ ] **Receive responses** - AI responses stream properly
- [ ] **Loading states** - Loading indicators show/hide correctly
- [ ] **Error handling** - Errors display appropriately

#### Message Features

- [ ] **Copy message** - Copy button works
- [ ] **Edit message** - Edit functionality works
- [ ] **Delete message** - Delete functionality works
- [ ] **Retry message** - Retry works
- [ ] **Message feedback** - Thumbs up/down works
- [ ] **Regenerate** - Regenerate works

#### UI/UX

- [ ] **Animations** - Smooth animations (no jank)
- [ ] **Responsive design** - Works on mobile/tablet/desktop
- [ ] **Dark mode** - Theme switching works (if applicable)
- [ ] **Accessibility** - Keyboard navigation works
- [ ] **Screen reader** - ARIA labels present

#### Feature-Specific

- [ ] **Token optimization** (if used)
  - [ ] Token counter displays
  - [ ] Budget warnings show
  - [ ] Compression works
- [ ] **Document loaders** (if used)
  - [ ] PDF upload and parsing
  - [ ] DOCX upload and parsing
  - [ ] File previews
- [ ] **Cohere reranking** (if used)
  - [ ] Search results reranked
  - [ ] Relevance scores displayed
- [ ] **Code highlighting** (if used)
  - [ ] Syntax highlighting renders
  - [ ] Copy code works
  - [ ] Language detection works
- [ ] **Markdown rendering** (if used)
  - [ ] Markdown formats correctly
  - [ ] GFM features work
  - [ ] Code blocks highlight

### Browser Testing

- [ ] **Chrome** - Latest version
- [ ] **Firefox** - Latest version
- [ ] **Safari** - Latest version (macOS/iOS)
- [ ] **Edge** - Latest version

### Performance Testing

- [ ] **Bundle size** - Compare to baseline
  - Before: _________ MB
  - After: __________ MB
  - Reduction: _______ %
- [ ] **Initial load time** - Measure improvement
  - Before: _________ s
  - After: __________ s
- [ ] **Time to interactive** - Check metrics
- [ ] **Lighthouse score** - Run audit
  - Performance: ____
  - Accessibility: ____
  - Best Practices: ____

---

## Deployment Phase

### Staging Environment

- [ ] **Deploy to staging**
  ```bash
  # Your deployment command
  ```
- [ ] **Smoke test** - Basic functionality works
- [ ] **Full regression test** - All features work
- [ ] **Monitor errors** - Check error logs
- [ ] **Performance metrics** - Verify improvements

### CI/CD Updates

- [ ] **Update build pipeline** - Install peer dependencies
  ```yaml
  # Example GitHub Actions
  - run: npm ci
  - run: npm install framer-motion lucide-react zod
  ```
- [ ] **Update deploy script** - If needed
- [ ] **Test CI/CD** - Ensure builds pass

### Production Deployment

- [ ] **Create feature flag** (optional, for gradual rollout)
- [ ] **Deploy to production**
- [ ] **Monitor metrics**
  - [ ] Error rate
  - [ ] Performance
  - [ ] User feedback
- [ ] **Gradual rollout** (if using feature flag)
  - [ ] 10% of users
  - [ ] 50% of users
  - [ ] 100% of users

---

## Post-Migration

### Documentation

- [ ] **Update internal docs** - Document changes for team
- [ ] **Update README** - Update version requirements
- [ ] **Update CHANGELOG** - Note migration completed
- [ ] **Share learnings** - Document issues and solutions

### Cleanup

- [ ] **Remove backup files** (if created by codemod)
  ```bash
  find src/ -name "*.v1.backup" -delete
  ```
- [ ] **Remove old branches** - Clean up migration branches
- [ ] **Archive migration reports** - Save for reference

### Optimization (Optional)

- [ ] **Review optional dependencies** - Remove unused
- [ ] **Configure code splitting** - Further optimize bundles
- [ ] **Update import statements** - Use tree-shakeable imports
- [ ] **Enable advanced features** - Now that migration is stable

---

## Rollback Plan (If Needed)

### Immediate Rollback Steps

If critical issues arise:

- [ ] **Revert via git**
  ```bash
  git checkout main
  # or
  git revert <migration-commit>
  ```
- [ ] **Or restore backups**
  ```bash
  find src/ -name "*.v1.backup" -exec bash -c 'mv "$0" "${0%.v1.backup}"' {} \;
  ```
- [ ] **Downgrade package**
  ```bash
  npm install @clarity-chat/react@1.1.0
  ```
- [ ] **Remove peer dependencies** (optional)
  ```bash
  npm uninstall framer-motion lucide-react zod flowtoken mermaid pdfjs-dist
  ```
- [ ] **Reinstall**
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- [ ] **Test rollback** - Verify v1.x works
- [ ] **Notify team** - Communicate rollback
- [ ] **Report issue** - File GitHub issue with details

---

## Success Criteria

Migration is considered successful when:

- [x] All required peer dependencies installed
- [x] No TypeScript errors
- [x] All tests passing
- [x] Build succeeds
- [x] Bundle size reduced significantly
- [x] All features working in staging
- [x] No increase in error rate
- [x] Performance metrics improved
- [x] Successfully deployed to production
- [x] No critical issues reported

---

## Notes & Issues

Use this space to document any issues encountered and their solutions:

### Issue 1:
**Problem:**

**Solution:**

**Time to resolve:**

---

### Issue 2:
**Problem:**

**Solution:**

**Time to resolve:**

---

### Issue 3:
**Problem:**

**Solution:**

**Time to resolve:**

---

## Sign-Off

**Developer:** _________________ **Date:** _________

**QA Lead:** __________________ **Date:** _________

**Tech Lead:** ________________ **Date:** _________

**Approved for Production:** [ ] Yes [ ] No

---

## Timeline

| Phase | Planned Date | Actual Date | Status |
|-------|--------------|-------------|--------|
| Planning | | | |
| Development | | | |
| Testing | | | |
| Staging | | | |
| Production | | | |

---

## Resources

- **Migration Guide:** /guides/migration/v1-to-v2
- **Codemod Script:** `scripts/migrate-v1-to-v2.js`
- **GitHub Issues:** https://github.com/christireid/Clarity-ai-chat-components/issues
- **Documentation:** https://clarity-chat.dev
- **Support:** Discord / GitHub Discussions

---

**Last Updated:** 2026-01-28
**Version:** 1.0
