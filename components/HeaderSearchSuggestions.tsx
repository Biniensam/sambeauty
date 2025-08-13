'use client'

import React from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { useSearchSuggestions } from '@/hooks/useProducts'
import { mapApiProductToCardProps } from '@/utils/productMapper'
import { useLanguage } from './LanguageProvider'
import { getProductImage } from '@/utils/imageUtils'

interface HeaderSearchSuggestionsProps {
  query: string
  isVisible: boolean
  onClose: () => void
  onSelectSuggestion: (query: string) => void
}

const HeaderSearchSuggestions: React.FC<HeaderSearchSuggestionsProps> = ({
  query,
  isVisible,
  onClose,
  onSelectSuggestion
}) => {
  const { suggestions, loading } = useSearchSuggestions(query, 5)
  const { t } = useLanguage()

  if (!isVisible || !query.trim() || query.length < 2) {
    return null
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-b-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {loading ? t('searchingFor') : `${suggestions.length} suggestions`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={16} />
          </button>
        </div>

                 {loading && (
           <div className="space-y-2">
             {[...Array(3)].map((_, index) => (
               <div key={index} className="flex items-center space-x-3 p-2">
                 <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                 <div className="flex-1 space-y-1">
                   <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                   <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                   <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
                 </div>
               </div>
             ))}
           </div>
         )}

        {!loading && suggestions.length === 0 && (
          <div className="text-center py-4">
            <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('noResultsFound')}
            </p>
          </div>
        )}

                 {!loading && suggestions.length > 0 && (
           <div className="space-y-2">
             {suggestions.map((product) => {
               // Debug: Log image data type
               console.log('Product image data:', {
                 name: product.name,
                 imageType: typeof product.image,
                 imageLength: product.image?.length,
                 imageStart: product.image?.substring(0, 50),
                 isBase64: product.image && !product.image.startsWith('http') && !product.image.startsWith('data:')
               });
               
               return (
               <Link
                 key={product._id}
                 href={`/product/${product._id}`}
                 onClick={() => onSelectSuggestion(product.name)}
                 className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
               >
                                   <div className="flex-shrink-0">
                    <img
                      src={getProductImage(product.image)}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to a placeholder image if the database image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=48&h=48&fit=crop';
                      }}
                    />
                  </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                     {product.name}
                   </p>
                   <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                     {product.brand}
                   </p>
                   <p className="text-xs font-medium text-pink-600 dark:text-pink-400">
                     {product.price} Birr
                   </p>
                 </div>
               </Link>
               );
             })}
            
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => onSelectSuggestion(query)}
                className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-md transition-colors"
              >
                <Search className="w-4 h-4 mr-2" />
                View all results &quot;{query}&quot;
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeaderSearchSuggestions
