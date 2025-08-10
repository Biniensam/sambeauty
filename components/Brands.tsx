'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from './LanguageProvider'
import { 
  Star, 
  Heart, 
  ArrowRight, 
  TrendingUp, 
  Award,  
  Sparkles,
  Filter,
  Search
} from 'lucide-react'

// Featured brands will be fetched from database

// All brands categorized
const allBrands = [
  {
    category: 'Makeup',
    brands: [
      { name: 'Pat McGrath Labs', rating: 4.9, followers: '2.1M', isNew: true },
      { name: 'Charlotte Tilbury', rating: 4.8, followers: '1.8M', isSale: true },
      { name: 'Hourglass', rating: 4.7, followers: '1.2M' },
      { name: 'Tom Ford Beauty', rating: 4.6, followers: '950K' },
      { name: 'Yves Saint Laurent', rating: 4.8, followers: '1.5M' }
    ]
  },
  {
    category: 'Skincare',
    brands: [
      { name: 'Drunk Elephant', rating: 4.7, followers: '1.5M', isTrending: true },
      { name: 'The Ordinary', rating: 4.6, followers: '2.8M' },
      { name: 'CeraVe', rating: 4.8, followers: '1.9M' },
      { name: 'La Roche-Posay', rating: 4.7, followers: '1.3M' },
      { name: 'Paula\'s Choice', rating: 4.8, followers: '1.1M' }
    ]
  },
  {
    category: 'Hair Care',
    brands: [
      { name: 'Olaplex', rating: 4.9, followers: '3.2M', isPopular: true },
      { name: 'Briogeo', rating: 4.6, followers: '890K' },
      { name: 'Ouai', rating: 4.5, followers: '1.2M' },
      { name: 'Living Proof', rating: 4.7, followers: '1.4M' },
      { name: 'Gisou', rating: 4.4, followers: '750K' }
    ]
  },
  {
    category: 'Perfume',
    brands: [
      { name: 'Jo Malone London', rating: 4.8, followers: '1.6M' },
      { name: 'Diptyque', rating: 4.7, followers: '1.1M' },
      { name: 'Byredo', rating: 4.9, followers: '980K' },
      { name: 'Le Labo', rating: 4.8, followers: '1.3M' },
      { name: 'Maison Margiela', rating: 4.6, followers: '850K' }
    ]
  }
]

// Categories for navigation

const Brands = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const { t } = useLanguage()

  // Categories for navigation with translations
  const categories = [
    {
      id: 1,
      name: t('skinCare'),
      description: t('exploreSkincareProducts'),
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
      href: '/skin-care',
      productCount: 245,
      featuredBrands: ['Drunk Elephant', 'The Ordinary', 'CeraVe']
    },
    {
      id: 2,
      name: t('makeUp'),
      description: t('discoverMakeupTrends'),
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
      href: '/makeup',
      productCount: 189,
      featuredBrands: ['Pat McGrath Labs', 'Charlotte Tilbury', 'Hourglass']
    },
    {
      id: 3,
      name: t('hair'),
      description: t('findHairCareProducts'),
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
      href: '/hair',
      productCount: 156,
      featuredBrands: ['Olaplex', 'Briogeo', 'Ouai']
    },
    {
      id: 4,
      name: t('Perfume'),
      description: t('shopPerfumeCollection'),
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
      href: '/perfume',
      productCount: 98,
      featuredBrands: ['Jo Malone London', 'Diptyque', 'Byredo']
    },
  ]

  const filteredBrands = allBrands
    .filter(category => activeCategory === 'All' || category.category === activeCategory)
    .map(category => ({
      ...category,
      brands: category.brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.brands.length > 0)

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
              {t('discoverExquisitePerfumes')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-80 pl-10 pr-4 py-3 rounded-full border-0 focus:ring-2 focus:ring-white/50 text-gray-900"
                />
              </div>
              <button className="btn-primary px-8 py-3 rounded-full">
                {t('allBrands')}
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
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
                className="group relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
          >
                <div className="relative h-64 overflow-hidden">
            <img
              src={category.image}
              alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  {/* Product Count Badge */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium">{category.productCount} {t('products')}</span>
                  </div>

                  {/* Featured Brands */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex -space-x-2 mb-2">
                      {category.featuredBrands.slice(0, 3).map((brand, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-xs font-medium text-gray-900"
                        >
                          {brand.charAt(0)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex flex-col justify-center items-center text-center p-4">
                  <h3 className="text-white text-2xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-white/90 text-sm mb-4">{category.description}</p>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <span>{category.featuredBrands.length} {t('featuredBrands')}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
            </div>
          </Link>
        ))}
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
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter size={16} />
                  {t('filters')}
                </button>
              </div>
            </div>

          {/* Category Filter */}
          {showFilters && (
            <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-wrap gap-2">
                {['All', 'Makeup', 'Skincare', 'Hair Care', 'Perfume'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredBrands.length > 0 ? (
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
                      <div key={index} className="group p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {brand.name}
                          </h4>
                          {"isNew" in brand && brand.isNew ? (
                            <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full">
                              NEW
                            </span>
                          ) : null}
                          {"isSale" in brand && brand.isSale ? (
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                              SALE
                            </span>
                          ) : null}
                          {"isTrending" in brand && brand.isTrending ? (
                            <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                              <TrendingUp size={12} />
                            </span>
                          ) : null}
                          {"isPopular" in brand && brand.isPopular ? (
                            <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                              <Sparkles size={12} />
                            </span>
                          ) : null}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Star size={14} className="text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900">{brand.rating}</span>
                          <span className="text-xs text-gray-500">({brand.followers})</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            Shop
                          </button>
                          <button className="text-gray-400 hover:text-red-500">
                            <Heart size={16} />
                          </button>
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
              <p className="text-gray-500 max-w-md text-center mb-6">Try adjusting your search terms or filters to find what you're looking for.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('All');
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Clear Search & Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Brands
