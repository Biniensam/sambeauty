'use client'

import React from 'react'
import { Filter, ChevronDown } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

interface MobileFilterButtonProps {
  onClick: () => void
  activeFiltersCount?: number
  resultsCount?: number
  totalCount?: number
  className?: string
}

const MobileFilterButton: React.FC<MobileFilterButtonProps> = ({
  onClick,
  activeFiltersCount = 0,
  resultsCount,
  totalCount,
  className = ''
}) => {
  const { t } = useLanguage()

  return (
    <div className={`lg:hidden ${className}`}>
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
      >
        <Filter size={18} className="text-pink-600" />
        <span className="text-sm font-semibold">Filters & Sort</span>
        {activeFiltersCount > 0 && (
          <span className="bg-pink-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
            {activeFiltersCount}
          </span>
        )}
        <ChevronDown size={16} className="text-gray-500" />
      </button>
      
      {resultsCount !== undefined && totalCount !== undefined && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          {resultsCount} of {totalCount} products
        </p>
      )}
    </div>
  )
}

export default MobileFilterButton 