import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CheckoutForm from '@/components/CheckoutForm'
import BottomNavigation from '@/components/BottomNavigation'

export default function Checkout() {
  return (
    <main className="min-h-screen">
      <Header />
      <CheckoutForm />
      <Footer />
      <BottomNavigation />
    </main>
  )
}
