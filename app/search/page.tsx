'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { type Product } from '@/services/api'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BottomNavigation from '@/components/BottomNavigation'
import { Search, Package } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import SearchSuggestions from '@/components/SearchSuggestions'
import { useSearchProducts } from '@/hooks/useProducts'
import { mapApiProductToCardProps } from '@/utils/productMapper'

// Component that uses useSearchParams
const SearchResultsContent = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const { products: searchResults, loading: isLoading, error } = useSearchProducts(query)
  const { t } = useLanguage()

  // Memoize the search results to prevent unnecessary re-renders
  const memoizedSearchResults = React.useMemo(() => searchResults, [searchResults])

  if (!query) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t('searchResults')}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t('enterSearchTerm')}
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <SearchSuggestions />
            </div>
          </div>
        </main>
        <Footer />
        <BottomNavigation />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Results Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t('searchResults')}
            </h1>
                         <p className="text-gray-600 dark:text-gray-400">
               {isLoading 
                 ? t('searchingFor') + ' "' + query + '"...'
                 : memoizedSearchResults.length > 0
                   ? `${memoizedSearchResults.length} ${t('resultsFoundFor')} "${query}"`
                   : `${t('noResultsFoundFor')} "${query}"`
               }
             </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            </div>
          )}

                     {/* Search Results */}
           {!isLoading && memoizedSearchResults.length > 0 && (
                           <div className="grid-responsive">
               {memoizedSearchResults.map((product) => (
                 <ProductCard 
                   key={product._id} 
                   {...mapApiProductToCardProps(product)}
                 />
               ))}
             </div>
           )}

           {/* No Results */}
           {!isLoading && memoizedSearchResults.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t('noResultsFound')}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t('tryDifferentKeywords')}
              </p>
              <div className="mt-8 max-w-2xl mx-auto">
                <SearchSuggestions />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </>
  )
}

// Loading fallback component
const SearchLoadingFallback = () => (
  <>
    <Header />
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Loading...
          </h1>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
    <BottomNavigation />
  </>
)

// Main component with Suspense boundary
const SearchResultsPage = () => {
  return (
    <Suspense fallback={<SearchLoadingFallback />}>
      <SearchResultsContent />
    </Suspense>
  )
}

export default SearchResultsPage 