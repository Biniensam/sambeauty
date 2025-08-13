'use client'

import { ClerkProvider as ClerkProviderBase } from '@clerk/nextjs'

interface ClerkProviderProps {
  children: React.ReactNode
}

export default function ClerkProvider({ children }: ClerkProviderProps) {
  return (
    <ClerkProviderBase
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: '#ec4899', // Pink color matching your theme
        },
        elements: {
          formButtonPrimary: 'bg-pink-600 hover:bg-pink-700 text-white',
          card: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
          headerTitle: 'text-gray-900 dark:text-gray-100',
          headerSubtitle: 'text-gray-600 dark:text-gray-400',
          socialButtonsBlockButton: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
          formFieldLabel: 'text-gray-700 dark:text-gray-300',
          formFieldInput: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent',
        }
      }}
    >
      {children}
    </ClerkProviderBase>
  )
}
