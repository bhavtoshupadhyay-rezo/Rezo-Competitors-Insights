# Deployment Guide

## Deploying to Vercel (Recommended)

Vercel is the easiest way to deploy this Vite + React application.

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to project
cd ~/competitor-insights-platform

# Deploy
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite and configure build settings
6. Click "Deploy"

## Deploying to Netlify

### Option 1: Netlify CLI

```bash
# Install Netlify CLI
npm install netlify-cli -g

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Option 2: Netlify Dashboard

1. Build your project: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `dist` folder

## Deploying to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

Update `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/competitor-insights-platform/', // Your repo name
})
```

## Deploying to AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## Environment Variables

If you add API integrations, create a `.env` file:

```env
VITE_API_URL=https://api.your-backend.com
VITE_API_KEY=your-api-key
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Build Configuration

### Optimize for Production

The default Vite build is already optimized, but you can customize:

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'charts': ['recharts'],
          'icons': ['lucide-react']
        }
      }
    }
  }
})
```

## Performance Checklist

- ✅ Minified JavaScript
- ✅ Optimized CSS (Tailwind purges unused classes)
- ✅ Code splitting
- ✅ Lazy loading for modals
- ✅ Image optimization (use emoji icons)
- ✅ Font optimization (Google Fonts with preconnect)

## Security Considerations

1. **No sensitive data in frontend** - All competitor data is public information
2. **API keys** - If adding backend, use environment variables
3. **HTTPS** - All modern hosting platforms provide this by default
4. **CORS** - Configure if connecting to external APIs

## Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS

## CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Monitoring

Once deployed, monitor:
- **Uptime**: Use UptimeRobot or Pingdom
- **Analytics**: Add Google Analytics or Plausible
- **Error Tracking**: Add Sentry for error monitoring

## Updating the Deployment

```bash
# Make changes
# Commit to git
git add .
git commit -m "Update features"
git push

# Auto-deploys with Vercel/Netlify GitHub integration
# Or manually:
npm run build
vercel --prod
```

## Rollback

### Vercel
- Go to Deployments tab
- Click "..." on a previous deployment
- Click "Promote to Production"

### Netlify
- Go to Deploys
- Click on a previous deploy
- Click "Publish deploy"

## Post-Deployment Checklist

- [ ] Test all features in production
- [ ] Check mobile responsiveness
- [ ] Verify search functionality
- [ ] Test comparison engine
- [ ] Check notification center
- [ ] Verify all modals open/close correctly
- [ ] Test watchlist functionality
- [ ] Verify new entrant scanner works
- [ ] Check all links and buttons
- [ ] Test on different browsers
- [ ] Share with stakeholders

---

Your Competitor Insights Platform is now live! 🚀
