import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Brands from '@/components/Brands'
import BottomNavigation from '@/components/BottomNavigation'

export default function BrandsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Brands />
      <Footer />
      <BottomNavigation />
    </main>
  )
}
