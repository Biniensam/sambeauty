'use client'

import React from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BottomNavigation from '@/components/BottomNavigation'

const ProductsPage = () => {
  const { t } = useLanguage()
  const { products, loading, error, pagination, refetch } = useProducts()

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">{t('products')}</h1>
            <div className="grid-responsive">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
        <BottomNavigation />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">{t('products')}</h1>
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
              <button 
                onClick={refetch}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
        <BottomNavigation />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">{t('products')}</h1>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No products found</p>
              <button 
                onClick={refetch}
                className="btn-primary"
              >
                Refresh
              </button>
            </div>
          ) : (
            <>
              <div className="grid-responsive">
                {products.map((product) => {
                  // Map database product to ProductCard format
                  const mappedProduct = {
                    id: product._id,
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    image: product.image,
                    rating: product.rating,
                    reviewCount: product.reviewCount,
                    isNew: product.isNew,
                    isSale: product.isSale,
                    discount: product.discount,
                    description: product.description,
                    size: product.size,
                    skinType: Array.isArray(product.skinType) ? product.skinType[0] : product.skinType,
                    benefits: product.benefits,
                    inStock: product.inStock,
                    category: product.category,
                    productType: product.productType,
                    skinTone: product.skinTone,
                    finish: product.finish,
                    skinConcern: product.skinConcern,
                    ingredients: product.ingredients,
                    hairType: product.hairType,
                    hairConcern: product.hairConcern,
                    hairTexture: product.hairTexture,
                    fragranceFamily: product.fragranceFamily,
                    concentration: product.concentration,
                    season: Array.isArray(product.season) ? product.season[0] : product.season,
                    crueltyFree: product.crueltyFree,
                    vegan: product.vegan,
                    luxury: product.luxury,
                    cleanBeauty: product.cleanBeauty,
                    dermatologistRecommended: product.dermatologistRecommended,
                    salonProfessional: product.salonProfessional,
                    longLasting: product.longLasting,
                    isTrending: product.isTrending
                  }
                  
                  return <ProductCard key={product._id} {...mappedProduct} />
                })}
              </div>
              
              {/* Load More Button - Show only if there are more pages */}
              {pagination && pagination.hasNextPage && (
                <div className="text-center mt-12">
                  <Link href="/products">
                    <button className="btn-secondary inline-flex items-center gap-2">
                      Load More Products
                      <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </>
  )
}

export default ProductsPage
