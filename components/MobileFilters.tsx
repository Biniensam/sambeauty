'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Filter, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

interface FilterOption {
  label: string
  value: string
}

interface FilterGroup {
  title: string
  key: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

interface SortOption {
  label: string
  value: string
}

interface MobileFiltersProps {
  filters: FilterGroup[]
  sortOptions: SortOption[]
  sortBy: string
  onSortChange: (value: string) => void
  onApplyFilters: () => void
  onResetFilters: () => void
  isOpen: boolean
  onClose: () => void
  resultsCount?: number
  totalCount?: number
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  filters,
  sortOptions,
  sortBy,
  onSortChange,
  onApplyFilters,
  onResetFilters,
  isOpen,
  onClose,
  resultsCount,
  totalCount
}) => {
  const { t } = useLanguage()
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null)
  const [tempFilters, setTempFilters] = useState<Record<string, string>>({})
  const [tempSortBy, setTempSortBy] = useState(sortBy)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Initialize temp filters when component opens
  useEffect(() => {
    if (isOpen) {
      const initialFilters: Record<string, string> = {}
      filters.forEach(filter => {
        initialFilters[filter.key] = filter.value
      })
      setTempFilters(initialFilters)
      setTempSortBy(sortBy)
    }
  }, [isOpen, filters, sortBy])

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleFilterChange = (key: string, value: string) => {
    // Apply filter immediately when selected
    const filter = filters.find(f => f.key === key)
    if (filter) {
      filter.onChange(value)
    }
    // Update temp filters to reflect the change
    setTempFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }





  const handleResetFilters = () => {
    // Reset all filters to default and apply immediately
    filters.forEach(filter => {
      const defaultValue = filter.options[0]?.value || ''
      filter.onChange(defaultValue)
    })
    const defaultSort = sortOptions[0]?.value || 'Featured'
    onSortChange(defaultSort)
    
    // Update temp filters to reflect the reset
    const resetFilters: Record<string, string> = {}
    filters.forEach(filter => {
      resetFilters[filter.key] = filter.options[0]?.value || ''
    })
    setTempFilters(resetFilters)
    setTempSortBy(defaultSort)
  }

  const toggleFilterExpansion = (key: string) => {
    setExpandedFilter(expandedFilter === key ? null : key)
  }

  if (!isOpen) return null

     return (
     <div className="fixed inset-0 z-[60] lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />
      
             {/* Filter Panel */}
       <div 
         ref={overlayRef}
         className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl max-h-[85vh] overflow-hidden pb-32 safe-area-inset-bottom transform translate-y-[-4rem]"
       >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <SlidersHorizontal size={20} className="text-gray-600 dark:text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Filters & Sort
              </h3>
              {resultsCount !== undefined && totalCount !== undefined && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {resultsCount} of {totalCount} products
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

         {/* Content */}
         <div className="overflow-y-auto max-h-[calc(85vh-200px)] p-4">
          {/* Sort Section */}
          <div className="mb-6">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Sort by
              </h4>
            </div>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                                     <input
                     type="radio"
                     name="sortBy"
                     value={option.value}
                     checked={tempSortBy === option.value}
                     onChange={(e) => {
                       setTempSortBy(e.target.value)
                       onSortChange(e.target.value)
                     }}
                     className="text-pink-600 focus:ring-pink-500"
                   />
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Filters Section */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Filters
              </h4>
            </div>
            
            {filters.map((filter) => (
              <div key={filter.key} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <button
                  onClick={() => toggleFilterExpansion(filter.key)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-2">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {filter.title}
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {tempFilters[filter.key] || filter.options[0]?.label}
                      </p>
                    </div>

                  </div>
                  {expandedFilter === filter.key ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </button>
                
                {expandedFilter === filter.key && (
                  <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-2 pt-3">
                                             {filter.options.map((option) => (
                         <div
                           key={option.value}
                           className="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                         >
                           <label className="flex items-center gap-3 flex-1">
                             <input
                               type="radio"
                               name={filter.key}
                               value={option.value}
                               checked={tempFilters[filter.key] === option.value}
                               onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                               className="text-pink-600 focus:ring-pink-500"
                             />
                             <span className="text-sm text-gray-900 dark:text-gray-100">
                               {option.label}
                             </span>
                           </label>
                           
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

                         {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pb-6">
          <div className="flex flex-col gap-3">

            
            <div className="flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Reset All
              </button>
                             <button
                 onClick={onClose}
                 className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors shadow-sm flex items-center justify-center gap-2"
               >
                 <Filter size={16} />
                 Done
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileFilters 