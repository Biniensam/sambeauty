# Environment Variables for Vercel Deployment

## Required Environment Variables

Add these to your Vercel project settings under **Settings > Environment Variables**:

### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

### Clerk URLs
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/account
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/account
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** tab
4. Click **Environment Variables**
5. Add each variable with the exact name and value
6. Make sure to set them for **Production**, **Preview**, and **Development** environments
7. Redeploy your project

## Getting Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select existing
3. Copy your publishable and secret keys
4. Replace the placeholder values above

## Important Notes

- **NEXT_PUBLIC_** variables are exposed to the browser
- **CLERK_SECRET_KEY** should never be exposed to the browser
- All variables are case-sensitive
- Redeploy after adding environment variables
