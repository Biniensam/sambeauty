import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetails from '@/components/ProductDetails'
import BottomNavigation from '@/components/BottomNavigation'

interface ProductPageProps {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function ProductPage({ params, searchParams }: ProductPageProps) {
  return (
    <main className="min-h-screen">
      <Header />
      <ProductDetails productId={params.id} searchParams={searchParams} />
      <Footer />
      <BottomNavigation />
    </main>
  )
} 