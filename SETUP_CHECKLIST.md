# Setup Checklist - Supabase & Stripe Integration

Complete this checklist to get the TextLayer OCR frontend fully integrated with Supabase and Stripe.

## 📋 Pre-Setup Requirements

- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] Supabase account created
- [ ] Stripe account created
- [ ] Text editor (VS Code recommended)

## 🔐 Supabase Configuration

### 1. Create Supabase Project
- [ ] Go to https://supabase.com
- [ ] Create a new project
- [ ] Wait for project initialization
- [ ] Copy Project URL: `https://[project-id].supabase.co`
- [ ] Go to Settings → API → Copy `anon` public key

### 2. Enable OAuth Providers
- [ ] Go to Authentication → Providers
- [ ] Enable Google OAuth:
  - [ ] Create OAuth credentials in Google Cloud Console
  - [ ] Add Authorized redirect URIs:
    - `https://[project-id].supabase.co/auth/v1/callback`
    - `http://localhost:5173/auth/callback` (for local development)
  - [ ] Copy Client ID and Secret to Supabase
- [ ] Enable GitHub OAuth:
  - [ ] Create OAuth App in GitHub Settings
  - [ ] Set Authorization callback URL:
    - `https://[project-id].supabase.co/auth/v1/callback`
    - `http://localhost:5173/auth/callback` (for local development)
  - [ ] Copy Client ID and Secret to Supabase

### 3. Test Supabase Connection
- [ ] Create `.env.local` file
- [ ] Add Supabase credentials
- [ ] Test login with Google
- [ ] Test login with GitHub
- [ ] Verify session in browser DevTools

## 💳 Stripe Configuration

### 1. Create Stripe Account
- [ ] Go to https://stripe.com
- [ ] Create account and verify email
- [ ] Activate live keys (or use test keys for development)

### 2. Create Products and Prices
- [ ] Go to Products → Create Product
- [ ] Create "Pro Plan" product:
  - [ ] Name: Pro
  - [ ] Description: 100 credits/month
  - [ ] Create price: $19 USD/month
  - [ ] Copy Price ID (price_xxx)
- [ ] Create "Business Plan" product:
  - [ ] Name: Business
  - [ ] Description: 500 credits/month
  - [ ] Create price: $49 USD/month
  - [ ] Copy Price ID (price_xxx)

### 3. Update Frontend Configuration
- [ ] Copy Stripe Publishable Key to `.env.local`
- [ ] Go to Settings → API Keys
- [ ] Copy Secret Key for backend configuration

### 4. Set Up Webhooks (Backend)
- [ ] Go to Developers → Webhooks
- [ ] Create new endpoint:
  - [ ] Endpoint URL: `https://your-api.com/api/payment/webhook`
  - [ ] Events: Select `checkout.session.completed`
  - [ ] Copy Signing Secret to backend config

### 5. Test Stripe Checkout
- [ ] Navigate to Plans page
- [ ] Click "Upgrade Now" on a plan
- [ ] Use Stripe test card: `4242 4242 4242 4242`
- [ ] Complete checkout
- [ ] Verify success page appears

## 📝 Backend Configuration

### Update API Configuration
In `appsettings.json` or `appsettings.Development.json`:

```json
{
  "Supabase": {
    "Url": "https://[project-id].supabase.co",
    "AnonKey": "your-anon-key"
  },
  "Stripe": {
    "SecretKey": "sk_test_...",
    "WebhookSecret": "whsec_..."
  }
}
```

### Verify Backend Endpoints
- [ ] `GET /api/payment/plans` returns plans
- [ ] `POST /api/payment/checkout` creates session
- [ ] `GET /api/users/me` returns user profile
- [ ] `GET /api/users/credits` returns credits
- [ ] `GET /api/users/usage` returns usage stats

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
# Copy example to actual config
cp .env.example .env.local
```

### 3. Update .env.local
- [ ] VITE_SUPABASE_URL = Your Supabase project URL
- [ ] VITE_SUPABASE_ANON_KEY = Your Supabase anon key
- [ ] VITE_STRIPE_PUBLIC_KEY = Your Stripe publishable key
- [ ] VITE_API_URL = Your backend API URL (http://localhost:5000 for local)

### 4. Start Development Server
```bash
npm run dev
```

### 5. Test Frontend Features
- [ ] Home page loads
- [ ] Plans page shows all 3 plans
- [ ] Can click "Upgrade Now"
- [ ] Can sign in with Google
- [ ] Can sign in with GitHub
- [ ] Account page shows user info
- [ ] Can edit profile
- [ ] Can see credits and usage
- [ ] Can sign out

## 🔗 Integration Testing

### Complete User Journey
- [ ] Sign in with Google/GitHub
- [ ] Verify user appears in header
- [ ] Navigate to Plans page
- [ ] Click "Upgrade Now" on Pro plan
- [ ] Complete Stripe payment (use test card)
- [ ] Redirected to Account page
- [ ] See success message
- [ ] Plan updated to "Pro"
- [ ] Credits updated (100)
- [ ] Verify usage stats appear
- [ ] Edit profile and save
- [ ] Sign out
- [ ] Verify signed out state

## 🐛 Troubleshooting

### OAuth Not Working
- [ ] Check redirect URLs in Supabase
- [ ] Check browser console for errors
- [ ] Verify environment variables loaded
- [ ] Check CORS headers

### Stripe Checkout Fails
- [ ] Verify price IDs in backend
- [ ] Check Stripe publishable key is correct
- [ ] Check console for errors
- [ ] Verify backend can reach Stripe API

### User Data Not Loading
- [ ] Check Network tab for 401 errors
- [ ] Verify bearer token in Authorization header
- [ ] Check backend user service implementation
- [ ] Verify database has user records

### Credits Not Updating
- [ ] Check webhook configuration
- [ ] Verify webhook signing secret
- [ ] Check backend webhook handler
- [ ] Look for webhook delivery errors in Stripe dashboard

## 📊 Monitoring & Maintenance

### Regular Checks
- [ ] Monitor Stripe webhook deliveries
- [ ] Check Supabase logs for auth errors
- [ ] Monitor API response times
- [ ] Review failed transactions

### Scheduled Tasks
- [ ] Monthly credit reset (configure in backend)
- [ ] Review payment history
- [ ] Update pricing if needed
- [ ] Test OAuth flows periodically

## 🚀 Deployment

### Before Deploying to Production
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Stripe live keys active
- [ ] Supabase production project set up
- [ ] Webhook endpoints updated to production URLs
- [ ] Database backups configured
- [ ] Monitoring and alerting set up

### Deployment Steps
- [ ] Deploy backend first
- [ ] Deploy frontend
- [ ] Update Supabase redirect URLs
- [ ] Update Stripe webhook URLs
- [ ] Test complete user journey in production
- [ ] Monitor logs for errors

## ✅ Final Verification

- [ ] All environment variables set
- [ ] All backend endpoints working
- [ ] Frontend loads without errors
- [ ] Authentication flow complete
- [ ] Payment flow complete
- [ ] User account management complete
- [ ] All features tested
- [ ] Ready for production deployment

---

**Need Help?**
- Check INTEGRATION_GUIDE.md for detailed information
- Review README.md for feature overview
- Check console logs for error messages
- Visit Supabase and Stripe documentation
