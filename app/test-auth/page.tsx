"use client";

import { useUser } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function TestAuthPage() {
  const { user, isLoaded } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Authentication Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This page tests Clerk authentication integration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Authentication Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Authentication Status
            </h2>
            
            {!isLoaded ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-2"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`font-medium ${user ? 'text-green-600' : 'text-red-600'}`}>
                    {user ? 'Authenticated' : 'Not Authenticated'}
                  </span>
                </div>
                
                {user && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Name:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {user.fullName || user.firstName || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {user.primaryEmailAddress?.emailAddress || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-xs">
                        {user.id}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Navigation
            </h2>
            
            <div className="space-y-3">
              <Link 
                href="/"
                className="block w-full text-center py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Home
              </Link>
              
              <Link 
                href="/sign-in"
                className="block w-full text-center py-2 px-4 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                Sign In
              </Link>
              
              <Link 
                href="/sign-up"
                className="block w-full text-center py-2 px-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                Sign Up
              </Link>
              
              <SignedIn>
                <Link 
                  href="/account"
                  className="block w-full text-center py-2 px-4 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors"
                >
                  Account
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Test Results
          </h2>
          
          <div className="space-y-4">
            <SignedIn>
              <div className="p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
                <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  ✅ Authentication Working
                </h3>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  You are successfully signed in. Clerk authentication is working correctly.
                </p>
              </div>
            </SignedIn>
            
            <SignedOut>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  ⚠️ Not Authenticated
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  You are not signed in. Sign in to test the full authentication flow.
                </p>
              </div>
            </SignedOut>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                ℹ️ Clerk Integration Status
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Clerk components are rendering correctly. Check your environment variables if authentication isn't working.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
