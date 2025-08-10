'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { ArrowRight, Loader2, Search} from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import BottomNavigation from '@/components/BottomNavigation'
import { useProducts } from '@/hooks/useProducts'
import { getProductImage } from '@/utils/imageUtils'

// New & trending products will be fetched from database

const NewTrendingPage = () => {
  const [sortBy, setSortBy] = useState('Featured')
  const [showAllProducts, setShowAllProducts] = useState(false)
  const { t } = useLanguage()

  // Fetch new and trending products from API
  const { products: newTrendingProducts, loading, error } = useProducts({ 
    limit: 50 
  })

  // Map database products to component format
  const mapProductToCardProps = (product: any) => ({
    id: product._id || product.id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    originalPrice: product.originalPrice,
    image: getProductImage(product.image),
    rating: product.rating,
    reviewCount: product.reviewCount,
    isNew: product.isNew,
    isSale: product.isSale,
    discount: product.discount,
    description: product.description,
    size: product.size,
    skinType: product.skinType,
    benefits: product.benefits,
    inStock: product.inStock,
    category: product.category,
    productType: product.productType,
    crueltyFree: product.crueltyFree,
    vegan: product.vegan,
    luxury: product.luxury,
    cleanBeauty: product.cleanBeauty,
    isTrending: product.isTrending
  })

  const sortedProducts = [...newTrendingProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High':
        return a.price - b.price
      case 'Price: High to Low':
        return b.price - a.price
      case 'Rating':
        return b.rating - a.rating
      case 'Reviews':
        return b.reviewCount - a.reviewCount
      case 'Newest':
        return a.isNew ? -1 : 1
      case 'Trending':
        return a.isTrending ? -1 : 1
      default:
        return 0
    }
  })

  const displayedProducts = showAllProducts ? sortedProducts : sortedProducts.slice(0, 8)

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold mb-8 text-center">{t('newTrending')}</h1>

          {/* Promotional Banner */}
          <section className="mb-12 rounded-lg overflow-hidden shadow-lg relative">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=400&fit=crop"
              alt="Exclusive Cosmetics Promotion"
              className="w-full h-64 object-cover brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-red-600 to-yellow-500 bg-opacity-70 flex flex-col justify-center items-center text-white p-8">
              <h2 className="text-4xl font-bold mb-4">{t('springBeautySale')}</h2>
              <p className="max-w-xl text-center mb-6">
                {t('enjoyUpTo40Off')}
              </p>
              <button 
                onClick={() => window.location.href = '/products'}
                className="btn-primary bg-white text-pink-600 hover:bg-pink-600 hover:text-white transition-colors px-6 py-3 rounded-full font-semibold cursor-pointer"
              >
                {t('shopNow')}
              </button>
            </div>
          </section>

          {/* Sorting and product count */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-600">{t('showing')} {displayedProducts.length} {t('of')} {newTrendingProducts.length} {t('products')}</span>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{t('sortBy')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Featured">{t('featured')}</option>
                <option value="Newest">{t('newest')}</option>
                <option value="Trending">{t('trending')}</option>
                <option value="Price: Low to High">{t('priceLowToHigh')}</option>
                <option value="Price: High to Low">{t('priceHighToLow')}</option>
                <option value="Rating">{t('rating')}</option>
                <option value="Reviews">{t('mostReviews')}</option>
              </select>
            </div>
          </div>

                  {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="animate-spin mx-auto mb-4" size={32} />
            <p className="text-gray-500">Loading new & trending products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-4">{t('noProductsFound')}</p>
              <button onClick={() => window.location.reload()} className="btn-primary">
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && displayedProducts.length > 0 ? (
                         <div className="grid-responsive">
              {displayedProducts.map((product, index) => (
                <div key={`product-${index}`} className="group relative">
                  <ProductCard {...mapProductToCardProps(product)} />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {mapProductToCardProps(product).isNew && (
                      <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {t('new')}
                      </span>
                    )}
                    {mapProductToCardProps(product).isTrending && (
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {t('trending')}
                      </span>
                    )}
                    {mapProductToCardProps(product).luxury && (
                      <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {t('luxury')}
                      </span>
                    )}
                    {mapProductToCardProps(product).crueltyFree && (
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {t('crueltyFree')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
                  ) : !loading && !error ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">{t('noProductsFound')}</p>
          </div>
        ) : null}
          {!showAllProducts && sortedProducts.length > 8 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAllProducts(true)}
                className="btn-secondary inline-flex items-center gap-2"
              >
                {t('viewAllProducts')}
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </>
  )
}

export default NewTrendingPage
