'use client'

import React, { useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeContext'
import { useLanguage } from './LanguageProvider'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()

  const handleToggle = () => {
    toggleTheme()
    setIsVisible(true)
    setTimeout(() => setIsVisible(false), 1200)
  }

  return (
    <>
      <button
        onClick={handleToggle}
        className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none"
        aria-label={t('toggleTheme')}
        tabIndex={0}
      >
        {theme === 'light' ? (
          <Moon size={18} className="text-gray-700" />
        ) : (
          <Sun size={18} className="text-yellow-400" />
        )}
      </button>
      {isVisible && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-primary-500 to-beauty-pink h-1 animate-slideDown">
          <div className="h-full bg-white/20 animate-pulse"></div>
        </div>
      )}
    </>
  )
}

export default ThemeToggle 