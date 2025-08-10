"use client";

import { UserButton as ClerkUserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "./ThemeContext";
import { User } from "lucide-react";
import Link from "next/link";

export default function UserButton() {
  const { theme } = useTheme();
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <a
          href="/sign-in"
          className="text-sm text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
        >
          Sign In
        </a>
        <a
          href="/sign-up"
          className="btn-primary px-4 py-2 text-sm"
        >
          Sign Up
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:block text-right">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {user?.firstName || user?.fullName || 'Welcome'}
        </p>
      </div>
      
      {/* Account Icon */}
      <Link 
        href="/account" 
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Account settings"
      >
        <User 
          size={20} 
          className="text-gray-700 dark:text-gray-100 hover:text-pink-600 dark:hover:text-pink-400 transition-colors" 
        />
      </Link>
      
      <ClerkUserButton
        appearance={{
          variables: {
            colorPrimary: "#be185d",
            colorText: theme === "dark" ? "#f3f4f6" : "#111827",
            colorBackground: theme === "dark" ? "#111827" : "#ffffff",
          },
          elements: {
            userButtonAvatarBox: "w-10 h-10",
            userButtonTrigger: "focus:shadow-none",
          },
        }}
        afterSignOutUrl="/"
      />
    </div>
  );
}
