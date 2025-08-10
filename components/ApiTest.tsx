'use client'

import React, { useState } from 'react'
import { useProducts, useFeaturedProducts, useNewArrivals, useBestSellers } from '@/hooks/useProducts'
import { getProductImage } from '@/utils/imageUtils'
import ProductCard from './ProductCard'
import { useLanguage } from './LanguageProvider'

const ApiTest = () => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'featured' | 'new' | 'best' | 'all'>('featured')

  // Fetch different types of products
  const { products: featuredProducts, loading: featuredLoading, error: featuredError } = useFeaturedProducts(4)
  const { products: newArrivals, loading: newLoading, error: newError } = useNewArrivals(4)
  const { products: bestSellers, loading: bestLoading, error: bestError } = useBestSellers(4)
  const { products: allProducts, loading: allLoading, error: allError } = useProducts({ limit: 4 })

  const getCurrentProducts = () => {
    switch (activeTab) {
      case 'featured':
        return { products: featuredProducts, loading: featuredLoading, error: featuredError }
      case 'new':
        return { products: newArrivals, loading: newLoading, error: newError }
      case 'best':
        return { products: bestSellers, loading: bestLoading, error: bestError }
      case 'all':
        return { products: allProducts, loading: allLoading, error: allError }
      default:
        return { products: [], loading: false, error: null }
    }
  }

  const { products, loading, error } = getCurrentProducts()

  // Helper function to map product data to ProductCard props
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
    isTrending: product.isTrending,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Detail Test Page</h1>
      <p className="text-gray-600 mb-6">
        This page demonstrates how clicking on products from different categories opens the detail page 
        and fetches data from the database. Click on any product card to see the detail page in action.
      </p>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('featured')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'featured'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Featured Products
        </button>
        <button
          onClick={() => setActiveTab('new')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'new'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          New Arrivals
        </button>
        <button
          onClick={() => setActiveTab('best')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'best'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Best Sellers
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Products
        </button>
      </div>

      {/* Status Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Products are fetched from the database using the API</li>
          <li>• When you click a product card, it navigates to `/product/[id]`</li>
          <li>• The ProductDetails component fetches the full product data from the database</li>
          <li>• Related products are also fetched from the database</li>
          <li>• If the API is not available, it falls back to URL parameters or static data</li>
        </ul>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">Error: {error}</p>
          <p className="text-red-600 text-sm mt-1">
            This might be because the API server is not running. The product detail page will still work 
            with static data or URL parameters.
          </p>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded mb-2"></div>
              <div className="bg-gray-200 h-6 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={mapProductToCardProps(product).id} className="group relative">
              <ProductCard {...mapProductToCardProps(product)} />
              
              {/* Product Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    NEW
                  </span>
                )}
                {product.isTrending && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    TRENDING
                  </span>
                )}
                {product.luxury && (
                  <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    LUXURY
                  </span>
                )}
                {product.crueltyFree && (
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    CRUELTY FREE
                  </span>
                )}
                {product.cleanBeauty && (
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    CLEAN
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No products found</p>
          <p className="text-gray-400 text-sm">
            This might be because the API server is not running or there are no products in the database.
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Testing Instructions:</h3>
        <ol className="text-gray-700 space-y-2">
          <li>1. Click on any product card above</li>
          <li>2. You'll be taken to the product detail page</li>
          <li>3. The page will attempt to fetch product data from the database</li>
          <li>4. If the API is available, you'll see real data from the database</li>
          <li>5. If not, you'll see static data or data from URL parameters</li>
          <li>6. Related products will also be fetched from the database</li>
        </ol>
      </div>
    </div>
  )
}

export default ApiTest
