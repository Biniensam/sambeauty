'use client'

import React, { useState, useEffect } from 'react'
import { Star, Heart, ShoppingBag, Minus, Plus, ChevronLeft, ChevronRight, Share2, Truck, Shield, RotateCcw, Award, Sparkles, TrendingUp, Palette, Camera, Zap, Scissors, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { useCart } from './CartContext'
import { useFavorites } from './FavoritesContext'
import ProductCard from './ProductCard'
import ImageMagnifier from './ImageMagnifier'
import Link from 'next/link'
import { useLanguage } from './LanguageProvider'
import { useProductById, useRelatedProducts, useProductImages } from '@/hooks/useProducts'
import { getProductImage, getResponsiveImageUrls } from '@/utils/imageUtils'

interface ProductDetailsProps {
  productId: string
  searchParams?: { [key: string]: string | string[] | undefined }
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, searchParams }) => {
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews' | 'details'>('description')
  const [lensShape, setLensShape] = useState<'circular' | 'rectangular'>('circular')
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: number]: boolean }>({})
  const [imageErrorStates, setImageErrorStates] = useState<{ [key: number]: boolean }>({})
  const [mainImageLoading, setMainImageLoading] = useState(true)
  const [mainImageError, setMainImageError] = useState(false)
  
  const { addItem } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  
  // Fetch product from database using the hook
  const { product: dbProduct, loading: dbLoading, error: dbError } = useProductById(productId)
  
  // Fetch related products from database
  const { products: relatedProducts, loading: relatedLoading } = useRelatedProducts(productId, 4)
  
  // Parse product data from URL parameters if available
  const getProductFromParams = () => {
    if (!searchParams) return null
    
    try {
      const productData: any = {}
      
      Object.entries(searchParams).forEach(([key, value]) => {
        if (typeof value === 'string') {
          // Try to parse JSON values (arrays, objects)
          if (value.startsWith('[') || value.startsWith('{')) {
            try {
              productData[key] = JSON.parse(value)
            } catch {
              productData[key] = value
            }
          } else {
            // Handle boolean values
            if (value === 'true') productData[key] = true
            else if (value === 'false') productData[key] = false
            else if (!isNaN(Number(value))) productData[key] = Number(value)
            else productData[key] = value
          }
        }
      })
      
      return Object.keys(productData).length > 0 ? productData : null
    } catch (error) {
      console.error('Error parsing product data from URL:', error)
      return null
    }
  }
  
  // Use database product if available, otherwise fall back to URL parameters
  const urlProduct = getProductFromParams()
  const product = dbProduct || urlProduct

  // Use the new image hook for better image handling
  const { imageStates, preloadedImages, validateProductImages } = useProductImages(product || null)

  // Reset image states when product changes
  useEffect(() => {
    if (product) {
      const images = product.images || [product.image].filter(Boolean)
      const newLoadingStates: { [key: number]: boolean } = {}
      const newErrorStates: { [key: number]: boolean } = {}
      
      images.forEach((image: string, index: number) => {
        newLoadingStates[index] = true
        newErrorStates[index] = false
      })
      
      setImageLoadingStates(newLoadingStates)
      setImageErrorStates(newErrorStates)
      setMainImageLoading(true)
      setMainImageError(false)
      setSelectedImage(0)
      
      // Preload all images for better performance
      images.forEach((image: string, index: number) => {
        const img = new Image()
        img.onload = () => handleImageLoad(index)
        img.onerror = () => handleImageError(index)
        img.src = getImageSrc(image)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  // Handle image load events
  const handleImageLoad = (index: number) => {
    setImageLoadingStates(prev => ({ ...prev, [index]: false }))
    if (index === selectedImage) {
      setMainImageLoading(false)
    }
  }

  const handleImageError = (index: number) => {
    setImageLoadingStates(prev => ({ ...prev, [index]: false }))
    setImageErrorStates(prev => ({ ...prev, [index]: true }))
    if (index === selectedImage) {
      setMainImageLoading(false)
      setMainImageError(true)
    }
  }

  // Ensure images are always visible even if loading fails
  const getImageSrc = (image: string) => {
    if (!image) {
      console.warn('No image provided, using fallback')
      return getProductImage('')
    }
    
    const processedImage = getProductImage(image)
    
    // Debug logging for image processing
    if (process.env.NODE_ENV === 'development') {
      console.log(`Image processing:`, {
        original: image.substring(0, 50) + '...',
        processed: processedImage.substring(0, 50) + '...',
        isFallback: processedImage === getProductImage('')
      })
    }
    
    // If the processed image is the same as the original, it means it's a fallback
    // In that case, try to use the original image directly
    if (processedImage === getProductImage('')) {
      return image || getProductImage('')
    }
    return processedImage
  }

  // Handle main image selection
  const handleImageSelect = (index: number) => {
    setSelectedImage(index)
    setMainImageLoading(true)
    setMainImageError(false)
    
    // If the selected image is already loaded, update loading state immediately
    if (!imageLoadingStates[index] && !imageErrorStates[index]) {
      setMainImageLoading(false)
    }
  }

  // Show loading state while fetching from database
  if (dbLoading && !urlProduct) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-6 sm:py-12">
        <div className="container-responsive">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
              <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state if database fetch failed and no URL product
  if (dbError && !urlProduct) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-6 sm:py-12">
        <div className="container-responsive">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400 mb-4">Failed to load product details</p>
            <Link href="/" className="btn-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show not found state if no product is available
  if (!product) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-6 sm:py-12">
        <div className="container-responsive">
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">Product not found</p>
            <Link href="/" className="btn-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Ensure product has images array for consistency
  // Prioritize database images over URL parameters
  const productWithImages = {
    ...product,
    images: dbProduct?.images && dbProduct.images.length > 0 
      ? dbProduct.images 
      : product.images && product.images.length > 0 
        ? product.images 
        : [product.image].filter(Boolean)
  }

  const handleAddToCart = () => {
    addItem({
      id: productWithImages._id || productWithImages.id,
      name: productWithImages.name,
      brand: productWithImages.brand,
      price: productWithImages.price,
      image: getProductImage(productWithImages.images[selectedImage]),
    })
  }

  const handleToggleFavorite = () => {
    const productId = productWithImages._id || productWithImages.id
    if (isFavorite(productId)) {
      removeFavorite(productId)
    } else {
      addFavorite({
        id: productId,
        name: productWithImages.name,
        brand: productWithImages.brand,
        price: productWithImages.price,
        image: getProductImage(productWithImages.images[selectedImage]),
      })
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const nextImage = () => {
    const nextIndex = (selectedImage + 1) % productWithImages.images.length
    handleImageSelect(nextIndex)
  }

  const prevImage = () => {
    const prevIndex = (selectedImage - 1 + productWithImages.images.length) % productWithImages.images.length
    handleImageSelect(prevIndex)
  }

  const getProductTypeIcon = () => {
    switch (productWithImages.productType) {
      case 'makeup':
        return <Camera size={20} />
      case 'skincare':
        return <Zap size={20} />
      case 'hair':
        return <Scissors size={20} />
      case 'perfume':
        return <Palette size={20} />
      default:
        return <Award size={20} />
    }
  }

  const getProductTypeColor = () => {
    switch (productWithImages.productType) {
      case 'makeup':
        return 'from-pink-500 to-rose-500'
      case 'skincare':
        return 'from-blue-500 to-indigo-500'
      case 'hair':
        return 'from-emerald-500 to-teal-500'
      case 'perfume':
        return 'from-amber-500 to-orange-500'
      default:
        return 'from-purple-500 to-pink-500'
    }
  }

  const getProductTypeUrl = (productType?: string) => {
    if (!productType) return '/products'
    
    switch (productType.toLowerCase()) {
      case 'skincare':
        return '/skin-care'
      case 'makeup':
        return '/makeup'
      case 'perfume':
        return '/perfume'
      case 'hair':
        return '/hair'
      default:
        return '/products'
    }
  }

  const getProductTypeDisplayName = (productType?: string) => {
    if (!productType) return t('products')
    
    switch (productType.toLowerCase()) {
      case 'skincare':
        return t('skinCare')
      case 'makeup':
        return t('makeUp')
      case 'perfume':
        return t('Perfume')
      case 'hair':
        return t('hair')
      default:
        return t('products')
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-6 sm:py-12">
      <div className="container-responsive">
        {/* Breadcrumb */}
        <nav className="mb-6 sm:mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">{t('home')}</Link></li>
            <li>/</li>
            {productWithImages.productType && (
              <>
                <li><Link href={getProductTypeUrl(productWithImages.productType)} className="hover:text-primary-600 dark:hover:text-primary-400">{getProductTypeDisplayName(productWithImages.productType)}</Link></li>
                <li>/</li>
              </>
            )}
            {productWithImages.category && (
              <>
                <li><Link href={`${getProductTypeUrl(productWithImages.productType)}?category=${encodeURIComponent(productWithImages.category)}`} className="hover:text-primary-600 dark:hover:text-primary-400">{productWithImages.category}</Link></li>
                <li>/</li>
              </>
            )}
            <li className="text-gray-900 dark:text-gray-100">{productWithImages.name || 'Product'}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
          {/* Product Images */}
          <div className="space-y-3 sm:space-y-4">
            {/* Magnifier Style Toggle */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setLensShape('circular')}
                className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  lensShape === 'circular'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Circular Lens
              </button>
              <button
                onClick={() => setLensShape('rectangular')}
                className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  lensShape === 'rectangular'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Rectangular Lens
              </button>
            </div>
            
            <div className="relative w-full max-w-md mx-auto lg:max-w-none">
              <div className="relative aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                {/* Main Image with Loading and Error States */}
                {mainImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                  </div>
                )}
                
                {mainImageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Image failed to load</p>
                    </div>
                  </div>
                )}
                
                {/* Main Image with Magnifier */}
                <ImageMagnifier
                  src={getImageSrc(productWithImages.images[selectedImage])}
                  alt={productWithImages.name}
                  className="w-full h-full rounded-lg"
                  zoomType="hover"
                  zoomScale={3}
                  lensSize={200}
                  lensShape={lensShape}
                  showIndicator={true}
                />
                
                {/* Hidden image for load/error handling */}
                <img
                  src={getImageSrc(productWithImages.images[selectedImage])}
                  alt=""
                  className="hidden"
                  onLoad={() => handleImageLoad(selectedImage)}
                  onError={() => handleImageError(selectedImage)}
                />
                
                {/* Image navigation */}
                {productWithImages.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-colors"
                      aria-label={t('previousImage')}
                    >
                      <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-colors"
                      aria-label={t('nextImage')}
                    >
                      <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
                    </button>
                  </>
                )}

              {/* Product Type Badge */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-2">
                <div className={`bg-gradient-to-r ${getProductTypeColor()} text-white text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1`}>
                  {getProductTypeIcon()}
                  {productWithImages.productType?.toUpperCase()}
                </div>
                {productWithImages.isNew && (
                  <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {t('new')}
                  </span>
                )}
                {/* {productWithImages.isSale && productWithImages.discount && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {t('discount', { discount: productWithImages.discount })}
                  </span>
                )} */}
              </div>

              {/* Action buttons */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-2">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-full shadow-lg transition-colors ${
                    isFavorite(productWithImages._id || productWithImages.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-red-500'
                  }`}
                  aria-label={isFavorite(productWithImages._id || productWithImages.id) ? t('removeFromFavorites') : t('addToFavorites')}
                >
                  <Heart size={20} fill={isFavorite(productWithImages._id || productWithImages.id) ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={async () => {
                    const shareData = {
                      title: productWithImages.name,
                      text: `Check out this product: ${productWithImages.name}`,
                      url: window.location.href,
                    }
                    try {
                      if (navigator.share) {
                        await navigator.share(shareData)
                      } else {
                        await navigator.clipboard.writeText(shareData.url)
                        alert('Product URL copied to clipboard')
                      }
                    } catch (err) {
                      console.error('Error sharing:', err)
                      alert('Sharing failed')
                    }
                  }}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-label="Share product"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            </div>

            {/* Thumbnail images */}
            {productWithImages.images && productWithImages.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productWithImages.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors relative ${
                      selectedImage === index ? 'border-primary-600' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {/* Thumbnail Image - Always show, with loading overlay */}
                    <img
                      src={getImageSrc(image)}
                      alt={`${productWithImages.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onLoad={() => handleImageLoad(index)}
                      onError={() => handleImageError(index)}
                      loading="lazy"
                    />
                    
                    {/* Loading Overlay */}
                    {imageLoadingStates[index] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm">
                        <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                      </div>
                    )}
                    
                    {/* Error Overlay */}
                    {imageErrorStates[index] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm">
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{productWithImages.brand}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{productWithImages.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < Math.floor(productWithImages.rating)
                          ? 'text-beauty-gold fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {productWithImages.rating} ({productWithImages.reviewCount} {t('reviews')})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {t('birr', { price: productWithImages.price.toFixed(2) })}
                </span>
                {productWithImages.originalPrice && productWithImages.originalPrice > productWithImages.price && (
                  <span className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 line-through">
                    {t('birr', { price: productWithImages.originalPrice.toFixed(2) })}
                  </span>
                )}
                {/* {productWithImages.isSale && productWithImages.discount && (
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium px-2 py-1 rounded">
                    {t('save', { savings: (productWithImages.originalPrice! - productWithImages.price).toFixed(2) })}
                  </span>
                )} */}
              </div>
            </div>

            {/* Product details */}
            <div className="space-y-3 sm:space-y-4">
              {/* Size - show for all products */}
              {productWithImages.size && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('size')}:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{productWithImages.size}</span>
                </div>
              )}
              
              {/* Skin Type - show only for skincare and makeup products */}
              {productWithImages.skinType && (productWithImages.productType === 'skincare' || productWithImages.productType === 'makeup') && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('skinType')}:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {Array.isArray(productWithImages.skinType) 
                      ? productWithImages.skinType.join(', ') 
                      : productWithImages.skinType}
                  </span>
                </div>
              )}
              
              {/* Availability - show for all products */}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t('availability')}:</span>
                <span className={`font-medium px-2 py-1 rounded text-xs ${
                  (productWithImages.inStock && productWithImages.stock > 0) 
                    ? productWithImages.stock <= 10 
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 animate-pulse' 
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {(productWithImages.inStock && productWithImages.stock > 0) 
                    ? productWithImages.stock <= 10 
                      ? 'Low Stock' 
                      : t('inStock')
                    : t('outOfStock')
                  }
                </span>
              </div>
              
              {/* Stock Quantity - show if available */}
              {productWithImages.stock !== undefined && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Stock:</span>
                  <span className={`font-medium px-2 py-1 rounded text-xs ${
                    productWithImages.stock === 0 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                      : productWithImages.stock <= 10 
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 animate-pulse' 
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {productWithImages.stock === 0 
                      ? 'Out of Stock' 
                      : productWithImages.stock <= 10 
                        ? `Only ${productWithImages.stock} left!` 
                        : `${productWithImages.stock} units`
                    }
                  </span>
                </div>
              )}
              
              {/* SKU - show if available */}
              {productWithImages.sku && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">SKU:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{productWithImages.sku}</span>
                </div>
              )}
              
              {/* Brand - show for all products */}
              {productWithImages.brand && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Brand:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{productWithImages.brand}</span>
                </div>
              )}
              
              {/* Category - show for all products */}
              {productWithImages.category && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{productWithImages.category}</span>
                </div>
              )}
              
              {/* Product Status - show if available */}
              {productWithImages.status && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`font-medium px-2 py-1 rounded text-xs ${
                    productWithImages.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    productWithImages.status === 'inactive' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                    productWithImages.status === 'discontinued' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {productWithImages.status.charAt(0).toUpperCase() + productWithImages.status.slice(1)}
                  </span>
                </div>
              )}
              

            </div>

            {/* Product-specific details */}
            {productWithImages.productType === 'makeup' && (
              <div className="space-y-3">
                {productWithImages.skinTone && Array.isArray(productWithImages.skinTone) && productWithImages.skinTone.length > 0 && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Skin Tone:</span>
                    <div className="flex flex-wrap gap-1">
                      {productWithImages.skinTone.map((tone: string) => (
                        <span key={tone} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                          {tone}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {productWithImages.finish && Array.isArray(productWithImages.finish) && productWithImages.finish.length > 0 && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Finish:</span>
                    <div className="flex flex-wrap gap-1">
                      {productWithImages.finish.map((finish: string) => (
                        <span key={finish} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                          {finish}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {productWithImages.coverage && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Coverage:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{productWithImages.coverage}</span>
                  </div>
                )}
                {productWithImages.formula && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Formula:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{productWithImages.formula}</span>
                  </div>
                )}
                {productWithImages.longLasting && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Long Lasting:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Yes</span>
                  </div>
                )}
                {productWithImages.fragranceFree && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Fragrance Free:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Yes</span>
                  </div>
                )}
              </div>
            )}

            {productWithImages.productType === 'perfume' && (
              <div className="space-y-3">
                {productWithImages.fragranceFamily && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Fragrance Family:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{productWithImages.fragranceFamily}</span>
                  </div>
                )}
                {productWithImages.concentration && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Concentration:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{productWithImages.concentration}</span>
                  </div>
                )}
                {productWithImages.season && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Season:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {Array.isArray(productWithImages.season) 
                        ? productWithImages.season.join(', ') 
                        : productWithImages.season}
                    </span>
                  </div>
                )}
                {productWithImages.notes && Array.isArray(productWithImages.notes) && productWithImages.notes.length > 0 && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Fragrance Notes:</span>
                    <div className="flex flex-wrap gap-1">
                      {productWithImages.notes.map((note: string) => (
                        <span key={note} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {productWithImages.longLasting && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Long Lasting:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Yes</span>
                  </div>
                )}
                {productWithImages.luxury && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Luxury:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Yes</span>
                  </div>
                )}
              </div>
            )}

            {productWithImages.productType === 'hair' && (
              <div className="space-y-3">
                {productWithImages.hairType && Array.isArray(productWithImages.hairType) && productWithImages.hairType.length > 0 && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Hair Type:</span>
                    <div className="flex flex-wrap gap-1">
                      {productWithImages.hairType.map((type: string) => (
                        <span key={type} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {productWithImages.hairConcern && Array.isArray(productWithImages.hairConcern) && productWithImages.hairConcern.length > 0 && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Hair Concern:</span>
                    <div className="flex flex-wrap gap-1">
                      {productWithImages.hairConcern.map((concern: string) => (
                        <span key={concern} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                          {concern}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {productWithImages.hairTexture && Array.isArray(productWithImages.hairTexture) && productWithImages.hairTexture.length > 0 && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Hair Texture:</span>
                    <div className="flex flex-wrap gap-1">
                      {productWithImages.hairTexture.map((texture: string) => (
                        <span key={texture} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                          {texture}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {productWithImages.heatProtection && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Heat Protection:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Yes</span>
                  </div>
                )}
                {productWithImages.salonProfessional && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Salon Professional:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Yes</span>
                  </div>
                )}
                {productWithImages.sulfateFree && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Sulfate Free:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Yes</span>
                  </div>
                )}
              </div>
            )}

            {productWithImages.productType === 'skincare' && (
              <div className="space-y-3">
                {productWithImages.skinConcern && Array.isArray(productWithImages.skinConcern) && productWithImages.skinConcern.length > 0 && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Skin Concern:</span>
                    <div className="flex flex-wrap gap-1">
                      {productWithImages.skinConcern.map((concern: string) => (
                        <span key={concern} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                          {concern}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {productWithImages.ingredients && Array.isArray(productWithImages.ingredients) && productWithImages.ingredients.length > 0 && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Key Ingredients:</span>
                    <div className="flex flex-wrap gap-1">
                      {productWithImages.ingredients.map((ingredient: string) => (
                        <span key={ingredient} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {productWithImages.texture && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Texture:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{productWithImages.texture}</span>
                  </div>
                )}
                {productWithImages.spf && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">SPF:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{productWithImages.spf}</span>
                  </div>
                )}
                {productWithImages.dermatologistRecommended && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Dermatologist Recommended:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Yes</span>
                  </div>
                )}
                {productWithImages.cleanBeauty && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Clean Beauty:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Yes</span>
                  </div>
                )}
                {productWithImages.fragranceFree && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Fragrance Free:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Yes</span>
                  </div>
                )}
              </div>
            )}

            {/* Benefits */}
            {productWithImages.benefits && Array.isArray(productWithImages.benefits) && productWithImages.benefits.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{t('keyBenefits')}:</h3>
                <div className="flex flex-wrap gap-2">
                  {productWithImages.benefits.map((benefit: string) => (
                    <span
                      key={benefit}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-full"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Product Information */}
            <div className="space-y-3">
              {/* Product Type */}
              {productWithImages.productType && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Product Type:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {productWithImages.productType.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              )}
              
              {/* Rating and Reviews */}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < Math.floor(productWithImages.rating)
                            ? 'text-beauty-gold fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {productWithImages.rating}/5 ({productWithImages.reviewCount} reviews)
                  </span>
                </div>
              </div>
              
            
              
              
             
            </div>

            {/* Product badges */}
            <div className="flex flex-wrap gap-2">
              {productWithImages.crueltyFree && (
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                  Cruelty Free
                </span>
              )}
              {productWithImages.vegan && (
                <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
                  Vegan
                </span>
              )}
              {productWithImages.luxury && (
                <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
                  Luxury
                </span>
              )}
              {productWithImages.cleanBeauty && (
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                  Clean Beauty
                </span>
              )}
              {productWithImages.dermatologistRecommended && (
                <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">
                  Dermatologist Recommended
                </span>
              )}
              {productWithImages.salonProfessional && (
                <span className="bg-teal-100 text-teal-700 text-xs font-medium px-2 py-1 rounded-full">
                  Salon Professional
                </span>
              )}
              {productWithImages.heatProtection && (
                <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full">
                  Heat Protection
                </span>
              )}
              {productWithImages.longLasting && (
                <span className="bg-pink-100 text-pink-700 text-xs font-medium px-2 py-1 rounded-full">
                  Long Lasting
                </span>
              )}
              {productWithImages.isTrending && (
                <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                  Trending
                </span>
              )}
            </div>

            {/* Quantity selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('quantity')}</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={quantity <= 1}
                  aria-label={t('decreaseQuantity')}
                >
                  <Minus size={16} className="text-gray-700 dark:text-gray-300" />
                </button>
                <span className="w-12 text-center font-medium text-gray-900 dark:text-gray-100">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  aria-label={t('increaseQuantity')}
                >
                  <Plus size={16} className="text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!productWithImages.inStock}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 sm:py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={20} />
                {t('addToBag', { totalPrice: (productWithImages.price * quantity).toFixed(2) })}
              </button>
              
              {!productWithImages.inStock && (
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{t('outOfStockMessage')}</p>
              )}
            </div>

            {/* Trust indicators */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Truck size={16} />
                <span>{t('freeShipping')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Shield size={16} />
                <span>{t('returnPolicy')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <RotateCcw size={16} />
                <span>{t('authenticProducts')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-12 sm:mb-16">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
              {[
                { id: 'description', label: t('description') },
                { id: 'details', label: 'Product Details' },
                { id: 'ingredients', label: t('ingredients') },
                { id: 'reviews', label: t('reviews') }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{productWithImages.description}</p>
                <p className="text-gray-700 dark:text-gray-300">{t('experienceLuxuryQuality', { brand: productWithImages.brand })}</p>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Product Information */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-lg border-b border-gray-200 dark:border-gray-700 pb-2">
                      Product Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Brand:</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{productWithImages.brand}</span>
                      </div>
                      {productWithImages.category && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Category:</span>
                          <span className="text-gray-900 dark:text-gray-100 font-semibold capitalize">{productWithImages.category}</span>
                        </div>
                      )}
                      {productWithImages.size && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Size:</span>
                          <span className="text-gray-900 dark:text-gray-100 font-semibold">{productWithImages.size}</span>
                        </div>
                      )}
                      {productWithImages.sku && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">SKU:</span>
                          <span className="text-gray-900 dark:text-gray-100 font-mono text-sm">{productWithImages.sku}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Rating:</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={`${
                                  i < Math.floor(productWithImages.rating)
                                    ? 'text-beauty-gold fill-current'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-900 dark:text-gray-100 font-semibold">
                            {productWithImages.rating}/5 ({productWithImages.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Certifications & Features */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-lg border-b border-gray-200 dark:border-gray-700 pb-2">
                      Certifications & Features
                    </h4>
                    <div className="space-y-3">
                      {productWithImages.crueltyFree && (
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">Cruelty Free</span>
                        </div>
                      )}
                      {productWithImages.vegan && (
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">Vegan</span>
                        </div>
                      )}
                      {productWithImages.cleanBeauty && (
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">Clean Beauty</span>
                        </div>
                      )}
                      {productWithImages.dermatologistRecommended && (
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">Dermatologist Recommended</span>
                        </div>
                      )}
                      {productWithImages.luxury && (
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-3 h-3 bg-amber-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">Luxury</span>
                        </div>
                      )}
                      {productWithImages.salonProfessional && (
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">Salon Professional</span>
                        </div>
                      )}
                      {productWithImages.longLasting && (
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">Long Lasting</span>
                        </div>
                      )}
                      {productWithImages.fragranceFree && (
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-3 h-3 bg-teal-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">Fragrance Free</span>
                        </div>
                      )}
                      {productWithImages.sulfateFree && (
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">Sulfate Free</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Details Section */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-lg border-b border-gray-200 dark:border-gray-700 pb-2">
                    Additional Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productWithImages.productType && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Product Type:</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold capitalize">
                          {productWithImages.productType.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    )}
                    {productWithImages.status && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Status:</span>
                        <span className={`font-semibold px-2 py-1 rounded text-xs ${
                          productWithImages.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          productWithImages.status === 'inactive' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                          productWithImages.status === 'discontinued' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {productWithImages.status.charAt(0).toUpperCase() + productWithImages.status.slice(1)}
                        </span>
                      </div>
                    )}
                    {productWithImages.stock !== undefined && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Stock:</span>
                        <span className={`font-semibold px-2 py-1 rounded text-xs ${
                          productWithImages.stock === 0 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                            : productWithImages.stock <= 10 
                              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {productWithImages.stock === 0 
                            ? 'Out of Stock' 
                            : productWithImages.stock <= 10 
                              ? `Only ${productWithImages.stock} left!` 
                              : `${productWithImages.stock} units`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{t('keyIngredients')}:</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {t('water')}, {t('algaeExtract')}, {t('glycerin')}, {t('dimethicone')}, {t('cyclopentasiloxane')}, {t('butyleneGlycol')}, 
                  {t('peg100Stearate')}, {t('glycerylStearate')}, {t('cetearylAlcohol')}, {t('stearicAcid')}, {t('palmiticAcid')}, 
                  {t('glycerylDistearate')}, {t('ceteareth20')}, {t('ceteareth12')}, {t('cetylAlcohol')}, {t('dimethiconol')}, 
                  {t('cyclohexasiloxane')}, {t('lanolinAlcohol')}, {t('tocopherylSuccinate')}, {t('niacin')}, {t('sesamumIndicum')}, 
                  {t('sesameSeedOil')}, {t('eucalyptusGlobulus')}, {t('eucalyptusLeafOil')}, {t('magnesiumSulfate')}, 
                  {t('sesamumIndicumSeedOil')}, {t('medicagoSativaSeedPowder')}, {t('helianthusAnnuusSeedcake')}, {t('prunusAmygdalusDulcisSeedMeal')}, 
                  {t('sodiumGluconate')}, {t('potassiumGluconate')}, {t('copperGluconate')}, {t('calciumGluconate')}, 
                  {t('magnesiumGluconate')}, {t('zincGluconate')}, {t('silica')}, {t('tinOxide')}, {t('green5')}, {t('yellow5')}, {t('red4')}
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{productWithImages.rating}</div>
                    <div className="flex items-center justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < Math.floor(productWithImages.rating)
                              ? 'text-beauty-gold fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{productWithImages.reviewCount} {t('reviews')}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: 'Sarah M.', rating: 5, date: '2 days ago', comment: 'Absolutely love this product! My skin feels so hydrated and smooth.' },
                    { name: 'Jennifer L.', rating: 4, date: '1 week ago', comment: 'Great moisturizer, but a bit pricey. Worth it for the quality though.' },
                    { name: 'Emma R.', rating: 5, date: '2 weeks ago', comment: 'This has become my holy grail moisturizer. Perfect for my dry skin.' }
                  ].map((review, index) => (
                    <div key={index} className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{review.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i < review.rating
                                ? 'text-beauty-gold fill-current'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

                    {/* Related products */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('youMightAlsoLike')}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
            Products from the same brand and category
          </p>
          {relatedLoading ? (
            <div className="grid-responsive">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-6 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid-responsive">
              {relatedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  brand={product.brand}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={getProductImage(product.image)}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  isNew={product.isNew}
                  isSale={product.isSale}
                  discount={product.discount}
                  description={product.description}
                  size={product.size}
                  skinType={Array.isArray(product.skinType) ? product.skinType[0] : product.skinType}
                  benefits={product.benefits}
                  inStock={product.inStock}
                  category={product.category}
                  productType={product.productType}
                  skinTone={product.skinTone}
                  finish={product.finish}
                  skinConcern={product.skinConcern}
                  ingredients={product.ingredients}
                  hairType={product.hairType}
                  hairConcern={product.hairConcern}
                  hairTexture={product.hairTexture}
                  fragranceFamily={product.fragranceFamily}
                  concentration={product.concentration}
                  season={Array.isArray(product.season) ? product.season[0] : product.season}
                  crueltyFree={product.crueltyFree}
                  vegan={product.vegan}
                  luxury={product.luxury}
                  cleanBeauty={product.cleanBeauty}
                  dermatologistRecommended={product.dermatologistRecommended}
                  salonProfessional={product.salonProfessional}
                  longLasting={product.longLasting}
                  isTrending={product.isTrending}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No related products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
