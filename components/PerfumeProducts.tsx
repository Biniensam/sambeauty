'use client'

import React, { useState } from 'react'
import { ArrowRight, Filter, Star, ChevronDown, Heart, ShoppingBag, Eye, Clock, Award, Sparkles, TrendingUp, Zap, Palette, Camera, Loader2, Search } from 'lucide-react'
import ProductCard from './ProductCard'
import Link from 'next/link'
import { useLanguage } from './LanguageProvider'
import MobileFilterButton from './MobileFilterButton'
import MobileFilters from './MobileFilters'
import FloatingFilterButton from './FloatingFilterButton'
import { useFilteredProducts } from '@/hooks/useProducts'
import { getProductImage } from '@/utils/imageUtils'

// Perfume product data will be fetched from database

// Perfume finder questions
const perfumeFinderQuestions = [
  {
    id: 1,
    question: "What fragrance family do you prefer?",
    options: [
      { text: "Floral - Romantic and feminine", fragranceFamily: "Floral" },
      { text: "Citrus - Fresh and energizing", fragranceFamily: "Citrus" },
      { text: "Woody - Sophisticated and warm", fragranceFamily: "Woody" },
      { text: "Oriental - Exotic and mysterious", fragranceFamily: "Oriental" }
    ]
  },
  {
    id: 2,
    question: "What concentration level do you prefer?",
    options: [
      { text: "Eau de Cologne - Light and refreshing", concentration: "Eau de Cologne" },
      { text: "Eau de Toilette - Balanced and versatile", concentration: "Eau de Toilette" },
      { text: "Eau de Parfum - Rich and long-lasting", concentration: "Eau de Parfum" },
      { text: "Parfum - Intense and rich", concentration: "Parfum" }
    ]
  },
  {
    id: 3,
    question: "What season or occasion?",
    options: [
      { text: "Spring/Summer - Fresh and light", season: "Spring" },
      { text: "Fall/Winter - Warm and cozy", season: "Winter" },
      { text: "Evening/Date night - Elegant and sensual", season: "Evening" },
      { text: "Everyday/Versatile - Comfortable and easy", season: "All Seasons" }
    ]
  }
]

const categories = ['All', 'Floral', 'Citrus', 'Woody', 'Oriental', 'Fresh', 'Aquatic', 'Gourmand', 'Chypre']
const fragranceFamilies = ['All Families', 'Floral', 'Citrus', 'Woody', 'Oriental', 'Fresh', 'Aquatic', 'Gourmand', 'Chypre']
const concentrations = ['All Concentrations', 'Eau de Cologne', 'Eau de Toilette', 'Eau de Parfum', 'Parfum']
const seasons = ['All Seasons', 'Spring', 'Summer', 'Fall', 'Winter', 'Evening', 'All Seasons']
const priceRanges = ['All Prices', 'Under $50', '$50-$80', '$80-$120', 'Over $120']

const PerfumeProducts = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeFragranceFamily, setActiveFragranceFamily] = useState('All Families')
  const [activeConcentration, setActiveConcentration] = useState('All Concentrations')
  const [activeSeason, setActiveSeason] = useState('All Seasons')
  const [activePriceRange, setActivePriceRange] = useState('All Prices')
  const [showFilters, setShowFilters] = useState(false)
  const [showPerfumeFinder, setShowPerfumeFinder] = useState(false)
  const [sortBy, setSortBy] = useState('Featured')
  const [currentFinderQuestion, setCurrentFinderQuestion] = useState(0)
  const [finderAnswers, setFinderAnswers] = useState<any[]>([])
  const [showAllProducts, setShowAllProducts] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const { t } = useLanguage()

  // Create filters for perfume products
  const [filters, setFilters] = useState({
    category: 'perfume',
    limit: 50
  });

  // Fetch filtered perfume products from database
  const { products: perfumeProducts, loading, error } = useFilteredProducts(filters)

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
    fragranceFamily: product.fragranceFamily,
    concentration: product.concentration,
    season: product.season,
    crueltyFree: product.crueltyFree,
    luxury: product.luxury,
    longLasting: product.longLasting,
    cleanBeauty: product.cleanBeauty,
    isTrending: product.isTrending
  })

  // Update filters when filter states change
  React.useEffect(() => {
    const newFilters: any = {
      category: 'perfume',
      limit: 50
    };

    // Add category filter
    if (activeCategory !== 'All') {
      newFilters.category = activeCategory;
    }

    // Add price range filter
    if (activePriceRange !== 'All Prices') {
      switch (activePriceRange) {
        case 'Under $50':
          newFilters.maxPrice = 50;
          break;
        case '$50-$80':
          newFilters.minPrice = 50;
          newFilters.maxPrice = 80;
          break;
        case '$80-$120':
          newFilters.minPrice = 80;
          newFilters.maxPrice = 120;
          break;
        case 'Over $120':
          newFilters.minPrice = 120;
          break;
      }
    }

    setFilters(newFilters);
  }, [activeCategory, activePriceRange]);

  // Use the filtered products directly from the database
  const filteredProducts = perfumeProducts;

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
    activeFragranceFamily !== 'All Families' ? 1 : 0,
    activeConcentration !== 'All Concentrations' ? 1 : 0,
    activeSeason !== 'All Seasons' ? 1 : 0,
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
      title: 'Fragrance Family',
      key: 'fragranceFamily',
      options: fragranceFamilies.map(family => ({ label: family, value: family })),
      value: activeFragranceFamily,
      onChange: setActiveFragranceFamily
    },
    {
      title: 'Concentration',
      key: 'concentration',
      options: concentrations.map(conc => ({ label: conc, value: conc })),
      value: activeConcentration,
      onChange: setActiveConcentration
    },
    {
      title: 'Season',
      key: 'season',
      options: seasons.map(season => ({ label: season, value: season })),
      value: activeSeason,
      onChange: setActiveSeason
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

  const handleFinderAnswer = (answer: any) => {
    const newAnswers = [...finderAnswers, answer]
    setFinderAnswers(newAnswers)
    
    if (currentFinderQuestion < perfumeFinderQuestions.length - 1) {
      setCurrentFinderQuestion(currentFinderQuestion + 1)
    } else {
      // Perfume finder completed - determine preferences
      const fragranceFamilyAnswer = newAnswers.find(a => a.fragranceFamily)?.fragranceFamily
      const concentrationAnswer = newAnswers.find(a => a.concentration)?.concentration
      const seasonAnswer = newAnswers.find(a => a.season)?.season
      
      if (fragranceFamilyAnswer) setActiveFragranceFamily(fragranceFamilyAnswer)
      if (concentrationAnswer) setActiveConcentration(concentrationAnswer)
      if (seasonAnswer) setActiveSeason(seasonAnswer)
      
      setShowPerfumeFinder(false)
      setCurrentFinderQuestion(0)
      setFinderAnswers([])
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl lg:text-6xl font-serif font-bold mb-6">
              {t('Perfume')}
            </h1>
            <p className="text-xl lg:text-2xl max-w-3xl mx-auto mb-8 text-gray-200">
              {t('discoverExquisitePerfumes')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowPerfumeFinder(true)}
                className="btn-primary px-8 py-3 rounded-full inline-flex items-center gap-2"
              >
                <Palette size={20} />
                {t('findMyScent')}
              </button>
              <button className="btn-secondary px-8 py-3 rounded-full">
                {t('viewAllProducts')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Perfume Finder Modal */}
      {showPerfumeFinder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Scent</h3>
              <p className="text-gray-600">Discover fragrances that match your personality</p>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Question {currentFinderQuestion + 1} of {perfumeFinderQuestions.length}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentFinderQuestion + 1) / perfumeFinderQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {perfumeFinderQuestions[currentFinderQuestion].question}
              </h4>
              
              <div className="space-y-3">
                {perfumeFinderQuestions[currentFinderQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleFinderAnswer(option)}
                    className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setShowPerfumeFinder(false)}
              className="w-full btn-secondary"
            >
              Skip Perfume Finder
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
                  totalCount={perfumeProducts.length}
                />
              </div>
              {(activeFragranceFamily !== 'All Families' || activeConcentration !== 'All Concentrations' || activeSeason !== 'All Seasons') && (
                <div className="flex items-center gap-1 sm:gap-2 bg-primary-100 text-primary-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  <Palette size={12} className="sm:w-3.5 sm:h-3.5" />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Fragrance Family</label>
                <select
                  value={activeFragranceFamily}
                  onChange={(e) => setActiveFragranceFamily(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {fragranceFamilies.map((family) => (
                    <option key={family} value={family}>{family}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Concentration</label>
                <select
                  value={activeConcentration}
                  onChange={(e) => setActiveConcentration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {concentrations.map((concentration) => (
                    <option key={concentration} value={concentration}>{concentration}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                <select
                  value={activeSeason}
                  onChange={(e) => setActiveSeason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {seasons.map((season) => (
                    <option key={season} value={season}>{season}</option>
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
              Showing {displayedProducts.length} of {perfumeProducts.length} products
            </p>
            {(activeFragranceFamily !== 'All Families' || activeConcentration !== 'All Concentrations' || activeSeason !== 'All Seasons') && (
              <p className="text-sm text-primary-600 mt-1">
                {t('personalizedRecommendations')}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
              <Award size={14} />
              {t('Perfume')}
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              <Sparkles size={14} />
              Long Lasting
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
              <TrendingUp size={14} />
              Trending
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              <Palette size={14} />
              Cruelty Free
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="animate-spin mx-auto mb-4" size={32} />
            <p className="text-gray-500">Loading perfume products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Perfume Products</h3>
              <p className="text-gray-600 mb-6">
                We&apos;re having trouble loading perfume products at the moment. Please try again later.
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
            {displayedProducts.map((product) => (
              <div key={product._id} className="group relative">
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

                  {mapProductToCardProps(product).crueltyFree && (
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      CRUELTY FREE
                    </span>
                  )}
                  {mapProductToCardProps(product).longLasting && (
                    <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      LONG LASTING
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
                <Palette size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Perfume Products Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn&apos;t find any perfume products matching your criteria.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setActiveCategory('All')
                    setActiveFragranceFamily('All Families')
                    setActiveConcentration('All Concentrations')
                    setActiveSeason('All Seasons')
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
                Load More Products
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
          setActiveFragranceFamily('All Families')
          setActiveConcentration('All Concentrations')
          setActiveSeason('All Seasons')
          setActivePriceRange('All Prices')
          setSortBy('Featured')
        }}
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        resultsCount={displayedProducts.length}
        totalCount={perfumeProducts.length}
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

export default PerfumeProducts
