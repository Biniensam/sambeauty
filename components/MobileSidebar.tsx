'use client'

import React from 'react'
import { X, User, Heart, ShoppingBag, LogOut, Settings, Package, CreditCard, HelpCircle, Star } from 'lucide-react'
import { useCart } from './CartContext'
import { useFavorites } from './FavoritesContext'
import Link from 'next/link'
import CartPage from './CartPage'
import AccountPage from '@/app/account/page'
import Accounts from './Accounts'
import { useLanguage } from './LanguageProvider'
import { getProductImage } from '@/utils/imageUtils'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  activeSection: 'account' | 'favorites' | 'cart' | 'categories' | null
  onSectionChange: (section: 'account' | 'favorites' | 'cart' | 'categories' | null) => void
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ 
  isOpen, 
  onClose, 
  activeSection, 
  onSectionChange 
}) => {
  const { state: cartState, removeItem, updateQuantity, addItem } = useCart()
  const { state: favoritesState, removeFavorite } = useFavorites()
  const { t } = useLanguage()

  if (!isOpen) return null

  const categories = [
    t('brands'),
    t('newTrending'),
    t('Perfume'),
    t('skinCare'),
    t('makeUp'),
    t('hair'),
  ]

  const getCategoryLink = (category: string) => {
    // Map translated category names back to English for routing
    const categoryMap: Record<string, string> = {
      [t('brands')]: 'brands',
      [t('skinCare')]: 'skin-care',
      [t('makeUp')]: 'makeup',
      [t('hair')]: 'hair',
      [t('Perfume')]: 'perfume',
      [t('newTrending')]: 'new-trending'
    }
    
    const englishCategory = categoryMap[category] || category.toLowerCase().replace(/\s+/g, '-')
    return `/${englishCategory}`
  }



  const renderAccountSection = () => (
    <div className="h-full">
      <Accounts />
    </div>
  )


  const renderFavoritesSection = () => (
          <div className="max-w-3xl mx-auto py-10 px-4 min-h-[60vh]">
              <h1 className="text-2xl font-bold mb-6">{t('wishlistTitle')}</h1>
              {favoritesState.items.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 mb-2">{t('wishlistEmpty')}</p>
                  <Link href="/products" className="btn-primary mt-4 inline-block">{t('browseProducts')}</Link>
                </div>
              ) : (
                <div className="grid gap-6">
                  {favoritesState.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-lg shadow p-4">
                      <img src={getProductImage(item.image)} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.brand}</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('birr', { price: item.price.toFixed(2) })}</p>
                      </div>
                      <button
                        onClick={() => removeFavorite(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-full transition-colors"
                        aria-label={t('removeFromFavorites')}
                      >
                        <X size={18} />
                      </button>
                      <button
                        onClick={() => {
                          addItem({
                            id: item.id,
                            name: item.name,
                            brand: item.brand,
                            price: item.price,
                            image: getProductImage(item.image),
                          })
                          onClose()
                          onSectionChange(null)
                        }}
                        className="btn-primary ml-2"
                      >
                                                 {t('buyNow')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
  )

  const renderCartSection = () => (
    <div className="h-full overflow-y-auto">
      <CartPage/>
    </div>
  )

  const renderCategoriesSection = () => (
    <div className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-900">{t('categories')}</h3>
      <nav className="flex flex-col space-y-2">
        {categories.map((category) => (
          <a
            key={category}
            href={getCategoryLink(category)}
            className="text-gray-700 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            onClick={onClose}
          >
            {category}
          </a>
        ))}
      </nav>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-80 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              {activeSection === 'account' && <User size={20} className="text-gray-500" />}
              {activeSection === 'favorites' && <Heart size={20} className="text-gray-500" />}
              {activeSection === 'cart' && <ShoppingBag size={20} className="text-gray-500" />}
              {activeSection === 'categories' && <Package size={20} className="text-gray-500" />}
                             <h2 className="text-lg font-semibold text-gray-900">
                 {activeSection === 'account' && t('account')}
                 {activeSection === 'favorites' && t('favorites')}
                 {activeSection === 'cart' && t('shoppingBag')}
                 {activeSection === 'categories' && t('categories')}
               </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                             aria-label={t('close')}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation tabs */}
          <div className="flex border-b">
            <button
              onClick={() => onSectionChange('account')}
              className={`p-2 rounded-full transition-colors ${
                activeSection === 'account'
                  ? 'border-2 border-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
                             aria-label={t('account')}
            >
              <User size={20} />
            </button>
            <button
              onClick={() => onSectionChange('favorites')}
              className={`p-2 rounded-full transition-colors relative ${
                activeSection === 'favorites'
                  ? 'border-2 border-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
                             aria-label={t('favorites')}
            >
              <Heart size={20} />
              {favoritesState.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoritesState.items.length}
                </span>
              )}
            </button>
            <button
              onClick={() => onSectionChange('cart')}
              className={`p-2 rounded-full transition-colors relative ${
                activeSection === 'cart'
                  ? 'border-2 border-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
                             aria-label={t('cart')}
            >
              <ShoppingBag size={20} />
              {cartState.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartState.itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onSectionChange('categories')}
              className={`p-2 rounded-full transition-colors ${
                activeSection === 'categories'
                  ? 'border-2 border-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
                             aria-label={t('categories')}
            >
              <Package size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto h-full">
            {activeSection === 'account' && renderAccountSection()}
            {activeSection === 'favorites' && renderFavoritesSection()}
            {activeSection === 'cart' && renderCartSection()}
            {activeSection === 'categories' && renderCategoriesSection()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileSidebar 