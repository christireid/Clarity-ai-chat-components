# Interactive Playground - Quick Start Guide

## 🚀 Getting Started (30 seconds)

1. **Navigate to playground**:
   ```
   http://localhost:3000/playground/interactive
   ```

2. **Select a component** from the grid (Button, Card, Input, Badge, Message)

3. **Customize** using the controls panel on the left

4. **Copy code** and use in your project

That's it!

---

## 📋 Features at a Glance

| Feature | Description | Shortcut |
|---------|-------------|----------|
| **Live Preview** | See changes instantly | Auto |
| **Prop Controls** | Adjust properties | Left panel |
| **Code Export** | Copy/download code | Copy button |
| **Theme Toggle** | Light/dark mode | Sun/Moon icon |
| **Presets** | Quick configurations | Preset buttons |
| **Share URL** | Share exact state | Share button |
| **View Modes** | Split/Preview/Code | View tabs |

---

## 🎨 5 Available Components

### 1. Button
**Props**: `variant`, `size`, `disabled`, `children`
**Presets**: Primary, Secondary, CTA

### 2. Card
**Props**: `variant`, `padding`, `elevation`, `children`
**Presets**: Default, Glass

### 3. Input
**Props**: `placeholder`, `size`, `disabled`
**Presets**: Default, Search

### 4. Badge
**Props**: `variant`, `size`, `children`
**Presets**: Status, Alert

### 5. Chat Message
**Props**: `role`, `content`, `showAvatar`
**Presets**: User, Assistant

---

## 🔧 Common Tasks

### Task 1: Customize a Button
```
1. Click "Button" card
2. Select "Call to Action" preset
3. Change text in "children" field
4. Click "Copy" button
5. Paste into your code
```

### Task 2: Create Glass Card
```
1. Click "Card" card
2. Select "Glass Card" preset
3. Adjust padding: "lg"
4. Adjust elevation: "lg"
5. Click "Export" to download
```

### Task 3: Share Configuration
```
1. Configure any component
2. Click "Share" button
3. Link copied to clipboard
4. Send to team
5. They see exact config
```

---

## 🎯 View Modes

### Split View (Recommended)
- Controls on left
- Preview + Code on right
- Best for development

### Preview Only
- Full-width preview
- Hide controls/code
- Best for presentations

### Code Only
- Full-width code
- Focus on implementation
- Easy to copy

---

## ⌨️ Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Navigate controls |
| `Enter` | Activate button |
| `Space` | Toggle checkbox |
| `↑↓` | Adjust select |

---

## 💡 Pro Tips

1. **Use Presets**: Start with a preset, then customize
2. **Share URLs**: Encode your config in URL for easy sharing
3. **Theme Test**: Always test in both light and dark themes
4. **Export Files**: Download as `.tsx` for version control
5. **View Modes**: Switch modes based on your task

---

## 🔗 Example URLs

### Primary Button
```
/playground/interactive?component=button&props={"variant":"primary","size":"lg","children":"Get Started"}
```

### Glass Card
```
/playground/interactive?component=card&props={"variant":"glass","padding":"lg","elevation":"lg"}
```

### User Message
```
/playground/interactive?component=message&props={"role":"user","content":"Hello!","showAvatar":true}
```

---

## 📦 Code Output Example

**Button Configuration**:
- variant: "primary"
- size: "lg"
- children: "Get Started"

**Generated Code**:
```tsx
<Button
  variant="primary"
  size="lg"
>
  Get Started
</Button>
```

---

## 🎨 Theme Colors

**Light Theme**:
- Background: `bg-neutral-50`
- Card: `bg-white`
- Border: `border-neutral-200`

**Dark Theme**:
- Background: `bg-neutral-950`
- Card: `bg-neutral-900`
- Border: `border-neutral-700`

---

## 🐛 Troubleshooting

### Preview not updating?
- Check prop values are valid
- Try resetting with "Reset" button
- Refresh page if needed

### Can't copy code?
- Check clipboard permissions
- Try download instead
- Use manual copy from code display

### Share URL not working?
- URL may be too long
- Try simpler configuration
- Check browser clipboard access

---

## 📚 Next Steps

1. **Explore** all 5 components
2. **Try** different presets
3. **Customize** properties
4. **Share** with team
5. **Export** to your project

---

## 🔥 Popular Configurations

### Primary CTA Button
```json
{
  "variant": "primary",
  "size": "lg",
  "disabled": false,
  "children": "Get Started Free"
}
```

### Glass Card
```json
{
  "variant": "glass",
  "padding": "lg",
  "elevation": "lg",
  "children": "Premium content"
}
```

### Search Input
```json
{
  "placeholder": "Search documentation...",
  "size": "md",
  "disabled": false
}
```

### Success Badge
```json
{
  "variant": "success",
  "size": "md",
  "children": "Active"
}
```

### AI Message
```json
{
  "role": "assistant",
  "content": "How can I help you today?",
  "showAvatar": true
}
```

---

## 📱 Mobile Usage

**Mobile-Optimized**:
- Responsive grid layout
- Touch-friendly controls
- Collapsible panels
- Swipe gestures (future)

**Best on Mobile**:
- Use "Preview Only" mode
- Access via shared URLs
- Quick demonstrations

---

## 🎓 Learning Resources

**Understanding Props**:
- `variant`: Visual style (primary, secondary, etc.)
- `size`: Component dimensions (sm, md, lg)
- `disabled`: Interactive state (true/false)
- `children`: Text content or nested elements

**Component Patterns**:
- Variants for visual styles
- Sizes for dimensions
- States for interactions
- Content for customization

---

## ⚡ Performance

**Fast Load Times**:
- First paint: < 100ms
- Interactive: < 200ms
- Smooth 60fps animations

**Optimized**:
- Memoized computations
- Stable callbacks
- Efficient re-renders
- GPU-accelerated animations

---

## 🎯 Use Cases

1. **Component Documentation**: Show live examples
2. **Design Reviews**: Share exact configs
3. **Prototyping**: Quick iteration
4. **Client Demos**: Visual presentations
5. **Developer Onboarding**: Interactive learning
6. **Design System**: Component catalog

---

## 🚦 Status Indicators

| Indicator | Meaning |
|-----------|---------|
| Live badge | Preview is updating |
| Checkmark | Code copied |
| Green toast | Link shared |
| Sun/Moon | Current theme |

---

## 🔒 Privacy & Security

- **No data collection**: Everything local
- **No server storage**: State in URL only
- **No tracking**: Zero analytics
- **Safe sharing**: URLs are read-only

---

## ✅ Quick Checklist

Before using playground:
- [ ] Select component
- [ ] Choose or create config
- [ ] Test in both themes
- [ ] Review generated code
- [ ] Copy or export
- [ ] Test in your project

---

## 📞 Support

**Issues?**
- Check browser console
- Try different browser
- Clear cache
- Refresh page

**Questions?**
- Read full README.md
- Check component docs
- Ask in team chat

---

**Access URL**: `/playground/interactive`
**Last Updated**: January 28, 2026
**Version**: 1.0.0
**Status**: Production Ready
