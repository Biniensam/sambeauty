import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartPage from '@/components/CartPage'
import BottomNavigation from '@/components/BottomNavigation'

export default function Cart() {
  return (
    <main className="min-h-screen">
      <Header />
      <CartPage />
      <Footer />
      <BottomNavigation />
    </main>
  )
} 