import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HairProducts from '@/components/HairProducts'
import BottomNavigation from '@/components/BottomNavigation'

export default function HairPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HairProducts />
      <Footer />
      <BottomNavigation />
    </main>
  )
} 