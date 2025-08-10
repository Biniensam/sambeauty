'use client'

import React, { useState } from 'react'
import { ArrowRight, Filter, Star, ChevronDown, Heart, ShoppingBag, Eye, Clock, Award, Sparkles, TrendingUp, Zap, Scissors, Palette, Loader2, Search } from 'lucide-react'
import ProductCard from './ProductCard'
import Link from 'next/link'
import { useLanguage } from './LanguageProvider'
import MobileFilterButton from './MobileFilterButton'
import MobileFilters from './MobileFilters'
import FloatingFilterButton from './FloatingFilterButton'
import { useFilteredProducts } from '@/hooks/useProducts'
import { getProductImage } from '@/utils/imageUtils'

// Hair product data will be fetched from database

// Hair type quiz questions
const hairQuizQuestions = [
  {
    id: 1,
    question: "What's your hair texture?",
    options: [
      { text: "Fine and thin", hairType: "Fine Hair" },
      { text: "Medium thickness", hairType: "Medium Hair" },
      { text: "Thick and coarse", hairType: "Thick Hair" }
    ]
  },
  {
    id: 2,
    question: "How would you describe your hair pattern?",
    options: [
      { text: "Straight", hairType: "Straight Hair" },
      { text: "Wavy", hairType: "Wavy Hair" },
      { text: "Curly", hairType: "Curly Hair" },
      { text: "Coily/Kinky", hairType: "Coily Hair" }
    ]
  },
  {
    id: 3,
    question: "What's your biggest hair concern?",
    options: [
      { text: "Damage and breakage", hairType: "Damaged Hair" },
      { text: "Dryness and frizz", hairType: "Dry Hair" },
      { text: "Oil and greasiness", hairType: "Oily Hair" },
      { text: "Thinning and loss", hairType: "Thinning Hair" }
    ]
  }
]

const HairProducts = () => {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeHairType, setActiveHairType] = useState('All Hair Types')
  const [activeHairConcern, setActiveHairConcern] = useState('All Concerns')
  const [activeHairTexture, setActiveHairTexture] = useState('All Textures')
  const [activePriceRange, setActivePriceRange] = useState('All Prices')
  const [showFilters, setShowFilters] = useState(false)
  const [showHairQuiz, setShowHairQuiz] = useState(false)
  const [sortBy, setSortBy] = useState('Featured')
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<any[]>([])
  const [showAllProducts, setShowAllProducts] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Create filters for hair products
  const [filters, setFilters] = useState({
    category: 'Hair Care',
    limit: 50
  });

  // Fetch filtered hair products from database
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
    skinType: product.skinType,
    benefits: product.benefits,
    inStock: product.inStock,
    category: product.category,
    productType: product.productType,
    hairType: product.hairType,
    hairConcern: product.hairConcern,
    hairTexture: product.hairTexture,
    crueltyFree: product.crueltyFree,
    cleanBeauty: product.cleanBeauty,
    salonProfessional: product.salonProfessional,
    sulfateFree: product.sulfateFree,
    heatProtection: product.heatProtection,
    isTrending: product.isTrending
  })

  // Update filters when filter states change
  React.useEffect(() => {
    const newFilters: any = {
      category: 'Hair Care',
      limit: 50
    };

    // Add category filter
    if (activeCategory !== 'All') {
      newFilters.category = activeCategory;
    }

    // Add hair type filter
    if (activeHairType !== 'All Hair Types') {
      newFilters.hairType = activeHairType;
    }

    // Add price range filter
    if (activePriceRange !== 'All Prices') {
      switch (activePriceRange) {
        case 'Under $30':
          newFilters.maxPrice = 30;
          break;
        case '$30-$60':
          newFilters.minPrice = 30;
          newFilters.maxPrice = 60;
          break;
        case '$60-$150':
          newFilters.minPrice = 60;
          newFilters.maxPrice = 150;
          break;
        case 'Over $150':
          newFilters.minPrice = 150;
          break;
      }
    }

    setFilters(newFilters);
  }, [activeCategory, activeHairType, activePriceRange]);

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
    
    if (currentQuizQuestion < hairQuizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1)
    } else {
      // Quiz completed - determine hair type
      const hairTypeCounts: Record<string, number> = {}
      newAnswers.forEach(answer => {
        hairTypeCounts[answer.hairType] = (hairTypeCounts[answer.hairType] || 0) + 1
      })
      const recommendedHairType = Object.keys(hairTypeCounts).reduce((a, b) => 
        hairTypeCounts[a] > hairTypeCounts[b] ? a : b
      )
      setActiveHairType(recommendedHairType)
      setShowHairQuiz(false)
      setCurrentQuizQuestion(0)
      setQuizAnswers([])
    }
  }

  // Use exact product data strings for filter options to fix filtering
  const categories = [
    'All', 'Shampoo', 'Conditioner', 'Masks', 'Treatments',
    'Oils', 'Styling', 'Dry Shampoo', 'Tools', 'Heat Protection'
  ]
  const hairTypes = [
    'All Hair Types', 'Fine Hair', 'Medium Hair', 'Thick Hair',
    'Straight Hair', 'Wavy Hair', 'Curly Hair', 'Coily Hair',
    'Damaged Hair', 'Dry Hair', 'Oily Hair', 'Thinning Hair'
  ]
  const hairConcerns = [
    'All Concerns', 'Damage Repair', 'Hydration', 'Frizz Control', 'Volume',
    'Shine', 'Hair Growth', 'Curl Definition', 'Oil Control', 'Heat Protection', 'Bond Building'
  ]
  const hairTextures = ['All Textures', 'Fine', 'Medium', 'Thick']
  const priceRanges = ['All Prices', 'Under $30', '$30-$60', '$60-$150', 'Over $150']

  // Calculate active filters count
  const activeFiltersCount = [
    activeCategory !== 'All' ? 1 : 0,
    activeHairType !== 'All Hair Types' ? 1 : 0,
    activeHairConcern !== 'All Concerns' ? 1 : 0,
    activeHairTexture !== 'All Textures' ? 1 : 0,
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
      title: 'Hair Type',
      key: 'hairType',
      options: hairTypes.map(type => ({ label: type, value: type })),
      value: activeHairType,
      onChange: setActiveHairType
    },
    {
      title: 'Hair Concern',
      key: 'hairConcern',
      options: hairConcerns.map(concern => ({ label: concern, value: concern })),
      value: activeHairConcern,
      onChange: setActiveHairConcern
    },
    {
      title: 'Hair Texture',
      key: 'hairTexture',
      options: hairTextures.map(texture => ({ label: texture, value: texture })),
      value: activeHairTexture,
      onChange: setActiveHairTexture
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
      <section className="bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl lg:text-6xl font-serif font-bold mb-6">
              {t('professionalHairCare')}
            </h1>
            <p className="text-xl lg:text-2xl max-w-3xl mx-auto mb-8 text-gray-200">
              {t('transformYourHair')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowHairQuiz(true)}
                className="btn-primary px-8 py-3 rounded-full inline-flex items-center gap-2"
              >
                <Scissors size={20} />
                {t('hairTypeQuiz')}
              </button>
              <button
                onClick={() => setShowAllProducts(true)}
                className="btn-secondary px-8 py-3 rounded-full"
              >
                {t('viewAllProducts')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hair Quiz Modal */}
      {showHairQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Hair Type Quiz</h3>
              <p className="text-gray-600">Discover your perfect hair care routine</p>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Question {currentQuizQuestion + 1} of {hairQuizQuestions.length}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuizQuestion + 1) / hairQuizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {hairQuizQuestions[currentQuizQuestion].question}
              </h4>
              
              <div className="space-y-3">
                {hairQuizQuestions[currentQuizQuestion].options.map((option, index) => (
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
              onClick={() => setShowHairQuiz(false)}
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
                  totalCount={availableProducts.length}
                />
              </div>
              {activeHairType !== 'All Hair Types' && (
                <div className="flex items-center gap-1 sm:gap-2 bg-primary-100 text-primary-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  <Award size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Recommended for {activeHairType}</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Hair Type</label>
                <select
                  value={activeHairType}
                  onChange={(e) => setActiveHairType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {hairTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hair Concern</label>
                <select
                  value={activeHairConcern}
                  onChange={(e) => setActiveHairConcern(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {hairConcerns.map((concern) => (
                    <option key={concern} value={concern}>{concern}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hair Texture</label>
                <select
                  value={activeHairTexture}
                  onChange={(e) => setActiveHairTexture(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {hairTextures.map((texture) => (
                    <option key={texture} value={texture}>{texture}</option>
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
            </div>
          )}
        </div>

        {/* Results Count and Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <p className="text-gray-600">
              Showing {displayedProducts.length} of {availableProducts.length} products
            </p>
            {activeHairType !== 'All Hair Types' && (
              <p className="text-sm text-primary-600 mt-1">
                {t('personalizedRecommendations')} {activeHairType}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              <Award size={14} />
              Salon Professional
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              <Sparkles size={14} />
              Clean Beauty
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
              <TrendingUp size={14} />
              Trending
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              <Palette size={14} />
              Styling Tools
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="animate-spin mx-auto mb-4" size={32} />
            <p className="text-gray-500">Loading hair products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Hair Products</h3>
              <p className="text-gray-600 mb-6">
                We're having trouble loading hair care products at the moment. Please try again later.
              </p>
              <button onClick={() => window.location.reload()} className="btn-primary w-full">
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
                
                {/* Product Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {mapProductToCardProps(product).isNew && (
                    <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      NEW
                    </span>
                  )}
                  {mapProductToCardProps(product).isTrending && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      TRENDING
                    </span>
                  )}
                  {mapProductToCardProps(product).salonProfessional && (
                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      SALON PRO
                    </span>
                  )}
                  {mapProductToCardProps(product).crueltyFree && (
                    <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      CRUELTY FREE
                    </span>
                  )}
                  {mapProductToCardProps(product).cleanBeauty && (
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      CLEAN
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Scissors size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Hair Products Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any hair care products matching your criteria.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setActiveCategory('All')
                    setActiveHairType('All Hair Types')
                    setActiveHairConcern('All Concerns')
                    setActiveHairTexture('All Textures')
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
        ) : null}

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
          setActiveHairType('All Hair Types')
          setActiveHairConcern('All Concerns')
          setActiveHairTexture('All Textures')
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

export default HairProducts 