import React from 'react'
import { SignUp } from '@clerk/nextjs'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BottomNavigation from '@/components/BottomNavigation'

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container-responsive py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join us and start shopping for beauty products
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-pink-600 hover:bg-pink-700 text-white',
                  card: 'bg-transparent shadow-none',
                  headerTitle: 'text-gray-900 dark:text-gray-100',
                  headerSubtitle: 'text-gray-600 dark:text-gray-400',
                  formFieldLabel: 'text-gray-700 dark:text-gray-300',
                  formFieldInput: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent',
                }
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
      <BottomNavigation />
    </main>
  )
}
