# GitHub Packages - Installation Guide

This guide explains how to install packages from GitHub Packages (both for publishers and consumers).

## 📦 What is GitHub Packages?

GitHub Packages is a package hosting service integrated with GitHub that allows you to host npm packages (and other package types) alongside your source code. It's **free** for public repositories and has a generous free tier for private packages.

## 🔐 Prerequisites for Downloading

To download packages from GitHub Packages, users need:

1. **GitHub Account** with access to the repository
2. **Personal Access Token (PAT)** with `read:packages` scope
3. **Configured `.npmrc` file** in their project

---

## 📥 For Package Consumers (Users Installing Your Packages)

### Step 1: Generate GitHub Personal Access Token

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Give it a descriptive name (e.g., "NPM Package Access")
4. Select scopes:
   - ✅ `read:packages` - Download packages from GitHub Packages
   - ✅ `write:packages` - (Only if they need to publish packages)
   - ✅ `repo` - (Only if packages are in private repos)
5. Click **"Generate token"**
6. **Copy the token immediately** (you won't see it again!)

### Step 2: Configure `.npmrc` in Your Project

Create or edit `.npmrc` in your project root:

```bash
# Create .npmrc file
cat > .npmrc << 'EOF'
@clarity-chat:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN_HERE
EOF
```

**Important**: Replace `YOUR_GITHUB_TOKEN_HERE` with your actual token.

**Alternative: Use Environment Variable (Recommended for CI/CD)**

```bash
# .npmrc
@clarity-chat:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then set the environment variable:
```bash
export GITHUB_TOKEN=ghp_your_token_here
```

### Step 3: Install Packages

Now you can install packages normally:

```bash
# Install a specific package
npm install @clarity-chat/react

# Install multiple packages
npm install @clarity-chat/react @clarity-chat/types @clarity-chat/primitives

# Install with legacy peer deps (if needed)
npm install @clarity-chat/react --legacy-peer-deps
```

### Step 4: Verify Installation

```bash
# Check installed version
npm list @clarity-chat/react

# View package info
npm view @clarity-chat/react
```

---

## 🔒 Security Best Practices for Consumers

### 1. Never Commit `.npmrc` with Tokens

Add to `.gitignore`:
```bash
echo ".npmrc" >> .gitignore
```

### 2. Use `.npmrc` Template

Provide an `.npmrc.example` for your team:

```bash
# .npmrc.example
@clarity-chat:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE
```

Team members copy and fill in their own token:
```bash
cp .npmrc.example .npmrc
# Then edit .npmrc with your token
```

### 3. Use Environment Variables in CI/CD

**GitHub Actions:**
```yaml
- name: Install dependencies
  run: npm install
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Other CI Systems:**
```bash
# In CI configuration, set:
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc
npm install
```

---

## 📤 For Package Publishers (You)

### Step 1: Configure Package for GitHub Packages

Update each `package.json`:

```json
{
  "name": "@clarity-chat/react",
  "version": "0.1.0",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/christireid/Clarity-ai-chat-components.git"
  }
}
```

**Key points:**
- `name` must match the format `@OWNER/package-name`
- `publishConfig.registry` points to GitHub Packages
- `repository.url` must match your GitHub repo

### Step 2: Create Publishing Token

1. Go to: https://github.com/settings/tokens
2. Generate token with scopes:
   - ✅ `write:packages`
   - ✅ `read:packages`
   - ✅ `repo` (if repository is private)

### Step 3: Configure Local `.npmrc` for Publishing

```bash
# Root .npmrc for publishing
cat > .npmrc << 'EOF'
@clarity-chat:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN_HERE
EOF
```

### Step 4: Publish Packages

```bash
# Build all packages
npm run build

# Publish individual package
cd packages/react
npm publish

# Or publish all packages using Changesets
npm run release
```

---

## 🔄 Complete Workflow Example

### For a New User Installing Your Package:

```bash
# 1. Create new project
mkdir my-project
cd my-project
npm init -y

# 2. Create .npmrc with GitHub Packages configuration
cat > .npmrc << 'EOF'
@clarity-chat:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_xxxxxxxxxxxxx
EOF

# 3. Install the package
npm install @clarity-chat/react

# 4. Use in your project
# Create index.js or src/App.tsx
```

### Example Project Structure:

```
my-project/
├── .npmrc                    # GitHub Packages auth (gitignored)
├── .npmrc.example           # Template for team
├── .gitignore               # Includes .npmrc
├── package.json
├── node_modules/
│   └── @clarity-chat/
│       ├── react/
│       ├── types/
│       └── primitives/
└── src/
    └── App.tsx
```

---

## 🌐 Comparison: npm Registry vs GitHub Packages

| Feature | npm Registry (Private) | GitHub Packages |
|---------|----------------------|-----------------|
| **Cost** | $7/month (Pro) | **Free** for public, $0.50/GB for private |
| **Authentication** | NPM token | GitHub token |
| **Registry URL** | `registry.npmjs.org` | `npm.pkg.github.com` |
| **Scope Required** | Yes (`@yourorg/pkg`) | Yes (`@owner/pkg`) |
| **Integration** | Separate service | Built into GitHub |
| **Best For** | Established orgs | GitHub-native workflows |

---

## 🐛 Troubleshooting

### Error: "Unable to authenticate"

**Cause**: Invalid or missing token

**Solution**:
```bash
# Verify token has correct scopes
# Regenerate token if needed
# Check .npmrc has correct registry and token
cat .npmrc
```

### Error: "Package not found"

**Cause**: 
- Package not published yet
- Incorrect scope in package name
- No access to private repository

**Solution**:
```bash
# Verify package name matches exactly
npm view @clarity-chat/react

# Check repository access on GitHub
# Ensure you're authenticated
```

### Error: "403 Forbidden"

**Cause**: Token lacks required permissions

**Solution**:
- Regenerate token with `read:packages` scope
- For private repos, also add `repo` scope
- Update `.npmrc` with new token

### Error: "ENOTFOUND npm.pkg.github.com"

**Cause**: Network/DNS issue or incorrect registry URL

**Solution**:
```bash
# Verify registry URL in .npmrc
# Check network connection
# Try with verbose logging
npm install @clarity-chat/react --verbose
```

---

## 📋 Quick Reference

### User `.npmrc` Template:
```bash
@clarity-chat:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### Install Commands:
```bash
# Single package
npm install @clarity-chat/react

# Multiple packages
npm install @clarity-chat/react @clarity-chat/types

# With peer deps
npm install @clarity-chat/react --legacy-peer-deps

# Update package
npm update @clarity-chat/react
```

### Publisher `package.json`:
```json
{
  "name": "@clarity-chat/react",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/christireid/Clarity-ai-chat-components.git"
  }
}
```

---

## 🎯 Example: Complete Setup for Team Member

```bash
# 1. Clone project (if contributing)
git clone https://github.com/christireid/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components

# 2. Copy .npmrc template
cp .npmrc.example .npmrc

# 3. Add your GitHub token to .npmrc
# Edit .npmrc and replace YOUR_TOKEN_HERE with your token

# 4. Install dependencies
npm install --legacy-peer-deps

# 5. Build packages
npm run build

# 6. Start development
npm run dev
```

---

## 📚 Additional Resources

- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [npm Scopes Documentation](https://docs.npmjs.com/about-scopes)
- [GitHub Token Permissions](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github#githubs-token-formats)
- [Configuring npm for GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)

---

## 💡 Pro Tips

1. **Use organization tokens** for team projects
2. **Rotate tokens regularly** (every 90 days recommended)
3. **Use different tokens** for CI/CD vs local development
4. **Set token expiration** to minimize security risk
5. **Document the process** for your team (like this guide!)
6. **Consider using** `.nvmrc` to ensure Node.js version consistency
7. **Use** `package-lock.json` for reproducible installs

---

## ✅ Checklist for New Users

- [ ] Created GitHub Personal Access Token with `read:packages` scope
- [ ] Created `.npmrc` file in project root
- [ ] Added `.npmrc` to `.gitignore`
- [ ] Configured `@clarity-chat:registry` to GitHub Packages
- [ ] Added authentication token to `.npmrc`
- [ ] Successfully installed `@clarity-chat/react` package
- [ ] Verified installation with `npm list`
- [ ] Can import and use the package in code

---

**Need Help?**

- 💬 [GitHub Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)
- 🐛 [Report Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- 📧 Email: christi@codeclarity.ai
