# Scripts Directory

**Developer utility scripts for Clarity Chat**

---

## 📋 **Available Scripts**

### **1. dev-setup.sh** ⭐ ESSENTIAL
**Purpose:** Automated developer environment setup

**Usage:**
```bash
bash scripts/dev-setup.sh
```

**What it does:**
- ✅ Verifies Node.js version
- ✅ Installs all dependencies
- ✅ Configures git hooks
- ✅ Builds all packages
- ✅ Runs validation checks
- ✅ Prints next steps

**When to use:**
- First time setting up the repository
- After git clean
- When onboarding new developers

**Time:** 5-10 minutes

---

### **2. check-quality.sh** ⭐ IMPORTANT
**Purpose:** Comprehensive quality validation

**Usage:**
```bash
bash scripts/check-quality.sh
```

**What it does:**
- ✅ Checks formatting (Prettier)
- ✅ Runs linting (ESLint)
- ✅ Type checks (TypeScript)
- ✅ Runs all tests (Vitest)
- ✅ Verifies build
- ✅ Checks bundle size

**When to use:**
- Before pushing
- Before creating PR
- Before releasing

**Time:** 3-5 minutes

**Exit codes:**
- `0` - All checks passed ✅
- `1` - Some checks failed ❌

---

### **3. validate-v2.2-migration.js**
**Purpose:** Validates v2.2 visual refinements

**Usage:**
```bash
node scripts/validate-v2.2-migration.js
```

**What it does:**
- ✅ Checks package versions
- ✅ Verifies design tokens
- ✅ Validates component classes
- ✅ Confirms documentation exists

**When to use:**
- After upgrading to v2.2
- Verifying v2.2 implementation

**Time:** 5 seconds

---

### **4. migrate-to-v2.2.sh**
**Purpose:** Automated v2.2 upgrade

**Usage:**
```bash
bash scripts/migrate-to-v2.2.sh
```

**What it does:**
- ✅ Creates backup
- ✅ Detects package manager
- ✅ Installs v2.2.0
- ✅ Clears caches
- ✅ Runs validation

**When to use:**
- Upgrading from v2.1 to v2.2
- Fresh v2.2 installation

**Time:** 3-5 minutes

---

### **5. analyze-bundle.js**
**Purpose:** Bundle size analysis and reporting

**Usage:**
```bash
npm run analyze
# or
node scripts/analyze-bundle.js
```

**What it does:**
- ✅ Analyzes all package bundles
- ✅ Compares with previous build
- ✅ Generates HTML report
- ✅ Tracks size changes

**Output:**
- `bundle-reports/bundle-report.json`
- `bundle-reports/bundle-report.html`

**When to use:**
- After adding features
- Investigating bundle size
- Before releasing

**Time:** 10-30 seconds

---

### **6. benchmark.js**
**Purpose:** Performance benchmarking

**Usage:**
```bash
npm run benchmark
# or
node scripts/benchmark.js
```

**What it does:**
- ✅ Benchmarks JSON parsing
- ✅ Benchmarks array operations
- ✅ Benchmarks object cloning
- ✅ Generates statistics (mean, median, p95, p99)
- ✅ Creates HTML report

**Output:**
- `benchmark-results/benchmark-results.json`
- `benchmark-results/benchmark-report.html`

**When to use:**
- After performance changes
- Comparing implementations
- Regression testing

**Time:** 1-2 minutes

---

### **7. storybook-coverage-check.js**
**Purpose:** Checks Storybook story coverage

**Usage:**
```bash
node scripts/storybook-coverage-check.js
```

**What it does:**
- ✅ Lists all components
- ✅ Checks for Storybook stories
- ✅ Reports coverage percentage

**When to use:**
- Ensuring all components have stories
- Component documentation audit

**Time:** 5 seconds

---

## 🎯 **Common Combinations**

### **Full Quality Check Before PR**
```bash
bash scripts/check-quality.sh
npm run changeset           # If needed
```

### **Fresh Start After Conflicts**
```bash
npm run clean
npm install
npm run build
bash scripts/check-quality.sh
```

### **Investigate Bundle Growth**
```bash
npm run build
npm run size
npm run analyze             # Opens HTML report
```

### **Performance Testing**
```bash
npm run benchmark           # Run benchmarks
# Check benchmark-results/benchmark-report.html
```

---

## 📊 **Script Dependencies**

### **What Scripts Need**

**dev-setup.sh:**
- Node.js installed
- Git installed
- Clean repository

**check-quality.sh:**
- All dependencies installed
- Packages built

**analyze-bundle.js:**
- `chalk` package (in devDependencies)
- Built bundles in `packages/*/dist/`

**benchmark.js:**
- `chalk` package (in devDependencies)
- Node.js performance API

**v2.2 scripts:**
- No special dependencies

---

## 🔧 **Adding New Scripts**

### **Template**

```bash
#!/usr/bin/env node
# or
#!/bin/bash

# Header comment explaining purpose

# Your script here

# Usage example:
# node scripts/my-script.js
```

### **Make Executable**
```bash
chmod +x scripts/my-script.sh
```

### **Add to package.json**
```json
"scripts": {
  "my-script": "node scripts/my-script.js"
}
```

---

## 📝 **Script Naming Convention**

```
verb-noun.{js,sh}

Examples:
  ✅ analyze-bundle.js    (good)
  ✅ check-quality.sh     (good)
  ✅ dev-setup.sh         (good)
  ❌ bundle.js            (unclear)
  ❌ quality.sh           (unclear)
```

---

## 🎯 **Best Practices**

### **For Shell Scripts (.sh)**
- Start with `#!/bin/bash`
- Use `set -e` (exit on error)
- Add color output for readability
- Print progress messages
- Exit with appropriate code (0 = success)

### **For Node Scripts (.js)**
- Start with `#!/usr/bin/env node`
- Use `chalk` for colored output
- Handle errors gracefully
- Provide helpful error messages
- Generate reports (JSON + HTML)

---

## 📖 **Documentation**

Each major script should have:
- Header comment explaining purpose
- Usage examples
- Expected output
- Error handling
- Exit codes

**Example:**
```javascript
/**
 * Script Name
 * 
 * Description of what it does.
 * 
 * Usage: node scripts/script-name.js
 * 
 * Exit codes:
 *   0 - Success
 *   1 - Error
 */
```

---

## 🎉 **Quick Reference**

| Script | Command | Time | When |
|--------|---------|------|------|
| Setup | `bash scripts/dev-setup.sh` | 10m | First time |
| Quality | `bash scripts/check-quality.sh` | 5m | Before push |
| v2.2 Check | `node scripts/validate-v2.2-migration.js` | 5s | After upgrade |
| v2.2 Migrate | `bash scripts/migrate-to-v2.2.sh` | 5m | Upgrade |
| Bundle | `npm run analyze` | 30s | Size check |
| Benchmark | `npm run benchmark` | 2m | Performance |

---

**All scripts are documented and ready to use!** ✅
