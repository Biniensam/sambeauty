"use client";

import { useState } from "react";
import { SignUp as ClerkSignUp } from "@clerk/nextjs";
import { useTheme } from "./ThemeContext";

export default function SignUp() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to home link */}
        <div className="text-left">
          <a 
            href="/" 
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </a>
        </div>
        
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join us to track orders, save favorites, and enjoy exclusive offers
          </p>
        </div>
        
                <div className="mt-8 space-y-6">
          <ClerkSignUp 
            appearance={{
              variables: {
                colorPrimary: "#be185d",
                colorText: theme === "dark" ? "#f3f4f6" : "#111827",
                colorBackground: theme === "dark" ? "#111827" : "#ffffff",
                colorInputBackground: theme === "dark" ? "#1f2937" : "#f9fafb",
                colorInputText: theme === "dark" ? "#f3f4f6" : "#111827",
              },
              elements: {
                formButtonPrimary: "bg-pink-600 hover:bg-pink-700 text-white",
                card: "bg-white dark:bg-gray-900 border border-pink-200 dark:border-pink-700",
                headerTitle: "text-pink-700 dark:text-pink-400",
                headerSubtitle: "text-gray-600 dark:text-gray-400",
              },
            }}
          />
          
          {/* Additional sign-up options and links */}
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <a 
                href="/sign-in" 
                className="font-medium text-pink-600 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300 transition-colors"
              >
                Sign in here
              </a>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              By signing up, you agree to our{" "}
              <a href="/terms" className="text-pink-600 hover:text-pink-500 dark:text-pink-400">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-pink-600 hover:text-pink-500 dark:text-pink-400">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
