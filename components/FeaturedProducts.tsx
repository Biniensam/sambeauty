'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight, Filter, Star, Sparkles, Heart, ShoppingBag, Clock, Tag, TrendingUp, Loader2, Eye } from 'lucide-react'
import ProductCard from './ProductCard'
import Link from 'next/link'
import { useFeaturedProducts, useNewArrivals, useBestSellers, useSaleProducts } from '@/hooks/useProducts'
import { getProductImage } from '@/utils/imageUtils'

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [activePromo, setActivePromo] = useState(0)

  // Promotional campaigns
  const promotionalCampaigns = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop',
      alt: 'Hair',
      title: 'Hair',
      subtitle: 'Exclusive Beauty Box',
      description: 'Discover our curated collection of premium beauty essentials',
      badge: 'NEW',
      badgeColor: 'bg-pink-500',
      gradient: 'from-pink-500 to-purple-600',
      timeLeft: '2 days left',
      discount: '30% OFF'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop',
      alt: 'Make Up',
      title: 'Make Up',
      subtitle: 'Up to 50% Off',
      description: 'Beat the heat with our refreshing summer beauty collection',
      badge: 'HOT',
      badgeColor: 'bg-orange-500',
      gradient: 'from-orange-500 to-red-600',
      timeLeft: '5 days left',
      discount: '50% OFF'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=400&fit=crop',
      alt: 'Skin Care',
      title: 'Skin Care',
      subtitle: 'Fresh Beauty Finds',
      description: 'Be the first to try our latest beauty innovations',
      badge: 'TRENDING',
      badgeColor: 'bg-blue-500',
      gradient: 'from-blue-500 to-cyan-600',
      timeLeft: '1 week left',
      discount: '20% OFF'
    }
  ]

  const categories = ['All', 'New In', 'Trending', 'Cult Picks']

  // Set initial active category
  useEffect(() => {
    setActiveCategory('All')
  }, [])

  // Fetch products from API
  const { products: featuredProducts, loading: featuredLoading, error: featuredError } = useFeaturedProducts(8)
  const { products: newArrivals, loading: newLoading, error: newError } = useNewArrivals(8)
  const { products: bestSellers, loading: bestLoading, error: bestError } = useBestSellers(8)
  const { products: saleProducts, loading: saleLoading, error: saleError } = useSaleProducts(8)

  // Combine all products for filtering
  const allProducts = [
    ...featuredProducts,
    ...newArrivals,
    ...bestSellers,
    ...saleProducts
  ]

  // Remove duplicates based on _id
  const uniqueProducts = allProducts.filter((product, index, self) => 
    index === self.findIndex(p => p._id === product._id)
  )

  // Use API data only
  const availableProducts = uniqueProducts

  const filteredProducts = activeCategory === 'All' 
    ? availableProducts 
    : availableProducts.filter(product => {
        if (activeCategory === 'New In') return product.isNew
        if (activeCategory === 'Trending') return product.rating >= 4.7
        if (activeCategory === 'Cult Picks') return product.reviewCount > 200
        return true
      })

  // Check if any API is loading
  const isLoading = featuredLoading || newLoading || bestLoading || saleLoading

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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Promotional Campaigns Section */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                         <div>
               <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
                 Special Offers & Campaigns
               </h2>
               <p className="text-lg text-gray-600 max-w-2xl">
                 Don't miss out on our exclusive deals and limited-time offers. Shop now before they're gone!
               </p>
             </div>
            <div className="mt-4 lg:mt-0">
              <div className="flex gap-2">
                {promotionalCampaigns.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActivePromo(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activePromo 
                        ? 'bg-primary-600 scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Promotional Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {promotionalCampaigns.map((campaign, index) => (
              <div 
                key={campaign.id} 
                className={`group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 transform hover:scale-105 ${
                  index === activePromo ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                {/* Background Image */}
                <img
                  src={campaign.image}
                  alt={campaign.alt}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent`} />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  {/* Top Section */}
                  <div className="flex justify-between items-start">
                    <div className={`${campaign.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                      {campaign.badge}
                    </div>
                    <div className="text-right">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-white text-sm font-bold">{campaign.discount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{campaign.title}</h3>
                      <p className="text-lg text-gray-200 mb-2">{campaign.subtitle}</p>
                      <p className="text-sm text-gray-300">{campaign.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/80">
                        <Clock size={16} />
                        <span className="text-sm">{campaign.timeLeft}</span>
                      </div>
                      <button 
                        onClick={() => {
                          let url = '/products'
                          if (campaign.title.toLowerCase().includes('new')) {
                            url = '/products?filter=new'
                          } else if (campaign.title.toLowerCase().includes('skin')) {
                            url = '/skin-care'
                          } else if (campaign.title.toLowerCase().includes('makeup')) {
                            url = '/makeup'
                          } else if (campaign.title.toLowerCase().includes('perfume')) {
                            url = '/perfume'
                          } else if (campaign.title.toLowerCase().includes('hair')) {
                            url = '/hair'
                          } else if (campaign.title.toLowerCase().includes('trending')) {
                            url = '/new-trending'
                          }
                          window.location.href = url
                        }}
                        className={`bg-gradient-to-r ${campaign.gradient} text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                      >
                                                 SHOP NOW
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 left-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20">
                    <Heart size={16} className="text-white" />
                  </div>
                </div>
                
                <div className="absolute top-4 right-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20">
                    <ShoppingBag size={16} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
                     <div>
             <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
               Featured Products
             </h2>
             <p className="text-lg text-gray-600 max-w-2xl">
               Discover the latest beauty innovations and customer favorites, carefully curated for your perfect routine.
             </p>
           </div>
          
          <div className="mt-6 lg:mt-0 flex items-center gap-4">
            {/* Filter button for mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              aria-label="Toggle filters"
            >
                               <Filter size={16} />
                 Filters
            </button>
            
            <Link 
              href="/products" 
              className="btn-primary inline-flex items-center gap-2"
            >
                             View All
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Category Filters */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block mb-8`}>
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
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
        ) : filteredProducts.length > 0 ? (
          <div className="grid-responsive">
            {filteredProducts.map((product) => (
              <ProductCard
                key={mapProductToCardProps(product).id}
                {...mapProductToCardProps(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Sparkles size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Products Available</h3>
              <p className="text-gray-600 mb-6">
                We're currently updating our featured products. Please check back soon for the latest beauty essentials.
              </p>
              <div className="space-y-3">
                <Link href="/products">
                  <button className="btn-primary w-full">
                    Browse All Products
                  </button>
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-secondary w-full"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Advertisement Section - Always After Products */}
        {filteredProducts.length > 0 && (
          <div className="mt-12">
            <div className="grid-responsive">
              <div className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src="https://tartecosmetics.com/cdn/shop/files/concealer-category-5.jpg?v=1747324797"
                    alt="Tarte Cosmetics Advertisement"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                {/* Promotional Text */}
                <div className="p-4 text-center">
                  <p className="text-lg font-bold text-pink-600 tracking-wide">
                    CLEAN YOUR FACE
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Link href="/products">
            <button className="btn-secondary inline-flex items-center gap-2">
              Load More Products
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts 