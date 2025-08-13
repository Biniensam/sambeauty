'use client'

import React, { useState } from 'react'
import { ArrowRight, Filter, Award, Sparkles, TrendingUp, Zap, Loader2 } from 'lucide-react'
import ProductCard from './ProductCard'
import Link from 'next/link'
import { useLanguage } from './LanguageProvider'
import MobileFilterButton from './MobileFilterButton'
import MobileFilters from './MobileFilters'
import FloatingFilterButton from './FloatingFilterButton'
import { useFilteredProducts } from '@/hooks/useProducts'
import { getProductImage } from '@/utils/imageUtils'

// Empty array for skin care products - will be populated from database
const skinCareProducts: any[] = []

// Skin type quiz questions will be defined inside component

const categories = ['All', 'Cleansers', 'Serums', 'Moisturizers', 'Treatments', 'Exfoliators', 'Sunscreen', 'Masks', 'Toners']
const skinTypes = ['All Skin Types', 'Dry Skin', 'Oily Skin', 'Combination Skin', 'Acne-Prone', 'Mature Skin', 'Sensitive Skin']
const skinConcerns = ['All Concerns', 'Acne', 'Anti-aging', 'Brightening', 'Hydration', 'Oil Control', 'Pores', 'Texture', 'Dark Spots', 'Fine Lines']
const priceRanges = ['All Prices', 'Under $20', '$20-$50', '$50-$100', 'Over $100']
const ingredients = ['All Ingredients', 'Hyaluronic Acid', 'Retinol', 'Vitamin C', 'Niacinamide', 'Salicylic Acid', 'Ceramides']

const SkinCareProducts = () => {
  const { t } = useLanguage()
  
  // Create filters for skincare products
  const [filters, setFilters] = useState({
    category: 'Skincare',
    limit: 50
  });

  // Fetch filtered skincare products from database
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
  
  // Skin type quiz questions
  const skinQuizQuestions = [
    {
      id: 1,
      question: t('howDoesSkinFeel'),
      options: [
        { text: t('tightAndDry'), skinType: "Dry Skin" },
        { text: t('comfortable'), skinType: "Normal Skin" },
        { text: t('oilyAndShiny'), skinType: "Oily Skin" },
        { text: t('dryInSomeAreas'), skinType: "Combination Skin" }
      ]
    },
    {
      id: 2,
      question: t('howOftenBreakouts'),
      options: [
        { text: t('rarelyOrNever'), skinType: "Normal Skin" },
        { text: t('occasionally'), skinType: "Combination Skin" },
        { text: "Frequently", skinType: "Acne-Prone" },
        { text: t('onlyInSpecificAreas'), skinType: "Combination Skin" }
      ]
    }
  ]
  
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeSkinType, setActiveSkinType] = useState('All Skin Types')
  const [activeSkinConcern, setActiveSkinConcern] = useState('All Concerns')
  const [activePriceRange, setActivePriceRange] = useState('All Prices')
  const [activeIngredient, setActiveIngredient] = useState('All Ingredients')
  const [showFilters, setShowFilters] = useState(false)
  const [showSkinQuiz, setShowSkinQuiz] = useState(false)
  const [sortBy, setSortBy] = useState('Featured')
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<any[]>([])
  const [showAllProducts, setShowAllProducts] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Update filters when filter states change
  React.useEffect(() => {
    const newFilters: any = {
      category: 'Skincare',
      limit: 50
    };

    // Add category filter
    if (activeCategory !== 'All') {
      newFilters.category = activeCategory;
    }

    // Add skin type filter
    if (activeSkinType !== 'All Skin Types') {
      newFilters.skinType = activeSkinType;
    }

    // Add price range filter
    if (activePriceRange !== 'All Prices') {
      switch (activePriceRange) {
        case 'Under $20':
          newFilters.maxPrice = 20;
          break;
        case '$20-$50':
          newFilters.minPrice = 20;
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
  }, [activeCategory, activeSkinType, activePriceRange]);

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

  const handleQuizAnswer = (answer: any) => {
    const newAnswers = [...quizAnswers, answer]
    setQuizAnswers(newAnswers)
    
    if (currentQuizQuestion < skinQuizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1)
    } else {
      // Quiz completed - determine skin type
      const skinTypeCounts: Record<string, number> = {}
      newAnswers.forEach(answer => {
        skinTypeCounts[answer.skinType] = (skinTypeCounts[answer.skinType] || 0) + 1
      })
      const recommendedSkinType = Object.keys(skinTypeCounts).reduce((a, b) => 
        skinTypeCounts[a] > skinTypeCounts[b] ? a : b
      )
      setActiveSkinType(recommendedSkinType)
      setShowSkinQuiz(false)
      setCurrentQuizQuestion(0)
      setQuizAnswers([])
    }
  }

  // Calculate active filters count
  const activeFiltersCount = [
    activeCategory !== 'All' ? 1 : 0,
    activeSkinType !== 'All Skin Types' ? 1 : 0,
    activeSkinConcern !== 'All Concerns' ? 1 : 0,
    activePriceRange !== 'All Prices' ? 1 : 0,
    activeIngredient !== 'All Ingredients' ? 1 : 0
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
      title: 'Skin Type',
      key: 'skinType',
      options: skinTypes.map(type => ({ label: type, value: type })),
      value: activeSkinType,
      onChange: setActiveSkinType
    },
    {
      title: 'Skin Concern',
      key: 'skinConcern',
      options: skinConcerns.map(concern => ({ label: concern, value: concern })),
      value: activeSkinConcern,
      onChange: setActiveSkinConcern
    },
    {
      title: 'Price Range',
      key: 'priceRange',
      options: priceRanges.map(range => ({ label: range, value: range })),
      value: activePriceRange,
      onChange: setActivePriceRange
    },
    {
      title: 'Key Ingredients',
      key: 'ingredient',
      options: ingredients.map(ingredient => ({ label: ingredient, value: ingredient })),
      value: activeIngredient,
      onChange: setActiveIngredient
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
      <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl lg:text-6xl font-serif font-bold mb-6">
              {t('skinCare')}
            </h1>
            <p className="text-xl lg:text-2xl max-w-3xl mx-auto mb-8 text-gray-200">
              {t('footerDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowSkinQuiz(true)}
                className="btn-primary px-8 py-3 rounded-full inline-flex items-center gap-2"
              >
                <Zap size={20} />
                {t('takeSkinQuiz')}
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

      {/* Skin Quiz Modal */}
      {showSkinQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="text-center mb-6">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('skinTypeQuiz')}</h3>
                <p className="text-gray-600">{t('helpUsRecommend')}</p>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Question {currentQuizQuestion + 1} of {skinQuizQuestions.length}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuizQuestion + 1) / skinQuizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {skinQuizQuestions[currentQuizQuestion].question}
              </h4>
              
              <div className="space-y-3">
                {skinQuizQuestions[currentQuizQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(option)}
                    className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setShowSkinQuiz(false)}
              className="w-full btn-secondary"
            >
              Skip Quiz
            </button>
          </div>
        </div>
      )}

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
                  totalCount={skinCareProducts.length}
                />
              </div>
              {activeSkinType !== 'All Skin Types' && (
                <div className="flex items-center gap-1 sm:gap-2 bg-primary-100 text-primary-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  <Award size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Recommended for {activeSkinType}</span>
                  <span className="sm:hidden">Recommended</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('skinType')}</label>
                <select
                  value={activeSkinType}
                  onChange={(e) => setActiveSkinType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {skinTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skin Concern</label>
                <select
                  value={activeSkinConcern}
                  onChange={(e) => setActiveSkinConcern(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {skinConcerns.map((concern) => (
                    <option key={concern} value={concern}>{concern}</option>
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
                  {priceRanges.map((range) => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('keyIngredients')}</label>
                <select
                  value={activeIngredient}
                  onChange={(e) => setActiveIngredient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {ingredients.map((ingredient) => (
                    <option key={ingredient} value={ingredient}>{ingredient}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('brands')}</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Brands</option>
                  <option value="the-ordinary">The Ordinary</option>
                  <option value="cerave">CeraVe</option>
                  <option value="la-roche-posay">La Roche-Posay</option>
                  <option value="paulas-choice">Paula&apos;s Choice</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count and Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <p className="text-gray-600">
              Showing {displayedProducts.length} of {skinCareProducts.length} products
            </p>
            {activeSkinType !== 'All Skin Types' && (
              <p className="text-sm text-primary-600 mt-1">
                                  {t('personalizedRecommendations')} {activeSkinType}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              <Award size={14} />
              Dermatologist Recommended
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              <Sparkles size={14} />
              Clean Beauty
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
              <TrendingUp size={14} />
              Trending
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
                  {mapProductToCardProps(product).isNew && (
                    <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {t('new')}
                    </span>
                  )}
                  {mapProductToCardProps(product).isTrending && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      TRENDING
                    </span>
                  )}
                  {mapProductToCardProps(product).dermatologistRecommended && (
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      DR RECOMMENDED
                    </span>
                  )}
                  {mapProductToCardProps(product).crueltyFree && (
                    <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      CRUELTY FREE
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
                <Zap size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Skincare Products Found</h3>
              <p className="text-gray-600 mb-6">
                {error ? 'Unable to load products at the moment. Please try again later.' : 
                 'We couldn&apos;t find any skincare products matching your criteria.'}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setActiveCategory('All')
                    setActiveSkinType('All Skin Types')
                    setActiveSkinConcern('All Concerns')
                    setActivePriceRange('All Prices')
                    setActiveIngredient('All Ingredients')
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
              {t('browseProducts')}
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
          setActiveSkinType('All Skin Types')
          setActiveSkinConcern('All Concerns')
          setActivePriceRange('All Prices')
          setActiveIngredient('All Ingredients')
          setSortBy('Featured')
        }}
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        resultsCount={displayedProducts.length}
        totalCount={skinCareProducts.length}
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

export default SkinCareProducts 