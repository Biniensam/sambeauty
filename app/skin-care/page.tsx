import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SkinCareProducts from '@/components/SkinCareProducts'
import BottomNavigation from '@/components/BottomNavigation'

export default function SkinCarePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <SkinCareProducts />
      <Footer />
      <BottomNavigation />
    </main>
  )
} 