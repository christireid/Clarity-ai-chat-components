# GitHub Packages Quick Start - Private Packages

Complete setup guide for publishing and installing Clarity Chat packages via GitHub Packages.

## 🎯 Overview

All `@clarity-chat/*` packages are configured as **private packages** on GitHub Packages. This means:
- ✅ **Free for private repos** (with generous limits)
- ✅ **Integrated with GitHub** (same authentication)
- ✅ **Private by default** (restricted access)
- ✅ **Standard npm commands** (npm install works!)

---

## 🚀 For Publishers (You)

### Step 1: Generate GitHub Token

1. Go to: https://github.com/settings/tokens/new
2. Token name: `Clarity Chat Package Publishing`
3. Expiration: `90 days` (recommended)
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `write:packages` (Upload packages)
   - ✅ `read:packages` (Download packages)
   - ✅ `delete:packages` (Optional - delete packages)
5. Click **Generate token**
6. **Copy the token immediately** (you won't see it again!)

### Step 2: Run Setup Script

```bash
# Run the automated setup script
./setup-github-packages.sh

# Follow the prompts and paste your GitHub token when asked
```

**What this does:**
- Creates `.npmrc` with GitHub Packages configuration
- Adds authentication token
- Ensures `.npmrc` is in `.gitignore`
- Tests authentication

**Alternative: Manual Setup**

```bash
# Copy the example file
cp .npmrc.example .npmrc

# Edit .npmrc and replace YOUR_GITHUB_TOKEN with your actual token
nano .npmrc

# Add to .gitignore (if not already there)
echo ".npmrc" >> .gitignore
```

### Step 3: Build Packages

```bash
# Build all packages
npm run build

# This compiles TypeScript and bundles all packages
```

### Step 4: Publish to GitHub Packages

```bash
# Use the automated publishing script
./publish-to-github.sh

# This will:
# - Verify authentication
# - Build all packages
# - Publish to GitHub Packages
# - Show summary of published packages
```

**Alternative: Manual Publishing**

```bash
# Publish individual packages
cd packages/react
npm publish

cd ../types
npm publish

# etc...
```

### Step 5: Verify Published Packages

View your packages at:
```
https://github.com/christireid/Clarity-ai-chat-components/packages
```

Or list packages via API:
```bash
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/users/christireid/packages?package_type=npm
```

---

## 📥 For Consumers (Users Installing Your Packages)

### Step 1: Generate GitHub Token

Users need their own token to install private packages:

1. Go to: https://github.com/settings/tokens/new
2. Token name: `NPM Package Access`
3. Expiration: `90 days`
4. Select scopes:
   - ✅ `read:packages` (Download packages)
   - ✅ `repo` (if packages are in private repos)
5. Click **Generate token**
6. Copy the token

### Step 2: Configure `.npmrc` in Their Project

```bash
# In their project directory
cat > .npmrc << 'EOF'
@clarity-chat:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=THEIR_GITHUB_TOKEN_HERE
EOF

# Add to .gitignore
echo ".npmrc" >> .gitignore
```

### Step 3: Install Packages

```bash
# Install main package
npm install @clarity-chat/react

# Install multiple packages
npm install @clarity-chat/react @clarity-chat/types @clarity-chat/primitives

# With peer dependencies flag
npm install @clarity-chat/react --legacy-peer-deps
```

### Step 4: Use in Code

```tsx
// src/App.tsx
import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return (
    <ThemeProvider theme={themes.ocean}>
      <ChatWindow
        messages={[]}
        onSendMessage={async (content) => {
          // Your logic here
        }}
      />
    </ThemeProvider>
  )
}
```

---

## 🔧 Package Configuration

All packages are configured with:

```json
{
  "name": "@clarity-chat/package-name",
  "publishConfig": {
    "access": "restricted",
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/christireid/Clarity-ai-chat-components.git",
    "directory": "packages/package-name"
  }
}
```

This ensures:
- Packages are **private** (`access: restricted`)
- Published to **GitHub Packages** (`registry: npm.pkg.github.com`)
- Linked to the **correct repository**

---

## 📦 Available Packages

After publishing, these packages will be available:

| Package | Description | Install Command |
|---------|-------------|-----------------|
| `@clarity-chat/react` | Main component library | `npm install @clarity-chat/react` |
| `@clarity-chat/types` | TypeScript types | `npm install @clarity-chat/types` |
| `@clarity-chat/primitives` | Base UI components | `npm install @clarity-chat/primitives` |
| `@clarity-chat/error-handling` | Error recovery system | `npm install @clarity-chat/error-handling` |
| `@clarity-chat/cli` | CLI tool | `npm install -g @clarity-chat/cli` |
| `@clarity-chat/dev-tools` | Developer tools | `npm install -D @clarity-chat/dev-tools` |
| `@clarity-chat/errors` | Error classes | `npm install @clarity-chat/errors` |

---

## 🔐 Security Best Practices

### For Publishers:

1. **Never commit `.npmrc`** with your token
2. **Use separate tokens** for CI/CD vs local development
3. **Rotate tokens regularly** (every 90 days)
4. **Use minimal scopes** (only what's needed)
5. **Store tokens securely** (password manager)

### For Consumers:

1. **Never commit `.npmrc`** with tokens
2. **Use environment variables** in CI/CD:
   ```yaml
   # GitHub Actions
   - run: npm install
     env:
       GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   ```
3. **Keep tokens confidential**
4. **Revoke unused tokens**

---

## 🤝 Team Setup

### For Team Members:

```bash
# 1. Clone repository
git clone https://github.com/christireid/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components

# 2. Run setup script
./setup-github-packages.sh

# 3. Install dependencies
npm install --legacy-peer-deps

# 4. Build packages
npm run build

# 5. Start development
npm run dev
```

### Adding Team Members:

1. Invite to GitHub repository
2. They generate their own GitHub token
3. They run `./setup-github-packages.sh`
4. They're ready to develop!

---

## 🔄 CI/CD Setup

### GitHub Actions

```yaml
name: Publish Packages

on:
  push:
    branches: [main]
    paths:
      - 'packages/**'

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@clarity-chat'
      
      - name: Install dependencies
        run: npm ci --legacy-peer-deps
      
      - name: Build packages
        run: npm run build
      
      - name: Publish to GitHub Packages
        run: ./publish-to-github.sh
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Note:** `GITHUB_TOKEN` is automatically provided by GitHub Actions!

---

## 📊 Managing Package Versions

### Using Changesets (Recommended)

```bash
# 1. Create a changeset
npm run changeset

# 2. Select packages that changed
# 3. Choose version bump (major/minor/patch)
# 4. Write summary of changes

# 5. Version packages (updates package.json)
npm run version-packages

# 6. Commit the changes
git add .
git commit -m "chore: version packages"

# 7. Publish
./publish-to-github.sh
```

### Manual Versioning

```bash
# Update version in package.json
cd packages/react
npm version patch  # or minor, major

# Publish
npm publish
```

---

## 🐛 Troubleshooting

### "Unable to authenticate"

**Solution:**
```bash
# Verify token is valid
npm whoami --registry=https://npm.pkg.github.com

# If fails, regenerate token and update .npmrc
```

### "404 Package not found"

**Causes:**
- Package not published yet
- No access to private repository
- Incorrect package name

**Solution:**
```bash
# Publish the package first
./publish-to-github.sh

# Verify package name matches exactly
npm view @clarity-chat/react --registry=https://npm.pkg.github.com
```

### "403 Forbidden"

**Solution:**
- Token lacks `read:packages` scope
- For private repos, also need `repo` scope
- Regenerate token with correct scopes

### Publishing fails with "already published"

**Solution:**
```bash
# Bump version first
cd packages/react
npm version patch
git add package.json
git commit -m "chore: bump version"

# Then publish
npm publish
```

---

## 📈 Package Storage & Costs

GitHub Packages Free Tier (per month):
- **500 MB storage** (free)
- **1 GB data transfer** (free)

Beyond free tier:
- **$0.25/GB** storage
- **$0.50/GB** data transfer

**Typical Usage:**
- Each package ~1-5 MB
- 7 packages × 5 MB = ~35 MB storage
- Well within free tier! 🎉

---

## ✅ Quick Checklist

### For Publishers:

- [ ] Generated GitHub token with `write:packages` scope
- [ ] Ran `./setup-github-packages.sh`
- [ ] Built packages with `npm run build`
- [ ] Published with `./publish-to-github.sh`
- [ ] Verified packages at github.com/[username]/Clarity-ai-chat-components/packages

### For Consumers:

- [ ] Generated GitHub token with `read:packages` scope
- [ ] Created `.npmrc` in project
- [ ] Added `.npmrc` to `.gitignore`
- [ ] Successfully installed package with `npm install @clarity-chat/react`
- [ ] Can import and use the package

---

## 🆘 Need Help?

- 📖 [Full Documentation](./GITHUB_PACKAGES_GUIDE.md)
- 🔧 [Troubleshooting Guide](./TROUBLESHOOTING.md)
- 💬 [GitHub Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)
- 🐛 [Report Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)

---

**🎉 You're all set! Happy publishing!**
