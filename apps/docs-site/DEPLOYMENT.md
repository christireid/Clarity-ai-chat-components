# Deployment Guide

This documentation site is ready to be deployed to multiple platforms. Choose your preferred platform below.

## 📦 Pre-Deployment Checklist

- ✅ All documentation pages created (24 components, 6 hooks, 4 examples)
- ✅ SEO optimization (sitemap.xml, robots.txt, Open Graph images)
- ✅ Production optimizations in next.config.js
- ✅ Security headers configured
- ✅ Responsive design tested
- ✅ Accessibility features implemented

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Next.js)

**Why Vercel?**
- Native Next.js support
- Automatic deployments from GitHub
- Edge network for fast global delivery
- Zero configuration needed

**Steps:**

1. **Connect Repository**
   ```bash
   # Push your code to GitHub (already done)
   git push origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository: `christireid/Clarity-ai-chat-components`
   - Select the `apps/docs-site` directory as the root
   - Click "Deploy"

3. **Configure Project** (Auto-detected)
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Environment Variables** (if needed)
   - No environment variables required for static documentation

5. **Custom Domain** (optional)
   - Add custom domain: `clarity-chat.dev`
   - Configure DNS:
     - Type: `CNAME`
     - Name: `@` or `www`
     - Value: `cname.vercel-dns.com`

**Deployment URL:** `https://clarity-chat-docs.vercel.app` (or custom domain)

---

### Option 2: Netlify

**Why Netlify?**
- Great for static sites
- Excellent build performance
- Built-in form handling
- Free SSL certificates

**Steps:**

1. **Connect Repository**
   ```bash
   git push origin main
   ```

2. **Deploy on Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select GitHub and your repository
   - Base directory: `apps/docs-site`
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Deploy site"

3. **Configuration** (using netlify.toml)
   - The `netlify.toml` file is already configured
   - Node version: 18
   - Next.js plugin enabled
   - Security headers configured

4. **Custom Domain** (optional)
   - Go to Domain settings
   - Add custom domain: `clarity-chat.dev`
   - Configure DNS with provided nameservers

**Deployment URL:** `https://clarity-chat-docs.netlify.app` (or custom domain)

---

### Option 3: Cloudflare Pages

**Why Cloudflare Pages?**
- Global CDN network
- Excellent performance
- DDoS protection
- Free unlimited bandwidth

**Steps:**

1. **Connect Repository**
   ```bash
   git push origin main
   ```

2. **Deploy on Cloudflare Pages**
   - Visit [dash.cloudflare.com](https://dash.cloudflare.com)
   - Go to "Pages" → "Create a project"
   - Select "Connect to Git"
   - Choose your GitHub repository
   - Configure build:
     - Build command: `npm run build`
     - Build output directory: `.next`
     - Root directory: `apps/docs-site`
     - Environment variables: `NODE_VERSION = 18`

3. **Configuration** (using wrangler.toml)
   - The `wrangler.toml` file is configured for Pages
   - Alternatively, use Cloudflare dashboard settings

4. **Custom Domain** (optional)
   - Go to Custom domains
   - Add domain: `clarity-chat.dev`
   - Configure DNS (if using Cloudflare DNS, it's automatic)

**Deployment URL:** `https://clarity-chat-docs.pages.dev` (or custom domain)

---

## 🔧 Build Optimization

### Performance Tips

1. **Image Optimization**
   - Already configured in `next.config.js`
   - AVIF and WebP formats enabled
   - Responsive image sizes configured

2. **Code Splitting**
   - Next.js automatically code-splits
   - Dynamic imports for large components
   - Route-based code splitting enabled

3. **Caching Strategy**
   - Static assets cached for 1 year
   - HTML cached with revalidation
   - API routes have appropriate cache headers

### Security Headers

Already configured in `next.config.js`:
- `X-DNS-Prefetch-Control: on`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`

---

## 📊 Post-Deployment

### 1. Verify Deployment

Check these URLs after deployment:
- `/` - Homepage
- `/getting-started` - Getting Started guide
- `/reference/components/button` - Component documentation
- `/sitemap.xml` - Sitemap
- `/robots.txt` - Robots file
- `/opengraph-image` - OG image

### 2. Test SEO

```bash
# Check sitemap
curl https://your-domain.com/sitemap.xml

# Check robots.txt
curl https://your-domain.com/robots.txt

# Check Open Graph image
curl -I https://your-domain.com/opengraph-image
```

### 3. Run Lighthouse Audit

1. Open Chrome DevTools
2. Navigate to "Lighthouse" tab
3. Run audit for:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

**Expected Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 100
- SEO: 100

### 4. Monitor Analytics (Optional)

Add analytics if needed:
- Google Analytics
- Plausible
- Fathom
- Cloudflare Web Analytics

---

## 🐛 Troubleshooting

### Build Fails

**Issue:** Build command fails
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Module Not Found

**Issue:** Cannot find module errors
**Solution:**
```bash
# Install from root of monorepo
cd /path/to/webapp
npm install
```

### Styling Issues

**Issue:** Styles don't load correctly
**Solution:**
- Check that Tailwind CSS is properly configured
- Verify `globals.css` is imported in `app/layout.tsx`
- Clear `.next` cache and rebuild

---

## 📝 Deployment Checklist

Before deploying to production:

- [ ] All documentation pages are complete
- [ ] No broken links or missing pages
- [ ] All images are optimized
- [ ] SEO metadata is correct
- [ ] Sitemap is generated
- [ ] Robots.txt is configured
- [ ] Security headers are set
- [ ] Performance is optimized
- [ ] Accessibility is tested
- [ ] Mobile responsiveness is verified
- [ ] Browser compatibility is checked
- [ ] Git repository is up to date

---

## 🎯 Recommended Platform

**For this project, we recommend Vercel** because:

1. ✅ Native Next.js support
2. ✅ Zero configuration required
3. ✅ Automatic deployments from GitHub
4. ✅ Excellent performance globally
5. ✅ Built-in analytics available
6. ✅ Easy rollbacks and preview deployments
7. ✅ Free for open-source projects

---

## 🔗 Useful Links

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Netlify Next.js Guide](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

---

## 📞 Need Help?

If you encounter any issues during deployment:

1. Check the platform's documentation
2. Review build logs for errors
3. Verify all dependencies are installed
4. Test locally with `npm run build && npm start`
5. Open an issue on GitHub if needed

Happy deploying! 🚀
