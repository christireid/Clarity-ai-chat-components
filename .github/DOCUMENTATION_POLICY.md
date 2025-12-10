# Documentation Policy

**Clarity Chat Repository**
**Effective Date**: December 10, 2025

---

## Purpose

This policy ensures the Clarity Chat repository maintains a clean, professional documentation structure ready for commercial release. It establishes guidelines for what documentation should be committed, where it should live, and how to manage historical artifacts.

---

## Documentation Categories

### ✅ Essential Documentation (Keep in Repository)

**Root Level**:
- `README.md` - Project overview and quick start
- `CHANGELOG.md` - Version history and release notes
- `CONTRIBUTING.md` - Contribution guidelines
- `CODE_OF_CONDUCT.md` - Community standards
- `SECURITY.md` - Security policies and reporting
- `TESTING.md` - Testing guidelines
- `LICENSE` - Legal license information

**Package Level** (`packages/*/`):
- `README.md` - Package-specific documentation
- `CHANGELOG.md` - Package version history
- `API.md` or API documentation files
- `GETTING_STARTED.md` - Package quick start guides

**Documentation Site** (`apps/docs/`):
- All content pages (`app/`, `content/`)
- Blog posts and articles
- API references and guides
- Commercial documentation (pricing, licenses)

---

## ❌ Development Artifacts (DO NOT COMMIT)

These files should **NEVER** be committed to the main repository:

### Status Reports & Summaries
- `*_COMPLETE.md`
- `*_SUMMARY.md`
- `*_STATUS.md`
- `*_REPORT.md`
- `FINAL_*.md`
- `PROJECT_COMPLETE.md`

### Phase Tracking Documents
- `PHASE_1_*.md`
- `PHASE_2_*.md`
- `PHASE_3_*.md`
- `*_PROGRESS.md`
- `*_CHECKLIST.md`

### Implementation Notes
- `CLEANUP_*.md`
- `OPTIMIZATION_*.md`
- `REFACTOR_*.md`
- `IMPLEMENTATION_*.md`
- `MIGRATION_*.md` (unless it's an official migration guide)

### Temporary Files
- `TODO.md`
- `NOTES.md`
- `SCRATCH.md`
- `QUICK_REFERENCE.md` (duplicates)
- `QUICK_START.md` (duplicates)

---

## 📦 Archive Policy

### When to Archive

Archive documentation when:
1. A project phase or milestone is **complete**
2. Implementation notes are **no longer needed** for active development
3. Status reports document **historical decisions**
4. Content provides **context** but isn't needed daily

### How to Archive

1. **Move to `.archive/` directory**:
   ```bash
   mv IMPLEMENTATION_COMPLETE.md .archive/implementation-notes/
   ```

2. **Organize by category**:
   - `.archive/implementation-notes/` - Technical implementation details
   - `.archive/status-reports/` - Project status and completion reports
   - `.archive/design-decisions/` - Architectural decisions and rationale

3. **Update archive README**:
   - Add entry to `.archive/README.md` if adding a new category
   - Ensure archived files are documented

### What NOT to Archive

- Active documentation referenced by users
- Current API references
- Essential guides and tutorials
- Legal documents (LICENSE, CODE_OF_CONDUCT)

---

## 📝 Documentation Best Practices

### 1. Single Source of Truth

**DO**:
- Keep one canonical version of each guide
- Reference other docs rather than duplicating content
- Update existing docs rather than creating new versions

**DON'T**:
- Create multiple versions (`QUICK_START.md`, `QUICK_START_V2.md`)
- Duplicate guides in multiple locations
- Keep outdated versions alongside current ones

### 2. Clear Naming Conventions

**Good Names**:
- `README.md` - Package/project overview
- `API_REFERENCE.md` - API documentation
- `MIGRATION_GUIDE.md` - Official migration instructions
- `ARCHITECTURE.md` - System architecture documentation

**Bad Names** (These indicate artifacts):
- `FINAL_IMPLEMENTATION_SUMMARY.md`
- `PHASE_2_COMPLETE.md`
- `CLEANUP_STATUS.md`
- `PROJECT_HANDOFF_FINAL.md`

### 3. Version Control Integration

Use **git commit messages** instead of status files:
```bash
# Good: Meaningful commit message
git commit -m "feat: implement user authentication with OAuth"

# Bad: Creating a status file
echo "Authentication complete" > AUTH_COMPLETE.md
```

### 4. Temporary Notes

For temporary development notes:
- Use **local files** outside the repository
- Use **GitHub Issues** for tracking work
- Use **Pull Request descriptions** for implementation details
- Use **project management tools** (Jira, Linear, etc.)

---

## 🔍 Review Process

### Pre-Commit Checklist

Before committing documentation, verify:

- [ ] Is this essential for users or contributors?
- [ ] Is there already a file that serves this purpose?
- [ ] Will this file be needed 3+ months from now?
- [ ] Does the filename match essential documentation patterns?
- [ ] Is this a development artifact that should be archived?

### Monthly Documentation Audit

**Schedule**: First Monday of each month

**Process**:
1. Run file count: `find . -name "*.md" -not -path "./node_modules/*" | wc -l`
2. Check for artifacts: `find . -name "*_COMPLETE.md" -o -name "*_SUMMARY.md"`
3. Review files created in the last month
4. Archive completed work
5. Delete true artifacts (not worth archiving)

### Quarterly Deep Audit

**Schedule**: First Monday of January, April, July, October

**Process**:
1. Full repository documentation review
2. Verify essential files are up-to-date
3. Check for duplicate content
4. Consolidate scattered documentation
5. Clean up `.archive/` if needed

---

## 🚨 Enforcement

### Automated Checks (Recommended)

Add to `.github/workflows/docs-check.yml`:
```yaml
name: Documentation Check

on: [pull_request]

jobs:
  check-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for development artifacts
        run: |
          # Fail if artifact patterns found
          if find . -name "*_COMPLETE.md" -o -name "*_SUMMARY.md" -o -name "*_STATUS.md" | grep -v .archive; then
            echo "❌ Development artifacts found. Please archive or remove them."
            exit 1
          fi
```

### Pre-Commit Hook (Optional)

Add to `.git/hooks/pre-commit`:
```bash
#!/bin/bash
# Check for common artifact patterns
if git diff --cached --name-only | grep -E "_(COMPLETE|SUMMARY|STATUS|FINAL)\.md$"; then
    echo "⚠️  Warning: Committing potential development artifact"
    echo "Consider archiving to .archive/ instead"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
```

### Code Review Guidelines

Reviewers should:
- Flag any files matching artifact patterns
- Request archival of completed work
- Ensure documentation follows naming conventions
- Check for duplicate content

---

## 📊 Success Metrics

**Healthy Documentation State**:
- ✅ Fewer than 400 total markdown files
- ✅ Zero files matching `*_COMPLETE.md`, `*_SUMMARY.md` patterns outside `.archive/`
- ✅ All essential files present and up-to-date
- ✅ `.archive/` properly organized with README
- ✅ No duplicate content across multiple locations

**Warning Signs**:
- ⚠️ Rapid growth in file count (>10 files/month)
- ⚠️ Multiple versions of the same guide
- ⚠️ Files older than 6 months with "TODO" or "DRAFT" in name
- ⚠️ Status reports in root or package directories

---

## 🆘 Questions?

**Where should this go?**
- User-facing docs → `apps/docs/content/` or package `README.md`
- Development notes → `.archive/implementation-notes/` (after completion)
- Temporary notes → Local files or GitHub Issues (not committed)
- Status updates → Git commit messages or PR descriptions

**Is this a development artifact?**
Ask:
1. Will users or contributors need this in 3 months? (No → Artifact)
2. Does it document a completed task? (Yes → Artifact)
3. Is it a status report or progress summary? (Yes → Artifact)

---

## 📚 References

- **Archive Structure**: See `.archive/README.md`
- **Contributing Guidelines**: See `CONTRIBUTING.md`
- **Recent Cleanup**: December 2025 - Removed 255 development artifacts

---

**Policy Owner**: Documentation Team
**Last Updated**: December 10, 2025
**Next Review**: March 10, 2026
