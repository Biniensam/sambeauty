'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Heart, ShoppingBag, User, Menu, X, Minus, Plus, Star, ArrowRight, LogOut, LogIn, UserPlus } from 'lucide-react'
import { useCart } from './CartContext'
import { useFavorites } from './FavoritesContext'
import { useLanguage } from './LanguageProvider'
import { getProductImage } from '@/utils/imageUtils'
import { useUser, useClerk } from '@clerk/nextjs'

const BottomNavigation = () => {
  const pathname = usePathname()
  const { state: cartState, removeItem, updateQuantity, clearCart, addItem } = useCart()
  const { state: favoritesState, removeFavorite, addFavorite, isFavorite } = useFavorites()
  const { t } = useLanguage()
  const { isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)
  const favoritesRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)

  // Close overlays when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false)
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false)
      }
      if (favoritesRef.current && !favoritesRef.current.contains(event.target as Node)) {
        setIsFavoritesOpen(false)
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity)
    }
  }

  const handleToggleFavorite = (item: any) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id)
    } else {
      addFavorite({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        image: getProductImage(item.image),
      })
    }
  }

  const categories = [
    {
      name: t('brands'),
      href: '/brands',
      icon: '🏷️',
      description: t('luxuryBeautyCollection'),
      color: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      name: t('newTrending'),
      href: '/new-trending',
      icon: '⭐',
      description: 'Latest Products',
      color: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      name: t('Perfume'),
      href: '/perfume',
      icon: '🌸',
      description: t('fragranceCollection'),
      color: 'bg-pink-50 dark:bg-pink-900/20',
      textColor: 'text-pink-600 dark:text-pink-400'
    },
    {
      name: t('skinCare'),
      href: '/skin-care',
      icon: '🧴',
      description: t('skincareEssentials'),
      color: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      name: t('makeUp'),
      href: '/makeup',
      icon: '💄',
      description: 'Makeup Collection',
      color: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      name: t('hair'),
      href: '/hair',
      icon: '💇‍♀️',
      description: t('hairCareProducts'),
      color: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
  ]

  const navItems = [
    {
      name: t('home'),
      icon: Home,
      href: '/',
      isActive: pathname === '/',
      onClick: null
    },
    {
      name: t('categories'),
      icon: Menu,
      href: '#',
      isActive: isCategoriesOpen,
      onClick: () => setIsCategoriesOpen(!isCategoriesOpen)
    },
    {
      name: t('favorites'),
      icon: Heart,
      href: '#',
      isActive: isFavoritesOpen,
      onClick: () => setIsFavoritesOpen(!isFavoritesOpen),
      badge: favoritesState.items.length > 0 ? favoritesState.items.length : undefined
    },
    {
      name: t('cart'),
      icon: ShoppingBag,
      href: '#',
      isActive: isCartOpen,
      onClick: () => setIsCartOpen(!isCartOpen),
      badge: cartState.itemCount > 0 ? cartState.itemCount : undefined
    },
    {
      name: isSignedIn ? t('account') : t('account'),
      icon: User,
      href: null,
      isActive: isAccountOpen || pathname === '/account',
      onClick: () => setIsAccountOpen(!isAccountOpen)
    }
  ]

  return (
    <>
      {/* Bottom Navigation - Mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const content = (
              <div className="relative">
                {Icon && <Icon size={20} />}
                {item.badge && item.badge > 0 && (
                  <span className={`absolute -top-2 -right-2 text-xs rounded-full h-5 w-5 flex items-center justify-center ${
                    item.name === t('favorites') 
                      ? 'bg-red-500 text-white' 
                      : 'bg-pink-600 text-white'
                  }`}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
            )

            return (
              <div key={item.name} className="relative">
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className={`flex flex-col items-center justify-center w-full py-2 px-1 relative transition-colors ${
                      item.isActive
                        ? 'text-pink-600 dark:text-pink-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400'
                    }`}
                    aria-label={item.name}
                  >
                    {content}
                    <span className="text-xs mt-1 font-medium">{item.name}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href!}
                    className={`flex flex-col items-center justify-center w-full py-2 px-1 relative transition-colors ${
                      item.isActive
                        ? 'text-pink-600 dark:text-pink-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400'
                    }`}
                    aria-label={item.name}
                  >
                    {content}
                    <span className="text-xs mt-1 font-medium">{item.name}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </div>

                 {/* Categories Menu */}
         {isCategoriesOpen && (
                       <div 
              ref={categoriesRef}
              className="absolute bottom-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-xl rounded-t-2xl max-h-[70vh] overflow-hidden"
            >
             <div className="p-4 border-b border-gray-200 dark:border-gray-700">
               <div className="flex items-center justify-between">
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                     {t('categories')}
                   </h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400">
                     Explore our beauty collections
                   </p>
                 </div>
                 <button
                   onClick={() => setIsCategoriesOpen(false)}
                   className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                 >
                   <X size={20} />
                 </button>
               </div>
             </div>

                           <div className="overflow-y-auto max-h-[50vh] p-4">
               <div className="space-y-3">
                 {categories.map((category) => (
                   <Link
                     key={category.name}
                     href={category.href}
                     onClick={() => setIsCategoriesOpen(false)}
                     className={`block p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] ${category.color} hover:shadow-md`}
                   >
                     <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${category.color} ${category.textColor}`}>
                         <span>{category.icon}</span>
                       </div>
                       <div className="flex-1">
                         <h4 className={`font-semibold text-gray-900 dark:text-gray-100 ${category.textColor}`}>
                           {category.name}
                         </h4>
                         <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                           {category.description}
                         </p>
                       </div>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center ${category.color} ${category.textColor}`}>
                         <ArrowRight size={16} />
                       </div>
                     </div>
                   </Link>
                 ))}
               </div>

                               {/* Quick Actions Section */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Quick Actions
                  </h4>
                  <div className="flex justify-center">
                    <Link
                      href="/products"
                      onClick={() => setIsCategoriesOpen(false)}
                      className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 hover:from-pink-100 hover:to-purple-100 dark:hover:from-pink-900/30 dark:hover:to-purple-900/30 transition-all duration-200"
                    >
                      <span className="text-2xl mb-2">🛍️</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-100 text-center">
                        All Products
                      </span>
                    </Link>
                  </div>
                </div>
             </div>
           </div>
         )}

        {/* Cart Overlay */}
        {isCartOpen && (
          <div 
            ref={cartRef}
            className="absolute bottom-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-xl rounded-t-2xl max-h-[70vh] overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t('cart')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cartState.itemCount} {t('items')}
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[50vh]">
              {cartState.items.length === 0 ? (
                <div className="p-6 text-center">
                  <ShoppingBag size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{t('shoppingBagEmpty')}</p>
                  <Link 
                    href="/"
                    onClick={() => setIsCartOpen(false)}
                    className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 font-medium"
                  >
                    {t('continueShopping')}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="flex gap-3">
                        <img
                          src={getProductImage(item.image)}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                                {item.name}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{item.brand}</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                {t('birr', { price: item.price.toFixed(2) })}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                                aria-label={t('removeFromCart')}
                              >
                                <X size={14} />
                              </button>
                              <button
                                onClick={() => handleToggleFavorite(item)}
                                className={`p-1 rounded ${
                                  isFavorite(item.id)
                                    ? 'bg-red-500 text-white'
                                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900'
                                }`}
                                aria-label={isFavorite(item.id) ? t('removeFromFavorites') : t('addToFavorites')}
                              >
                                <Heart size={14} fill={isFavorite(item.id) ? 'currentColor' : 'none'} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-gray-50 dark:hover:bg-gray-700"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {t('birr', { price: (item.price * item.quantity).toFixed(2) })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartState.items.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('total')}</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {t('birr', { price: (cartState.total + (cartState.total < 2000 ? 500 : 0)).toFixed(2) })}
                  </span>
                </div>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg font-medium text-center block hover:bg-pink-700 transition-colors"
                >
                  {t('checkout')}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Favorites Overlay */}
        {isFavoritesOpen && (
          <div 
            ref={favoritesRef}
            className="absolute bottom-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-xl rounded-t-2xl max-h-[70vh] overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t('favorites')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {favoritesState.items.length} {t('items')}
                  </p>
                </div>
                <button
                  onClick={() => setIsFavoritesOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[50vh]">
              {favoritesState.items.length === 0 ? (
                <div className="p-6 text-center">
                  <Heart size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{t('wishlistEmpty')}</p>
                  <Link 
                    href="/"
                    onClick={() => setIsFavoritesOpen(false)}
                    className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 font-medium"
                  >
                    {t('browseProducts')}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {favoritesState.items.map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="flex gap-3">
                        <img
                          src={getProductImage(item.image)}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                                {item.name}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{item.brand}</p>
                              
                              {/* Rating */}
                              <div className="flex items-center gap-1 mt-1">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={12}
                                      className="text-yellow-400 fill-current"
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">(4.5)</span>
                              </div>
                              
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                {t('birr', { price: item.price.toFixed(2) })}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFavorite(item.id)}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                              aria-label={t('removeFromFavorites')}
                            >
                              <X size={14} />
                            </button>
                          </div>
                          
                          <div className="flex gap-2 mt-3">
                            <button 
                              onClick={(event) => {
                                addItem({
                                  id: item.id,
                                  name: item.name,
                                  brand: item.brand,
                                  price: item.price,
                                  image: item.image,
                                })
                                // Show success feedback
                                const button = event.target as HTMLButtonElement
                                if (button) {
                                  const originalText = button.textContent
                                  button.textContent = 'Added!'
                                  button.classList.add('bg-green-600')
                                  setTimeout(() => {
                                    button.textContent = originalText
                                    button.classList.remove('bg-green-600')
                                  }, 1500)
                                }
                              }}
                              className="flex-1 bg-pink-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
                            >
                              {t('addToCart')}
                            </button>
                            <Link
                              href={`/product/${item.id}`}
                              onClick={() => setIsFavoritesOpen(false)}
                              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg text-sm font-medium text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              {t('view')}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {favoritesState.items.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Link
                  href="/wishlist"
                  onClick={() => setIsFavoritesOpen(false)}
                  className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg font-medium text-center block hover:bg-pink-700 transition-colors"
                >
                  {t('viewAllFavorites')}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Account Overlay */}
        {isAccountOpen && (
          <div 
            ref={accountRef}
            className="absolute bottom-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-xl rounded-t-2xl max-h-[70vh] overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {isSignedIn ? t('account') : t('account')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isSignedIn ? 'Manage your account' : 'Sign in or create account'}
                  </p>
                </div>
                <button
                  onClick={() => setIsAccountOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[50vh] p-4">
              {isSignedIn ? (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User size={24} className="text-pink-600 dark:text-pink-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {user?.firstName || user?.fullName || 'Welcome'}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.emailAddresses?.[0]?.emailAddress}
                    </p>
                  </div>

                  {/* Account Actions */}
                  <div className="space-y-3">
                    <Link
                      href="/account"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <User size={20} className="text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-100">Account Settings</span>
                    </Link>
                    
                    <button
                      onClick={async () => {
                        try {
                          await signOut()
                          setIsAccountOpen(false)
                        } catch (error) {
                          console.error('Error signing out:', error)
                        }
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                    >
                      <LogOut size={20} className="text-red-600 dark:text-red-400" />
                      <span className="text-red-600 dark:text-red-400">Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Sign In Option */}
                  <Link
                    href="/sign-in"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 hover:from-pink-100 hover:to-purple-100 dark:hover:from-pink-900/30 dark:hover:to-purple-900/30 transition-all duration-200"
                  >
                    <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                      <LogIn size={20} className="text-pink-600 dark:text-pink-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Sign In</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Access your account</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-400" />
                  </Link>

                  {/* Sign Up Option */}
                  <Link
                    href="/sign-up"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200"
                  >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <UserPlus size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Sign Up</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Create new account</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-400" />
                  </Link>

                  {/* Guest Info */}
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sign in to save favorites, track orders, and get personalized recommendations
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom padding to prevent content from being hidden behind bottom nav */}
      <div className="h-20 lg:hidden" />
    </>
  )
}

export default BottomNavigation 