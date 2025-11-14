# Validation Checklist

After the successful modernization merge to main, run these validation steps:

## 1. Install Dependencies
```bash
pnpm install
```

## 2. Type Checking
```bash
pnpm typecheck
```

## 3. Linting
```bash
pnpm lint
```

## 4. Testing
```bash
pnpm test
```

## 5. Build All Packages
```bash
pnpm build
```

## 6. Test Storybook Build
```bash
cd apps/storybook
pnpm build
```

## 7. Test Next.js Apps
```bash
cd apps/docs-site
pnpm build

cd ../marketing-site
pnpm build
```

## 8. Verify Examples Build
Test a few key examples:
```bash
cd examples/basic-chat
pnpm build

cd ../streaming-chat
pnpm build
```

## Common Issues to Watch For

### TypeScript Errors
- Check for any `@types/react` version mismatches
- Verify all imports resolve correctly
- Check for any `any` types that need fixing

### React 19 Compatibility
- Verify no deprecated React APIs
- Check that hooks are used correctly
- Ensure ErrorBoundary is class component

### Next.js 16 Compatibility
- Verify App Router usage
- Check Server Components work correctly
- Test Server Actions if used

### Build Errors
- Check for missing dependencies
- Verify peer dependencies are satisfied
- Check for version conflicts

## Next Steps After Validation

1. Fix any issues found
2. Update documentation if needed
3. Create release notes
4. Tag the release
5. Deploy to production
