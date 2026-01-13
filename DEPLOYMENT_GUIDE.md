# 🚀 Deployment Guide

Complete guide for deploying the TextLayer OCR frontend to production.

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] ESLint warnings resolved
- [ ] No console errors
- [ ] Code reviewed
- [ ] Documentation updated

### Environment
- [ ] All environment variables configured
- [ ] Backend API production URL set
- [ ] Supabase production project created
- [ ] Stripe production keys activated
- [ ] HTTPS enabled

### Features
- [ ] OAuth working with production URLs
- [ ] Stripe checkout tested with real credentials
- [ ] Payment webhook configured
- [ ] User registration flow tested
- [ ] Plan upgrade/downgrade tested

### Performance
- [ ] Build size checked (`npm run build`)
- [ ] Images optimized
- [ ] Code splitting verified
- [ ] Load times tested
- [ ] Mobile performance tested

## Production Environment Variables

Create `.env.production.local`:

```env
# Supabase (Production Project)
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key

# Stripe (Live Keys)
VITE_STRIPE_PUBLIC_KEY=pk_live_your_live_key

# API
VITE_API_URL=https://api.yourdomain.com
```

## Building for Production

### Build the Application
```bash
npm run build
```

This creates:
- `dist/` - Production-ready files
- Minified and optimized assets
- Source maps (optional)

### Preview Production Build
```bash
npm run preview
```

Open http://localhost:4173 and test:
- [ ] All pages load
- [ ] Navigation works
- [ ] OAuth flow works
- [ ] Payment flow works
- [ ] Forms work
- [ ] Responsive design works

## Deployment Platforms

### Option 1: Vercel (Recommended)

**Advantages:**
- Easy deployment from Git
- Automatic HTTPS
- Good performance
- Free tier available

**Steps:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or connect GitHub:
1. Go to vercel.com
2. Connect GitHub repository
3. Select project
4. Configure environment variables
5. Deploy

**Configuration (vercel.json):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Option 2: Netlify

**Advantages:**
- Great DX
- Good performance
- Free tier available

**Steps:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir dist
```

Or connect GitHub:
1. Go to netlify.com
2. Connect GitHub
3. Select repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Add environment variables
7. Deploy

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: AWS S3 + CloudFront

**Steps:**
```bash
# Build
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Option 4: GitHub Pages

**Steps:**
```bash
# Update vite.config.js
export default {
  base: '/your-repo-name/',
  // ... rest of config
}

# Build
npm run build

# Deploy
gh-pages -d dist
```

### Option 5: Docker

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
      - VITE_STRIPE_PUBLIC_KEY=${VITE_STRIPE_PUBLIC_KEY}
      - VITE_API_URL=${VITE_API_URL}
```

**Build and run:**
```bash
docker build -t pdf-ocr-frontend .
docker run -p 3000:3000 pdf-ocr-frontend
```

## Post-Deployment Configuration

### Update OAuth Redirect URLs

**Supabase:**
1. Go to Authentication → URL Configuration
2. Add new authorized redirect URLs:
   - `https://yourdomain.com/auth/callback`
   - `https://www.yourdomain.com/auth/callback`

**Google OAuth:**
1. Go to Google Cloud Console
2. Update authorized redirect URIs

**GitHub OAuth:**
1. Go to GitHub Settings → Developer settings
2. Update Authorization callback URL

### Update Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Update webhook endpoint URL:
   - From: `https://your-dev-api.com/api/payment/webhook`
   - To: `https://your-prod-api.com/api/payment/webhook`

### Configure CORS

Backend should allow requests from:
- `https://yourdomain.com`
- `https://www.yourdomain.com`

```csharp
// In Program.cs
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins("https://yourdomain.com", "https://www.yourdomain.com")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});
```

## SSL/TLS Certificate

### Let's Encrypt (Free)

```bash
# Using Certbot
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

### Update HSTS

Add to backend response headers:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Performance Optimization

### Enable Compression
```csharp
app.UseResponseCompression();
```

### Add Security Headers
```csharp
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
    await next();
});
```

### CDN Configuration

For static assets, use a CDN:

```javascript
// In config
const CDN_URL = 'https://cdn.yourdomain.com';
const imageUrl = `${CDN_URL}/images/logo.png`;
```

## Monitoring & Logging

### Error Tracking (Sentry)

1. Create Sentry project
2. Install SDK:
   ```bash
   npm install @sentry/react
   ```
3. Initialize in main.jsx:
   ```javascript
   import * as Sentry from "@sentry/react";
   
   Sentry.init({
     dsn: import.meta.env.VITE_SENTRY_DSN,
     environment: 'production'
   });
   ```

### Analytics (Google Analytics / Plausible)

```javascript
// In index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Uptime Monitoring

Use services like:
- Uptime Robot
- Pingdom
- StatusPage.io

## Backup & Recovery

### Database Backups
- [ ] Enable automatic backups in Supabase
- [ ] Set retention policy (30 days recommended)
- [ ] Test restore process

### Code Backup
- [ ] Keep Git history
- [ ] Tag releases: `git tag v1.0.0`
- [ ] Push to GitHub

## Maintenance & Updates

### Dependency Updates
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Major version updates (careful!)
npm upgrade package-name@latest
```

### Security Updates
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Update to fix
npm install package-name@latest
```

### Monitor Logs

**Production logs:**
1. Check application logs
2. Check error tracking service
3. Check analytics
4. Review user feedback

## Rollback Plan

### In case of issues:

1. **Quick Rollback (Vercel/Netlify):**
   - Go to Deployments
   - Select previous successful deployment
   - Click "Rollback"

2. **Git Rollback:**
   ```bash
   git revert <commit-hash>
   git push
   ```

3. **Full Revert:**
   ```bash
   git reset --hard <previous-commit>
   git push --force
   ```

## Testing After Deployment

### Automated Tests
- [ ] Run test suite
- [ ] Check API endpoints
- [ ] Verify database connectivity

### Manual Testing (Production)
- [ ] Sign in with Google
- [ ] Sign in with GitHub
- [ ] View Plans page
- [ ] Test checkout (don't charge)
- [ ] View Account page
- [ ] Edit profile
- [ ] Sign out

### Performance Testing
```bash
# Using Lighthouse (Chrome DevTools)
# F12 → Lighthouse → Generate report

# Using WebPageTest
# https://www.webpagetest.org/
```

## Incident Response

### In case of issues:

1. **Alert Team** - Notify stakeholders
2. **Assess Impact** - How many users affected?
3. **Identify Cause** - Check logs and errors
4. **Immediate Fix** - Hotfix or rollback
5. **Root Cause** - Analyze what happened
6. **Prevent** - Implement safeguards
7. **Communicate** - Update users

## Scheduled Maintenance

### Weekly Tasks
- [ ] Check logs for errors
- [ ] Review analytics
- [ ] Monitor performance

### Monthly Tasks
- [ ] Security audit
- [ ] Dependency updates
- [ ] Backup verification
- [ ] Performance optimization

### Quarterly Tasks
- [ ] Major version updates
- [ ] Feature review
- [ ] User feedback analysis
- [ ] Disaster recovery drill

---

## Production Checklist

- [ ] Deployment platform selected
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] OAuth URLs updated
- [ ] Webhook endpoints updated
- [ ] Error tracking configured
- [ ] Analytics enabled
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Team access configured
- [ ] Documentation updated
- [ ] Runbook created

## Support & Help

For deployment issues:
1. Check deployment platform logs
2. Check application error tracking
3. Verify environment variables
4. Test API connectivity
5. Contact platform support if needed

**Useful Commands:**
```bash
# Check current environment
echo $NODE_ENV

# View environment variables
export | grep VITE

# Test API connectivity
curl https://api.yourdomain.com/api/health

# View logs (platform-specific)
vercel logs --prod  # Vercel
netlify logs        # Netlify
```

---

**Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Production Ready
