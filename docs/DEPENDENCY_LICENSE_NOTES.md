# Dependency License Audit Notes

**Audit Date**: January 2025
**Auditor**: QA Agent (Automated)
**Status**: Review Required for Commercial Release

---

## Executive Summary

This document provides a license audit of the Clarity Chat component library and documentation site. The codebase uses a **dual-licensing model**:

1. **MIT License (Free/Core)**: Basic components, primitives, types, utilities
2. **Commercial Licenses (Pro/Enterprise)**: Advanced components, themes, integrations

### Key Findings

| Finding | Status | Action Required |
|---------|--------|-----------------|
| Root LICENSE file declares MIT | Review | Clarify dual-licensing in README |
| All package.json files declare MIT | Review | May need split for premium packages |
| No GPL/copyleft runtime dependencies | OK | Safe for commercial distribution |
| README claims MIT license | Review | Update to reflect dual-license model |
| THIRD_PARTY_NOTICES.md exists | OK | Keep updated |

---

## License Structure Analysis

### Current Repository Licensing

#### Root LICENSE File
- **Location**: `/LICENSE`
- **Type**: MIT License with Commercial Notice
- **Content**: MIT for free/core components, with explicit notice that premium features require commercial license
- **Assessment**: Appropriately structured for dual-licensing

#### Commercial License Files
- **Location**: `/apps/docs/app/commercial/`
  - `LICENSE-PRO.md`: Pro tier commercial license ($149-$499/year)
  - `LICENSE-ENTERPRISE.md`: Enterprise tier license ($2,499-$24,999/year)
- **Assessment**: Comprehensive commercial terms defined

#### Package.json License Fields

All packages currently declare `"license": "MIT"`:

| Package | License Field | Notes |
|---------|--------------|-------|
| `@clarity-chat/react` | MIT | Main component library |
| `@clarity-chat/primitives` | MIT | Core primitives |
| `@clarity-chat/types` | MIT | Type definitions |
| `@clarity-chat/utils` | MIT | Utilities |
| `@clarity-chat/memory` | MIT | Memory features |
| `@clarity-chat/token-optimization` | MIT | Token features |
| `@clarity-chat/error-handling` | MIT | Error handling |
| `@clarity-chat/dev-tools` | MIT | Developer tools |
| `@clarity-chat/codemods` | MIT | Code migrations |
| `@clarity-chat/playground` | MIT | Playground |
| `@clarity-chat/license` | MIT | License checking |
| `@clarity-chat/licensing` | MIT | License management |

**Recommendation**: If premium features are bundled in these packages, consider:
1. Split packages (free vs premium)
2. Or update license field to reflect actual licensing terms
3. Or implement runtime license checks (already exists via `@clarity-chat/license`)

### README.md License Claims

Current README states:
- Badge: `MIT` license
- Comparison table: Claims "MIT" as license
- Footer: "MIT (c) 2024 Code & Clarity"

**Recommendation**: Update README to clarify dual-licensing model:
- Free/Core: MIT
- Pro/Enterprise: Commercial License

---

## Runtime Dependency Analysis

### Summary by License Type

| License | Count | Commercial Safe |
|---------|-------|-----------------|
| MIT | 25+ | Yes |
| Apache-2.0 | 2 | Yes |
| ISC | 1 | Yes |
| BSD-3-Clause | 1 | Yes |
| MPL-2.0 (dev only) | 1-2 | N/A (not bundled) |

### Detailed Dependency Licenses

#### MIT Licensed (Safe for Commercial)
- @radix-ui/react-slot
- @tanstack/react-virtual
- clsx
- isomorphic-dompurify
- js-tiktoken
- jszip (MIT option chosen)
- katex
- prismjs
- react-markdown
- react-resizable-panels
- react-virtualized-auto-sizer
- react-window
- rehype-highlight
- rehype-katex
- rehype-raw
- remark-gfm
- remark-math
- shiki
- sonner
- tailwind-merge
- zod
- framer-motion
- lucide-react

#### Apache-2.0 Licensed (Safe for Commercial)
- class-variance-authority
- dompurify (Apache-2.0 option chosen)

#### Dual-Licensed Packages

| Package | Licenses | Selected |
|---------|----------|----------|
| jszip | MIT OR GPL-3.0-or-later | MIT |
| dompurify | MPL-2.0 OR Apache-2.0 | Apache-2.0 |

**Note**: These selections are documented in THIRD_PARTY_NOTICES.md

### Copyleft Dependencies (None in Runtime)

No GPL, LGPL, or AGPL dependencies are included in the runtime bundle. Some development tools use MPL-2.0 (e.g., lightningcss) but these do not affect the distributed product.

---

## Recommendations for Legal Review

### High Priority

1. **README License Badge**
   - Current: Shows single MIT badge
   - Recommendation: Update to indicate dual-licensing or link to full license terms

2. **Package.json License Fields**
   - Current: All packages say "MIT"
   - Recommendation: Either split premium features into separate packages with commercial licenses, or add `"license": "SEE LICENSE IN LICENSE"` for packages containing premium code

3. **NPM Package Metadata**
   - When publishing to npm, ensure license field accurately reflects terms
   - Consider adding `"license": "MIT AND PROPRIETARY"` or custom SPDX expression

### Medium Priority

4. **License Checker Integration**
   - Consider adding automated license checking to CI/CD
   - Tools: `license-checker`, `license-checker-rseidelsohn`, or custom script

5. **THIRD_PARTY_NOTICES.md Updates**
   - Ensure document stays current with dependency changes
   - Add to CI/CD to verify updates

### Low Priority

6. **Developer Documentation**
   - Add contributing guidelines that clarify licensing for contributions
   - Ensure CLA (Contributor License Agreement) if accepting external contributions

---

## Compliance Checklist

### For MIT/Free Components

- [x] MIT license text present in LICENSE file
- [x] Copyright notice present
- [x] License field in package.json
- [x] No copyleft dependencies

### For Commercial Components

- [x] Commercial license terms defined (LICENSE-PRO.md, LICENSE-ENTERPRISE.md)
- [x] Pricing tiers documented
- [ ] Runtime license validation implemented
- [ ] License key generation system
- [ ] Terms of service for hosted features

### For Third-Party Dependencies

- [x] THIRD_PARTY_NOTICES.md exists
- [x] Dual-licensed packages have selected option documented
- [x] No GPL/AGPL in runtime dependencies
- [x] Attribution requirements met

---

## Appendix: SPDX License Identifiers

For reference, here are the SPDX identifiers for licenses used:

| License | SPDX Identifier |
|---------|-----------------|
| MIT License | MIT |
| Apache License 2.0 | Apache-2.0 |
| ISC License | ISC |
| BSD 3-Clause | BSD-3-Clause |
| Mozilla Public License 2.0 | MPL-2.0 |
| GNU General Public License v3 | GPL-3.0-or-later |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2025 | QA Agent | Initial audit |

---

**This document is for internal use only and should be reviewed by legal counsel before commercial release.**
