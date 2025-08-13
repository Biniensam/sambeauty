'use client'

import React, { useState } from 'react'
import { ArrowRight, Filter, Star, ChevronDown, Heart, ShoppingBag, Eye, Clock, Award, Sparkles, TrendingUp, Zap, Palette, Camera, Loader2 } from 'lucide-react'
import ProductCard from './ProductCard'
import Link from 'next/link'
import { useLanguage } from './LanguageProvider'
import MobileFilterButton from './MobileFilterButton'
import MobileFilters from './MobileFilters'
import FloatingFilterButton from './FloatingFilterButton'
import { useFilteredProducts } from '@/hooks/useProducts'
import { getProductImage } from '@/utils/imageUtils'

// Makeup categories and filter options
const categories = ['All', 'Face', 'Eyes', 'Lips', 'Cheeks', 'Brushes & Tools', 'Primers', 'Setting Sprays']
const skinTones = ['All Skin Tones', 'Fair', 'Light', 'Medium', 'Deep']
const finishes = ['All Finishes', 'Matte', 'Shimmer', 'Glossy', 'Natural', 'Long-lasting', 'Hydrating', 'Volumizing', 'Plumping']
const priceRanges = ['All Prices', 'Under $25', '$25-$50', '$50-$100', 'Over $100']



const MakeupProducts = () => {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeSkinTone, setActiveSkinTone] = useState('All Skin Tones')
  const [activeFinish, setActiveFinish] = useState('All Finishes')
  const [activePriceRange, setActivePriceRange] = useState('All Prices')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('Featured')
  const [showAllProducts, setShowAllProducts] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Create filters for makeup products
  const [filters, setFilters] = useState({
    category: 'Makeup',
    limit: 50
  });

  // Fetch filtered makeup products from database
  const { products: availableProducts, loading, error } = useFilteredProducts(filters)

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

  // Update filters when filter states change
  React.useEffect(() => {
    const newFilters: any = {
      category: 'Makeup',
      limit: 50
    };

    // Add category filter
    if (activeCategory !== 'All') {
      newFilters.category = activeCategory;
    }

    // Add price range filter
    if (activePriceRange !== 'All Prices') {
      switch (activePriceRange) {
        case 'Under $25':
          newFilters.maxPrice = 25;
          break;
        case '$25-$50':
          newFilters.minPrice = 25;
          newFilters.maxPrice = 50;
          break;
        case '$50-$100':
          newFilters.minPrice = 50;
          newFilters.maxPrice = 100;
          break;
        case 'Over $100':
          newFilters.minPrice = 100;
          break;
      }
    }

    setFilters(newFilters);
  }, [activeCategory, activePriceRange]);

  // Use the filtered products directly from the database
  const filteredProducts = availableProducts;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
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

  // Show only first 8 products initially, then all when "View All Products" is clicked
  const displayedProducts = showAllProducts ? sortedProducts : sortedProducts.slice(0, 8)

  // Calculate active filters count
  const activeFiltersCount = [
    activeCategory !== 'All' ? 1 : 0,
    activeSkinTone !== 'All Skin Tones' ? 1 : 0,
    activeFinish !== 'All Finishes' ? 1 : 0,
    activePriceRange !== 'All Prices' ? 1 : 0
  ].reduce((sum, count) => sum + count, 0)

  // Filter options for mobile
  const filterGroups = [
    {
      title: 'Category',
      key: 'category',
      options: categories.map(cat => ({ label: cat, value: cat })),
      value: activeCategory,
      onChange: setActiveCategory
    },
    {
      title: 'Skin Tone',
      key: 'skinTone',
      options: skinTones.map(tone => ({ label: tone, value: tone })),
      value: activeSkinTone,
      onChange: setActiveSkinTone
    },
    {
      title: 'Finish',
      key: 'finish',
      options: finishes.map(finish => ({ label: finish, value: finish })),
      value: activeFinish,
      onChange: setActiveFinish
    },
    {
      title: 'Price Range',
      key: 'priceRange',
      options: priceRanges.map(range => ({ label: range, value: range })),
      value: activePriceRange,
      onChange: setActivePriceRange
    }
  ]

  const sortOptions = [
    { label: 'Featured', value: 'Featured' },
    { label: 'Newest', value: 'Newest' },
    { label: 'Trending', value: 'Trending' },
    { label: 'Price: Low to High', value: 'Price: Low to High' },
    { label: 'Price: High to Low', value: 'Price: High to Low' },
    { label: 'Rating', value: 'Rating' },
    { label: 'Most Reviews', value: 'Reviews' }
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-900 via-rose-900 to-purple-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl lg:text-6xl font-serif font-bold mb-6">
              {t('makeUp')}
            </h1>
            <p className="text-xl lg:text-2xl max-w-3xl mx-auto mb-8 text-gray-200">
              {t('footerDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowAllProducts(true)}
                className="btn-primary px-8 py-3 rounded-full inline-flex items-center gap-2"
              >
                <Camera size={20} />
                {t('browseProducts')}
              </button>
              <button
                onClick={() => setShowAllProducts(true)}
                className="btn-secondary px-8 py-3 rounded-full"
              >
                {t('browseProducts')}
              </button>
            </div>
          </div>
        </div>
      </section>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="hidden lg:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} />
                {t('filters')}
              </button>
              <div className="lg:hidden">
                <MobileFilterButton
                  onClick={() => setShowMobileFilters(true)}
                  activeFiltersCount={activeFiltersCount}
                  resultsCount={displayedProducts.length}
                  totalCount={availableProducts.length}
                />
              </div>
              {(activeSkinTone !== 'All Skin Tones' || activeFinish !== 'All Finishes') && (
                <div className="flex items-center gap-1 sm:gap-2 bg-primary-100 text-primary-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  <Camera size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">{t('personalizedForYou')}</span>
                  <span className="sm:hidden">Personalized</span>
                </div>
              )}
            </div>
            
            <div className="hidden lg:flex items-center gap-3 sm:gap-4">
              <span className="text-gray-600 text-sm sm:text-base">{t('sortBy')}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Featured">Featured</option>
                <option value="Newest">Newest</option>
                <option value="Trending">Trending</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Rating">Rating</option>
                <option value="Reviews">Most Reviews</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('skinType')}</label>
                <select
                  value={activeSkinTone}
                  onChange={(e) => setActiveSkinTone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {skinTones.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Finish</label>
                <select
                  value={activeFinish}
                  onChange={(e) => setActiveFinish(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {finishes.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={activePriceRange}
                  onChange={(e) => setActivePriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {priceRanges.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count and Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <p className="text-gray-600 text-sm sm:text-base">
              Showing {displayedProducts.length} of {availableProducts.length} products
            </p>
            {(activeSkinTone !== 'All Skin Tones' || activeFinish !== 'All Finishes') && (
              <p className="text-xs sm:text-sm text-primary-600 mt-1">
                {t('personalizedRecommendations')}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <button className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs sm:text-sm">
              <Award size={12} className="sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Luxury Brands</span>
              <span className="sm:hidden">Luxury</span>
            </button>
            <button className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm">
              <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Clean Beauty</span>
              <span className="sm:hidden">Clean</span>
            </button>
            <button className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs sm:text-sm">
              <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Trending</span>
              <span className="sm:hidden">Trend</span>
            </button>
            <button className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm">
              <Palette size={12} className="sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Cruelty Free</span>
              <span className="sm:hidden">CF</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          // Loading skeleton
          <div className="grid-responsive">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded mb-2"></div>
                <div className="bg-gray-200 h-6 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid-responsive">
            {displayedProducts.map((product) => (
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
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Camera size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Makeup Products Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn&apos;t find any makeup products matching your criteria.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setActiveCategory('All')
                    setActiveSkinTone('All Skin Tones')
                    setActiveFinish('All Finishes')
                    setActivePriceRange('All Prices')
                  }}
                  className="btn-primary w-full"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-secondary w-full"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Load More / View All Products Button */}
        {!showAllProducts && sortedProducts.length > 8 && (
          <div className="text-center mt-12">
            <button 
              onClick={() => setShowAllProducts(true)}
              className="btn-secondary inline-flex items-center gap-2"
            >
              View All Products
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Load More Button for when all products are shown */}
        {showAllProducts && sortedProducts.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/products">
              <button className="btn-secondary inline-flex items-center gap-2">
                {t('loadMoreProducts')}
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Filters */}
      <MobileFilters
        filters={filterGroups}
        sortOptions={sortOptions}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onApplyFilters={() => {
          // Force re-render by updating a state that triggers re-filtering
          setShowMobileFilters(false)
        }}
        onResetFilters={() => {
          setActiveCategory('All')
          setActiveSkinTone('All Skin Tones')
          setActiveFinish('All Finishes')
          setActivePriceRange('All Prices')
          setSortBy('Featured')
        }}
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        resultsCount={displayedProducts.length}
        totalCount={availableProducts.length}
      />

      {/* Floating Filter Button */}
      <FloatingFilterButton
        onClick={() => setShowMobileFilters(true)}
        activeFiltersCount={activeFiltersCount}
        isOpen={showMobileFilters}
      />
    </div>
  )
}

export default MakeupProducts 