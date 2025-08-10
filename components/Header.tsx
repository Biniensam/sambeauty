'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, ShoppingBag, User, X, Heart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from './CartContext'
import { useFavorites } from './FavoritesContext'

import ThemeToggle from './ThemeToggle'
import { useLanguage, LanguageSwitcher } from './LanguageProvider'
import HeaderSearchSuggestions from './HeaderSearchSuggestions'
import UserButton from './UserButton'

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { state: cartState } = useCart()
  const { state: favoritesState } = useFavorites()
  const { t } = useLanguage()

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setIsSearchOpen(false)
      setShowSuggestions(false)
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setShowSuggestions(value.length >= 2)
  }

  const handleSelectSuggestion = (query: string) => {
    setSearchTerm(query)
    setShowSuggestions(false)
    setIsSearchOpen(false)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const categories = [
    t('brands'), t('newTrending'), t('Perfume'), t('skinCare'), t('makeUp'), t('hair')
  ] as string[]

  // Map translated category names back to English keys for link generation
  const translatedToEnglishMap: Record<string, string> = {
    [t('brands')]: 'Brands',
    [t('skinCare')]: 'Skin Care',
    [t('makeUp')]: 'Make Up',
    [t('hair')]: 'Hair',
    [t('Perfume')]: 'Perfume',
    [t('newTrending')]: 'New & Trending',
  }

  const getCategoryLink = (category: string) => {
    const englishCategory = translatedToEnglishMap[category] || category
    switch (englishCategory) {
      case 'Brands':
        return '/brands'
      case 'Skin Care':
        return '/skin-care'
      case 'Make Up':
        return '/makeup'
      case 'Hair':
        return '/hair'
      case 'Perfume':
        return '/perfume'
      case 'New & Trending':
        return '/new-trending'
      default:
        return `/category/${englishCategory.toLowerCase().replace(/\s+/g, '-')}`
    }
  }

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 text-white text-center py-1.5 text-xs sm:text-xs font-medium tracking-wider shadow-sm select-none">
          <p className="truncate">{t('headerBanner')}</p>
        </div>

        {/* Main header */}
        <div className="container-responsive">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 min-w-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 transition-transform duration-300 hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2C10.343 2 9 3.343 9 5c0 1.657 3 7 3 7s3-5.343 3-7c0-1.657-1.343-3-3-3zM7 21h10a2 2 0 002-2v-1a2 2 0 00-2-2H7a2 2 0 00-2 2v1a2 2 0 002 2z"
                />
              </svg>
              <h1 className="text-lg sm:text-3xl font-serif font-extrabold text-pink-600 truncate select-none bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 bg-clip-text text-transparent">
                SamBeauty
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-4 xl:space-x-8">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category}
                  href={getCategoryLink(category)}
                  className="text-gray-700 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors whitespace-nowrap"
                >
                  {category}
                </Link>
              ))}
            </nav>

            {/* Right side icons and language switcher */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle (Dark Mode) */}
              <ThemeToggle />
              {/* Search Icon/Button */}
              <button
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label={isSearchOpen ? "Close search" : "Open search"}
              >
                <Search className="text-gray-500 dark:text-gray-300" size={22} />
              </button>
              {/* Language Switcher */}
              <LanguageSwitcher />
              {/* Wishlist - Desktop */}
              <Link href="/wishlist" className="hidden lg:block relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors">
                <Heart size={20} className="text-gray-700 dark:text-gray-100" fill={favoritesState.items.length > 0 ? 'currentColor' : 'none'} />
                {favoritesState.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favoritesState.items.length}
                  </span>
                )}
              </Link>

              {/* Shopping bag - Desktop */}
              <Link href="/cart" className="hidden md:block p-2 text-gray-700 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors relative">
                <ShoppingBag size={20} />
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartState.itemCount}
                  </span>
                )}
              </Link>

              {/* User account - Desktop */}
              <div className="hidden lg:block">
                <UserButton />
              </div>
            </div>
          </div>

          {/* Search bar */}
          {isSearchOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4">
              <div ref={searchRef} className="relative w-full max-w-3xl">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full pl-10 pr-12 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false)
                      setShowSuggestions(false)
                    }}
                    aria-label="Close search"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <X size={20} />
                  </button>
                </form>
                
                {/* Search Suggestions */}
                <HeaderSearchSuggestions
                  query={searchTerm}
                  isVisible={showSuggestions}
                  onClose={() => setShowSuggestions(false)}
                  onSelectSuggestion={handleSelectSuggestion}
                />
              </div>
            </div>
          )}
        </div>

      </header>
    </>
  )
}

export default Header
