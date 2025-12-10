# Documentation Policy Onboarding

**Welcome to the Clarity Chat Documentation Team!**

This document helps you get started with our documentation standards and practices.

---

## 🎯 Quick Start (5 Minutes)

### What Changed?
We recently implemented a comprehensive documentation governance system to keep the repository clean and professional.

**Before**: 618 markdown files with 255+ development artifacts scattered everywhere
**Now**: 366 essential files with automated enforcement and clear policies

### Key Rules to Remember

✅ **DO commit:**
- User-facing documentation (guides, API references)
- Package READMEs
- Essential root files (README, CONTRIBUTING, etc.)

❌ **DON'T commit:**
- Status reports (`*_COMPLETE.md`, `*_SUMMARY.md`)
- Phase tracking (`PHASE_1_*.md`, `PHASE_2_*.md`)
- Temporary notes, scratch files
- Implementation summaries after completion

📦 **ARCHIVE instead:**
- Move completed work to `.archive/status-reports/` or `.archive/implementation-notes/`

---

## 📚 Essential Reading

1. **[Documentation Policy](./.github/DOCUMENTATION_POLICY.md)** (10 min read)
   - Complete reference for what to commit/archive
   - Archival procedures
   - Enforcement mechanisms

2. **[Contributing Guidelines - Documentation Section](../CONTRIBUTING.md#documentation-guidelines)** (5 min read)
   - Practical examples
   - Common mistakes to avoid
   - Archival workflow

---

## 🛠️ Tools & Automation

### Local Development

**Pre-Commit Hook** (Automatic)
- Runs when you commit
- Warns if you're committing potential artifacts
- Gives you a chance to archive instead

**Documentation Health Check** (Manual)
```bash
tsx scripts/check-docs-health.ts
```
- Shows current documentation health score
- Lists any artifacts, empty files, or issues
- Use before submitting PRs

### CI/CD (Automatic)

**Artifact Detection Workflow**
- Runs on every PR
- Blocks merge if artifacts found
- Posts helpful comment with instructions

**Monthly Audit**
- Runs first Monday of each month
- Creates GitHub Issue with health report
- Tracks file count trends

---

## 🔄 Common Workflows

### Scenario 1: I Just Completed a Feature

**DON'T:**
```bash
# ❌ Bad - committing status file
echo "Feature complete!" > IMPLEMENTATION_COMPLETE.md
git add IMPLEMENTATION_COMPLETE.md
git commit -m "mark feature complete"
```

**DO:**
```bash
# ✅ Good - using commit message
git commit -m "feat: implement user authentication

Completed OAuth integration with Google and GitHub providers.
Added session management and refresh token handling.
All tests passing."
```

### Scenario 2: I Have Implementation Notes to Save

**DON'T:**
```bash
# ❌ Bad - leaving notes in root
git add IMPLEMENTATION_NOTES.md
```

**DO:**
```bash
# ✅ Good - archive for posterity
mv IMPLEMENTATION_NOTES.md .archive/implementation-notes/auth-implementation-notes.md
git add .archive/implementation-notes/auth-implementation-notes.md
git commit -m "docs: archive auth implementation notes"
```

### Scenario 3: I Need to Track Phase Progress

**DON'T:**
```bash
# ❌ Bad - creating phase files
echo "Phase 2 complete" > PHASE_2_COMPLETE.md
```

**DO:**
```bash
# ✅ Good - use GitHub Issues or Project Board
# Create an issue: "Phase 2: User Authentication"
# Update issue status: Move to "Done" column
# Use commit messages to document milestones
```

### Scenario 4: I Want to Document a Migration

**DO create** (This is essential documentation):
```bash
# ✅ Good - creating official migration guide
# File: packages/auth/MIGRATION_GUIDE.md
# Content: How users migrate to new API
```

**DON'T create** (This is an artifact):
```bash
# ❌ Bad - creating internal migration tracking
# File: AUTH_MIGRATION_STATUS.md
# Content: Team progress on migration
```

---

## 🚨 What Happens if I Commit an Artifact?

### Locally (Pre-Commit Hook)
1. Hook detects potential artifact
2. Shows warning message
3. Asks for confirmation
4. You can abort and fix

### In PR (CI Check)
1. CI runs artifact detection
2. Check fails if artifacts found
3. Bot posts helpful comment
4. PR cannot merge until fixed

### Fix Process
```bash
# Option 1: Archive the file
git rm unwanted-artifact.md
mv unwanted-artifact.md .archive/status-reports/
git add .archive/status-reports/unwanted-artifact.md
git commit -m "docs: archive status report"

# Option 2: Delete completely
git rm unwanted-artifact.md
git commit -m "docs: remove temporary file"
```

---

## 📋 Monthly Audit Process

**When**: First Monday of each month (automated)

**What Happens**:
1. GitHub Action runs health check
2. Creates issue with findings
3. Assigns to documentation team
4. Tracks file count trends

**Your Role**:
1. Review the audit issue
2. Address any artifacts found
3. Archive completed work
4. Close issue when done

---

## 💡 Pro Tips

### Before Committing Documentation

Ask yourself these 5 questions:
1. Is this essential for users or contributors?
2. Is there already a file that serves this purpose?
3. Will this file be needed 3+ months from now?
4. Does the filename follow essential documentation patterns?
5. Have I checked for duplicate content?

If you answered "No" to #1 or #3, it's probably an artifact!

### Naming Patterns to Avoid

- `*_COMPLETE.md` - Signals completion, not documentation
- `*_SUMMARY.md` - Signals status update, not guide
- `PHASE_*` - Signals tracking, not reference
- `FINAL_*` - Signals milestone, not documentation
- `CLEANUP_*`, `OPTIMIZATION_*`, `REFACTOR_*` - Signals process, not product

### Good Documentation Names

- `README.md` - Package/project overview
- `MIGRATION_GUIDE.md` - User migration instructions
- `API_REFERENCE.md` - API documentation
- `ARCHITECTURE.md` - System architecture
- `CONTRIBUTING.md` - Contribution guidelines

---

## 🆘 Need Help?

### Quick Questions
- Check [Documentation Policy](./.github/DOCUMENTATION_POLICY.md)
- Review [Contributing Guidelines](../CONTRIBUTING.md#documentation-guidelines)

### Unsure About a File?
Ask in:
- Team Slack #documentation channel
- GitHub Discussion
- Tag @christireid in PR comment

### Found a Bug in Enforcement?
- Open issue with label `documentation` and `tooling`
- Describe the false positive/negative
- We'll tune the detection patterns

---

## 📊 Success Metrics

We track these metrics to measure documentation health:

- **File Count**: Target < 400 (currently ~366)
- **Artifacts**: Target 0 (currently 0)
- **Empty Files**: Target 0
- **Essential Files**: All present
- **Health Score**: Target 90+ (scale 0-100)

You can check these anytime:
```bash
tsx scripts/check-docs-health.ts
```

---

## 🎉 Welcome Aboard!

You're now ready to contribute to Clarity Chat documentation while keeping the repository clean and professional.

**Remember**:
- Use commit messages instead of status files
- Archive completed work
- Keep only essential documentation
- Run health check before PR
- The automated systems will help guide you!

Questions? Tag @christireid or post in #documentation.

---

**Last Updated**: December 10, 2025
**Policy Version**: 1.0.0
