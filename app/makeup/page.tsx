import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MakeupProducts from '@/components/MakeupProducts'
import BottomNavigation from '@/components/BottomNavigation'

export default function MakeupPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <MakeupProducts />
      <Footer />
      <BottomNavigation />  
    </main>
  )
} 