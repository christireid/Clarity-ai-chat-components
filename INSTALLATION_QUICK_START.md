# Quick Start: Installing Clarity Chat from GitHub Packages

**⚡ 3-Minute Setup Guide**

## For Users Installing the Package

### Step 1: Get Your GitHub Token (1 minute)

1. Visit: https://github.com/settings/tokens/new
2. Name it: "Clarity Chat Package Access"
3. Select scope: ✅ `read:packages`
4. Click "Generate token"
5. **Copy the token** (starts with `ghp_`)

### Step 2: Configure Your Project (30 seconds)

Create a `.npmrc` file in your project root:

```bash
# Create .npmrc
cat > .npmrc << 'EOF'
@clarity-chat:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=PASTE_YOUR_TOKEN_HERE
EOF
```

**Don't forget to add `.npmrc` to your `.gitignore`!**

```bash
echo ".npmrc" >> .gitignore
```

### Step 3: Install Packages (30 seconds)

```bash
# Install the main package
npm install @clarity-chat/react

# Or install multiple packages
npm install @clarity-chat/react @clarity-chat/types @clarity-chat/primitives
```

### Step 4: Use in Your Code (1 minute)

```tsx
import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const [messages, setMessages] = useState([])

  return (
    <ThemeProvider theme={themes.ocean}>
      <ChatWindow
        messages={messages}
        onSendMessage={async (content) => {
          // Your AI integration here
        }}
      />
    </ThemeProvider>
  )
}
```

**That's it! You're ready to go! 🎉**

---

## Troubleshooting

### ❌ "Unable to authenticate"
→ Check your token in `.npmrc` is correct

### ❌ "Package not found"
→ Verify you have access to the repository on GitHub

### ❌ "403 Forbidden"
→ Your token needs the `read:packages` scope

---

## Need More Details?

📚 **Full Guide**: See [GITHUB_PACKAGES_GUIDE.md](./GITHUB_PACKAGES_GUIDE.md)

📦 **Publishing**: See [PUBLISHING.md](./PUBLISHING.md)

🔧 **Troubleshooting**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## Environment Variable Alternative (For CI/CD)

Instead of hardcoding the token in `.npmrc`:

```bash
# .npmrc (safe to commit)
@clarity-chat:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then set the environment variable:
```bash
export GITHUB_TOKEN=ghp_your_token_here
npm install
```

---

## For Team Members Contributing to the Repo

```bash
# 1. Clone the repository
git clone https://github.com/christireid/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components

# 2. Copy the .npmrc template
cp .npmrc.example .npmrc

# 3. Edit .npmrc with your GitHub token

# 4. Install dependencies
npm install --legacy-peer-deps

# 5. Build packages
npm run build

# 6. Start development
npm run dev
```

---

**Questions?** Open an issue or discussion on GitHub!
