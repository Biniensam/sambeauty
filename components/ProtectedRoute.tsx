'use client'

import React from 'react'
import { useAuth } from '@clerk/nextjs'
import { SignIn } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Sign In Required
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please sign in to access this page
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-pink-600 hover:bg-pink-700 text-white',
                  card: 'bg-transparent shadow-none',
                  headerTitle: 'text-gray-900 dark:text-gray-100',
                  headerSubtitle: 'text-gray-600 dark:text-gray-400',
                }
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
