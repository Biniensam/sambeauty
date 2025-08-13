'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from './LanguageProvider'
import { useBrands } from '@/hooks/useProducts'
import { 
  Star, 
  Heart, 
  ArrowRight, 
  TrendingUp, 
  Award,  
  Sparkles,
  Filter,
  Search,
  Loader2
} from 'lucide-react'

// All data is now fetched from the product database

const Brands = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const { t } = useLanguage()
  
  // Fetch brands from database using the new hook
  const { brandsByCategory, loading, error } = useBrands()

  // Categories for navigation - completely dynamic from database
  const categories = loading ? [] : brandsByCategory.map((category, index) => {
    const categoryName = category.category.toLowerCase()
    let href = '/products'
    let description = t('exploreSkincareProducts')
    
    // Map category names to appropriate routes and descriptions
    if (categoryName.includes('skin')) {
      href = '/skin-care'
      description = t('exploreSkincareProducts')
    } else if (categoryName.includes('makeup')) {
      href = '/makeup'
      description = t('discoverMakeupTrends')
    } else if (categoryName.includes('hair')) {
      href = '/hair'
      description = t('findHairCareProducts')
    } else if (categoryName.includes('perfume')) {
      href = '/perfume'
      description = t('shopPerfumeCollection')
    }
    
    return {
      id: index + 1,
      name: category.category,
      description: description,
      href: href,
      productCount: category.brands.reduce((sum, brand) => sum + brand.productCount, 0),
      featuredBrands: category.brands.slice(0, 3).map(brand => brand.name)
    }
  })

  // Filter brands based on search and category
  const filteredBrands = loading ? [] : brandsByCategory
    .filter(category => activeCategory === 'All' || category.category === activeCategory)
    .map(category => ({
      ...category,
      brands: category.brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.brands.length > 0)

  // Get unique categories for filter buttons
  const availableCategories = loading ? ['All'] : ['All', ...brandsByCategory.map(cat => cat.category)]

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading brands...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Database Connection Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-500 mb-4 text-sm">Unable to fetch brands from the database. Please check your connection.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // No data state
  if (!loading && (!brandsByCategory || brandsByCategory.length === 0)) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Brands Available</h3>
          <p className="text-gray-600 mb-4">No brands found in the database.</p>
          <p className="text-gray-500 mb-4 text-sm">Please ensure your database contains product data.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl lg:text-6xl font-serif font-bold mb-6">
              {t('featuredBrands')}
            </h1>
            <p className="text-xl lg:text-2xl max-w-3xl mx-auto mb-8 text-gray-200">
              {t('discoverExquisitePerfumes')} - {brandsByCategory.length > 0 ? `${brandsByCategory.length} categories with ${brandsByCategory.reduce((total, cat) => total + cat.brands.length, 0)} brands` : 'Loading brands from database...'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={loading ? 'Loading...' : t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                  className="w-full sm:w-80 pl-10 pr-4 py-3 rounded-full border-0 focus:ring-2 focus:ring-white/50 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button 
                className="btn-primary px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  t('allBrands')
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Navigation */}
        <div className="mb-16">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-8 text-center">
            {t('categories')}
          </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          // Loading skeleton for categories
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 h-64 rounded-2xl mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))
        ) : categories.length > 0 ? (
                      categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
                className="group relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
          >
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600 flex items-center justify-center group-hover:from-purple-700 group-hover:via-pink-600 group-hover:to-indigo-700 transition-all duration-700">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
                  </div>
                  
                  {/* Floating geometric shapes */}
                  <div className="absolute top-6 left-6 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                  <div className="absolute top-12 right-8 w-2 h-2 bg-white/40 rounded-full animate-pulse delay-100"></div>
                  <div className="absolute bottom-8 left-8 w-4 h-4 bg-white/20 rounded-full animate-pulse delay-200"></div>
                  
                  {/* Product Count Badge */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/30 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-semibold">
                        {loading ? (
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-white/50 rounded animate-pulse"></div>
                            <span>Loading...</span>
                          </div>
                        ) : (
                          `${category.productCount} ${t('products')}`
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Featured Brands with enhanced styling */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex -space-x-3 mb-3">
                      {loading ? (
                        // Loading skeleton for featured brands
                        Array.from({ length: 3 }).map((_, index) => (
                          <div
                            key={index}
                            className="w-10 h-10 bg-white/30 rounded-full animate-pulse border-2 border-white/20"
                          />
                        ))
                      ) : (
                        category.featuredBrands.slice(0, 3).map((brand, index) => (
                          <div
                            key={index}
                            className="w-10 h-10 bg-white/95 rounded-full flex items-center justify-center text-sm font-bold text-gray-900 shadow-lg border-2 border-white/50 transform hover:scale-110 transition-transform duration-300"
                            style={{ zIndex: 3 - index }}
                          >
                            {brand.charAt(0)}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex flex-col justify-center items-center text-center p-4">
                  <h3 className="text-white text-2xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                    {loading ? (
                      <div className="h-8 bg-white/20 rounded animate-pulse w-32"></div>
                    ) : (
                      category.name
                    )}
                  </h3>
                  <p className="text-white/90 text-sm mb-4">
                    {loading ? (
                      <div className="h-4 bg-white/20 rounded animate-pulse w-48"></div>
                    ) : (
                      category.description
                    )}
                  </p>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <span>
                      {loading ? (
                        <div className="h-4 bg-white/20 rounded animate-pulse w-20"></div>
                      ) : (
                        `${category.featuredBrands.length} ${t('featuredBrands')}`
                      )}
                    </span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
            </div>
          </Link>
        ))
        ) : (
          // No categories found
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No categories available</p>
          </div>
        )}
      </div>
        </div>

        {/* All Brands Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 dark:text-gray-100">
                All Brands
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Filter size={16} />
                  {loading ? 'Loading...' : t('filters')}
                </button>
              </div>
            </div>

          {/* Category Filter */}
          {showFilters && (
            <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading && cat !== 'All' ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      cat
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            // Loading skeleton for brands
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, categoryIndex) => (
                <div key={categoryIndex} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                    <div className="h-6 bg-gray-300 rounded w-32"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, brandIndex) => (
                      <div key={brandIndex} className="p-4 border border-gray-200 rounded-lg">
                        <div className="h-4 bg-gray-300 rounded w-24 mb-3"></div>
                        <div className="h-3 bg-gray-300 rounded w-16 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-20"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading brands...</p>
            </div>
          ) : filteredBrands.length > 0 ? (
            <div className="space-y-8">
              {filteredBrands.map((category) => (
                <div key={category.category} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Award size={20} className="text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{category.category}</h3>
                    <span className="text-sm text-gray-500">({category.brands.length} brands)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {category.brands.map((brand, index) => (
                      <div key={index} className="group relative p-6 border border-gray-200 rounded-2xl hover:border-primary-300 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 hover:from-white hover:to-primary-50 overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-transparent rounded-full blur-3xl"></div>
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100 to-transparent rounded-full blur-2xl"></div>
                        </div>
                        
                        {/* Status indicator line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-lg text-gray-900 group-hover:text-primary-700 transition-colors">
                              {brand.name}
                            </h4>
                            <div className="flex gap-2">
                              {brand.isNew && (
                                <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                  NEW
                                </span>
                              )}
                              {brand.isSale && (
                                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                  SALE
                                </span>
                              )}
                              {brand.isTrending && (
                                <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg transform group-hover:scale-110 transition-transform duration-300 flex items-center gap-1">
                                  <TrendingUp size={10} />
                                  TRENDING
                                </span>
                              )}
                              {brand.isPopular && (
                                <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg transform group-hover:scale-110 transition-transform duration-300 flex items-center gap-1">
                                  <Sparkles size={10} />
                                  POPULAR
                                </span>
                              )}
                            </div>
                          </div>
                        
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              <Star size={16} className="text-yellow-400 fill-current drop-shadow-sm" />
                              <span className="text-sm font-bold text-gray-900">{brand.rating}</span>
                            </div>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <span className="text-xs text-gray-500 font-medium">{brand.followers} followers</span>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-4">
                            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs px-3 py-1.5 rounded-full font-semibold">
                              {brand.productCount} {brand.productCount === 1 ? 'product' : 'products'}
                            </div>
                          </div>
                          
                         
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="relative mb-6">
                <Search className="h-20 w-20 text-gray-300 mx-auto" />
                <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">No brands found</h3>
              <p className="text-gray-600 text-lg font-medium mb-4 text-center">No brands found matching your search.</p>
              <p className="text-gray-500 max-w-md text-center mb-6">Try adjusting your search terms or filters to find what you&apos;re looking for.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('All');
                }}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Clear Search & Filters'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Brands
