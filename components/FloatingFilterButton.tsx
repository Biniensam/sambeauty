'use client'

import React from 'react'
import { Filter, X } from 'lucide-react'

interface FloatingFilterButtonProps {
  onClick: () => void
  activeFiltersCount?: number
  isOpen?: boolean
}

const FloatingFilterButton: React.FC<FloatingFilterButtonProps> = ({
  onClick,
  activeFiltersCount = 0,
  isOpen = false
}) => {
     return (
     <div className="lg:hidden fixed right-6 bottom-20 z-[55] safe-area-inset-bottom">
       <button
        onClick={onClick}
        className="flex items-center justify-center w-14 h-14 bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
        aria-label="Open filters"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <div className="relative">
            <Filter size={24} />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-pink-600 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-pink-600">
                {activeFiltersCount}
              </span>
            )}
          </div>
        )}
      </button>
    </div>
  )
}

export default FloatingFilterButton 