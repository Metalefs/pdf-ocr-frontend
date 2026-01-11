# 🏗️ Architecture Overview

Complete architecture diagram and explanation of the PDF OCR Frontend system.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER BROWSER                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    App.jsx (Main Router)                │   │
│  │  - State-based routing (home, plans, account)           │   │
│  │  - AuthProvider wrapper                                 │   │
│  └────────────────┬───────────────────────────────────────┘   │
│                   │                                             │
│     ┌─────────────┼─────────────┬─────────────┐               │
│     │             │             │             │               │
│  ┌──▼──┐      ┌───▼───┐    ┌───▼──────┐     │               │
│  │Home │      │Plans  │    │Account   │     │               │
│  │Page │      │Page   │    │Page      │     │               │
│  └─────┘      └───────┘    └──────────┘     │               │
│     │             │             │             │               │
│     └─────────────┼─────────────┴─────────────┘               │
│                   │                                             │
│  ┌────────────────▼─────────────────────────────────────────┐  │
│  │              Global Components                            │  │
│  │  - Header.jsx (Navigation & Auth)                         │  │
│  │  - Footer.jsx                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  AuthContext                              │   │
│  │  - user: User | null                                     │   │
│  │  - credits: UserCredits | null                           │   │
│  │  - loading: boolean                                      │   │
│  │  - Methods: signIn, signOut, refreshUser                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌────────────────────────┬──────────────────┬────────────────┐  │
│  │    Services            │  Configuration   │  Utilities     │  │
│  ├────────────────────────┼──────────────────┼────────────────┤  │
│  │ - auth.service.ts      │ - stripe.ts      │ - navigation.ts│  │
│  │ - payment.service.ts   │ - api.ts         │                │  │
│  │ - user.service.ts      │                  │                │  │
│  │ - pdf.service.ts       │                  │                │  │
│  │ - jobs.service.ts      │                  │                │  │
│  └────────────────────────┴──────────────────┴────────────────┘  │
│                                                                   │
└─────────────────┬──────────────────────────────────┬────────────┘
                  │                                  │
                  │                                  │
┌─────────────────▼────────────────┐  ┌──────────────▼────────────┐
│     SUPABASE (Auth & Database)   │  │    STRIPE (Payments)     │
├──────────────────────────────────┤  ├──────────────────────────┤
│ - OAuth Providers                │  │ - Checkout Sessions      │
│   * Google                       │  │ - Payment Processing     │
│   * GitHub                       │  │ - Subscription Management│
│                                  │  │                          │
│ - Session Management             │  │ - Products & Pricing     │
│ - User Profiles                  │  │ - Invoices               │
│ - Webhooks                       │  │ - Webhooks               │
│                                  │  │   (checkout.completed)   │
└──────────────────┬───────────────┘  └──────────────┬───────────┘
                   │                                 │
                   │                                 │
                   └────────────────┬────────────────┘
                                    │
                    ┌───────────────▼──────────────┐
                    │   Backend API (ASP.NET)      │
                    ├──────────────────────────────┤
                    │ Controllers:                 │
                    │ - PaymentController          │
                    │ - UsersController            │
                    │ - JobController              │
                    │ - PdfOcrController           │
                    │                              │
                    │ Services:                    │
                    │ - PaymentService             │
                    │ - UserService                │
                    │ - JobService                 │
                    │ - OcrPipelineService         │
                    │                              │
                    │ Endpoints:                   │
                    │ - GET  /api/payment/plans    │
                    │ - POST /api/payment/checkout │
                    │ - GET  /api/users/me         │
                    │ - PUT  /api/users/me         │
                    │ - GET  /api/users/credits    │
                    │ - GET  /api/users/usage      │
                    └──────────────────────────────┘
```

## Component Hierarchy

```
App
├── AuthProvider
│   ├── Header
│   │   ├── Navigation Links
│   │   ├── User Menu
│   │   └── Language Selector
│   ├── Main Content
│   │   ├── HomePage
│   │   │   ├── UploadZone
│   │   │   ├── Progress
│   │   │   ├── Result
│   │   │   └── SidebarPreview
│   │   ├── PlansPage
│   │   │   ├── Plans Grid
│   │   │   │   └── Plan Cards (x3)
│   │   │   └── FAQ Section
│   │   └── AccountPage
│   │       ├── Profile Section
│   │       ├── Plan Section
│   │       ├── Usage Section
│   │       └── Security Section
│   └── Footer
└── I18nProvider
```

## Data Flow

### Authentication Flow

```
User Action
    │
    ▼
┌─────────────────────┐
│ Click Google/GitHub │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────────┐
│ auth.service.ts          │
│ signInWithGoogle()       │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Supabase OAuth           │
│ Redirect to provider     │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ OAuth Provider Login     │
│ (Google/GitHub)          │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Redirect to Callback     │
│ /auth/callback           │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ AuthCallbackPage         │
│ Handle session           │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ AuthContext.tsx          │
│ loadUserData()           │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ userService.getProfile() │
│ userService.getCredits() │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Backend: GET /api/users  │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ AuthContext Updates      │
│ user, credits, loading   │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Components Re-render     │
│ Show user data           │
└──────────────────────────┘
```

### Payment Flow

```
User Action
    │
    ▼
┌──────────────────────┐
│ Click "Upgrade Now"  │
└──────┬───────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ PlansPage.jsx                       │
│ handleUpgrade(plan)                 │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ paymentService.createCheckoutSession│
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Backend: POST /api/payment/checkout │
│ SessionCreateOptions                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Stripe: Create Session              │
│ Returns sessionId & URL             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Redirect to Stripe Checkout         │
│ https://checkout.stripe.com         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ User Enters Payment Details         │
│ Completes Checkout                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Stripe: Process Payment             │
│ Send webhook to backend             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Backend: POST /api/payment/webhook  │
│ Event: checkout.session.completed   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Backend Updates:                    │
│ - User plan                         │
│ - User credits                      │
│ - Subscription end date             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Redirect to Account Page            │
│ ?payment=success                    │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ AccountPage.jsx                     │
│ Refresh user data                   │
│ Show success banner                 │
└─────────────────────────────────────┘
```

## State Management

### AuthContext (Global State)

```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    credits: number;
    plan: 'free' | 'pro' | 'business';
  } | null;
  
  userProfile: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    credits: number;
    plan: string;
    createdAt: string;
    subscriptionEndsAt?: string;
  } | null;
  
  credits: {
    credits: number;
    resetDate: string;
    plan: string;
  } | null;
  
  loading: boolean;
  
  Methods:
  - signInWithGoogle()
  - signInWithGithub()
  - signOut()
  - refreshUser()
  - updateProfile(name, avatar)
}
```

### Local State (Per Component)

```javascript
// PlansPage
{
  plans: PlanDto[];
  loading: boolean;
  checkoutLoading: { [planId]: boolean };
  error: string | null;
}

// AccountPage
{
  usage: UserUsage | null;
  loading: boolean;
  editMode: boolean;
  editName: string;
  editAvatar: string;
  updating: boolean;
  error: string | null;
  success: string | null;
  paymentSuccess: boolean;
}
```

## API Integration Points

### Frontend → Backend

```
PlansPage
├── GET /api/payment/plans
└── POST /api/payment/checkout

AccountPage
├── GET /api/users/me
├── PUT /api/users/me
├── GET /api/users/credits
└── GET /api/users/usage

All requests include:
- Authorization: Bearer {jwt_token}
- Content-Type: application/json
```

### Backend ← Stripe

```
Webhooks received on:
POST /api/payment/webhook

Events:
- checkout.session.completed
  ├── Update user.plan
  ├── Update user.credits
  └── Set subscription_ends_at

- customer.subscription.updated
- customer.subscription.deleted
```

## Database Schema (Referenced)

```
Users Table
├── id: UUID (primary key)
├── email: string
├── name: string
├── avatar: string (nullable)
├── credits: integer (default: 10)
├── plan: string (default: 'free')
├── created_at: timestamp
├── subscription_ends_at: timestamp (nullable)
└── stripe_customer_id: string (nullable)
```

## Configuration Files

```
vite.config.js
├── React plugin
├── Dev server config
└── Build optimization

.env files
├── VITE_SUPABASE_URL
├── VITE_SUPABASE_ANON_KEY
├── VITE_STRIPE_PUBLIC_KEY
├── VITE_API_URL
└── Environment-specific overrides

package.json
├── Dependencies (React, Supabase, Stripe)
├── Dev dependencies (Vite, ESLint)
└── Build scripts (dev, build, preview, lint)
```

## Security Architecture

```
┌─────────────────────────────────────┐
│       Frontend (React)               │
│  - No sensitive data stored          │
│  - All tokens in localStorage        │
│  - All API calls use HTTPS           │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Supabase Auth                     │
│  - Manages JWT tokens               │
│  - Validates OAuth                  │
│  - Secure session handling          │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Backend (ASP.NET Core)            │
│  - Validates JWT tokens             │
│  - Checks authorization             │
│  - Validates payment signatures     │
│  - CORS configured                  │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   External Services                 │
│  - Stripe (PCI compliant)           │
│  - Supabase (SOC 2 compliant)       │
└─────────────────────────────────────┘
```

## Performance Optimization

```
Code Splitting
├── Pages loaded lazily
├── Services imported on demand
└── CSS split per page

Caching
├── User data cached in AuthContext
├── Browser cache for static assets
└── Service worker (optional)

Minification
├── JavaScript minified
├── CSS minified
└── Assets optimized

Lazy Loading
├── Images with loading="lazy"
├── Components with React.lazy()
└── Routes loaded on demand
```

## Deployment Architecture

```
┌─────────────────────────────────────┐
│   Development Environment           │
│   - npm run dev                     │
│   - Localhost:5173                  │
│   - Hot module replacement          │
└─────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Build Process                     │
│   - npm run build                   │
│   - Webpack/Vite bundling          │
│   - Minification & optimization     │
│   - Output: dist/                   │
└─────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   CDN / Hosting                     │
│   - Vercel / Netlify / AWS          │
│   - Static file serving             │
│   - HTTPS enabled                   │
│   - Caching configured              │
└─────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Production Environment            │
│   - 99.9% uptime SLA                │
│   - Global CDN distribution         │
│   - Automatic scaling               │
│   - Monitoring & alerts             │
└─────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 | UI rendering |
| | Vite | Build tool |
| | TypeScript | Type safety |
| **Auth** | Supabase | Authentication |
| | JWT | Token management |
| **Payments** | Stripe.js | Payment processing |
| **Styling** | CSS3 | Component styling |
| **Language** | JavaScript/JSX | Component logic |
| **Backend** | ASP.NET Core | API server |
| **Database** | PostgreSQL | Data persistence |
| **Deployment** | Vercel/Netlify | Hosting |

---

**Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Production Ready
