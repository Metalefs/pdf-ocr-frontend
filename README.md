# PDF OCR Frontend

A React + Vite frontend for the PDF OCR SaaS application with complete Supabase authentication and Stripe payment integration.

## 🎯 Features

### Core Functionality
- PDF upload and processing
- Real-time progress tracking
- Download processed PDFs
- Multi-language support (English, Portuguese)

### Authentication
- Google OAuth login
- GitHub OAuth login
- User profile management
- Session management
- Secure token handling

### Payment & Subscriptions
- Three subscription tiers (Free, Pro, Business)
- Stripe integration
- Monthly credit system
- Usage tracking
- Plan upgrade/downgrade

### User Dashboard
- Account settings
- Profile editing
- Credits and usage overview
- Plan management
- Subscription status

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pdf-ocr-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
VITE_API_URL=http://localhost:5000
```

4. **Start development server**
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## 📁 Project Structure

```
src/
├── pages/
│   ├── PlansPage.jsx         # Pricing page
│   ├── AccountPage.jsx       # User account & settings
│   └── AuthCallbackPage.jsx  # OAuth callback handler
├── components/
│   ├── Header.jsx            # Navigation & auth UI
│   ├── Footer.jsx            # Footer component
│   ├── UploadZone.jsx        # PDF upload area
│   ├── Progress.jsx          # Processing progress
│   ├── Result.jsx            # Download result
│   ├── ErrorBox.jsx          # Error display
│   └── SidebarPreview.jsx    # PDF preview
├── services/
│   ├── auth.service.ts       # Supabase auth
│   ├── payment.service.ts    # Stripe integration
│   ├── user.service.ts       # User API calls
│   ├── pdf.service.ts        # PDF processing
│   └── jobs.service.ts       # Job management
├── contexts/
│   └── AuthContext.tsx       # Global auth state
├── config/
│   ├── stripe.ts             # Stripe config
│   └── api.ts                # API client config
├── styles/
│   ├── plans.css             # Plans page styling
│   ├── account.css           # Account page styling
│   └── index.css             # Global styles
├── utils/
│   └── navigation.ts         # Navigation utilities
├── App.jsx                   # Main app component
├── main.jsx                  # Entry point
└── i18n.js                   # Internationalization
```

## 🔧 Configuration

### Supabase Setup

1. Create a Supabase project
2. Enable OAuth providers (Google, GitHub)
3. Add redirect URLs:
   - `http://localhost:5173/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)
4. Copy project URL and anon key

### Stripe Setup

1. Create Stripe account
2. Create products for each plan:
   - Pro: $19/month (100 credits)
   - Business: $49/month (500 credits)
3. Copy publishable key to `.env.local`
4. Set up webhook endpoint in backend

## 📖 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🔐 Authentication Flow

```
User clicks Google/GitHub
    ↓
Redirected to OAuth provider
    ↓
Provider redirects to Supabase callback
    ↓
Session stored in localStorage
    ↓
AuthContext syncs user data
    ↓
Navigation to home/account page
```

## 💳 Payment Flow

```
User clicks "Upgrade"
    ↓
Frontend creates checkout session
    ↓
Redirected to Stripe checkout
    ↓
User completes payment
    ↓
Stripe webhook notifies backend
    ↓
Backend updates user plan & credits
    ↓
Frontend refreshes user data
    ↓
Success message displayed
```

## 🎨 Styling

The project uses:
- **CSS Modules** for component-scoped styles
- **CSS Grid & Flexbox** for layouts
- **Responsive Design** - Mobile-first approach
- **Gradient backgrounds** for visual appeal
- **Smooth animations** and transitions

### Colors
- Primary: `#667eea` (indigo)
- Secondary: `#764ba2` (purple)
- Success: `#28a745` (green)
- Danger: `#dc3545` (red)

## 🌐 Internationalization

Supported languages:
- English (en)
- Portuguese (pt)

Change language via the selector in the header.

## 🧪 Testing

### Manual Testing
1. Test OAuth login (Google, GitHub)
2. Test plan upgrade flow
3. Test profile editing
4. Test credit display and usage
5. Test sign out
6. Test language switching

### Browser DevTools
- Check Network tab for API calls
- Check Console for errors
- Check Application tab for localStorage

## 🚨 Error Handling

The app handles:
- Network errors with user-friendly messages
- Authentication errors with redirect to login
- Payment errors with detailed error messages
- API timeouts with retry mechanism
- Missing environment variables with warnings

## 📱 Responsive Design

- **Mobile (< 768px)**: Single column layouts, stacked navigation
- **Tablet (768px - 1024px)**: Two column layouts
- **Desktop (> 1024px)**: Three column layouts with sidebar

## 🔒 Security Features

- JWT token validation
- Supabase secure session handling
- Stripe PCI compliance
- CORS configuration
- XSS protection via React
- CSRF tokens for forms

## 🐛 Troubleshooting

### OAuth not working
- Check redirect URLs in Supabase
- Clear browser cache and localStorage
- Check browser console for errors

### Stripe checkout fails
- Verify publishable key in `.env.local`
- Check price IDs match backend
- Check console for stripe.js errors

### User data not loading
- Check Network tab for 401 errors
- Verify backend is running
- Check Auth token in localStorage

### Credits not updating
- Check Stripe webhook delivery
- Refresh page after payment
- Check backend logs

## 📚 Documentation

- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Detailed integration guide
- [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) - Complete setup checklist
- [API Reference](../pdf-ocr-api/README.md) - Backend API docs

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Netlify
```bash
npm run build
netlify deploy --prod --dir dist
```

### Deploy to Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📝 Environment Variables

Required variables:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key
- `VITE_STRIPE_PUBLIC_KEY` - Stripe publishable key
- `VITE_API_URL` - Backend API URL

Optional variables:
- `VITE_API_TIMEOUT` - API timeout in ms (default: 30000)

## 📦 Dependencies

- **React 19** - UI library
- **Supabase 2.90** - Authentication & database
- **Stripe.js 8.6** - Payment processing
- **Vite 7.2** - Build tool
- **ESLint 9** - Code quality

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Run `npm run lint`
4. Commit changes
5. Push and create PR

## 📄 License

MIT License - see LICENSE file

## 🆘 Support

For issues and questions:
1. Check documentation in INTEGRATION_GUIDE.md
2. Check SETUP_CHECKLIST.md for configuration
3. Review browser console for errors
4. Check backend logs
5. Contact support team

## 🗺️ Roadmap

- [ ] Email notifications
- [ ] Advanced analytics
- [ ] API key management
- [ ] Custom branding
- [ ] Webhook integrations
- [ ] Batch processing
- [ ] Usage alerts
- [ ] Billing history export

---

**Last Updated:** January 2026  
**Version:** 1.0.0  
**Status:** Production Ready
