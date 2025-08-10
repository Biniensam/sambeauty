# Clerk Authentication Setup

This project now uses Clerk for user authentication. Follow these steps to complete the setup:

## 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com) and sign up for a free account
2. Create a new application
3. Choose "Next.js" as your framework

## 2. Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/account
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/account
```

## 3. Get Your Clerk Keys

1. In your Clerk dashboard, go to "API Keys"
2. Copy the "Publishable Key" and "Secret Key"
3. Replace the placeholder values in your `.env.local` file

## 4. Configure Clerk Application

In your Clerk dashboard:

1. Go to "User & Authentication" → "Email, Phone, Username"
2. Enable the authentication methods you want (email, phone, etc.)
3. Go to "Paths" and ensure the sign-in and sign-up paths match your environment variables

## 5. Test the Authentication

1. Start your development server: `npm run dev`
2. Navigate to `/sign-in` to test the sign-in page
3. Navigate to `/sign-up` to test the sign-up page
4. Try accessing `/account` - you should be redirected to sign-in if not authenticated

## Features Implemented

- **Protected Routes**: Account page requires authentication
- **Checkout Authentication**: Users must be signed in to complete orders
- **User Profile Management**: Users can update their profile information
- **Order History**: Authenticated users can view their order history
- **Automatic Form Pre-filling**: Checkout forms are pre-filled with user data
- **Secure Sign-out**: Proper authentication state management

## How It Works

1. **Account Page**: Protected by Clerk's `SignedIn` component
2. **Checkout**: Uses Clerk's `SignedIn`/`SignedOut` components to show appropriate content
3. **User Data**: Automatically populated from Clerk user object
4. **Authentication State**: Managed by Clerk's hooks (`useUser`, `useClerk`)

## Troubleshooting

- Ensure all environment variables are set correctly
- Check that Clerk application paths match your environment variables
- Verify that the Clerk provider is wrapping your app in `layout.tsx`
- Check browser console for any authentication errors

## Security Features

- JWT-based authentication
- Secure session management
- Protected API routes
- Automatic token refresh
- Secure sign-out functionality
