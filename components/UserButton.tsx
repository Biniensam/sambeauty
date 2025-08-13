'use client'

import React from 'react'
import { User, LogIn, LogOut, UserCheck } from 'lucide-react'
import { useUser, SignInButton, SignOutButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'

interface UserButtonProps {
  variant?: 'header' | 'mobile'
}

export default function UserButton({ variant = 'header' }: UserButtonProps) {
  const { isSignedIn, user } = useUser()

  // Check if user signed in with Google
  const isGoogleAccount = user?.externalAccounts?.some(
    account => account.provider === 'google'
  )

  // Get the appropriate icon based on sign-in method
  const getUserIcon = () => {
    if (isGoogleAccount) {
      // Get the Google profile image from external accounts
      const googleAccount = user?.externalAccounts?.find(
        account => account.provider === 'google'
      )
      const profileImage = googleAccount?.imageUrl
      
      if (profileImage) {
        return (
          <img
            src={profileImage}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
          />
        )
      }
    }
    return <UserCheck size={20} className="text-pink-600 dark:text-pink-400" />
  }

  if (variant === 'header') {
    return (
      <div className="hidden lg:block">
        {isSignedIn ? (
          <div className="relative group">
            <button className="p-2 text-gray-700 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {getUserIcon()}
            </button>
            {/* Dropdown menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.emailAddresses[0]?.emailAddress}
                </p>
                {isGoogleAccount && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Google Account
                  </p>
                )}
              </div>
              <div className="p-2">
                <Link
                  href="/account"
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <User size={16} />
                  Account
                </Link>
                <SignOutButton>
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <button className="p-2 text-gray-700 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <LogIn size={20} />
            </button>
            {/* Auth dropdown menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Welcome Guest
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Sign in or create an account
                </p>
              </div>
              <div className="p-2 space-y-2">
                <SignInButton mode="modal">
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                    <LogIn size={16} />
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                    <User size={16} />
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Mobile variant
  return (
    <div className="lg:hidden">
      {isSignedIn ? (
        <div className="flex items-center gap-2">
          {getUserIcon()}
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {user?.firstName || 'Account'}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <SignInButton mode="modal">
            <button className="flex items-center gap-2 text-gray-700 dark:text-gray-100 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
              <LogIn size={20} />
              <span className="text-sm font-medium">Sign In</span>
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors">
              <User size={20} />
              <span className="text-sm font-medium">Sign Up</span>
            </button>
          </SignUpButton>
        </div>
      )}
    </div>
  )
}
