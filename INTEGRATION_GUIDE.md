# TextLayer OCR Frontend - Supabase & Stripe Integration

## Overview

This document describes the complete implementation of Supabase authentication and Stripe payment integration for the TextLayer OCR frontend, including new Plans and Account pages.

## Features Implemented

### 1. Authentication (Supabase)
- Google OAuth login
- GitHub OAuth login
- Automatic session management
- User profile management
- Logout functionality

### 2. Payment Integration (Stripe)
- Three subscription plans (Free, Pro, Business)
- Stripe checkout integration
- Webhook support for payment confirmation
- Plan upgrade flow
- Credit allocation per plan

### 3. Pages

#### Plans Page (`/plans`)
- Display all available plans with pricing
- Show features for each plan
- Current plan badge
- Upgrade button with Stripe checkout
- FAQ section
- Responsive design

#### Account Page (`/account`)
- User profile section with editable name and avatar
- Current plan display
- Credits information
- Usage statistics (today, week, month)
- Plan details
- Payment success notification
- Sign out button

### 4. Services

#### `auth.service.ts`
- Supabase client initialization
- OAuth login methods
- Session management
- User interface definition

#### `payment.service.ts`
- Fetch available plans from backend
- Create Stripe checkout sessions
- Handle checkout callbacks
- Price and plan management

#### `user.service.ts`
- Fetch user profile
- Get user credits
- Get usage statistics
- Update user profile
- Plan information

### 5. Context

#### `AuthContext.tsx`
- Global authentication state
- User profile and credits caching
- Session refresh
- Auth state changes listener
- Profile update function

## Installation & Setup

### 1. Environment Variables

Create a `.env.local` file in the frontend root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# API Configuration
VITE_API_URL=http://localhost:5000
```

### 2. Install Dependencies

The required packages are already in `package.json`:
```bash
npm install
```

This installs:
- `@supabase/supabase-js` - Supabase client
- `@stripe/stripe-js` - Stripe.js library
- `react` - UI framework
- `react-dom` - React DOM

### 3. Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Enable Google and GitHub OAuth providers:
   - Go to Authentication → Providers
   - Enable Google OAuth
   - Enable GitHub OAuth
3. Copy your project URL and anon key to `.env.local`
4. Configure redirect URLs for OAuth callbacks

### 4. Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Create a Stripe product with pricing plans:
   - Pro plan: $19/month
   - Business plan: $49/month
3. Copy the Stripe publishable key to `.env.local`
4. Set up Stripe webhook endpoint in your backend

## Component Structure

```
src/
├── pages/
│   ├── PlansPage.jsx       # Pricing and plans display
│   ├── AccountPage.jsx     # User profile and settings
│   └── AuthCallbackPage.jsx # OAuth callback handler
├── services/
│   ├── auth.service.ts     # Supabase authentication
│   ├── payment.service.ts  # Stripe payment integration
│   └── user.service.ts     # User profile operations
├── contexts/
│   └── AuthContext.tsx     # Global auth state
├── config/
│   └── stripe.ts           # Stripe configuration
├── styles/
│   ├── plans.css           # Plans page styling
│   └── account.css         # Account page styling
├── components/
│   └── Header.jsx          # Updated with navigation
└── App.jsx                 # Main app with routing
```

## Usage

### Navigation

The app uses client-side routing via state management in `App.jsx`. Users can navigate by:

1. Clicking the logo to go home
2. Using the navigation buttons (Home, Plans, Account)
3. Automatic redirects after OAuth callbacks
4. Success redirects after Stripe checkout

### Authentication Flow

1. User clicks Google or GitHub button in header
2. Redirected to OAuth provider
3. Redirected back to `/auth/callback` (handled by AuthContext)
4. Session established in Supabase
5. User data fetched automatically
6. Displayed in header and Account page

### Payment Flow

1. User navigates to Plans page
2. Selects a plan and clicks "Upgrade Now"
3. Stripe checkout session created
4. Redirected to Stripe hosted checkout
5. After payment, redirected to Account page
6. Backend webhook updates user plan and credits
7. Success message displayed
8. Data refreshes automatically

### Profile Management

1. User goes to Account page
2. Clicks "Edit Profile"
3. Updates name and avatar
4. Changes saved to backend
5. UI updates immediately

## Backend Integration Points

The frontend expects the following API endpoints:

### Authentication
- JWT tokens in Authorization header
- User identification via `claims.sub`

### Payment Endpoints
- `GET /api/payment/plans` - Get available plans
- `POST /api/payment/checkout` - Create checkout session
- `GET /api/payment/checkout/{sessionId}` - Verify checkout

### User Endpoints
- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/credits` - Get credit info
- `GET /api/users/usage` - Get usage stats

## Styling

Both new pages use responsive CSS Grid and Flexbox layouts:

### Plans Page
- Gradient background
- Card-based plan display
- Current plan highlighting
- FAQ section
- Mobile responsive

### Account Page
- Tabbed/sectioned layout
- Profile section with avatar
- Plan and credits display
- Usage progress bars
- Editable form fields

## Security Considerations

1. **Token Management**: Supabase handles JWT tokens automatically
2. **Authorization**: Backend validates tokens on all protected endpoints
3. **Secure Checkout**: Stripe handles PCI compliance
4. **CORS**: Configured to allow frontend requests
5. **Environment Variables**: Sensitive keys only in `.env` files

## Error Handling

- API errors displayed to users
- Fallback messages for generic errors
- Retry mechanisms for failed requests
- User feedback via toast-like banners

## Future Enhancements

- [ ] Add card/payment method management
- [ ] Invoice history and downloads
- [ ] Usage analytics dashboard
- [ ] Plan comparison tool
- [ ] Automated billing notifications
- [ ] Usage alerts and limits
- [ ] Family/organization billing
- [ ] Multi-currency support

## Troubleshooting

### OAuth Not Working
- Check redirect URLs in Supabase settings
- Verify environment variables are loaded
- Check browser console for CORS errors

### Stripe Checkout Failing
- Verify Stripe publishable key is correct
- Check that price IDs match Stripe dashboard
- Ensure backend webhook is configured

### Credits Not Updating
- Check webhook signature validation in backend
- Verify payment success was processed
- Check user ID mapping in webhook handler

### Profile Updates Not Showing
- Refresh the page or navigate away and back
- Check network tab for failed requests
- Verify backend PUT endpoint is working

## Support

For issues or questions:
1. Check the backend logs for API errors
2. Check browser console for frontend errors
3. Verify environment variables are set correctly
4. Check Stripe and Supabase dashboards for webhook/session info
