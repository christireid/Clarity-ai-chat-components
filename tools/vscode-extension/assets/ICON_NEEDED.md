# Extension Icon Required

Before publishing to the VS Code Marketplace, add an icon file:

## Requirements
- **File:** `icon.png`
- **Size:** 128x128 pixels (recommended)
- **Format:** PNG with transparency

## Recommended Design
- Use the Clarity Chat brand colors
- Simple, recognizable at small sizes
- Consider using a chat bubble with AI/spark elements

## Current Reference
The `package.json` expects the icon at: `assets/icon.png`

## Temporary Workaround
If publishing without an icon, remove the `"icon"` field from `package.json`.
