# Supabase Setup Guide for Recur

## Files Created

### New Files
- `lib/supabase.ts` - Supabase client initialization
- `lib/database.types.ts` - TypeScript types for database tables
- `lib/auth.tsx` - AuthProvider and useAuth hook
- `lib/api.ts` - Database CRUD operations
- `components/AuthModal.tsx` - Login/Signup modal component
- `vite-env.d.ts` - Vite environment type declarations
- `supabase-schema.sql` - Database schema to run in Supabase
- `.env.local` - Environment variables (already configured)

### Modified Files
- `package.json` - Added @supabase/supabase-js dependency
- `index.tsx` - Wrapped app with AuthProvider
- `App.tsx` - Integrated auth state and data persistence
- `vite.config.ts` - Added Supabase env vars
- `tsconfig.json` - Added vite/client types

## Setup Steps

### 1. Run the Database Schema

Go to your Supabase project dashboard:
https://supabase.com/dashboard/project/pdhakwhuiemxqkokywsv/sql/new

Copy the contents of `supabase-schema.sql` and run it in the SQL Editor.

This will create:
- 10 database tables (professionals, services, clients, etc.)
- Row Level Security (RLS) policies
- Performance indexes

### 2. Enable Email Auth (Already enabled by default)

Go to Authentication > Providers and ensure Email is enabled.

### 3. Test the App

```bash
cd /tmp/Recur
npm run dev
```

Visit http://localhost:3000

## Features Implemented

### Authentication
- Sign up with email/password
- Sign in with email/password
- Password reset via email
- Session persistence (stays logged in on refresh)

### Data Persistence
When logged in, the following data is saved to Supabase:
- Professional profile
- Services
- Clients and their add-ons
- Client appointments and events
- Booking settings

### Demo Mode
The app still works in demo mode without login:
- Landing page accessible to everyone
- Demo button works without auth
- Data resets on page refresh in demo mode

### UI Changes
- "Sign In" button on landing page (when logged out)
- "Dashboard" button on landing page (when logged in)
- AuthModal for login/signup/password reset

## Row Level Security

All tables have RLS enabled:
- Users can only access their own data
- Public booking requests can be submitted without auth
- Public booking settings can be viewed by anyone (for booking pages)

## Next Steps (Optional)

1. **Add email verification**: Enable in Supabase Auth settings
2. **Add OAuth providers**: Google, GitHub, etc. in Supabase Auth
3. **Add real-time subscriptions**: For live updates
4. **Add Stripe integration**: For payments
