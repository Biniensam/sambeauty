'use client'

import React, { useState } from 'react'
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react'
import Link from 'next/link'
import { useCart } from './CartContext'
import { useFavorites } from './FavoritesContext'
import ProductQuickView from './ProductQuickView'
import { useLanguage } from './LanguageProvider'
import { getProductImage } from '@/utils/imageUtils'

interface ProductCardProps {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  isNew?: boolean
  isSale?: boolean
  discount?: number
  description?: string
  size?: string
  skinType?: string
  benefits?: string[]
  inStock?: boolean
  category?: string
  productType?: string
  skinTone?: string[]
  finish?: string[]
  skinConcern?: string[]
  ingredients?: string[]
  hairType?: string[]
  hairConcern?: string[]
  hairTexture?: string[]
  fragranceFamily?: string
  concentration?: string
  season?: string
  crueltyFree?: boolean
  vegan?: boolean
  luxury?: boolean
  cleanBeauty?: boolean
  dermatologistRecommended?: boolean
  salonProfessional?: boolean
  heatProtection?: boolean
  longLasting?: boolean
  isTrending?: boolean
  broadSpectrum?: boolean
}

const ProductCard = ({
  id,
  name,
  brand,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  isNew = false,
  isSale = false,
  discount,
  description,
  size,
  skinType,
  benefits,
  inStock,
  category,
  productType,
  skinTone,
  finish,
  skinConcern,
  ingredients,
  hairType,
  hairConcern,
  hairTexture,
  fragranceFamily,
  concentration,
  season,
  crueltyFree,
  vegan,
  luxury,
  cleanBeauty,
  dermatologistRecommended,
  salonProfessional,
  heatProtection,
  longLasting,
  isTrending,
  broadSpectrum
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  
  const { addItem } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { t } = useLanguage()

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      brand,
      price,
      image,
    })
  }

  const handleToggleWishlist = () => {
    if (isFavorite(id)) {
      removeFavorite(id)
    } else {
      addFavorite({
        id,
        name,
        brand,
        price,
        image,
      })
    }
  }

  const handleQuickView = () => {
    setShowQuickView(true)
  }

  const getProductUrl = () => {
    // For database products, use just the ID
    // For fallback products, include data in URL params
    if (id.startsWith('sk') || id.startsWith('mk') || id.startsWith('hr') || id.startsWith('pf')) {
      // This is a fallback product, include data in URL
      const productData = {
        id,
        name,
        brand,
        price,
        originalPrice,
        image,
        rating,
        reviewCount,
        isNew,
        isSale,
        discount,
        description,
        size,
        skinType,
        benefits,
        inStock,
        category,
        productType,
        skinTone,
        finish,
        skinConcern,
        ingredients,
        hairType,
        hairConcern,
        hairTexture,
        fragranceFamily,
        concentration,
        season,
        crueltyFree,
        vegan,
        luxury,
        cleanBeauty,
        dermatologistRecommended,
        salonProfessional,
        heatProtection,
        longLasting,
        isTrending,
        broadSpectrum
      }

      // Remove undefined values
      const cleanData = Object.fromEntries(
        Object.entries(productData).filter(([_, value]) => value !== undefined)
      )

      // Encode the product data as URL parameters
      const params = new URLSearchParams()
      Object.entries(cleanData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          params.set(key, JSON.stringify(value))
        } else if (typeof value === 'object') {
          params.set(key, JSON.stringify(value))
        } else {
          params.set(key, String(value))
        }
      })

      return `/product/${id}?${params.toString()}`
    } else {
      // This is a database product, use just the ID
      return `/product/${id}`
    }
  }

  const productData = {
    id,
    name,
    brand,
    price,
    originalPrice,
    image,
    rating,
    reviewCount,
    isNew,
    isSale,
    discount
  }

  return (
    <>
      <div
        className="product-card   group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        
      >
        {/* Product Image */}
        <div className="relative aspect-square md:aspect-square overflow-hidden rounded-t-lg bg-gray-100">
          <Link href={getProductUrl()}>
            <img
              src={getProductImage(image)}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
              loading="lazy"
              onError={(e) => {
                // Fallback to a placeholder image if the database image fails to load
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop';
              }}
            />
          </Link>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <span className="bg-beauty-pink text-white text-xs font-medium px-2 py-1 rounded-full">
                {t('new')}
              </span>
            )}
            {/* {isSale && discount && (
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                -{discount}%
              </span>
            )} */}
          </div>

          {/* Action buttons */}
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}>
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full shadow-lg transition-colors ${
                isFavorite(id)
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-700 hover:text-red-500'
              }`}
              aria-label={isFavorite(id) ? t('removeFromFavorites') : t('addToFavorites')}
            >
              <Heart size={16} fill={isFavorite(id) ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow-lg text-gray-700 hover:text-primary-600 transition-colors"
              aria-label={t('quickView')}
            >
              <Eye size={16} />
            </button>
          </div>

          {/* Add to cart button */}
          <div className={`absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 transition-all duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}>
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              {t('addToBag', { totalPrice: price % 1 === 0 ? price.toFixed(0) : price.toFixed(2) })}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <Link href={getProductUrl()} className="block group">
            <p className="text-sm text-gray-500 mb-1">{brand}</p>
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors cursor-pointer">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(rating) 
                      ? 'text-beauty-gold fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              ({reviewCount} {t('reviews')})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-900">
              {t('birr', { price: price % 1 === 0 ? price.toFixed(0) : price.toFixed(2) })}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                {t('birr', { price: originalPrice % 1 === 0 ? originalPrice.toFixed(0) : originalPrice.toFixed(2) })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickView
        product={productData}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  )
}

export default ProductCard 