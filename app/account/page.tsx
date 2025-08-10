import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Accounts from '@/components/Accounts'
import BottomNavigation from '@/components/BottomNavigation'

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <Accounts />
      <Footer />
      <BottomNavigation />
    </main>
  )
}
