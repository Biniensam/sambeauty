'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from './LanguageProvider'

interface SearchSuggestionsProps {
  onSuggestionClick?: (suggestion: string) => void
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ onSuggestionClick }) => {
  const { t } = useLanguage()

  const popularSearches = [
    'lipstick',
    'foundation', 
    'serum',
    'perfume',
    'mascara',
    'skincare',
    'hair care',
    'makeup'
  ]

  const categories = [
    { name: t('brands'), path: '/brands' },
    { name: t('skinCare'), path: '/skin-care' },
    { name: t('makeUp'), path: '/makeup' },
    { name: t('hair'), path: '/hair' },
    { name: t('Perfume'), path: '/perfume' },
    { name: t('newTrending'), path: '/new-trending' }
  ]

  const handleSuggestionClick = (suggestion: string) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion)
    } else {
      window.location.href = `/search?q=${encodeURIComponent(suggestion)}`
    }
  }

  return (
    <div className="space-y-6">
      {/* Popular Searches */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {t('searchSuggestions')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((search) => (
            <button
              key={search}
              onClick={() => handleSuggestionClick(search)}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {t('categories')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((category) => (
            <Link
              key={category.path}
              href={category.path}
              className="p-3 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchSuggestions 