'use client'

import React from 'react'
import { X, Star, Heart, ShoppingBag, Minus, Plus } from 'lucide-react'
import { useCart } from './CartContext'
import { useFavorites } from './FavoritesContext'
import Link from 'next/link'
import { useLanguage } from './LanguageProvider'
import { getProductImage } from '@/utils/imageUtils'
import { getProductById, Product } from '@/services/api'

interface ProductQuickViewProps {
  product: {
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
  } | null
  isOpen: boolean
  onClose: () => void
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, isOpen, onClose }) => {
  const { addItem } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { t } = useLanguage()
  const [quantity, setQuantity] = React.useState(1)
  const [fullProduct, setFullProduct] = React.useState<Product | null>(null)
  const [loading, setLoading] = React.useState(false)

  // Fetch full product details when modal opens
  React.useEffect(() => {
    if (isOpen && product && !fullProduct) {
      const fetchProductDetails = async () => {
        setLoading(true)
        try {
          const response = await getProductById(product.id)
          if (response.success && response.data) {
            setFullProduct(response.data)
          }
        } catch (error) {
          console.error('Error fetching product details:', error)
        } finally {
          setLoading(false)
        }
      }
      
      fetchProductDetails()
    }
  }, [isOpen, product, fullProduct])

  // Reset full product data when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setFullProduct(null)
      setLoading(false)
    }
  }, [isOpen])

  if (!product || !isOpen) return null

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: getProductImage(product.image),
    })
    onClose()
  }

  const handleToggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id)
    } else {
      addFavorite({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: getProductImage(product.image),
      })
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={t('close')}
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={getProductImage(product.image)}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-beauty-pink text-white text-xs font-medium px-2 py-1 rounded-full">
                      {t('new')}
                    </span>
                  )}
                  {/* {product.isSale && product.discount && (
                    <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      -{product.discount}%
                    </span>
                  )} */}
                </div>

                {/* Favorite button */}
                <button
                  onClick={handleToggleFavorite}
                  className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-colors ${
                    isFavorite(product.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700 hover:text-red-500'
                  }`}
                  aria-label={isFavorite(product.id) ? t('removeFromFavorites') : t('addToFavorites')}
                >
                  <Heart size={20} fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">{product.name}</h2>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < Math.floor(product.rating)
                              ? 'text-beauty-gold fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.rating} ({product.reviewCount} {t('reviews')})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl font-bold text-gray-900">
                      {t('birr', { price: product.price.toFixed(2) })}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-lg text-gray-500 line-through">
                        {t('birr', { price: product.originalPrice.toFixed(2) })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">{t('quantity')}</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      disabled={quantity <= 1}
                      aria-label={t('decreaseQuantity')}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      aria-label={t('increaseQuantity')}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                  >
                    <ShoppingBag size={20} />
                    {t('addToBag', { totalPrice: (product.price * quantity).toFixed(2) })}
                  </button>
                  
                  <Link href={`/product/${product.id}`}>
                    <button 
                      onClick={onClose}
                      className="w-full btn-secondary py-3"
                    >
                      {t('viewFullDetails')}
                    </button>
                  </Link>
                </div>

                                {/* Product Description */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">{t('productDescription')}</h4>
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ) : fullProduct?.description ? (
                    <div className="space-y-3">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {fullProduct.description}
                      </p>
                      
                      {/* Benefits */}
                      {fullProduct.benefits && fullProduct.benefits.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm mb-1">Key Benefits:</h5>
                          <ul className="text-gray-600 text-sm space-y-1">
                            {fullProduct.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-beauty-pink mr-2">•</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Ingredients */}
                      {fullProduct.ingredients && fullProduct.ingredients.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm mb-1">Key Ingredients:</h5>
                          <p className="text-gray-600 text-sm">
                            {fullProduct.ingredients.join(', ')}
                          </p>
                        </div>
                      )}

                      {/* Size */}
                      {fullProduct.size && (
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm mb-1">Size:</h5>
                          <p className="text-gray-600 text-sm">{fullProduct.size}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">
                      {t('experienceLuxuryQuality', { brand: product.brand })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductQuickView 