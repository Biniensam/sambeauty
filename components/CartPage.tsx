'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { X, Minus, Plus, ArrowLeft, ShoppingBag, Heart, Star, LogIn } from 'lucide-react'
import { useCart } from './CartContext'
import { useFavorites } from './FavoritesContext'
import Link from 'next/link'
import { useLanguage } from './LanguageProvider'
import { getProductImage } from '@/utils/imageUtils'
import { useUser, SignInButton } from '@clerk/nextjs'

interface CartPageProps {
  isSidebar?: boolean
}

const CartPage: React.FC<CartPageProps> = ({ isSidebar = false }) => {
  const { state: cartState, removeItem, updateQuantity, clearCart } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const router = useRouter()
  const { t } = useLanguage()
  const { isSignedIn } = useUser()

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

  const handleContinueShopping = () => {
    router.push('/')
  }

  if (cartState.items.length === 0) {
    return (
      <div className={`bg-gray-50 dark:bg-gray-900 ${isSidebar ? 'min-h-full py-4 px-2' : 'min-h-screen py-12'}`}>
        <div className={`${isSidebar ? 'max-w-full px-2' : 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
          <div className="text-center">
            <ShoppingBag size={64} className="text-gray-300 dark:text-gray-700 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('shoppingBagEmpty')}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{t('shoppingBagEmptyDescription')}</p>
            <Link href="/" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft size={20} />
              {t('continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-6 sm:py-12">
      <div className="container-responsive">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('shoppingBag')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{cartState.itemCount} {t('items')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('items')}</h2>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    {t('clearAll')}
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartState.items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={getProductImage(item.image)}
                          alt={item.name}
                          className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">{item.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">{item.brand}</p>
                            
                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className="text-beauty-gold fill-current"
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(4.5)</span>
                            </div>

                            {/* Price */}
                                                         <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                               {t('birr', { price: item.price.toFixed(2) })}
                             </p>
                          </div>

                          {/* Remove and Favorite buttons */}
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-full transition-colors"
                                                             aria-label={t('removeFromCart')}
                            >
                              <X size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleFavorite(item)}
                              className={`p-2 rounded-full transition-colors Birr {
                                isFavorite(item.id)
                                  ? 'bg-red-500 text-white'
                                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900'
                              }`}
                                                             aria-label={isFavorite(item.id) ? t('removeFromFavorites') : t('addToFavorites')}
                            >
                              <Heart size={16} fill={isFavorite(item.id) ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-3">
                                                         <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{t('quantity')}:</span>
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                disabled={item.quantity <= 1}
                                aria-label={t('decreaseQuantity')}
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-2 text-xs sm:text-sm font-medium min-w-[3rem] text-center text-gray-900 dark:text-gray-100">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                aria-label={t('increaseQuantity')}
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                                                     <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                             {t('birr', { price: (item.price * item.quantity).toFixed(2) })}
                           </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 relative sm:sticky sm:top-24">
                             <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('orderSummary')}</h2>
              
              <div className="space-y-3 mb-6">
                                 <div className="flex justify-between text-sm">
                   <span className="text-gray-600 dark:text-gray-400">{t('subtotal')} ({cartState.itemCount} {t('items')})</span>
                   <span className="font-medium">{t('birr', { price: cartState.total.toFixed(2) })}</span>
                 </div>
                                 <div className="flex justify-between text-sm">
                   <span className="text-gray-600 dark:text-gray-400">{t('shipping')}</span>
                   <span className={`font-medium ${cartState.total < 2000 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                     {cartState.total < 2000 ? t('birr', { price: '500.00' }) : 'Free'}
                   </span>
                 </div>
                {/* Removed Tax display */}
                {/* <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-medium">Birr {(cartState.total * 0.08).toFixed(2)}</span>
                </div> */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                     <div className="flex justify-between text-lg font-semibold">
                     <span>{t('total')}</span>
                     <span>{t('birr', { price: (cartState.total + (cartState.total < 2000 ? 500 : 0)).toFixed(2) })}</span>
                   </div>
                </div>
              </div>

                             {isSignedIn ? (
                               <button 
                                 onClick={() => router.push('/checkout')}
                                 className="w-full btn-primary py-3 mb-4"
                               >
                                 {t('checkout')}
                               </button>
                             ) : (
                               <SignInButton mode="modal">
                                 <button className="w-full btn-primary py-3 mb-4 flex items-center justify-center gap-2">
                                   <LogIn size={20} />
                                   Sign In to Checkout
                                 </button>
                               </SignInButton>
                             )}
               
               <button className="w-full btn-secondary py-3" onClick={handleContinueShopping}>
                 {t('continueShopping')}
               </button>

              {/* Trust indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                     <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                     <span>{t('freeShipping')}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                     <span>{t('returnPolicy')}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                     <span>{t('authenticProducts')}</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
