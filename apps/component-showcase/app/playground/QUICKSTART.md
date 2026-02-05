# Playground Quick Start Guide

## 🚀 Getting Started in 30 Seconds

1. Navigate to `/playground` in your browser
2. Select a component from the dropdown
3. Adjust props using the editor panel
4. Copy the generated code
5. Done!

## 📋 Common Tasks

### Task 1: Try a Component with Default Settings
```
1. Open playground
2. Component is pre-selected (ChatInput)
3. Click "Copy" in code panel
4. Paste into your project
```

### Task 2: Customize a Component
```
1. Select component (e.g., "Message Bubble")
2. Adjust props:
   - Change "content" text
   - Toggle "showAvatar"
   - Select "role" (user/assistant)
3. Preview updates in real-time
4. Copy generated code
```

### Task 3: Use a Quick Example
```
1. Select any component
2. Click "Quick Examples" dropdown
3. Click an example (e.g., "Minimal")
4. Props auto-populate
5. Copy code
```

### Task 4: Share a Configuration
```
1. Customize a component
2. Click "Share" button
3. URL copied to clipboard
4. Send to teammate
5. They see your exact config
```

### Task 5: Save for Later
```
1. Set up your ideal configuration
2. Click "Export"
3. JSON file downloads
4. Later: Click "Import" → Select file
5. Configuration restored
```

## 🎯 Pro Tips

### Tip 1: Keyboard Shortcuts
- `Cmd/Ctrl + K` - Search components
- `Cmd/Ctrl + C` - Copy code
- `Cmd/Ctrl + S` - Export config
- `Cmd/Ctrl + R` - Reset props
- `F` - Fullscreen preview

### Tip 2: Quick Component Switching
Use arrow keys when dropdown is focused:
- `↑` - Previous component
- `↓` - Next component
- `Enter` - Select
- `Esc` - Close

### Tip 3: Batch Prop Updates
Load an example preset, then fine-tune individual props:
```
1. Click "Quick Examples"
2. Select "Minimal"
3. Tweak specific props
4. Best of both worlds!
```

### Tip 4: Theme Testing
Always test both themes:
```
1. Customize component
2. Click theme toggle
3. Verify appearance in both
4. Export config with preferred theme
```

### Tip 5: Code Variations
Generate multiple code versions:
```
1. Copy TypeScript version
2. Toggle to JavaScript
3. Copy JSX version
4. Compare and choose
```

## 📱 Mobile Usage

The playground works on mobile/tablet:
- Vertical stacking on small screens
- Touch-friendly controls
- Swipe to navigate panels
- Responsive prop editors

## 🔍 Component Categories

### Core Components (Essential)
- **ChatInput** - Message input with voice/attachments
- **MessageBubble** - Chat message display
- **ThinkingIndicator** - AI processing animation

### Specialized Components
- **TokenCounter** - Token usage tracking
- **AudioRecorder** - Voice input with visualization
- **CommandPalette** - Keyboard-driven interface
- **ToolCard** - Tool execution display
- **CodeBlock** - Syntax-highlighted code

## 💡 Example Workflows

### Workflow 1: Build a Chat Interface (3 minutes)
```
1. Start with ChatInput
   - Enable voice: true
   - Enable attachments: true
   - Copy code

2. Add MessageBubble
   - Role: "assistant"
   - Show avatar: true
   - Copy code

3. Add ThinkingIndicator
   - Variant: "dots"
   - Copy code

4. Done! You have a complete chat UI
```

### Workflow 2: Token Monitoring (2 minutes)
```
1. Select TokenCounter
2. Set maxTokens: 4000
3. Enable showWarning: true
4. Set warningThreshold: 0.8
5. Copy code
6. Integrate into your app
```

### Workflow 3: Voice Input (1 minute)
```
1. Select AudioRecorder
2. Set maxDuration: 120
3. Choose visualizer: "waveform"
4. Enable showTimer: true
5. Copy and use
```

## 🎨 Customization Examples

### Example 1: Minimal Chat Input
```typescript
Props:
- placeholder: "Ask me anything..."
- variant: "minimal"
- enableVoice: false
- enableAttachments: false
- rows: 1

Result: Clean, simple input
```

### Example 2: Feature-Rich Chat Input
```typescript
Props:
- placeholder: "Type your message..."
- variant: "default"
- enableVoice: true
- enableAttachments: true
- enableMentions: true
- maxLength: 8000

Result: Full-featured enterprise chat
```

### Example 3: Compact Message Display
```typescript
Props:
- variant: "compact"
- showAvatar: false
- showTimestamp: false
- enableActions: false

Result: Minimal message bubble
```

## 🐛 Troubleshooting

### Issue: Component not rendering
**Solution:** Check browser console for errors, refresh page

### Issue: Props not updating preview
**Solution:** Some props need valid values (e.g., non-empty strings)

### Issue: Copy button not working
**Solution:** Ensure HTTPS connection, check clipboard permissions

### Issue: Import fails
**Solution:** Verify JSON file format, ensure it's a playground export

### Issue: Share URL too long
**Solution:** Use Export/Import for complex configurations

## 📚 Learning Path

### Beginner (5 minutes)
1. Try ChatInput with defaults
2. Change placeholder text
3. Toggle a boolean prop
4. Copy the code

### Intermediate (15 minutes)
1. Explore all 8 components
2. Load example presets
3. Customize each component
4. Test both themes
5. Share a configuration

### Advanced (30 minutes)
1. Create custom configurations
2. Export and organize configs
3. Test edge cases
4. Generate TypeScript interfaces
5. Build a component library

## 🎓 Best Practices

### DO ✅
- Test both light and dark themes
- Use example presets as starting points
- Export configurations before major changes
- Share configurations with your team
- Validate generated code in your project

### DON'T ❌
- Don't trust only the preview (test in your app)
- Don't forget to copy code before closing
- Don't skip prop descriptions (hover for info)
- Don't ignore TypeScript types
- Don't use playground for production rendering

## 🔗 Quick Links

- **Home**: Back to showcase homepage
- **Docs**: Component documentation
- **GitHub**: Source code and issues
- **Storybook**: Detailed component stories

## 💬 Getting Help

### I can't find a component
→ Check if it's in the dropdown categories

### The code doesn't work in my project
→ Ensure you have the required packages installed

### How do I add a new component?
→ See README.md "Adding New Components" section

### Can I customize the playground?
→ Yes! Fork and modify `/playground` directory

### Is this production-ready?
→ Yes for code generation, no for runtime rendering

## 📊 Stats & Metrics

- **8 Components** available
- **40+ Props** to customize
- **20+ Examples** pre-configured
- **2 Languages** (TypeScript, JavaScript)
- **2 Themes** (Light, Dark)
- **5 Actions** (Share, Export, Import, Copy, Download)

## 🎉 Success Checklist

After 5 minutes, you should be able to:
- [ ] Select a component
- [ ] Modify at least 3 props
- [ ] Preview in both themes
- [ ] Copy generated code
- [ ] Share a configuration

After 15 minutes, you should be able to:
- [ ] Use all 8 components
- [ ] Load example presets
- [ ] Export/import configs
- [ ] Toggle TypeScript/JavaScript
- [ ] Understand prop types

After 30 minutes, you should be able to:
- [ ] Create custom component configs
- [ ] Integrate code into your project
- [ ] Share configs with team
- [ ] Troubleshoot issues
- [ ] Extend the playground (optional)

---

**Ready to build?** Open `/playground` and start exploring! 🚀
