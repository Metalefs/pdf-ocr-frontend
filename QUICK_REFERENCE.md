# 📖 Quick Reference - TextLayer OCR Frontend

## Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_API_URL=http://localhost:5000
```

## Available Scripts

```bash
npm run dev      # Start dev server on :5173
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure

```
Components:     src/components/
Pages:          src/pages/
Services:       src/services/
Contexts:       src/contexts/
Config:         src/config/
Styles:         src/styles/
Utils:          src/utils/
```

## Main Components

| Component | Purpose | Location |
|-----------|---------|----------|
| App | Main router | src/App.jsx |
| Header | Navigation & auth | src/components/Header.jsx |
| PlansPage | Pricing display | src/pages/PlansPage.jsx |
| AccountPage | User settings | src/pages/AccountPage.jsx |
| AuthContext | Auth state | src/contexts/AuthContext.tsx |

## Services

| Service | Purpose | Usage |
|---------|---------|-------|
| auth | Supabase auth | `authService.signInWithGoogle()` |
| payment | Stripe checkout | `paymentService.createCheckoutSession()` |
| user | User API calls | `userService.getProfile()` |
| pdf | PDF processing | `processPdfAsync(file)` |
| jobs | Job status | `getJobStatus(jobId)` |

## Using AuthContext

```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, credits, signInWithGoogle, signOut } = useAuth();
  
  if (!user) return <p>Please sign in</p>;
  
  return (
    <>
      <p>Hello {user.name}</p>
      <p>Credits: {credits?.credits}</p>
      <button onClick={signOut}>Sign Out</button>
    </>
  );
}
```

## Navigation

```jsx
// In App.jsx, pages receive onNavigate prop
<PlansPage onNavigate={setCurrentPage} />
<AccountPage onNavigate={setCurrentPage} />

// In pages, navigate like:
<button onClick={() => onNavigate("plans")}>
  Go to Plans
</button>
```

## API Integration

All API calls use the configured `VITE_API_URL` as base:

```typescript
// Services automatically add Bearer token
const response = await fetch(`${API_BASE}/api/users/me`, {
  headers: {
    Authorization: `Bearer ${session.access_token}`,
  },
});
```

## Common Tasks

### Add New Environment Variable
1. Add to `.env.example`
2. Add to `.env.local`
3. Add to `VITE_*` format: `VITE_YOUR_VAR`
4. Access in code: `(import.meta as any).env.VITE_YOUR_VAR`

### Create New Page
1. Create file in `src/pages/NewPage.jsx`
2. Import in `App.jsx`
3. Add route condition: `{currentPage === "new" && <NewPage onNavigate={setCurrentPage} />}`
4. Add navigation in Header

### Create New Service
1. Create file in `src/services/new.service.ts`
2. Extend with API calls and Supabase
3. Export class instance
4. Import in components

### Add New Styling
1. Create CSS file in `src/styles/new.css`
2. Import in component: `import '../styles/new.css'`
3. Use class names in JSX

## Debugging

### Check Authentication
```javascript
// In console
const { data } = await supabase.auth.getSession();
console.log(data.session);
```

### Check User Data
```javascript
// In console
const { user, credits } = useAuth(); // within component
console.log(user, credits);
```

### Network Errors
1. Open DevTools → Network tab
2. Look for failed API requests
3. Check response status and body
4. Verify Authorization header included

### Auth Issues
1. Check `.env.local` for correct keys
2. Check browser localStorage for auth token
3. Check Supabase dashboard for redirect URLs
4. Clear cache and localStorage

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Missing/invalid token | Sign in again, clear cache |
| CORS error | Wrong API URL | Check VITE_API_URL in .env.local |
| Stripe not loading | Missing key | Check VITE_STRIPE_PUBLIC_KEY |
| OAuth fails | Wrong redirect URL | Update in Supabase settings |
| Session expired | Token expired | Sign in again |

## Keyboard Shortcuts (DevTools)

- `Ctrl+Shift+I` - Open DevTools
- `Ctrl+Shift+C` - Inspect element
- `Ctrl+K` - Search in DevTools
- `Esc` - Close console drawer

## Mobile Testing

```bash
# Get local IP
ipconfig getifaddr en0  # macOS
ipconfig            # Windows

# Visit from phone
http://<your-ip>:5173
```

## Performance Tips

1. Use `useCallback` for event handlers
2. Use `useMemo` for expensive calculations
3. Lazy load images: `loading="lazy"`
4. Code split pages with React.lazy()
5. Minimize re-renders with Context

## Code Style

```javascript
// Use named exports
export default function MyComponent() {}

// Destructure props
function Card({ title, content }) {}

// Use const for components
const MyComponent = () => {};

// Use semantic HTML
<button> not <div onClick>
<nav> not <div className="nav">
<main> not <div className="main">
```

## Git Workflow

```bash
git status              # Check changes
git add .              # Stage all
git commit -m "..."    # Commit
git push               # Push to main
```

## Useful Links

- [Supabase Docs](https://supabase.io/docs)
- [Stripe Docs](https://stripe.com/docs)
- [React Docs](https://react.dev)
- [Vite Docs](https://vite.dev)
- [MDN Web Docs](https://developer.mozilla.org)

## File Naming Conventions

- **Components:** PascalCase → `MyComponent.jsx`
- **Services:** camelCase → `auth.service.ts`
- **Styles:** kebab-case → `my-style.css`
- **Utilities:** camelCase → `navigation.ts`
- **Constants:** UPPER_SNAKE_CASE → `API_URL`

## Directory Guidelines

- Keep components simple and focused
- One component per file (except related ones)
- Move logic to services
- Centralize state in contexts
- Keep styles colocated with components

---

For detailed information, see:
- **README.md** - Project overview
- **INTEGRATION_GUIDE.md** - Technical guide
- **SETUP_CHECKLIST.md** - Setup steps
- **IMPLEMENTATION_SUMMARY.md** - What was built
