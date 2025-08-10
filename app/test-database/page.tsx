'use client'

import React, { useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { getProductImage, getResponsiveImageUrls, validateImage } from '@/utils/imageUtils'
import { Loader2, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react'

const TestDatabasePage = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [validationResults, setValidationResults] = useState<any[]>([])
  const [validating, setValidating] = useState(false)
  
  const { products, loading, error } = useProducts({ limit: 10 })

  const handleValidateImages = async (productId: string) => {
    setValidating(true)
    const product = products.find(p => p._id === productId)
    if (!product) return

    const images = product.images || [product.image].filter(Boolean)
    const results = await Promise.all(
      images.map(async (image, index) => {
        const result = await validateImage(image)
        return { index, image, ...result }
      })
    )
    
    setValidationResults(results)
    setValidating(false)
  }

  const getImageDisplay = (imageData: string) => {
    const urls = getResponsiveImageUrls(imageData)
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-500 mb-1">Thumbnail (100x100)</p>
            <img 
              src={urls.thumbnail} 
              alt="Thumbnail" 
              className="w-16 h-16 object-cover rounded border"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Small (300x300)</p>
            <img 
              src={urls.small} 
              alt="Small" 
              className="w-16 h-16 object-cover rounded border"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Medium (600x600)</p>
            <img 
              src={urls.medium} 
              alt="Medium" 
              className="w-16 h-16 object-cover rounded border"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Large (800x800)</p>
            <img 
              src={urls.large} 
              alt="Large" 
              className="w-16 h-16 object-cover rounded border"
            />
          </div>
        </div>
        <div className="text-xs text-gray-500">
          <p>Original: {imageData.substring(0, 50)}...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-2">Loading products...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Error Loading Products</h1>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Product Image Fetching Test
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Products ({products.length})
            </h2>
            
            <div className="space-y-4">
              {products.map((product) => (
                <div 
                  key={product._id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedProduct === product._id 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedProduct(product._id)}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={getProductImage(product.image)} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.brand} • {product.images?.length || 1} image(s)
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleValidateImages(product._id)
                      }}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      disabled={validating}
                    >
                      {validating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Validate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Product Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Image Details
            </h2>
            
            {selectedProduct ? (
              <div className="space-y-6">
                {(() => {
                  const product = products.find(p => p._id === selectedProduct)
                  if (!product) return null
                  
                  const images = product.images || [product.image].filter(Boolean)
                  
                  return (
                    <>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          {product.brand} • {images.length} image(s)
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        {images.map((image, index) => (
                          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                              Image {index + 1}
                            </h4>
                            {getImageDisplay(image)}
                          </div>
                        ))}
                      </div>
                      
                      {/* Validation Results */}
                      {validationResults.length > 0 && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                            Validation Results
                          </h4>
                          <div className="space-y-2">
                            {validationResults.map((result, index) => (
                              <div key={index} className="flex items-center gap-2">
                                {result.valid ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                                <span className="text-sm">
                                  Image {result.index + 1}: {result.valid ? 'Valid' : result.error}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            ) : (
              <div className="text-center py-8">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Select a product to view image details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestDatabasePage
