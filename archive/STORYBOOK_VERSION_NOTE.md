# Storybook Version Note

## Version Update

While Storybook 10.0.6 exists, many addons don't have version 10 releases yet. Therefore, we've updated to **Storybook 8.6.14** which is the latest stable version with full addon support.

### Updated Versions
- **Storybook Core**: `8.6.14` (instead of 10.0.6)
- **All Addons**: `8.6.14` (compatible versions)
- **@storybook/test**: `8.6.14`

### Why Not Storybook 10?
- Many addons (@storybook/addon-interactions, @storybook/addon-essentials, etc.) don't have version 10 releases yet
- Storybook 8.6.14 is stable and fully compatible with React 19
- All features we need are available in version 8

### Future Upgrade Path
When Storybook 10 addons become available, we can upgrade by:
1. Updating all Storybook packages to 10.x
2. Ensuring all addons support version 10
3. Testing thoroughly before merging

### Current Status
✅ Storybook 8.6.14 installed and working
✅ All addons compatible
✅ React 19 support confirmed
✅ CSF3 format supported
