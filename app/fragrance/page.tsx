import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PerfumeProducts from '@/components/PerfumeProducts'
import BottomNavigation from '@/components/BottomNavigation'

export default function FragrancePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <PerfumeProducts />
      <Footer />
      <BottomNavigation />
    </main>
  )
} 