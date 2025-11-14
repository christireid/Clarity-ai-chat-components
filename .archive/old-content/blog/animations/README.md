# Animation Files for Blog Post

This directory contains HTML/CSS/JavaScript files that demonstrate the animations to be included in the blog post. These files can be opened in a browser and screen-recorded to create GIF animations for Medium.

## Files

1. **01-hero-comparison.html** - Side-by-side comparison of bad vs good UX
2. **02-streaming-comparison.html** - Streaming message comparison
3. **03-error-recovery.html** - Error handling and retry flow
4. **04-token-counter.html** - Token counter with progress and warnings
5. **05-thinking-indicator.html** - Multi-stage thinking indicator

## How to Use

### Option 1: Screen Recording (Recommended)

1. Open the HTML file in a modern browser (Chrome, Firefox, Safari)
2. Use a screen recording tool:
   - **Mac:** QuickTime Player (File → New Screen Recording)
   - **Windows:** Xbox Game Bar (Win+G) or OBS Studio
   - **Cross-platform:** Loom, Kap, or ScreenToGif
3. Record the animation (ensure it loops smoothly)
4. Convert to GIF:
   - Use online tools like CloudConvert, EZGIF, or GIPHY
   - Or use command-line tools like `ffmpeg`

### Option 2: Browser DevTools

1. Open the HTML file in Chrome
2. Open DevTools (F12)
3. Use the "Rendering" tab to set up recording
4. Use Chrome's built-in screen recording

### Option 3: Automated Conversion

If you have Node.js installed, you can use tools like:
- `puppeteer` + `gifencoder` to automate GIF creation
- `playwright` for browser automation

## Animation Specifications

- **Duration:** 3-8 seconds per animation (looping)
- **Resolution:** 
  - Hero: 1200x600px
  - Standard: 800x600px or 1000x700px
  - Small: 400x200px or 600x400px
- **Frame rate:** 24-30fps
- **File size:** Keep under 5MB for Medium
- **Format:** GIF (animated)

## Customization

All animations use inline CSS and JavaScript, making them easy to customize:

- **Colors:** Edit the CSS color values to match your brand
- **Timing:** Adjust JavaScript delays and intervals
- **Content:** Modify text and icons as needed
- **Size:** Adjust container widths/heights

## Design Notes

- Colors match Code & Clarity branding (ocean blue gradients)
- Smooth transitions and easing functions
- Professional, polished appearance
- Accessible color contrasts
- Modern, clean design aesthetic

## Next Steps

1. Review each animation file
2. Record screen captures
3. Convert to GIF format
4. Optimize file sizes if needed
5. Add to blog post at specified locations

## Additional Resources

- [GIF Optimization Guide](https://www.smashingmagazine.com/2018/06/image-optimization-guide/)
- [Screen Recording Tools](https://www.techradar.com/best/best-screen-recording-software)
- [GIF Compression Tools](https://ezgif.com/optimize)
