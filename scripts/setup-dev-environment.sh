#!/bin/bash

set -e

echo "🚀 Clarity Chat - Development Environment Setup"
echo "================================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}→${NC} $1"
}

print_step() {
    echo -e "${BLUE}[$1/8]${NC} $2"
}

# Check if running from repository root
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the repository root"
    exit 1
fi

# Step 1: Check Node.js version
print_step 1 "Checking Node.js version"
if ! command -v node &> /dev/null; then
    print_error "Node.js not found"
    echo "Install from: https://nodejs.org/ (v20 or higher)"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    print_error "Node.js 20+ required. Current: v$(node -v)"
    echo "Install from: https://nodejs.org/"
    exit 1
fi
print_success "Node.js version: $(node -v)"
echo ""

# Step 2: Check pnpm installation
print_step 2 "Checking pnpm installation"
if ! command -v pnpm &> /dev/null; then
    print_info "pnpm not found. Installing pnpm@10..."
    npm install -g pnpm@10
    print_success "pnpm installed"
else
    PNPM_VERSION=$(pnpm -v | cut -d'.' -f1)
    if [ "$PNPM_VERSION" -lt 10 ]; then
        print_info "Updating pnpm to v10..."
        npm install -g pnpm@10
        print_success "pnpm updated"
    else
        print_success "pnpm version: $(pnpm -v)"
    fi
fi
echo ""

# Step 3: Install dependencies
print_step 3 "Installing dependencies"
print_info "This may take a few minutes..."
if pnpm install --frozen-lockfile; then
    print_success "Dependencies installed"
else
    print_error "Failed to install dependencies"
    echo "Try running: pnpm install --no-frozen-lockfile"
    exit 1
fi
echo ""

# Step 4: Build packages
print_step 4 "Building packages"
print_info "Building all packages (this may take a while)..."
if NODE_OPTIONS='--max-old-space-size=2048' pnpm build:packages; then
    print_success "Packages built successfully"
else
    print_error "Build failed"
    echo "Try running: NODE_OPTIONS='--max-old-space-size=4096' pnpm build:sequential"
    exit 1
fi
echo ""

# Step 5: Run type checking
print_step 5 "Running type checking"
if pnpm typecheck; then
    print_success "Type checking passed"
else
    print_error "Type checking failed"
    echo "Fix type errors and run: pnpm typecheck"
    exit 1
fi
echo ""

# Step 6: Run linting
print_step 6 "Running linter"
if pnpm lint; then
    print_success "Linting passed"
else
    print_info "Linting issues found. Attempting auto-fix..."
    if pnpm lint:fix; then
        print_success "Linting issues fixed automatically"
    else
        print_error "Some linting issues require manual fixes"
        echo "Review errors and run: pnpm lint:fix"
        exit 1
    fi
fi
echo ""

# Step 7: Run tests
print_step 7 "Running tests"
print_info "Running test suite (this may take a minute)..."
if pnpm test; then
    print_success "Tests passed"
else
    print_error "Tests failed"
    echo "Fix failing tests and run: pnpm test"
    exit 1
fi
echo ""

# Step 8: Setup git hooks
print_step 8 "Setting up git hooks"
if [ -d ".husky" ]; then
    if pnpm prepare; then
        print_success "Git hooks initialized"
    else
        print_info "Git hooks setup skipped (non-critical)"
    fi
else
    print_info "Git hooks directory not found, skipping..."
fi
echo ""

# Success summary
echo "================================================"
print_success "Development environment ready!"
echo ""
echo "📚 Available Commands:"
echo ""
echo "  Development:"
echo "    pnpm dev              - Start all packages in dev mode"
echo "    pnpm dev:react        - Start React package only"
echo "    pnpm dev:docs         - Start documentation site"
echo "    pnpm storybook        - Start Storybook component explorer"
echo ""
echo "  Building:"
echo "    pnpm build            - Build all packages"
echo "    pnpm build:packages   - Build packages only"
echo ""
echo "  Testing:"
echo "    pnpm test             - Run all tests"
echo "    pnpm test:watch       - Run tests in watch mode"
echo "    pnpm test:coverage    - Generate coverage report"
echo "    pnpm test:e2e         - Run end-to-end tests"
echo ""
echo "  Code Quality:"
echo "    pnpm lint             - Run linter"
echo "    pnpm lint:fix         - Fix linting issues"
echo "    pnpm typecheck        - Type checking"
echo "    pnpm format           - Format code"
echo "    pnpm check            - Run all checks (typecheck, lint, test)"
echo ""
echo "📖 Documentation:"
echo "    apps/streamlined-docs/app/contributing/index.mdx  - Contributing guide"
echo "    docs/TROUBLESHOOTING.md                           - Troubleshooting"
echo "    docs/architecture.md                              - Architecture docs"
echo ""
echo "🎯 Next Steps:"
echo "  1. Create a feature branch: git checkout -b feature/your-feature"
echo "  2. Make your changes and add tests"
echo "  3. Run checks: pnpm check"
echo "  4. Commit and push your changes"
echo "  5. Open a pull request"
echo ""
print_success "Happy coding! 🎉"
echo ""
