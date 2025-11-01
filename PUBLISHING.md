# Publishing Guide - Private NPM Packages

This guide explains how to publish the Clarity Chat packages privately to npm.

## 🔐 Prerequisites

### Option 1: NPM Registry (Recommended)

1. **NPM Account**: You need an npm account with a paid plan (Pro, Teams, or Enterprise) to publish private packages
   - Sign up at: https://www.npmjs.com/signup
   - Upgrade to paid plan: https://www.npmjs.com/products

2. **Authentication Token**: 
   - Go to: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Click "Generate New Token"
   - Choose "Automation" or "Publish" type
   - Copy the token (you won't see it again!)

3. **Configure .npmrc**:
   ```bash
   # Copy the example file
   cp .npmrc.example .npmrc
   
   # Edit .npmrc and add your token
   echo "//registry.npmjs.org/:_authToken=YOUR_NPM_TOKEN_HERE" >> .npmrc
   ```

### Option 2: GitHub Packages (Alternative)

1. **GitHub Token**:
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scope: `write:packages`
   - Copy the token

2. **Configure .npmrc**:
   ```bash
   # Copy the example file
   cp .npmrc.example .npmrc
   
   # Edit .npmrc for GitHub Packages
   cat >> .npmrc << EOF
   @clarity-chat:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN_HERE
   EOF
   ```

## 📦 Package Configuration

All packages are already configured with `"publishConfig": { "access": "restricted" }` which makes them private by default.

### Packages Ready for Publishing:

- `@clarity-chat/react` - Main component library
- `@clarity-chat/types` - TypeScript definitions
- `@clarity-chat/primitives` - Base UI components  
- `@clarity-chat/error-handling` - Error recovery system
- `@clarity-chat/cli` - CLI tool
- `@clarity-chat/dev-tools` - Developer tools
- `@clarity-chat/errors` - Error classes

## 🚀 Publishing Process

### 1. Build All Packages

```bash
# Build all packages
npm run build

# Or build individually
npm run build --workspace=@clarity-chat/react
npm run build --workspace=@clarity-chat/types
npm run build --workspace=@clarity-chat/primitives
npm run build --workspace=@clarity-chat/error-handling
```

### 2. Version Management

We use Changesets for version management:

```bash
# Create a changeset (documents what changed)
npm run changeset

# Follow the prompts:
# 1. Select packages that changed
# 2. Choose version bump type (major/minor/patch)
# 3. Write a summary of changes

# Version packages (updates package.json versions)
npm run version-packages

# This creates a "Version Packages" PR with updated versions
```

### 3. Publish to NPM

```bash
# Publish all packages (requires .npmrc authentication)
npm run release

# This will:
# 1. Build all packages
# 2. Run changeset publish
# 3. Push git tags
# 4. Publish to npm registry
```

### Alternative: Publish Individual Packages

```bash
# Publish one package at a time
cd packages/react
npm publish

cd ../types
npm publish

# etc...
```

## 🔒 Security Best Practices

1. **Never commit .npmrc**: It's already in .gitignore
2. **Use environment variables**:
   ```bash
   # Set token in environment
   export NPM_TOKEN=your_token_here
   
   # Or use in CI/CD
   echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > .npmrc
   ```

3. **Rotate tokens regularly**: Generate new tokens every 3-6 months

4. **Use automation tokens in CI/CD**: Don't use your personal access tokens

## 📥 Installing Private Packages

Users who want to install your private packages need:

### Option 1: NPM Registry
1. NPM account with access to your organization/packages
2. Authenticated npm client:
   ```bash
   npm login
   npm install @clarity-chat/react
   ```

### Option 2: GitHub Packages
1. GitHub account with access to the repository
2. Configured .npmrc:
   ```bash
   # User's .npmrc
   @clarity-chat:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=THEIR_GITHUB_TOKEN
   ```
3. Install packages:
   ```bash
   npm install @clarity-chat/react
   ```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Publish Packages

on:
  push:
    branches: [main]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Configure NPM
        run: |
          echo "//registry.npmjs.org/:_authToken=${{ secrets.NPM_TOKEN }}" > .npmrc
          
      - name: Install dependencies
        run: npm ci --legacy-peer-deps
        
      - name: Build packages
        run: npm run build
        
      - name: Publish
        run: npm run release
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Add `NPM_TOKEN` to your repository secrets at:
`https://github.com/YOUR_ORG/YOUR_REPO/settings/secrets/actions`

## 💰 Cost Considerations

### NPM Registry Pricing (as of 2024):
- **Pro**: $7/month - Unlimited private packages for 1 user
- **Teams**: $7/user/month - Unlimited private packages for unlimited users
- **Enterprise**: Custom pricing - Advanced features and support

### GitHub Packages:
- **Free**: 500MB storage, 1GB/month transfer for private packages
- **Paid**: $0.25/GB storage, $0.50/GB transfer beyond free tier

## 📚 Additional Resources

- [NPM Private Packages Documentation](https://docs.npmjs.com/about-private-packages)
- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [NPM Publishing Best Practices](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

## 🆘 Troubleshooting

### "You must sign up for private packages"
- You need an npm Pro or Teams account to publish private packages
- Upgrade at: https://www.npmjs.com/products

### "Permission denied" errors
- Check your authentication token is valid
- Ensure your account has publish permissions for @clarity-chat scope

### Build failures before publish
- Run `npm run build` to check for TypeScript errors
- Fix any type errors before publishing

### Version conflicts
- Use `npm run version-packages` to manage versions
- Follow semantic versioning (MAJOR.MINOR.PATCH)
